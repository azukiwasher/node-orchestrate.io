/*
 * client.js:
 *   Client for accessing to the Orchestrate.Io API
 *
 */
var io = require('../orchestrate.io')
  , common = require('./common')
  , events = require('events')
  , util = require('util')
  , request = require('request')
  , qs = require('querystring');

//
// function createClient (options)
//   Creates a new instance of Orchestrate.io client
//
exports.createClient = function (options) {
  return new OrchestrateIo(options);
};

//
// function OrchestrateIo (options)
//   Initialize the OrchestrateIo object
//
var OrchestrateIo = exports.OrchestrateIo = function (options) {
  events.EventEmitter.call(this);
  var defaults = {
    version: io.version,
    endpoint: 'https://api.orchestrate.io',
    api: 'v0',
    apikey: null,
    headers: {
      'User-Agent': 'Orchestrate.io Node module ' + io.version,
      'Content-Type': 'application/json; charset=utf-8',
      'Accept-Langage': 'en'
    }
  };

  this.options = common.merge(defaults, options);
  if (!this.options.apikey) {
    throw new Error('API key is required');
  }
};

//
// Inherit from events.EventEmitter
//
util.inherits(OrchestrateIo, events.EventEmitter);

//
// function getKeyValue (params, callback)
// @params {Hash}
// @callback {Function}
//
OrchestrateIo.prototype.getKeyValue = function (params, callback) {
  if (typeof callback !== 'function') {
    throw new Error('FATAL: INVALID CALLBACK');
    return this;
  }

  var self = this
    , uri = [
        self.options.endpoint,
        self.options.api,
        params.collection,
        params.key
      ].join('/');

  var requestOptions = {
    uri: uri,
    method: 'GET',
    headers: self.options.headers,
    auth: {
      user: self.options.apikey,
      pass: ""
    }
  };

  common.perform(requestOptions, callback, function (res, data) {
    try {
      self.emit('getKeyValue', data);
      if (callback) { callback(null, data) }
    }
    catch (ex) {
      if (callback) {
        callback(new Error('Unspecified error from Orchestrate.io: ' + ex));
      }
    }
  });

  return this;
};


//
// function putKeyValue (params, callback)
// @params {Hash}
// @callback {Function}
//
OrchestrateIo.prototype.putKeyValue = function (params, callback) {
  if (typeof callback !== 'function') {
    throw new Error('FATAL: INVALID CALLBACK');
    return this;
  }

  var self = this
    , body = (params.data instanceof Object) ? JSON.stringify(params.data) : params.data
    , uri  = [
        self.options.endpoint,
        self.options.api,
        params.collection,
        params.key
      ].join('/');

  var requestOptions = {
    uri: uri,
    method: 'PUT',
    headers: self.options.headers,
    auth: {
      user: self.options.apikey,
      pass: ""
    },
    body: body
  };

  common.perform(requestOptions, callback, function (res, data) {
    try {
      self.emit('putKeyValue', data);
      if (callback) { callback(null, data) }
    }
    catch (ex) {
      if (callback) {
        callback(new Error('Unspecified error from Orchestrate.io: ' + ex));
      }
    }
  });

  return this;
};

//
// function search (params, callback)
// @params {Hash}
// @callback {Function}
//
OrchestrateIo.prototype.search = function (params, callback) {
  if (typeof callback !== 'function') {
    throw new Error('FATAL: INVALID CALLBACK');
    return this;
  }

  var self = this
    , query = params.query
    , uri = [
        self.options.endpoint,
        self.options.api,
        params.collection
      ].join('/');

  var requestOptions = {
    uri: uri,
    method: 'GET',
    headers: self.options.headers,
    auth: {
      user: self.options.apikey,
      pass: ""
    }
  };

  if (query) {
    requestOptions.query = { query: query }
  }

  common.perform(requestOptions, callback, function (res, data) {
    try {
      self.emit('Search', data);
      if (callback) { callback(null, data) }
    }
    catch (ex) {
      if (callback) {
        callback(new Error('Unspecified error from Orchestrate.io: ' + ex));
      }
    }
  });

  return this;
};

