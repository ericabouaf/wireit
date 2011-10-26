var modules= [];

modules[modules.length++] = {
    "name":"xpath",
    "container": {
        "xtype": "WireIt.FormContainer",
        "title": "Apply xPath to input",
        "fields": [
        {
            "type": "string",
            "inputParams": {
                "label": "Expression",
                "name": "expr",
                "wirable": true
            }
        }
        ],
        "terminals": [
        {
            "name": "out",
            "direction": [0, 1],
            "offsetPosition": {
                "left": 86,
                "bottom": -15
            },
            "ddConfig": {
                "type": "output",
                "allowedTypes": ["input"]
            }
        },
         {"name": "in", "direction": [0,-1], "offsetPosition": {"left": 82, "top": -15 }, "ddConfig": {
              "type": "input",
              "allowedTypes": ["output"]
           },
           "nMaxWires": 1
          }        
        ]
    }
};

modules[modules.length++] ={
    "name": "Group",
    "container" : {"xtype":"WireIt.GroupFormContainer"}
};

modules[modules.length++] = {
   "name": "jsBox",
   "container": {"xtype": "sawire.jsRunner"}
};

modules[modules.length++]={
    "name":"GetCaseById",
    "container":{
        "xtype": "samodules.GetByIdContainer",
        "title":"Get Case by Id"
    }
};

modules[modules.length++]={
    "name":"GetCustomerById",
    "container":{
        "xtype": "samodules.GetByIdContainer",
        "title":"Get Customer by Id"
    }
};

modules[modules.length++]={
    "name":"GetWorkItemById",
    "container":{
        "xtype": "samodules.GetByIdContainer",
        "title":"Get WorkItem by Id"
    }
};

modules[modules.length++] ={
    "name": "ApplyXSLToWorkItem",
    "container": {
        "xtype": "WireIt.FormContainer",
        "title": "Apply XSL To WorkItem",
        "fields": [
        {
            "type": "text",
            "inputParams": {
                "label": "WorkItem XML",
                "name": "workitemXML",
                "wirable": true
            }
        },
        {
            "type": "text",
            "inputParams": {
                "label": "XSL",
                "value":'<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">\n'+
                '<xsl:template match="node()">\n'+
                '   <xsl:copy>\n'+
                '       <xsl:for-each select="@*">\n'+
                '           <xsl:copy/>\n'+
                '       </xsl:for-each>\n'+
                '        <xsl:apply-templates select="node()"/>\n'+
                '   </xsl:copy>\n'+
                '</xsl:template>\n'+
                '</xsl:stylesheet>',
                "name": "xsl",
                "wirable": false
            }
        }
        ],
        "terminals": [
        {
            "name": "out",
            "direction": [0, 1],
            "offsetPosition": {
                "left": 140,
                "bottom": -15
            },
            "ddConfig": {
                "type": "output",
                "allowedTypes": ["input"]
            }
        }
        ]
    }
};

modules[modules.length++] ={
    "name": "ExecuteRuleBase",
    "container": {
        "xtype": "WireIt.FormContainer",
        "title": "Execute a RuleBase",
        "fields": [
        {
            "type": "text",
            "inputParams": {
                "label": "WorkItem XML",
                "name": "workitemXML",
                "wirable": true
            }
        },
        {
            "type": "select",
            "inputParams": {
                "label": "RuleBase",
                "name": "rulebase",
				"selectValues": [1,2,3,4],
				"selectOptions": ["StripEntitiesRuleBase","SetTransitionConditionA","MyFirstRuleBase","MySecondRuleBase"],
				"required":true,
                "wirable": false
            }
        }
        ],
		"executionType":"jsBox",
        "terminals": [
        {
            "name": "out",
            "direction": [0, 1],
            "offsetPosition": {
                "left": 140,
                "bottom": -15
            },
            "ddConfig": {
                "type": "output",
                "allowedTypes": ["input"]
            }
        }
        ]
    }
};


