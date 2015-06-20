// YWA instrumentation on MOMO TW
// Created on: 2014/11/03
// Last edit: 2015/04/16 (final review and clean up)

if (location.protocol == "https:") {
    document.write("<script type='text/javascript' src='https://s.yimg.com/mi/apac/ywa.js'></script>");
    document.write("<script type='text/javascript' src='https://s.yimg.com/wi/ytc.js'></script>");
}
else {
    document.write("<script type='text/javascript' src='http://d.yimg.com/mi/apac/ywa.js'></script>");
    document.write("<script type='text/javascript' src='http://d.yimg.com/wi/ytc.js'></script>");
}

var g_YWA_funcs = {
    proj : {pid: "1000308214985", region: "APAC", name: "MOMO"}
    ,
    CF : {
        TagList: 9,
        ItemCode: 17,
        ErrorMessage: 28
    }
    ,
    actions: {
        BillingConf: "01",
        ProductDrop: "02",
        MemberPage: "03",
        MemberConf: "04",
        ErrorLog: "14"
    }
    ,
    logErrors: function(message)
    {
        try{
            var YWATracker = g_YWA_funcs.getTracker();
            YWATracker.setCF(g_YWA_funcs.CF.ErrorMessage, message);
            YWATracker.setAction(g_YWA_funcs.actions.ErrorLog);
            YWATracker.submit_action();
        }catch(e){
            if (window.console && window.console.warn) {
                window.console.warn(e.message || "Unknown error");
            }
            return;
        }
    }
    ,
    getTracker : function()
    {
        try {
            return YWA.getTracker(g_YWA_funcs.proj.pid, g_YWA_funcs.proj.region);
        } catch (eYWATCUnavailable) {
            if (window.console && window.console.warn) {
                window.console.warn(eYWATCUnavailable.message || "Unknown error");
                return;
            }
        }
    }
    ,
    doYCP: function (pixType)
    {
        try{
            var typeToID = {
                "ProdPage": "e889lksd"
            };
            var YCP = new Image(),
                base_url = "https://s-pm-ap.dp.yahoo.com/PixelMonkey?pixelId=" + typeToID[pixType] + "&format=image&useReferrer=1";//&additionalParams=";
            YCP.src = base_url;
        }catch(e){
            g_YWA_funcs.logErrors("doYCP(): " + e.message + " #" + e.lineNumber);
        }
    }
    ,
    doYWA : function()
    {
        try{
            var YWATracker = g_YWA_funcs.getTracker();
            YWATracker.submit();
            if(location.pathname.toLowerCase().indexOf("category.jsp") !== -1 || location.pathname.toLowerCase().indexOf("goodsdetail.jsp") !== -1){
                g_YWA_funcs.doYCP("ProdPage");
            }
            YAHOO.ywa.I13N.fireBeacon([
                {
                "projectId" : "10001478849832",
                "coloId" : "SP",
                "properties" : {
                    "pixelId" : "19798",
                    "qstrings" : {
                        "pageURL" : encodeURIComponent(document.URL)
                    }
                }
                }
            ]);
        }catch(e){
            g_YWA_funcs.logErrors("doYWA(): " + e.message + " #" + e.lineNumber);
        }
    }
    ,
    doAddToCart: function (productId)
    {
        try{
            var YWATracker = g_YWA_funcs.getTracker();
            YWATracker.setAction("ADD_TO_CART");
            YWATracker.setSKU(productId);
            YWATracker.setCF(g_YWA_funcs.CF.ItemCode, productId);
            YWATracker.submit_action();
        }catch(e){
            g_YWA_funcs.logErrors("doAddToCart(): " + e.message + " #" + e.lineNumber);
        }
    }
    ,
    doProductDrop: function (productId) {
        try{
            var YWATracker = g_YWA_funcs.getTracker();
            YWATracker.setSKU(productId);
            YWATracker.setCF(g_YWA_funcs.CF.ItemCode, productId);
            YWATracker.setAction(g_YWA_funcs.actions.ProductDrop);
            YWATracker.submit_action();
        }catch(e){
            g_YWA_funcs.logErrors("doProductDrop(): " + e.message + " #" + e.lineNumber);
        }
    }
    ,
    doBillingConfirm: function (orderId, productList, units, amounts, totalAmount)
    {
        try{
            var unit_arr = (units)? units.split(";") : [];
            var totalUnit = 0;
            for(var i in unit_arr){
                totalUnit += parseInt(unit_arr[i],10) || 0;
            }
            var avg_rev = 0;
            if(totalUnit !== 0){
                avg_rev = parseInt(totalAmount,10) / totalUnit;
            }
            var YWATracker = g_YWA_funcs.getTracker();
            YWATracker.setAction(g_YWA_funcs.actions.BillingConf);
            if (orderId)
                YWATracker.setOrderId(orderId);
            if (productList) {
                YWATracker.setSKU(productList);
            }
            if (units){
                YWATracker.setUnits(units);
            }
            if (amounts) {
                YWATracker.setAmounts(amounts);
            }
            if (totalAmount) {
                totalAmount = "TWD" + totalAmount;
                YWATracker.setAmount(totalAmount);
            }
            YWATracker.submit_action();
            YAHOO.ywa.I13N.fireBeacon([
                {
                "projectId" : "10001478849832",
                "coloId" : "SP",
                "properties" : {
                    "pixelId" : "19799",
                    "qstrings" : {
                        "units" : totalUnit,
                        "avgRev" : avg_rev
                    }
                }
                }
            ]);
        }catch(e){
            g_YWA_funcs.logErrors("doBillingConfirm(): " + e.message + " #" + e.lineNumber);
        }
    }
};