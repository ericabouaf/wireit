(function() {

   var inputEx = YAHOO.inputEx, lang = YAHOO.lang, Event = YAHOO.util.Event, Dom = YAHOO.util.Dom;

/**
 * @class Create an image map field
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.ImagemapField = function(options) {
	inputEx.ImagemapField.superclass.constructor.call(this,options);
};
lang.extend(inputEx.ImagemapField, inputEx.Field,
/**
 * @scope inputEx.ImagemapField.prototype
 */
{
    /**
     * popup image and its image map coordinates
     */
    tgimgsrc: '',

    tgmapcoords: null,

    parent:'',

    /**
	 * Render the image and the imagemap popup
	 */
	renderComponent: function() {
        var orgimagesrc = (this.options.orgimgsrc != null) ? this.options.orgimgsrc : '/images/game/chinesechecker/chinesecheckergrid_fc_s.png';
        YAHOO.log('renderComponent() - orgimgsrc: ' + orgimagesrc,'info','ImagemapField.js');
        this.tgimgsrc = (this.options.tgimgsrc != null) ? this.options.tgimgsrc : '/images/game/chinesechecker/chinesecheckergrid_fc_s.png';
        YAHOO.log('renderComponent() - tgimgsrc: ' + this.tgimgsrc,'info','ImagemapField.js');
        this.tgmapcoords = (this.options.tgmapcoords != null) ? this.options.tgmapcoords : null;
        YAHOO.log('renderComponent() - tgmapcoords: ' + this.tgmapcoords + ', tgmapcoords.size: ' + this.tgmapcoords.length,'info','ImagemapField.js');
        this.parent = (this.options.parentEl != null) ? this.options.parentEl: '';
        YAHOO.log('renderComponent() - parent: ' + this.parent,'info','ImagemapField.js');
        var log = '';
        for (var i=0; i < this.tgmapcoords.length; i++) {
            var imgmap = this.tgmapcoords[i];
            //log = imgmap[0];
            log += 'shape: ' + imgmap[0];
            log += ', coords: ' + imgmap[1];
            if (imgmap[2] != null) {
                log += ', resultimg: ' + imgmap[2];
            } else {
                YAHOO.log('**************cannot find imgmap[2]!');
            }
            log  += '; ';
        }
        YAHOO.log('renderComponent() - tgmapcoords details: ' + log,'info','ImagemapField.js');

        // A hidden input field to store the seat id
        this.el = inputEx.cn('input', {
           type: 'text',
           name: 'seatid',
           value: '' });
/*
        this.el = inputEx.cn('input', {
           type: 'hidden',
           name: 'seatid', 
           value: '1' });
*/

        this.orgimg = inputEx.cn('img', {className: 'inputEx-ImagemapField'});
        this.orgimg.src = orgimagesrc;

        this.divEl.appendChild(this.el);
        this.divEl.appendChild(this.orgimg);
        this.renderPopUp();
	},

    /**
     * Set the value
     * @param {String} value Color to set
     */
    setValue: function(value) {
       this.el.value = value;
    },

	/**
	 * Register the click and blur events
	 */
	initEvents: function() {
	   Event.addListener(this.orgimg, "click", this.toggleImagemapPopUp, this, true);
	   Event.addListener(this.orgimg, "blur", this.closeImagemapPopUp, this, true);
	},

	/**
	 * Toggle the imagemap picker popup
	 */
	toggleImagemapPopUp: function() {
        if( this.visible ) {this.imgmapPopUp.style.display = 'none'; }
        else { this.imgmapPopUp.style.display = 'block'; }
        this.visible = !this.visible;
	},

	/**
	 * Call closeImagemapPopUp when field is removed
	 */
	close: function() {
        this.closeImagemapPopUp();
	},

	/**
	 * Close the popup
	 */
	closeImagemapPopUp: function() {
        this.imgmapPopUp.style.display = 'none';
        this.visible = false;
	},

	/**
	 * Render the imagemap popup
	 */
	renderPopUp: function() {
        // keep the visible state of the popup
        this.visible = false;

        // create the popup
        this.imgmapPopUp = inputEx.cn('div', {className: 'inputEx-ImagemapField-popup'}, {left:'100px', top:'100px', display: 'none'});

        // create the title
        var div = inputEx.cn('div', null, null, 'Please select: ');
        this.imgmapPopUp.appendChild( div );

       var body = inputEx.cn('div');
       body.appendChild( this.renderImageMap() );
       this.imgmapPopUp.appendChild(body);

       this.divEl.appendChild(this.imgmapPopUp);
	},


    renderImageMap: function() {
        var image = inputEx.cn('img', {className: 'inputEx-ImagemapField2'})
        image.src = this.tgimgsrc;
        image.useMap = '#' + this.parent + 'planetmap';

        var imagemap = inputEx.cn('map', {name: 'map01'});
        imagemap.id = this.parent+'planetmap';
        imagemap.name = this.parent+'planetmap';

        for (var i=0; i < this.tgmapcoords.length; i++) {
            var imgmap = this.tgmapcoords[i];

            var area = inputEx.cn('area', {className: 'inputEx-ImagemapField'});
            area.id = this.parent+'area' + i;
            area.shape = imgmap[0];
            area.coords = '' + imgmap[1];
            YAHOO.log('renderImageMap() - alt: '+ imgmap[4], 'info','ImagemapField.js');
            area.alt = (imgmap[4]) ? imgmap[4] : '';
            YAHOO.log('renderImageMap() - '+ area.id + '-area.coords: ' + area.coords, 'info','ImagemapField.js');
            Event.addListener(area, "mousedown", this.onImageClick, this, true );
            imagemap.appendChild(area);
        }

        var table = inputEx.cn('table');
        var tbody = inputEx.cn('tbody');
        var tr = inputEx.cn('tr');
        var td = inputEx.cn('td');
        td.appendChild(image);
        td.appendChild(imagemap);
        tr.appendChild(td);
        tbody.appendChild(tr);
        table.appendChild(tbody);

        return table;
    },

	/**
	 * Handle a image map area selection
	 * @param {Event} e The original click event
	 */
	onImageClick: function(e) {

        var target = YAHOO.util.Event.getTarget(e);//e.target;
        YAHOO.log('ImagemapField.onImageClick, target:' + target.id + ', event: ' + e, 'info', 'body');
        var targetid = target.id + '';
        targetid = targetid.substring(targetid.indexOf('area')+4);
        YAHOO.log('ImagemapField.onImageClick, targetid:' + targetid + ', event: ' + e, 'info', 'body');


        for (var i=0; i < this.tgmapcoords.length; i++) {
            if (i == targetid) {
                var imgmap = this.tgmapcoords[i];
                if (imgmap[2] != null) {
                    this.orgimg.src = imgmap[2];
                } else {
                    this.orgimg.src = this.tgimgsrc;
                }
                imgmap[3] ? this.el.value = imgmap[3]: 0;
                YAHOO.log('renderImageMap() - result img src: ' + this.orgimg.src, 'info','ImagemapField.js');
                break;
            }
        }

        // Overlay closure
        this.visible = !this.visible;
        this.imgmapPopUp.style.display = 'none';

        // Fire updated
        this.fireUpdatedEvt();
	}

});

/**
 * Register this class as "imagemap" type
 */
inputEx.registerType("imagemap", inputEx.ImagemapField);

})();