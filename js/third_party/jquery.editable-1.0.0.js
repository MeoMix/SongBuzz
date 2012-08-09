/*
 *
 * jQuery Editables 1.0.0
 * 
 * Date: July 20 2012
 * Source: www.tectual.com.au, www.arashkarimzadeh.com
 * Author: Arash Karimzadeh (arash@tectual.com.au)
 *
 * Copyright (c) 2012 Tectual Pty. Ltd.
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
(function($){
 
$.fn.editables = function(options){
  
  var opts = $.extend( {}, $.fn.editables.options, options );

  $('[data-type=editable]', this).each(
    function(){
      var $this = $(this);
      $($this.data('for')).hide()
        .bind('onFreeze', opts.onFreeze)
        .bind(
          opts.freezeOn, 
          function(){
            var t = $($this.data('for'));
            if(opts.beforeFreeze.call(t, $this)==false) return;
            t.hide();
            $this.show();
            t.trigger('onFreeze');
          }
        );
      $this.bind('onEdit', opts.onEdit)
        .bind(
          opts.editOn,
          function(){
            var t = $($this.data('for'));
            if(opts.beforeEdit.call($this, t)==false) return;
            $this.hide();
            t.show().focus();
            $this.trigger('onEdit');
          }
        );
    }
  );
  return this;
}
$.fn.editables.options = {
  editOn: 'click',      /* Event: All jquery events */
  beforeEdit: $.noop,   /* Function: It is called before conversion, you can stop it by returning false */
  onEdit: $.noop,       /* Function: This function bind to editable item as event */
  freezeOn: 'blur',     /* Event: All jquery events */
  beforeFreeze: $.noop, /* Function: It is called before conversion, you can stop it by returning false */
  onFreeze: $.noop      /* Function: This function bind to edit field as event */
}

})(jQuery);

