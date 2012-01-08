YUI.add('terminal', function(Y) {

/**
 * Terminal is responsible for wire edition
 * 
 * @class Terminal
 * @extends TerminalBase
 * @uses TerminalDragEdit
 * @uses TerminalScissors
 * @uses TerminalGroups
 * @constructor
 * @param {Object} oConfigs The user configuration for the instance.
 */
Y.Terminal = Y.Base.create("terminal", Y.TerminalBase, [Y.TerminalDragEdit, Y.TerminalScissors, Y.TerminalGroups]);

}, '3.5.0pr1a', {requires: ['terminal-base', 'terminal-dragedit', 'terminal-scissors', 'terminal-groups']});

