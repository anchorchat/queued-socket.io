import { getClient } from './socket';

/**
 * Queue module
 * @module queue
 *
 * @private
 */

const Queue = new Set();

/**
 * Clears the queue.
 */
const flush = () => Queue.clear();

/**
 * Adds an item to queue.
 *
 * @param {String} key - The event key to add to the queue. Valid keys are: add, remove, clear and emit.
 * @param {Object} payload - The payload of the event.
 * @param {Number} priority=2 - The priority of the event.
 */
const add = (key, payload, priority = 2) => (
  Queue.add({
    key,
    payload,
    priority
  })
);

/**
 * Return queued items and clear afterwards.
 *
 * @param {Function} [callback] - The callback event which returns the queued item.
 */
const runQueue = (callback = () => {}) => {
  if (!Queue.size) {
    return false;
  }

  const client = getClient();

  if (client && client.connected) {
    const items = [...Queue];

    const sortedItems = items.sort((a, b) => {
      if (a.priority < b.priority) {
        return -1;
      }

      if (a.priority > b.priority) {
        return 1;
      }

      return 0;
    });

    sortedItems.forEach(callback);

    return flush();
  }

  return false;
};

export {
  flush,
  add,
  runQueue,
  Queue
};
