YUI.add('terminal-input', function (Y, NAME) {

/**
 * @module terminal-input
 */

'use strict';

/**
 * Class that extends Terminal to differenciate Input/Output terminals
 * @class TerminalInput
 * @extends Terminal
 * @constructor
 * @param {Object} oConfigs The user configuration for the instance.
 */
Y.TerminalInput = Y.Base.create("terminal-input", Y.Terminal, [], {

  getClassName: function(n) {
    return "yui3-terminal-"+n;
  }

}, {
  ATTRS: {

    dir: {
      value: [-0.3, 0]
    },

    ddGroupsDrag: {
      value: ['input']
    },

    ddGroupsDrop: {
      value: ['output']
    }

    // TODO
    // nMaxWires: 1,

  }
});


}, '@VERSION@', {"requires": ["terminal"]});
