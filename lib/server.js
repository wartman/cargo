var _ = require('lodash')
var debug = require('debug')('Cargo:Server')
var express = require('express')
var Promise = require('bluebird')
var Logger = require('./logger')
var Base = require('./base')

// Server
// ------
// A wrapper for all server handling.
var Server = Base.extend({

  constructor: function (options, app) {
    this.super(_.defaults(options || {}, {
      'host': 'localhost',
      'port': 8080
    }))
    this.app = app
    this._connections = {}
  },

  // Set the express app the server should connect.
  setApp: function (app) {
    this.app = app
    return this
  },

  // Get the currently registered app.
  getApp: function () {
    return this.app
  },

  // Get the current HTTP server. Will be 'undefined' until
  // you run `Server#connect`
  getHttpServer: function () {
    return this.httpServer
  },

  // Register a callback to run before the provided event.
  pre: function (event, fn) {
    this.on(event + ':pre', fn)
    return this
  },

  // Register a callback to run after the provided event.
  post: function (event, fn) {
    this.on(event, ':post', fn)
    return this
  },

  // Register each new connection made.
  addConnection: function (socket) {
    var self = this
    socket._rabbitId = _.uniqueId('rabbitId')
    socket.on('close', function () {
      delete self._connections[this._rabbitId]
    })
    this._connections[socket._rabbitId] = socket
  },

  // Most browsers keep a persistent connection open to the server
  // which prevents the close callback of httpServer from returning
  // We need to destroy all connections manually
  closeConnections: function () {
    Object.keys(this._connections).forEach(function (socketId, index) {
      debug('closing socket number %s', index)
      var socket = this._connections[socketId]
      if (socket) socket.destroy()
    }.bind(this))
  },

  // Connect a provided express-app to the server.
  connect: function (app) {
    debug('connecting server')
    app || (app = this.app || express())
    var _this = this
    // Handle pre-connect stuff here? Or in the main Cargo class?
    _this.emit('connect:pre')
    var http = this.httpServer = app.listen(
      this.get('port'),
      this.get('host')
    )

    return new Promise(function (resolve) {

      http.on('error', function (err) {
        var logger = Logger.getInstance()
        if (err.errno === 'EADDRINUSE') {
          logger.logError(
            '(EADDRINUSE) cannot start Cargo',
            'cargo.Server#connect()',
            'Port ' + _this.get('port') + ' is already in use by another program. Is Cargo already running?'
          )
        } else {
          logger.logError(
            '(Code: ' + err.errno + ')',
            'cargo.Server#connect()',
            'There was an error starting your server. Please use the above code to investigate further.'
          )
        }
        _this.emit('error', err)
        process.exit(-1)
      })

      http.on('connection', function (socket) {
        debug('adding connection')
        _this.addConnection(socket)
        _this.emit('connection', socket)
      })

      http.on('listening', function () {
        // Ensure Cargo exists correctly on Ctrl-C
        process.removeAllListeners('SIGINT').on('SIGINT', function () {
          _this.disconnect().then(function () {
            debug('all connections closed')
            _this._logInfo('Server has stopped')
            process.exit(0)
          }).catch(function (err) {
            logger.logError('(Code: ' + err.errno + ')', 'cargo.Server#connect()', err.message)
            process.exit(0)
          })
        })
        // Log startup message
        _this._logInfo(
          'listening on ' + _this.get('host') + ':' + _this.get('port'),
          'Ctrl-C to shut down'
        )
        _this.emit('listening')
        resolve()
      })

    })
  },

  // Close all connections
  disconnect: function () {
    var self = this
    debug('disconnect')
    return new Promise(function (resolve) {
      if (self.httpServer === null) {
        resolve()
      } else {
        self.httpServer.close(function () {
          self.httpServer = null
          self._logInfo('Closing connections...')
          resolve()
        })
        self.closeConnections()
      }
    })
  },

  _logInfo: function (msg, help) {
    Logger.getInstance().logInfo('Cargo:Server', msg, help)
  }

})

module.exports = Server
