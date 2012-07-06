(function () {
    "use strict";

    var MAXSTR = 55;

    var monthNumberOf = {
        'Jan': '01',
        'Feb': '02',
        'Mar': '03',
        'Apr': '04',
        'May': '05',
        'Jun': '06',
        'Jul': '07',
        'Aug': '08',
        'Sep': '09',
        'Oct': '10',
        'Nov': '11',
        'Dec': '12'
    };
    var keyFor = {
        'Jan': '12',
        'Feb': '11',
        'Mar': '10',
        'Apr': '09',
        'May': '08',
        'Jun': '07',
        'Jul': '06',
        'Aug': '05',
        'Sep': '04',
        'Oct': '03',
        'Nov': '02',
        'Dec': '01'
    };

    var frenchFor = {
        'Jan': 'Janvier',
        'Feb': 'Février',
        'Mar': 'Mars',
        'Apr': 'Avril',
        'May': 'Mai',
        'Jun': 'Juin',
        'Jul': 'Juillet',
        'Aug': 'Août',
        'Sep': 'Septembre',
        'Oct': 'Octobre',
        'Nov': 'Novembre',
        'Dec': 'Décembre'
    };

    function groupKeySelector(item) {
        return item.group.key;
    }

    function groupDataSelector(item) {
        return item.group;
    }

    var articlesList = new WinJS.Binding.List();
    var groupedItems = articlesList.createGrouped(groupKeySelector, groupDataSelector);

    //WinJS.xhr({ url: infos.Media }).then(function (rss) { Pour les infos sur internet
    WinJS.xhr({ url: infos.PagesMockLocales + "rss-pour-ipad-2588.xml" }).then(function (rss) {
        var test = infos.PagesMockLocales + "rss-pour-ipad-2588.xml";
        var items = rss.responseXML.selectNodes("//item");
        var lastgroup = -1;

        for (var n = 0; n < items.length; n++) {
            var article = {};

            var fulldate = items[n].selectSingleNode('pubDate').text.split(' ');
            article.date = fulldate[1] + '/' + monthNumberOf[fulldate[2]] + '/' + fulldate[3];
            var now = new Date();
            var keyRoot = now.getFullYear()*100 + now.getMonth()+1

            var test = (n - (n % 5)) / 5;
            article.group = {
                key:keyRoot -  parseInt( (fulldate[3] +monthNumberOf[fulldate[2]] )),
                label: (frenchFor[fulldate[2]] + ' ' + fulldate[3])
            };

            article.displaygroup = 'none';
            article.displayitem = 'block';

            if (lastgroup != article.group.key) {
                lastgroup = article.group.key;
                articlesList.push({
                    grouplabel: article.group.label,
                    group: article.group,
                    displaygroup: 'block',
                    displayitem : 'none'
                });
            }

            article.fulltitle = items[n].selectSingleNode("title").text
            if (article.fulltitle.length > MAXSTR) {
                article.title = article.fulltitle.substring(0, MAXSTR - 2) + '...';
            } else {
                article.title = article.fulltitle;
            }

            var thumbs = items[n].selectNodes("media:thumbnail");
            if (thumbs.length > 1) {
                article.thumbnail = thumbs[1].attributes.getNamedItem("url").text;
            } else {
                article.thumbmail = '';
            }
            article.content = items[n].selectSingleNode('content:encoded').text;
            articlesList.push(article);
        }
        
    });

    WinJS.Namespace.define("data", {
        MediaList: groupedItems
    });
})();