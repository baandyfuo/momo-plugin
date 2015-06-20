/*
Goods ajax tool plugin for momo
flag:2004 getGoodsStock
flag:2006 chkCartGoods, add goods into cart, check the other goods has the same cart type
*/
(function($){

// for DgrpCategory bt_9_002 goods price
$.fn.fixGoodsPrice = function(settings){
  var container=$(this);
  var _defaultSettings = {
    data:{
      flag:2002,
      describe_yn:'N',  //判斷是否撈取DESCRIBE_NOTE akchen2013.12.19
      promo_yn:'Y',
      goodsCode:[]
    },
    elsLimit:0,                     //if elsLimit eq 0, do not check
    mainDiv:'',
    failHide:true,
    succShow:true,
    proImg:true,                    //是否變更 promote type image
    proImgTag:'.content div:first'  //變更 promote img 的位置
  };
  var _settings = $.extend(_defaultSettings, settings);
  
  // if elments len ne elsLimit 
  if(_settings.elsLimit>0 && container.length < _settings.elsLimit){
    if (_settings.failHide) $('#'+_settings.mainDiv).hide();
    return;
  }
  if (_settings.elsLimit > 0 && _settings.mainDiv == 'bt_9_002_01') {
    _settings.data.describe_yn = 'Y';
    _settings.data.promo_yn = 'Y';
  }
  container.each(function(){
    var _class=$(this).attr('class');
    var _classA=_class.split(' ');
    for(var i=0;i<_classA.length;i++){
      if(_classA[i].match(/^GDS-/) ){
        _settings.data.goodsCode[_settings.data.goodsCode.length]=_classA[i].replace(/^GDS-/,'');
        break;
      }
    }
  });
  if(_settings.elsLimit >0 && _settings.data.goodsCode.length < _settings.elsLimit){
    if (_settings.failHide) $('#'+_settings.mainDiv).hide();
    return;
  }
  var _goodsPrice=$.ajaxTool({data:_settings.data});
  
  if(_goodsPrice.rtnCode!=200){
    if (_settings.failHide) $('#'+_settings.mainDiv).hide();
    return;
  }

  var _elOKs=0;
  container.each(function(){
    var _el=$(this);
    var _gc={};
    var _elTop='';
    var _classELA=_el.attr('class').split(' ');
    for(var _elClassi=0;_elClassi<_classELA.length;_elClassi++){
      if(_classELA[_elClassi].match(/^bt_/)){
        _elTop=$('#'+_classELA[_elClassi]);
        //break;
      }
      if(_classELA[_elClassi].match(/^GDS-/)){
        _gc=_classELA[_elClassi];
        //break;
      }
    }
    _elTop.hide();
    $.each(_goodsPrice.rtnData,function(key,value){
      if(key == _gc){
        if(value.LAST_PRICE==0){
          _el.html('&nbsp;');
          _elTop.hide();
        }else{
          _elTop.show();
          $('h2', _elTop).text('TOP' + (_elOKs+1));
          _elOKs++;
          var desFlag = '0';
          if(value.AFTER_PROMO_PRICE!='0'){//折後價更新
            var promoString = value.AFTER_PROMO_PRICE.split('_');
            var thString = '';
            if(promoString[1] == '1'){
              thString = '滿' + promoString[2] + '，即';
            }else if(promoString[1] == '2'){
              thString = '滿' + promoString[2] + '件，即';
            }else if(promoString[1] == '3'){
              var tempStr = promoString[2].split('#');//iThresholdQty + "#" + iThresholdAmt
              thString = '滿' + tempStr[0] + '件且滿' + tempStr[1] + '，即';
            }
            if(promoString[3] == '1'){
              thString = thString + promoString[4] + '%回饋';
            }else if(promoString[3] == '2'){
              thString = thString + promoString[4] + '元回饋';
            }else{
              thString = '';
            }
            if(thString != ''){
              _el.parent('.prdPrice').prev('.eventredBox').parent('a').find('.specialTitle').text(thString);//新增行銷活動門檻並移除特標
            }
            desFlag='1';
            if(promoString[0] != 'NONE'){//promoPrice不為NONE，表示此商品要顯示折後價
              var promoPrice = parseInt(promoString[0],10);
              _el.text(promoPrice);
              _el.parent().append('<i class="afterSale">(售價已折)</i>');//折後價新樣式
            }else{//不顯示折後價故塞一般價格
              _el.text(value.LAST_PRICE);
            }
          }else{//無行銷資訊直接塞價格
            _el.text(value.LAST_PRICE);
          }
          if( desFlag == '0'){  //2015.04.30 spwu 沒有折後價，才會塞到前端
            _el.parents('a').children('.specialTitle').text(value.DESCRIBE_NOTE);//2014.08.15 不判斷是否為空
          }
          if(value.GOODS_NAME!=''){ //2014.01.08 akchen 後台即時撈出的品名若不為空才會塞到前端，反之維持排程撈的
            _el.parents('a').children('.prdName').text(value.GOODS_NAME);
          }
          var _cateIconArea = _el.parent('span').next();
          if(_settings.proImg){
            var _imgHtml='';
            // FIRST_YN:快速到貨, TV_YN:TV, CP_YN:折價券
            if (value.TV_YN=='1') _cateIconArea.find('img:eq(0)').show();
            if(value.FIRST_YN=='1') _cateIconArea.find('img:eq(1)').show();
            if (value.CP_YN=='1') _cateIconArea.find('img:eq(2)').show();
            if (value.GIFT_YN) _cateIconArea.find('img:eq(3)').show();
            if (value.DISCOUNT_YN) _cateIconArea.find('img:eq(4)').show();
            //  if (!value.SALE_YN) _el.parent('span').prepend('<i>補貨中</i>');
            var _imgTag=$(_settings.proImgTag,_elTop);
            _imgTag.empty().append(_imgHtml);
          }
        }
      }
    });
  });
  if (_settings.failHide && _elOKs < _settings.elsLimit){
    $('#'+_settings.mainDiv).hide();
    return;
  }
  $('#'+_settings.mainDiv).show();
}

$.extend({
  fixGoodsStock: function(settings){ 
    // fix Goods Stock that span with attrib "GDS"
    var _defaultSettings = {
      data:{
        flag:2004,
        goodsCode:[]
      }
    };
    var _settings = $.extend(_defaultSettings, settings);
    
    $('span[GDSStock]').each(function(){
      _settings.data.goodsCode.push($(this).attr("GDSStock").replace(/^GDS-/,""));
    });
    
    if(_settings.data.goodsCode.length==0){
      return;
    }
    var _goodsStock=$.ajaxTool({data:_settings.data});
    //alert("return code:"+_goodsStock.rtnCode);
    if (_goodsStock.rtnCode==200){
      $.each(_goodsStock.rtnData,function(key,value){
        if(key.match(/^GDS-/)){
          $("span[GDSStock="+key+"]").html(value);
        }
      });
    }
  },
  chkCartGoods: function(settings){
    // check cart type, return status code
    var _defaultSettings = {
      data:{
        flag:2006,
        goodsCode:"",
        delyWork:""
      },
      rtnData:{'rtnCode':'500'}
    };
    var _settings = $.extend(_defaultSettings, settings);
    $.extend(_settings.data,settings || {});
    if (_settings.data.goodsCode==""){
      return _settings.rtnData;
    }
    var _goodsCart=$.ajaxTool({data:_settings.data});
    //alert('chkCartGoods END');
    return _goodsCart;
  }
  
});

})(jQuery);

