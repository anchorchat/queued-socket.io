import Debug from 'debug';
import * as cache from './cache';
import { getClient } from './socket';

const debug = Debug('cached-socket.io:events');

/**
 * Events module
 * @module events
 */

const events = new Set();

/**
 * Adds a socket event to the socket, when the socket is not connected, add the add event to the cache.
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
    return events.add(event);
  }

  debug(`add - cache - ${event}`);

  return cache.add('add', { event, callback }, priority);
};

/**
 * Adds a single run socket event to the socket, when the socket is not connected, add the once event to the cache.
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

    client.once(event, (data) => {
      events.delete(event);
      return callback(data);
    });

    return events.add(event);
  }
  debug(`once - cache - ${event}`);

  return cache.add('once', { event, callback }, priority);
};

/**
 * Remove all socket events from the socket, when the socket is not connected, add the clear event to the cache.
 *
 * @param {Number} priority=2 - The priority of the event.
 *
 * @public
 */
const clear = (priority = 2) => {
  const client = getClient();

  if (client && client.connected) {
    debug('clear');
    events.forEach(client.off); // eslint-disable-line lodash/prefer-lodash-method
    events.clear();
  }
  debug('clear - cache');

  return cache.add('clear', undefined, priority);
};

/**
 * Retrieve all registered events
 *
 * @returns {Object[]} Registered events
 *
 *
 * @public
 */
const get = () => [...events];

/**
 * Remove a socket event from the socket, when the socket is not connected, add a remove event to the cache.
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
    console.log('[Socket event remove]', client.id, event);
    client.off(event);
    return events.delete(event);
  }
  debug(`remove - cache - ${event}`);

  return cache.add('remove', { event }, priority);
};

export {
  add,
  clear,
  get,
  once,
  remove
};
