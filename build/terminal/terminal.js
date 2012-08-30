YUI.add('terminal', function (Y, NAME) {

/**
 * @module terminal
 */

    'use strict';

/**
 * Terminal is responsible for wire edition
 * 
 * @class Terminal
 * @extends TerminalBase
 * @uses TerminalDragEdit
 * @uses TerminalScissors
 * @uses TerminalDDGroups
 * @constructor
 * @param {Object} oConfigs The user configuration for the instance.
 */
    Y.Terminal = Y.Base.create("terminal", Y.TerminalBase, [Y.TerminalDragEdit, Y.TerminalScissors, Y.TerminalDDGroups]);




}, '@VERSION@', {"requires": ["terminal-base", "terminal-dragedit", "terminal-scissors", "terminal-ddgroups"], "skinnable": true});
