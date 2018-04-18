import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import * as socket from '../src/socket';
import * as queue from '../src/queue';

chai.use(sinonChai);

describe('queue', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    queue.Queue.clear();

    sandbox.restore();
  });

  describe('flush', () => {
    it('should clear the queue', () => {
      queue.Queue.add('message', {});

      queue.flush();

      expect(queue.Queue.size).to.equal(0);
    });
  });

  describe('add', () => {
    it('should add an item with default priority to the queue', () => {
      queue.add('message', {});

      expect(queue.Queue.size).to.equal(1);

      expect([...queue.Queue][0].priority).to.equal(2);
    });

    it('should add an item with priority to the queue', () => {
      queue.add('message', {}, 1);

      expect(queue.Queue.size).to.equal(1);

      expect([...queue.Queue][0].priority).to.equal(1);
    });
  });

  describe('runQueue', () => {
    it('should return false if queue is empty', () => {
      const callback = sandbox.spy();

      const result = queue.runQueue(callback);

      expect(result).to.equal(false);
      expect(callback).to.have.callCount(0);
    });

    it('should return false if client is not connected', () => {
      sandbox.stub(socket, 'getClient').returns({
        connected: false
      });

      const item = {
        key: 'message',
        payload: {},
        priority: 2
      };

      queue.Queue.add(item);

      const callback = sandbox.spy();

      const result = queue.runQueue(callback);

      expect(result).to.equal(false);
      expect(callback).to.have.callCount(0);
    });

    it('should run queue and clear queue with default callback', () => {
      sandbox.stub(socket, 'getClient').returns({
        connected: true
      });

      const item1 = {
        key: 'message',
        payload: {},
        priority: 2
      };

      const item2 = {
        key: 'message2',
        payload: {},
        priority: 2
      };

      queue.Queue.add(item1);
      queue.Queue.add(item2);

      queue.runQueue();

      expect(queue.Queue.size).to.equal(0);
    });

    it('should run queue and clear queue', () => {
      sandbox.stub(socket, 'getClient').returns({
        connected: true
      });

      const item1 = {
        key: 'message',
        payload: {},
        priority: 2
      };

      const item2 = {
        key: 'message2',
        payload: {},
        priority: 2
      };

      queue.Queue.add(item1);
      queue.Queue.add(item2);

      const callback = sandbox.spy();

      queue.runQueue(callback);

      expect(callback).to.have.callCount(2);
      expect(queue.Queue.size).to.equal(0);
    });

    it('should run queue based on priority and clear queue', () => {
      sandbox.stub(socket, 'getClient').returns({
        connected: true
      });

      const item1 = {
        key: 'message',
        payload: {},
        priority: 2
      };

      const item2 = {
        key: 'message2',
        payload: {},
        priority: 1
      };

      queue.Queue.add(item1);
      queue.Queue.add(item2);

      const callback = sandbox.spy();

      queue.runQueue(callback);

      expect(callback).to.have.callCount(2);
      expect(callback.firstCall.args[0]).to.equal(item2);
      expect(callback.secondCall.args[0]).to.equal(item1);
      expect(queue.Queue.size).to.equal(0);
    });
  });
});
