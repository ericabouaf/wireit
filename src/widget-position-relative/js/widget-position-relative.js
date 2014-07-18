/**
 * WidgetPositionRelative
 *
 * Manages positions relative to the TopMost WidgetParent in the hierarchy
 *
 * (we want to manage Containers and Terminals position relative to the Layer)
 */
Y.WidgetPositionRelative = function(config) {};

//Y.WidgetPositionRelative.NAME = 'widget-position-relative';

Y.WidgetPositionRelative.ATTRS = {

	relative_x: {
		getter: function() {
			return parseInt(this.get('boundingBox').getStyle('left'),10);
		},
		setter: function(val) {
			this.get('boundingBox').setStyle('left', val+'px');
		}
	},

	relative_y: {
		getter: function() {
			return parseInt(this.get('boundingBox').getStyle('top'),10);
		},
		setter: function(val) {
			this.get('boundingBox').setStyle('top', val+'px');
		}
	}

};

//Y.WidgetPositionRelative.prototype = {};