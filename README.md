# cached-socket.io

> Socket.io client with offline caching

## Installation

Install using [npm](https://www.npmjs.org/):

```sh
npm install cached-socket.io
```

## API Reference

  Socket module


* [socket](#module_socket)
    * [~getClient()](#module_socket..getClient) ⇒
    * [~isConnected()](#module_socket..isConnected) ⇒ <code>Boolean</code>
    * [~emit(event, data, priority)](#module_socket..emit)
    * [~on(event, callback, priority)](#module_socket..on)
    * [~off(event, priority)](#module_socket..off)
    * [~once(event, callback, priority)](#module_socket..once) ⇒
    * [~connect(uri, options)](#module_socket..connect) ⇒

<a name="module_socket..getClient"></a>

### socket~getClient() ⇒
Retrieve the client

**Kind**: inner method of [<code>socket</code>](#module_socket)  
**Returns**: socket.io client  
**Access**: public  
<a name="module_socket..isConnected"></a>

### socket~isConnected() ⇒ <code>Boolean</code>
Check if the socket is connected

**Kind**: inner method of [<code>socket</code>](#module_socket)  
**Returns**: <code>Boolean</code> - socket connection status  
**Access**: public  
<a name="module_socket..emit"></a>

### socket~emit(event, data, priority)
Send an event to the socket, when the socket is not connected, add an emit event to the cache.

**Kind**: inner method of [<code>socket</code>](#module_socket)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| event | <code>String</code> |  | The event name that needs to be added to the socket. |
| data | <code>Object</code> |  | The data to send to the socket when the event is triggered. |
| priority | <code>Number</code> | <code>2</code> | The priority of the event. |

<a name="module_socket..on"></a>

### socket~on(event, callback, priority)
Wrapper around socket.on that adds priority and caching

**Kind**: inner method of [<code>socket</code>](#module_socket)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| event | <code>String</code> |  | The event name that needs to be added to the socket. |
| callback | <code>function</code> |  | The callback function that the sockets call when the event is triggered. |
| priority | <code>Number</code> | <code>2</code> | The priority of the event. |

<a name="module_socket..off"></a>

### socket~off(event, priority)
Wrapper around socket.off that adds priority and caching

**Kind**: inner method of [<code>socket</code>](#module_socket)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| event | <code>String</code> |  | The event name that needs to be added to the socket. |
| priority | <code>Number</code> | <code>2</code> | The priority of the event. |

<a name="module_socket..once"></a>

### socket~once(event, callback, priority) ⇒
Wrapper around socket.once that adds priority and caching

**Kind**: inner method of [<code>socket</code>](#module_socket)  
**Returns**: socket.io client  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| event | <code>String</code> |  | The event name that needs to be added to the socket. |
| callback | <code>function</code> |  | The callback function that the sockets call when the event is triggered. |
| priority | <code>Number</code> | <code>2</code> | The priority of the event. |

<a name="module_socket..connect"></a>

### socket~connect(uri, options) ⇒
Connect to socket.io, if socket is already connected, returns that socket.

**Kind**: inner method of [<code>socket</code>](#module_socket)  
**Returns**: socket.io client  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| uri | <code>String</code> | The connection uri of the host. |
| options | <code>Object</code> | Options object used by socket.io. |

  Events module


* [events](#module_events)
    * [~add(event, callback, priority)](#module_events..add)
    * [~once(event, callback, priority)](#module_events..once)
    * [~clear(priority)](#module_events..clear)
    * [~get()](#module_events..get) ⇒ <code>Array.&lt;Object&gt;</code>
    * [~remove(event, priority)](#module_events..remove)

<a name="module_events..add"></a>

### events~add(event, callback, priority)
Adds a socket event to the socket, when the socket is not connected, add the add event to the cache.

**Kind**: inner method of [<code>events</code>](#module_events)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| event | <code>String</code> |  | The event name that needs to be added to the socket. |
| callback | <code>function</code> |  | The callback function that the sockets call when the event is triggered. |
| priority | <code>Number</code> | <code>2</code> | The priority of the event. |

<a name="module_events..once"></a>

### events~once(event, callback, priority)
Adds a single run socket event to the socket, when the socket is not connected, add the once event to the cache.

**Kind**: inner method of [<code>events</code>](#module_events)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| event | <code>String</code> |  | The event name that needs to be added to the socket. |
| callback | <code>function</code> |  | The callback function that the sockets call when the event is triggered. |
| priority | <code>Number</code> | <code>2</code> | The priority of the event. |

<a name="module_events..clear"></a>

### events~clear(priority)
Remove all socket events from the socket, when the socket is not connected, add the clear event to the cache.

**Kind**: inner method of [<code>events</code>](#module_events)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| priority | <code>Number</code> | <code>2</code> | The priority of the event. |

<a name="module_events..get"></a>

### events~get() ⇒ <code>Array.&lt;Object&gt;</code>
Retrieve all registered events

**Kind**: inner method of [<code>events</code>](#module_events)  
**Returns**: <code>Array.&lt;Object&gt;</code> - Registered events  
**Access**: public  
<a name="module_events..remove"></a>

### events~remove(event, priority)
Remove a socket event from the socket, when the socket is not connected, add a remove event to the cache.

**Kind**: inner method of [<code>events</code>](#module_events)  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| event | <code>String</code> |  | The event name that needs to be added to the socket. |
| priority | <code>Number</code> | <code>2</code> | The priority of the event. |

## Contributing

Please submit all issues and pull requests to the [anchorchat/cached-socket.io](http://github.com/anchorchat/cached-socket.io) repository!

## Tests

Run tests using `npm test`.

## Releasing

Make sure your working directory is clean!

    git checkout master && git fetch && git merge origin/master
    npm run prepare
    npm version <patch|minor|major> -m '<commit message containing changes for this release>'
    git push origin master
    git push --tags
    npm publish

## Support

If you have any problem or suggestion please open an issue [here](https://github.com/anchorchat/cached-socket.io/issues).