modules[modules.length++] ={
    "name": "SaveWorkItem",
    "container": {
        "xtype": "WireIt.FormContainer",
        "title": "Save WorkItem",
        "fields": [
        {
            "type": "text",
            "inputParams": {
                "label": "WorkItem XML",
                "name": "workitemXML",
                "wirable": true
            }
        }
        ],
		"executionType":"jsBox",
        "terminals": [
        {
            "name": "out",
            "direction": [0, 1],
            "offsetPosition": {
                "left": 140,
                "bottom": -15
            },
            "ddConfig": {
                "type": "output",
                "allowedTypes": ["input"]
            }
        }
        ]
    }
};

modules[modules.length++] ={
    "name": "DisplayCase",
    "container": {
        "xtype": "samodules.DisplayItemContainer",
        "title": "Display Case"
    }
};

modules[modules.length++] ={
    "name": "DisplayCustomer",
    "container": {
        "xtype": "samodules.DisplayItemContainer",
        "title": "Display Customer"
    }
};

modules[modules.length++] ={
    "name": "DisplayWorkItem",
    "container": {
        "xtype": "samodules.DisplayItemContainer",
        "title": "Display WorkItem"
    }
};

var samodules={};

samodules.GetByIdContainer = function(options, layer) {
    options.fields = [{
         "type": "integer",
         "inputParams": {
             "label": "Id",
             "name": "input",
             "wirable": true
         }}];
   samodules.GetByIdContainer.superclass.constructor.call(this, options, layer);
   
   this.outputTerminal = this.addTerminal({xtype: "WireIt.util.TerminalOutput", "name": "out"});      
   var width = WireIt.getIntStyle(this.el, "width");   
   WireIt.sn(this.outputTerminal.el, null, {position: "absolute", bottom: "-15px", left: (Math.floor(width/2)-15)+"px"});
};

YAHOO.extend(samodules.GetByIdContainer, WireIt.FormContainer, {});

samodules.DisplayItemContainer= function(options, layer) {
    options.fields= [{
        "type": "text",
        "inputParams": {
            "label": "Raw XML",
            "name": "xml",
            "wirable": true
        }}];
    samodules.DisplayItemContainer.superclass.constructor.call(this, options, layer);

    var width = WireIt.getIntStyle(this.el, "width");   
    this.outputTerminal = this.addTerminal({xtype: "WireIt.util.TerminalOutput", "name": "out"});      
    WireIt.sn(this.outputTerminal.el, null, {position: "absolute", bottom: "-15px", left: (Math.floor(width/2)-15)+"px"});
    
};
YAHOO.extend(samodules.DisplayItemContainer, WireIt.FormContainer, {});


var jsBox = {};

/**
 * ComposedContainer is a class for Container representing Pipes.
 * It automatically generates the inputEx Form from the input Params.
 * @class ComposedContainer
 * @extends WireIt.FormContainer
 * @constructor
 */
jsBox.ComposedContainer = function(options, layer) {
   
   if(!options.fields) {
      
      options.fields = [];
      options.terminals = [];
      var pipe = sawire.editor.getPipeByName(options.title);
      for(var i = 0 ; i < pipe.modules.length ; i++) {
         var m = pipe.modules[i];
         var moduleDefinition =sawire.editor.modulesByName[m.name];
         console.log(moduleDefinition);
         
         if( m.name == "input") {
            m.value.input.inputParams.wirable = true;
            options.fields.push(m.value.input);
         }
         else if(m.name == "output") {
            options.terminals.push({
               name: m.value.name,
               "direction": [0,1], 
               "offsetPosition": {"left": options.terminals.length*40, "bottom": -15}, 
               "ddConfig": {
                   "type": "output",
                   "allowedTypes": ["input"]
                }
            });
         }
      }
   }
   
   jsBox.ComposedContainer.superclass.constructor.call(this, options, layer);
};
YAHOO.extend(jsBox.ComposedContainer, WireIt.FormContainer);