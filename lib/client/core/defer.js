module(function (_) {

  _.imports('isFunction', 'isObject', 'each').from('underscore');
  _.imports('Base').from('.base');

  var root;

  if(typeof window !== 'undefined'){
    root = window
  } else {
    root = {}
  }

  /**
   * Deffered
   * --------
   * Primary promise API.
   */
  var Deffered = _.Deffered = _.Base.extend({

    constructor: function () {
      this._promise = new Promise();
    },

    /**
     * Return the promise.
     */
    promise: function(){
      return this._promise;
    },

    /**
     * Resolve the promise with the passed value.
     *
     * @param {Mixed} value
     */
    resolve: function(value){
      this._promise.isResolved() || this._promise._resolve(value);
    },

    /**
     * Reject the promise with the given reason.
     *
     * @param {Mixed} reason
     */
    reject: function(reason){
      this._promise.isResolved() || this._promise._reject(reason);
    },

    /**
     * Notify the promise with the given value.
     *
     * @param {Mixed} value
     */
    notify: function(value){
      this._promise.isResolved() || this._promise._notify(value);
    }

  });

  /**
   * Promise
   * -------
   *
   * Copied wholesale from: https://github.com/dfilatov/vow/blob/master/lib/vow.js
   *
   * @author Filatov Dmitry <dfilatov@yandex-team.ru>
   * @version 0.4.1
   * @license
   * Dual licensed under the MIT and GPL licenses:
   *   * http://www.opensource.org/licenses/mit-license.php
   *   * http://www.gnu.org/licenses/gpl.html
   */

  var PROMISE_STATUS = {
    PENDING   : 0,
    FULFILLED : 1,
    REJECTED  : -1
  };

  /**
   * The Promise class. No abilty to directly resolve or reject (use Deffered for that),
   * use if you just want someone to subscribe.
   *
   * @exports {module}
   */
  var Promise = _.Promise = _.Base.extend({

    constructor:  function (resolver) {
      var self = this;

      this._value = undefined;
      this._status = PROMISE_STATUS.PENDING;

      this._fulfilledCallbacks = [];
      this._rejectedCallbacks = [];
      this._progressCallbacks = [];

      if(_.isFunction(resolver)){
        var resolverFnLen = resolver.length;
        resolver(
          function(val){
            self.isResolved() || self._resolve(val);
          },
          resolverFnLen > 1?
            function(reason){
              self.isResolved() || self._reject(reason);
            } : undefined,
          resolverFnLen > 2?
            function(val){
              self.isResolved() || self._notify(val);
            } : undefined
        );
      }
    },

    /**
     * Return the current value.
     */
    valueOf : function(){
      return this._value;
    },

    isResolved: function(){
      return this._status !== PROMISE_STATUS.PENDING;
    },

    isFulfilled: function(){
      return this._status === PROMISE_STATUS.FULFILLED;
    },

    isRejected: function(){
      return this._status === PROMISE_STATUS.REJECTED;
    },

    /**
     * Add callbacks
     */
    then: function(onFulfilled, onRejected, onProgress, ctx){
      var defer = new Deffered();
      this._enqueue(defer, onFulfilled, onRejected, onProgress, ctx);
      return defer.promise();
    },

    /**
     * Shortcut for errors.
     */
    'catch': function(onRejected, ctx){
      return this.then(undefined, onRejected, ctx);
    },

    /**
     * Alias for catch.
     */
    fail: function(onRejected, ctx){
      return this['catch'](onRejected, ctx);
    },

    /**
     * Runs on both fulfillment and rejection.
     */
    always: function(onResolved, ctx){
      var self = this;
      var cb = function(){
        return onResolved.call(this, self);
      }
      return this.then(cb, cb, ctx);
    },

    /**
     * Run whenever the state changes, regardless of the current status
     * of the promise.
     */
    progress: function(onProgress, ctx){
      return this.then(undefined, undefined, onProgress, ctx);
    },

    done: function(onFulfilled, onRejected, onProgress, ctx){
      this
        .then(onFulfilled, onRejected, onProgress, ctx)
        .catches(throwException);
    },

    _resolve: function(val){
      if(this._status !== PROMISE_STATUS.PENDING){
        return;
      }

      if(val === this){
        this._reject('Can\'t resolve promise with itself');
        return;
      }

      if(val instanceof Promise){
        val.then(
          this._resolve,
          this._reject,
          this._notify,
          this );
        return;
      }

      if(_.isObject(val) || _.isFunction(val)){
        var then;
        try{
          then = val.then;
        } catch(e) {
          this._reject(e);
          return;
        }

        if(_.isFunction(then)){
          var self = this
            , isResolved = false;

          try {
            then.call(
              val,
              function(val){
                if(isResolved){
                  return;
                }
                isResolved = true;
                self._resolve(val);
              },
              function(reason){
                if(isResolved){
                  return;
                }
                isResolved = true;
                self._reject(reason);
              },
              function(val){
                self._notify(val);
              }
            );
          } catch(e){
            isResolved || this._reject(e);
          }

          return;
        }
      }

      this._fulfill(val);
    },

    _fulfill: function(val){
      if(this.isResolved()){
        return;
      }

      this._status = PROMISE_STATUS.FULFILLED;
      this._value = val;

      this._dispatch(this._fulfilledCallbacks, val);
      this._fulfilledCallbacks = this._rejectedCallbacks = this._progressCallbacks = undefined;
    },

    _reject: function(reason){
      if(this.isResolved()){
        return;
      }

      this._status = PROMISE_STATUS.REJECTED;
      this._value = reason;

      this._dispatch(this._rejectedCallbacks, reason);
      this._fulfilledCallbacks = this._rejectedCallbacks = this._progressCallbacks = undefined;
    },

    _notify: function(val){
      this._dispatch(this._progressCallbacks, val);
    },

    _enqueue: function(defer, onFulfilled, onRejected, onProgress, ctx){
      if(onRejected && !_.isFunction(onRejected)){
        ctx = onRejected;
        onRejected = undefined;
      }
      if(onProgress && !_.isFunction(onProgress)){
        ctx = onProgress;
        onProgress = undefined;
      }

      var cb;

      if(!this.isRejected()){
        cb = { 
          defer: defer,
          fn: _.isFunction(onFulfilled)? onFulfilled : undefined,
          ctx: ctx
        };
        this.isFulfilled()? // Then trigger right away, otherwise push.
          this._dispatch([cb], this._value) :
          this._fulfilledCallbacks.push(cb);
      }

      if(!this.isFulfilled()){
        cb = {
          defer: defer,
          fn: onRejected,
          ctx: ctx
        };
        this.isRejected()?
          this._dispatch([cb], this._value) :
          this._rejectedCallbacks.push(cb);
      }

      if(this._status === PROMISE_STATUS.PENDING){
        this._progressCallbacks.push({
          defer: defer,
          fn: onProgress,
          ctx: ctx
        });
      }
    },

    _dispatch: function(callbacks, arg){
      var len = callbacks.length;
      if(!len) return;
      var isResolved = this.isResolved();
      var isFulfilled = this.isFulfilled();

      nextTick(function(){
        var cb, defer, fn;

        _.each(callbacks, function(cb){
          defer = cb.defer;
          fn = cb.fn;

          if(fn){
            var ctx = cb.ctx
            var  res;
            try {
              res = ctx? fn.call(ctx, arg) : fn(arg);
            } catch(e) {
              defer.reject(e);
              return;
            }
            isResolved?
              defer.resolve(res) :
              defer.notify(res);
          } else {
            isResolved?
              isFulfilled?
                defer.resolve(arg) :
                defer.reject(arg)  :
              defer.notify(arg);
          }

        });

      });

    }

  });

  var nextTick = (function(){
    var fns = [];
    var enqueueFn = function(fn){
      return fns.push(fn) === 1;
    };
    var dispatchFns = function(){
      var toCall = fns
        , i = 0
        , len = fns.length;
      fns = [];
      while(i < len){
        toCall[i++]();
      }
    };

    if(typeof setImmediate !== "undefined" && _.isFunction(setImmediate)){ // ie10, node < 0.10
      return function(fn) {
        enqueueFn(fn) && setImmediate(dispatchFns);
      };
    }

    if(typeof process === "object" && process.nextTick){ // node > 0.10
      return function(fn){
        enqueueFn(fn) && process.nextTick(dispatchFns);
      }
    }

    if(root.postMessage){ // modern browsers
      var isAsync = true;
      if(root.attachEvent){
        var checkAsync = function(){
          isAsync = false;
        }
        root.attachEvent('onmessage', checkAsync);
        root.postMessage('__checkAsync', '*');
        root.detachEvent('onmessage', checkAsync);
      }

      if(isAsync){
        var msg = "__promise" + new Date
          , onMessage = function(e){
              if(e.data === msg){
                e.stopPropagation && e.stopPropagation();
                dispatchFns();
              }
            };

        root.addEventListener?
          root.addEventListener('message', onMessage, true) :
          root.attachEvent('onmessage', onMessage);

        return function(fn){
          enqueueFn(fn) && root.postMessage(msg, '*');
        }

      }
    }

    return function(fn) { // old browsers.
      enqueueFn(fn) && setTimeout(dispatchFns, 0);
    };
  })(),
  throwException = function(e){
    nextTick(function(){
      throw e;
    })
  };

  // Additional exports:
  // -------------------

  _.isPromise = function (value) {
    return isObject(value) && isFunction(value.then);
  };

  _.cast = function(value){
    return _.isPromise(value)
      ? value
      : _.resolve(value);
  };

  _.when = function(value, onFulfilled, onRejected, onProgress, ctx){
    return _.cast(value).then(onFulfilled, onRejected, onProgress, ctx);
  };

  _.resolve = function(value){
    var res = new Deffered();
    res.resolve(value);
    return res.promise();
  };

});