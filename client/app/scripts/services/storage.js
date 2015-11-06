'use strict';

/**
 * @ngdoc service
 * @name blockswapClient.Storage
 * @description
 * # Storage
 * Service in the blockswapClient.
 */
angular.module('blockswapClient')
  .service('BlockStorage', ['$log', 'localStorageService', 'config', function ($log, localStorage, config) {

    /**
     * Store a single block locally.
     *
     * @param block
     */
    this.store = function (block) {
      $log.debug('store block with fuid:', block.fuid, 'and seq:', block.seq);
      localStorage.set(block.fuid + '-' + block.seq, JSON.stringify(block));
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
        this.store({
          data: data.slice(blockSeq * config.blockSize, (blockSeq + 1) * config.blockSize),
          fuid: fuid,
          name: name,
          mime: mimeType,
          seq: blockSeq + 1,
          of: total
        });
      }

    };

  }]);
