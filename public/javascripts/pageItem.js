(function (factory) {
    if (typeof define === "function" && define.amd) { //添加amd支持
        define(["jquery"], factory);
    } else {
        factory(jQuery);
    }
}(function ($, undefined) {
	 $.fn.extend({
        numSpinner: function(options) {
            var defaults = {
                increment: 1,
                onChange: function(value) {}
            };
            var opts = $.extend(defaults, options);
            return this.each(function() {
                var $this = $(this);
                var dom_min = opts.min;
                var dom_max = opts.max;
                var contentBox = $("<div>", {
                    "class": "numSpinnerBox"
                });
                var arrowup = $("<a>", {
                    "class": "sub",
                    "href": "javascript:void(0);"
                }).html("<i>-</i>");
                var arrowdown = $("<a>", {
                    "class": "add",
                    "href": "javascript:void(0);"
                }).html("<i>+</i>");
                if(!$this.parent().hasClass("numSpinnerBox")){
                        $this.after(contentBox);
                        contentBox.append($this);
                        $this.before(arrowup).after(arrowdown);
                }

                $this.val($this.val() || 0);
                arrowup.click(function() {
                    var num=0,optnum=$this.val()-opts.increment;
                        if(dom_min!=null){
                            num=optnum<dom_min?dom_min:optnum;
                        }else{
                            num=optnum;
                        }
                        $this.val(num);
                        opts.onChange($this,$this.val());
                });
                arrowdown.click(function() {
                   var num=0,optnum=parseInt($this.val())+opts.increment;
                        if(dom_max!=null){
                            num=optnum>dom_max?dom_max:optnum;
                        }
                        else{
                            num=optnum;
                        }
                        $this.val(num);
                        opts.onChange($this,$this.val());
                });
                $this.bind('keyup',function(){
                        var val=$(this).val().replace(/[^\d]/g,'')||1;
                        if(dom_min!=null){
                            val=parseFloat(val)<parseFloat(dom_min)?dom_min:val;
                        }
                        if(dom_max!=null){
                            val=parseFloat(val)>parseFloat(dom_max)?dom_max:val;
                        }
                        $(this).val(val);
                    }).blur(function(){
                        opts.onChange($this,$this.val());
                    });
            });
        }
     })
}));