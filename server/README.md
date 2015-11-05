# blockswap protocol

All commands set between the blockswap client and server will be of the form:

    {
        command: 'commandname',
        version: '0.1',
        ...
    }

Where _commandname_ is the name of the command, and _..._ represents any further content required for the command.

The `version` value must always be present in all command structures.

## Server → Client Commands

These commands are only observed in the _downstream_ direction - I.e. _from_ the server _to_ the client.

### `sysinfo`

Sent periodically by the server, contains information about the state of the blockswap network.

    {
        command: 'sysinfo',
        version: '0.1',
        peers: 41
    }

* `peers` contains the number of peers currently connected to the server.

### `put`

A request for the client to store a block.

    {
        command: 'store',
        version: '0.1',
        fuid: 'ccea30c73f9f5ce24a971e6b3f45a7e6efb03da2',
        name: 'cats.jpg',
        seq: 51,
        of: 65
    }

* `fuid` contains the unique identifier of the file within the network that the block is part of
* `name` contains the _nice_ filename of the file that the block is part of
* `seq` contains the block sequence number
* `of` contains the number of blocks that make up the file the block is part of

### `get`

A request for the client to send a block.

    {
        command: 'get',
        version: '0.1',
        fuid: 'ccea30c73f9f5ce24a971e6b3f45a7e6efb03da2',
        seq: 51
    }

* `fuid` contains the unique identifier of the file within the network that the block is part of
* `seq` contains the block sequence number

### `delete`

A request for the client to delete a block.

    {
        command: 'delete',
        version: '0.1',
        fuid: 'ccea30c73f9f5ce24a971e6b3f45a7e6efb03da2',
        seq: 51
    }

* `fuid` contains the unique identifier of the file within the network that the block is part of
* `seq` contains the block sequence number

### `query`

A request for the client to respond with a list of files (of which the client has one or more blocks of) with the name matching a search term.

    {
        command: 'query',
        version: '0.1',
        query: 'dog'
    }

* `query` contains the search term to be used when looking for matching files.


## Client → Server Commands

These commands are only observed in the _upstream_ direction - I.e. _from_ the client _to_ the server.

### `block` - response to a `get` request

A response to the server containing a block that was requested with a `get` command.

    {
        command: 'block',
        version: '0.1',
        fuid: 'ccea30c73f9f5ce24a971e6b3f45a7e6efb03da2',
        seq: 51,
        data: '19j!9=c10kG1P}P...'
    }

* `fuid` contains the unique identifier of the file within the network that the block is part of
* `seq` contains the block sequence number
* `data` contains the base64-encoded block data

### `hit` - response to a `query` request

A response to the server indicating a hit - a match for a search term in a `query` command.

    {
        command: 'hit',
        version: '0.1',
        files: [
            {
                name: 'cats.jpg',
                fuid: 'ccea30c73f9f5ce24a971e6b3f45a7e6efb03da2',
                have: [20,21,22,23]
            },
            ...
        ]
    }

* `files` contains a list of files that the client has that match the search query:
    * `fuid` contains the unique identifier of the file within the network that the block is part of
    * `name` contains the _nice_ filename of the file that the block is part of
    * `have` contains an array of block sequence numbers that the client has for the file
    
### `clientinfo` - unsolicited information about the client

Information about the current state of the client.

	{
		command: 'clientinfo',
		version: '0.1',
		capacity: 560,
		used: 410,		
	} 
	
* `capacity` contains the total number of blocks that the client can store
* `used` contains the total number of blocks currently held by the client
