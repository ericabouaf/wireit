
var logicGatesLang = {

	// Set a unique name for the language
	languageName: "logicGates",

	// List of node types definition
	modules: [
		{
			"name": "AND",
			"category": "gate",
			"container" : {
				"xtype":"WireIt.ImageContainer", 
				"image": "../logicGates/images/gate_and.png",
  				"terminals": [
  					{"name": "_INPUT1", "direction": [-1,0], "offsetPosition": {"left": -3, "top": 2 },"ddConfig": {"type": "input","allowedTypes": ["output"]}, "nMaxWires": 1 },
  					{"name": "_INPUT2", "direction": [-1,0], "offsetPosition": {"left": -3, "top": 37 },"ddConfig": {"type": "input","allowedTypes": ["output"]}},
  					{"name": "_OUTPUT", "direction": [1,0], "offsetPosition": {"left": 103, "top": 20 },"ddConfig": {"type": "output","allowedTypes": ["input"]}}
  				]
			}

		},

		{
		  "name": "OR",	
			"category": "gate",
			"container": {
		   		"xtype":"WireIt.ImageContainer", 
		   		"image": "../logicGates/images/gate_or.png",
					"terminals": [
						{"name": "_INPUT1", "direction": [-1,0], "offsetPosition": {"left": -3, "top": 2 },"ddConfig": {"type": "input","allowedTypes": ["output"]}, "nMaxWires": 1 },
						{"name": "_INPUT2", "direction": [-1,0], "offsetPosition": {"left": -3, "top": 37 },"ddConfig": {"type": "input","allowedTypes": ["output"]}},
						{"name": "_OUTPUT", "direction": [1,0], "offsetPosition": {"left": 103, "top": 20 },"ddConfig": {"type": "output","allowedTypes": ["input"]}}
					]
			}
		},

		{
		  "name": "NOT",	
			"category": "gate",
		  "container": {
				"xtype":"WireIt.ImageContainer", 
			   "image": "../logicGates/images/gate_not.png",
				"terminals": [
					{"name": "_INPUT", "direction": [-1,0], "offsetPosition": {"left": -12, "top": 23 },"ddConfig": {"type": "input","allowedTypes": ["output"]}, "nMaxWires": 1 },
					{"name": "_OUTPUT", "direction": [1,0], "offsetPosition": {"left": 117, "top": 23 },"ddConfig": {"type": "output","allowedTypes": ["input"]}}
				]
			}
		},

		{
		   "name": "NAND",
			"category": "gate",
		   "container": {
			   "xtype":"WireIt.ImageContainer", 
			   "image": "../logicGates/images/gate_nand.png",
				"terminals": [
					{"name": "_INPUT1", "direction": [-1,0], "offsetPosition": {"left": -3, "top": 2 },"ddConfig": {"type": "input","allowedTypes": ["output"]}, "nMaxWires": 1 },
					{"name": "_INPUT2", "direction": [-1,0], "offsetPosition": {"left": -3, "top": 37 },"ddConfig": {"type": "input","allowedTypes": ["output"]}, "nMaxWires": 1 },
					{"name": "_OUTPUT", "direction": [1,0], "offsetPosition": {"left": 103, "top": 20 }, "ddConfig": {"type": "output","allowedTypes": ["input"]}}
				]
			}
		},

		{
		   "name": "XOR",
			"category": "gate",
		   "container": {
		   	"xtype":"WireIt.ImageContainer", 
		   	"image": "../logicGates/images/gate_xor.png",
				"terminals": [
					{"name": "_INPUT1", "direction": [-1,0], "offsetPosition": {"left": -3, "top": 2 },"ddConfig": {"type": "input","allowedTypes": ["output"]}, "nMaxWires": 1 },
					{"name": "_INPUT2", "direction": [-1,0], "offsetPosition": {"left": -3, "top": 37 },"ddConfig": {"type": "input","allowedTypes": ["output"]}, "nMaxWires": 1 },
					{"name": "_OUTPUT", "direction": [1,0], "offsetPosition": {"left": 103, "top": 20 },"ddConfig": {"type": "output","allowedTypes": ["input"]}}
				]
			}
		},

		{
			"name": "A",
			"category": "variable",
			"container" : {
				"xtype":"WireIt.ImageContainer", 
				"image": "../logicGates/images/A.png",
  				"terminals": [
  					{"name": "_OUTPUT", "direction": [1,0], "offsetPosition": {"left": 94, "top": 18 },"ddConfig": {"type": "output","allowedTypes": ["input"]}}
  				]
			}
		},

		{
			"name": "B",
			"category": "variable",
			"container" : {
				"xtype":"WireIt.ImageContainer", 
				"image": "../logicGates/images/B.png",
  				"terminals": [
  					{"name": "_OUTPUT", "direction": [1,0], "offsetPosition": {"left": 94, "top": 18 },"ddConfig": {"type": "output","allowedTypes": ["input"]}}
  				]
			}
		},

		{
			"name": "C",
			"category": "variable",
			"container" : {
				"xtype":"WireIt.ImageContainer", 
				"image": "../logicGates/images/C.png",
  				"terminals": [
  					{"name": "_OUTPUT", "direction": [1,0], "offsetPosition": {"left": 94, "top": 18 },"ddConfig": {"type": "output","allowedTypes": ["input"]}}
  				]
			}
		}

	]
};
