/* Clippable Pattern
 *
 * Options:
 *    hover(boolean): Magnifies the button on hover. (false)
 *
 * Documentation:
 *   # Clippable
 *
 *   A pattern that adds a button to an element which, when clicked, 
 *   will copy the element's content to the clipboard.
 *
 *   # Example
 *
 *   {{ <div class="pat-clippable">This text will be selected and copied to the clipboard when the button is clicked</div> }}
 *
 *   # Example2
 *
 *   {{ <code class="pat-clippable" data-pat-clippable='{ "hover" : true }'>This text will be selected and copied to the clipboard when the button is clicked</code> }}
 *
 * License:
 *   License text, if it differs from the package's license, which is
 *   declared in package.json.
 *
 */
require([
  'pat-base',
  'jquery',
  'clipboard'
], function(Base, $, ClipboardJS){
  'use strict';
  var Clippable = Base.extend({
    name: 'clippable',
    trigger: '.pat-clippable',
    parser: 'mockup',
    defaults: {                      // default options
      hover: false
    },
    init: function () {
      var self = this;
      
      if (ClipboardJS.isSupported()) {
	self.$el.wrap('<span class="pat-clippable__wrapper"></span>');
	if (self.$el.is(self.block_elements())) {
          self.$el.parent().addClass('pat-clippable__wrapper_type_block')
	}
        self.$el.after(self.createButton());
      }
    },
    createButton: function() {
      var options = this.options;
      var buttonCreator = function(index, html) {
        var that = this;
        var field_elements = 'input,textarea';

        var div = document.createElement("div");
        div.innerHTML = html;
        var clipped = div.innerText;

        var button = document.createElement("button");
        button.classList.add('pat-clippable__button');
	if (options.hover) {
          button.classList.add('pat-clippable__button_withhover');
	}
        if (this.parentNode.classList.contains('pat-clippable__wrapper_type_block')) {
          button.classList.add('pat-clippable__button_type_block');
        }
        button.dataset.clipboardText = clipped;
        if ($(this).is(field_elements)) {
	  var random = (Math.random()*100000).toFixed();
	  var id = that.id;
          if (!id) {
            id = 'clip' + random;
            that.id = id;
	  }
          button.dataset.clipboardTarget = '#' + id;
	}

        var svg = '<svg class="pat-clippable__svg" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z"></path></svg>';
	if (options.hover) {
          svg = '<svg class="pat-clippable__svg pat-clippable__svg_withhover" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z"></path></svg>';
	}
        button.innerHTML = svg;

        $(button).on('mouseover', function(e) {
          $(that).addClass('pat-clippable_glow');
        })
        $(button).on('mouseout', function(e) {
          $(that).removeClass('pat-clippable_glow');
        })
        $(button).on('click', function(e) {
          $(that).addClass('pat-clippable_flash');
          $(e.currentTarget).addClass('pat-clippable__button_flash');
          $(that).removeClass('pat-clippable_glow');
          window.setTimeout(function() {
            $(that).removeClass('pat-clippable_flash');
            $(e.currentTarget).removeClass('pat-clippable__button_flash');
          }, 200);
          return false;
        })

        var clipboardoptions;
        if ($(this).is('textarea')) {
          clipboardoptions = {
            text: function(trigger) {
              return that.value;
            }
	  }
	}
        var clipboard = new ClipboardJS(button, clipboardoptions);

        clipboard.on('success', function(e) {
          console.debug(e.text);
        })
        return button;
      };
      return buttonCreator;
    },
    block_elements: function block_elements() {
      // See https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements
      var els = 'address,article,aside,blockquote,details,dialog,dd,div,dl,dt,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,li,main,nav,ol,p,pre,section,table,ul';
      var fields = 'input,textarea';
      return [els,fields].join(',');
    },
    table_elements: function table_elements() {
      // TODO: table elements need special handling
      var els = 'thead,tbody,tfoot,th,tr,td';
      return els;
    }
  });

  return Clippable;
});

