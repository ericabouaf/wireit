/**
 * @module inputex-ratingstars
 */
YUI.add("inputex-ratingstars",function(Y){

   var lang = Y.Lang,
       inputEx = Y.inputEx;

/**
 * Create a star rating Field
 * This field has been made by integrating script from http://www.unessa.net/en/hoyci/projects/yui-star-rating/
 * To use it with auto data sending, use RatingStars
 * @class inputEx.RatingStars
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options The following options are added for RatingStars :
 * <ul>
 *  <li><b>averageValue</b>: average value before clicking, must be a float number</li>
 *  <li><b>nRates</b>: numbers of vote</li>
 *  <li><b>disableRate</b>: Disable the rate but show stars</li>
 *  <li><b>nStars</b>: <i>integer</i> number of stars (default : 5) </li>
 *  <li><b>disabled</b>: disable voting  </li>
 *  <li><b>message</b>: <i>string</i> C-like with % convention string for display Message (default 'Rating: % (% votes cast)') </li>
 *  <li><b>disableMessage</b>: <i>string</i> String to show when mouse pass hover the stars and stars are disabled</li>
 * </ul>
 */
inputEx.RatingStars = function(options) {
   inputEx.RatingStars.superclass.constructor.call(this,options);
   this.resetStars();
};

Y.extend(inputEx.RatingStars, inputEx.Field,{
  setOptions: function(options){
    inputEx.RatingStars.superclass.setOptions.call(this,options);
    
    // Added options
    if(lang.isArray(options.nStars) && options.nStars[0] && lang.isString(options.nStars[0])){
      this.options.nStars = options.nStars.length;
      this.options.starsMessages = options.nStars;
    } else {
      this.options.nStars = options.nStars || 5;
    }
    this.options.averageValue = lang.isNumber(options.averageValue) ? Math.round((options.averageValue)*10)/10 : null;
    this.options.disableRate = options.disableRate || false;
    this.options.nRates = options.nRates;
    this.options.name = options.name || "stars";
    
    this.dontReset = false ;// => used when the form is ajax submitted, then we pass true to this param
    this.disabled = options.disabled || false;
    
    // Overwrite options
    this.options.message = options.message || inputEx.messages.ratingMsg;
    this.options.disableMessage = options.disableMessage;
    this.options.className = options.className ? options.className : 'inputEx-Field inputEx-RatingStars';
    this.setMessage();

  },
  /**
   * Set message options of the selectField
   * @method setMessage
   */
  setMessage: function(){
    var messageArray = this.options.message.split("%");
    
    this.options.message = "";
    if (this.options.averageValue){
      this.options.message = this.options.message + messageArray[0] + this.options.averageValue + "/" + this.options.nStars 
    }
    if(this.options.nRates){
      this.options.message = this.options.message + messageArray[1] + this.options.nRates + messageArray[2]
    }
  },  
  /**
   * render stars
   * @method render
   */
  renderComponent: function(){
    this.starsEls = [];
    this.el = inputEx.cn('div');
    for (var i = 0 ; i < this.options.nStars; i++) {
      // first, make a div and then an a-element in it
      var star = inputEx.cn('div',{id:'star-' + i, className: "inputEx-star"});
      var that = this;
      star.index = i;
      star.onHover = function(){
        that.onHoverStar(this.index);
      }
      star.onClick = function(){
        //by convention the value of the field goes from 1 to 5, as the number of stars. It's weird because there's no 0, but this is it.
        that.onClickRating(this.index+1);
      }
      this.starsEls.push(star);
      var a = inputEx.cn('a',{href:'#' + i},null,i);
      star.appendChild(a);
      this.el.appendChild(star);

      // add needed listeners to every star
      Y.one(star).on('mouseover', star.onHover, star, true);
      Y.one(star).on('click', star.onClick, star, true);
    } 
    Y.one(this.el).on('mouseout', this.resetStars, this, true);
    this.fieldContainer.appendChild(this.el);
    this.divMess = this.fieldContainer.appendChild(inputEx.cn('div', {id: this.divEl.id+'-mess', className: 'inputEx-message'}, null, this.options.message ));

  },
  /**
   * When mouse is over a star
   * @method onHoverStar
   */
  onHoverStar: function(whichStar) {
      if(!this.disabled){
        /* hovers the selected star plus every star before it */
        if(!this.value){
          for (var i=0; i < this.options.nStars; i++) {
            var star = this.starsEls[i],
                a = star.firstChild;
            if(i < whichStar+1 ){
              Y.one(star).addClass('hover');
              Y.one(a).setStyle('width', '100%');            
            } else {
              Y.one(star).removeClass('on');
              Y.one(star).removeClass('hover');
            }

 
          }
        }
      
        if(this.options.starsMessages){
          this.showMessage("<span class=\"inputEx-starMess\">"+this.options.starsMessages[whichStar]+"</span>");
        }
      } else {
        if(this.options.disableMessage){
          this.showMessage("<span class=\"inputEx-disableMessage\">"+this.options.disableMessage+"</span>")
        }
      }
    },  
  /**
   * InitEvents
   * @method initEvents
   */
    initEvents: function(e, whichStar) {
      this.publish("rateEvt");
    },  
  /**
   * reset Stars and note
   * @method resetStars
   */
    resetStars: function(inValue) {
        /* Resets the status of each star */
        
        // if form is not submitted, the number of stars on depends on the 
        // given average value
        if (this.dontReset) {
          return
        }
        var value = lang.isNumber(inValue) ? inValue : this.options.averageValue ;
        var starsOn = Math.floor(value),
            rest = Math.floor((this.options.averageValue - starsOn)*10),
            lastStarWidth;
            
        if (rest > 0){
           starsOn = starsOn + 1;
           lastStarWidth = rest + '0%';
        }
        for (var i=0; i < this.options.nStars ; i++) {
            var star = this.starsEls[i],
                a = star.firstChild;
            Y.one(star).removeClass('hover');
            if(i < starsOn){
              Y.one(star).addClass('on');
            }  else {
              Y.one(star).removeClass('on');
            }
          
            // and for the last one, set width if needed
            if (i == starsOn - 1 && lastStarWidth){
              Y.one(a).setStyle('width', lastStarWidth);
            }
        }
        this.showMessage();
    },
    /**
     * Tell something under the stars
     * @method showMessage
     */
    showMessage: function(text){
      if(!text){
        //default message
        var text = this.options.message
      }
      this.divMess.innerHTML = text;
    },
    /**
     * onAsync is called by the containing form when request is Send
     * @method onAsync
     */
    onAsync : function(){
      this.showMessage("<span class=\"thanks\">"+inputEx.messages.sendingRate+"</span>");
    },
    onEndAsync : function(){
       this.afterRating();
    },
    /**
    * 
    * @method onClickRating
    */
    onClickRating: function(value){
      if(this.disabled){
        return
      }
      this.setValue(value);
      this.dontReset = true;
      this.disable();
      this.fire("rate",value);  
      
    },
    afterRating: function(){
      this.showMessage("<span class=\"thanks\">"+inputEx.messages.thanksRate+"</span>");      
    },
    disable: function(){
      this.disabled = true;  
    },
    enable: function(){
      this.disabled = false;
    },
    setValue: function(value){
      inputEx.RatingStars.superclass.setValue.call(this,value);
      this.value = value;
    },
    getValue: function(){
      return this.value;  
    }
});

 
 // Register this class as "url" type
 inputEx.registerType("ratingstars", inputEx.RatingStars);

},'3.1.0',{
  requires: ['inputex-field']
});


