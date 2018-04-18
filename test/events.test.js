import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import * as events from '../src/events';
import * as socket from '../src/socket';
import * as queue from '../src/queue';

chai.use(sinonChai);

describe('events', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    events.Events.clear();
    queue.Queue.clear();

    sandbox.restore();
  });

  describe('add', () => {
    it('should add event to socket when socket is connected', () => {
      sandbox.stub(socket, 'getClient').returns({
        connected: true,
        on: sandbox.spy()
      });

      sandbox.spy(queue, 'add');

      const event = 'message';
      const callback = () => {};

      events.add(event, callback);

      const client = socket.getClient();

      expect(client.on).to.have.been.calledWith(event, callback);
      expect(queue.add).to.have.callCount(0);
      expect(events.Events.size).to.equal(1);
    });

    it('should add event with default priority to queue when socket is not connected', () => {
      sandbox.stub(socket, 'getClient').returns({
        connected: false,
        on: sandbox.spy()
      });

      sandbox.spy(queue, 'add');

      const event = 'message';
      const callback = () => {};

      events.add(event, callback);

      const client = socket.getClient();

      expect(client.on).to.have.callCount(0);
      expect(queue.add).to.have.been.calledWith('add', { event, callback }, 2);
      expect(events.Events.size).to.equal(0);
    });

    it('should add event with priority to queue when socket is not connected', () => {
      sandbox.stub(socket, 'getClient').returns({
        connected: false,
        on: sandbox.spy()
      });

      sandbox.spy(queue, 'add');

      const event = 'message';
      const callback = () => {};

      events.add(event, callback, 1);

      const client = socket.getClient();

      expect(client.on).to.have.callCount(0);
      expect(queue.add).to.have.been.calledWith('add', { event, callback }, 1);
      expect(events.Events.size).to.equal(0);
    });
  });

  describe('clear', () => {
    it('should remove all events from socket when socket is connected', () => {
      sandbox.stub(socket, 'getClient').returns({
        connected: true,
        on: sandbox.spy(),
        off: sandbox.spy()
      });

      const event = 'message';

      sandbox.spy(queue, 'add');
      sandbox.spy(events, 'clear');

      events.Events.add(event);

      events.clear();

      const client = socket.getClient();

      expect(client.off).to.have.been.calledWith('message');
      expect(queue.add).to.have.callCount(0);
      expect(events.Events.size).to.equal(0);
    });

    it('should add clear event with default priority to queue when socket is not connected', () => {
      sandbox.stub(socket, 'getClient').returns({
        connected: false,
        on: sandbox.spy(),
        off: sandbox.spy()
      });

      const event = 'message';

      sandbox.spy(queue, 'add');
      sandbox.spy(events, 'clear');

      events.Events.add(event);

      events.clear();

      const client = socket.getClient();

      expect(client.off).to.have.callCount(0);
      expect(queue.add).to.have.callCount(1);
      expect(queue.add).to.have.been.calledWith('clear', undefined, 2);
      expect(events.Events.size).to.equal(1);
    });

    it('should add clear event with priority to queue when socket is not connected', () => {
      sandbox.stub(socket, 'getClient').returns({
        connected: false,
        on: sandbox.spy(),
        off: sandbox.spy()
      });

      const event = 'message';

      sandbox.spy(queue, 'add');
      sandbox.spy(events, 'clear');

      events.Events.add(event);

      events.clear(1);

      const client = socket.getClient();

      expect(client.off).to.have.callCount(0);
      expect(queue.add).to.have.callCount(1);
      expect(queue.add).to.have.been.calledWith('clear', undefined, 1);
      expect(events.Events.size).to.equal(1);
    });
  });

  describe('get', () => {
    it('should return all registered events', () => {
      events.Events.add('message');

      events.Events.add('message');

      const result = events.get();

      expect(result.length).to.equal(1);
    });
  });

  describe('onceCallback', () => {
    it('should handle onceCallback and remove event', () => {
      sandbox.stub(socket, 'getClient').returns({
        connected: true,
        once: sandbox.spy()
      });

      sandbox.spy(queue, 'add');

      const event = 'message';
      const data = {};
      const callback = sandbox.spy();

      events.Events.add(event);

      events.onceCallback(event, data, callback);

      expect(events.Events.size).to.equal(0);
      expect(callback).to.have.callCount(1);
      expect(callback).to.have.been.calledWith(data);
    });
  });

  describe('once', () => {
    it('should add event to socket when socket is connected', () => {
      sandbox.stub(socket, 'getClient').returns({
        connected: true,
        once: sandbox.spy()
      });

      sandbox.spy(queue, 'add');

      const event = 'message';
      const callback = sandbox.spy();

      events.once(event, callback);

      const client = socket.getClient();

      expect(client.once).to.have.been.calledWith(event);
      expect(queue.add).to.have.callCount(0);
      expect(events.Events.size).to.equal(1);
    });

    it('should add event with default priority to queue when socket is not connected', () => {
      sandbox.stub(socket, 'getClient').returns({
        connected: false,
        once: sandbox.spy()
      });

      sandbox.spy(queue, 'add');

      const event = 'message';
      const callback = () => {};

      events.once(event, callback);

      const client = socket.getClient();

      expect(client.once).to.have.callCount(0);
      expect(queue.add).to.have.been.calledWith('once', { event, callback }, 2);
      expect(events.Events.size).to.equal(0);
    });

    it('should add event with priority to queue when socket is not connected', () => {
      sandbox.stub(socket, 'getClient').returns({
        connected: false,
        once: sandbox.spy()
      });

      sandbox.spy(queue, 'add');

      const event = 'message';
      const callback = () => {};

      events.once(event, callback, 1);

      const client = socket.getClient();

      expect(client.once).to.have.callCount(0);
      expect(queue.add).to.have.been.calledWith('once', { event, callback }, 1);
      expect(events.Events.size).to.equal(0);
    });
  });

  describe('remove', () => {
    it('should remove event from socket when socket is connected', () => {
      sandbox.stub(socket, 'getClient').returns({
        connected: true,
        on: sandbox.spy(),
        off: sandbox.spy()
      });

      const event = 'message';

      sandbox.spy(queue, 'add');
      sandbox.spy(events, 'clear');

      events.Events.add(event);

      events.remove(event);

      const client = socket.getClient();

      expect(client.off).to.have.been.calledWith(event);
      expect(queue.add).to.have.callCount(0);
      expect(events.Events.size).to.equal(0);
    });

    it('should add clear event with default priority to queue when socket is not connected', () => {
      sandbox.stub(socket, 'getClient').returns({
        connected: false,
        on: sandbox.spy(),
        off: sandbox.spy()
      });

      const event = 'message';

      sandbox.spy(queue, 'add');
      sandbox.spy(events, 'clear');

      events.Events.add(event);

      events.remove(event);

      const client = socket.getClient();

      expect(client.off).to.have.callCount(0);
      expect(queue.add).to.have.callCount(1);
      expect(queue.add).to.have.been.calledWith('remove', { event }, 2);
      expect(events.Events.size).to.equal(1);
    });

    it('should add clear event with priority to queue when socket is not connected', () => {
      sandbox.stub(socket, 'getClient').returns({
        connected: false,
        on: sandbox.spy(),
        off: sandbox.spy()
      });

      const event = 'message';

      sandbox.spy(queue, 'add');
      sandbox.spy(events, 'clear');

      events.Events.add(event);

      events.remove(event, 1);

      const client = socket.getClient();

      expect(client.off).to.have.callCount(0);
      expect(queue.add).to.have.callCount(1);
      expect(queue.add).to.have.been.calledWith('remove', { event }, 1);
      expect(events.Events.size).to.equal(1);
    });
  });
});
