var itritool = {
	/** a function to retrieve cookie value for itri log**/
	getcookie: function (name){
		theCookie=document.cookie+";";
		name+= "=";
		start=theCookie.indexOf(name);
		if(start!=-1){
			end=theCookie.indexOf(";",start);
			return (theCookie.substring(start+name.length,end));
		}else{
			return "";
		}
	}
};

var itrilog = {
	itri_conf : {
	"consoLog": false,	
	"apiurl":"",
	"uid":"uid",
	"page_type":"",
	"action":"",
	"locat_top_host":"host",
	"url":"url",
	"param":"param",
	"referer":"referer",
	"categ_code":"categ_code",
	"gid":"gid",
	"recomdf":"",
	"cc_session":"cc_session",
	"cc_guid":"cc_guid",
	"browser":"browser",
	"device":"device",
	"shbutton":"",
	"rating":"",
	"coords_lon":"coords_lon",
	"coords_lat":"coords_lat",
	"web":"web",
	"optional":"optional"
	
	},
	itri_data : new Object(),
	
	setConsoleLog : function(str){
		this.itri_conf.consoLog = str; 
	},
	setApiUrl : function(str){
		this.itri_conf.apiurl = str; 
	},
	setUid: function(str){
		this.itri_data[this.itri_conf.uid] = str; 
	},
	setPagetype: function(str){
		this.itri_data[this.itri_conf.page_type] = str;
	},
	setAction : function(str){
		this.itri_data[this.itri_conf.action] = str;
	},
	setLHost : function(str){
		this.itri_data[this.itri_conf.locat_top_host] = str;
	},
	setURL : function(str){
		this.itri_data[this.itri_conf.url] = str;
	},
	setParam : function(str){
		this.itri_data[this.itri_conf.param] = str;
	},
	setReferer : function(str){
		this.itri_data[this.itri_conf.referer] = str;
	},
	setCategory : function(str){
		this.itri_data[this.itri_conf.categ_code] = str;
	},
	setGid : function(str){
		this.itri_data[this.itri_conf.gid] = str;
	},
	setRecomdf : function(str){
		this.itri_data[this.itri_conf.recomdf] = str;
	},
	setSession : function(str){
		this.itri_data[this.itri_conf.cc_session] = str;
	},
	getSession : function(){
		if(this.itri_data[this.itri_conf.cc_session] === undefined)
			return false;
		else
			return this.itri_data[this.itri_conf.cc_session];
	},
	setGuid : function(str){
		this.itri_data[this.itri_conf.cc_guid] = str;
	},
	setBrowser : function(str){
		this.itri_data[this.itri_conf.browser] = str;
	},
	setDevice : function(str){
		this.itri_data[this.itri_conf.device] = str;
	},
	setShareChannel : function(str){
		this.itri_data[this.itri_conf.shbutton] = str;
	},
	setRate : function(str){
		this.itri_data[this.itri_conf.rating] = str;
	},
	setGeoLon : function(str){
		this.itri_data[this.itri_conf.coords_lon] = str;
	},
	setGeolat : function(str){
		this.itri_data[this.itri_conf.coords_lat] = str;
	},
	setWeb : function(str){
		this.itri_data[this.itri_conf.web] = str;
	},
	setOptionJson : function(str){
		this.itri_data[this.itri_conf.optional] = str;
	},
	setCustomerlization : function(_k,_v){
		this.itri_data[_k] = _v;
	},	
	getlogdata: function(){
		try{
			var itri_para=location.search;
			var opt_str=""
			/**itri log flag for monitoring**/
			/*var imsg = (itri_guid == "" || itri_session == "" || itri_j == "")?"x":"o";
				
			itri_para += (itri_para.length >0) ?"&":"";
			itri_para += ("isitri="+imsg);*/
			
			/**is iframe  noted**/
			var wtl = top.location.href;
			if (wtl != location.href){
				/*itri_para += (itri_para.length >0) ?"&":"";
				itri_para += ("iiframe=1");*/
				opt_str += 'isIframe=1';				
			}
			
			this.setParam(itri_para);
			this.setURL(location.pathname);
			
			/** check agent **/
			var nVer = navigator.appVersion;
			var nAgt = navigator.userAgent;
			var itri_browser  = navigator.appName;
			var fullVersion  = ''+parseFloat(navigator.appVersion); 
			var majorVersion = parseInt(navigator.appVersion,10);
			var nameOffset,verOffset;

			// In Opera, the true version is after "Opera" or after "Version"
			if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
				itri_browser = "Opera";
				fullVersion = nAgt.substring(verOffset+6);
			if ((verOffset=nAgt.indexOf("Version"))!=-1) 
				fullVersion = nAgt.substring(verOffset+8);
			}
			// In MSIE, the true version is after "MSIE" in userAgent
			else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
				itri_browser = "Microsoft Internet Explorer";
				fullVersion = nAgt.substring(verOffset+5);
			}
			// In Chrome, the true version is after "Chrome" 
			else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
				itri_browser = "Chrome";
				fullVersion = nAgt.substring(verOffset+7);
			}
			// In Safari, the true version is after "Safari" or after "Version" 
			else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
				itri_browser = "Safari";
				fullVersion = nAgt.substring(verOffset+7);
				if ((verOffset=nAgt.indexOf("Version"))!=-1) 
					fullVersion = nAgt.substring(verOffset+8);
			}
			// In Firefox, the true version is after "Firefox" 
			else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
				itri_browser = "Firefox";
				fullVersion = nAgt.substring(verOffset+8);
			}
			// In most other browsers, "name/version" is at the end of userAgent 
			else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < (verOffset=nAgt.lastIndexOf('/')) ) 
			{
				itri_browser = nAgt.substring(nameOffset,verOffset);
				fullVersion = nAgt.substring(verOffset+1);
				if (itri_browser.toLowerCase()==itri_browser.toUpperCase()) {
					itri_browser = navigator.appName;
				}
			}
			
			this.setBrowser(itri_browser);
			this.setLHost(top.location.host);
			this.setReferer(document.referrer);
			this.setOptionJson(opt_str);
			/**Start to check Customer Setting**/
			if(!this.getSession()){
				if(this.itri_conf.consoLog)
					console.log("ITRI Log - session is undefined");
				return false;
			}
			
			if(this.itri_conf.consoLog){
				console.log("ITRI Log - ");
				console.dir(this.itri_data);
			}
			
			return true;
		} catch(err){
			if(this.itri_conf.consoLog)
				console.log("ITRI Log - "+err);
			return false;
		}
	},
	senditri: function (){
		momoj.ajax({
			async:true,
			url: this.itri_conf.apiurl,
			data: this.itri_data,
			type:'POST',
			contentType:"application/x-www-form-urlencoded; charset=UTF-8"
		});
		return true;
	}
};

