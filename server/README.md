# blockswap protocol

All commands set between the blockswap client and server will be of the form:

    {
        command: 'commandname',
        version: '0.1',
        ...
    }

Where _commandname_ is the name of the command, and _..._ represents any further content required for the command.

The `version` value must always be present in all command structures.

## 0 - Server → Client Commands

These commands are only observed in the _downstream_ direction - I.e. _from_ the server _to_ the client; they should never be sent by a client. These are special commands that inform clients about the status of the blockswap dispatch server.

#### 0.1 - `sysinfo`

Sent periodically by the server, contains information about the state of the blockswap network.

    {
        command: 'sysinfo',
        version: '0.1',
        peers: 41
    }

* `peers` contains the number of clients currently connected to the server.


## 1 - Client → Client Commands

These commands are sent and received by clients. The dispatch server acts as a hub and proxies these commands to each relevant client.

### 1.1 - Storing and Obtaining Blocks

#### 1.1.1 - `put`

A request for the client to store a block.

    {
        command: 'store',
        version: '0.1',
        fuid: 'ccea30c73f9f5ce24a971e6b3f45a7e6efb03da2',
        name: 'cats.jpg',
        seq: 51,
        of: 65,
        data: '19j!9=c10kG1P}P...'
    }

* `fuid` contains the unique identifier of the file within the network that the block is part of
* `name` contains the _nice_ filename of the file that the block is part of
* `seq` contains the block sequence number
* `of` contains the number of blocks that make up the file the block is part of
* `data` contains the base64-encoded block data

#### 1.1.2 - `get`

A request for a client to send blocks of a file.

    {
        command: 'get',
        version: '0.1',
        fuid: 'ccea30c73f9f5ce24a971e6b3f45a7e6efb03da2',
        need: [51,32]
    }

* `fuid` contains the unique identifier of the file within the network that the block is part of
* `need` contains an array of sequence numbers of blocks of the file identified by `fuid` that the client requires.

On receiving this command, a client should send `block` commands for any blocks it currently owns that match the requested criteria.

#### `block` - response to a `get` request

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

### 1.2 - Searching and Receiving Results

These commands deal with searching for files stored in blockswap.

#### 1.2.1 - `query`

A request for the client to respond with a list of files (of which the client has one or more blocks of) with the name matching a search term.

    {
        command: 'query',
        version: '0.1',
        query: 'dog'
    }

* `query` contains the search term to be used when looking for matching files.


#### 1.2.2 - `hit` - response to a `query` request

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
