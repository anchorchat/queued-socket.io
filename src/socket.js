import io from 'socket.io-client';
import Debug from 'debug';
import * as events from './events';
import * as queue from './queue';

const debug = Debug('queued-socket.io:socket');

/**
 * Socket module
 * @module socket
 */

let client;

/**
 * Retrieve the client
 *
 * @returns socket.io client
 *
 * @public
 */
const getClient = () => client;

/**
 * Check if the socket is connected
 *
 * @returns {Boolean} socket connection status
 *
 *
 * @public
 */
const isConnected = () => Boolean(client && client.connected);

/**
 * Send an event to the socket, when the socket is not connected, add an emit event to the queue.
 *
 * @param {String} event - The event name that needs to be added to the socket.
 * @param {Object} data - The data to send to the socket when the event is triggered.
 * @param {Number} priority=2 - The priority of the event.
 *
 * @public
 */
const emit = (event, data, priority = 2) => {
  if (client && client.connected) {
    debug(`emit - ${event}`);
    return client.emit(event, data);
  }

  debug(`emit - queue - ${event}`);
  return queue.add('emit', { event, data }, priority);
};

/**
 * Wrapper around socket.on that adds priority and caching
 *
 * @param {String} event - The event name that needs to be added to the socket.
 * @param {Function} callback - The callback function that the sockets call when the event is triggered.
 * @param {Number} priority=2 - The priority of the event.
 *
 * @public
 */
const on = (event, callback, priority = 2) => events.add(event, callback, priority);

/**
 * Wrapper around socket.off that adds priority and caching
 *
 * @param {String} event - The event name that needs to be added to the socket.
 * @param {Number} priority=2 - The priority of the event.
 *
 * @public
 */
const off = (event, priority = 2) => events.remove(event, priority);

/**
 * Wrapper around socket.once that adds priority and caching
 *
 * @param {String} event - The event name that needs to be added to the socket.
 * @param {Function} callback - The callback function that the sockets call when the event is triggered.
 * @param {Number} priority=2 - The priority of the event.
 *
 * @returns socket.io client
 *
 *
 * @public
 */
const once = (event, callback, priority = 2) => events.once(event, callback, priority);

/**
 * Handle queue items
 *
 * @param {Object} item - The queue item that is currently being handled.
 * @param {String} item.key - The event key.
 * @param {Object} item.payload - The queued item payload.
 *
 * @private
 */
const runQueueResult = ({ key, payload = {} } = {}) => {
  switch (key) {
    case 'add': return events.add(payload.event, payload.callback);
    case 'once': return events.once(payload.event, payload.callback);
    case 'remove': return events.remove(payload.event);
    case 'clear': return events.clear();
    case 'emit': return emit(payload.event, payload.data);
    default:
      return false;
  }
};

/**
 * onConnect
 *
 * @private
 */
const onConnect = () => {
  debug(`socket - connected - ${client.id}`);
  return queue.runQueue(runQueueResult);
};

/**
 * onReconnect
 *
 * @private
 */
const onReconnect = () => {
  debug(`socket - reconnect - ${client.id}`);
  return queue.runQueue(runQueueResult);
};

/**
 * onDisconnect
 *
 * @param {String} reason - Reason of the disconnect.
 *
 * @private
 */
const onDisconnect = (reason) => {
  debug(`socket - disconnected - ${client.id} - ${reason}`);
  events.clear();
  return queue.flush();
};

/**
 * Connect to socket.io, if socket is already connected, returns that socket.
 *
 * @param {String} uri - The connection uri of the host.
 * @param {Object} options - Options object used by socket.io.
 *
 * @returns socket.io client
 *
 * @public
 */
const connect = (uri, options = {}) => {
  if (!uri) {
    throw new Error('Please specify connection uri for socket');
  }

  if (client && client.connected) {
    return client;
  }

  client = io.connect(uri, options);

  client.on('connect', onConnect);
  client.on('reconnect', onReconnect);
  client.on('disconnect', onDisconnect);

  return client;
};

const disconnect = () => {
  if (client && client.disconnect) {
    client.disconnect();
  }

  client = undefined;
};

export {
  connect,
  disconnect,
  emit,
  events,
  getClient,
  isConnected,
  off,
  on,
  onConnect,
  onDisconnect,
  onReconnect,
  once,
  runQueueResult
};
