/* NEXA.js <Rostrum> v2024.06.25 */
/* Learn more at → https://nexajs.org/pkg/rostrum */
var Rostrum = (function (exports) {
  'use strict';

  var domain;

  // This constructor is used to store event handlers. Instantiating this is
  // faster than explicitly calling `Object.create(null)` to get a "clean" empty
  // object (tested with v8 v4.9).
  function EventHandlers() {}
  EventHandlers.prototype = Object.create(null);

  function EventEmitter() {
    EventEmitter.init.call(this);
  }

  // nodejs oddity
  // require('events') === require('events').EventEmitter
  EventEmitter.EventEmitter = EventEmitter;

  EventEmitter.usingDomains = false;

  EventEmitter.prototype.domain = undefined;
  EventEmitter.prototype._events = undefined;
  EventEmitter.prototype._maxListeners = undefined;

  // By default EventEmitters will print a warning if more than 10 listeners are
  // added to it. This is a useful default which helps finding memory leaks.
  EventEmitter.defaultMaxListeners = 10;

  EventEmitter.init = function() {
    this.domain = null;
    if (EventEmitter.usingDomains) {
      // if there is an active domain, then attach to it.
      if (domain.active ) ;
    }

    if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
      this._events = new EventHandlers();
      this._eventsCount = 0;
    }

    this._maxListeners = this._maxListeners || undefined;
  };

  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.
  EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
    if (typeof n !== 'number' || n < 0 || isNaN(n))
      throw new TypeError('"n" argument must be a positive number');
    this._maxListeners = n;
    return this;
  };

  function $getMaxListeners(that) {
    if (that._maxListeners === undefined)
      return EventEmitter.defaultMaxListeners;
    return that._maxListeners;
  }

  EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
    return $getMaxListeners(this);
  };

  // These standalone emit* functions are used to optimize calling of event
  // handlers for fast cases because emit() itself often has a variable number of
  // arguments and can be deoptimized because of that. These functions always have
  // the same number of arguments and thus do not get deoptimized, so the code
  // inside them can execute faster.
  function emitNone(handler, isFn, self) {
    if (isFn)
      handler.call(self);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].call(self);
    }
  }
  function emitOne(handler, isFn, self, arg1) {
    if (isFn)
      handler.call(self, arg1);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].call(self, arg1);
    }
  }
  function emitTwo(handler, isFn, self, arg1, arg2) {
    if (isFn)
      handler.call(self, arg1, arg2);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].call(self, arg1, arg2);
    }
  }
  function emitThree(handler, isFn, self, arg1, arg2, arg3) {
    if (isFn)
      handler.call(self, arg1, arg2, arg3);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].call(self, arg1, arg2, arg3);
    }
  }

  function emitMany(handler, isFn, self, args) {
    if (isFn)
      handler.apply(self, args);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].apply(self, args);
    }
  }

  EventEmitter.prototype.emit = function emit(type) {
    var er, handler, len, args, i, events, domain;
    var doError = (type === 'error');

    events = this._events;
    if (events)
      doError = (doError && events.error == null);
    else if (!doError)
      return false;

    domain = this.domain;

    // If there is no 'error' event listener then throw.
    if (doError) {
      er = arguments[1];
      if (domain) {
        if (!er)
          er = new Error('Uncaught, unspecified "error" event');
        er.domainEmitter = this;
        er.domain = domain;
        er.domainThrown = false;
        domain.emit('error', er);
      } else if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
      return false;
    }

    handler = events[type];

    if (!handler)
      return false;

    var isFn = typeof handler === 'function';
    len = arguments.length;
    switch (len) {
      // fast cases
      case 1:
        emitNone(handler, isFn, this);
        break;
      case 2:
        emitOne(handler, isFn, this, arguments[1]);
        break;
      case 3:
        emitTwo(handler, isFn, this, arguments[1], arguments[2]);
        break;
      case 4:
        emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
        break;
      // slower
      default:
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        emitMany(handler, isFn, this, args);
    }

    return true;
  };

  function _addListener(target, type, listener, prepend) {
    var m;
    var events;
    var existing;

    if (typeof listener !== 'function')
      throw new TypeError('"listener" argument must be a function');

    events = target._events;
    if (!events) {
      events = target._events = new EventHandlers();
      target._eventsCount = 0;
    } else {
      // To avoid recursion in the case that type === "newListener"! Before
      // adding it to the listeners, first emit "newListener".
      if (events.newListener) {
        target.emit('newListener', type,
                    listener.listener ? listener.listener : listener);

        // Re-assign `events` because a newListener handler could have caused the
        // this._events to be assigned to a new object
        events = target._events;
      }
      existing = events[type];
    }

    if (!existing) {
      // Optimize the case of one listener. Don't need the extra array object.
      existing = events[type] = listener;
      ++target._eventsCount;
    } else {
      if (typeof existing === 'function') {
        // Adding the second element, need to change to array.
        existing = events[type] = prepend ? [listener, existing] :
                                            [existing, listener];
      } else {
        // If we've already got an array, just append.
        if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }
      }

      // Check for listener leak
      if (!existing.warned) {
        m = $getMaxListeners(target);
        if (m && m > 0 && existing.length > m) {
          existing.warned = true;
          var w = new Error('Possible EventEmitter memory leak detected. ' +
                              existing.length + ' ' + type + ' listeners added. ' +
                              'Use emitter.setMaxListeners() to increase limit');
          w.name = 'MaxListenersExceededWarning';
          w.emitter = target;
          w.type = type;
          w.count = existing.length;
          emitWarning(w);
        }
      }
    }

    return target;
  }
  function emitWarning(e) {
    typeof console.warn === 'function' ? console.warn(e) : console.log(e);
  }
  EventEmitter.prototype.addListener = function addListener(type, listener) {
    return _addListener(this, type, listener, false);
  };

  EventEmitter.prototype.on = EventEmitter.prototype.addListener;

  EventEmitter.prototype.prependListener =
      function prependListener(type, listener) {
        return _addListener(this, type, listener, true);
      };

  function _onceWrap(target, type, listener) {
    var fired = false;
    function g() {
      target.removeListener(type, g);
      if (!fired) {
        fired = true;
        listener.apply(target, arguments);
      }
    }
    g.listener = listener;
    return g;
  }

  EventEmitter.prototype.once = function once(type, listener) {
    if (typeof listener !== 'function')
      throw new TypeError('"listener" argument must be a function');
    this.on(type, _onceWrap(this, type, listener));
    return this;
  };

  EventEmitter.prototype.prependOnceListener =
      function prependOnceListener(type, listener) {
        if (typeof listener !== 'function')
          throw new TypeError('"listener" argument must be a function');
        this.prependListener(type, _onceWrap(this, type, listener));
        return this;
      };

  // emits a 'removeListener' event iff the listener was removed
  EventEmitter.prototype.removeListener =
      function removeListener(type, listener) {
        var list, events, position, i, originalListener;

        if (typeof listener !== 'function')
          throw new TypeError('"listener" argument must be a function');

        events = this._events;
        if (!events)
          return this;

        list = events[type];
        if (!list)
          return this;

        if (list === listener || (list.listener && list.listener === listener)) {
          if (--this._eventsCount === 0)
            this._events = new EventHandlers();
          else {
            delete events[type];
            if (events.removeListener)
              this.emit('removeListener', type, list.listener || listener);
          }
        } else if (typeof list !== 'function') {
          position = -1;

          for (i = list.length; i-- > 0;) {
            if (list[i] === listener ||
                (list[i].listener && list[i].listener === listener)) {
              originalListener = list[i].listener;
              position = i;
              break;
            }
          }

          if (position < 0)
            return this;

          if (list.length === 1) {
            list[0] = undefined;
            if (--this._eventsCount === 0) {
              this._events = new EventHandlers();
              return this;
            } else {
              delete events[type];
            }
          } else {
            spliceOne(list, position);
          }

          if (events.removeListener)
            this.emit('removeListener', type, originalListener || listener);
        }

        return this;
      };
      
  // Alias for removeListener added in NodeJS 10.0
  // https://nodejs.org/api/events.html#events_emitter_off_eventname_listener
  EventEmitter.prototype.off = function(type, listener){
      return this.removeListener(type, listener);
  };

  EventEmitter.prototype.removeAllListeners =
      function removeAllListeners(type) {
        var listeners, events;

        events = this._events;
        if (!events)
          return this;

        // not listening for removeListener, no need to emit
        if (!events.removeListener) {
          if (arguments.length === 0) {
            this._events = new EventHandlers();
            this._eventsCount = 0;
          } else if (events[type]) {
            if (--this._eventsCount === 0)
              this._events = new EventHandlers();
            else
              delete events[type];
          }
          return this;
        }

        // emit removeListener for all listeners on all events
        if (arguments.length === 0) {
          var keys = Object.keys(events);
          for (var i = 0, key; i < keys.length; ++i) {
            key = keys[i];
            if (key === 'removeListener') continue;
            this.removeAllListeners(key);
          }
          this.removeAllListeners('removeListener');
          this._events = new EventHandlers();
          this._eventsCount = 0;
          return this;
        }

        listeners = events[type];

        if (typeof listeners === 'function') {
          this.removeListener(type, listeners);
        } else if (listeners) {
          // LIFO order
          do {
            this.removeListener(type, listeners[listeners.length - 1]);
          } while (listeners[0]);
        }

        return this;
      };

  EventEmitter.prototype.listeners = function listeners(type) {
    var evlistener;
    var ret;
    var events = this._events;

    if (!events)
      ret = [];
    else {
      evlistener = events[type];
      if (!evlistener)
        ret = [];
      else if (typeof evlistener === 'function')
        ret = [evlistener.listener || evlistener];
      else
        ret = unwrapListeners(evlistener);
    }

    return ret;
  };

  EventEmitter.listenerCount = function(emitter, type) {
    if (typeof emitter.listenerCount === 'function') {
      return emitter.listenerCount(type);
    } else {
      return listenerCount.call(emitter, type);
    }
  };

  EventEmitter.prototype.listenerCount = listenerCount;
  function listenerCount(type) {
    var events = this._events;

    if (events) {
      var evlistener = events[type];

      if (typeof evlistener === 'function') {
        return 1;
      } else if (evlistener) {
        return evlistener.length;
      }
    }

    return 0;
  }

  EventEmitter.prototype.eventNames = function eventNames() {
    return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
  };

  // About 1.5x faster than the two-arg version of Array#splice().
  function spliceOne(list, index) {
    for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
      list[i] = list[k];
    list.pop();
  }

  function arrayClone(arr, i) {
    var copy = new Array(i);
    while (i--)
      copy[i] = arr[i];
    return copy;
  }

  function unwrapListeners(arr) {
    var ret = new Array(arr.length);
    for (var i = 0; i < ret.length; ++i) {
      ret[i] = arr[i].listener || arr[i];
    }
    return ret;
  }

  // Unique ID creation requires a high quality random # generator. In the browser we therefore
  // require the crypto API and do not support built-in fallback to lower quality random number
  // generators (like Math.random()).
  let getRandomValues;
  const rnds8 = new Uint8Array(16);
  function rng() {
    // lazy load so that environments that need to polyfill have a chance to do so
    if (!getRandomValues) {
      // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
      getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);

      if (!getRandomValues) {
        throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
      }
    }

    return getRandomValues(rnds8);
  }

  /**
   * Convert array of 16 byte values to UUID string format of the form:
   * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
   */

  const byteToHex = [];

  for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 0x100).toString(16).slice(1));
  }

  function unsafeStringify(arr, offset = 0) {
    // Note: Be careful editing this code!  It's been tuned for performance
    // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
    return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
  }

  const randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
  var native = {
    randomUUID
  };

  function v4(options, buf, offset) {
    if (native.randomUUID && !buf && !options) {
      return native.randomUUID();
    }

    options = options || {};
    const rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

    rnds[6] = rnds[6] & 0x0f | 0x40;
    rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

    return unsafeStringify(rnds);
  }

  /* Import modules. */

  /**
   * Make Request
   */
  function makeRequest (_request, _id, _callback) {
      /* Generate a new (request) id. */
      const id = _id || v4();

      /* Set method. */
      const method = _request.method;

      /* Set parameters. */
      const params = _request.params;

      /* Create request. */
      const request = {
          id,
          method,
          params,
      };

      /* Validate Rostrum (module) status. */
      // if (this._connMgr?.isReady && this._connMgr?.isOpen) {
      if (this._connMgr?.isReady) {
          /* Validate connection. */
          if (
              this._connMgr.status[0].isOpen ||
              this._connMgr.status[1].isOpen ||
              this._connMgr.status[2].isOpen
          ) {
              for (let i = 0; i < this._connMgr.pool.length; i++) {
                  if (this._connMgr.status[i].isOpen) {
                      /* Send request. */
                      this._connMgr.pool[i]
                          .send(JSON.stringify(request) + '\n'); // NOTE: We MUST include the "new line".
                      // console.log('SENT REQUEST', i, request)
                  }
              }
          } else {
              /* Add new request. */
              this._requestQueue.push(request);
              // console.log('ADDED REQUEST TO QUEUE', request)
          }
      } else {
          /* Add new request. */
          this._requestQueue.push(request);
          // console.log('ADDED REQUEST TO QUEUE', request)
      }

      const self = this;

      /* Return a promise. */
      return new Promise(function (_resolve, _reject) {
          /* Initialize (request) promise. */
          self._connMgr.requests[id] = {};

          /* Set resolve. */
          self._connMgr.requests[id].callback = _callback;

          /* Set resolve. */
          self._connMgr.requests[id].resolve = _resolve;

          /* Set reject. */
          self._connMgr.requests[id].reject = _reject;

          /* Set (connection) ready flag. */
          self._connMgr.isReady = true;
      })
  }

  /* Import modules. */

  /**
   * (Blockchain) Address Balance
   *
   * Return the confirmed and unconfirmed balances of a Bitcoin Cash address.
   *
   * Version added: 1.4.3
   */
  async function _getAddressBalance (_address, _filter = 'include_tokens') {
      /* Initialize locals. */
      let method;
      let params;
      let request;
      let rostrum;

      /* Validate instance. */
      if (typeof this === 'undefined') {
          /* Initialize Rostrum instance. */
          rostrum = await Rostrum.init();

          /* Call self (via instance). */
          return rostrum.getAddressBalance(_address, _filter)
      }

      /* Set method. */
      method = 'blockchain.address.get_balance';

      /* Set parameters. */
      params = [
          _address,
          _filter, // NOTE: Filter what utxos are included in the query.
      ];

      /* Build request. */
      request = {
          method,
          params,
      };

      /* Return (async) request. */
      return makeRequest.bind(this)(request)
  }

  /* Import modules. */

  /**
   * (Blockchain) Decode Remote Address
   *
   * Decode a Bitcoin Cash or a Nexa address to its raw payload. This method is
   * potentially useful for clients needing to see the encoded contents of a
   * address but lacking the local libraries necessary to decode them.
   *
   * Version added: Rostrum 7.0
   */
  async function _decodeRemoteAddress (_address) {
      /* Initialize locals. */
      let method;
      let params;
      let request;
      let rostrum;

      /* Validate instance. */
      if (typeof this === 'undefined') {
          /* Initialize Rostrum instance. */
          rostrum = await Rostrum.init();

          /* Call self (via instance). */
          return rostrum.decodeRemoteAddress(_address)
      }

      /* Set method. */
      method = 'blockchain.address.decode';

      /* Set parameters. */
      params = [ _address ];

      /* Build request. */
      request = {
          method,
          params,
      };

      /* Return (async) request. */
      return makeRequest.bind(this)(request)
  }

  /* Import modules. */

  /**
   * (Blockchain) Address First Use
   *
   * Returns a first occurance of usage of scripthash as ouput on the blockchain.
   *
   * Version added: Rostrum 1.2
   */
  async function _getAddressFirstUse (_address, _filter = 'include_tokens') {
      /* Initialize locals. */
      let method;
      let params;
      let request;
      let rostrum;

      /* Validate instance. */
      if (typeof this === 'undefined') {
          /* Initialize Rostrum instance. */
          rostrum = await Rostrum.init();

          /* Call self (via instance). */
          return rostrum.getAddressFirstUse(_address, _filter)
      }

      /* Set method. */
      method = 'blockchain.address.get_first_use';

      /* Set parameters. */
      params = [
          _address,
          _filter,
      ];

      /* Build request. */
      request = {
          method,
          params,
      };

      /* Return (async) request. */
      return makeRequest.bind(this)(request)
  }

  /* Import modules. */

  /**
   * (Blockchain) Address History
   *
   * Return the confirmed and unconfirmed history of a Bitcoin Cash
   * or Nexa address.
   *
   * Version added: Rostrum 1.4.3
   */
  async function _getAddressHistory (_address, _filter = 'include_tokens') {
      /* Initialize locals. */
      let method;
      let params;
      let request;
      let rostrum;

      /* Validate instance. */
      if (typeof this === 'undefined') {
          /* Initialize Rostrum instance. */
          rostrum = await Rostrum.init();

          /* Call self (via instance). */
          return rostrum.getAddressHistory(_address, _filter)
      }

      /* Set method. */
      method = 'blockchain.address.get_history';

      /* Set parameters. */
      params = [
          _address,
          _filter,
      ];

      /* Build request. */
      request = {
          method,
          params,
      };

      /* Return (async) request. */
      return makeRequest.bind(this)(request)
  }

  /* Import modules. */

  /**
   * (Blockchain) Address History
   *
   * Return the unconfirmed transactions of a Bitcoin Cash or Nexa address.
   *
   * Version added: Rostrum 1.4.3
   */
  async function _getAddressMempool (_address, _filter = 'include_tokens') {
      /* Initialize locals. */
      let method;
      let params;
      let request;
      let rostrum;

      /* Validate instance. */
      if (typeof this === 'undefined') {
          /* Initialize Rostrum instance. */
          rostrum = await Rostrum.init();

          /* Call self (via instance). */
          return rostrum.getAddressMempool(_address, _filter)
      }

      /* Set method. */
      method = 'blockchain.address.get_mempool';

      /* Set parameters. */
      params = [
          _address,
          _filter,
      ];

      /* Build request. */
      request = {
          method,
          params,
      };

      /* Return (async) request. */
      return makeRequest.bind(this)(request)
  }

  /* Import modules. */

  /**
   * (Blockchain) Address Script Hash
   *
   * Translate a Bitcoin Cash or a Nexa address to a script hash. This method is
   * potentially useful for clients preferring to work with script hashes but
   * lacking the local libraries necessary to generate them.
   *
   * Version added: Rostrum 1.4.3
   */
  async function _getAddressScriptHash (_address) {
      /* Initialize locals. */
      let method;
      let params;
      let request;
      let rostrum;

      /* Validate instance. */
      if (typeof this === 'undefined') {
          /* Initialize Rostrum instance. */
          rostrum = await Rostrum.init();

          /* Call self (via instance). */
          return rostrum.getAddressScriptHash(_address)
      }

      /* Set method. */
      method = 'blockchain.address.get_scripthash';

      /* Set parameters. */
      params = [ _address ];

      /* Build request. */
      request = {
          method,
          params,
      };

      /* Return (async) request. */
      return makeRequest.bind(this)(request)
  }

  /* Import modules. */

  /**
   * (Blockchain) Address List Unspent
   *
   * Return an ordered list of UTXOs sent to a Bitcoin Cash or Nexa address.
   *
   * Version added: Rostrum 1.4.3
   */
  async function _getAddressUnspent (_address) {
      /* Initialize locals. */
      let method;
      let params;
      let request;
      let rostrum;

      /* Validate instance. */
      if (typeof this === 'undefined') {
          /* Initialize Rostrum instance. */
          rostrum = await Rostrum.init();

          /* Call self (via instance). */
          return rostrum.getAddressUnspent(_address)
      }

      /* Set method. */
      method = 'blockchain.address.listunspent';

      /* Set parameters. */
      params = [
          _address
      ];

      /* Build request. */
      request = {
          method,
          params,
      };

      /* Return (async) request. */
      return makeRequest.bind(this)(request)
  }

  /* Import modules. */

  /**
   * (Blockchain) Get Block (Info)
   *
   * Return an the FULL block details.
   *
   * Version added: Rostrum 8.1
   */
  async function _getBlock (_hash_or_height) {
      /* Initialize locals. */
      let method;
      let params;
      let request;
      let rostrum;

      /* Validate instance. */
      if (typeof this === 'undefined') {
          /* Initialize Rostrum instance. */
          rostrum = await Rostrum.init();

          /* Call self (via instance). */
          return rostrum.getBlock(_hash_or_height)
      }

      /* Set method. */
      method = 'blockchain.block.get';

      /* Set parameters. */
      params = [ _hash_or_height ];

      /* Build request. */
      request = {
          method,
          params,
      };

      /* Return (async) request. */
      return makeRequest.bind(this)(request)
  }

  /* Import modules. */

  /**
   * (Blockchain) Get Transaction (Info)
   *
   * Return an the FULL transaction details.
   *
   * Version added: ??
   */
  async function _getTransaction (_id, _verbose = true) {
      /* Initialize locals. */
      let method;
      let params;
      let request;
      let rostrum;

      /* Validate instance. */
      if (typeof this === 'undefined') {
          /* Initialize Rostrum instance. */
          rostrum = await Rostrum.init();

          /* Call self (via instance). */
          return rostrum.getTransaction(_id)
      }

      /* Set method. */
      method = 'blockchain.transaction.get';

      /* Set parameters. */
      params = [
          _id,
          _verbose,
      ];

      /* Build request. */
      request = {
          method,
          params,
      };

      /* Return (async) request. */
      return makeRequest.bind(this)(request)
  }

  /* Import modules. */

  /**
  * (Token) Address Balance
  *
  * Return the confirmed and unconfirmed balances of tokens in a Bitcoin Cash or Nexa address.
  *
  * Version added: Rostrum 6.0
  */
  async function _getAddressTokenBalance (_address, _cursor, _tokenid) {
      /* Initialize locals. */
      let method;
      let params;
      let request;
      let rostrum;

      /* Validate instance. */
      if (typeof this === 'undefined') {
          /* Initialize Rostrum instance. */
          rostrum = await Rostrum.init();

          /* Call self (via instance). */
          return rostrum.getAddressTokenBalance(_address, _cursor, _tokenid)
      }

      /* Set method. */
      method = 'token.address.get_balance';

      /* Set parameters. */
      if (_cursor) {
          params = [
              _address,
              _cursor,
              _tokenid,
          ];
      } else {
          params = [
              _address,
              _tokenid,
          ];
      }

      /* Build request. */
      request = {
          method,
          params,
      };

      /* Return (async) request. */
      return makeRequest.bind(this)(request)
  }

  /* Import modules. */

  /**
  * (Token) Address History
  *
  * Return the confirmed and unconfirmed token history of a Nexa or Bitcoin Cash address.
  *
  * Version added: Rostrum 6.0
  */
  async function _getAddressTokenHistory (_address, _cursor, _tokenid) {
      /* Initialize locals. */
      let method;
      let params;
      let request;
      let rostrum;

      /* Validate instance. */
      if (typeof this === 'undefined') {
          /* Initialize Rostrum instance. */
          rostrum = await Rostrum.init();

          /* Call self (via instance). */
          return rostrum.getAddressTokenHistory(_address, _cursor, _tokenid)
      }

      /* Set method. */
      method = 'token.address.get_history';

      /* Set parameters. */
      if (_cursor) {
          params = [
              _address,
              _cursor,
              _tokenid,
          ];
      } else {
          params = [
              _address,
              _tokenid,
          ];
      }

      /* Build request. */
      request = {
          method,
          params,
      };

      /* Return (async) request. */
      return makeRequest.bind(this)(request)
  }

  /* Import modules. */

  /**
  * (Token) Address Mempool
  *
  * Return the unconfirmed token transactions of a Nexa or Bitcoin Cash address.
  *
  * Version added: Rostrum 6.0
  */
  async function _getAddressTokenMempool (_address, _cursor, _tokenid) {
      /* Initialize locals. */
      let method;
      let params;
      let request;
      let rostrum;

      /* Validate instance. */
      if (typeof this === 'undefined') {
          /* Initialize Rostrum instance. */
          rostrum = await Rostrum.init();

          /* Call self (via instance). */
          return rostrum.getAddressTokenMempool(_address, _cursor, _tokenid)
      }

      /* Set method. */
      method = 'token.address.get_mempool';

      /* Set parameters. */
      if (_cursor) {
          params = [
              _address,
              _cursor,
              _tokenid,
          ];
      } else {
          params = [
              _address,
              _tokenid,
          ];
      }

      /* Build request. */
      request = {
          method,
          params,
      };

      /* Return (async) request. */
      return makeRequest.bind(this)(request)
  }

  /* Import modules. */

  /**
  * (Token) Address Unspent
  *
  * Return an list of token UTXOs sent to a Nexa or Bitcoin Cash address.
  *
  * Version added: Rostrum 6.0
  */
  async function _getAddressTokenUnspent (_address, _cursor, _tokenid) {
      /* Initialize locals. */
      let method;
      let params;
      let request;
      let rostrum;

      /* Validate instance. */
      if (typeof this === 'undefined') {
          /* Initialize Rostrum instance. */
          rostrum = await Rostrum.init();

          /* Call self (via instance). */
          return rostrum.getAddressTokenUnspent(_address, _cursor, _tokenid)
      }

      /* Set method. */
      method = 'token.address.listunspent';

      /* Set parameters. */
      if (_cursor) {
          params = [
              _address,
              _cursor,
              _tokenid,
          ];
      } else {
          params = [
              _address,
              _tokenid,
          ];
      }

      /* Build request. */
      request = {
          method,
          params,
      };

      /* Return (async) request. */
      return makeRequest.bind(this)(request)
  }

  /* Import modules. */

  /**
   * (NFT) List
   *
   * Return list of all NFT's minted from a specified parent token.
   *
   * Version added: Rostrum 7.0
   */
  async function _getNftList (_tokenid, _cursor) {
      /* Initialize locals. */
      let method;
      let params;
      let request;
      let rostrum;

      /* Validate instance. */
      if (typeof this === 'undefined') {
          /* Initialize Rostrum instance. */
          rostrum = await Rostrum.init();

          /* Call self (via instance). */
          return rostrum.getNftList(_tokenid, _cursor)
      }

      /* Set method. */
      method = 'token.nft.list';

      /* Set parameters. */
      if (_cursor) {
          params = [
              _tokenid,
              _cursor,
          ];
      } else {
          params = [ _tokenid ];
      }

      /* Build request. */
      request = {
          method,
          params,
      };

      /* Return (async) request. */
      return makeRequest.bind(this)(request)
  }

  /* Import modules. */

  /**
   * (Blockchain) Get Outpoint (Info)
   *
   * Returns data on a specified output of specific transaction. Returns error if
   * transaction or output does not exist.
   *
   * If the output is spent, information about the spender is provided. This
   * allows a SPV client to call blockchain.transaction.get\_merkle to generate a
   * merkle branch, proving that it is spent.
   *
   * Version added: Rostrum 7.0
   *
   * Update Rostrum 8.1: Add group details and scriptpukey
   */
  async function _getOutpoint (_outpoint_hash) {
      /* Initialize locals. */
      let method;
      let params;
      let request;
      let rostrum;

      /* Validate instance. */
      if (typeof this === 'undefined') {
          /* Initialize Rostrum instance. */
          rostrum = await Rostrum.init();

          /* Call self (via instance). */
          return rostrum.getOutpoint(_outpoint_hash)
      }

      /* Set method. */
      method = 'blockchain.utxo.get';

      /* Set parameters. */
      params = [
          _outpoint_hash,
      ];

      /* Build request. */
      request = {
          method,
          params,
      };

      /* Return (async) request. */
      return makeRequest.bind(this)(request)
  }

  /* Import modules. */

  /**
   * (Blockchain) Get Headers Tip
   *
   * Get the latest block header (tip of the blockchain).
   *
   * Added: Rostrum 7.0
   */
  async function _getTip () {
      /* Initialize locals. */
      let method;
      let params;
      let request;
      let rostrum;

      /* Validate instance. */
      if (typeof this === 'undefined') {
          /* Initialize Rostrum instance. */
          rostrum = await Rostrum.init();

          /* Call self (via instance). */
          return rostrum.getTip()
      }

      /* Set method. */
      method = 'blockchain.headers.tip';

      /* Set parameters. */
      params = [];

      /* Build request. */
      request = {
          method,
          params,
      };

      /* Return (async) request. */
      return makeRequest.bind(this)(request)
  }

  /* Import modules. */

  /**
   * (Token) History
   *
   * Return all confirmed and unconfirmed token transaction history of a given token.
   *
   * Version added: Rostrum 6.0
   */
  async function _getTokenHistory (_address, _cursor, _tokenid) {
      /* Initialize locals. */
      let method;
      let params;
      let request;
      let rostrum;

      /* Validate instance. */
      if (typeof this === 'undefined') {
          /* Initialize Rostrum instance. */
          rostrum = await Rostrum.init();

          /* Call self (via instance). */
          return rostrum.getTokenHistory(_address, _cursor, _tokenid)
      }

      /* Set method. */
      method = 'token.transaction.get_history';

      /* Set parameters. */
      if (_cursor) {
          params = [
              _address,
              _cursor,
              _tokenid,
          ];
      } else {
          params = [
              _address,
              _tokenid,
          ];
      }

      /* Build request. */
      request = {
          method,
          params,
      };

      /* Return (async) request. */
      return makeRequest.bind(this)(request)
  }

  /* Import modules. */

  /**
   * (Token) Genesis Info
   *
   * Info from token creation transaction.
   *
   * Version added: Rostrum 6.0
   */
  async function _getGenesisInfo (_tokenid) {
      /* Initialize locals. */
      let method;
      let params;
      let request;
      let rostrum;

      /* Validate instance. */
      if (typeof this === 'undefined') {
          /* Initialize Rostrum instance. */
          rostrum = await Rostrum.init();

          /* Call self (via instance). */
          return rostrum.getGenesisInfo(_tokenid)
      }

      /* Set method. */
      method = 'token.genesis.info';

      /* Set parameters. */
      params = [ _tokenid ];

      /* Build request. */
      request = {
          method,
          params,
      };

      /* Return (async) request. */
      return makeRequest.bind(this)(request)
  }

  /* Import modules. */

  /**
   * (Blockchain) Subscribe Address
   *
   * Subscibe for updates on ALL address activity.
   *
   * Version added: Rostrum 1.4.3
   */
  async function _subscribeAddress (_address, _handler) {
      /* Initialize locals. */
      let method;
      let params;
      let request;
      let rostrum;

      /* Validate instance. */
      if (typeof this === 'undefined') {
          /* Initialize Rostrum instance. */
          rostrum = await Rostrum.init();

          /* Call self (via instance). */
          return rostrum.subscribeAddress(_address, _handler)
      }

      /* Set method. */
      method = 'blockchain.address.subscribe';

      /* Set parameters. */
      params = [ _address ];

      /* Build request. */
      request = {
          method,
          params,
      };

      /* Return (async) request. */
      return makeRequest.bind(this)(request, _address, _handler)
  }

  /* Import modules. */

  /**
   * (Server) Ping
   *
   * Ping the server to ensure it is responding, and to keep the session alive.
   * The server may disconnect clients that have sent no requests
   * for roughly 10 minutes.
   *
   * Version added: 1.2
   */
  async function ping () {
      /* Initialize locals. */
      let method;
      let params;
      let request;
      let rostrum;

      /* Validate instance. */
      if (typeof this === 'undefined') {
          /* Initialize Rostrum instance. */
          rostrum = await Rostrum.init();

          /* Call self (via instance). */
          return rostrum.ping()
      }

      /* Set method. */
      method = 'server.ping';

      /* Set parameters. */
      params = [];

      /* Build request. */
      request = {
          method,
          params,
      };

      /* Return (async) request. */
      return makeRequest.bind(this)(request)
  }

  /* Import modules. */

  /* Import request handler. */
  // import makeRequest from './src/makeRequest.js'

  /* Set active connection id. */
  // NOTE: Official node is currently accepting ZERO-fee txs.
  const DEFAULT_CONN_ID = 0;

  /* Initialize constants. */
  const RECONNECTION_DELAY = 3000; // default is 3 seconds
  const PING_INTERVAL = 60000; // every 1 minute
  const ROSTRUM_DEFAULT_MAINNET = 'wss://rostrum.nexa.sh:20004';
  const ROSTRUM_OFFICIAL_MAINNET = 'wss://electrum.nexa.org:20004';
  const ROSTRUM_FALLBACK_MAINNET = 'wss://rostrum.apecs.dev:20004';
  const ROSTRUM_DEFAULT_TESTNET = 'wss://rostrum.test-nexa.sh:30004';

  /* Export Rostrum methods. */
  const getAddressBalance = _getAddressBalance;
  const decodeRemoteAddress = _decodeRemoteAddress;
  const getAddressFirstUse = _getAddressFirstUse;
  const getAddressHistory = _getAddressHistory;
  const getAddressMempool = _getAddressMempool;
  const getAddressScriptHash = _getAddressScriptHash;
  const getAddressUnspent = _getAddressUnspent;
  const getBlock = _getBlock;
  const getTransaction = _getTransaction;
  const getAddressTokenBalance = _getAddressTokenBalance;
  const getAddressTokenHistory = _getAddressTokenHistory;
  const getAddressTokenMempool = _getAddressTokenMempool;
  const getAddressTokenUnspent = _getAddressTokenUnspent;
  const getNftList = _getNftList;
  const getOutpoint = _getOutpoint;
  const getTip = _getTip;
  const getTokenHistory = _getTokenHistory;
  const getGenesisInfo = _getGenesisInfo;
  const getTokenInfo = getGenesisInfo; // Export alias.
  const subscribeAddress = _subscribeAddress;

  /**
   * Get Connection
   *
   * Returns a new connection to a remote Rostrum server.
   */
  const getConnection = async function (_connid) {
      /* Import WebSocket. */
      // NOTE: MUST BE EXCLUDED WHEN BUILDING FOR BROWSER VIA USING ROLLUP.
      // const WebSocket = (await import('isomorphic-ws')).default

      /* Handle environment variables. */
      if (typeof process !== 'undefined' && process?.env?.ROSTRUM) {
          /* Return (user-defined) Rostrum provider. */
          return new WebSocket(process.env.ROSTRUM)
      } else if (typeof process !== 'undefined' && process?.env?.TESTNET) {
          /* Return default (Testnet) provider. */
          return new WebSocket(ROSTRUM_DEFAULT_TESTNET)
      }

  // return new WebSocket('ws://0.0.0.0:30003')
  // return new WebSocket('ws://0.0.0.0:30404')

      /* Handle connection selection. */
      switch(_connid) {
      case 0:
          return new WebSocket(ROSTRUM_DEFAULT_MAINNET)
      case 1:
          return new WebSocket(ROSTRUM_OFFICIAL_MAINNET)
      case 2:
          return new WebSocket(ROSTRUM_FALLBACK_MAINNET)
      // TODO Add 2 more production-ready Rostrum servers (for a min of 5)
      default:
          return new WebSocket(ROSTRUM_DEFAULT_MAINNET)
      }
  };

  const initConnection = function (_connid) {
      // console.log(`Initializing connection [ ${_connid} ]`)

      /* Handle open connection. */
      this._connMgr.pool[_connid].onopen = () => {
          // TODO Show (IP Address) instead of Conn ID.
          console.info('Connected to Rostrum ->', _connid, new Date().getTime());

          /* Set (connection) ready flag. */
          // this._connMgr.isOpen = true
          this._connMgr.status[_connid].isOpen = true;

          /* Handle (pending) queue. */
          this._requestQueue.forEach(_request => {
              /* Send request. */
              this._connMgr.pool[_connid]
                  .send(JSON.stringify(_request) + '\n'); // NOTE: We MUST include the "new line".
          });
      };

      /* Handle message. */
      this._connMgr.pool[_connid].onmessage = async (_msg) => {
          let json;
          let id;

          const data = _msg?.data;

          try {
              /* Decode data. */
              json = JSON.parse(data);
              // console.log('JSON', json)

              id = data.id;

              // NOTE: Reject this promise.
              if (json?.error) {
                  return this._connMgr.requests[id]?.reject({ error: json.error?.message })
              }
          } catch (err) {
              return this._connMgr.requests[id]?.reject(err)
          }

          /* Validate message data. */
          if (_msg?.data) {
              try {
                  /* Parse JSON data. */
                  const data = JSON.parse(_msg.data);
                  // console.log('JSON (data):', data)

                  /* Validate message id. */
                  if (data?.id) {
                      // console.log('JSON (result):', data.id, data.result)

                      /* Set message id. */
                      id = data.id;

                      /* Resolve (async) request. */
                      this._connMgr.requests[id]?.resolve(data.result);
                  }

                  /* Validate message parameters. */
                  if (data?.params) {
                      // console.log('JSON (params):', data.params)

                      /* Validate message id. */
                      if (id) {
                          /* Resolve (async) request. */
                          this._connMgr.requests[id]?.resolve(data.params);
                      } else {
                          /* Update message id. */
                          id = data.params[0];

                          /* Make callback. */
                          this._connMgr.requests[id]?.callback(data.params);
                      }
                  }
              } catch (err) {
                  console.error(err);
                  this._connMgr.requests[id]?.reject(err);
              }
          }

      };

      /* Handle connection close. */
      // NOTE: We currently NEVER allow this connect to be closed.
      //       We will ALWAYS attempt to re-connect.
      // TODO: Allow connection to be "manually" closed.
      this._connMgr.pool[_connid].onclose = () => {
          console.log('CONNECTION CLOSED', _connid, new Date().getTime());

          /* Validate connection status. */
          if (this._connMgr.status[_connid].isOpen) {
              /* Set (connection) ready flag. */
              this._connMgr.status[_connid].isOpen = false;
          }

          console.info(`Waiting (${RECONNECTION_DELAY} ms) to reconnect...`);

          // NOTE: Add re-try delay and max attempts.
          setTimeout(async () => {
              /* Re-establish connection to remote server(s). */
              this._connMgr.pool[_connid] = await getConnection.bind(this)(_connid);

              /* Re-initialize connection. */
              initConnection.bind(this)(_connid);
          }, RECONNECTION_DELAY);
      };

      /* Handle connection error. */
      this._connMgr.pool[_connid].onerror = (e) => {
          console.error('ERROR! [ %s ]:', _connid, new Date().getTime(), e);
      };
  };

  /**
   * Rostrum Class
   *
   * Manages a connection and its requests to a Rostrum server.
   */
  class Rostrum extends EventEmitter {
      constructor(_params) {
          /* Initialize Rostrum class. */
          console.info('Initializing Rostrum...');
          console.log(JSON.stringify(_params, null, 2));
          super();

          // TODO Allow customization of data providers using `_params`.

          /* Initialize request queue. */
          this._requestQueue = [];

          /* Initialize connection manager. */
          this._connMgr = null;
      }

      /**
       * Initialization
       *
       * Create a new Rostrum instance (passing optional parameters).
       */
      static init(_params) {
          return (async function () {
              /* Create new instance. */
              const rostrum = new Rostrum(_params);

              // Do async stuff
              await rostrum._connect();

              // Return instance
              return rostrum
          })()
      }

      async _connect() {
          /* Validate (global-shared) connection manager. */
          if (globalThis.Nexa.Rostrum._connMgr) {
              /* Use existing (global-shared) connection. */
              this._connMgr = globalThis.Nexa.Rostrum._connMgr;

              // console.log('Connected to SHARED Rostrum connection...')
              return
          }

          /* Initialize connections manager. */
          this._connMgr = {
              pool: [
                  await getConnection.bind(this)(DEFAULT_CONN_ID),       // nexa.sh
                  // NOTE: Official node is currently accepting ZERO-fee txs.
                  await getConnection.bind(this)(DEFAULT_CONN_ID + 1),   // nexa.org
                  await getConnection.bind(this)(DEFAULT_CONN_ID + 2),   // apecs.dev
              ],
              status: [
                  {
                      isOpen: false,
                  },
                  {
                      isOpen: false,
                  },
                  {
                      isOpen: false,
                  },
              ],
              requests: {},
              isReady: false,
          };

          /* Validate (global) Nexa object. */
          if (!globalThis.Nexa) {
              globalThis.Nexa = {};
          }

          /* Validate (global) Rostrum object. */
          if (!globalThis.Nexa.Rostrum) {
              globalThis.Nexa.Rostrum = {};
          }

          /* Set (global-shared) connection manager. */
          globalThis.Nexa.Rostrum._connMgr = this._connMgr;

          /* Initialize connection handlers. */
          for (let i = 0; i < this._connMgr.pool.length; i++) {
              /* Initialize connection(s). */
              initConnection.bind(this)(i);
          }

          /* Manage session keep-alive. */
          // NOTE: Requires arrow func to "fix" (this) context issue??
          //       (source: https://developer.mozilla.org/en-US/docs/Web/API/setInterval#a_possible_solution)
          setInterval(() => this.ping(), PING_INTERVAL);
      }

      get status() {
          return {
              requestQueue: this?._requestQueue,
              // isOpen: this?._connMgr?.isOpen,
              isReady: this?._connMgr?.isReady,
          }
      }

      getAddressBalance(address, filter) {
          return getAddressBalance.bind(this)(address, filter)
      }

      decodeRemoteAddress(address) {
          return decodeRemoteAddress.bind(this)(address)
      }

      getAddressFirstUse(address, filter) {
          return getAddressFirstUse.bind(this)(address, filter)
      }

      getAddressHistory(address, filter) {
          return getAddressHistory.bind(this)(address, filter)
      }

      getAddressMempool(address, filter) {
          return getAddressMempool.bind(this)(address, filter)
      }

      getAddressScriptHash(params) {
          return getAddressScriptHash.bind(this)(params)
      }

      getAddressUnspent(params) {
          return getAddressUnspent.bind(this)(params)
      }

      getBlock(id) {
          return getBlock.bind(this)(id)
      }

      getTransaction(id, verbose) {
          return getTransaction.bind(this)(id, verbose)
      }

      getGenesisInfo(params) {
          return getGenesisInfo.bind(this)(params)
      }

      getTokenInfo(params) {
          return getTokenInfo.bind(this)(params)
      }

      getAddressTokenBalance(address, cursor, tokenid) {
          return getAddressTokenBalance.bind(this)(address, cursor, tokenid)
      }

      getAddressTokenHistory(address, cursor, tokenid) {
          return getAddressTokenHistory.bind(this)(address, cursor, tokenid)
      }

      getAddressTokenMempool(address, cursor, tokenid) {
          return getAddressTokenMempool.bind(this)(address, cursor, tokenid)
      }

      getAddressTokenUnspent(address, cursor, tokenid) {
          return getAddressTokenUnspent.bind(this)(address, cursor, tokenid)
      }

      getNftList(tokenid, cursor) {
          return getNftList.bind(this)(tokenid, cursor)
      }

      getOutpoint(outpoint_hash) {
          return getOutpoint.bind(this)(outpoint_hash)
      }

      getTip() {
          return getTip.bind(this)()
      }

      getTokenHistory(address, cursor, tokenid) {
          return getTokenHistory.bind(this)(address, cursor, tokenid)
      }

      subscribeAddress(params, handler) {
          return subscribeAddress.bind(this)(params, handler)
      }

      ping() {
          return ping.bind(this)()
      }
  }


  /* Initialize (globalThis) Nexa class. */
  const Nexa = {};

  /* Initialize Rostrum class. */
  Nexa.Rostrum = Rostrum;

  /* Initialize Rostrum modules. */
  Nexa.getAddressBalance = getAddressBalance;
  Nexa.decodeRemoteAddress = decodeRemoteAddress;
  Nexa.getAddressFirstUse = getAddressFirstUse;
  Nexa.getAddressHistory = getAddressHistory;
  Nexa.getAddressMempool = getAddressMempool;
  Nexa.getAddressScriptHash = getAddressScriptHash;
  Nexa.getAddressUnspent = getAddressUnspent;
  // ...
  Nexa.getGenesisInfo = getGenesisInfo;
  Nexa.getTokenInfo = getTokenInfo; // alias for `getGenesisInfo`
  Nexa.getAddressTokenBalance = getAddressTokenBalance;
  Nexa.getAddressTokenHistory = getAddressTokenHistory;
  Nexa.getAddressTokenMempool = getAddressTokenMempool;
  Nexa.getAddressTokenUnspent = getAddressTokenUnspent;
  Nexa.getNftList = getNftList;
  Nexa.getOutpoint = getOutpoint;
  Nexa.getTip = getTip;
  Nexa.getTokenHistory = getTokenHistory;
  // ...
  Nexa.subscribeAddress = subscribeAddress;
  Nexa.subscribeOwner = subscribeAddress; // alias for `subscribeAddress`

  /* Export Nexa to globalThis. */
  // NOTE: We merge to avoid conflict with other libraries.
  globalThis.Nexa = {
      ...globalThis.Nexa, // preserve Nexa object
      ...Nexa, // extend Nexa object
  };

  exports.Rostrum = Rostrum;
  exports.decodeRemoteAddress = decodeRemoteAddress;
  exports.getAddressBalance = getAddressBalance;
  exports.getAddressFirstUse = getAddressFirstUse;
  exports.getAddressHistory = getAddressHistory;
  exports.getAddressMempool = getAddressMempool;
  exports.getAddressScriptHash = getAddressScriptHash;
  exports.getAddressTokenBalance = getAddressTokenBalance;
  exports.getAddressTokenHistory = getAddressTokenHistory;
  exports.getAddressTokenMempool = getAddressTokenMempool;
  exports.getAddressTokenUnspent = getAddressTokenUnspent;
  exports.getAddressUnspent = getAddressUnspent;
  exports.getBlock = getBlock;
  exports.getGenesisInfo = getGenesisInfo;
  exports.getNftList = getNftList;
  exports.getOutpoint = getOutpoint;
  exports.getTip = getTip;
  exports.getTokenHistory = getTokenHistory;
  exports.getTokenInfo = getTokenInfo;
  exports.getTransaction = getTransaction;
  exports.subscribeAddress = subscribeAddress;

  return exports;

})({});
