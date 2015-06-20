(function(window, $, undefined) {
    $.momoRecommendPlugin = function momoRecommendPlugin(options, callback, element) {
        this.element = $(element);
        this.products = [];
        this._init(options, callback);
    };

    $.momoRecommendPlugin.defaults = {
        numbers: 5,
        fixed: false,
        offsetX: 0,
        offsetY: 0,
    };

    $.momoRecommendPlugin.prototype = {

        _init: function momoRecommandPlugin_init(options, callback) {

            var instance = this, opts = this.options = $.extend(true, {}, $.momoRecommendPlugin.defaults, options);
            var self = this;

            // process data
            switch(opts.dataType) {
              case "json":
                $.getJSON(opts.data, function(data) {
                  $.each( data.products, function( key, val ) {
                    var product = {
                      name: val.name,
                      img: val.img,
                      price: val.price,
                    };
                    self.products.push(product);
                  });
                  self._initDom(opts);
                });
              break;
            }

        },

        _initDom: function momoRecommandPlugin_initDom(opts) {
          var el_x = this.element.offset().left;
          var el_y = this.element.offset().top;
          var el_w = this.element.outerWidth();
          var position = opts.fixed ? "fixed" : "absolute";

          // wrapper
          $dom = $("<div />")
                    .addClass("momo-recommand-plugin")
                    .css("position", position)
                    .css("left", el_x + el_w + opts.offsetX)
                    .css("top", el_y + opts.offsetY);

          // product wrapper
          $cols = $("<ul />")
                    .addClass("cols");

          // header
          $header = $("<div class='momo-header' />")
                      .html("建議商品");

          // per product
          for(var i = 0 ; i < opts.numbers ; i++) {
            var product = this.products[i],
              $col = $("<li />").addClass("col"),
              $product = $('<div class="product"></div>"'),
              $productImage = $('<a href="#"><div class="product-image"><img src="'+product.img+'" /></div></a>'),
              $productBody = $('<div class="product-body"></div>'),
              $productName = $('<div class="product-name">'+product.name+'</div>');
            
            $product.tooltipster({
              theme: 'tooltipster-noir',
              animation: 'fade',
              timer: 0,
              delay: 100,
              touchDevices: true,
              trigger: 'hover',
              position: "right",
              content: $('<div class="recommand-tip><p class="recommand-name">'+product.name+'</p><p class="recommand-price">$'+product.price+'</p></div>')
            });

            $col
              .append(
                $product.append(
                  $productImage.append(
                    //$productBody.append($productName)
                  )
                )
              );

            $col.append($product);
            $cols.append($col);
          }
          $dom.append($header);
          $dom.append($cols);

          this.element.after($dom);
        },

        _createWrap: function momoRecommandPlugin_createWrap() {

        },

        _createProduct: function momoRecommandPlugin_createProduct() {

        },

        _parseJSON: function momoRecommandPlugin_parseJSON() {

        },

        /*
         * 這是一個公開方法的範例，用於更新 options 設定值
         * 使用方式是 $('main').momoRecommendPlugin('update', {page: 3});
         * 要留意的是，呼叫方法並不需要回呼的動作
         * 當然你要也可以，只是看起來很假會
         */
        update: function momoRecommandPlugin_update(options) {
          var options = options || {};
          if ($.isPlainObject(options)) {
              this.options = $.extend(true, {}, this.options, options);
          }
        },

    };

    $.fn.momoRecommendPlugin = function(options, callback) {
        var thisCall = typeof options;
        switch(thisCall) {
            // method
            case 'string':
                var args = Array.prototype.slice.call(arguments, 1);

                this.each(function() {
                    var instance = $.data(this, 'momoRecommendPlugin');

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
                    var instance = $.data(this, 'momoRecommendPlugin');

                    if (instance) {
                        instance.update(options);
                    } else {
                        // 我們透過 new 來動態建立一個我們所寫好的 prototype
                        // 並且將他利用 $.data 的方式儲存起來
                        // 好處是，我們隨時都可以用 $.data 把他拿出來作壞事
                        $.data(this, 'momoRecommendPlugin', new $.momoRecommendPlugin(options, callback, this));
                    }
                });
            break;
        }

        return this;

    };

})(window, jQuery);
