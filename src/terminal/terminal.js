/**
 * @module terminal
 */
YUI.add('terminal', function(Y) {

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

}, '3.5.1', {requires: ['terminal-base', 'terminal-dragedit', 'terminal-scissors', 'terminal-ddgroups']});

