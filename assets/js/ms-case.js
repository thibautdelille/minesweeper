/*********************
 * ms-case.js *
 *********************/

(function ($) {

  /* MSCASE CLASS DEFINITION */

  var MSCase = function (element, options) {
    this.$element = $(element);
    this.options = options;
    this.init();
  };

  MSCase.prototype = {

    // Build
    init: function () {
      this.$element.on('click', $.proxy(this._click, this));
      return this;
    },
    _click: function (){
      this._toggle();
      if(this.options.value === 0){
        this.$element.trigger('empty');
      }
    },
    _toggle: function (){
      this.$element.addClass('open');
      switch(this.options.value){
      case -1:
        this.$element.addClass('bomb');
        this.$element.html('<span class="icon-cog"></span>');
        this.$element.trigger('boom');
        break;
      case 1:
        this.$element.addClass('blue');
        break;
      case 2:
        this.$element.addClass('teal');
        break;
      case 3:
        this.$element.addClass('green');
        break;
      case 4:
        this.$element.addClass('orange');
        break;
      case 5:
        this.$element.addClass('red');
        break;
      case 6:
        this.$element.addClass('marron');
        break;
      case 7:
        this.$element.addClass('fuchsia');
        break;
      case 8:
        this.$element.addClass('purple');
        break;
      }
      if(this.options.value>0){
        this.$element.html(this.options.value);
      }
      this.$element.trigger('toggle');
    },
    _addflag:function(){
      if(this.options.value === -1){
        this.$element.html('<span class="icon-flag"></span>');
      }
    }
  };

  /* MSCASE PLUGIN DEFINITION */
  var old = $.fn.mscase;

  $.fn.mscase = function (option) {
    return this.each(function() {
      var data = $(this).data('aau.mscase'),
          options = $.extend({}, $.fn.mscase.defaults, $(this).data(), typeof option === 'object' && option);
      if (!data) {
        $(this).data('aau.mscase', (data = new MSCase(this, options)));
      }
      if (typeof option === 'string') {
        data['_'+option]();
      }
    });
  };

  $.fn.mscase.defaults = {
    target: ''
  };

  $.fn.mscase.Constructor = MSCase;

  /* MSCASE NO CONFLICT */
  $.fn.mscase.noConflict = function () {
    $.fn.mscase = old;
    return this;
  };
})(window.jQuery);
