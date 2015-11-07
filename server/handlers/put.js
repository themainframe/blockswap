module.exports = {

  /**
   * Handle put-type commands
   */
  handle: function (message, peerId, peers) {

    // Ensure we're not eligble to be sent our own put command
    var activePeerIds = Object.keys(peers);

    console.log(peerId);
    console.log(activePeerIds);

    activePeerIds = activePeerIds.filter(function (element) {
      return element != peerId;
    });

    if (activePeerIds.length == 0) {
      console.log('! nobody to proxy put command to');
      return;
    }

    // Select a random peer
    var selectedPeer = activePeerIds[Math.floor(Math.random() * activePeerIds.length)];
    console.log('sending to ' + selectedPeer);

    // Proxy the message to a random peer
    peers[selectedPeer].sendUTF(message.utf8Data);

  }

};