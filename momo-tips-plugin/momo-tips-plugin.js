(function(window, $, undefined) {

    var icons = ["star", "bookmark", "info", "info02"];

    $.momoTipsPlugin = function momoTipsPlugin(options, callback, element) {
        this.element = $(element);
        this._init(options, callback);
    };

    $.momoTipsPlugin.defaults = {
        opacity: 0.7,
        icon: "star",
    };

    $.momoTipsPlugin.prototype = {

        _init: function momoTipsPlugin_init(options, callback) {

            var instance = this, opts = this.options = $.extend(true, {}, $.momoTipsPlugin.defaults, options);
            this._initDom(opts);

        },

        _initDom: function momoTipsPlugin_initDom(opts) {

          var items = this.element.find("dt,dd");
          var iconIndex = 0;
          // 處理每個item
          items.each(function() {
            var $item = $(this);
            // var icon = $item.data("tipIcon") || opts.icon;

            // 照順序
            var icon = icons[(iconIndex++)%icons.length];

            var hot = $item.data("tipHot");
            var reason = $item.data("tipReason");
            var smiles = "";
            // full ☻ empty ☺
            for(var i = 0 ; i < hot ; i++) {
              smiles+="<span class='smile'>☻</span>";
            }
            for(var j = 0 ; j < 5-hot ; j++) {
              smiles+="<span class='smile'>☺</span>";
            }

            var reason = $item.data("tip-reason") || "";
            var position = $item.position();
            var tipIcon = $("<img />")
              .addClass("momo-tips-plugin")
              .addClass("tip-icon")
              .css("left", position.left + 120)
              .css("top", position.top)
              .css("opacity", 0.7)
              .mouseenter(function() { $(this).css("opacity", 1); })
              .mouseleave(function() { $(this).css("opacity", 0.7); })
              .attr("src", "./momo-tips-plugin/images/" + icon + ".png");

            var tipBox = $("<div />")
              .addClass("momo-tips-plugin")
              .addClass("tip-box");
                            
            $(tipIcon).tooltipster({
              theme: "my-custom-theme",
              animation: 'fade',
              timer: 0,
              delay: 100,
              offsetX: -15,
              offsetY: 5,
              touchDevices: true,
              trigger: 'hover',
              position: "top-right",
              content: $('<table><tr><td class="name">熱門度</td><td class="hot"><span class="smiles">'+smiles+'</span></td></tr><tr><td class="name">理由</td><td class="reason">'+reason+'</td></tr></table>')
            });

            $item.find("div").append(tipIcon);
          });

        },

        _createWrap: function momoTipsPlugin_createWrap() {

        },

        _createProduct: function momoTipsPlugin_createProduct() {

        },

        _parseJSON: function momoTipsPlugin_parseJSON() {

        },

        /*
         * 這是一個公開方法的範例，用於更新 options 設定值
         * 使用方式是 $('main').momoTipsPlugin('update', {page: 3});
         * 要留意的是，呼叫方法並不需要回呼的動作
         * 當然你要也可以，只是看起來很假會
         */
        update: function momoTipsPlugin_update(options) {
          var options = options || {};
          if ($.isPlainObject(options)) {
              this.options = $.extend(true, {}, this.options, options);
          }
        },

    };

    $.fn.momoTipsPlugin = function(options, callback) {
        var thisCall = typeof options;
        switch(thisCall) {
            // method
            case 'string':
                var args = Array.prototype.slice.call(arguments, 1);

                this.each(function() {
                    var instance = $.data(this, 'momoTipsPlugin');

                    if (!instance) {
                        return false;
                    }

                    // 我們使用 _ 開頭的函式來當作私有函式，所以不允許由外部呼叫
                    if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
                        return false;
                    }

                    instance[options].apply(instance, args);
                });
            break;

            // creation
            case 'object':
                this.each(function() {
                    var instance = $.data(this, 'momoTipsPlugin');

                    if (instance) {
                        instance.update(options);
                    } else {
                        // 我們透過 new 來動態建立一個我們所寫好的 prototype
                        // 並且將他利用 $.data 的方式儲存起來
                        // 好處是，我們隨時都可以用 $.data 把他拿出來作壞事
                        $.data(this, 'momoTipsPlugin', new $.momoTipsPlugin(options, callback, this));
                    }
                });
            break;
        }

        return this;

    };

})(window, jQuery);
