(function($) {

$.fn.MoMu2013=function(settings){
  var container=$(this);
  if ( container.length >1 ) {
    container.each(function(){
      $(this).MoMu2013(settings);
    });
    return false;
  } 
  var _defaultSettings = {        
    scrWidth:980,
    lbt:'#bt_0_layout_b257',
    subMnId:'bt_0_197_',  
    liHeight:24,
    liWidth:131
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
  
  _lbt
    .delegate('.subMenu2013','hover',function(e){
      var _subMenu=$(this);
      var _menuID=_subMenu.attr('id').replace(_settings.subMnId,'');
      
      if(_subMenu.attr('id')=='bt_0_059_01'){
          _menuID='21';   
        }      
      if(e.type==='mouseover'){        
        if(_subMenu.attr('id')=='bt_0_059_01'){
          $("#bt_0_layout_b257 #bt_0_059_01 .TabContent").height($("#bt_0_layout_b257 #bt_0_059_01 .TabMenu").height());
        }
      
        if(_menuID==22 || _menuID==24 || _menuID==30){
          $(this).parents("#bt_0_layout_b257").addClass("gray");
        }  
        
        _subMenu.data('Show',1);
        _subMenu.show();
        $('#C'+_menuID).addClass('BGO');
        $('#C'+_menuID+' a').addClass('BGO');
              
        $('.toothCode').each(function(){
            var _toothId=$(this);
            if(_toothId.text()==_menuID){            
                _toothId.parent('.ContentD').addClass('BGO');
            }
        });
                
      }else{
       
        _subMenu.data('Show',0);
        _subMenu.hide();
        $('#C'+_menuID).removeClass('BGO');
        $('#C'+_menuID+' a').removeClass('BGO');
        
        $('.toothCode').each(function(){
            var _toothId=$(this);
            if(_toothId.text()==_menuID){            
                _toothId.parent('.ContentD').removeClass('BGO');
            }
        });
        
         if(_menuID!=22 ||_menuID!=24|| _menuID!=30){
           $('#bt_0_layout_b257').removeClass('gray');
        }
      }
    })
  ;
  container
    .delegate('.MoMoDDMHead','hover',function(e){
         
      if(e.type==='mouseover'){
        _lbt.find('.subMenu2013,#bt_0_059_01').hide();
        var _head=$(this); 
        _head.addClass('BGO');
        $('a',_head).addClass('BGO');
        // cale subMenu position
        var _x=0;
        var _y=0;
        var _POS=_head.position();
        _x=_POS.left;
        _y=_POS.top+_head.height()-2;
        var _subBtId=_settings.subMnId+_head.attr('id').replace('C','');
        var _subMenu=$('#'+_subBtId);
        
        if(_head.attr('id')=='C21'){
          _subBtId='bt_0_059_01';
          _subMenu=$('#'+_subBtId);    
        }
    
        ResortMenu(_subMenu,_subBtId);
     

      
        var _menuWidth=_subMenu.outerWidth();//menu totalwidth
        
        if(_menuWidth+_x > _settings.scrWidth){
          _x=_settings.scrWidth-_menuWidth;
        }    
        _subMenu
          .css({left:_x,top:_y})
          .show()
          
        ;
      }else{
        var _head=$(this);
        _head.removeClass('BGO');
        $('a',_head).removeClass('BGO');
        $("#bt_0_layout_b257").removeClass("gray");
        var _subBtId=_settings.subMnId+_head.attr('id').replace('C','');
        if(_head.attr('id')=='C21'){
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
  ;
  
  // deal subMenu END

  var ResortMenu=function(_subMenu,_subBtId){
              
       if(typeof _subMenu.data('menuInit')=='undefined'){        
             //add gray
             if(_subBtId.replace('bt_0_197_','')=='30'|| _subBtId.replace('bt_0_197_','')=='24'|| _subBtId.replace('bt_0_197_','')=='22'){
                _subMenu.addClass('gray');
                _subMenu.find('.topArea').addClass('gray');
                _subMenu.find('.bottomArea').addClass('gray');
             }
             
              var _rowLen=8;
              var _subMenuWidth=0;
              var _calWidth=0; 
             //make rule to change row             
             if(_subMenu.find('#'+_subBtId+'_e9').text()!='' || _subMenu.find('#'+_subBtId+'_e9').text()!='&nbsp;'){  
                if(parseInt(_subMenu.find('#'+_subBtId+'_e9').text(),10)){               
                  _rowLen=parseInt(_subMenu.find('#'+_subBtId+'_e9').text(),10);
                }             
             }
            
             if(_subBtId=='bt_0_059_01'){
                  _rowLen=11;
             }
             _subMenu.find('.topmenu').each(function(){
                var _topMenu=$(this);                               
                if(momoj.trim(_topMenu.find('h3').text()) == ''){
                  _topMenu.hide();                 
                }else{                    
                  
                    var _ul = _topMenu.find('ul');
                    var _lis=_ul.find('li');
                    var _liColsTop=_calCols(_lis.length,_rowLen);//cal col 
                    var _topmenuWidth=_settings.liWidth  *_liColsTop.cols-(_liColsTop.cols-1)*2;//cal width
                    var _ulHeight=((_rowLen+1)*_settings.liHeight)+15; //cal height
                    if(_subBtId=='bt_0_059_01'){
                      _topmenuWidth = _topmenuWidth+(_liColsTop.cols*7)+10;
                    }                    
                    _topMenu.css({width:_topmenuWidth+'px',height:_ulHeight});
                    _ul.empty();
                    
                    
                    var _liCols=_liColsTop.cols;         
                    
                    if(_subBtId=='bt_0_059_01'){
                      _ul.css({width:_topmenuWidth-10});
                      /*if(_liCols>2){
                        _ul.css({width:_topmenuWidth+21});
                      }*/
                    }
                    /*resort li start*/
                    for(var i=0;i<_rowLen;i++){
                       var _liElm=$(_lis[i]); 
                       _liElm.width(_settings.liWidth);
                       var _aElm=$('a',_liElm);
                      _aElm.css({width:_settings.liWidth  -10});
                      _ul.append(_lis[i]);
                      
                      for(var j=1;j<_liCols;j++){
                        var _liElm=momoj(_lis[i+j*_rowLen]);
                        _liElm.css({width:_settings.liWidth  -2});
                        var _aElm=momoj('a',_liElm);
                        _aElm.css({width:_settings.liWidth  -10});
                        _ul.append(_lis[i+j*_rowLen]);            
                      }
                    
                      if(i+1==_liColsTop.mod){
                        _liCols--;
                      }
                            
                   }                    
                   /*resort li end*/    
                   if(_subBtId!='bt_0_059_01'){
                    _calWidth++;
                    _subMenuWidth+=_topmenuWidth;
                    _subMenu.css({width:_subMenuWidth+(_calWidth-1)});
                   }
                   
                }                
                
                
              });
          
           _subMenu.data('menuInit','1');//when you first time come
     }     
		   _subMenu.data('Show',0); 
           return _subMenu;  
  }
  
  // deal bt_0_110_01 show bt_0_143 menu  
  if(document.location.href.indexOf('/main/Main.jsp')>-1){    
     
    $('#bt_0_110_01').delegate('.ContentD','hover',function(e){
        if(e.type==='mouseover'){
          $('.subMenu2013',_lbt).hide();
          var _ml=$(this);		  		  
          _ml.addClass('BGO');
          // cale subMenu position
          var _x=0;
          var _y=0;
          var _POS=_ml.position();
          
          _x=_POS.left+_ml.width();
          _y=_POS.top+_ml.height()+400;
          var _subBtId=_settings.subMnId+$('.toothCode',_ml).text();		  		  
          var _subMenu=$('#'+_subBtId);
          
          ResortMenu(_subMenu,_subBtId);
          
          var _menuWidth=_subMenu.outerWidth();
          if(_menuWidth+_x > _settings.scrWidth){
            _x=_settings.scrWidth-_menuWidth;
          }
          
          var _menuHeight=_POS.top+_ml.height()+500+_subMenu.outerHeight();
          var _sT=$(document).scrollTop();
          var _wHeight=$(window).height();
            
          if(_menuHeight-_sT>_wHeight+10){              
            _y=_wHeight-_ml.height()-_subMenu.outerHeight()-120+_sT;
          }
          
                 
          _subMenu
            .css({left:_x,top:_y})
            .show()
           
          ;
        }else{
          var _ml=$(this);
          _ml.removeClass('BGO');
          var _subBtId=_settings.subMnId+$('.toothCode',_ml).text();
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
  
  //deal real category     
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
  //alert(_settings.html());   
  //deal bt_2_026_01 lgrpcategory contentArea 2011/10/20  
  var _bt_0_142=function(){
    // deal Relation Category Area
    var bt_0_142_01_html = $([                            
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
	
	var _liPush = '<li id="liPush" class="cateM BTDME">館長推薦</li>';      
    var _liTop30 = '<li id="top30" class="cateS BTDME">'+
                   '<a id="top30" href="/category/LgrpCategory.jsp?l_code='+_l_code+'&TOP30=Y" style="">本館熱銷TOP30</a>' +
                   '</li>';
    var _liNew = '<li id="newOfWeek" class="cateS BTDME">'+
                   '<a id="newOfWeek" href="/category/LgrpCategory.jsp?l_code='+_l_code+'&NEW=Y&flag=L" style="">本週新品</a>' +
                   '</li>';
    var _liSale = '<li id="superBigSale" class="cateS BTDME">'+
                   '<a id="superBigSale" href="/category/LgrpCategory.jsp?l_code='+_l_code+'&SALE=Y&flag=L" style="">本週新降價</a>' +
                   '</li>';
    var _liCPHot = '<li id="superBigSale" class="cateS BTDME">'+
                   '<a id="superBigSale" href="/category/LgrpCategory.jsp?l_code='+_l_code+'&CPHOT=Y&flag=L" style="">折價券熱銷</a>' +
                   '</li>';

    $('#bt_category_Content ul',bt_0_142_01_html).append(_liPush).append(_liTop30).append(_liNew).append(_liSale).append(_liCPHot);
	
	$('#'+_settings.subMnId+_FTOOTH+' .topArea .topmenu').each(function(){    	
	  var _realTitle="";   			
	  try{	    
	    _realTitle=$.trim($('h3',this).text());   			
	  }catch(err){
	  }
	  if(_realTitle!=''){
	    var _titleLi = '<li id="lic" class="cateM BTDME">'+_realTitle+'</li>';
	    $('#bt_category_Content ul',bt_0_142_01_html).append(_titleLi);
	  }
	  $('ul li',this).each(function(){
	    var _li = $(this).clone();
        if($.trim(_li.text())!=''){
          _li.addClass('cateS').attr('style','').css({width:'194px'});
          $('a',_li).attr('style','').css({width:'164px'}).text($('span',_li).text());		
          $('#bt_category_Content ul',bt_0_142_01_html).append(_li);  
        }        
	  });    
    }); 
    
	//title
    $('#bt_category_e1',bt_0_142_01_html).attr('href','/category/LgrpCategory.jsp?l_code='+_l_code);
    $('#bt_category_e1',bt_0_142_01_html).text($('#C'+_FTOOTH+' a').text());
    $('.titleImg','#bt_2_026_01').hide();     
    $('.contentArea','#bt_2_026_01').hide();
    $('#bt_2_layout_b2').attr('class','');
    $('#bt_2_layout_b2').append(bt_0_142_01_html);  
  }
  
  
  var _bt_0_103 = function(){
    var _select = $('#p_lgrpCode');    
    var _cur_sel_l_code = _l_code;          
    var l_selected = _cur_sel_l_code.substring(2,5)=='999' ? " selected" : "";
    _select.empty();
    _select.append('<option value="">全商品分類</option>');
    _select.append('<option value="'+_l_code.substring(0,2)+'00000000" ' + l_selected + '>'+$('#C'+_FTOOTH+' a').text()+'總覽</option>');    
   	$('#'+_settings.subMnId+_FTOOTH+' .topArea .topmenu').each(function(){    		  
	  $('ul li',this).each(function(){
	    var _li = $(this).clone();	    		
		var _select_text = _li.text();		
        var _select_lcode = get_form($('a',_li).attr('href'),'l_code');
		var _selected= _select_lcode == _cur_sel_l_code ? " selected" : "";        
        $('a',_li).attr('style','').css({width:'auto'});
        _select.append('<option value="'+_select_lcode+'"'+_selected+'>'+_select_text+'</option>');
	  });    
    });
  }   
  
  //deal subNav
  var _subNav=function(){           
	$('#'+_settings.subMnId+_FTOOTH+' .topArea .topmenu').each(function(){    		  
	  $('ul li',this).each(function(){      
	    var _li = $(this).clone();        
        if(momoj.trim(_li.text())){
          _li.attr('class','').css('width','auto');
          $('a',_li).attr('style','').css({width:'auto'});		
          var _liSubNavLCode=get_form($('a',_li).attr('href'),'l_code');
          if (_l_code !='' && _l_code==_liSubNavLCode ){
            _li.addClass('selected');
          }		
          $('#subnav ul').append(_li);
        }
	  });    
    }); 
  }
  
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
  
  // deal tooth
  var _toothName=' &gt; '+$('#C'+_FTOOTH).html();
  $('.TabMenu ul li',container).removeClass('selected');
  if(_FTOOTH!='' && (document.location.href.indexOf('/goods/')>-1||document.location.href.indexOf('/category/')>-1)){
    var _tooth_code='ft'+_FTOOTH;
    // 館首(任選), 小分類頁, 紅綠配, 商品頁
    momoj('.bt_2_layout,.bt_4_layout,#Dgrp_BodyBigTableBase,#BodyBigTableBase,#container').addClass(_tooth_code);
    _lbt.addClass(_tooth_code);
    $('#C'+_FTOOTH).addClass('selected');
    
    // deal subnav menu	
	$('#Dgrp_BodyBigTableBase,#BodyBigTableBase').addClass('bt_2_layout');
    $('.bt_2_layout').prepend('<div id="subnav"><ul></ul></div>');
    _subNav();
    // deal subnav menu end            
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
      _bt_0_142();         
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
          
  return container;
}

})(jQuery);
