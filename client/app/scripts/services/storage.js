'use strict';

/**
 * @ngdoc service
 * @name blockswapClient.Storage
 * @description
 * # Storage
 * Service in the blockswapClient.
 */
angular.module('blockswapClient')
  .service('BlockStorage', ['$log', '$rootScope', 'localStorageService', 'config', function ($log, $rootScope, localStorage, config) {

    localStorage.clearAll();

    /**
     * List of callbacks to run when the block store is updated.
     *
     * @type {Array}
     */
    this.updateCallbacks = [];

    /**
     * Store a single block locally.
     *
     * @param block
     */
    this.store = function (block) {
      $log.debug('store block with fuid:', block.fuid, 'and seq:', block.seq);
      localStorage.set(block.fuid + '-' + block.seq, JSON.stringify(block));

      for (var callbackIndex = 0; callbackIndex < this.updateCallbacks.length; callbackIndex ++) {
        this.updateCallbacks[callbackIndex]();
      }
    };

    /**
     * Get all blocks currently in storage.
     *
     * @return {Array}[]
     */
    this.getAllBlocks = function () {

      var keys = localStorage.keys();
      var values = [];

      for (var keyIndex = 0; keyIndex < keys.length; keyIndex ++) {
        var value = null, key = keys[keyIndex];
        if (value = localStorage.get(key)) {
          values.push(JSON.parse(value));
        }
      }

      return values;
    };

    /**
     * Get all files currently in storage.
     * Effectively marshalls all our blocks into a list of files.
     *
     * @return {{}}[]
     */
    this.getAllFiles = function () {

      var blocks = this.getAllBlocks();
      var files = {};

      for (var blockIndex = 0; blockIndex < blocks.length; blockIndex ++) {

        var block = blocks[blockIndex];

        if (!files.hasOwnProperty(block.fuid)) {
          files[block.fuid] = {
            name: block.name,
            mime: block.mime,
            total: block.of,
            have: 0,
            blocks: []
          }
        }

        files[block.fuid].blocks.push(block);
        files[block.fuid].have ++;
      }

      return files;
    };

    /**
     * Split up a file into blocks and store them.
     *
     * @param name
     * @param mimeType
     * @param data
     */
    this.splitAndStore = function (name, mimeType, data) {

      // Derive a file-unique ID for the file
      var seed = CryptoJS.lib.WordArray.random(128/8);
      var fuid = CryptoJS.SHA1(seed).toString();
      $log.debug('created new fuid', fuid);

      // Work out how many blocks we need
      var total = Math.ceil(data.length / config.blockSize);

      // Store each block
      for (var blockSeq = 0; blockSeq < total; blockSeq ++) {

        var block = {
          data: data.slice(blockSeq * config.blockSize, (blockSeq + 1) * config.blockSize),
          fuid: fuid,
          name: name,
          mime: mimeType,
          seq: blockSeq + 1,
          of: total
        };

        // Store the block
        this.store(block);

        // Announce that a new block was born
        $rootScope.$broadcast('blockWasBorn', {
          block: block
        });
      }
    };

    /**
     * Try to join-together a file we own and provide the finished base64 string of it.
     *
     * @param fuid
     * @param finished
     * @return string
     */
    this.joinAndRetrieve = function (fuid, finished) {

      // Find blocks that belong to the file in our local storage
      var blocks = this.getAllBlocks();
      var content = [];

      for (var blockIndex = 0; blockIndex < blocks.length; blockIndex ++) {
        var block = blocks[blockIndex];
        if (fuid == block.fuid) {
          content[block.seq] = block.data;
        }
      }

      finished(content.join(''));
    };

    /**
     * Convert a base64 string to a binary data buf.
     *
     * @param base64Data
     * @param contentType
     * @returns {Blob}
     */
    this.decodeBase64 = function (base64Data, contentType) {
      contentType = contentType || '';

      var byteCharacters = atob(base64Data);
      var byteArrays = [];

      for (var offset = 0; offset < byteCharacters.length; offset += 512) {
        var slice = byteCharacters.slice(offset, offset + 512);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      return new Blob(byteArrays, {type: contentType});
    };

    /**
     * Register a callback to run when the files list is updated.
     *
     * @param callback
     */
    this.onUpdate = function (callback) {
      if (!this.updateCallbacks.indexOf(callback)) {
        this.updateCallbacks.push(callback);
      }
    };

  }]);
