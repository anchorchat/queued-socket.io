import forEach from 'lodash.foreach';
import sortBy from 'lodash.sortby';
import { getClient } from './socket';

/**
 * Queue module
 * @module queue
 *
 * @private
 */

const queue = new Set();

/**
 * Clears the queue.
 */
const flush = () => queue.clear();

/**
 * Adds an item to queue.
 *
 * @param {String} key - The event key to add to the queue. Valid keys are: add, remove, clear and emit.
 * @param {Object} payload - The payload of the event.
 * @param {Number} priority=2 - The priority of the event.
 */
const add = (key, payload, priority = 2) => (
  queue.add({
    key,
    payload,
    priority
  })
);

/**
 * Adds an item to queue.
 *
 * @param {Function} [callback] - The callback event which returns the queued item.
 */
const runQueue = (callback = () => {}) => {
  if (!queue.size) {
    return false;
  }

  const client = getClient();

  if (client.connected) {
    const items = [...queue.values()];

    const sortedItems = sortBy(items, 'priority');

    forEach(sortedItems, callback);

    return flush();
  }

  return false;
};

export {
  flush,
  add,
  runQueue
};