//
// function getEvent (params, callback)
// @params {Hash}
// @callback {function}
//
OrchestrateIo.prototype.getEvent = function (params, callback) {
  if (typeof callback !== 'function') {
    throw new Error('FATAL: INVALID CALLBACK');
    return this;
  }

  var self = this
    , uri = [
        self.options.endpoint,
        self.options.api,
        params.collection,
        params.key,
       'events',
        params.type
      ].join('/');

  var requestOptions = {
    uri: uri,
    method: 'GET',
    headers: self.options.headers,
    auth: {
      user: self.options.apikey,
      pass: ""
    }
  };

  if (params.start || params.end) {
    start = params.start ? { start: params.start } : {}
    end = params.end ? { end: params.end } : {}
    requestOptions.query = common.merge(start, end);
  }

  common.perform(requestOptions, callback, function (res, data) {
    try {
      self.emit('getEvent', data);
      if (callback) { callback(null, data) }
    }
    catch (ex) {
      if (callback) {
        callback(new Error('Unspecified error from Orchestrate.io: ' + ex));
      }
    }
  });

  return this;
};

//
// function putEvent (params, callback)
// @params {Hash}
// @callback {function}
//
OrchestrateIo.prototype.putEvent = function (params, callback) {
  if (typeof callback !== 'function') {
    throw new Error('FATAL: INVALID CALLBACK');
    return this;
  }

  var self = this
    , body = (params.data instanceof Object) ? JSON.stringify(params.data) : params.data
    , timestamp = params.timestamp
    , uri  = [
        self.options.endpoint,
        self.options.api,
        params.collection,
        params.key,
       'events',
        params.type
      ].join('/');

  var requestOptions = {
    uri: uri,
    method: 'PUT',
    headers: self.options.headers,
    auth: {
      user: self.options.apikey,
      pass: ""
    },
    body: body
  };

  if (timestamp) {
    requestOptions.query = { timestamp: timestamp }
  }

  common.perform(requestOptions, callback, function (res, data) {
    try {
      self.emit('putEvent', data);
      if (callback) { callback(null, data) }
    }
    catch (ex) {
      if (callback) {
        callback(new Error('Unspecified error from Orchestrate.io: ' + ex));
      }
    }
  });

  return this;
};

//
// function getGraph (params, callback)
// @params {Hash}
// @callback {function}
//
OrchestrateIo.prototype.getGraph = function (params, callback) {
  if (typeof callback !== 'function') {
    throw new Error('FATAL: INVALID CALLBACK');
    return this;
  }

  var self = this
    , uri = [
        self.options.endpoint,
        self.options.api,
        params.collection,
        params.key,
        params.relation
      ].join('/');

  var requestOptions = {
    uri: uri,
    method: 'GET',
    headers: self.options.headers,
    auth: {
      user: self.options.apikey,
      pass: ""
    }
  };

  common.perform(requestOptions, callback, function (res, data) {
    try {
      self.emit('getGraph', data);
      if (callback) { callback(null, data) }
    }
    catch (ex) {
      if (callback) {
        callback(new Error('Unspecified error from Orchestrate.io: ' + ex));
      }
    }
  });

  return this;
};

//
// function putGraph (params, callback)
// @params {Hash}
// @callback {function}
//
OrchestrateIo.prototype.putGraph = function (params, callback) {
  if (typeof callback !== 'function') {
    throw new Error('FATAL: INVALID CALLBACK');
    return this;
  }

  var self = this
    , uri = [
        self.options.endpoint,
        self.options.api,
        params.collection,
        params.key,
       'relation',
        params.relation,
        params.toCollection,
        params.toKey
      ].join('/');

  var requestOptions = {
    uri: uri,
    method: 'PUT',
    headers: self.options.headers,
    auth: {
      user: self.options.apikey,
      pass: ""
    }
  };

  common.perform(requestOptions, callback, function (res, data) {
    try {
      self.emit('putGraph', data);
      if (callback) { callback(null, data) }
    }
    catch (ex) {
      if (callback) {
        callback(new Error('Unspecified error from Orchestrate.io: ' + ex));
      }
    }
  });

  return this;
};
