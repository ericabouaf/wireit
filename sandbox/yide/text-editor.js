YUI({
    //Last Gallery Build of this module
    gallery: 'gallery-2010.04.08-12-35'
}).use('gallery-undo', function(Y) {
 
    var undoManager = new Y.UndoManager();
 
    function MyAction(config){
        MyAction.superclass.constructor.apply( this, arguments );
    }
 
    MyAction.NAME = "MyAction";
 
    MyAction.ATTRS = {
        ...
    };
 
    Y.extend( MyAction, Y.UndoableAction, {
        undo : function(){
            ...
        },
 
        redo : function() {
            ...
        },
 
        merge : function( newAction ) {
            ...
        },
 
        cancel : function() {
            ...
        }
    } );
 
    Y.MyAction = MyAction;
 
    var myAction = new Y.MyAction({
        label: "My undoable action"
    });
 
    undoManager.add( myAction );
 
    undoManager.undo();
    undoManager.redo();
});