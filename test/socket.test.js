import chai, { expect } from 'chai';
import io from 'socket.io-client';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import * as events from '../src/events';
import * as socket from '../src/socket';
import * as queue from '../src/queue';

chai.use(sinonChai);

describe('socket', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    events.Events.clear();
    queue.Queue.clear();
    socket.disconnect();

    sandbox.restore();
  });

  describe('getClient', () => {
    it('should return undefined if no client is connected', () => {
      const client = socket.getClient();

      expect(client).to.equal(undefined);
    });

    it('should return client if client is connected', () => {
      const dummyClient = {
        connected: false,
        on: sandbox.spy()
      };

      sandbox.stub(io, 'connect').returns(dummyClient);

      socket.connect('test');

      const client = socket.getClient();

      expect(client).to.equal(dummyClient);
    });
  });

  describe('isConnected', () => {
    it('should return false if no client is connected', () => {
      const isConnected = socket.isConnected();

      expect(isConnected).to.equal(false);
    });

    it('should return false if client is disconnected', () => {
      const dummyClient = {
        connected: false,
        on: sandbox.spy()
      };

      sandbox.stub(io, 'connect').returns(dummyClient);

      socket.connect('test');

      const isConnected = socket.isConnected();

      expect(isConnected).to.equal(false);
    });

    it('should return true if client is connected', () => {
      const dummyClient = {
        connected: true,
        on: sandbox.spy()
      };

      sandbox.stub(io, 'connect').returns(dummyClient);

      socket.connect('test');

      const isConnected = socket.isConnected();

      expect(isConnected).to.equal(true);
    });
  });

  describe('emit', () => {
    it('should emit event if client is connected', () => {
      const dummyClient = {
        connected: true,
        on: sandbox.spy(),
        emit: sandbox.spy()
      };

      sandbox.stub(io, 'connect').returns(dummyClient);

      socket.connect('test');

      const event = 'event';
      const data = {};

      socket.emit(event, data);

      expect(dummyClient.emit).to.have.callCount(1);
    });

    it('should add emit event to queue if client is not connected', () => {
      const dummyClient = {
        connected: false,
        on: sandbox.spy(),
        emit: sandbox.spy()
      };

      sandbox.stub(io, 'connect').returns(dummyClient);
      sandbox.spy(queue, 'add');

      socket.connect('test');

      const event = 'event';
      const data = {};

      socket.emit(event, data);

      expect(dummyClient.emit).to.have.callCount(0);
      expect(queue.add).to.have.callCount(1);
    });

    it('should add emit event to queue if client is not connected with priority', () => {
      const dummyClient = {
        connected: false,
        on: sandbox.spy(),
        emit: sandbox.spy()
      };

      sandbox.stub(io, 'connect').returns(dummyClient);
      sandbox.spy(queue, 'add');

      socket.connect('test');

      const event = 'event';
      const data = {};

      socket.emit(event, data, 1);

      expect(dummyClient.emit).to.have.callCount(0);
      expect(queue.add).to.have.callCount(1);
      expect(queue.add).to.have.been.calledWithExactly('emit', { event, data }, 1);
    });
  });

  describe('on', () => {
    it('should add on event', () => {
      sandbox.spy(events, 'add');

      const event = 'event';
      const data = {};

      socket.on(event, data);

      expect(events.add).to.have.callCount(1);
      expect(events.add).to.have.been.calledWithExactly(event, data, 2);
    });

    it('should add on event with priority', () => {
      sandbox.spy(events, 'add');

      const event = 'event';
      const data = {};

      socket.on(event, data, 1);

      expect(events.add).to.have.callCount(1);
      expect(events.add).to.have.been.calledWithExactly(event, data, 1);
    });
  });

  describe('once', () => {
    it('should add once event', () => {
      sandbox.spy(events, 'once');

      const event = 'event';
      const data = {};

      socket.once(event, data);

      expect(events.once).to.have.callCount(1);
      expect(events.once).to.have.been.calledWithExactly(event, data, 2);
    });

    it('should add once event with priority', () => {
      sandbox.spy(events, 'once');

      const event = 'event';
      const data = {};

      socket.once(event, data, 1);

      expect(events.once).to.have.callCount(1);
      expect(events.once).to.have.been.calledWithExactly(event, data, 1);
    });
  });

  describe('off', () => {
    it('should add off event', () => {
      sandbox.spy(events, 'remove');

      const event = 'event';

      socket.off(event);

      expect(events.remove).to.have.callCount(1);
      expect(events.remove).to.have.been.calledWithExactly(event, 2);
    });

    it('should add off event with priority', () => {
      sandbox.spy(events, 'remove');

      const event = 'event';

      socket.off(event, 1);

      expect(events.remove).to.have.callCount(1);
      expect(events.remove).to.have.been.calledWithExactly(event, 1);
    });
  });

  describe('connect', () => {
    it('should return client if already connected', () => {
      const dummyClient = {
        connected: true,
        on: sandbox.spy(),
        emit: sandbox.spy()
      };

      sandbox.stub(io, 'connect').returns(dummyClient);

      const exisitingClient = socket.connect('test');

      const result = socket.connect('test');

      expect(exisitingClient).to.equal(result);
    });

    it('should throw error if no uri is provided', () => {
      const dummyClient = {
        connected: true,
        on: sandbox.spy(),
        emit: sandbox.spy()
      };

      sandbox.stub(io, 'connect').returns(dummyClient);

      try {
        socket.connect();
      } catch (error) {
        expect(error.message).to.equal('Please specify connection uri for socket');
      }
    });

    it('should return client and register on events', () => {
      const dummyClient = {
        connected: false,
        on: sandbox.spy(),
        emit: sandbox.spy()
      };

      sandbox.stub(io, 'connect').returns(dummyClient);

      const client = socket.connect('test');

      expect(dummyClient.on).to.have.callCount(3);

      expect(dummyClient.on.firstCall).to.have.been.calledWith('connect', socket.onConnect);
      expect(dummyClient.on.secondCall).to.have.been.calledWith('ping', socket.onPing);
      expect(dummyClient.on.thirdCall).to.have.been.calledWith('disconnect', socket.onDisconnect);
      expect(client).to.equal(dummyClient);
    });
  });

  describe('disconnect', () => {
    it('should set client to undefined', () => {
      socket.disconnect();

      expect(socket.getClient()).to.equal(undefined);
    });
    it('should call socket disconnect when client is connected', () => {
      const dummyClient = {
        connected: true,
        on: sandbox.spy(),
        emit: sandbox.spy(),
        disconnect: sandbox.spy()
      };

      sandbox.stub(io, 'connect').returns(dummyClient);

      socket.connect('test');

      socket.disconnect();

      expect(dummyClient.disconnect).to.have.callCount(1);
      expect(socket.getClient()).to.equal(undefined);
    });
  });

  describe('onConnect', () => {
    it('should call runQueue', () => {
      sandbox.spy(queue, 'runQueue');

      const dummyClient = {
        connected: true,
        on: sandbox.spy(),
        emit: sandbox.spy()
      };

      sandbox.stub(io, 'connect').returns(dummyClient);

      socket.connect('test');

      socket.onConnect();

      expect(queue.runQueue).to.have.callCount(1);
      expect(queue.runQueue).to.have.been.calledWithExactly(socket.runQueueResult);
    });
  });

  describe('onPing', () => {
    it('should call runQueue', () => {
      sandbox.spy(queue, 'runQueue');

      const dummyClient = {
        connected: true,
        on: sandbox.spy(),
        emit: sandbox.spy()
      };

      sandbox.stub(io, 'connect').returns(dummyClient);

      socket.connect('test');

      socket.onPing();

      expect(queue.runQueue).to.have.callCount(1);
      expect(queue.runQueue).to.have.been.calledWithExactly(socket.runQueueResult);
    });
  });

  describe('onDisconnect', () => {
    it('should call runQueue', () => {
      sandbox.spy(events, 'clear');
      sandbox.spy(queue, 'flush');

      const dummyClient = {
        connected: true,
        on: sandbox.spy(),
        emit: sandbox.spy()
      };

      sandbox.stub(io, 'connect').returns(dummyClient);

      socket.connect('test');

      socket.onDisconnect();

      expect(events.clear).to.have.callCount(1);
      expect(queue.flush).to.have.callCount(1);
    });
  });

  describe('runQueueResult', () => {
    it('should return false if no key matches', () => {
      sandbox.spy(events, 'clear');
      sandbox.spy(queue, 'flush');

      const result = socket.runQueueResult();
      expect(result).to.equal(false);
    });

    it('should call events add', () => {
      sandbox.spy(events, 'add');

      socket.runQueueResult({ key: 'add' });
      expect(events.add).to.have.callCount(1);
    });

    it('should call events once', () => {
      sandbox.spy(events, 'once');

      socket.runQueueResult({ key: 'once' });
      expect(events.once).to.have.callCount(1);
    });

    it('should call events remove', () => {
      sandbox.spy(events, 'remove');

      socket.runQueueResult({ key: 'remove' });
      expect(events.remove).to.have.callCount(1);
    });

    it('should call events clear', () => {
      sandbox.spy(events, 'clear');

      socket.runQueueResult({ key: 'clear' });
      expect(events.clear).to.have.callCount(1);
    });

    it('should call events emit', () => {
      sandbox.spy(queue, 'add');

      socket.runQueueResult({ key: 'emit' });

      expect(queue.add).to.have.callCount(1);
    });
  });
});