/**open console log**/
itrilog.setConsoleLog(false);

/** retrieve icode and area **/
var itri_area="";
var itri_icode="";
var itri_url=window.location.toString();
var str="";
if(itri_url.indexOf("?")!=-1){ 
	var ary=itri_url.split("?")[1].split("&");
	for(var i in ary){
		if (ary[i].split("=")[0]=="i_code"){
			itri_icode=ary[i].split("=")[1];
		}
		if (ary[i].split("=")[0]=="Area"){
			itri_area=ary[i].split("=")[1];
		} 
	}
}

/**page reg.**/
var itri_devp = 0;
var itri_jse = itritool.getcookie("JSESSIONID");
switch (location.host){
	case "www.momoshop.com.tw" :
		itri_devp = 1;
		itri_jse = (itri_jse.indexOf("servlet_mom") != -1) ? itri_jse.substring(itri_jse.indexOf("servlet_mom")+11) : "999n";			 
	break;
	
	case "m.momoshop.com.tw" :
		itri_devp = (itritool.getcookie("showTB") == "0") ? 3: 2;
		itri_jse = (itri_jse.indexOf("mobileap") != -1) ? itri_jse.substring(itri_jse.indexOf("mobileap")+8) : "999n";
	break;
	
	default:
		itri_devp = 0;
	break;
};

/**customer setting**/
itrilog.setWeb( itri_jse );
itrilog.setUid(itritool.getcookie("ccmedia"));
itrilog.setGuid(itritool.getcookie("ccguid"));
itrilog.setSession(itritool.getcookie("ccsession"));
itrilog.setCategory(itritool.getcookie("l_code"));
itrilog.setDevice(itri_devp);
itrilog.setGid(itri_icode);
itrilog.setCustomerlization("area",itri_area);


var itri_msg;
if(itrilog.getlogdata()){
	itrilog.setApiUrl("/itri/api/log/logapi");
	itri_msg = itrilog.senditri();
}
