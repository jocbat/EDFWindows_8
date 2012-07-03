(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    
    ui.Pages.define("/pages/frontpage.html", {
        /*
            
        itemInvoked: function (eventObject) {
            if (appView.value === appViewState.snapped) {
                // If the page is snapped, the user invoked a group.
                //var group = data.groups.getAt(eventObject.detail.itemIndex);
                //nav.navigate("/html/groupDetailPage.html", { group: group }); 
            } else {
                // If the page is not snapped, the user invoked an item.
                //var item = data.items.getAt(eventObject.detail.itemIndex);
                //nav.navigate("/html/itemDetailPage.html", { item: item });
            }
        },
        */


        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            this.updateLayout(element, appView.value);
        },
        
        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState) {
            
            data.FrontPageImages.forEach(function (item) {
                var jqtemp = $('.FrontImageTemplate div:first-child').clone();
                //jqtemp.css('background', 'url(' + item.url+ ') 100% 40%');
                jqtemp.css('background', 'url('  + item.portrait + ') 100% 40%');

                //var test = infos.Root + '/' + item.portrait;


                jqtemp.appendTo($('.FrontImagesListView'));
            });
            //alert($('.FrontImagesListView').html());(

            data.FrontPageItems.forEach(function (item) {
                var jqtemp = $('.FrontItemTemplate div:first-child').clone();
                jqtemp.children('.date').html(item.date);
                jqtemp.children('.itemSubject').html(item.chapeau);
                jqtemp.children('.itemContent').html(item.content);
                jqtemp.children('.itemImg').attr('src', item.urlimage);
                var test = infos.Root + item.urlimage;
                jqtemp.appendTo($('.FrontItemsListView'));
            });

            var elts = document.getElementById('DisplayedContent');
            WinJS.UI.Animation.enterPage(elts);
        },
    });
})();