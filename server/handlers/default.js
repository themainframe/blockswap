module.exports = {

  /**
   * Handle all other types of message.
   */
  handle: function (message, peerId, peers) {

    // Proxy the message to every other node
    for (var activePeer in peers) {
      if (peers.hasOwnProperty(activePeer) && activePeer != peerId) {
        peers[activePeer].sendUTF(message.utf8Data);
      }
    }

  }

};