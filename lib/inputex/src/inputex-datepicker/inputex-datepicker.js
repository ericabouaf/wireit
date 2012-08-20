/**
 * @module inputex-datepicker
 */
YUI.add("inputex-datepicker",function(Y){

   var inputEx = Y.inputEx,
       lang = Y.Lang;
/**
 * A DatePicker Field.
 * @class inputEx.DatePickerField
 * @extends inputEx.DateField
 * @constructor
 * @param {Object} options No added option for this field (same as DateField)
 * <ul>
 *   <li>calendar: yui calendar configuration object</li>
 *   <li>zIndex: calendar overlay zIndex</li>
 * </ul>
 */
inputEx.DatePickerField = function(options) {
   inputEx.DatePickerField.superclass.constructor.call(this,options);
};

Y.extend(inputEx.DatePickerField, inputEx.DateField, {
   /**
    * Set the default date picker CSS classes
    * @method setOptions
    * @param {Object} options Options object as passed to the constructor
    */
   setOptions: function(options) {
      inputEx.DatePickerField.superclass.setOptions.call(this, options);

      // Overwrite default options
      this.options.className = options.className ? options.className : 'inputEx-Field inputEx-DateField inputEx-PickerField inputEx-DatePickerField';

      this.options.readonly = lang.isUndefined(options.readonly) ? true : options.readonly;

      // Added options
      this.options.calendar = options.calendar || inputEx.messages.defaultCalendarOpts;
      this.options.zIndex   = options.zIndex || 4;
   },

   /**
    * @method renderOverlay
    */
   renderOverlay: function() {

      // Create overlay
      this.oOverlay = new Y.Overlay({
         visible:false,
         zIndex: this.options.zIndex
      });

      this.oOverlay.render(this.fieldContainer);

      this.oOverlay.on('visibleChange', function (e) {

         if (e.newVal) { // show
            this.beforeShowOverlay();
            this.calendar.show();

            // align
            this.oOverlay.set("align", {node:this.button,  points:[Y.WidgetPositionAlign.TL, Y.WidgetPositionAlign.BL]});

            // Activate outside event handler
            this.outsideHandler = this.oOverlay.get('boundingBox').on('mousedownoutside', function (e) {
               this.oOverlay.hide();
            }, this);
         }
         else { // hide
            this.calendar.hide();
            
            if(this.outsideHandler){
              this.outsideHandler.detach();
            }
            
         }

      }, this);
   },

   /**
    * @method _toggleOverlay
    * @private
    */
   _toggleOverlay: function(e) {

      // DON'T stop the event since it will be used to close other overlays...
      //e.stopPropagation();

      if(!this.oOverlay) {
         this.renderOverlay();
         this.renderCalendar();
      }

      var method = this.oOverlay.get('visible') ? 'hide' : 'show';
      this.oOverlay[method] ();
   },

   /**
    * Render the input field and the minical container
    * @method renderComponent
    */
   renderComponent: function() {

      inputEx.DatePickerField.superclass.renderComponent.call(this);

      // Create button
      this.button = Y.Node.create("<button>&nbsp;</button>").addClass("inputEx-DatePicker-button");
      this.button.appendTo(this.wrapEl);


      // Subscribe the click handler on the field only if readonly
      if(this.options.readonly) {
         Y.one(this.el).on('click', this._toggleOverlay, this);
      }

      // Subscribe to the first click
      this.button.on('click', this._toggleOverlay, this);
   },


   /**
    * Called ONCE to render the calendar lazily
    * @method renderCalendar
    */
   renderCalendar: function() {
      // if already rendered, ignore call
      if (!!this.calendarRendered) return;

      this.calendar = new Y.Calendar({
         width:'250px',
         showPrevMonth: true,
         showNextMonth: true,
         date: new Date()
      });

      this.calendar.setAttrs(this.options.calendar);

      this.calendar.render( this.oOverlay.get('contentBox') );

      this.calendar.on("selectionChange", function (ev) {

         // Get the date from the list of selected
         // dates returned with the event (since only
         // single selection is enabled by default,
         // we expect there to be only one date)
         var newDate = ev.newSelection[0];

         this.setValue(newDate);

         this.oOverlay.hide();
      }, this);

      this.calendarRendered = true;
   },

   /**
    * Select the right date and display the right page on calendar, when the field has a value
    * @method beforeShowOverlay
    */
   beforeShowOverlay: function(e) {

      if (!!this.calendar) {

         var date = this.getValue(true), valid = this.validate();

         // check if valid to exclude invalid dates (that are truthy !)
         // check date to exclude empty values ('')
         if (valid && !!date) {
            this.calendar.set('date', date);
            this.calendar.deselectDates();
            this.calendar.selectDates(date);
         }
      }
   },

   /**
    * Call overlay when field is removed
    * @method close
    */
   close: function() {
      console.log("DATEPICKER CLOSE", this.oOverlay);
      if (this.oOverlay) {
         this.oOverlay.hide();
      }
   },

   /**
    * Disable the field
    * @method disable
    */
   disable: function() {
      inputEx.DatePickerField.superclass.disable.call(this);
      this.button.set('disabled', true);
   },

   /**
    * Enable the field
    * @method enable
    */
   enable: function() {
      inputEx.DatePickerField.superclass.enable.call(this);
      this.button.set('disabled', false);
   }

});

inputEx.messages.defaultCalendarOpts = { navigator: true };

// Register this class as "datepicker" type
inputEx.registerType("datepicker", inputEx.DatePickerField);

}, '3.1.0',{
requires: ['inputex-date', 'event-outside', 'node-event-delegate','overlay','calendar']
});

