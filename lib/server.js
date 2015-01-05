var _ = require('lodash')
var events = require('events')
var express = require('express')
var Promise = require('bluebird')
var Logger = require('./logger')
var Set = require('./set')

// Server
// ------
// A wrapper for all server handling.
var Server = Set.extend({

  constructor: function (options) {
    // Run EventEmitter constructor
    events.EventEmitter.call(this)

    this.super({
      'host': 'localhost',
      'port': 8080
    })

    this.defineOption('app', {
      set: function (value) {
        this.app = value
      },
      get: function () {
        return this.app
      }
    })
    this.defineOption('http server', {
      set: function (value) { 
        this.httpServer = value
      },
      get: function () {
        return this.httpServer
      }
    })

    if (options) this.set(options)

    this._connections = {}
  },

  getApp: function () {
    return this.app
  },

  getHttpServer: function () {
    return this.httpServer
  },

  pre: function (event, fn) {
    this.on(event + ':pre', fn)
    return this
  },

  post: function (event, fn) {
    this.on(event, ':post', fn)
    return this
  },

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
    Object.keys(this._connections).forEach(function (socketId) {
      var socket = this._connections[socketId]
      if (socket) socket.destroy()
    }.bind(this))
  },

  // Connect the server
  connect: function () {
    if (!this.app) this.app = express()
    var app = this.getApp()
    var self = this
    // Handle pre-connect stuff here? Or in the main Rabbit class?
    self.emit('connect:pre')
    var http = this.httpServer = app.listen(
      this.get('port'),
      this.get('host')
    )
    return new Promise(function (resolve) {

      http.on('error', function (err) {
        var logger = Logger.getInstance()
        if (err.errno === 'EADDRINUSE') {
          logger.logError(
            '(EADDRINUSE) cannot start Rabbit',
            'rabbit.Server#connect()',
            'Port ' + self.get('port') + ' is already in use by another program. Is Rabbit already running?'
          )
        } else {
          logger.logError(
            '(Code: ' + err.errno + ')',
            'rabbit.Server#connect()',
            'There was an error starting your server. Please use the above code to investigate further.'
          )
        }
        self.emit('error', err)
        process.exit(-1)
      })

      http.on('connection', function (socket) {
        self.addConnection(socket)
        self.emit('connection', socket)
      })

      http.on('listening', function () {
        // Ensure Rabbit exists correctly on Ctrl-C
        process.removeAllListeners('SIGINT').on('SIGINT', function () {
          self._logInfo('Server has stopped')
          process.exit(0)
        })
        self._logInfo(
          'listening on ' + self.get('host') + ':' + self.get('port'),
          'Ctrl-C to shut down'
        )
        self.emit('listening')
        resolve()
      })

    })
  },

  // Close all connections
  disconnect: function () {
    var self = this
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
    Logger.getInstance().logInfo('Rabbit Server', msg, help)
  }

})

// Mixin node's EventEmitter
_.extend(Server.prototype, events.EventEmitter.prototype)

module.exports = Server
