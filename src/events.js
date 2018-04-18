import Debug from 'debug';
import * as queue from './queue';
import { getClient } from './socket';

const debug = Debug('queued-socket.io:events');

/**
 * Events module
 * @module events
 */

const Events = new Set();

/**
 * Adds a socket event to the socket, when the socket is not connected, add the add event to the queue.
 *
 * @param {String} event - The event name that needs to be added to the socket.
 * @param {Function} callback - The callback function that the sockets call when the event is triggered.
 * @param {Number} priority=2 - The priority of the event.
 *
 * @public
 */
const add = (event, callback, priority = 2) => {
  const client = getClient();

  if (client && client.connected) {
    debug(`add - ${event}`);

    client.on(event, callback);
    return Events.add(event);
  }

  debug(`add - queue - ${event}`);

  return queue.add('add', { event, callback }, priority);
};

/**
 * onceCallback
 *
 * @param {String} event - The event name that needs to be removed.
 * @param {Any} data - Returned value from socket event.
 * @param {Function} callback - The callback function that the sockets call when the event is triggered.
 *
 * @private
 */
const onceCallback = (event, data, callback) => {
  Events.delete(event);
  return callback(data);
};

/**
 * Adds a single run socket event to the socket, when the socket is not connected, add the once event to the queue.
 *
 * @param {String} event - The event name that needs to be added to the socket.
 * @param {Function} callback - The callback function that the sockets call when the event is triggered.
 * @param {Number} priority=2 - The priority of the event.
 *
 * @public
 */
const once = (event, callback, priority = 2) => {
  const client = getClient();

  if (client && client.connected) {
    debug(`once - ${event}`);

    Events.add(event);

    return client.once(event, data => onceCallback(event, data, callback));
  }
  debug(`once - queue - ${event}`);

  return queue.add('once', { event, callback }, priority);
};

/**
 * Remove all socket events from the socket, when the socket is not connected, add the clear event to the queue.
 *
 * @param {Number} priority=2 - The priority of the event.
 *
 * @public
 */
const clear = (priority = 2) => {
  const client = getClient();

  if (client && client.connected) {
    debug('clear');
    Events.forEach(event => client.off(event)); // eslint-disable-line lodash/prefer-lodash-method
    return Events.clear();
  }
  debug('clear - queue');

  return queue.add('clear', undefined, priority);
};

/**
 * Retrieve all registered events
 *
 * @returns {Object[]} Registered events
 *
 *
 * @public
 */
const get = () => [...Events];

/**
 * Remove a socket event from the socket, when the socket is not connected, add a remove event to the queue.
 *
 * @param {String} event - The event name that needs to be added to the socket.
 * @param {Number} priority=2 - The priority of the event.
 *
 * @public
 */
const remove = (event, priority = 2) => {
  const client = getClient();

  if (client && client.connected) {
    debug(`remove - ${event}`);
    client.off(event);
    return Events.delete(event);
  }
  debug(`remove - queue - ${event}`);

  return queue.add('remove', { event }, priority);
};

export {
  add,
  clear,
  get,
  once,
  remove,
  onceCallback,
  Events
};
