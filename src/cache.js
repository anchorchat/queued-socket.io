import forEach from 'lodash.foreach';
import sortBy from 'lodash.sortby';
import { getClient } from './socket';

/**
 * Caching module
 * @module cache
 *
 * @private
 */

const cache = new Set();

/**
 * Clears the cache.
 */
const flush = () => cache.clear();

/**
 * Adds an item to cache.
 *
 * @param {String} key - The event key to add to the cache. Valid keys are: add, remove, clear and emit.
 * @param {Object} payload - The payload of the event.
 * @param {Number} priority=2 - The priority of the event.
 */
const add = (key, payload, priority = 2) => (
  cache.add({
    key,
    payload,
    priority
  })
);

/**
 * Adds an item to cache.
 *
 * @param {Function} [callback] - The callback event which returns the cached item.
 */
const runCache = (callback = () => {}) => {
  if (!cache.size) {
    return false;
  }

  const client = getClient();

  if (client.connected) {
    const items = [...cache.values()];

    const sortedItems = sortBy(items, 'priority');

    forEach(sortedItems, callback);

    return flush();
  }

  return false;
};

export {
  flush,
  add,
  runCache
};
