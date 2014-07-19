YUI_config.groups.wireit.base = '../../build/';

YUI({
	// Uncomment this line in debug mode
	filter: 'raw'
}).use('wireit-app', 'image-container', 'terminal-input', 'terminal-output', function (Y) {

	window.Y = Y; // debug

	var containers_definitions = [
			{
				name: "AND",
				config: {
					type: "AndGate",
					imageUrl: "images/gate_and.png",
					children: [
						{ offset: [-2, 13], name: '_INPUT1', type: 'TerminalInput' },
						{ offset: [-2, 40], name: '_INPUT2', type: 'TerminalInput' },
						{ offset: [80, 26], name: '_OUTPUT', type: 'TerminalOutput' }
					]
				}
			},
			{
				name: "OR",
				config: {
					type: "OrGate",
					imageUrl: 'images/gate_or.png',
					children: [
						{ offset: [-2, 13], name: '_INPUT1', type: 'TerminalInput' },
						{ offset: [-2, 40], name: '_INPUT2', type: 'TerminalInput' },
						{ offset: [80, 26], name: '_OUTPUT', type: 'TerminalOutput' }
					]
				}
			},
			{
		  		name: "NOT",
		  		config: {
					type: "NotGate", 
			   		imageUrl: "images/gate_not.png",
					children: [
						{ offset: [-5, 27], name: '_INPUT', type: 'TerminalInput' },
						{ offset: [85, 27], name: '_OUTPUT', type: 'TerminalOutput' }
					]
				}
			},
			{
		   		name: "NAND",
				config: {
			   		type: "NandGate", 
			   		imageUrl: "images/gate_nand.png",
					children: [
						{ offset: [-2, 13], name: '_INPUT1', type: 'TerminalInput' },
						{ offset: [-2, 40], name: '_INPUT2', type: 'TerminalInput' },
						{ offset: [80, 26], name: '_OUTPUT', type: 'TerminalOutput' }
					]
				}
			},
			{
		   		name: "XOR",
				config: {
		   			type: "XorGate", 
		   			imageUrl: "images/gate_xor.png",
					children: [
						{ offset: [-2, 13], name: '_INPUT1', type: 'TerminalInput' },
						{ offset: [-2, 40], name: '_INPUT2', type: 'TerminalInput' },
						{ offset: [80, 26], name: '_OUTPUT', type: 'TerminalOutput' }
					]
				}
			},
			{
				name: "Lightbulb",
				config : {
					type: "Lightbulb", 
					imageUrl: "images/lightbulb_off.png",
  					children: [
  						{ offset: [20, 65], dir: [0, 0.3], name: '_INPUT', type: 'TerminalInput' }
  					]
				}
			},
			{
				name: "Switch",
				config : {
					type:"Switch", 
					imageUrl: "images/switch_off.png",
	  				children: [
  						{ offset: [54, 26], dir: [0.3, 0], name: '_OUTPUT', type: 'TerminalOutput' }
  					]
				}
			},
			{
				name: "Clock",
				config : {
					type: "ClockContainer", 
					imageUrl: "images/clock_off.png",
  					children: [
  						{ offset: [58, 19], dir: [0.3, 0], name: '_OUTPUT', type: 'TerminalOutput' }
  					]
				}
			}
	];

	/**
	 * LogicContainer is the base class for all containers in this example.
	 * It is never instantiated directly, but used in subclasses which reacts to its events.
	 */
	Y.LogicContainer = Y.Base.create("logic-container", Y.ImageContainer, [], {

		initializer: function() {

			// listen for input events. The 'afterLogicInputsChange' can be overriden if needed.
			this.after('logicInputsChange', this.afterLogicInputsChange, this);
	
			// Listen for changes on the output value, to fire the changes on connected containers
			this.after('logicOutputChange', this._afterLogicOutputChange, this);

			// Listen for the addChild event to save reference to the 'output' terminal
			this.on('addChild', function(e) {
				var term = e.details[0].child;
				if(term.get('name') === '_OUTPUT') {
					this.set('outputTerminal', term);
				}
			}, this);
		},

		// Small helper method to switch the output value
		switchLogicOutput: function() {
			this.set('logicOutput', !this.get('logicOutput') );
		},

		afterLogicInputsChange: function(e) {
			// Needs to be overrided
		},

		// This method updates the color of wires connected to the '_OUTPUT' terminal,
		// and change the input values of the connected containers
		_afterLogicOutputChange: function(e) {
			var bStatus = e.newVal,
				term = this.get('outputTerminal');

			for(var j = 0, n = term._wires.length; j < n ; j++) {
				var wire = term._wires[j],
					otherTerm = wire.getOtherTerminal(term);
				if(otherTerm.get('parent')) {
					otherTerm.get('parent').set('logicInputs.'+otherTerm.get('name'), bStatus);
				}
				var c_value = bStatus ? "rgb(173,216,230)" : "rgb(250,250,250)";
				wire.set("stroke",{color: c_value});
			}
		}

	}, {
		ATTRS: {

			outputTerminal: {
				value: null
			},

			logicInputs: {
				value: {
					_INPUT1: false,
					_INPUT2: false,
					_INPUT: false
				}
			},

			logicOutput: {
				value: false
			},

			// Override default resizable
			resizable: { value: false }
		}
	});


	Y.ClockContainer = Y.Base.create("clock-container", Y.LogicContainer, [], {
		initializer: function() {
			this.after('logicOutputChange', this._updateClockImage, this);
			setInterval(Y.bind(this.switchLogicOutput, this), 800);
		},
		_updateClockImage: function(e) {
			this.set('imageUrl', "images/clock_"+(e.newVal ? "on" : "off")+".png");
		}
	});

	Y.Switch = Y.Base.create("switch-container", Y.LogicContainer, [], {
		bindUI: function() {
         
         Y.Switch.superclass.bindUI.apply(this);

			this.image.on('click', function() {
				this.switchLogicOutput();
				this.set('imageUrl', "images/switch_"+(this.get('logicOutput') ? "on" : "off")+".png");
			}, this);
		}
	});

	Y.AndGate = Y.Base.create("andgate-container", Y.LogicContainer, [], {
		afterLogicInputsChange: function(e) {
			this.set('logicOutput', e.newVal._INPUT1 && e.newVal._INPUT2 );
		}
	});

	Y.OrGate = Y.Base.create("orgate-container", Y.LogicContainer, [], {
		afterLogicInputsChange: function(e) {
			this.set('logicOutput', e.newVal._INPUT1 || e.newVal._INPUT2 );
		}
	});

	Y.XorGate = Y.Base.create("xorgate-container", Y.LogicContainer, [], {
		afterLogicInputsChange: function(e) {
			this.set('logicOutput', (!e.newVal._INPUT1 && e.newVal._INPUT2) || (e.newVal._INPUT1 && !e.newVal._INPUT2) );
		}
	});

	Y.NandGate = Y.Base.create("nandgate-container", Y.LogicContainer, [], {
		afterLogicInputsChange: function(e) {
			this.set('logicOutput', !(e.newVal._INPUT1 && e.newVal._INPUT2) );
		}
	});

	Y.NotGate = Y.Base.create("notgate-container", Y.LogicContainer, [], {
		afterLogicInputsChange: function(e) {
			this.set('logicOutput', !e.newVal._INPUT);
		}
	});

	Y.Lightbulb = Y.Base.create("lightbulb-container", Y.LogicContainer, [], {
		afterLogicInputsChange: function(e) {
			this.set('imageUrl', "images/lightbulb_"+(e.newVal._INPUT ? "on" : "off")+".png");
		}
	});


	var wirings = new Y.WiringModelList();
	wirings.load();
	
	Y.wireitApp = new Y.WireItApp({
		// We force this to false for this example app because there is no server.
		serverRouting: false,
		containerTypes: new Y.ContainerTypeList({
			items: containers_definitions
		}),
		modelList: wirings
	});

	Y.wireitApp.render();

});
