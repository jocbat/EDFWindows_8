(function () {


    WinJS.xhr({ url: infos.Stock }).then(function (rss) {


        var items = rss.responseXML.selectNodes("//Cloture")
        var date = new Date(items[0].attributes[0].value)
        var d = date.getUTCDate()
        var m = date.getUTCMonth()
        var y = date.getUTCFullYear()
        var val = items[0].text
       
    //    var itemsArray = new Array()
    //    for (var n = 0; n < items.length; n++) {
    //        //itemsArray.push();
    //    }
    });





})();