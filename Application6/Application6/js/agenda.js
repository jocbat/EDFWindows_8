(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;


    ui.Pages.define("/pages/agenda.html", {
        

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {

            this.updateLayout(element, appView.value);
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState) {

            agendaCanvasManager(data.Events, 'agendaDisplay','agendaDetails')
        },
    });
})();