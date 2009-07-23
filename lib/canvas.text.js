/* $Id$ */

/** 
 * @projectDescription An implementation of the <canvas> text functions in browsers that don't already have it
 * @author Fabien Ménager
 * @version $Revision$
 * @license MIT License <http://www.opensource.org/licenses/mit-license.php>
 */

/**
 * Known issues:
 * - The 'light' font weight is not supported, neither is the 'oblique' font style.
 * - Optimize the different hacks (for Safari3 and Opera9)
 */

/** Array.indexOf */
if (!Array.prototype.indexOf) Array.prototype.indexOf = function(item, i) {
  i || (i = 0);
  var length = this.length;
  if (i < 0) i = length + i;
  for (; i < length; i++) if (this[i] === item) return i;
  return -1;
};

window.Canvas = window.Canvas || {};
window.Canvas.Text = {
  // http://mondaybynoon.com/2007/04/02/linux-font-equivalents-to-popular-web-typefaces/
  equivalentFaces: {
    'Arial': ['Utkal', 'Nimbus Sans L', 'FreeSans', 'Malayalam', 'Phetsarath OT'],
    'Charcoal': ['Rehka', 'Aakar', 'FreeSerif', 'Gentium'],
    'Comic Sans MS': ['TSCu_Comic'],
    'Courier New': ['FreeMono', 'Nimbus Mono L'],
    'Georgia': ['Nimbus Roman No9 L', 'Century Schoolbook L', 'Norasi', 'Rekha'],
    'Helvetica': ['FreeSans', 'Gargi_1.7', 'Jamrul', 'Malayalam', 'Mukti Narrow', 'Nimbus Sans L', 'Phetsarath OT'],
    'Lucida Grande': ['Gargi_1.7', 'Garuda', 'Jamrul', 'Loma', 'Malayalam', 'Mukti Narrow'],
    'Tahoma': ['Kalimati'],
    'Times New Roman': ['FreeSerif'],
    'Verdana': ['Kalimati']
  },

  // http://www.w3.org/TR/CSS21/fonts.html#generic-font-families
  genericFaces: {
    'serif': ['Times New Roman', 'Bodoni', 'Garamond', 'Minion Web', 'ITC Stone Serif', 'Georgia', 'Bitstream Cyberbit'],
    'sans-serif': ['Trebuchet', 'Verdana', 'Arial', 'Tahoma', 'Helvetica', 'ITC Avant Garde Gothic', 'Univers', 'Futura', 
                   'Gill Sans', 'Akzidenz Grotesk', 'Attika', 'Typiko New Era', 'ITC Stone Sans', 'Monotype Gill Sans 571'],
    'monospace': ['Courier', 'Courier New', 'Prestige', 'Everson Mono'],
    'cursive': ['Caflisch Script', 'Adobe Poetica', 'Sanvito', 'Ex Ponto', 'Snell Roundhand', 'Zapf-Chancery'],
    'fantasy': ['Alpha Geometrique', 'Critter', 'Cottonwood', 'FB Reactor', 'Studz']
  },
  
  faces: {},
  scaling: 0.962,
  _styleCache: {}
};

/** Initializes a canvas element for Internet Explorer if 
 * ExCanvas is present and old-webkit based browsers
 * @param {Element} canvas The canvas to initialize
 */
function initCanvas(canvas) {
  if (window.G_vmlCanvasManager && window.attachEvent && !window.opera) {
    canvas = window.G_vmlCanvasManager.initElement(canvas);
  }
  return canvas;
}

