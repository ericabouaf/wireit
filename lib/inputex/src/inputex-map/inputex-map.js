
/**
 * @module inputex-map
 */

YUI.add("inputex-map", function (Y) {

    var lang = Y.Lang,
        inputEx = Y.inputEx;

    inputEx.MapFieldGlobals = {
        yahoo_preloader_error: 1,

        lat: 43.648565,
        lon: -79.385329,
        uzoom: -13,
        api: 'google',
        api_key: ''
    };

    /**
     * Wrapper for Google Maps APIs
     * @class inputEx.MapField
     * @extends inputEx.Field
     * @constructor
     * @param {Object} options Added options:
     * <ul>
     *    <li>lat</li>
     *    <li>lon</li>
     *    <li>uzoom</li>
     * </ul>
     */
    inputEx.MapField = function (options) {
        inputEx.MapField.superclass.constructor.call(this, options);
    };

    Y.extend(inputEx.MapField, inputEx.Field, {
       
       /**
        * @method setOptions
        */
        setOptions: function (options) {
            inputEx.MapField.superclass.setOptions.call(this, options);
            this.options.className = options.className || 'inputEx-Field inputEx-MapField';

            this.options.width = options.width || '400px';
            this.options.height = options.height || '400px';
            this.options.loading = options.loading || 'loading....';

            this.options.lat = options.lat || inputEx.MapFieldGlobals.lat;
            this.options.lon = options.lon || inputEx.MapFieldGlobals.lon;
            this.options.uzoom = options.uzoom || inputEx.MapFieldGlobals.uzoom;
            this.options.api = options.api || inputEx.MapFieldGlobals.api;
            this.options.api_key = options.api_key || inputEx.MapFieldGlobals.api_key;
            this.options.mapType = options.mapType || inputEx.MapFieldGlobals.mapType;

        },

        /**
         * Render the field using the appropriate mapping function
         * @method renderComponent
         */
        renderComponent: function () {
            if (!inputEx.MapFieldsNumber) {
                inputEx.MapFieldsNumber = 0;
            } else {
                inputEx.MapFieldsNumber++;
            }

            this.options.api = "google";

            var id = "inputEx-MapField-" + inputEx.MapFieldsNumber;
            var idWrapper = "inputEx-MapFieldWrapper-" + inputEx.MapFieldsNumber;
            var idLat = "inputEx-MapFieldLat-" + inputEx.MapFieldsNumber;
            var idLon = "inputEx-MapFieldLon-" + inputEx.MapFieldsNumber;
            var idZoom = "inputEx-MapFieldUZoom-" + inputEx.MapFieldsNumber;
            
            this.elWrapper = inputEx.cn('div', {
                id: idWrapper,
                style: "width: " + this.options.width + "; height: " + this.options.height
            },
            null,
            null);
            this.fieldContainer.appendChild(this.elWrapper);

            this.el = inputEx.cn('div', {
                id: id,
                style: "position: relative; width: " + this.options.width + "; height: " + this.options.height
            },
            null,
            this.options.loading);
            this.elWrapper.appendChild(this.el);

            this.elLat = inputEx.cn('input', {
                id: idLat,
                type: "hidden",
                value: this.options.lat
            });
            this.fieldContainer.appendChild(this.elLat);

            this.elLon = inputEx.cn('input', {
                id: idLon,
                type: "hidden",
                value: this.options.lon
            });
            this.fieldContainer.appendChild(this.elLon);

            this.elZoom = inputEx.cn('input', {
                id: idZoom,
                type: "hidden",
                value: this.options.uzoom
            });
            this.fieldContainer.appendChild(this.elZoom);

            // map creation
            var mapOptions = {
                center: new google.maps.LatLng(this.options.lat, this.options.lon),
                zoom: this.options.uzoom,
                mapTypeId: google.maps.MapTypeId[this.options.mapType]
            };
            this.map = new google.maps.Map(this.el, mapOptions);

        },
        
        /**
          * @method initEvents
          */
        initEvents: function () {
            var that = this;

            // on click we instanciate a marker with the data related to the click position
            google.maps.event.addListener(this.map, "click", function (e) {
                that.setValue({
                    lat: e.latLng.Xa,
                    lon: e.latLng.Ya,
                    uzoom: that.map.getZoom()
                });

                // in this example only one marker is allowed
                if (this.marker) {
                    this.marker.setPosition(e.latLng);
                } else {
                    this.marker = new google.maps.Marker({
                        position: e.latLng,
                        map: that.map,
                        title: 'Hello World!'
                    });
                }

            });
        },
        
        /**
          * @method setValue
          */
        setValue: function (value) {

            if (value.uzoom) {
                this.elZoom.value = value.uzoom;
            }

            if (value.lat) {
                this.elLat.value = value.lat;
            }

            if (value.lon) {
                this.elLon.value = value.lon;
            }
        },
        /**
          * @method getValue
          */
        getValue: function () {
            if (!this.elLat) return {};
            return {
                lat: this.elLat.value,
                lon: this.elLon.value,
                uzoom: this.elZoom.value
            };
        }
    });

    // Register this class as "map" type
    inputEx.registerType("map", inputEx.MapField);

}, '3.1.0', {
    requires: ['inputex-field']
});