//for category add to cart
function addQty(){
  var count = parseInt(momoj('#count').val());
  var MaxcanBuy = parseInt(momoj('#MaxCanBuy').val());
  if ( MaxcanBuy-count > 0 ){
    momoj('#count').val(count+1);
  }
}
function minusQty(){
  var count = parseInt(momoj('#count').val());
  if(count>1){
    momoj('#count').val(count-1);
  }
}
function insertWishList(str1, str2, str3) {
  momoj().MomoLogin({GoCart:false, LoginSuccess:function() {
    momoj.ajax({
      url : "/servlet/MemberCenterServ",
      type : "POST",
      dataType : 'json',
      data : {flag:"1006", goods_code:str1, category_code:str2, select_yn:str3},
        timeout : 30000,
        success : function(data){
          rtnCode = data.rtnCode;
          if (rtnCode == "401") {
            alert(momoj.unicode2Str('&#27492;&#21830;&#21697;&#24050;&#22312;&#12300;&#25105;&#30340;&#36861;&#36452;&#28165;&#21934;&#12301;&#21015;&#34920;&#20013;'));
          } else if (rtnCode == "101") {
            var _WishListNumber=momoj().cookie('WishListNumber');
            if (_WishListNumber==null || _WishListNumber=='null') _WishListNumber='0';
            if(_WishListNumber!=""){
              var _a=momoj("#wishList a");
              _a.html(momoj.unicode2Str('&#24050;&#36861;&#36452;') + "<span>("+_WishListNumber+")</span>");
            }
            alert(momoj.unicode2Str('&#36889;&#20491;&#21830;&#21697;&#24050;&#25104;&#21151;&#32000;&#37636;&#21040;&#12300;&#25105;&#30340;&#28165;&#21934;&#12301;&#20013;'));
          } else {
            alert(momoj.unicode2Str('&#24456;&#25265;&#27465;&#65281;&#20282;&#26381;&#22120;&#26283;&#26178;&#28961;&#27861;&#36899;&#32218;&#65292;&#35531;&#31245;&#20505;&#20877;&#35430;&#65292;&#25110;&#36899;&#32363;&#26412;&#20844;&#21496;&#23458;&#26381;&#20154;&#21729;&#34389;&#29702;&#12290;'));
          }
        },
        error : function(err, msg1, msg2) {
          alert(momoj.unicode2Str('&#24456;&#25265;&#27465;&#65281;&#20282;&#26381;&#22120;&#26283;&#26178;&#28961;&#27861;&#36899;&#32218;&#65292;&#35531;&#31245;&#20505;&#20877;&#35430;&#65292;&#25110;&#36899;&#32363;&#26412;&#20844;&#21496;&#23458;&#26381;&#20154;&#21729;&#34389;&#29702;&#12290;'));
        }
      });
  }});
}
//Reload Cart Info
function loadSPCart(){
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
    'donate':'&#20844;&#30410;&#25424;&#27454;',
    'china10':'&#30452;&#37197;&#22823;&#38520;',
    'china20':'&#30452;&#37197;&#22823;&#38520;-&#26053;&#36938;',
    'china30':'&#30452;&#37197;&#22823;&#38520;-&#28961;&#30332;&#31080;',
    'marathon':'&#23500;&#37030;&#39340;&#25289;&#26494;',
    'saveget':'&#38651;&#23376;&#31150;&#21367;'
  };
  var shortCartName = {
    'ec10':'&#36895;&#36948;',
    'ec20':'&#36895;&#36948;',
    'ec30':'&#36895;&#36948;',
    'ecfreeze':'&#36895;&#36948;',
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
    'donate':'&#25424;&#27454;',
    'china10':'&#22823;&#38520;',
    'china20':'&#22823;&#38520;',
    'china30':'&#22823;&#38520;',
    'marathon':'&#39340;&#25289;&#26494;',
    'saveget':'&#31150;&#21367;'
  };
  var shopCart = momoj.ajaxTool({data:{flag:3032}});
  if (shopCart.rtnCode==200){
    momoj('.shoppingCartList table').html('');
    momoj('.shoppingcart ul').html('');
    if(shopCart.rtnData.rtnChar=='1'){
      var _ghostCartLt = shopCart.rtnData.ghostCartLt;
      var _dftCartUrl='';
      var _allCnt = 0;
      if(_ghostCartLt.length>0){
        for(i=0;i<_ghostCartLt.length;i++){	
          var sCartChiName = shortCartName[_ghostCartLt[i].cartName];
          var lCartChiName = longCartName[_ghostCartLt[i].cartName];
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
          var carUrl = 'javascript:momoj().MomoLogin({GoCart:true,LoginSuccess:function(){location.href=\''+_defaultSettings.shopCartUrl+'cart_name='+_ghostCartLt[i].cartName+'\'}})';
          var prodTolCount = _ghostCartLt[i].prodTolCount;
          _allCnt += parseInt(prodTolCount);
          var prodTolPrice = _ghostCartLt[i].prodTolPrice;
          var _li = '<li style="display: list-item;"><a href="">'+sCartChiName+'('+prodTolCount+')<span></span></a></li>';
          momoj('.shoppingcart ul').append(_li);
          momoj('.shoppingcart ul li a').eq(i).attr('href',carUrl);
          //top block
          var trEle = [
          '<tr>',
          '<td class="cartname" valign="middle"><a href="'+carUrl+'">'+lCartChiName+'</a></td>',
          '<td class="qrantitytxt">(<b>'+prodTolCount+'</b>)&nbsp;&#20214;</td>',
          '<td class="pricetxt"><b>'+prodTolPrice+'</b>&#20803;</td>',
          '</tr>'
          ].join('');
          momoj('.shoppingCartList table').append(trEle);
          if(i==0){
            _dftCartUrl = 'cart_name='+_ghostCartLt[i].cartName;
          }
        }
        momoj("#TopCart").attr('title','');
        momoj('#TopCart span').remove();
        momoj("#TopCart").append('<span></span>');
        momoj('#TopCart span').text('');
        momoj('#TopCart span').text('( '+_allCnt+' )');
        if(momoj('#TopCart').length >0){
          momoj('#TopCart').data('CartUrl',_defaultSettings.shopCartUrl+_dftCartUrl);
        }
        var trEleBot = [
          '<tr>',
          '<td class="btnArea" colspan="3" valign="middle"><input class="cartChkOutTop" value="&#32080;&#24115;" type="button"></td>',
          '</tr>',
        ].join('');
        momoj('.shoppingCartList table').append(trEleBot);
        momoj('.cartChkOut').click(function(){
          momoj().MomoLogin({
            GoCart:true,
            LoginSuccess:function(){
              location.href=_defaultSettings.shopCartUrl+_dftCartUrl;
            }
          });
        });
        momoj('.cartChkOutTop').click(function(){
        momoj().MomoLogin({
          GoCart:true,
          LoginSuccess:function(){
            location.href=_defaultSettings.shopCartUrl+_dftCartUrl;
            }
          });
        });
        momoj('.shoppingcart ul li').show();
        momoj('.shoppingcart').show();
        momoj('#bt_0_150_01').delegate('#CartDD','hover',function(e){
          if (e.type=='mouseover'){
            momoj(".cpmList").hide();
            momoj("#CPM").removeClass("selected");
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
        momoj.delegate('.shoppingCartList .btnArea button','click',function(){
          momoj(".shoppingCartList").hide();
          momoj("#TopCart").removeClass("selected");
          return;
        });
      }
    }
  }
}
function addToCartCate(goodsCode, imgPath, goodsName, salePrice, strDCode) {
  var addToCartHTML = "";
  var chkErr = "false";
  var jsonData = new Object();
  jsonData.flag = 2012;
  jsonData.data = {
    i_code: goodsCode,
    str_category_code: strDCode,
    mdiv: strDCode,
    Area: "DgrpCategory"
  };
  momoj.ajax({
    async : false,
    url: '/ajax/ajaxTool.jsp',
    cache : false,
    type : 'POST',
    data: {data:JSON.stringify(jsonData) },
    dataType : 'json',
    success : function(objData) {
      var rtnVal = objData.rtnData;
      imgPath = imgPath.replace("_Y", "_L");
      addToCartHTML += '<p><a><span>&times;</span>'+ momoj.unicode2Str('&#38364;&#38281;') +'</a></p>';
      addToCartHTML += '<ul>';
      addToCartHTML += '<li>';
      addToCartHTML += '<img width="320" height="320" src="'+ imgPath +'" alt="'+ goodsName +'" title="'+ goodsName +'" />';
      addToCartHTML += '<p class="prdName" id="prdName">'+ goodsName +'</p>';
      addToCartHTML += '<p class="price">$<b>'+ salePrice +'</b></p>';
      addToCartHTML += '<p class="buyQuantity"><b>&#25976;&#37327;&#65306;</b><span><i id="buyQtyMinus" onClick="minusQty();">-</i><input type="text" id="count" name="count" value="1" readonly style="ime-mode:disabled;" /><i class="add" id="buyQtyPlus" onClick="addQty();">+</i></span></p>';
      if(rtnVal.SetYn != null && rtnVal.SetYn=="1" ){
        addToCartHTML += '<p class="style1"><b>&#32068;&#21512;&#21830;&#21697;&#65306;</b><br />' + rtnVal.SetGoodsHtml.toString() +'</p>';
      }
      else{
        if(rtnVal.GoodsbtHtml.toString().indexOf("select") > 0){
          addToCartHTML += '<p class="style1"><b>&#35215;&#26684;&#65306;</b>' + rtnVal.GoodsbtHtml.toString() +'</p>';
        }
      }
      if(rtnVal.SetGoodsGiftHtml.toString()!=""){
        SetGoodsGiftHtml = rtnVal.SetGoodsGiftHtml.toString();
        addToCartHTML += '<p class="style1"><b>贈品:</b>' + SetGoodsGiftHtml +'</p>';
      }
      if(rtnVal.goodsdelv!=""){
      addToCartHTML += '<p class="style1"><b>&#37197;&#36865;&#65306;</b>';
        if(rtnVal.goodsdelv.first == true){
          if(rtnVal.DelyTemp == "01"){
            addToCartHTML += '<span><img src="/ecm/img/cmm/goodsdetail/todayhome.gif" width="25" height="25" border="0"><input type="radio" value="first" name="dely_work" id="first" checked><label for="first">&#25351;&#23450;&#26178;&#27573;&#36895;&#36948;</label></span><span style="clear:both;"></span>';
          }
          if(rtnVal.DelyTemp == "02"){
            addToCartHTML += '<span><img src="/ecm/img/cmm/goodsdetail/freezingDely.gif" width="25" height="25" border="0"><input type="radio" value="first" name="dely_work" id="first" checked><label for="first">&#25351;&#23450;&#26178;&#27573;&#20919;&#20941;&#23429;&#37197;</label></span><span style="clear:both;"></span>';
          }
          if(rtnVal.ShopRecvYn == "1"){
            addToCartHTML += '<span><img src="/ecm/img/cmm/goodsdetail/7_11.gif" width="25" height="25" border="0"><input type="radio" value="superstore" name="dely_work" id="superstore" ><label for="superstore">&#36229;&#21830;&#21462;&#36008;</label></span><span style="clear:both;"></span>';
          }
        }
        if(rtnVal.goodsdelv.shopcart == true){
          addToCartHTML += '<span><img src="/ecm/img/cmm/goodsdetail/dely.gif" width="25" height="25" border="0"><input type="radio" value="shopcart" name="dely_work" id="shopcart" checked><label for="shopcart">&#23429;&#37197;</label></span><span style="clear:both;"></span>';
        }
        if(rtnVal.goodsdelv.superstore == true && rtnVal.ShopRecvYn!="1"){
          addToCartHTML += '<span><img src="/ecm/img/cmm/goodsdetail/7_11.gif" width="25" height="25" border="0"><input type="radio" value="superstore" name="dely_work" id="superstore" ><label for="superstore">&#36229;&#21830;&#21462;&#36008;</label></span><span style="clear:both;"></span>';
        }
        if(rtnVal.DelyCountry0086CanDelyYn == "true"){
          addToCartHTML += '<span><img src="/ecm/img/cmm/goodsdetail/chinaDely.gif" width="25" height="25" border="0"><input type="radio" value="china" name="dely_work" id="china" ><label for="china">&#30452;&#37197;&#22823;&#38520;</label></span><span style="clear:both;"></span>';
        }
      addToCartHTML += '</p>';
      }
      if(rtnVal.BuyYN == "0"){
        addToCartHTML += '<span id="spnBuy"><a class="buyBtn" href="javascript:void(0);" >&#32570;&#36008;&#35036;&#36008;&#20013;</a></span>';
      }
      else{
        addToCartHTML += '<span id="spnBuy"><a class="buyBtn" href="javascript:void(0);" onclick="OrderProcessCate(\'cart\', \''+ goodsCode +'\'); return false;">&#36984;&#36092;</a></span>';
      }
      addToCartHTML += '<input type="hidden" name="MaxCanBuy" id="MaxCanBuy" value="'+ rtnVal.goodsqty +'" />';
      addToCartHTML += '<input id="discMachYn" name="discMachYn" value="0" type="hidden">';
      addToCartHTML += '<input id="recoverYn" name="recoverYn" value="0" type="hidden">';
      addToCartHTML += '<input id="firstBuyQty" name="firstBuyQty" value="0" type="hidden">';
      addToCartHTML += '<input name="work" id="work" value="cart" type="hidden">';
      addToCartHTML += '<input name="goods_code" id="goods_code" value="'+ goodsCode +'" type="hidden">';
      addToCartHTML += '<input name="lgroup" id="lgroup" value="'+ rtnVal.LGroup +'" type="hidden">';
      addToCartHTML += '<input name="mgroup" id="mgroup" value="'+ rtnVal.MGroup +'" type="hidden">';
      addToCartHTML += '<input name="sgroup" id="sgroup" value="'+ rtnVal.SGroup +'" type="hidden">';
      addToCartHTML += '<input name="dgroup" id="dgroup" value="'+ rtnVal.DGroup +'" type="hidden">';
      addToCartHTML += '<input name="shop_id" id="shop_id" value="'+ rtnVal.ShopID +'" type="hidden">';
      addToCartHTML += '<input name="entp_code" id="entp_code" value="'+ rtnVal.EntpCode +'" type="hidden">';
      addToCartHTML += '<input name="lgroup_code" id="lgroup_code" value="'+ rtnVal.MgroupCode +'" type="hidden">';
      addToCartHTML += '<input name="min_order_amt" id="min_order_amt" value="'+ rtnVal.MinOrderAmt +'" type="hidden">';
      addToCartHTML += '<input name="category_code" id="category_code" value="'+ rtnVal.DgroupCode +'" type="hidden">';
      addToCartHTML += '<input name="norest_allot_months" id="norest_allot_months" value="'+ rtnVal.NorestAllotMonths +'" type="hidden">';
      addToCartHTML += '<input name="norest_allot_month" id="norest_allot_month" value="'+ rtnVal.NorestAllotMonth +'" type="hidden">';
      addToCartHTML += '<input name="norest_allot_yn" id="norest_allot_yn" value="'+ rtnVal.NorestAllotYn +'" type="hidden">';
      addToCartHTML += '<input name="set_yn" id="set_yn" value="'+ rtnVal.SetYn +'" type="hidden">';
      addToCartHTML += '<input name="sale_check" id="sale_check" value="'+ rtnVal.Sale_check +'" type="hidden">';
      addToCartHTML += '<input name="goods_flag" id="goods_flag" value="'+ rtnVal.Goods_flag +'" type="hidden">';
      addToCartHTML += '<input name="receipt_flag" id="receipt_flag" value="'+ rtnVal.ReceiptFlag +'" type="hidden">';
      addToCartHTML += '<input name="gipromo_no31" id="gipromo_no31" value="'+ rtnVal.Gipromo_no31 +'" type="hidden">';
      addToCartHTML += '<input name="cust_feedback_yn" id="cust_feedback_yn" value="'+ rtnVal.CustfeedbackYn +'" type="hidden">';
      addToCartHTML += '<input name="shop_recv_yn" id="shop_recv_yn" value="'+ rtnVal.ShopRecvYn +'" type="hidden">';
      addToCartHTML += '<input name="set_dely_gb" id="set_dely_gb" value="'+ rtnVal.SetDelyGb +'" type="hidden">';
      addToCartHTML += '<input type="hidden" name="addgonumber" id="addgonumber" value="0"/>';
      addToCartHTML += '<input type="hidden" name="addgovalue" id="addgovalue" value="0"/>';
      addToCartHTML += '<input type="hidden" name="gift_limit_qty31" id="gift_limit_qty31" value="'+ rtnVal.Gift_limit_qty31 +'"/>';
      addToCartHTML += '<input type="hidden" name="promo_type" id="promo_type" value="0">';
      addToCartHTML += '<input type="hidden" name="promo_types" id="promo_types" value="0">';
      addToCartHTML += '<input name="save_amt" id="save_amt" value="'+ rtnVal.Save_amt +'" type="hidden">';
      addToCartHTML += '<input name="sale_price" id="sale_price" value="'+ rtnVal.Sale_price +'" type="hidden">';
      addToCartHTML += '<input type="hidden" value="DgrpCategory" name="area" id="area"></input>';
      if(rtnVal.SetYn != null && rtnVal.SetYn=="1" ){
        addToCartHTML += '<input type="hidden" name="goods_kind" id="goods_kind" value="set">';
        addToCartHTML += '<input type="hidden" value="000" name="goodsdt_code" id="goodsdt_code"></input>';
      }
      else {
        addToCartHTML += '<input type="hidden" name="goods_kind" id="goods_kind" value="goods">';
        addToCartHTML += '<input type="hidden" value="001" name="goodsdt_code" id="goodsdt_code"></input>';
      }
      addToCartHTML += '<input type="hidden" name="delyTemp" id="delyTemp" value="'+ rtnVal.DelyTemp +'"/>';
      addToCartHTML += '<input type="hidden" name="largeMachineYn" id="largeMachineYn" value="'+ rtnVal.LargeMachineYn +'"/>';
      if(rtnVal.CountHiddenHtml != null){
        addToCartHTML += rtnVal.CountHiddenHtml.toString();
      }
      addToCartHTML += '</li></ul>';
      momoj('#prdTypeArea').html(addToCartHTML);
      chkErr = "false";
      if(rtnVal.BuyYN == "0"){
        momoj(".prdTypeArea ul li .buyBtn").css({"background-color": "#B0B0B0"});
        momoj(".prdTypeArea > ul > li").hover(
          function(){
            momoj(this).css({borderColor: "#B0B0B0"});
          }
        );
      }
    },
    error : function(xhr, status, error) {
      chkErr = "true";
      alert(momoj.unicode2Str('&#36039;&#26009;&#26377;&#35492;&#65292;&#31995;&#32113;&#24537;&#30860;&#20013;&#65281;'));
      return;
    }
  });
  if(chkErr == "false"){
    momoj(".fancybox-overlay").css({"height":(momoj(document.body).height()), "width":(momoj(document.body).width())}).fadeTo("slow",0.5);
    momoj(".prdTypeArea").css({"left":(momoj("html")[0].clientWidth/2)-(momoj(".prdTypeArea").width()),"top":momoj(".prdTypeArea").offset().top+20 }).show();
    momoj(".prdTypeArea ul li").css({"height":momoj(".prdTypeArea").innerHeight()-20 });
    momoj(".prdTypeArea p").delegate("a","click",function(){
      momoj(".fancybox-overlay, .prdTypeArea").hide();
    });
  }
}
function submitGoodsDetailForm(goods_code,state){
  var _allCnt = 0;
  var f = document.dCodeFrm;
  var order_method = 'front';
  if (f.goodsdt_code.value == '0') {
    alert(momoj.unicode2Str('&#35531;&#36984;&#25799;&#29986;&#21697;&#35215;&#26684;&#65281;'));
    return false;
  }
  if (goods_code != '') {
    momoj.ajax({
      async : false,
      url : "/servlet/CartServlet?order_method=cateCart&status=status_1",
      cache : false,
      type : 'POST',
      data : momoj("#dCodeFrm").serialize(),
      dataType : 'json',
      success : function(rtnVal) {
        momoj(".fancybox-overlay, .prdTypeArea").hide();
        alert(momoj.unicode2Str('&#21152;&#20837;&#36092;&#29289;&#36554;&#25104;&#21151;&#65281;'));
        loadSPCart();
      },
      error : function(xhr, status, error) {
        if(xhr.responseText.toString() == "ok"){
          momoj(".fancybox-overlay, .prdTypeArea").hide();
          alert(momoj.unicode2Str('&#21152;&#20837;&#36092;&#29289;&#36554;&#25104;&#21151;&#65281;'));
          loadSPCart();
        }
        else{
          alert(momoj.unicode2Str('&#36039;&#26009;&#26377;&#35492;&#65292;&#31995;&#32113;&#24537;&#30860;&#20013;&#65281;'));
          return;
        }
      }
    });
  }
}
function OrderProcessCate(work, goods_code, status) {
  var f = document.dCodeFrm;
  if (f.sale_price.value <= 0) {
    alert('商品異常，請聯絡客服人員');
    return ;
  }
  if (momoj("#goodsdt_code option:selected").val() == '0') {
    alert('請選擇商品種類');
    return;
  }
  f.work.value = '';
  if (f.dely_work.length > 1) {
    var delychked = true;
    for (var vr = 0; vr < f.dely_work.length; vr++) {
      if (f.dely_work[vr].checked) {
        f.work.value = f.dely_work[vr].value;
        delychked = false;
      }
    }
    if (delychked) {
      alert(momoj.unicode2Str('&#27794;&#26377;&#21246;&#36984;'));
      return;
    }
  } else {
    if (!f.dely_work.checked) {
      alert(momoj.unicode2Str('&#27794;&#26377;&#21246;&#36984;'));
      return;
    } else {
      f.work.value = f.dely_work.value;
    }
  }
  submitGoodsDetailForm(goods_code, status);
}
function changeSaleCount(){
  var goodsDtCode = document.getElementById('goodsdt_code').value;
  var goodsDtCount = document.getElementById('goodsDtCount_' + goodsDtCode).value;
  if (goodsDtCount != 0) {
    if (goodsDtCount > 20) {
      goodsDtCount = 20;
    }
    momoj("#count").val("1");
    momoj('#MaxCanBuy').val(goodsDtCount);
  }
  else{
    momoj("#count").val("");
  }
}
function checkGoodsDtCodeSelectHave(obj){
  var goodsCode = document.getElementById('goods_code').value;
  if (obj != null) {
    if (obj.length > 1) {
      if (momoj("#goodsdt_code option:selected").text().indexOf('(已售完)') >= 0) {
        momoj("#spnBuy").html('<a class="buyBtn" href="javascript:void(0);" >&#32570;&#36008;&#35036;&#36008;&#20013;</a>');
        momoj(".prdTypeArea ul li .buyBtn").css({"background-color": "#B0B0B0"});
        momoj(".prdTypeArea > ul > li").hover(
          function(){
            momoj(this).css({borderColor: "#B0B0B0"});
          }
        );
      }
      else{
        momoj("#spnBuy").html('<a class="buyBtn" href="javascript:void(0);" onclick="OrderProcessCate(\'cart\', \''+ goodsCode +'\'); return false;">&#36984;&#36092;</a>');
      }
    }
  }
}
//for category add to cart