/** The implementation of the text functions */
(function(){
  var isOpera9 = (window.opera && navigator.userAgent.match(/Opera\/9/)), // It seems to be faster when the hacked methods are used. But there are artifacts with Opera 10.
      isSafari3 = !window.CanvasRenderingContext2D,
      proto = window.CanvasRenderingContext2D ? window.CanvasRenderingContext2D.prototype : document.createElement('canvas').getContext('2d').__proto__,
      ctxt = window.Canvas.Text;

  // Global options
  ctxt.options = {
    fallbackCharacter: ' ', // The character that will be drawn when not present in the font face file
    dontUseMoz: false, // Don't use the builtin Firefox 3.0 functions (mozDrawText, mozPathText and mozMeasureText)
    reimplement: false, // Don't use the builtin official functions present in Chrome 2, Safari 4, and Firefox 3.1+
    debug: false // Debug mode, not used yet
  };
  
  function initialize(){
    var libFileName = 'canvas.text.js',
        head = document.getElementsByTagName("head")[0],
        scripts = head.getElementsByTagName("script"), i, j, src, parts;

    for (i = 0; i < scripts.length; i++) {
      src = scripts[i].src;
      if (src.indexOf(libFileName) != -1) {
        parts = src.split('?');
        ctxt.basePath = parts[0].replace(libFileName, '');
        if (parts[1]) {
          var options = parts[1].split('&');
          for (j = options.length-1; j >= 0; --j) {
            var pair = options[j].split('=');
            ctxt.options[pair[0]] = pair[1];
          }
        }
        break;
      }
    }
  };
  initialize();
  
  // What is the browser's implementation ?
  var moz = !ctxt.options.dontUseMoz && proto.mozDrawText && !proto.strokeText;

  // If the text functions are already here : nothing to do !
  if (proto.strokeText && !ctxt.options.reimplement) {
    // This property is needed, when including the font face files
    window._typeface_js = {loadFace: function(){}};
    return;
  }
  
  function getCSSWeightEquivalent(weight) {
    switch(weight) {
      case 'bolder':
      case 'bold':
      case '900':
      case '800':
      case '700': return 'bold';
      case '600':
      case '500':
      case '400':
      default:
      case 'normal': return 'normal';
      //default: return 'light';
    }
  };
  
  function getElementStyle(e) {
    if (e.computedStyle) return e.computedStyle;
    if (window.getComputedStyle)
      e.computedStyle = window.getComputedStyle(e, '');
    else if (e.currentStyle)
      e.computedStyle = e.currentStyle;
    return e.computedStyle;
  };
  
  function getXHR() {
    var methods = [
      function() {return new XMLHttpRequest()},
      function() {return new ActiveXObject('Msxml2.XMLHTTP')},
      function() {return new ActiveXObject('Microsoft.XMLHTTP')}
    ];
    if (!ctxt.xhr) {
      for (i = 0; i < methods.length; i++) {
        try {
          ctxt.xhr = methods[i](); 
          break;
        } 
        catch (e) {}
      }
    }
    return ctxt.xhr;
  };

  ctxt.getFace = function(family, weight, style) {
    if (this.faces[family] && 
        this.faces[family][weight] && 
        this.faces[family][weight][style]) return this.faces[family][weight][style];
        
    var faceName = (family.replace(/[ -]/g, '_')+'-'+weight+'-'+style),
        xhr = this.xhr,
        url = this.basePath+'faces/'+faceName+'.js';

    xhr = getXHR();
    xhr.open("get", url, false);
    xhr.send(null);
    if(xhr.status == 200) {
      eval(xhr.responseText);
      return this.faces[family][weight][style];
    }
    else throw 'Unable to load the font ['+family+' '+weight+' '+style+']';
    return false;
  };
  
  ctxt.loadFace = function(data) {
    var family = data.familyName.toLowerCase();
    this.faces[family] = this.faces[family] || {};
    this.faces[family][data.cssFontWeight] = this.faces[family][data.cssFontWeight] || {};
    this.faces[family][data.cssFontWeight][data.cssFontStyle] = data;
    return data;
  };
  // To use the typeface.js face files
  window._typeface_js = {faces: ctxt.faces, loadFace: ctxt.loadFace};
  
  ctxt.getFaceFromStyle = function(style) {
    var weight = getCSSWeightEquivalent(style.weight),
        family = style.family.toLowerCase();
        
    return this.getFace(family, weight, style.style);
  };
  
  // Default values
  // Firefox 3.5 throws an error when redefining these properties
  try { 
    proto.font = "10px sans-serif";
    proto.textAlign = "start";
    proto.textBaseline = "alphabetic";
  }
  catch(e){}
  
  proto.parseStyle = function(styleText) {
    styleText = styleText.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); // trim
    
    if (ctxt._styleCache[styleText]) return this.getComputedStyle(ctxt._styleCache[styleText]);
    
    var parts, lex = [], i, p, v, part,
    // Default style
    style = {
      family: 'sans-serif',
      size: 10,
      weight: 'normal',
      style: 'normal'
    },
    
    possibleValues = {
      weight: ['bold', 'bolder', 'lighter', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
      style: ['italic', 'oblique']
    };
    
    parts = styleText.match(/("[^"]+"|'[^']+'|[\w\%-_]+)*/g);
    for(i = 0; i < parts.length; i++) {
      part = parts[i].replace(/^["']*/, '').replace(/["']*$/, '');
      if (part) lex.push(part);
    }
    
    style.family = lex.pop() || style.family;
    style.size = lex.pop() || style.size;
    
    for (p in possibleValues) {
      v = possibleValues[p];
      for (i = 0; i < v.length; i++) {
        if (lex.indexOf(v[i]) != -1) {
          style[p] = v[i];
          break;
        }
      }
    }
    
    return this.getComputedStyle(ctxt._styleCache[styleText] = style);
  };
  
  proto.buildStyle = function (style) {
    return style.style+' '+style.weight+' '+style.size+'px "'+style.family+'"';
  };

  proto.renderText = function(text, style) {
    var face = ctxt.getFaceFromStyle(style),
        scale = (style.size / face.resolution) * (3/4),
        offset = 0;
    
    if (!isOpera9) {
      this.scale(scale, -scale);
      this.lineWidth /= scale;
    }
    
    var i, chars = text.split(''), length = chars.length;
    for (i = 0; i < length; i++) {
      offset += this.renderGlyph(chars[i], face, scale, offset);
    }
  };

  if (isOpera9) {
    proto.renderGlyph = function(c, face, scale, offset) {
      var i, cpx, cpy, outline, action, glyph = face.glyphs[c], length;
      
      if (!glyph) return;
  
      if (glyph.o) {
        outline = glyph._cachedOutline || (glyph._cachedOutline = glyph.o.split(' '));
        length = outline.length;
        for (i = 0; i < length; ) {
          action = outline[i++];
  
          switch(action) {
            case 'm':
              this.moveTo(outline[i++]*scale+offset, outline[i++]*-scale);
              break;
            case 'l':
              this.lineTo(outline[i++]*scale+offset, outline[i++]*-scale);
              break;
            case 'q':
              cpx = outline[i++]*scale+offset;
              cpy = outline[i++]*-scale;
              this.quadraticCurveTo(outline[i++]*scale+offset, outline[i++]*-scale, cpx, cpy);
              break;
          }
        }
      }
      return glyph.ha*scale;
    };
  }
  else {
    proto.renderGlyph = function(c, face) {
      var i, cpx, cpy, outline, action, glyph = face.glyphs[c], length;
      
      if (!glyph) return;

      if (glyph.o) {
        outline = glyph._cachedOutline || (glyph._cachedOutline = glyph.o.split(' '));
        length = outline.length;
        for (i = 0; i < length; ) {
          action = outline[i++];
 
          switch(action) {
            case 'm':
              this.moveTo(outline[i++], outline[i++]);
              break;
            case 'l':
              this.lineTo(outline[i++], outline[i++]);
              break;
            case 'q':
              cpx = outline[i++];
              cpy = outline[i++];
              this.quadraticCurveTo(outline[i++], outline[i++], cpx, cpy);
              break;
          }
        }
      }
      if (glyph.ha) this.translate(glyph.ha, 0);
    };
  }
  
  proto.getTextExtents = function(text, style){
    var width = 0, height = 0, ha = 0, 
        face = ctxt.getFaceFromStyle(style),
        i, glyph;
    
    for (i = 0; i < text.length; i++) {
      glyph = face.glyphs[text.charAt(i)] || face.glyphs[ctxt.options.fallbackCharacter];
      width += Math.max(glyph.ha, glyph.x_max);
      ha += glyph.ha;
    }
    
    return {
      width: width,
      height: face.lineHeight,
      ha: ha
    };
  };
  
  proto.getComputedStyle = function(style) {
    var p, canvasStyle = getElementStyle(this.canvas), 
        computedStyle = {};
    
    for (p in style) {
      computedStyle[p] = style[p];
    }
    
    // Compute the size
    var canvasFontSize = parseFloat(canvasStyle.fontSize),
        fontSize = parseFloat(style.size);

    if (typeof style.size == 'number' || style.size.indexOf('px') != -1) 
      computedStyle.size = fontSize;
    else if (style.size.indexOf('em') != -1)
      computedStyle.size = canvasFontSize * fontSize;
    else if(style.size.indexOf('%') != -1)
      computedStyle.size = (canvasFontSize / 100) * fontSize;
    else if (style.size.indexOf('pt') != -1)
      computedStyle.size = canvasFontSize * (4/3) * fontSize;
    else
      computedStyle.size = canvasFontSize;
    
    return computedStyle;
  };
  
  proto.getTextOffset = function(text, style, face) {
    var canvasStyle = getElementStyle(this.canvas),
        metrics = this.measureText(text), 
        scale = (style.size / face.resolution) * (3/4),
        offset = {x: 0, y: 0, metrics: metrics, scale: scale};

    switch (this.textAlign) {
      default:
      case null:
      case 'left': break;
      case 'center': offset.x = -metrics.width/2; break;
      case 'right':  offset.x = -metrics.width; break;
      case 'start':  offset.x = (canvasStyle.direction == 'rtl') ? -metrics.width : 0; break;
      case 'end':    offset.x = (canvasStyle.direction == 'ltr') ? -metrics.width : 0; break;
    }
    
    switch (this.textBaseline) {
      case 'alphabetic': break;
      default:
      case null:
      case 'ideographic':
      case 'bottom': offset.y = face.descender; break;
      case 'hanging': 
      case 'top': offset.y = face.ascender; break;
      case 'middle': offset.y = (face.ascender + face.descender) / 2; break;
    }
    offset.y *= scale;
    return offset;
  };

  proto.drawText = function(text, x, y, maxWidth, stroke){
    var style = this.parseStyle(this.font),
        face = ctxt.getFaceFromStyle(style),
        offset = this.getTextOffset(text, style, face);
    
    this.save();
    this.translate(x + offset.x, y + offset.y);
    if (face.strokeFont && !stroke) {
      this.strokeStyle = this.fillStyle;
    }
    this.beginPath();

    if (moz) {
      this.mozTextStyle = this.buildStyle(style);
      this[stroke ? 'mozPathText' : 'mozDrawText'](text);
    }
    else {
      this.scale(ctxt.scaling, ctxt.scaling);
      this.renderText(text, style);
      if (face.strokeFont) {
        this.lineWidth = style.size * (style.weight == 'bold' ? 0.5 : 0.3);
      }
    }

    this[(stroke || (face.strokeFont && !moz)) ? 'stroke' : 'fill']();

    this.closePath();
    this.restore();
    
    if (ctxt.options.debug) {
      var left = Math.floor(offset.x + x) + 0.5,
          top = Math.floor(y)+0.5;
          
      this.save();
      this.strokeStyle = '#F00';
      this.lineWidth = 0.5;
      this.beginPath();
      
      // Text baseline
      this.moveTo(left + offset.metrics.width, top);
      this.lineTo(left, top);
      
      // Text align
      this.moveTo(left - offset.x, top + offset.y);
      this.lineTo(left - offset.x, top + offset.y - style.size);
      
      this.stroke();
      this.closePath();
      this.restore();
    }
  };
  
  proto.fillText = function(text, x, y, maxWidth){
    this.drawText(text, x, y, maxWidth, false);
  };
  
  proto.strokeText = function(text, x, y, maxWidth){
    this.drawText(text, x, y, maxWidth, true);
  };
  
  proto.measureText = function(text){
    var style = this.parseStyle(this.font), 
        dim = {width: 0};
    
    if (moz) {
      this.mozTextStyle = this.buildStyle(style);
      dim.width = this.mozMeasureText(text);
    }
    else {
      var face = ctxt.getFaceFromStyle(style),
          scale = (style.size / face.resolution) * (3/4);
          
      dim.width = this.getTextExtents(text, style).ha * scale * ctxt.scaling;
    }
    
    return dim;
  };
})();