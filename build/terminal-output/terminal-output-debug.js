YUI.add('terminal-output', function (Y, NAME) {

/**
 * @module terminal-output
 */

'use strict';

/**
 * Class that extends Terminal to differenciate Input/Output terminals
 * @class TerminalOutput
 * @extends Terminal
 * @constructor
 * @param {Object} oConfigs The user configuration for the instance.
 */
Y.TerminalOutput = Y.Base.create("terminal-output", Y.Terminal, [], {

  getClassName: function(n) {
    return "yui3-terminal-"+n;
  }

}, {
  ATTRS: {

    dir: {
      value: [0.3, 0]
    },

    ddGroupsDrag: {
      value: ['output']
    },

    ddGroupsDrop: {
      value: ['input']
    }

    // TODO
    // alwaysSrc: true

  }
});

}, '@VERSION@', {"requires": ["terminal"]});
