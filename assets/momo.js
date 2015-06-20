/*
 * jQuery Autocomplete plugin 1.1
 *
 * Copyright (c) 2009 Jorn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id: jquery.autocomplete.js 15 2009-08-22 10:30:27Z joern.zaefferer $
 */
(function(a){a.fn.extend({autocomplete:function(b,c){var d=typeof b=="string";c=a.extend({},a.Autocompleter.defaults,{url:d?b:null,data:d?null:b,delay:d?a.Autocompleter.defaults.delay:10,max:c&&!c.scroll?10:150},c);c.highlight=c.highlight||function(e){return e};c.formatMatch=c.formatMatch||c.formatItem;return this.each(function(){new a.Autocompleter(this,c)})},result:function(b){return this.bind("result",b)},search:function(b){return this.trigger("search",[b])},flushCache:function(){return this.trigger("flushCache")},setOptions:function(b){return this.trigger("setOptions",[b])},unautocomplete:function(){return this.trigger("unautocomplete")}});a.Autocompleter=function(l,g){var c={UP:38,DOWN:40,DEL:46,TAB:9,RETURN:13,ESC:27,COMMA:188,PAGEUP:33,PAGEDOWN:34,BACKSPACE:8};var b=a(l).attr("autocomplete","off").addClass(g.inputClass);var j;var p="";var m=a.Autocompleter.Cache(g);var e=0;var u;var x={mouseDownOnSelect:false};var r=a.Autocompleter.Select(g,l,d,x);var w;a.browser.opera&&a(l.form).bind("submit.autocomplete",function(){if(w){w=false;return false}});b.bind((a.browser.opera?"keypress":"keydown")+".autocomplete",function(y){e=1;u=y.keyCode;switch(y.keyCode){case c.UP:y.preventDefault();if(r.visible()){r.prev()}else{t(0,true)}break;case c.DOWN:y.preventDefault();if(r.visible()){r.next()}else{t(0,true)}break;case c.PAGEUP:y.preventDefault();if(r.visible()){r.pageUp()}else{t(0,true)}break;case c.PAGEDOWN:y.preventDefault();if(r.visible()){r.pageDown()}else{t(0,true)}break;case g.multiple&&a.trim(g.multipleSeparator)==","&&c.COMMA:case c.TAB:case c.RETURN:if(d()){y.preventDefault();w=true;return false}break;case c.ESC:r.hide();break;default:clearTimeout(j);j=setTimeout(t,g.delay);break}}).focus(function(){e++}).blur(function(){e=0;if(!x.mouseDownOnSelect){s()}}).click(function(){if(e++>1&&!r.visible()){t(0,true)}}).bind("search",function(){var y=(arguments.length>1)?arguments[1]:null;function z(D,C){var A;if(C&&C.length){for(var B=0;B<C.length;B++){if(C[B].result.toLowerCase()==D.toLowerCase()){A=C[B];break}}}if(typeof y=="function"){y(A)}else{b.trigger("result",A&&[A.data,A.value])}}a.each(h(b.val()),function(A,B){f(B,z,z)})}).bind("flushCache",function(){m.flush()}).bind("setOptions",function(){a.extend(g,arguments[1]);if("data" in arguments[1]){m.populate()}}).bind("unautocomplete",function(){r.unbind();b.unbind();a(l.form).unbind(".autocomplete")});function d(){var B=r.selected();if(!B){return false}var y=B.result;p=y;if(g.multiple){var E=h(b.val());if(E.length>1){var A=g.multipleSeparator.length;var D=a(l).selection().start;var C,z=0;a.each(E,function(F,G){z+=G.length;if(D<=z){C=F;return false}z+=A});E[C]=y;y=E.join(g.multipleSeparator)}y+=g.multipleSeparator}b.val(y);v();b.trigger("result",[B.data,B.value]);return true}function t(A,z){if(u==c.DEL){r.hide();return}var y=b.val();if(!z&&y==p){return}p=y;y=i(y);if(y.length>=g.minChars){b.addClass(g.loadingClass);if(!g.matchCase){y=y.toLowerCase()}f(y,k,v)}else{n();r.hide()}}function h(y){if(!y){return[""]}if(!g.multiple){return[a.trim(y)]}return a.map(y.split(g.multipleSeparator),function(z){return a.trim(y).length?a.trim(z):null})}function i(y){if(!g.multiple){return y}var A=h(y);if(A.length==1){return A[0]}var z=a(l).selection().start;if(z==y.length){A=h(y)}else{A=h(y.replace(y.substring(z),""))}return A[A.length-1]}function q(y,z){if(g.autoFill&&(i(b.val()).toLowerCase()==y.toLowerCase())&&u!=c.BACKSPACE){b.val(b.val()+z.substring(i(p).length));a(l).selection(p.length,p.length+z.length)}}function s(){clearTimeout(j);j=setTimeout(v,200)}function v(){var y=r.visible();r.hide();clearTimeout(j);n();if(g.mustMatch){b.search(function(z){if(!z){if(g.multiple){var A=h(b.val()).slice(0,-1);b.val(A.join(g.multipleSeparator)+(A.length?g.multipleSeparator:""))}else{b.val("");b.trigger("result",null)}}})}}function k(z,y){if(y&&y.length&&e){n();r.display(y,z);q(z,y[0].value);r.show()}else{v()}}function f(z,B,y){if(!g.matchCase){z=z.toLowerCase()}var A=m.load(z);if(A&&A.length){B(z,A)}else{if((typeof g.url=="string")&&(g.url.length>0)){var D={timestamp:+new Date()};a.each(g.extraParams,function(E,F){D[E]=typeof F=="function"?F():F});var C={flag:"keywords",data:a.extend({q:momoj.str2Unicode(i(z)),limit:g.max},D)};a.ajax({mode:"abort",port:"autocomplete"+l.name,dataType:"json",url:g.url,data:{data:JSON.stringify(C)},success:function(F){var E=g.parse&&g.parse(F.rtnData)||o(F.rtnData);m.add(z,E);B(z,E)}})}else{r.emptyList();y(z)}}}function o(B){var y=[];var A=B.split("\n");for(var z=0;z<A.length;z++){var C=a.trim(A[z]);if(C){C=C.split("|");y[y.length]={data:C,value:C[0],result:g.formatResult&&g.formatResult(C,C[0])||C[0]}}}return y}function n(){b.removeClass(g.loadingClass)}};a.Autocompleter.defaults={inputClass:"ac_input",resultsClass:"ac_results",loadingClass:"ac_loading",minChars:1,delay:400,matchCase:false,matchSubset:true,matchContains:false,cacheLength:10,max:100,mustMatch:false,extraParams:{},selectFirst:true,formatItem:function(b){return b[0]},formatMatch:null,autoFill:false,width:0,multiple:false,multipleSeparator:", ",highlight:function(c,b){return c.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)("+b.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi,"\\$1")+")(?![^<>]*>)(?![^&;]+;)","gi"),"<strong>$1</strong>")},scroll:true,scrollHeight:180};a.Autocompleter.Cache=function(c){var f={};var d=0;function h(l,k){if(!c.matchCase){l=l.toLowerCase()}var j=l.indexOf(k);if(c.matchContains=="word"){j=l.toLowerCase().search("\\b"+k.toLowerCase())}if(j==-1){return false}return j==0||c.matchContains}function g(j,i){if(d>c.cacheLength){b()}if(!f[j]){d++}f[j]=i}function e(){if(!c.data){return false}var k={},j=0;if(!c.url){c.cacheLength=1}k[""]=[];for(var m=0,l=c.data.length;m<l;m++){var p=c.data[m];p=(typeof p=="string")?[p]:p;var o=c.formatMatch(p,m+1,c.data.length);if(o===false){continue}var n=o.charAt(0).toLowerCase();if(!k[n]){k[n]=[]}var q={value:o,data:p,result:c.formatResult&&c.formatResult(p)||o};k[n].push(q);if(j++<c.max){k[""].push(q)}}a.each(k,function(r,s){c.cacheLength++;g(r,s)})}setTimeout(e,25);function b(){f={};d=0}return{flush:b,add:g,populate:e,load:function(n){if(!c.cacheLength||!d){return null}if(!c.url&&c.matchContains){var m=[];for(var j in f){if(j.length>0){var o=f[j];a.each(o,function(p,k){if(h(k.value,n)){m.push(k)}})}}return m}else{if(f[n]){return f[n]}else{if(c.matchSubset){for(var l=n.length-1;l>=c.minChars;l--){var o=f[n.substr(0,l)];if(o){var m=[];a.each(o,function(p,k){if(h(k.value,n)){m[m.length]=k}});return m}}}}}return null}}};a.Autocompleter.Select=function(e,j,l,p){var i={ACTIVE:"ac_over"};var k,f=-1,r,m="",s=true,c,o;function n(){if(!s){return}c=a("<div/>").hide().addClass(e.resultsClass).css("position","absolute").appendTo(document.body);o=a("<ul/>").appendTo(c).mouseover(function(t){if(q(t).nodeName&&q(t).nodeName.toUpperCase()=="LI"){f=a("li",o).removeClass(i.ACTIVE).index(q(t));a(q(t)).addClass(i.ACTIVE)}}).click(function(t){a(q(t)).addClass(i.ACTIVE);l();j.focus();return false}).mousedown(function(){p.mouseDownOnSelect=true}).mouseup(function(){p.mouseDownOnSelect=false});if(e.width>0){c.css("width",e.width)}s=false}function q(u){var t=u.target;while(t&&t.tagName!="LI"){t=t.parentNode}if(!t){return[]}return t}function h(t){k.slice(f,f+1).removeClass(i.ACTIVE);g(t);var v=k.slice(f,f+1).addClass(i.ACTIVE);if(e.scroll){var u=0;k.slice(0,f).each(function(){u+=this.offsetHeight});if((u+v[0].offsetHeight-o.scrollTop())>o[0].clientHeight){o.scrollTop(u+v[0].offsetHeight-o.innerHeight())}else{if(u<o.scrollTop()){o.scrollTop(u)}}}}function g(t){f+=t;if(f<0){f=k.size()-1}else{if(f>=k.size()){f=0}}}function b(t){return e.max&&e.max<t?e.max:t}function d(){o.empty();var u=b(r.length);for(var v=0;v<u;v++){if(!r[v]){continue}var w=e.formatItem(r[v].data,v+1,u,r[v].value,m);if(w===false){continue}var t=a("<li/>").html(e.highlight(w,m)).addClass(v%2==0?"ac_even":"ac_odd").appendTo(o)[0];a.data(t,"ac_data",r[v])}k=o.find("li");if(e.selectFirst){k.slice(0,1).addClass(i.ACTIVE);f=0}if(a.fn.bgiframe){o.bgiframe()}}return{display:function(u,t){n();r=u;m=t;d()},next:function(){h(1)},prev:function(){h(-1)},pageUp:function(){if(f!=0&&f-8<0){h(-f)}else{h(-8)}},pageDown:function(){if(f!=k.size()-1&&f+8>k.size()){h(k.size()-1-f)}else{h(8)}},hide:function(){c&&c.hide();k&&k.removeClass(i.ACTIVE);f=-1},visible:function(){return c&&c.is(":visible")},current:function(){return this.visible()&&(k.filter("."+i.ACTIVE)[0]||e.selectFirst&&k[0])},show:function(){var v=a(j).offset();c.css({width:typeof e.width=="string"||e.width>0?e.width:a(j).width(),top:v.top+j.offsetHeight,left:v.left}).show();if(e.scroll){o.scrollTop(0);o.css({maxHeight:e.scrollHeight,overflow:"auto"});if(a.browser.msie&&typeof document.body.style.maxHeight==="undefined"){var t=0;k.each(function(){t+=this.offsetHeight});var u=t>e.scrollHeight;o.css("height",u?e.scrollHeight:t);if(!u){k.width(o.width()-parseInt(k.css("padding-left"))-parseInt(k.css("padding-right")))}}}},selected:function(){var t=k&&k.filter("."+i.ACTIVE).removeClass(i.ACTIVE);return t&&t.length&&a.data(t[0],"ac_data")},emptyList:function(){o&&o.empty()},unbind:function(){c&&c.remove()}}};a.fn.selection=function(i,b){if(i!==undefined){return this.each(function(){if(this.createTextRange){var j=this.createTextRange();if(b===undefined||i==b){j.move("character",i);j.select()}else{j.collapse(true);j.moveStart("character",i);j.moveEnd("character",b);j.select()}}else{if(this.setSelectionRange){this.setSelectionRange(i,b)}else{if(this.selectionStart){this.selectionStart=i;this.selectionEnd=b}}}})}var g=this[0];if(g.createTextRange){var c=document.selection.createRange(),h=g.value,f="<->",d=c.text.length;c.text=f;var e=g.value.indexOf(f);g.value=h;this.selection(e,e+d);return{start:e,end:e+d}}else{if(g.selectionStart!==undefined){return{start:g.selectionStart,end:g.selectionEnd}}}}})(jQuery);

/*
http://www.json.org json2.js
*/
var JSON;JSON||(JSON={});
(function(){function k(a){return a<10?"0"+a:a}function n(a){o.lastIndex=0;return o.test(a)?'"'+a.replace(o,function(c){var d=q[c];return typeof d==="string"?d:"\\u"+("0000"+c.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function l(a,c){var d,f,j=g,e,b=c[a];if(b&&typeof b==="object"&&typeof b.toJSON==="function")b=b.toJSON(a);if(typeof h==="function")b=h.call(c,a,b);switch(typeof b){case "string":return n(b);case "number":return isFinite(b)?String(b):"null";case "boolean":case "null":return String(b);case "object":if(!b)return"null";
g+=m;e=[];if(Object.prototype.toString.apply(b)==="[object Array]"){f=b.length;for(a=0;a<f;a+=1)e[a]=l(a,b)||"null";c=e.length===0?"[]":g?"[\n"+g+e.join(",\n"+g)+"\n"+j+"]":"["+e.join(",")+"]";g=j;return c}if(h&&typeof h==="object"){f=h.length;for(a=0;a<f;a+=1)if(typeof h[a]==="string"){d=h[a];if(c=l(d,b))e.push(n(d)+(g?": ":":")+c)}}else for(d in b)if(Object.prototype.hasOwnProperty.call(b,d))if(c=l(d,b))e.push(n(d)+(g?": ":":")+c);c=e.length===0?"{}":g?"{\n"+g+e.join(",\n"+g)+"\n"+j+"}":"{"+e.join(",")+
"}";g=j;return c}}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+k(this.getUTCMonth()+1)+"-"+k(this.getUTCDate())+"T"+k(this.getUTCHours())+":"+k(this.getUTCMinutes())+":"+k(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()}}var p=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
o=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,g,m,q={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},h;if(typeof JSON.stringify!=="function")JSON.stringify=function(a,c,d){var f;m=g="";if(typeof d==="number")for(f=0;f<d;f+=1)m+=" ";else if(typeof d==="string")m=d;if((h=c)&&typeof c!=="function"&&(typeof c!=="object"||typeof c.length!=="number"))throw new Error("JSON.stringify");return l("",
{"":a})};if(typeof JSON.parse!=="function")JSON.parse=function(a,c){function d(f,j){var e,b,i=f[j];if(i&&typeof i==="object")for(e in i)if(Object.prototype.hasOwnProperty.call(i,e)){b=d(i,e);if(b!==undefined)i[e]=b;else delete i[e]}return c.call(f,j,i)}a=String(a);p.lastIndex=0;if(p.test(a))a=a.replace(p,function(f){return"\\u"+("0000"+f.charCodeAt(0).toString(16)).slice(-4)});if(/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){a=eval("("+a+")");return typeof c==="function"?d({"":a},""):a}throw new SyntaxError("JSON.parse");}})();

/*
 * jQuery UI for MomoShop
 *
 * Author: Rex Ho.
 * Date: 2010/03/18
 * Depends:
 *  jquery-1.4.2.js
 */
var momoj=jQuery.noConflict();
var ImgS=4;
var ImgN=0;

if(typeof console=='undefined'){
  console={};
  console.log=function(){return;}
}

(function($) {

/*
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
*/
$.fn.cookie = function(name, value, settings) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        settings = settings || {};
        if (value === null) {
            value = '';
            settings.expires = -1;
        }
        var expires = '';
        if (settings.expires && (typeof settings.expires == 'number' || settings.expires.toUTCString)) {
            var date;
            if (typeof settings.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (settings.expires * 24 * 60 * 60 * 1000));
            } else {
                date = settings.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize settings.path and settings.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = settings.path ? '; path=' + (settings.path) : '';
        var domain = settings.domain ? '; domain=' + (settings.domain) : '';
        var secure = settings.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
}

// timer, return a timer object, so you can stop, reset again and again
$.fn.timer = function (interval, callback){
  var interval = interval || 100;
  if (!callback)
    return false;
  
  var _timer = function (interval, callback) {
    this.stop = function () {
      clearInterval(self.id);
    };
    
    this.internalCallback = function () {
      callback(self);
    };
    
    this.reset = function (val) {
      if (self.id)
        clearInterval(self.id);
      
      var val = val || 100;
      this.id = setInterval(this.internalCallback, this.interval);
    };
    
    this.interval = interval;
    this.id = setInterval(this.internalCallback, this.interval);

    var self = this;
  };
  return new _timer(interval, callback);
};

$.fn.HashTables = function(){

  var _HashTables = function(){
    this.items=new Array();
    this.keyArray=new Array();
    this.itemsCount=0;
    this.add = function(key,value){
      if(!this.containsKey(key)){
        this.items[key]=value;
        this.itemsCount++;
        this.keyArray.push(key);
      }else{
        //throw "key '"+key+"' allready exists."
        this.items[key]=value;
      }
    }
    this.get=function(key){
      if(this.containsKey(key))
        return this.items[key];
      else
        return typeof(this.items[key]);
    }
    this.remove = function(key){
      if(this.containsKey(key)){
        delete this.keyArray[key];
        delete this.items[key];
        this.itemsCount--;
      }else{
        throw "key '"+key+"' does not exists."
      }
    }
    this.containsKey= function(key){
      return typeof(this.items[key])!="undefined";
    }
    this.containsValue = function containsValue(value){
      for (var item in this.items){
        if(this.items[item]==value)
          return true;
      }
      return false;
    }
    this.contains = function(keyOrValue){
      return this.containsKey(keyOrValue) || this.containsValue(keyOrValue);
    }
    this.clear = function(){
      this.items=new Array();
      this.keyArray=new Array();
      this.itemsCount=0;
    }
    this.size = function(){
      return this.itemsCount;
    }
    this.isEmpty = function(){
      return this.size()==0;
    } 
    this.getItems = function(key){
      return this.items[key];
    }
  }
  return new _HashTables();
}

// tab change
$.fn.TabDelay = function(settings){
  var container=$(this);
  // if container is array, scan it
  if ( container.length >1 ) {
    container.each(function(){
      $(this).TabDelay(settings);
    });
    return false;
  }
  var Timer=null;
  var _TabIndex=0;  
  var _defaultSettings = {        
    StartTab:0        // deafult show tab 1
    ,RollerSpeed :0   // roller speed seconds
    ,SetTab:0         // for set some tab
    ,Start:0          // start roller tab
    ,Stop:0           // stop roller tab
    ,RelTab:''        // relation tab bt
    ,threshold:0      // lazy img threshold
    ,container:window 
  }; 
  var _settings = $.extend(_defaultSettings, settings);
  
  if(container.data('StartTab')>0){
    _settings.StartTab=container.data('StartTab');
  }else{
    _settings.StartTab=0;
  }
  _settings.RollerSpeed=0;
  
  var _TabDelay=function(){
    
    if (_settings.SetTab>0){
      _settings.SetTab--;
      _changeTab(container.attr('id'),_settings.SetTab);
      container.data('StartTab',_settings.SetTab++);
      //alert('Tab id:'+container.attr('id')+';'+container.data('StartTab'));
    } 
    if (_settings.Start>0) {
      container.data('Roller',1);
      _StartRoller();
    } 
    if (_settings.Stop>0) {
      container.data('Roller',0);
      _StopRoller();
    }
    
    if ( !container.data('TabDelayInit')) {
      var $TabMenuList=$('div.TabMenu ul li',this);
      // bind every menu events
      $TabMenuList.each(function(i){
        // give tabid, tabindex to show tab when mouse over
        $(this)
          .bind('mouseover',{tabid:container.attr('id'),index:i},_setTab)
          .bind('mouseout',{tabid:container.attr('id'),index:i},_outTab)
        ;
      });
      
      var $TabContentList=$('div.TabContentD',container);
      $TabContentList.each(function(i){
        // in ECM, mayBe has DEL class name, 
        // so must remove
        if ($(this).hasClass('DEL'))
          $(this).removeClass('TabContentD');
          
        // give tabid, tabindex to show tab when mouse over
        $(this)
          .bind('mouseover',{tabid:container.attr('id'),index:i},_setTab)
          .bind('mouseout',{tabid:container.attr('id'),index:i},_outTab)
        ;
      });
      $TabContentList=$('div.TabContentD',container);
      // show tab --
      // if _settings.StartTab = 0, that mean random show start tab
      
      if ( _settings.StartTab == 0) {
        _settings.StartTab = Math.floor(Math.random()*$TabContentList.length)+1;
        //alert(container.attr('id')+':'+$TabContentList.length);
      }
      _settings.StartTab--;
      // show default tab when onload 
      _changeTab(container.attr('id'),_settings.StartTab);

      // roller tab if ( _settings.RollerSpeed > 0 )
      if ( _settings.RollerSpeed > 0 ){
        _RollerTab();
      }
      /*
      $('img',container).each(function(){
        var _img=$(this);
        var _src=_img.attr('src')+'?r='+Math.random();
        _img.attr('src',_src);
      });
      */
      container.data('TabDelayInit',1);
    }
  }
  
  var _setTab = function(e){
    _changeTab(e.data.tabid,e.data.index);
    //if (Timer) Timer.stop();
    _StopRoller();
  }

  var _outTab = function(e){
    //if (Timer) Timer.reset();
    _StartRoller();
  }
  
  var _StartRoller = function(){
    if (container.data('Roller')==0) return;
    var _Timer=jQuery('body').data('MomoTabTimer_'+container.attr('id'));
    if (_Timer) _Timer.reset();
  }

  var _StopRoller = function(){
    var _Timer=jQuery('body').data('MomoTabTimer_'+container.attr('id'));
    if (_Timer) _Timer.stop();
  }  
  
  var _changeTab = function(tabid,tabindex){
    var MainTab=$('#'+tabid);//get MiainTab
    // get TabContentD list to change class
    var $MenuList=$('div.TabMenu ul li',MainTab);
    $MenuList.each(function(i){
      var oa=$('a',this);
      $(this).removeClass('First-Element');
      if (oa) $(oa).addClass('First-Element');  
      
      if ( i===tabindex) { 
        $(this).addClass('selected');
        if (oa) $(oa).addClass('selected');
      }
      else {
        $(this).removeClass('selected');
        if (oa) $(oa).removeClass('selected');        
      }
    });
    // get TabContentD list to change class
    var $ContentList=$('div.TabContentD',MainTab);
    $ContentList.each(function(i){
      var _tab=$(this);
      _tab.removeClass('First-Element');
      if ( i===tabindex) {
        _tab.addClass('selected');
        $("img",_tab).each(function(){
          var _img=$(this);
          if(_img.attr("src")=="/ecm/img/cmm/blank.png"){
            if (!$.belowthefold(this, _settings) && !$.rightoffold(this, _settings) ){
              _img.attr("src",$.getImgSrc({org:_img.attr("org")}));
            }else{
              _img.attr("lazy","2");
            }
          }
        });
      } else {
        _tab.removeClass('selected');
      }
    });

    // record tabindex where roller staring use
    _TabIndex=tabindex;
    if (_settings.RelTab !=''){
      if(momoj('#'+_settings.RelTab).data('StartTab') ==null ) {
          momoj('#'+_settings.RelTab).data('StartTab',_TabIndex+1);
      }
      momoj('#'+_settings.RelTab).TabDelay({SetTab:_TabIndex+1});//data('StartTab',_TabIndex+1);
    }
  }

  // roller tab
  var _RollerTab = function(){
    var _TabLen=$('div.TabContentD',container).length;
    var _RLS=_settings.RollerSpeed*1000;
    
    // if the container has timer, stop it, and destory it;
    var _oldTimerObj=jQuery('body').data('MomoTabTimer_'+container.attr('id'));
    if (_oldTimerObj) {
      _oldTimerObj.stop();
    }
    
    Timer=container.timer(_RLS,function() {
      _TabIndex++;
      if (_TabIndex >= _TabLen) _TabIndex=0;
      _changeTab(container.attr('id'),_TabIndex);
    });

    jQuery('body').data('MomoTabTimer_'+container.attr('id'),Timer);
    
  }  
  
  return this.each(_TabDelay);
};

// roller v h
$.fn.Roller = function(settings){  
  var container=$(this);
  // if container is array, scan it
  if ( container.length >1 ) {
    container.each(function(){
      $(this).Roller(settings);
    });
    return false;
  }
  var Timer=null;
  var _defaultSettings = {       
    Pos : 12,         // how px move per time
    Delay : 0,        // pause sec per roller
    Speed : 200,      // roller speed
    PausePx: 0,      // move this px, and delay $Delay secs
    Direction: 'V',   // V:vertical or H:horizontal
    RotateWay: 'P',   // Positive: up or left, Negative:down or right
    MinWidth : 0    // The minima width ex:50,100
  };    
  var _settings = $.extend(_defaultSettings, settings);
  _settings.Delay *= 1000;

  if (_settings.Speed==0){
    return;
  }
  
  container.data('Roller',1);
  var _Content1=null;
  if ( _settings.Direction == 'V' ){
    _Content1=container.children('.TabContent');
  }else{
    _Content1=$('.TabContent > .TabContentD',container);
    //var _ddw=$('dl>dd',_Content1).length*$('dl>dd',_Content1).innerWidth();
    var _ddw=0;
    $('dl>dd',_Content1).each(function(){
      _ddw+=$(this).outerWidth(true);      
    });
    _Content1.css({
      position: 'relative',
      width: _ddw+'px',
      float: 'left'
    });
    $('.TabContent',container).css({width:_ddw*2+100});
  }
  
  //var _defaultHeight=parseInt(_Content1.css('height'));
  //alert(_ddw);
  if(_settings.MinWidth>0&&_settings.MinWidth>_ddw){
    return;
  }
  
  var _Content2=_Content1.clone().appendTo(_Content1.parent());
  setTimeout(function(){
    $('img',_Content2).each(function(){
      var img=$(this);
      if (img.attr('src').indexOf('/ecm/img/cmm/blank.png')>-1){
        img.attr('src',img.attr('org'));
      }
    });
  },500);  
  var _moveAttr='top';
  var _moveWay=-1;
  var _changeWay=-1;
  var _boxHW=0;
  if ( _settings.Direction == 'H' ){
    _moveAttr='left';
    _boxHW=parseInt(_Content1.width());
  } else {
    _boxHW=parseInt(_Content1.height());
  }  
  if ( _settings.RotateWay == 'N' ){
    _moveWay=1;
    _changeWay=1;
  }
  
  var _Content2DP=0;
  // set _content2 default position by _settings.Direction, and _settings.RotateWay
  if (_settings.RotateWay == 'N') {
    _Content2DP=-2*_boxHW;
  }
  _Content1.css(_moveAttr,'0px');
  _Content2.css(_moveAttr,_Content2DP+'px');

  // if there is change direction
  var dirP=$('.ScrollP',container.parent().parent());  
  var dirN=$('.ScrollN',container.parent().parent());
  
  var _Roller = function() {
    container
      .bind('mouseover',_mover)
      .bind('mouseout',_mout);
    ;
    
    if ( $(dirP).hasClass('ScrollP'))
      dirP.bind('click',{dir:'P'},_dclick)
          .bind('mouseover',{dir:'P'},_dmover)
          .bind('mouseout',{dir:'P'},_dmout);

    if ( $(dirN).hasClass('ScrollN'))
      dirN.bind('click',{dir:'N'},_dclick)
          .bind('mouseover',{dir:'N'},_dmover)
          .bind('mouseout',{dir:'N'},_dmout);
      
    var _C1Pos=0;
    var _C2Pos=0;
    var _mvpx=0;

    var _oldTimerObj=jQuery('body').data('MomoRollTimer_'+container.attr('id'));
    if (_oldTimerObj) {
      _oldTimerObj.stop();
    }
    
    Timer=container.timer(_settings.Speed,function(){
      if(container.data('Roller')==0) return;
      // if has pause and delay > 0, when change way, 
      // _changeWay, _moveWay will not be the same
      if ( _changeWay != _moveWay ){
        if (_mvpx >0) _mvpx = _settings.PausePx - _mvpx;
        _moveWay=_changeWay;
        if ( (_C1Pos*_moveWay) ===_boxHW) {
          _C1Pos=-1*_boxHW*_moveWay;
          _Content1.css(_moveAttr,_C1Pos+'px');
        }
        if (_C1Pos===0){
          _Content2.css(_moveAttr,_Content2DP+'px');
        }        
      }

      // move block
      _C1Pos=parseInt(_Content1.css(_moveAttr));
      _C1Pos += _settings.Pos*_moveWay;
      _C2Pos=parseInt(_Content2.css(_moveAttr));
      _C2Pos += _settings.Pos*_moveWay;
      _Content1.css(_moveAttr,_C1Pos+'px');
      _Content2.css(_moveAttr,_C2Pos+'px');
      _mvpx += _settings.Pos;
      
      if ( (_C1Pos*_moveWay) ===_boxHW) {
        _C1Pos=-1*_boxHW*_moveWay;
        _Content1.css(_moveAttr,_C1Pos+'px');
      }
      if (_C1Pos===0){
        _Content2.css(_moveAttr,_Content2DP+'px');
      }
      // when roller need pause, _settings.Delay > 0
      if ( _settings.Delay >0 &&  _mvpx === _settings.PausePx ) {
        Timer.stop();
        _moveWay=_changeWay;
        _mvpx=0;
        if(container.data('Roller')==0) return;
        var tid=setTimeout(
          function(){
            if(container.data('Roller')==0) return;
            Timer.reset();
          }
          ,_settings.Delay);
        container.data('tid',tid);
      }
    });
  
    jQuery('body').data('MomoRollTimer_'+container.attr('id'),Timer);
    //alert(container.attr('id'));
  }
  
  var _mover = function(){
    clearTimeout(container.data('tid'));
    var _Timer=jQuery('body').data('MomoRollTimer_'+container.attr('id'));
    if(_Timer){
      container.data('Roller',0);
      _Timer.stop();
    }
  }
  
  var _mout = function(){    
    clearTimeout(container.data('tid'));
    var _Timer=jQuery('body').data('MomoRollTimer_'+container.attr('id'));
    if(_Timer){
      container.data('Roller',1);
      _Timer.reset();
    }
  }

  var _dmover = function(e){
    if ( e.data.dir == 'P' ){
      $('>:first-child',dirP).addClass('O');
      $('>:last-child',dirP).removeClass('O');
    } else {
      $('>:first-child',dirN).addClass('O');
      $('>:last-child',dirN).removeClass('O');
    }    
  }

  var _dmout = function(e){
    if ( e.data.dir == 'P' ){
      $('>:first-child',dirP).removeClass('O');
      $('>:last-child',dirP).addClass('O');
    } else {
      $('>:first-child',dirN).removeClass('O');
      $('>:last-child',dirN).addClass('O');
    }    
  }  

  // change roller way  
  // no pause delay, change way right now.
  var _dclick = function(e){
    if ( e.data.dir == 'P' ){
      if (_settings.Delay>0) _changeWay=-1;
      else _changeWay=_moveWay=-1;
      _Content2DP=0;
    } else {
      if (_settings.Delay>0) _changeWay=1;
      else _changeWay=_moveWay=1;
      _Content2DP=-2*_boxHW;
    }
  }  
  
  return this.each(_Roller);
};

// adj BT css 
// usage: $().btCSS({newline:'mm-new-line-5,5',lastline:'mm-last-line,5',adjbt:1})
// newline: mm-new-line-5(class name for lastest elements of every row ),5(elements for per line)
// lastline: mm-last-line(calss name for lastest line ),5(elements for per line)
$.fn.btCSS=function(settings){
  var container=$(this);
  // if container is array, scan it
  if ( container.length >1 ) {
    container.each(function(){
      $(this).btCSS(settings);
    });
    return false;
  }  
  var _defaultSettings = {        
    newline: 'undefined',
    lastline: 'undefined',
    lastitem: 'undefined'
  };
  var _settings = $.extend(_defaultSettings, settings);
  
  var _btcss = function(){
    // init something
    if (!container.data('BTCSSInit')){
      container.data('newline',_settings.newline);
      container.data('lastline',_settings.lastline);
      container.data('lastitem',_settings.lastitem);
      container.data('BTCSSInit',1);
    }
    if (_settings.newline!='undefined'){
      container.data('newline',_settings.newline);
    }    
    if (_settings.lastline!='undefined'){
      container.data('lastline',_settings.lastline);
    }
    if (_settings.lastitem!='undefined'){
      container.data('lastitem',_settings.lastitem);
    }  
    // do adjbt
    if (_settings.adjbt){
      //new line
      if (container.data('newline') != 'undefined'){
        var _Anewline=container.data('newline').split(',');
        
        var i=0;
        container.children().each(function(){
          i++;
          if (i%_Anewline[1] ==0)
            $(this).addClass(_Anewline[0]);
          else
            $(this).removeClass(_Anewline[0]);
          
        })
      }
      
      //last line
      if (container.data('lastline') != 'undefined'){
        var _lastline=0;
        var _line=0
        _line=parseInt(container.children().length % container.data('lastline').split(',')[1]);
        _lastline=parseInt(container.children().length/container.data('lastline').split(',')[1]);
        if (_line>0)
          _lastline++;
        _line=1;
        var _Alastline=container.data('lastline').split(',');
        var i=0;
        container.children().each(function(){
          i++;
          if (_line==_lastline)
            $(this).addClass(_Alastline[0]);
          else
            $(this).removeClass(_Alastline[0]);
          if (i%_Alastline[1] ==0)
            _line++;
        })        
      }
      
      // last item
      if(container.data('lastitem') != 'undefined'){
        var i=0;
        var _len=container.children().length;
        container.children().each(function(){
          i++;
          if(i==_len){
            $(this).addClass(container.data('lastitem'));
          }else{
            $(this).removeClass(container.data('lastitem'));
          }
        });
      }
    }
  }
  return this.each(_btcss);
}

// random show items 
$.fn.BTShowR = function(settings){
  var container=$(this);
  // if container is array, scan it
  if ( container.length >1 ) {
    container.each(function(){
      $(this).BTShowR(settings);
    });
    return false;
  }
  var _defaultSettings = {        
    SRCNT:0,
    LastEl:''
  }; 
  var _settings = $.extend(_defaultSettings, settings);
  

  var _BTShowR=function(){
    if(_settings.SRCNT<=0){
      return;
    }
    var _ChildList=$('.BTSRC',container).children();
    var _DelCNT=0;
    var _d=0;
    var _DelA=new Array();
    _ChildList.each(function(){
      _d++;
      if($(this).hasClass('DEL'))
        _DelA[_DelA.length]=_d-1;

    });

    _DelCNT=_DelA.length;
    if (_settings.SRCNT>=_ChildList.length-_DelCNT){
      return;
    }
    //Math.floor(Math.random()*$TabMenuList.length)
    //Random show items
    var _HideA=new Array();
    // random get hide index
    for(var i=0;i<_ChildList.length-_settings.SRCNT-_DelCNT;i++){
      while(1){
        var _HideIndex=Math.floor(Math.random()*_ChildList.length);
        for(var j=0;j<_HideA.length;j++){
          if (_HideA[j]==_HideIndex){
            _HideIndex=-1;
          }
        }
        for(var j=0;j<_DelA.length;j++){
          if (_DelA[j]==_HideIndex){
            _HideIndex=-1;
          }
        }        
        if (_HideIndex>-1){
          _HideA[_HideA.length]=_HideIndex;
          break;
        }
      }
    }
    // hide the items
    var _show=0;
    for(var i=0;i<_ChildList.length;i++){
      var _hide=0;
      for(var j=0;j<_HideA.length;j++){
        if (i==_HideA[j]){
          _hide=1;
          break;
        }
      }
      if(_hide){
        $(_ChildList[i]).hide();
      }else{
        _show++;
        if (_show==_settings.SRCNT && _settings.LastEl !='')
          $(_ChildList[i]).addClass(_settings.LastEl);
      }
        //$(_ChildList[i]).remove();
      //else
      //  $(_ChildList[i]).show();
    }
  }
  
  return this.each(_BTShowR);
}

$.fn.LazyImg = function(settings){
  var container=$(this);
  // if container is array, scan it
  if ( container.length >1 ) {
    container.each(function(){
      $(this).LazyImg(settings);
    });
    return false;
  }
  var _defaultSettings = {        
  }; 
  var _settings = $.extend(_defaultSettings, settings);
  var imgs=0;
  $('img',container).each(function(){
    var img=momoj(this);
    if (img.attr('src')){
      if (img.attr('src').indexOf('/ecm/img/cmm/blank.png')>-1){
        imgs++;
        if(img.attr('org')){
          img.attr('src',img.attr('org'));
        }
      }  
    }
  });
}

// for keyword search
$.fn.KeywordSearch = function(settings){
  var container=$(this);
  // if container is array, scan it
  if ( container.length >1 ) {
    container.each(function(){
      $(this).KeywordSearch(settings);
    });
    return false;
  }
  var _defaultSettings = {
    URL:"/mosearch/searchEg.jsp"
  };
  var _settings = $.extend(_defaultSettings, settings);
  
  var _kwSearch = function(){
    if (!container.data('ShowPrdPrcInit')){
      // record init txt word
      container.data('defaultWord',container.val());
      container
        .bind('focus',function(){
          if(container.val()==container.data('defaultWord')) container.val('');
        })
        .bind('blur',function(){
          if(container.val()=='') container.val(container.data('defaultWord'));
        })
        .autocomplete(
          _settings.URL,
          {
            delay: 100,
            minChars: 1,
            matchSubset: 0,
            matchContains: 0,
            cacheLength: 10,
            onItemSelect: function(){},
            onFindValue: function(){},
            formatItem: function(_row){
                          return "<table width=95%><tr><td align=left>" + _row[0] + "</td><td align=right>"  + _row[1] + "</td></tr></table>";
                        },
            selectFirst: false,
            autoFill: false,
            scroll: false,
            max : 15
          }
        );

      ;
      container.data('kwSearch',1);
    }
  }
  return this.each(_kwSearch);
}

$.fn.MoMoChkLogin = function(settings){
  /*
  cookie information for login:
  loginUser top_CardMem.gif
  cardUser  top_WebMem.gif
  */
  var _defaultSettings = {
    LoginObj:"#bt_0_150_01"
  };
  var _settings = $.extend(_defaultSettings, settings);  
  
  var _loginUser=$().cookie('loginUser');
  var _cardUser=$().cookie('cardUser');
  var _loginObj=$(_settings.LoginObj);
  var _imga1=$('.CL1 a',_loginObj);
  var _img1=$('.CL1 img',_loginObj);
  var _imga2=$('.CL4 a',_loginObj);
  var _img2=$('.CL4 img',_loginObj);
  var _txt=$('.loginTxt',_loginObj);

  if (_cardUser==null || _cardUser=='null') _cardUser='';
  if (_loginUser==null || _loginUser=='null') _loginUser='';

  if (_cardUser !='' || _loginUser !=''){
    _imga1.attr('title', $.unicode2Str('&#23458;&#25142;&#30331;&#20986;'));
    _imga1.attr('href',_imga1.attr('outsrc'));
    //_img1.attr('src',_img1.attr('outimg'));
    _imga2.attr('href','javascript:void(0);');
    _txt.show();
    var _a=$("#LOGINSTATUS");
    _a.html("&#30331;&#20986;");
    if (_cardUser!=''){	
		
      //_imga2.attr('title', '&#23500;&#37030;&#21345;&#21451;');
      //_img2.attr('src',_img2.attr('cardimg'));
      _cardUser=_cardUser.replace(/\*/g,";");	  
	  _cardUser=_cardUser.replace("&#32;&#24744;&#22909;&#65292;&#24744;&#30446;&#21069;&#25345;&#26377;&#30340;","");
	  var _cardUserName = '<span id="cardUser" class="cardUser">'+_cardUser.substring(0,_cardUser.indexOf("&#32005;")-1);
	  var _cardUserStatus = ' (&#40670;&#25976;&#9660;)';
    var _cardUserPoint = _cardUser.substring(_cardUser.indexOf("&#20849;")+8);
       _txt.html(_cardUserName+_cardUserStatus);    
      _txt.css('color','#FFFFFF');	
	  $('.CL4').hide();
    
    //&#21345;&#21451;&#40670;&#25976;
    var cardPoint = [
	   '<div class="cardPointList">',
	     '<table border="0" cellpadding="0" cellspacing="0">',
	       '<tr>',
				'<td valign="middle">&#24744;&#30446;&#21069;&#32047;&#31309;&#23500;&#37030;&#37504;&#34892;&#20449;&#29992;&#21345;&#40670;&#25976;&#20849;<span style="color:red">'
        +_cardUserPoint.replace("&#40670;","")+'</span>&#40670;</td>',          
	       '</tr>',  
	     '</table>', 
	   '</div>'
	   ].join('');
    $('#BodyBase').append(cardPoint);    
     momoj(".cardPointList").hide(); 
    }else if(_loginUser !=''){
      var _couponNumber=$().cookie('couponNumber');
      if (_couponNumber==null || _couponNumber=='null') _couponNumber='';
      if(_couponNumber!=""){
        var _a=$("#CPM");
        _a.html("&#25240;&#20729;&#21048;<span>( "+_couponNumber+" )</span>");
      }
      //&#39318;&#38913;&#36861;&#36452;&#28165;&#21934;&#25976;&#37327;
			var _WishListNumber=momoj().cookie('WishListNumber');
      if (_WishListNumber==null || _WishListNumber=='null') _WishListNumber='0';
      if(_WishListNumber!=""){
        var _a=momoj(".wishList a");
        _a.html("&#24050;&#36861;&#36452;<span>("+_WishListNumber+")</span>");
        var _b=momoj("#wishList a");
        _b.html("&#36861;&#36452;&#28165;&#21934;<span>("+_WishListNumber+")</span>");
      }
      
      //_imga2.attr('title', '&#19968;&#33324;&#23458;&#25142;');
      //_img2.attr('src',_img2.attr('webimg'));
      _loginUser=_loginUser.replace(/\*/g,";");
      _txt.html(_loginUser);
      _txt.css('color','#EC0A8F');
	  $('.CL4').hide();
    } 
  }else{
    _imga1.attr('title', $.unicode2Str('&#23458;&#25142;&#30331;&#20837;'));
    _imga1.attr('href',_imga1.attr('insrc'));
    //_img1.attr('src',_img1.attr('inimg'));
    _imga2.attr('title', $.unicode2Str('&#35387;&#20874;&#28858;&#23458;&#25142;'));
    _imga2.attr('href',_imga2.attr('joinsrc'));
    _img2.attr('src',_img2.attr('joinimg'));
    _txt.text('');
    var _a=$("#LOGINSTATUS");
    _a.html("&#30331;&#20837;/");
  }

}

$.fn.MoMoTRVChkLogin = function(){
  var _loginUser=$().cookie('loginUser');
  var _pst13=$('#bt_0_051_01 .PST1,.PST3');
  var _pst24=$('#bt_0_051_01 .PST2,.PST4');
  var _span=$('#bt_0_051_01 .PST2 p span');
  
  if (_loginUser==null || _loginUser=='null') _loginUser='';
  // momo travel
  if (_loginUser != '') {
    _loginUser = _loginUser.replace(/\*/g, '');
    _pst13.hide();
    _pst24.show();
    _span.html(_loginUser);
  }
}

$.fn.MoMoTRVCtgSrh = function(){
  var _selM = $('#bt_0_052_01 #p_mgrpCode');
  $.ajax({
    type:"POST",
    url:"/search/TravelSearch.jsp?srhctg=2500000000",
    dataType:"text",
    success:function(cateStr){
      if(cateStr.indexOf('<html>') >= 0) return;
      _selM.find('option').remove();
      _selM.append('<option value="0">(&#35531;&#36984;&#25799;)</option>');
      var _cateA = $.trim(cateStr).split(',');
      for(var i = 0; i < _cateA.length; i++) {
        var _ctgA = _cateA[i].split('=');
        _selM.append('<option value="'+$.trim(_ctgA[0])+'">'+$.trim(_ctgA[1])+'</option>');
      }
    }
  });
  
  _selM.change(function(){
    var _val = momoj(this).val();
    if (typeof(_val)=='undefined' || _val=="" || _val=="0") return;
    var _sel = momoj('#bt_0_052_01 #p_sgrpCode');
    _sel.find('option').remove();
    _sel.append('<option value="0">(&#35531;&#36984;&#25799;)</option>');
    $.ajax({
      type:"POST",
      url:"/search/TravelSearch.jsp?srhctg="+_val,
      dataType:"text",
      success:function(cateStr){
        var _cateA = $.trim(cateStr).split(',');
        for(var i = 0; i < _cateA.length; i++) {
          var _ctgA = _cateA[i].split('=');
          _sel.append('<option value="'+$.trim(_ctgA[0])+'">'+$.trim(_ctgA[1])+'</option>');
        }
      }
    });
  });
}

// for Brwose Produce History by HHWU
$.fn.history = function(settings) {
  var _defaultSettings = {
        showItem : 4,
        arrowUpImage : '/ecm/img/cmm/browseHistory/watermark_arrowup.gif',
        arrowDnImage : '/ecm/img/cmm/browseHistory/watermark_arrowdown.gif',
        baseUrl: '',
        offsetTop: 10,
        offsetLeft: 0.1,
        arrowDnId: 'arrowDown',
        arrowUpId: 'arrowUp',
        imageHeight : 60,
        elementWidth: 64
  };
  $.extend(_defaultSettings, settings || {});
  var _BrowHist=$().cookie("Browsehist");
    var aryCodeList = new Array();
    if ( !(_BrowHist =='null' || _BrowHist ==null ) ){
        aryCodeList = $().cookie("Browsehist").split(",");
    } else {
        return this;
    }

  var clickIdx = 0;
  var upId = _defaultSettings.arrowUpId;
  var dnId = _defaultSettings.arrowDnId;
    var thisObj = this;
    var baseObj = $('img' , thisObj);
    thisObj.css({'width': _defaultSettings.elementWidth});

  var htmlList= [
  '<span id="list">',
    '<div id="'+ upId +'">',
      '<img src="' + _defaultSettings.baseUrl +_defaultSettings.arrowUpImage+'">',
    '</div>',
    '<span id="listItem"></span>',
    '<div id="'+ dnId +'">',
      '<img src="'+ _defaultSettings.baseUrl +_defaultSettings.arrowDnImage+'">',
    '</div>',
  '</span>'
  ].join('');

  baseObj.after(htmlList);

  var listObj = $("#list");
  var items;
  
  var numberOfItems = (aryCodeList.length < _defaultSettings.showItem) ? aryCodeList.length : _defaultSettings.showItem ;
    var displayZoneHeight = _defaultSettings.imageHeight * numberOfItems;

    if ($.browser.msie && parseInt($.browser.version) <=7 ) {
        var temp = thisObj.position();
        listObj.css({'position': 'absolute', 'width': _defaultSettings.elementWidth, 'top': temp.top + baseObj.height() + 'px', 'left': temp.left + 'px'} ).hide();
    } else {
        listObj.css({'position': 'absolute', 'width': _defaultSettings.elementWidth, 'display':'block','float':'left'} ).hide();
    }

  var listItemObj = $("#listItem").css({'position':'absolute','overflow-y': 'hidden', 'height' : displayZoneHeight + 'px'});
    var objDn = $('#'+dnId);

  thisObj.mouseenter(function() {
    clickIdx=0;
    listItemObj.empty();
    $.each(aryCodeList, function(idx, i_code) {
      //var suffix = i_code.substring( i_code.length - 2, i_code.length);
      var suffix = i_code;
      for(var i=0;i<10-i_code.length;i++){
        suffix='0'+suffix;
      }
      suffix=suffix.substring(0,4)+'/'+suffix.substring(4,7)+'/'+suffix.substring(7,10);
      var html = ['<div class="item">',
      '<span>',
      '<a href="'+ _defaultSettings.baseUrl +'/goods/GoodsDetail.jsp?i_code=' + i_code + '" target="_blank">',
      '<img height="60" style="border-left-width:2px; border-right-width:2px;border-color:transparent;" src="'+ _defaultSettings.baseUrl +'/goodsimg/'+ suffix+'/'+ i_code+'_S.jpg">',
      '</a>',
      '</span>',
      '</div>'].join('');
      listItemObj.append($(html).css({'overflow': 'hidden','height': '60px','width': _defaultSettings.elementWidth}));
        });
        listObj.show();
    items = $("#listItem .item");

        objDn.css({
            'position': 'relative',
            'top': numberOfItems * _defaultSettings.imageHeight +'px'
        });
  }).mouseleave(function() {
    listObj.hide();
  });

  $('#'+ upId).click( function() {
    if (clickIdx >= aryCodeList.length - numberOfItems ) return;
    items.each(function() {
            var obj = $(this);
            var tmp_css = obj.css('top');
            var tmp = (tmp_css == 'auto') ? 0 : parseInt(tmp_css);
            obj.css({'position': 'relative', 'top': tmp - _defaultSettings.imageHeight + "px"});
    });
        clickIdx++;
  });
  
    objDn.click( function() {
    if (clickIdx <= ((numberOfItems == _defaultSettings.showItem)? 0 : numberOfItems) ) return;
    items.each(function(idx) {
            $(this).css({'position': 'relative',"top": parseInt($(this).css("top")) + _defaultSettings.imageHeight + "px"});
    });
        clickIdx--;
  })          

  return this;
};

// for SiteMap Produce History by HHWU
$.fn.iframeShow = function(settings) {

    //FIXME, cache and effect
    var _defaultSettings = {
        //event: 'click',
        zindex: 9000,
        url: null,
        width: 650,
        height: 700
    };
    var rightTop = { x : 0, y : 0 }
    $.extend(_defaultSettings , settings || {} );

    this.bind('click' , function() {
        if($('#showFrame').length>0){
          $('#showFrame').show();
          return this;
        }

        var displayLayer = [
        '<div id="showFrame" style="position: absolute">',
            '<iframe id="mapFrame" allowtransparency="true" frameborder="0" style="background-color:transparent"></iframe>',
        '</div>',
        ].join('');   
    
        $(displayLayer)
            .css({
                'z-index': _defaultSettings.zindex,
                'height': _defaultSettings.height,
                'width' : _defaultSettings.width
            }).hide().appendTo($('body'));
    
        $('#mapFrame').css({
            'position': 'absolute',
            'border': "0px none",
            'height': _defaultSettings.height,
            'width' : _defaultSettings.width
        });
        var thisObj = $(this);
        var offsetObj = thisObj.position();
        var displayObj = $("#showFrame");
    
        _defaultSettings.url = "/activity/090202105137/main.html";
    
        rightTop.y = $(document).scrollTop();
        rightTop.x = $('body').position().left;
    
        $('iframe#mapFrame').attr('src', _defaultSettings.url).load(function(){
            // Specialized for momoshop
            $(this).contents().find('img[onclick]').parent().parent().click(function(event) {
                event.stopPropagation();
                event.stopImmediatePropagation();
                displayObj.slideToggle();
            });
        }).css({'background-color': 'transparent'});
        displayObj.css({
            'background-color': 'transparent',
            'top':  rightTop.y + 'px',
            'left': rightTop.x + 'px'
        });

    //this.bind('click' , function() {
        displayObj.slideToggle();
    });
    
    return this;

};

// ajax for goods price by goods code
$.fn.getGoodsPrice = function(settings){
  var gds=$(this);
  var _defaultSettings = {
    URL:"/ajax/getGoodsPri.jsp",
    GoodsCode:""
  };
  var _goodsPrice='';
  var _settings = $.extend(_defaultSettings, settings);
  if(_settings.GoodsCode=='') return '';
  $.ajax({
    url:_settings.URL,
    type:'POST',
    data:{goodsCode:_settings.GoodsCode},
    dataType:'html',
    async:false,
    success:function(content){
      _goodsPrice=content;
    }
    
  });
  //alert('goods price:'+_goodsPrice);
  return _goodsPrice;
}

// ajax for goods price by goods code
$.fn.getGoodsProInfo = function(settings){
  var gds=$(this);
  var _defaultSettings = {
    URL:"/ajax/getGoodsProInfo.jsp",
    GoodsCode:""
  };
  var _goodsInfo='';
  var _settings = $.extend(_defaultSettings, settings);
  if(_settings.GoodsCode=='') return '';
  $.ajax({
    url:_settings.URL,
    type:'POST',
    data:{goodsCode:_settings.GoodsCode},
    dataType:'html',
    async:false,
    success:function(content){
      _goodsInfo=content;
    }
    
  });
  //alert('goods price:'+_goodsInfo);
  return _goodsInfo;
}

// for DgrpCategory bt_9_002 goods price
$.fn.fixGoodsPrice = function(settings){  
  var container=$(this);
  var _defaultSettings = {
    elsLimit:0,                     //if elsLimit eq 0, do not check
    mainDiv:'',
    failHide:true,
    succShow:true,
    proImg:true,                    //&#26159;&#21542;&#35722;&#26356; promote type image
    proImgTag:'.content div:first'  //&#35722;&#26356; promote img &#30340;&#20301;&#32622;
  };
  var _settings = $.extend(_defaultSettings, settings);
  
  // if elments len ne elsLimit
  //alert(container.length);
  if(_settings.elsLimit>0 && container.length < _settings.elsLimit){
    if (_settings.failHide) $('#'+_settings.mainDiv).hide();
    return;
  }
  var _goodsCode='';
  container.each(function(){
    var _class=$(this).attr('class');
    var _classA=_class.split(' ');
    var _gc='0__';
    for(var i=0;i<_classA.length;i++){
      if(_classA[i].match(/^GDS-/) ){
        _gc=_classA[i].replace(/^GDS-/,'')+'__';
        //_goodsCode+=_gc+'__';
        break;
      }
    }
    _goodsCode+=_gc;
  });  
  _goodsCode=_goodsCode.replace(/__$/,'');  
  if(_settings.elsLimit >0 && _goodsCode.split('__').length < _settings.elsLimit){
    if (_settings.failHide) $('#'+_settings.mainDiv).hide();
    return;  
  }
  var _goodsPrice=$().getGoodsProInfo({GoodsCode:_goodsCode});
  _goodsPrice=_goodsPrice.replace(/\n/g,'');
  _goodsPrice=$.trim(_goodsPrice);
  var _goodsPriceA=_goodsPrice.split('__');
  if(_settings.elsLimit>0 && _goodsPriceA.length < _settings.elsLimit){
    if (_settings.failHide) $('#'+_settings.mainDiv).hide();
    return;
  }
  var _els=0;
  var _elOKs=0;
  container.each(function(){
    var _el=$(this);
    var _elTop='';
    var _classELA=_el.attr('class').split(' ');
    for(var _elClassi=0;_elClassi<_classELA.length;_elClassi++){
      if(_classELA[_elClassi].match(/^bt_/)){
        _elTop=$('#'+_classELA[_elClassi]);
        break;
      }
    }    
    if(_goodsPriceA[_els].split('-')[0]==0){
      _el.html('&nbsp;');
      //if (_settings.failHide) $('#'+_settings.mainDiv).hide();
      _elTop.hide();
    }else{
      _elOKs++;
      _el.text(_goodsPriceA[_els].split('-')[0]);
      if(_settings.proImg){
        var _imgstatus=_goodsPriceA[_els].split('-')[1];
        if(typeof _imgstatus=='undefined') _imgstatus='0000';
        if(_imgstatus.length != 4) _imgstatus='0000';
        var _imgHtml='';
        // &#24555;&#36895;&#21040;&#36008;,TV, &#25240;&#20729;&#21048;, &#20419;&#37559;
        if (_imgstatus.substr(0,1)=='1') _imgHtml+='<img src="/ecm/img/cmm/goodsdetail/todayhome.gif"/>';
        if (_imgstatus.substr(1,1)=='1') _imgHtml+='<img src="/ecm/img/de/9/bt_9_002/tvb.gif"/>';
        if (_imgstatus.substr(2,1)=='1') _imgHtml+='<img src="/ecm/img/de/9/bt_9_002/couponb.gif"/>';
        if (_imgstatus.substr(3,1)=='1') _imgHtml+='<img src="/ecm/img/de/9/bt_9_002/saleb.gif"/>';
        var _imgTag=$(_settings.proImgTag,_elTop);
        _imgTag.empty().append(_imgHtml);
      }
    }
    _els++;
  });
  if (_settings.failHide && _elOKs < _settings.elsLimit){
    $('#'+_settings.mainDiv).hide();
    return;
  }
  $('#'+_settings.mainDiv).show();
}

// for cancel browser refresh
$.fn.cancelF5 = function(){
  window.focus();
  $(window.document).keydown(function(event) {
    _event = $.browser.msie ? window.event : event;
    if (_event.keyCode == '116') { // &#31105; F5
      _event.keyCode = 0;
      return false;
    }
    if (_event.ctrlKey && _event.keyCode == '82') { //&#31105; Ctrl+R
      return false;
    }
    if (_event.shiftKey && _event.keyCode == '121') { //&#31105; shift+F10
      return false;
    }
  });
}

// for ghost shopping car
$.fn.shoppingCart = function(settings){
  return {
    open: function(){
      return this;
    },
    close: function(){
      return this;
    }
  }  
  /*
  var _ssl_domain_url='';
  if(typeof _SSL_DOMAIN_URL=='string')
    _ssl_domain_url=_SSL_DOMAIN_URL;
    
  var _defaultSettings = {
    shopCartUrl:_ssl_domain_url+"/order/Cart.jsp?"
  };
  var _settings = $.extend(_defaultSettings, settings);
  
  var cartURL= new Array(
    "cart_name=shopcart",
    "cart_name=first",
    "cart_name=superstore",
    "cart_name=matsusei1"
  );

  var container=$('#ShoppingCar');
  if(container.length==0){// if not exists, create first
    $('body').append('<div id="ShoppingCar" style="width:183px;position:absolute;z-index:10000;"></div>');  
    container=$('#ShoppingCar');
    var shopCar = [
    '<div class="title" style="width:181px;">',
      '<img class="shopCart" src="/ecm/img/cmm/shopcar/carcar_03.gif" style="width:127px;border:0px;"/>',
      '<img class="opcl" src="/ecm/img/cmm/shopcar/carcar_04.gif" style="width:54px;cursor:pointer;border:0px;"/>',
    '</div>',
    '<div class="content" style="width:181px;overflow:hidden;background:transparent url(/ecm/img/cmm/shopcar/carcar_06.gif) repeat-y">',
    '</div>',
    '<div class="bottom" style="width:181px;">',
      '<img src="/ecm/img/cmm/shopcar/carcar_08.gif" style="width:181px;height:6px;border:0px;"/>',    
    '</div>'
    ].join('');
    container.html(shopCar);
  }

  if(!container.data('cartOpen'))
    container.data('cartOpen',1);
  
  if(!container.data('initCart')) {
    container.data('initCart',1);
    if (typeof shopCart=="object"){
      var _carts=0;
      for(var i=0;i<shopCart.length;i++){
        if (shopCart[i][1] > 0){
          _carts++;
        }
      }
      if (_carts){
        // bind window onscroll
        $(window).scroll(function(){_cartMove()});
        $(window).resize(function(){_cartMove()});
      }
    }
    //$('.title .shopCart',container)
    //  .click(function(){document.location.href=_settings.shopCartUrl});
    $('.title .opcl',container)
      .click(function(){
        if(container.data('cartOpen')){
          _cartClose();
        } else {
          _cartOpen();
        }
      });
  }
  
  // set cart information
  var _cartSet = function(){
    var _carts=0;
    if (typeof shopCart=="object"){
      //gshopcart[0]=new Array(cartName,products,money)
      for(var i=0;i<shopCart.length;i++){
        if (shopCart[i][1] > 0){
          _carts++;
          if(_carts==1)
            $('.content',container).empty().append('<ul style="width:181px;"></ul>')
          
          var _table=$('.content ul',container);
          //var _carturl=_settings.shopCartUrl+cartURL[i];
          var _carturl='javascript:momoj().MomoLogin({GoCart:true,LoginSuccess:function(){location.href=\''+_settings.shopCartUrl+cartURL[i]+'\'}});';
          var _tr=[
            '<li style="height:24px;">',
              '<p style="text-align:left;width:50px;line-height:24px;color:#003399;font-size:12px;margin-left:4px;float:left;">'+shopCart[i][0]+'</p>',
              '<p style="width:22px;float:left;line-height:20px;"><a href="'+_carturl+'" style="color:#FF0000;font-size:12px;text-decoration:underline;">('+shopCart[i][1]+')</a></p>',
              '<p style="width:65px;text-align:right;float:left;color:#FF0000;font-family:Arial;font-size:15px;font-weight:bold;line-height:24px;">'+shopCart[i][2]+'&#20803;</p>',
              '<p style="width:37px;float:left;"><a href="'+_carturl+'"><img src="/ecm/img/cmm/shopcar/cound2.gif" /></a></p>',
            '</li>'
          ].join('');
          _table.append(_tr);
        }
      }
    }
    
    if(_carts==0){
      container.hide();
      $(window).unbind('scroll','_cartMove');
      $(window).unbind('resize','_cartMove');
    }else{
      container.show();
    }
  }
  
  var _cartMove = function(){
    var _ctleft=$(window).width()+$(window).scrollLeft()-container.width();
    var _cttop=$(window).height()+$(window).scrollTop()-container.height();
    container.css({'left':_ctleft,'top':_cttop});
  }
  var _cartOpen = function(){
    $('.title .shopCart',container).attr('src','/ecm/img/cmm/shopcar/carcar_03.gif');
    $('.title .opcl',container).attr('src','/ecm/img/cmm/shopcar/carcar_04.gif');
    $('.content',container).show();
    $('.bottom',container).show();  
    _cartMove();
    container.data('cartOpen',1)
  }
  
  var _cartClose = function(){
    $('.title .shopCart',container).attr('src','/ecm/img/cmm/shopcar/carcarclose_03.gif');
    $('.title .opcl',container).attr('src','/ecm/img/cmm/shopcar/carcarclose_04.gif');
    $('.content',container).hide();
    $('.bottom',container).hide();
    _cartMove();
    container.data('cartOpen',0)
  }
  
  return {
    open: function(){
      return container;
      _cartSet();
      _cartOpen();
      
    },
    close: function(){
      return container;
      _cartClose();
      
    }
  }
  */
}

$.fn.shoppingCartForTop = function(settings){
  var container=$(this);
  var _defaultSettings = {
    shopCartUrl:"/order/Cart.jsp?",
    URL:"/order/GhostCart.jsp"
  };
  var _settings = $.extend(_defaultSettings, settings);
  
  var cartURL= new Array(
    "cart_name=shopcart",
    "cart_name=first",
    "cart_name=superstore",
    "cart_name=matsusei1"
  );
  var _shopCart='';
  container.hover(
    function(){
      _show();
    },
    function(){
      _hide();
    }
  );
  var _createCart=function(){
    _shopCart=$('#ShoppingCarTop');
    if(_shopCart.length==0){// if not exists, create first
      var _shopCartLayout=[
        '<div style="width:188px;height:29px;line-height:29px;color:#666666;font-family:Arial,Helvetica,sans-serif;overflow:hidden;margin:1px;text-align:center;background:transparent url(/ecm/img/cmm/shopcar/cart_tit_bg.gif) no-repeat;">',
        '&#24744;&#26377;&#65306; <span class="prdAmt" style="color:#FF0000;">0</span> &#20491;&#21830;&#21697;',
        '</div>'
        ].join('');      
        $('body').append('<div id="ShoppingCarTop" style="display:none;border:4px solid rgb(255,204,204);position:absolute;width:190px;background-color:rgb(255,240,240);z-index:10000;"></div>');  
      _shopCart=$('#ShoppingCarTop');
      _shopCart.html(_shopCartLayout);

      if (typeof shopCart!="object"){
        // use ajax get cart list
        $.ajax({
          url:_settings.URL,
          type:'GET',
          data:{cid:"memfu",oid:"cart",ctype:"B",mdiv:"1000100000-bt_0_003_01"},
          dataType:'html',
          async:false,
          cache: false,
          success:function(content){
            momoj('body').append(content);
          }
        });
      }
      var _prds=0;
      //var _bold='font-weight:bold;';
      //var _font_weight=_bold;
      for(var i=0;i<shopCart.length;i++){
        if (shopCart[i][1] > 0){
          var _cartPrds=shopCart[i][1]-0;
          _prds+=_cartPrds;
          var _line_height=(shopCart[i][0].length>4)?"":"line-height:29px;";
          //_font_weight=(_font_weight=="")?_bold:"";
          var _carturl='javascript:momoj().MomoLogin({GoCart:true,LoginSuccess:function(){location.href=\''+_settings.shopCartUrl+cartURL[i]+'\'}});';
          var _tr=[
            '<div style="width:188px;height:29px;color:#666666;margin:1px;" class="fw">',
              '<p style="width:54px;'+_line_height+';height:29px;float:left;color:#666666;font-size:12px;padding-left:4px;text-align:left;"><a href="'+_carturl+'" style="color:#666666;font-size:12px;">'+shopCart[i][0]+'</a></p>',
              '<p style="width:16px;line-height:29px;float:left;"><a href="'+_carturl+'" style="color:#0099CC;font-size:12px;">('+shopCart[i][1]+')</a></p>',
              '<p style="width:65px;line-height:29px;float:left;text-align:right;color:#666666;font-family:Arial;font-size:12px;"><a href="'+_carturl+'" style="color:#666666;font-size:12px;">'+shopCart[i][2]+'&#20803;</a></p>',
              '<p style="width:40px;margin:4px 0pt 0pt 4px;float:left;"><a href="'+_carturl+'"><img src="/ecm/img/cmm/shopcar/cart_btn_2.gif" /></a></p>',
            '</div>'
          ].join('');
          _shopCart.append(_tr);
        }
      }
      if(_prds>0){
        $('.prdAmt',_shopCart).text(_prds);
      }
      $('.fw',_shopCart).hover(
          function(){
            $(this).css({'font-weight':'bold'});
          },
          function(){
            $(this).css({'font-weight':'normal'});
          }
      );
      _shopCart.hover(
        function(){
          _show();
        },
        function(){
          _hide();
        }
      );
    }
  }
  
  var _show=function(){
    _createCart();
    var _bodyBaseLeft=momoj('#BodyBase').position().left; // &#30070;&#34722;&#24149;&#36229;&#36942;&#36889;&#20491; 1024 &#23532;&#24230;&#26178;&#65292;&#35201;&#29992;&#36889;&#20491;&#20462;&#27491; left
    var _pos=container.position();
    var _height=container.height();
    var _x=_pos.left+_bodyBaseLeft;
    var _y=_pos.top+_height;
    _shopCart.css({left:_x,top:_y});
    _shopCart.show();
  }

  var _hide=function(){
    _shopCart.hide();
  }

  return container;
}

// &#36974;&#32617;&#22294;&#23652;
$.fn.LayerMask = function(settings){
  var container=$('#MoMoLM');
  if(container.length==0)// if not exists, create first
    $('body').append('<div id="MoMoLM"></div><div id="MoMoLMContent"></div>');
  container=$('#MoMoLM');
  var _content=$('#MoMoLMContent');
  var _defaultSettings = {
    bgColor:'#777777',  
    opacity:'0.5',
    contentWidth:'600px',
    contentHeight:'500px',
    contentBGColor:'#FFFFFF'
  };    
  var _settings = $.extend(_defaultSettings, settings);
  var _MaxZindex=1;
  $('div').each(function(){
    //alert('zindex:'+$(this).css('z-index')+';'+typeof $(this).css('z-index') );
    var _zindex=$(this).css('z-index');
    if(typeof _zindex=='number' && _zindex>_MaxZindex){
      _MaxZindex=_zindex;
    }else if(typeof _zindex=='string'){
      if(_zindex=='auto' || _zindex=='undefined') _zindex=1;
      _zindex=_zindex-1+1;
      if(_zindex>_MaxZindex) _MaxZindex=_zindex;
    }
  });
  _MaxZindex+=1;
  var _LMHeight=$(document).height();
  var _LMWidth=$(document).width();

  container.css({
    height:_LMHeight,
    width:_LMWidth,
    'z-index':_MaxZindex,
    display:'none',
    position:'absolute',
    'background-color':_settings.bgColor,
    top:'0px',
    left:'0px',
    opacity:_settings.opacity
  });
  // set default width and height
  _content.css({
    width:_settings.contentWidth,
    height:_settings.contentHeight,
    'z-index':_MaxZindex+1,
    display:'none',
    'background-color':_settings.contentBGColor
  });
    
  var _showContent = function(){
    container.show();
    _content.show();
    // get content width, height and set to screen center
    var _ctWidth=_content.width();
    var _ctHeight=_content.height();
    var _ctTop=($(window).height()-_ctHeight)/2+$(document).scrollTop();
    _ctTop=(_ctTop<0)?1:_ctTop;
    var _ctLeft=($(window).width()-_ctWidth)/2+$(document).scrollLeft();
    _ctLeft=(_ctLeft<0)?1:_ctLeft;
    _content.css({
      top:_ctTop,
      left:_ctLeft
    });
  }
  var _close = function(){
    container.hide();
    _content.hide();
  }
  
  return {
    open: function(){
      _showContent();
      return container;
    },
    close: function(){
      _close();
      return container;
    }
  }
}

// for momo login
$.fn.MomoLogin = function(settings){
  var _defaultSettings = {
    GoCart: false,
    LoginSuccess:'',
    LoginCancel:''
  };    
  var _settings = $.extend(_defaultSettings, settings); 
  var _loginResult=$().cookie('loginRsult');;
  if (!(_loginResult==null || _loginResult=='null') && _loginResult=='1'){
    $().cookie('loginRsult','1',{path:'/',expires:0.01});
    if ($.isFunction(_settings.LoginSuccess)) {
      _settings.LoginSuccess.call(this);
    }    
    return;
  }
  
  //$().LayerMask().open();
  $.ajax({
    dataType: 'html',
    cache: false,
    type: "GET",
    data:{cid:"memfu",oid:"login",ctype:"B",mdiv:"1000100000-bt_0_003_01"},
    url: '/ajax/LoginAjax.jsp',
    success: function(msg){
      if(typeof msg == 'string'){
        if (msg.indexOf('status:1')>-1){
          if ($.isFunction(_settings.LoginSuccess)) {
            _settings.LoginSuccess.call(this);
          }
          return;
        }
      }
      
      $().LayerMask({contentWidth:'604px'}).open();
      $('#MoMoLMContent').empty();
      $('#MoMoLMContent').html(msg);
      //$('#CaptchaImg').attr('src','/servlet/MyCaptchaServlet');
      $('#MoMoLMContent').css('height','auto');
      if(_settings.GoCart) 
        $('#ajaxLogin .Bottom').show();
      
      $('#ajaxLogin').data('LoginSuccess',_settings.LoginSuccess);
      $('#ajaxLogin').data('LoginCancel',_settings.LoginCancel);
        
      /*
      $('#MoMoLMContent').css('height',$('#ajaxLogin').height()+4);
      $('#ajaxLogin').unbind('resize').bind('resize',function(){
        $('#MoMoLMContent').css('height',$('#ajaxLogin').height()+4);
      });
      */
    },
    error: function(xhr){
      alert($.unicode2Str('&#32178;&#31449;&#20027;&#27231;&#24537;&#37636;&#20013;&#65292;&#35531;&#31245;&#24460;&#20877;&#35430;&#65281;&#35613;&#35613;&#65281;'));
    }
  });
}

$.fn.TrvMenu = function(settings){
  var container=$(this);
  if ( container.length >1 ) {
    container.each(function(){
      $(this).TrvMenu(settings);
    });
    return false;
  }
  var _defaultSettings = {
  };
  var _settings = $.extend(_defaultSettings, settings);
  var _url=location.href.match(/(.*)\/\/(.*)\/(.*)\/(.*)/)[4];
  //_url=_url.replace('&mdiv=1000400000-bt_0_060_01&ctype=B','');

  var _liLen=$('ul li',container).length;
  var _liNow=0;
  var _cateName='';
      
  $('ul li',container).hover(
    function(){
      $(this).addClass('BGO');
    },
    function(){
      $(this).removeClass('BGO');
    }
  ).each(function(){
    var _li = $(this);
    _liNow++;
    var _a=$('a',_li);
    var _liLink=_a.attr('href');
    var _link='';
    if (_liLink.indexOf('LgrpCategory.jsp')>-1){
      var _lcode=get_form(_liLink,'l_code');
      var _urlLcode=get_form(_url,'l_code');   
      if(_urlLcode =='' && _url.indexOf('DgrpCategory.jsp')>-1){    
        _urlLcode=$().cookie('l_code');;
      }else if(_urlLcode ==''&&document.location.href.indexOf('/goods/')>-1){ //for goodsDetail     
    var _d_code_li=$('#bt_2_layout_NAV ul li[cateCode^=DC]');
      if (_d_code_li.length > 0){      
          var _d_code=$(_d_code_li[0]).attr('cateCode').replace('DC','');      
          if (_d_code.length>5){
          _urlLcode=_d_code.substr(0,5)+'00000';
         }
       }
    }   
      if (_lcode==_urlLcode){
        _li.addClass('Selected');
        _cateName=$('a span',_li).text();
      }else{
        _li.removeClass('Selected');
      }
    }else{
      if ( _liLink.indexOf('//')>-1){
        _link=_liLink.match(/(.*)\/\/(.*)\/(.*)\/(.*)/)[4];
      } else if(_liLink.match(/\/(.*)\/(.*)/)){
        _link=_liLink.match(/\/(.*)\/(.*)/)[2];
      }
      if (_link == _url ){
        _li.addClass('Selected');
      }else{
        _li.removeClass('Selected');
      }
    
    }
  })
  ;
  
  if($('#NavCategoryName').length>0){
    $('#NavCategoryName').html(' &gt; '+_cateName);
  }

  momoj('.bt_2_layout,#BodyBigTableBase').addClass('ft25');
  return container;
}

$.fn.MoMu1109=function(settings){
  var container=$(this);
  if ( container.length >1 ) {
    container.each(function(){
      $(this).MoMu1109(settings);
    });
    return false;
  } 
  var _defaultSettings = {        
    rowLenLeft:8,
    rowLenRight:1,
    rowLenRightBom:5,
    rowLenRightBomD:5,
    rowLenRightBomN:8,
    scrWidth:980,
    lbt:'#bt_0_layout_b205',
    subMnId:'bt_0_143_',    
    liHeight:24,
    liWidth:130,
    ulWidth:140,
    liWidthRight:150,
    ulWidthRight:170,
    liWidthRightBom:150,
    ulWidthRightBom:170,
    divHeightRight:50,
    divHeightRightBomD:155,
    divHeightRightBomN:214
  };
  var _settings = $.extend(_defaultSettings, settings);
  var _lbt=$(_settings.lbt);

  var _calCols=function(len,lim){
    var _cols=Math.floor(len/lim);
    var _mod=len%lim;
    if(_mod>0){
      _cols++;
    }else{
      _mod=lim;
    }
    var _rtn={
      cols:_cols,
      mod:_mod
    };
    
    return _rtn;
  }
  //get d_code from NVA
  var _d_code_li=$('#bt_2_layout_NAV ul li[cateCode^=DC]');  
  // get ToothCode
  var _FTOOTH=$().cookie('FTOOTH');
  if (_FTOOTH==null || _FTOOTH=='null'){;
    _FTOOTH=get_form(document.location.href,'FTOOTH');
    if (_FTOOTH != "") {
      _FTOOTH=_FTOOTH.replace('FT','');
    } else {
      if (_d_code_li.length > 0){
        var _d_code=$(_d_code_li[0]).attr('cateCode').replace('DC','');
        if (_d_code.length>2){
          _FTOOTH=_d_code.substr(0,2);
        }
      }
    }
  }

  // deal special url 
  $('.subMenu1109 ul li a',_lbt).each(function(){
    var _aElm=$(this);
    if(_aElm.length==1 && _aElm.attr('href').indexOf('FI=Y')>-1) {
      // EC Stock
      _aElm.append('<span class="Fast">&#12304;&#49;&#50;&#72;&#36895;&#36948;&#12305;</span> ');
    }else if(_aElm.length==1 && _aElm.attr('href').indexOf('TV=Y')>-1) {
      // TV Product
      _aElm.append('<span class="Fast">&#12304;&#38651;&#35222;&#36092;&#29289;&#12305;</span> ');
    }  
  });

  // get l_code
  var _l_code=$().cookie('l_code');
  if (document.location.href.indexOf('/goods/')>-1 || _l_code==null || _l_code=='null') {
    _l_code="";
    if (_d_code_li.length > 0){
      var _d_code=$(_d_code_li[0]).attr('cateCode').replace('DC','');
      if (_d_code.length>5){
        _l_code=_d_code.substr(0,5)+'00000';
      }
    }
  }
  
  // for relation Category use, keep now, because deal subMenu will re-sort li tag
  //alert(_settings.html());
  var _realLia=$('#'+_settings.subMnId+_FTOOTH+' .btleft ul li');  
  //deal bt_2_026_01 lgrpcategory contentArea 2011/10/20
  var _realLib=$('#'+_settings.subMnId+_FTOOTH+' .btright ul li');
  var _realLic=$('#'+_settings.subMnId+_FTOOTH+' .btrightbottom ul li');  
  // left Category
  var _leftCateBGO=function(_d_code){
    var _d_code_link='d_code='+_d_code;
    var _cateM='';
    $('#bt_cate_top li').each(function(){
      var _li=$(this);
      if(_li.hasClass('cateM')){
        _cateM=_li;
      }else if( $('a',_li).attr('href').indexOf(_d_code_link)>-1){
        _li.addClass('BGO');
        if(_li.hasClass('MoreHide')){
          _li.removeClass('MoreHide');
          _cateM.after(_li);
          return false;
        }
      }
    });
  }
  //deal real category
  var _realHtmlF=function(){
    // deal Relation Category Area
    var _realHtml=$([
    '<div class="lbtclass" style="width:200px">',
      '<div id="relatedArea" class="btclass">',
        '<div class="curvy">',
          '<em class="ctl"><b>&bull;</b></em>',
          '<em class="ctr"><b>&bull;</b></em>',
          '<em class="cbr"><b>&bull;</b></em>',
          '<em class="cbl"><b>&bull;</b></em>',
          '<div id="tips">',
            '<div class="curvy">',
              '<em class="ctl"><b>&bull;</b></em>',
              '<em class="ctr"><b>&bull;</b></em>',
              '<em class="cbr"><b>&bull;</b></em>',
              '<em class="cbl"><b>&bull;</b></em>',
              '<div class="contentArea">',
                '<ul>',
                  '<li class="cateM">&#30456;&#38364;&#20998;&#39006;</li>',
                '</ul>',
              '</div>',
            '</div>',
          '</div>',
        '</div>',
      '</div>',
    '</div>'
    ].join(''));  
    //&#21697;&#38917;&#20998;&#39006;
    var _realLis=_realLia.length;
    if(_realLis>0){
      for(var i=0;i<_realLis;i++){        
        var _li=$(_realLia[i]).clone();
        if(_li.text().indexOf('12H&#36895;&#36948;')>-1 || _li.text().indexOf('&#38651;&#35222;&#36092;&#29289;')>-1) continue;
        _li.addClass('cateS').attr('style','').css({width:'194px'});
        $('a',_li).attr('style','').css({width:'164px'});
        $('.contentArea ul',_realHtml).append(_li);        
      };      
    }
    //&#21697;&#29260;&#20998;&#39006;
    realLis = _realLib.length;
    if(_realLis>0){
      for(var i=0;i<_realLis;i++){
        var _li=$(_realLib[i]).clone();
        _li.addClass('cateS').attr('style','').css({width:'194px'});
        $('a',_li).attr('style','').css({width:'164px'});
        $('.contentArea ul',_realHtml).append(_li);        
      };                 
    }    
    //&#38651;&#35222;&#36092;&#29289;&#12289;12H&#36895;&#36948;
    _realLis=_realLia.length;
    if(_realLis>0){
      for(var i=0;i<_realLis;i++){        
        var _li=$(_realLia[i]).clone();
        if(_li.text().indexOf('12H&#36895;&#36948;')==-1 && _li.text().indexOf('&#38651;&#35222;&#36092;&#29289;')==-1) continue;
        _li.addClass('cateS').attr('style','').css({width:'194px'});
        $('a',_li).attr('style','').css({width:'164px'});
        $('.contentArea ul',_realHtml).append(_li);        
      };      
    }
    $('.contentArea ul li',_realHtml).eq(_realLia.length+_realLib.length).css({'border-bottom':'0px'});
    $('#bt_0_142_01').after(_realHtml);          
  }
  //deal subNav
  var _subNav=function(){
    var _realLis=_realLia.length;
    for(var i=0;i<_realLis;i++){
      var _liSubNav=$(_realLia[i]).clone();
      _liSubNav.attr('class','').css('width','auto');
      $('a',_liSubNav).attr('style','').css('width','auto');
      var _liSubNavLCode=get_form($('a',_liSubNav).attr('href'),'l_code');
      if (_l_code !='' && _l_code==_liSubNavLCode ){
        $('a',_liSubNav).addClass('selected');
      }
      $('#subnav ul').append(_liSubNav);
    };  
    _realLis=_realLib.length;
    for(var i=0;i<_realLis;i++){
      var _liSubNav=$(_realLib[i]).clone();
      _liSubNav.attr('class','').css('width','auto');
      $('a',_liSubNav).attr('style','').css('width','auto');
      var _liSubNavLCode=get_form($('a',_liSubNav).attr('href'),'l_code');
      if (_l_code !='' && _l_code==_liSubNavLCode ){
        $('a',_liSubNav).addClass('selected');
      }
      $('#subnav ul').append(_liSubNav);
    };

  }
  //category Main 99900000  
  var _bt_2_026=function(){
    //deal bt_2_026_01 lgrpcategory contentArea 2011/10/20
    var bt_2_026_01_html = $([                            
      '<div id="bt_0_142_01" class="">',
        '<div id="bt_category_title" class="title ie6png">',
        '  <h2 class="ie6png">',
        '    <a id="bt_category_e1" href=""></a>',
        '  </h2>',
        '</div>',       
        '<div class="curvy">',
          '<em class="ctl"><b>&bull;</b></em>',
          '<em class="ctr"><b>&bull;</b></em>',
          '<em class="cbr"><b>&bull;</b></em>',
          '<em class="cbl"><b>&bull;</b></em>',
          '<div id="tips">',
            '<div class="curvy">',
              '<em class="ctl"><b>&bull;</b></em>',
              '<em class="ctr"><b>&bull;</b></em>',
              '<em class="cbr"><b>&bull;</b></em>',
              '<em class="cbl"><b>&bull;</b></em>',
              '<div id="bt_category_Content">',
               '<ul>',                                             
               '</ul>',
               '</div>',
            '</div>',
          '</div>',
        '</div>',
      '</div>'
    ].join(''));
    
    var _liPush = '<li id="liPush" class="cateM BTDME">&#39208;&#38263;&#25512;&#34214;</li>';      
    var _liTop30 = '<li id="top30" class="cateS BTDME">'+
                   '<a id="top30" href="/category/LgrpCategory.jsp?l_code='+_l_code+'&TOP30=Y" style="">&#26412;&#39208;&#29105;&#37559;TOP30</a>' +
                   '</li>';
    var _liNew = '<li id="newOfWeek" class="cateS BTDME">'+
                   '<a id="newOfWeek" href="/category/LgrpCategory.jsp?l_code='+_l_code+'&NEW=Y&flag=L" style="">&#26412;&#36913;&#26032;&#21697;</a>' +
                   '</li>';
    var _liSale = '<li id="superBigSale" class="cateS BTDME">'+
                   '<a id="superBigSale" href="/category/LgrpCategory.jsp?l_code='+_l_code+'&SALE=Y&flag=L" style="">&#26412;&#36913;&#26032;&#38477;&#20729;</a>' +
                   '</li>';
    var _liCPHot = '<li id="superBigSale" class="cateS BTDME">'+
                   '<a id="superBigSale" href="/category/LgrpCategory.jsp?l_code='+_l_code+'&CPHOT=Y&flag=L" style="">&#25240;&#20729;&#21048;&#29105;&#37559;</a>' +
                   '</li>';

    $('#bt_category_Content ul',bt_2_026_01_html).append(_liPush).append(_liTop30).append(_liNew).append(_liSale).append(_liCPHot);

    var _realLis = _realLia.length;       
    if(_realLis>0){
      var _lia = '<li id="lia" class="cateM BTDME">&#21697;&#38917;&#20998;&#39006;</li>';
      $('#bt_category_Content ul',bt_2_026_01_html).append(_lia);
      for(var i=0;i<_realLis;i++){     
        var _li=$(_realLia[i]).clone();          
        _li.addClass('cateS').attr('style','');
        $('a',_li).attr('style','').text($('span',_li).text());
        $('#bt_category_Content ul',bt_2_026_01_html).append(_li);
      }
    }
    
    _realLis = _realLib.length;
    if(_realLis>0){
      var _lib = '<li id="lib" class="cateM BTDME">&#21697;&#29260;&#20998;&#39006;</li>';
      $('#bt_category_Content ul',bt_2_026_01_html).append(_lib);
      for(var i=0;i<_realLis;i++){     
        var _li=$(_realLib[i]).clone();      
        _li.addClass('cateS').attr('style','');
        //$($('span',_li).text()).replaceAll('span',_li);
        $('a',_li).attr('style','').text($('span',_li).text());      
        $('#bt_category_Content ul',bt_2_026_01_html).append(_li);    
      }
    }
    
    _realLis = _realLic.length;
    if(_realLis>0){    
      var _lic = '<li id="lic" class="cateM BTDME">&#25512;&#34214;&#21697;&#29260;</li>';
      $('#bt_category_Content ul',bt_2_026_01_html).append(_lic);
      for(var i=0;i<_realLis;i++){     
        var _li=$(_realLic[i]).clone();
        _li.addClass('cateS').attr('style',''); 
        $('a',_li).attr('style','').text($('span',_li).text());     
        $('#bt_category_Content ul',bt_2_026_01_html).append(_li);
      }    
    }    
    //title
    $('#bt_category_e1',bt_2_026_01_html).attr('href','/category/LgrpCategory.jsp?l_code='+_l_code);
    $('#bt_category_e1',bt_2_026_01_html).text($('#C'+_FTOOTH+' a').text());
    $('.titleImg','#bt_2_026_01').hide();     
    $('.contentArea','#bt_2_026_01').hide();
    $('#bt_2_layout_b2').attr('class','');
    $('#bt_2_layout_b2').append(bt_2_026_01_html);    
  }
  
  var _bt_0_103 = function(){
    var _select = $('#p_lgrpCode');    
    var _cur_sel_l_code = _l_code;          
    var l_selected = _cur_sel_l_code.substring(2,5)=='999' ? " selected" : "";
    _select.empty();
    _select.append('<option value="">&#20840;&#21830;&#21697;&#20998;&#39006;</option>');
    _select.append('<option value="'+_l_code.substring(0,2)+'00000000" ' + l_selected + '>'+$('#C'+_FTOOTH+' a').text()+'&#32317;&#35261;</option>');
    _realLis = _realLia.length;
    if(_realLis>0){
      for(var i=0;i<_realLis;i++){
        var _select_text = $(_realLia[i]).clone().text();
        var _select_lcode = get_form($('a',_realLia[i]).attr('href'),'l_code');
        var _selected= _select_lcode == _cur_sel_l_code ? " selected" : "";        
        _select.append('<option value="'+_select_lcode+'"'+_selected+'>'+_select_text+'</option>');
      }
    }
    _realLis = _realLib.length;
    if(_realLis>0){
      for(var i=0;i<_realLis;i++){
        var _select_text = $(_realLib[i]).clone().text();
        var _select_lcode = get_form($('a',_realLib[i]).attr('href'),'l_code');
        var _selected= _select_lcode == _cur_sel_l_code ? " selected" : "";
        _select.append('<option value="'+_select_lcode+'"'+_selected+'>'+_select_text+'</option>');
      }
    }                    
  }  
  
  // deal tooth
  var _toothName=' &gt; '+$('#C'+_FTOOTH).html();
  $('.TabMenu ul li',container).removeClass('selected');
  if(_FTOOTH!='' && (document.location.href.indexOf('/goods/')>-1||document.location.href.indexOf('/category/')>-1)){
    var _tooth_code='ft'+_FTOOTH;
    // &#39208;&#39318;(&#20219;&#36984;), &#23567;&#20998;&#39006;&#38913;, &#32005;&#32160;&#37197;, &#21830;&#21697;&#38913;
    momoj('.bt_2_layout,.bt_4_layout,#Dgrp_BodyBigTableBase,#BodyBigTableBase,#container').addClass(_tooth_code);
    _lbt.addClass(_tooth_code);
    $('#C'+_FTOOTH).addClass('selected');
    
    // deal subnav menu
    container.append('<div id="subnav"><ul></ul></div>');
    _subNav();
    // deal subnav menu end    
    _realHtmlF();
    
    //var _d_code_li=$('#bt_2_layout_NAV ul li[cateCode^=DC]');
    var _d_code="";
    if(_d_code_li.length >0){
      _d_code=$(_d_code_li[0]).attr('cateCode').replace('DC','');
    }else if( document.location.href.indexOf("DgrpCategory.jsp")>-1 ){
      _d_code=get_form(document.location.href,'d_code')
    }
    if(_d_code!=""){
      _leftCateBGO(_d_code);
    }
    
    _bt_0_103();
        
  }  
    
  // deal directory
  if (document.location.href.indexOf('/LgrpCategory.jsp')>-1){
    var _cur_l_code=get_form(document.location.href,'l_code');
    if (_cur_l_code.indexOf('99900000') > -1) {
      var _cateName=$('#C'+_FTOOTH+' a').html();
      $('#NavCategoryName').html(' &gt; '+_cateName);
      _bt_2_026();         
    }else{
      // deal TOOTH Name
      var _subMenuBtId=_settings.subMnId+_FTOOTH;
      var _cateName='';
      $('#'+_subMenuBtId+' a').each(function(){
        var _a=$(this);
        var _l_code=get_form(_a.attr('href'),'l_code');
        if(_cur_l_code == _l_code){
          _cateName=$('span', _a).text();
          $('#NavCategoryName').html(_toothName+ ' &gt; '+_cateName);
          return false;
        }
      });      
    }
  } 
  
  // deal hide cateogyr
  var _ulCate=$('#bt_cate_top');
  $('li[hide_yn=1]',_ulCate).remove();
  var _lis=$('li',_ulCate);
  for(var i=0;i<_lis.length;i++){
    var _li=$(_lis[i]);
    if(_li.hasClass('More') && i+1<_lis.length && $(_lis[i+1]).hasClass('cateM') ){
      _li.remove();
    } 
  }  
  // deal tooth END
  
  // deal subMenu
  $('.subMenu1109',_lbt)
    .hide()
    .data('Show',0)
    .css({top:'0px',left:'0px'})
    .each(function(){
      var _subMenu=$(this);
      var _menuID=_subMenu.attr('id').replace(_settings.subMnId,'');
      var _subMenuWidth=1;
      // cal subMenu width
      var _lisLeft=$('.btleft > ul > li',_subMenu);
      var _liColsLeft=_calCols(_lisLeft.length,_settings.rowLenLeft);
      var _ulWidth=_settings.liWidth*_liColsLeft.cols-(_liColsLeft.cols-1)*2;
      var _ulHeight=_settings.rowLenLeft*_settings.liHeight;
      var _btleftWidth=_settings.ulWidth+(_settings.liWidth*(_liColsLeft.cols-1));
      $('.btleft',_subMenu).css({width:_btleftWidth+'px'});
      _subMenuWidth+=_btleftWidth;
      var _ulLeft=$('.btleft > ul',_subMenu);
      _ulLeft
        .css({width:_ulWidth+'px',height:_ulHeight})
        .empty()
      ;
      var _liCols=_liColsLeft.cols;
      for(var i=0;i<_settings.rowLenLeft;i++){
        var _liElm=$(_lisLeft[i]);
        _liElm.css({width:_settings.liWidth});
        var _aElm=$('a',_liElm);
        _aElm.css({width:_settings.liWidth-10});
        _ulLeft.append(_lisLeft[i]);
        for(var j=1;j<_liCols;j++){
          //$(_lisLeft[i+j*_settings.rowLenLeft]).css({width:_settings.liWidth-2});
          var _liElm=$(_lisLeft[i+j*_settings.rowLenLeft]);
          _liElm.css({width:_settings.liWidth-2});
          var _aElm=$('a',_liElm);
          _aElm.css({width:_settings.liWidth-10});
          _ulLeft.append(_lisLeft[i+j*_settings.rowLenLeft]);
        }
        if(i+1==_liColsLeft.mod){
          _liCols--;
        }
      }

      // right area
      var _lisRight=$('.btright > ul > li',_subMenu);
      var _liColsRight=_calCols(_lisRight.length,_settings.rowLenRight);
      var _btRightWidth=_settings.ulWidthRight+(_settings.liWidthRight*(_liColsRight.cols-1));
      if(_lisRight.length==0){
        _settings.rowLenRightBom=_settings.rowLenRightBomN
        $('.btright',_subMenu).hide();
        $('.btrightbottom',_subMenu).css({height:_settings.divHeightRightBomN+'px'});
      } else {
        _settings.rowLenRightBom=_settings.rowLenRightBomD
        $('.btright',_subMenu).show().css({height:_settings.divHeightRight+'px'});
        $('.btrightbottom',_subMenu).css({height:_settings.divHeightRightBomD+'px'});
      }
      var _lisRightBom=$('.btrightbottom > ul > li',_subMenu);
      var _liColsRightBom=_calCols(_lisRightBom.length,_settings.rowLenRightBom);
      var _btRightWidthBom=_settings.ulWidthRightBom+(_settings.liWidthRightBom*(_liColsRightBom.cols-1));
      if(_btRightWidth>_btRightWidthBom){
        _btRightWidthBom=_btRightWidth;
      }else{
        _btRightWidth=_btRightWidthBom;
      } 
     
      _ulWidthRight=_settings.liWidthRight*_liColsRight.cols-(_liColsRight.cols-1)*2;
      _ulHeight=_settings.rowLenRight*_settings.liHeight;
      $('.btright',_subMenu).css({width:_btRightWidth+'px'});
      var _ulRight=$('.btright > ul',_subMenu);
      _ulRight
        .css({width:_ulWidthRight+'px',height:_ulHeight})
        .empty()
      ;
      _liCols=_liColsRight.cols;
      for(var i=0;i<_settings.rowLenRight;i++){
        var _liElm=$(_lisRight[i]);
        _liElm.css({width:_settings.liWidthRight});
        var _aElm=$('a',_liElm);
        _aElm.css({width:_settings.liWidthRight-14});
        _ulRight.append(_lisRight[i]);
        for(var j=1;j<_liCols;j++){
          var _liElm=$(_lisRight[i+j*_settings.rowLenRight]);
          _liElm.css({width:_settings.liWidthRight-2});
          var _aElm=$('a',_liElm);
          _aElm.css({width:_settings.liWidthRight-16});
          _ulRight.append(_lisRight[i+j*_settings.rowLenRight]);
        }
        if(i+1==_liColsRight.mod){
          _liCols--;
        }
      }

      _ulWidthRight=_settings.liWidthRightBom*_liColsRightBom.cols-(_liColsRightBom.cols-1)*2;
      _ulHeight=_settings.rowLenRightBom*_settings.liHeight;
      $('.btrightbottom',_subMenu).css({width:_btRightWidthBom+'px'});
      var _ulRightBom=$('.btrightbottom > ul',_subMenu);
      _ulRightBom
        .css({width:_ulWidthRight+'px',height:_ulHeight})
        .empty()
      ;
      _liCols=_liColsRightBom.cols;
      for(var i=0;i<_settings.rowLenRightBom;i++){
        var _liElm=$(_lisRightBom[i]);
        _liElm.css({width:_settings.liWidthRightBom});
        var _aElm=$('a',_liElm);
        _aElm.css({width:_settings.liWidthRightBom-14});
        _ulRightBom.append(_lisRightBom[i]);
        for(var j=1;j<_liCols;j++){
          var _liElm=$(_lisRightBom[i+j*_settings.rowLenRightBom]);
          _liElm.css({width:_settings.liWidthRightBom-2});
          var _aElm=$('a',_liElm);
          _aElm.css({width:_settings.liWidthRightBom-16});
          _ulRightBom.append(_lisRightBom[i+j*_settings.rowLenRightBom]);
        }
        if(i+1==_liColsRightBom.mod){
          _liCols--;
        }
      }
      _subMenuWidth+=_btRightWidth;
      _subMenu.css({width:_subMenuWidth+'px'});
    })
  ;
  $('#bt_0_059_01',_lbt).hide().data('Show',0);
  
  _lbt
    .delegate('.subMenu1109,#bt_0_059_01','hover',function(e){
      var _subMenu=$(this);
      var _menuID=_subMenu.attr('id').replace(_settings.subMnId,'');
      if(_subMenu.attr('id')=='bt_0_059_01'){
        _menuID='21';
      }
      if(e.type==='mouseover'){
        //var _subMenu=$(this);
        _subMenu.data('Show',1);
        _subMenu.show();
        $('#C'+_menuID).addClass('BGO');
        $('#C'+_menuID+' a').addClass('BGO');
      }else{
        //var _subMenu=$(this);
        _subMenu.data('Show',0);
        _subMenu.hide();
        $('#C'+_menuID).removeClass('BGO');
        $('#C'+_menuID+' a').removeClass('BGO');
      }
    })
  ;
  container
    .delegate('.TabMenu > ul > li','hover',function(e){
      if(e.type==='mouseover'){
        $('.subMenu1109,#bt_0_059_01',_lbt).hide();
        var _li=momoj(this);
        _li.addClass('BGO');
        $('a',_li).addClass('BGO');
        // cale subMenu position
        var _x=0;
        var _y=0;
        var _POS=_li.position();
        _x=_POS.left;
        _y=_POS.top+_li.height()-2;
        var _subBtId=_settings.subMnId+_li.attr('id').replace('C','');
        if(_li.attr('id')=='C21'){
          _subBtId='bt_0_059_01';
        }
        var _subMenu=$('#'+_subBtId);
        //var _subContentWidth=$('.btleft',_subMenu).outerWidth()+$('.btright',_subMenu).outerWidth();
        //_subMenu.css({width:_subContentWidth+'px'});
        var _menuWidth=_subMenu.outerWidth();
        if(_menuWidth+_x > _settings.scrWidth){
          _x=_settings.scrWidth-_menuWidth;
        }      
        _subMenu
          .css({left:_x,top:_y})
          .show()
          //.data('Show',1)
        ;
      }else{
        var _li=momoj(this);
        _li.removeClass('BGO');
        $('a',_li).removeClass('BGO');
        var _subBtId=_settings.subMnId+_li.attr('id').replace('C','');
        if(_li.attr('id')=='C21'){
          _subBtId='bt_0_059_01';
        }        
        var _subMenu=$('#'+_subBtId);
        _lbt.data('showMenu',_subBtId);
        
        setTimeout(function(_subMenu){
          var _subMenu=$('#'+_lbt.data('showMenu'));
          if (_subMenu.data('Show')==0){
            $('#'+_lbt.data('showMenu')).hide();
          }
        },200);
      
      }
    })
    .delegate('.TabMenu > ul > li','mousemove',function(e){
      var _li=momoj(this);
      _li.addClass('BGO');
      var _subBtId=_settings.subMnId+_li.attr('id').replace('C','');
      var _subMenu=$('#'+_subBtId);
      if(_subMenu.css('left')=='0px'){
        var _x=0;
        var _y=0;
        var _POS=_li.position();
        _x=_POS.left;
        _y=_POS.top+_li.height()-2;
        var _menuWidth=_subMenu.outerWidth();
        if(_menuWidth+_x > _settings.scrWidth){
          _x=_settings.scrWidth-_menuWidth;
        }
        _subMenu.css({left:_x,top:_y});
      }
      _subMenu.show();
    })
  ;
  
  // deal subMenu END

  // deal bt_0_110_01 show bt_0_143 menu
  if(document.location.href.indexOf('/main/Main.jsp')>-1){
    $('#bt_0_110_01 .ContentD ul').each(function(){

      var _ul=$(this);
      $('.titlebox',_ul).attr('menuid',_ul.attr('menuid'))
      _ul.append('<li class="cateMore" menuid="'+_ul.attr('menuid')+'"><span style="color:#FD3598">...&#26356;&#22810;</span></li>');
    });
    $('#bt_0_110_01')
      .delegate('.ContentD .titlebox a,.cateMore span','hover',function(e){
        if(e.type==='mouseover'){
          $('.subMenu1109',_lbt).hide();
          var _el=momoj(this);
          _el.addClass('BGO');
          // cale subMenu position
          var _x=0;
          var _y=0;
          var _POS=_el.position();
          //_x=_POS.left+$('span',_el).width()+2;
          _x=_POS.left+_el.width()+2;
          _y=_POS.top;
          var _subBtId=_settings.subMnId+_el.parent().attr('menuid').replace('C','');
          var _subMenu=$('#'+_subBtId);
          var _menuWidth=_subMenu.outerWidth();
          if(_menuWidth+_x > _settings.scrWidth){
            _x=_settings.scrWidth-_menuWidth;
          }
          _subMenu
            .css({left:_x,top:_y})
            .show()
            //.data('Show',1)
          ;
        }else{
          var _el=momoj(this);
          _el.removeClass('BGO');
          var _subBtId=_settings.subMnId+_el.parent().attr('MenuId').replace('C','');
          var _subMenu=$('#'+_subBtId);
          _lbt.data('showMenu',_subBtId);
          setTimeout(function(_subMenu){
            var _subMenu=$('#'+_lbt.data('showMenu'));
            if (_subMenu.data('Show')==0){
              $('#'+_lbt.data('showMenu')).hide();
            }
          },200);
  
        }
      })
    ;
  }
  return container;
}

$.fn.ShopHistCart1108=function(settings){
  
  var _ssl_domain_url='';
  if(typeof _SSL_DOMAIN_URL=='string'){
    _ssl_domain_url=_SSL_DOMAIN_URL;
  } else {
    var _host=window.location.href.split('/')[2];
    _ssl_domain_url='https://'+_host;
  }

  var _defaultSettings = {
    ghostCartUrl:"/ajax/ajaxTool.jsp",
    shopCartUrl:_ssl_domain_url+"/servlet/NewCampaignServlet?",
    prdUrl:'/goods/GoodsDetail.jsp?mdiv=ghostShopCart&i_code=',
    prdImgSrc:'',
    histMax:3
  };
  var _settings = $.extend(_defaultSettings, settings);
    
  var longCartName = {	
    'ec10':'&#25351;&#23450;&#36895;&#36948;',
    'ec20':'&#36895;&#36948;-&#26053;&#36938;',
    'ec30':'&#36895;&#36948;-&#28961;&#30332;&#31080;',
    'ecfreeze':'&#36895;&#36948;-&#20919;&#20941;',
    'eclargemach':'&#36895;&#36948;-&#23478;&#38651;',
    'super10':'&#36229;&#21830;&#21462;&#36008;',
    'super20':'&#36229;&#21462;-&#26053;&#36938;',
    'super30':'&#36229;&#21462;-&#28961;&#30332;&#31080;',
    'normal10':'&#19968;&#33324;&#23429;&#37197;',
    'normal20':'&#23429;&#37197;-&#26053;&#36938;',
    'normal30':'&#23429;&#37197;-&#28961;&#30332;&#31080;',
    'normalcars':'&#36554;&#39006;&#21830;&#21697;',
    'normaltrvtwn':'&#22283;&#26053;&#21830;&#21697;',
    'normalentpmode':'&#38283;&#24215;&#27169;&#24335;',
    'entp02':'&#29611;&#29808;&#21809;&#29255;',
    'entp03':'&#20919;&#20941;&#37197;&#36865;-&#39854;&#39135;&#23478;',
    'donate':'&#20844;&#30410;&#25424;&#27454;',
    'china10':'&#30452;&#37197;&#22823;&#38520;',
    'china20':'&#30452;&#37197;&#22823;&#38520;-&#26053;&#36938;',
    'china30':'&#30452;&#37197;&#22823;&#38520;-&#28961;&#30332;&#31080;',
    'marathon':'&#23500;&#37030;&#39340;&#25289;&#26494;',
    'saveget':'&#38651;&#23376;&#31150;&#21367;',
    'eticket10':'&#38651;&#23376;&#31080;&#21048;',
    'eticket20':'&#38651;&#23376;&#31080;&#21048;',
    'eticket30':'&#38651;&#23376;&#31080;&#21048;'
  };

var shortCartName = {	
    'ec10':'&#36895;&#36948;',
    'ec20':'&#36895;&#36948;',
    'ec30':'&#36895;&#36948;',
    'ecfreeze':'&#36895;&#36948;&#45;&#20941;',
    'eclargemach':'&#36895;&#36948;',
    'super10':'&#36229;&#21462;',
    'super20':'&#36229;&#21462;',
    'super30':'&#36229;&#21462;',
    'normal10':'&#23429;&#37197;',
    'normal20':'&#23429;&#37197;',
    'normal30':'&#23429;&#37197;',
    'normalcars':'&#36554;&#39006;',
    'normaltrvtwn':'&#22283;&#26053;',
    'normalentpmode':'&#38283;&#24215;',
    'entp02':'&#29611;&#29808;',
    'entp03':'&#20919;&#20941;',
    'donate':'&#25424;&#27454;',
    'china10':'&#22823;&#38520;',
    'china20':'&#22823;&#38520;',
    'china30':'&#22823;&#38520;',
    'marathon':'&#39340;&#25289;&#26494;',
    'saveget':'&#31150;&#21367;',
    'eticket10':'&#31080;&#21048;',
    'eticket20':'&#31080;&#21048;',
    'eticket30':'&#31080;&#21048;'
  };  
  
  var container=$('#ShoppingCar');
  if(container.length==0){// if not exists, create first
    var shopCar = [
    '<div id="ShoppingCar" class="bnav">',
      '<a class="crazyAdreplay" style="display:none;"><span><i>&diams;</i></span>&#37325;&#25773;</a>',
      '<div class="historyArea">',
        '<dl>',
          '<dd class="tips"><b>&#28687;&#35261;&#35352;&#37636;</b></dd>',
          '<dd class="tips"><a target="_blank"><img></a></dd>',
          '<dd><a target="_blank"><img></a></dd>',
          '<dd><a target="_blank"><img></a></dd>',
          //'<dt><a href="javascript:void(0);" onclick="momoj(document).scrollTop(1)">TOP</a></dt>',
        '</dl>',
      '</div>',
      '<div class="wishList">',
      '<a href="https://www.momoshop.com.tw/mypage/MemberCenter.jsp?func=02&cid=ghostcart&oid=wishlist"></a>',
      '</div>',
      '<div class="shoppingcart">',
        '<h2>&#36092;&#29289;&#36554;</h2>',
        '<ul>',          
        '</ul>',
        '<input class="cartChkOut" name="&#32080;&#24115;" type="button" value="&#32080;&#24115;">',
      '</div>',
      '<a class="gotopBtn" href="javascript:void(0);" onclick="momoj(document).scrollTop(0)">TOP</a>',
    '</div>',    
    '<div class="shoppingCartList">',
	    '<table border="0" cellpadding="0" cellspacing="0">',		    		    		    
	    '</table>',
    '</div>'
    ].join('');
    $('#BodyBase').append(shopCar);
    $('.LgrpCategory .contentArea .innerArea').append(shopCar);
    $('.LgrpCategory #Dgrp_BodyBigTableBase').append(shopCar);
    $('.LgrpCategory #BodyBigTableBase').append(shopCar);
    $('.LgrpCategory .bt_2_layout').append(shopCar);
    container=$('#ShoppingCar');
  }  
  $(".shoppingCartList").hide();
//&#36861;&#36452;&#28165;&#21934;START
  var _loginUser=momoj().cookie('loginUser');
  if (_loginUser==null || _loginUser=='null') _loginUser='';
  if(_loginUser !=''){
	  var _WishListNumber=momoj().cookie('WishListNumber');
	  if (_WishListNumber==null || _WishListNumber=='null') _WishListNumber='';
	  if(_WishListNumber!=""){
	    var _a=momoj(".wishList a");
	    _a.html("&#24050;&#36861;&#36452;<span>("+_WishListNumber+")</span>");
      
      var _b=momoj("#wishList a");
      _b.html("&#36861;&#36452;&#28165;&#21934;<span>("+_WishListNumber+")</span>");
	  }
  }
  //&#36861;&#36452;&#28165;&#21934;END
  // shoppingcart
  var shopCart = $.ajaxTool({data:{flag:3032}});
  // shoppingcart
  if (shopCart.rtnCode==200){  
    if(shopCart.rtnData.rtnChar=='Z') { //Z:如果無車
      if($('#TopCart').length >0){
        var _dftCartUrl='cart_name=none';
        $('#TopCart').data('CartUrl',_settings.shopCartUrl+_dftCartUrl);
      }
    }
    
    if(shopCart.rtnData.rtnChar=='1'){
	  	
    var _ghostCartLt = shopCart.rtnData.ghostCartLt;
	var _dftCartUrl='';
	var _allCnt = 0;
	if(_ghostCartLt.length>0){
	  for(i=0;i<_ghostCartLt.length;i++){	
		var sCartChiName = shortCartName[_ghostCartLt[i].cartName];
		var lCartChiName = longCartName[_ghostCartLt[i].cartName];	  
		// &#21934;&#19968;&#32080;&#24115;, &#22240;&#28858; cart_name &#24460;&#38754;&#26159;&#27969;&#27700;&#34399;&#65292;&#25152;&#20197;&#26371;&#25214;&#19981;&#21040;&#35201;&#21478;&#22806;&#34389;&#29702;
		if (typeof sCartChiName == 'undefined') {
		  for(key in shortCartName){
			if(_ghostCartLt[i].cartName.indexOf(key)>-1){
			  sCartChiName = shortCartName[key];
			  break;
			}
		  }
		}
		if (typeof lCartChiName == 'undefined') {
		  for(key in longCartName){
			if(_ghostCartLt[i].cartName.indexOf(key)>-1){
			  lCartChiName = longCartName[key];
			  break;
			}
		  }
		}
		//right block
		var carUrl = 'javascript:momoj().MomoLogin({GoCart:true,LoginSuccess:function(){location.href=\''+_settings.shopCartUrl+'cart_name='+_ghostCartLt[i].cartName+'\'}})';
		var prodTolCount = _ghostCartLt[i].prodTolCount;
		_allCnt += parseInt(prodTolCount);
		var prodTolPrice = _ghostCartLt[i].prodTolPrice;
		var _li = '<li><a href="">'+sCartChiName+'('+prodTolCount+')<span></span></a></li>'; 	  
		$('.shoppingcart ul',container).append(_li);
		$('.shoppingcart ul li a',container).eq(i).attr('href',carUrl);
		  
		//top block
		var trEle = [
		'<tr>',
		  '<td class="cartname" valign="middle"><a href="'+carUrl+'">'+lCartChiName+'</a></td>',
		  '<td class="qrantitytxt">(<b>'+prodTolCount+'</b>)&nbsp;&#20214;</td>',
		  '<td class="pricetxt"><b>'+prodTolPrice+'</b>&#20803;</td>',
		'</tr>'
		].join('');	
						  
		$('.shoppingCartList table').append(trEle);	  
		if(i==0){
		 _dftCartUrl = 'cart_name='+_ghostCartLt[i].cartName;
		}	  
	  }
	  $("#TopCart").attr('title','');
    	$("#TopCart").append('<span></span>');
    	$('#TopCart span').text('( '+_allCnt+' )'); 
      $('.shoppingcart',container).show();
      if($('#TopCart').length >0){
        $('#TopCart').data('CartUrl',_settings.shopCartUrl+_dftCartUrl);
      }
	}
	var trEleBot = [
	    '<tr>',
			'<td class="btnArea" colspan="3" valign="middle"><input class="cartChkOutTop" value="&#32080;&#24115;" type="button"></td>',
		'</tr>',
	  ].join('');
	$('.shoppingCartList table').append(trEleBot);
	$('.cartChkOut',container).click(function(){
        momoj().MomoLogin({
          GoCart:true,
          LoginSuccess:function(){
            location.href=_settings.shopCartUrl+_dftCartUrl;
          }
        });
      });
	$('.cartChkOutTop').click(function(){		
		momoj().MomoLogin({
		GoCart:true,
		LoginSuccess:function(){
		  location.href=_settings.shopCartUrl+_dftCartUrl;
		}
	  });
    });
	$('.shoppingcart ul li',container).show();
	$('.shoppingcart',container).show();	    
      
      //$('#CartDD').mouseover(function(){
      momoj('#bt_0_150_01').delegate('#CartDD','hover',function(e){
				if (e.type=='mouseover'){
	      	momoj(".cpmList").hide();
					momoj("#CPM").removeClass("selected");
					//$('#CPM span').css({color:'red'});
	      	momoj("#TopCart").addClass("selected");
	      	var sclTop = momoj("#TopCart").position().top+momoj("#TopCart").outerHeight()+document.documentElement.scrollTop;									
			var sclLft = momoj("#TopCart").position().left-momoj(".shoppingCartList").outerWidth()+momoj("#TopCart").outerWidth()+500;			
          momoj(".shoppingCartList").css({top:sclTop,left:sclLft}).show();
				}else{
					momoj(".shoppingCartList").hide();
					momoj("#TopCart").removeClass("selected");
					return;
				}
      });
    	momoj('#BodyBase').delegate('.shoppingCartList','hover',function(e){
				if(e.type=='mouseover'){
					momoj(".shoppingCartList").show();
					momoj("#TopCart").addClass("selected");
					return;	
				}else{
					momoj(".shoppingCartList").hide();
					momoj("#TopCart").removeClass("selected");
					return;		
				}
		  })
			.delegate('.shoppingCartList .btnArea button','click',function(){
					momoj(".shoppingCartList").hide();
					momoj("#TopCart").removeClass("selected");
					return;
			});
      
      
    }    
  }
  //historyArea
  var _BrowHist=$().cookie("Browsehist");
  var aryCodeList = new Array();
  if ( !(_BrowHist =='null' || _BrowHist ==null ) ){
    aryCodeList = $().cookie("Browsehist").split(",");
  }
  if(aryCodeList.length>0){
    var _hist=$('.historyArea dl dd',container);
    $(_hist[0]).show();
    var _histMax=(aryCodeList.length>_settings.histMax)?_settings.histMax:aryCodeList.length;
    for(var i=0;i<_histMax;i++){
      _prd=$(_hist[i+1]);
      var i_code=aryCodeList[i]
      i_code=i_code.replace('"', '');
      var suffix = i_code;
      for(var j=0;j<10-i_code.length;j++){
        suffix='0'+suffix;
      }
      suffix=suffix.substring(0,4)+'/'+suffix.substring(4,7)+'/'+suffix.substring(7,10);  
      $('a',_prd).attr('href',_settings.prdUrl+i_code);
      $('img',_prd).attr('src','/goodsimg/'+ suffix+'/'+ i_code+'_S.jpg?t=' + Math.random());
      _prd.show();
    }
  }
  //&#25240;&#20729;&#21048;
  var cpdiv = [
	'<div class="cpmList">',
  '<table border="0" cellpadding="0" cellspacing="0">',
  '</table>',
  '</div>'
  ].join('');
	momoj('#BodyBase').append(cpdiv);
	var cplink ="javascript:momoj().MomoLogin({LoginSuccess:function(){window.location.href='https://www.momoshop.com.tw/mypage/MemberCenter.jsp?func=14&cid=memfu&oid=ticket&mdiv=1000100000-bt_0_100_01&ctype=B';}});";
//momoj('#CPMDD').mouseover(function(){
	momoj('#bt_0_150_01').delegate('#CPMDD','hover',function(e){
		if (e.type=='mouseover'){
			var _islogin=$().cookie('loginUser');
			var _couponNumber=momoj().cookie('couponNumber');
			if(_islogin != null && _couponNumber != 0){
				var _couponNumberForTop = momoj('.cpmList').data('couponNumberForTop');
				if(_couponNumberForTop == null || _couponNumber != _couponNumberForTop || _couponNumberForTop == null){
					//console.log('ajax');
					var errcode = '0';
			    var jsonData = new Object();
			    jsonData.flag = 3001;
			    jsonData.data = {
			      p_pageNum: 1,
			      show_items: 99,
			      isOver: 0
			    };
			    momoj.ajax({
			      type: 'POST',
			      dataType: 'json',
			      async: false,
			      data: {data:JSON.stringify(jsonData) },
			      url: '/servlet/MemberCenterServ',
			      error: function(objData, a, b) {
			      	errcode = '1';
			      },
			      success: function(objData) {
			      	 var top_cp_num = 0;
			        if (objData.rtnCode == '101' && objData.results.length > 0) {
			        	momoj('.cpmList table').text('');
			          momoj(objData.alcplist).each(function(index,val){
			          	top_cp_num += parseInt(objData.hmcp[val]);
			          	momoj('.cpmList table').append('<tr><td valign="middle" class="cpm"><b>'+val+'</b>&#20803;&#25240;&#20729;&#21048;</td><td class="qrantitytxt">(<b>'+objData.hmcp[val]+'</b>)&nbsp;&#24373;</td></tr>');
			          });
			          momoj('.cpmList table').append('<tr><td class="btnArea" colspan="2" valign="middle"><button>&#35498;&#26126;</button></td></tr>');
			        	momoj('#CPM span').text('( '+top_cp_num+' )');
			        	momoj().cookie('couponNumber',top_cp_num, {path:'/'});
			        	momoj('.cpmList').data('couponNumberForTop',top_cp_num);
			        } else {
			        	momoj('.cpmList').data('couponNumberForTop','0');
			          errcode = '2';
			        }
			      }
			    });
				}
				//$('#CPM span').css({color:'#ffffff'});
				momoj(".shoppingCartList").hide();
				momoj("#TopCart").removeClass("selected");
		  	momoj("#CPM").addClass("selected");		                		
		  	    var sclTop = momoj("#CPM").position().top+momoj("#CPM").outerHeight()+document.documentElement.scrollTop;
				var sclLft = momoj("#CPM").position().left-momoj(".cpmList").outerWidth()+momoj("#CPM").outerWidth()+500;
        momoj(".cpmList").css({top:sclTop,left:sclLft}).show();
			}
		}else{
			//$('#CPM span').css({color:'red'});
			momoj(".cpmList").hide();
			momoj("#CPM").removeClass("selected");
	  }
	});
	momoj('#BodyBase').delegate('.cpmList','hover',function(e){
		if(e.type=='mouseover'){
			//$('#CPM span').css({color:'#ffffff'});
			momoj(".cpmList").show();
			momoj("#CPM").addClass("selected");			
		}else{
			//$('#CPM span').css({color:'red'});
			momoj(".cpmList").hide();
			momoj("#CPM").removeClass("selected");			
		}
  })
	.delegate('.cpmList .btnArea button','click',function(){
		//$('#CPM span').css({color:'red'});
		momoj(".cpmList").hide();
		momoj("#CPM").removeClass("selected");
		location.href=cplink;	
	});
	
  momoj('#bt_0_150_01').delegate('#cardUser','hover',function(e){
    if(e.type=='mouseover'){
			momoj("#cardUser").addClass("selected");
      var sclTop = momoj("#cardUser").position().top+momoj("#cardUser").outerHeight()+document.documentElement.scrollTop;
      var sclLft = momoj("#cardUser").position().left-momoj(".cardPointList").outerWidth()+momoj("#cardUser").outerWidth()+450;
      momoj(".cardPointList").css({top:sclTop,left:sclLft}).show();

    }else{
			momoj(".cardPointList").hide();
			momoj("#cardUser").removeClass("selected");			
    }
   })
    
	//&#38750;&#26371;&#21729;&#38651;&#23376;&#22577;
	var newsletter = [
	   '<div class="epaperList">',
	     '<table border="0" cellpadding="0" cellspacing="0">',
	       '<tr>',
				'<td valign="middle"><input id="epaper_mail" name="epaper_mail" type="text" class="epaper_mail" value="&#35531;&#36664;&#20837;E-mail" size="30" maxlength="40"></td>',          
				'<td><label><input name="gender" type="radio" value="1">&nbsp;&#20808;&#29983;</label></td>', 
				'<td><label><input name="gender" type="radio" value="0">&nbsp;&#23567;&#22992;</label></td>', 
	       '</tr>', 
	       '<tr>', 
	       		'<td colspan="3" valign="middle" class="btnArea"><button>&#30906;&#35469;&#36865;&#20986;</button></td>', 
	       '</tr>', 
	     '</table>', 
	   '</div>'
	   ].join('');
	$('#BodyBase').append(newsletter);
	
	momoj('#bt_0_150_01').delegate('#E_PAPERDD','hover',function(e){
		if (e.type=='mouseover'){
			momoj(".shoppingCartList").hide();
			momoj(".cpmList").hide();
			momoj("#CPM").removeClass("selected");
			momoj("#TopCart").removeClass("selected");
			momoj("#E_PAPER").addClass("selected");
			var sclTop = momoj("#E_PAPER").position().top+momoj("#E_PAPER").outerHeight()+document.documentElement.scrollTop;
			var sclLft = momoj("#E_PAPER").position().left-momoj(".epaperList").outerWidth()+momoj("#E_PAPER").outerWidth()+100;
			//momoj(".epaperList").css({top:sclTop,left:sclLft}).slideDown("slow");
      momoj(".epaperList").css({top:sclTop,left:sclLft}).show();
		}else{
			momoj(".epaperList").hide();
			momoj("#E_PAPER").removeClass("selected");
	  }
	});
	
		
	momoj(".epaperList .epaper_mail").click(function(){
		if (momoj(".epaperList .epaper_mail").attr("value") == "&#35531;&#36664;&#20837;E-mail") {
			momoj(".epaperList .epaper_mail").attr("value","").addClass("txtinput");
		} 
		return;
	});
		
	momoj('#BodyBase').delegate('.epaperList','hover',function(e){
		if(e.type=='mouseover'){
			momoj(".epaperList").show();
			momoj("#E_PAPER").addClass("selected");			
		}else{
			momoj(".epaperList").hide();
			momoj("#E_PAPER").removeClass("selected");			
		}
	})
	.delegate('.epaperList .btnArea button','click',function(){
		momoj(".epaperList").hide();
		momoj("#E_PAPER").removeClass("selected");
		var email = momoj("#epaper_mail").val();
		var gender = momoj('input[name=gender]:checked').val();
		if($.trim(gender) == '' || $.trim(gender) == ''){
			alert(momoj.unicode2Str('&#35531;&#36664;&#20837; MAIL &#33287;&#24615;&#21029;&#12290;'));
			return;
		}
		
	momoj.ajax({
		url : "/servlet/NonMemberENewsLetter",
				type : "POST",
				data: {'flag':'sub_epaper','email':email,'gender':gender },
				success : function(objData){
			  if(objData == '001'){
				  alert('email'+momoj.unicode2Str('&#26684;&#24335;&#37679;&#35492;'));
			  }else if(objData == '002'){
				  alert(momoj.unicode2Str('&#35330;&#38321;&#35469;&#35657;&#20449;&#24050;&#23492;&#20986;&#65292;&#35531;&#33267;&#24744; Email &#25910;&#20449;&#21283;&#30906;&#35469;&#65292;&#25165;&#31639;&#35330;&#38321;&#25104;&#21151;~'));
			  }else if(objData == '003'){
				  alert(momoj.unicode2Str('&#24744;&#24050;&#26159;&#26371;&#21729;&#65292;&#35531;&#33267;&#23458;&#26381;&#20013;&#24515;&#30906;&#35469;&#25910;&#38651;&#23376;&#22577;&#30340;e-mail&#21363;&#21487;&#12290;'));
				  var eplink ="javascript:momoj().MomoLogin({LoginSuccess:function(){window.location.href='https://www.momoshop.com.tw/mypage/MemberCenter.jsp?func=12&cid=memfu&oid=ticket&mdiv=1000100000-bt_0_100_01&ctype=B';}});";
				  location.href=eplink;
			  }else if(objData == '004'){
				  alert(momoj.unicode2Str('&#35330;&#38321;&#35469;&#35657;&#20449;&#23492;&#36865;&#22833;&#25943;&#65292;&#35531;&#20877;&#35430;&#19968;&#27425;&#12290;'));
			  }else if(objData == '005'){
				  alert(momoj.unicode2Str('&#35330;&#36092;&#22833;&#25943;&#65292;&#35531;&#20877;&#35430;&#19968;&#27425;&#12290;'));
			  }else if(objData == '006'){
				  alert(momoj.unicode2Str('&#24050;&#35330;&#38321;&#36942;&#25695;&#65292;&#35531;&#21247;&#37325;&#35079;&#35330;&#38321;&#12290;'));
			  }else{
				  alert(momoj.unicode2Str('&#35330;&#36092;&#22833;&#25943;&#65292;&#35531;&#20877;&#35430;&#19968;&#27425;&#12290;'));
			  }
		  }
		});
	});
}

// for lazy load img modify from http://www.appelsiini.net/projects/lazyload
$.fn.lazyload = function(options) {
  var settings = {
    threshold    : 0,
    failurelimit : 0,
    event        : "scroll",
    effect       : "show",
    container    : window
  };
          
  if(options) {
    $.extend(settings, options);
  }
  var elements = this;
  if ("scroll" == settings.event) {
    $(settings.container).bind("scroll", function(event) {
      var counter = 0;
      elements.each(function() {
        if (!this.loaded && !$.belowthefold(this, settings) &&
          !$.rightoffold(this, settings) && !$(this).is(":hidden") ) {
            $(this).trigger("appear");
        }
      });
      var temp = $.grep(elements, function(element) {
        return !element.loaded;
      });
      elements = $(temp);
    });
  }
  this.each(function() {
    var self = this;
    $(self).one("appear", function() {
      if (!this.loaded) {
        $(this).attr("src", $.getImgSrc({org:$(self).attr("org")}));
        self.loaded = true;
      };
      $(this).removeAttr("lazy");
    });
    if($(self).is(":hidden")){
      $(self).one("mousemove",function(){
        $(this).trigger("appear");
      });
    }
    if ("scroll" != settings.event) {
      $(self).bind(settings.event, function(event) {
        if (!self.loaded) {
          $(self).trigger("appear");
        }
      });
    }
  });
  $(settings.container).trigger(settings.event);
  return this;
};

$.belowthefold = function(element, settings) {
  if (settings.container === undefined || settings.container === window) {
    var fold = $(window).height() + $(window).scrollTop();
  } else {
    var fold = $(settings.container).offset().top + $(settings.container).height();
  }
  return fold <= $(element).offset().top - settings.threshold;
};
$.rightoffold = function(element, settings) {
  if (settings.container === undefined || settings.container === window) {
    var fold = $(window).width() + $(window).scrollLeft();
  } else {
    var fold = $(settings.container).offset().left + $(settings.container).width();
  }
  return fold <= $(element).offset().left - settings.threshold;
};
// lazy load img END

$.extend({
  ajaxTool:function(settings){ // for /ajax/ajaxTool.jsp
    var _defaultSettings = {
      URL:"/ajax/ajaxTool.jsp?t="+new Date().getTime(),
      data:"",
      async:false,
      timeout:0,
      dataType:'json',
      rData:{rtnCode:600,rtnMsg:"server error",rtnData:{}}
    };
    var _settings = $.extend(_defaultSettings, settings);
    if(typeof _settings.data!="object") return _settings.rData;
    //if(typeof _settings.data.flag!="number") return _settings.rData;
    var _flag = _settings.data.flag;
    delete _settings.data.flag;
    var _dataObj={
      flag:_flag,
      data:_settings.data
    };
    var _data=JSON.stringify(_dataObj);
    $.ajax({
      url:_settings.URL,
      type:'POST',
      data:{data:_data},
      dataType:_settings.dataType,
      async:_settings.async,
      timeout:_settings.timeout,
      success:function(content){
        $.extend(_settings.rData, content || {});
        if(_settings.rData.rtnData==null || _settings.rtnData=='null') _settings.rData.rtnData={};
      },
      error:function(err){
        _settings.rData.rtnCode=601;
      }
    });
    return _settings.rData;
  },
  runMethod:function(settings){
    var _defaultSettings = {
      run:"",
      js:"",
      pa:{}
    };
    var _settings = $.extend(_defaultSettings, settings);
    if (_settings.run=="") return;
    if (_settings.js=="") return;
    var _function="$."+_settings.run;
    var _pa=JSON.stringify(_settings.pa);
    if (eval ("typeof "+_function+"==\"function\"") ){
      return eval(_function+".call(this,"+_pa+")");
    } else {
      $.ajax({
        url:_settings.js,
        dataType:'script',
        async:false,
        success:function(){
          return eval(_function+".call(this,"+_pa+")");
        }
      });
      /*
      $.getScript(_settings.js,function(){
        return eval(_function+".call(this,"+_pa+")");
      });
      */
    }
  },
  str2Unicode:function(str){
    if(typeof str!='string') return '';
    
    var rtnStr="";
    for(var i=0;i<str.length;i++){
      var _charCode=str.charCodeAt(i);
      if (_charCode<126){
        _charCode=str.substr(i,1);
      }else{
        _charCode='&#'+_charCode+';';
      }
      rtnStr+=_charCode;
    }
    return rtnStr;
  },
  unicode2Str:function(_unicode){
    var _rtnstr='';
    try{
      var _aUni=_unicode.split(';');
      for(var i=0;i<_aUni.length;i++){
        var _str=_aUni[i];
        var _pos=_str.indexOf('&#');
        if(_pos==0){
          _str=_str.replace('&#','');
          _str=String.fromCharCode(_str);
        }else if(_pos>0){
          _str=_str.substring(0,_pos)+String.fromCharCode(_str.substr(_pos+2));
        }
        _rtnstr+=_str;
      }
    }catch(err){
      _rtnstr= _unicode;
    }
    return _rtnstr;
  },
  bt_0_127:function(){
    var _bt=momoj('#bt_0_127_01')
    var _time=momoj('#bt_0_127_01_e4',_bt).text()
    if(_time.match(/^\d{4}$/)){
      var _d=new Date();
      var _h=_d.getHours();
      var _m=_d.getMinutes();
      var _expH=parseInt(_time.substring(0,2));
      var _expM=parseInt(_time.substring(2,4));
      var _now=_h*60+_m;
      var _exp=_expH*60+_expM;
      if(_exp > _now){
        var _lastTime=_exp-_now;
        var _lastH=parseInt(_lastTime/60);
        var _lastM=_lastTime % 60;
        if (_lastH < 10){
          _lastH='0'+_lastH;
        }else{
          _lastH=_lastH.toString();
        }
        if (_lastM < 10){
           _lastM='0'+_lastM;
        }else{
          _lastM=_lastM.toString();
        }
        momoj('.t1',_bt).text(_lastH.substring(0,1));
        momoj('.t2',_bt).text(_lastH.substring(1,2));
        momoj('.t3',_bt).text(_lastM.substring(0,1));
        momoj('.t4',_bt).text(_lastM.substring(1,2));
      }
    }  
  
  },
  bt_0_116:function(){
    var _d=new Date();
    var _m=_d.getMonth()+1;
    if ( _m<10) _m='0'+_m;
    var _d=_d.getDate();
    if ( _d<10) _d='0'+_d;
    var _today=_m+'/'+_d;
    momoj('#bt_0_116_01_Today').text(_today);
  },
  bt_0_180:function(){
    var _bt=momoj('#bt_0_180_01');
    var _time=momoj('#bt_0_180_01_e3',_bt).text();
    if(_time.match(/^\d{4}$/)){
      momoj('.t1',_bt).text(_time.substring(0,1));
      momoj('.t2',_bt).text(_time.substring(1,2));
      momoj('.t3',_bt).text(_time.substring(2,3));
      momoj('.t4',_bt).text(_time.substring(3,4));
    }  
  },
  bt_0_165:function(){
    var _Randd=Math.round(Math.random()*momoj('#bt_0_165_01 dt').length);
    momoj('#bt_0_165_01 dt').eq(_Randd-1).addClass('selected'); 
    momoj('#bt_0_165_01 dd').eq(_Randd-1).show(); 
    momoj('#bt_0_165_01').delegate('dt','mouseover',function(){ 
    momoj('#bt_0_165_01 dt').removeClass('selected'); 
    momoj('#bt_0_165_01 dd').hide(); 
    momoj(this).addClass('selected').next('dd').show(); 
    });
  },
  bt_0_167:function(){
    var _Randd=Math.round(Math.random()*momoj('#bt_0_167_01 dt').length);
    momoj('#bt_0_167_01 dt').eq(_Randd-1).addClass('selected'); 
    momoj('#bt_0_167_01 dd').eq(_Randd-1).show(); 
    momoj('#bt_0_167_01').delegate('dt','mouseover',function(){ 
    momoj('#bt_0_167_01 dt').removeClass('selected'); 
    momoj('#bt_0_167_01 dd').hide(); 
    momoj(this).addClass('selected').next('dd').show(); 
    });
  },
  addToMyFavorite:function(settings){
    var _defaultSettings = {
      url:location.href,
      title:document.title
    };
    var _settings = $.extend(_defaultSettings, settings);  
    if(window.sidebar){
      window.sidebar.addPanel(_settings.title,_settings.url,'');
    }else if(window.external){
      window.external.AddFavorite(_settings.url,_settings.title);
    }else{
      alert(momoj.unicode2Str('&#35531;&#20351;&#29992;&#26360;&#31844;&#21151;&#33021;&#21152;&#21040;&#25105;&#30340;&#26368;&#24859;&#65281;'));
    }
  },
  getImgSrc:function(settings){
    var _defaultSettings={
      org:""
    } 
    var _settings=$.extend(_defaultSettings,settings);
    var _rtnImgS="";
    if(_settings.org=="") return _rtnImgS;
    if(_settings.org.match(/^\//)){
      ImgN++;
      _imgN=ImgN % ImgS;
      _imgN++;
      if(document.location.href.match(/www.momoshop.com.tw/i)){
        if (document.location.href.match(/https/i)){
          _rtnImgS="";
        }else{
          _rtnImgS="//imgN.momoshop.com.tw";
        }
      }else if(document.location.href.match(/momotest.momoshop.com.tw/i)||document.location.href.match(/ecmdev.momoshop.com.tw/i)){
    if (document.location.href.match(/https/i)){
          _rtnImgS="";
        }else{          
          _rtnImgS="";
        }
    }else{    
        if (document.location.href.match(/https/i)){
          _rtnImgS="";
        }else if(document.location.href.match(/10./i)){ 
           _rtnImgS="";
        }else{          
          _rtnImgS="//imgN.momoshop.com.tw"; //momotravel
        }
      }
      _rtnImgS=_rtnImgS.replace("N",_imgN)+ _settings.org;
    }

    return _rtnImgS;
  }
});

$.fn.whoBuyLoad = function(options) {
  var settings = {
      threshold    : 0,
      failurelimit : 0,
      event        : "scroll",
      effect       : "show",
      container    : window
    };
            
    if(options) {
      $.extend(settings, options);
    }
    var elements = this;
    if ("scroll" == settings.event) {
      $(settings.container).bind("scroll", function(event) {
        var counter = 0;
        elements.each(function() {
          if (!this.loaded && !$.belowthefold(this, settings) &&
            !$.rightoffold(this, settings) && !$(this).is(":hidden") ) {          
            $(this).trigger("appear");
          }
        });
        var temp = $.grep(elements, function(element) {
          return !element.loaded;
        });
        elements = $(temp);
      });
    }        
    this.each(function() {
      var self = this;
      $(self).one("appear", function() {
        if (!this.loaded) {
          momoj.getScript("/ecm/js/whoBuy.js?t="+new Date().getTime());
          self.loaded = true;
        };        
      });
      if($(self).is(":hidden")){
        $(self).one("mousemove",function(){
          $(this).trigger("appear");
        });
      }
      if ("scroll" != settings.event) {
        $(self).bind(settings.event, function(event) {
          if (!self.loaded) {
            $(self).trigger("appear");
          }
        });
      }
    });
}

$.fn.tvLiveOnLoad = function(options) {
  var settings = {
      threshold    : 0,
      failurelimit : 0,
      event        : "scroll",
      effect       : "show",
      container    : window
    };
            
    if(options) {
      $.extend(settings, options);
    }
    var elements = this;
    if ("scroll" == settings.event) {
      $(settings.container).bind("scroll", function(event) {
        var counter = 0;
        elements.each(function() {
          if (!this.loaded && !$.belowthefold(this, settings) &&
            !$.rightoffold(this, settings) && !$(this).is(":hidden") ) {          
            $(this).trigger("appear");
          }
        });
        var temp = $.grep(elements, function(element) {
          return !element.loaded;
        });
        elements = $(temp);
      });
    }        
    this.each(function() {
      var self = this;
      $(self).one("appear", function() {
        if (!this.loaded) {
          momoj.getScript("/ecm/js/tvLiveOn.js?t="+new Date().getTime());
          self.loaded = true;
        };        
      });
      if($(self).is(":hidden")){
        $(self).one("mousemove",function(){
          $(this).trigger("appear");
        });
      }
      if ("scroll" != settings.event) {
        $(self).bind(settings.event, function(event) {
          if (!self.loaded) {
            $(self).trigger("appear");
          }
        });
      }
    });
}

$.fn.ReListMenu = function(settings){
  var container=$(this);
  // if container is array, scan it
  if ( container.length >1 ) {
    container.each(function(){
      $(this).ReListMenu(settings);
    });
    return false;
  }
  var _defaultSettings = {        
    rowLen:10,
    ulWidth:140,
    liWidth:130,
    liHeight:15
  }; 
  var _settings = $.extend(_defaultSettings, settings);
  var _calCols=function(len,lim){
    var _cols=Math.floor(len/lim);
    var _mod=len%lim;
    if(_mod>0){
      _cols++;
    }else{
      _mod=lim;
    }
    var _rtn={
      cols:_cols,
      mod:_mod
    };
    
    return _rtn;
  }  
  var _chgMenu=function(opt){
    var _idx=opt.idx || 0;
    if(container.data('ReListMenuContent').length>_idx){
      var _CD=container.data('ReListMenuContent').eq(_idx);
      var _CDwidth=_CD.width();
      _CD.parent().css({width:_CDwidth+'px'});
      if ( !_CD.data('ReListMenuInit')) {
        _CD.data('ReListMenuInit',true);
        var _lis=_CD.find('ul li');
        var _liLen=_lis.length;
        var _cols=_calCols(_liLen,_settings.rowLen);
        var _ulWidth=_settings.liWidth*_cols.cols-(_cols.cols-1)*2;
        var _ulHeight=_settings.rowLen*_settings.liHeight;
        var _ul=_CD.find('ul');
        _ul
          .css({width:_ulWidth+'px',height:_ulHeight})
          .empty()
        ;
        _CD.css({width:_ulWidth+'px'});
        _CD.parent().css({width:_ulWidth+'px'});
        var _liCols=_cols.cols;
        for(var i=0;i<_settings.rowLen;i++){
          var _liElm=$(_lis[i]);
          _liElm.css({width:_settings.liWidth});
          var _aElm=$('a',_liElm);
          _aElm.css({width:_settings.liWidth-10});
          _ul.append(_lis[i]);
          for(var j=1;j<_liCols;j++){
            var _liElm=$(_lis[i+j*_settings.rowLen]);
            _liElm.css({width:_settings.liWidth-2});
            var _aElm=$('a',_liElm);
            _aElm.css({width:_settings.liWidth-10});
            _ul.append(_lis[i+j*_settings.rowLen]);
          }
          if(i+1==_cols.mod){
            _liCols--;
          }
        }
      }
    }
    
  }
  

  var _reListMenu=function(){
    if ( !container.data('ReListMenuInit')) {
      container.data('ReListMenuInit',true);
      container.data('ReListMenuContent',container.find('.TabContent .TabContentD'));
      container
        .delegate('.TabMenu ul li','mouseover',function(e){
          if($(this).attr('idx')){
            _chgMenu({idx:$(this).attr('idx')});
          }
        })
       ;
    }
  }
  
  return this.each(_reListMenu);
}

})(jQuery);

function ShowMore(l_code){ 
  var _s=0;
  momoj('#bt_cate_top li').each(function(){
    //alert(momoj(this).attr('id')+';class:'+momoj(this).attr('class')+';S:'+_s);
    if(momoj(this).attr('id')==l_code){
      _s=1;
      return true;
    }
    if(_s==1 && momoj(this).hasClass('More')){
      momoj(this).hide();
    }
    if(_s==1 && momoj(this).hasClass('cateS')){
      momoj(this).removeClass('MoreHide');
    }
    if(_s==1 && momoj(this).hasClass('cateM')){
      _s=0;
      return false;
    }
  });
}

function get_form(url,varname){
  var _search=new Array();
  var vara=new Array();
  _search=url.split('?');
  
  if (typeof _search[1] =='undefined'){
    return '';
  }
  
  var _paa=_search[1].split('#');
  var _pa=_paa[0].split('&');
  
  var i=0;
  for (i=0;i<_pa.length;i++){
    vara=_pa[i].split('=');
    if (vara[0]==varname){
      return vara[1];
    }
  }
  return '';
}

function toUnicode() {
  var val = momoj.str2Unicode(momoj('#keyword').val());
  momoj('#p_keyword').val(val);
  momoj('[name=topSchFrm]').attr('action', momoj('[name=topSchFrm]').attr('action') + '&keyword=' + momoj('#keyword').val());
}

function safetymark() {
	var bodywidth = momoj("body")[0].clientWidth;
	var bodyheight = momoj("body")[0].clientHeight; 
	var viewingAreaheight = document.documentElement.clientHeight;
	momoj(".MoMoLM").css({"width":+ bodywidth+"px","height":+bodyheight+"px"}).fadeTo("slow",0.5);
	var safetymarkwidth = momoj(".safetymarkBox").width();
	var safetymarkheight = momoj(".safetymarkBox").height();
	momoj(".safetymarkBox").show().css({"bottom":+((viewingAreaheight/2)-(safetymarkheight/2))+"px","left":+((bodywidth/2)-(safetymarkwidth/2))+"px"});
	momoj(".safetymarkBox h2").delegate("a","click",function(){
		momoj(".MoMoLM, .safetymarkBox").hide();
	});
}

var brandCategory=jQuery().HashTables();

momoj(window).load(function(){
  setTimeout(function(){
    momoj("img[lazy=2]").each(function(){
      momoj(this).trigger("appear");
    });
  },5000);
});
