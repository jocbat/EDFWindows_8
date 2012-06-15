(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var binding = WinJS.Binding;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    ui.Pages.define("/pages/medias.html", {

        groupDataSelector: function (item) {
            return item.group;
        },

        // This function is used in updateLayout to select an item's group key.
        groupKeySelector: function (item) {
            return item.group.key;
        },

        // This function checks if the list and details columns should be displayed
        // on separate pages instead of side-by-side.
        isSingleColumn: function () {
            var viewState = Windows.UI.ViewManagement.ApplicationView.value;
            return (viewState === appViewState.snapped || viewState === appViewState.fullScreenPortrait);
        },

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // Store information about the group and selection that this page will
            // display.
            //this.group = (options && options.group) ? options.group : data.groups.getAt(0);
            //this.items = data.getItemsFromGroup(this.group);
            //this.itemSelectionIndex = (options && "selectedIndex" in options) ? options.selectedIndex : -1;
            //element.querySelector("header[role=banner] .pagetitle").textContent = this.group.title;

            var groupDataSource = data.MediaList.createGrouped(this.groupKeySelector, this.groupDataSelector).groups;

            // Set up the ListView.
            var listView = element.querySelector(".ItemsList").winControl;
            ui.setOptions(listView, {
                itemDataSource: data.MediaList.dataSource,
                groupDataSource: groupDataSource.dataSource,
                itemTemplate: element.querySelector(".ItemTemplate"),
                groupHeaderTemplate: element.querySelector(".ItemHeaderTemplate"),
                onselectionchanged: this.selectionChanged.bind(this),
                layout: new ui.ListLayout()
            });
            
            //var listView2 = element.querySelector(".ItemsList2").winControl;
            //ui.setOptions(listView2, {
            //    itemDataSource: data.MediaList.dataSource,
            //    groupDataSource: groupDataSource.dataSource,
            //    itemTemplate: element.querySelector(".ItemTemplate"),
            //    groupHeaderTemplate: element.querySelector(".ItemHeaderTemplate"),
            //    onselectionchanged: this.selectionChanged.bind(this),
            //    layout: new ui.ListLayout()
            //});
            
            var details = element.querySelector(".ItemDetails");
            /*this.updateVisibility();
            if (this.isSingleColumn()) {
                if (this.itemSelectionIndex >= 0) {
                    // For single-column detail view, load the article.
                    binding.processAll(details, this.items.getAt(this.itemSelectionIndex));
                }
            } else {
                if (nav.canGoBack && nav.history.backStack[nav.history.backStack.length - 1].location === "/pages/medias.html") {
                    // Clean up the backstack to handle a user snapping, navigating
                    // away, unsnapping, and then returning to this page.
                    nav.history.backStack.pop();
                }
                // If this page has a selectionIndex, make that selection
                // appear in the ListView.
                listView.selection.set(Math.max(this.itemSelectionIndex, 0));
            }*/
            
            if (nav.canGoBack && nav.history.backStack[nav.history.backStack.length - 1].location === "/pages/medias.html") {
                // Clean up the backstack to handle a user snapping, navigating
                // away, unsnapping, and then returning to this page.
                nav.history.backStack.pop();
            }
            // If this page has a selectionIndex, make that selection
            // appear in the ListView.
            listView.selection.set(Math.max(this.itemSelectionIndex, 0));
        },

        selectionChanged: function (eventObject) {
            
            var listView = document.body.querySelector(".ItemsList").winControl;
            var that = this;
            // By default, the selection is restriced to a single item.
            listView.selection.getItems().then(function (items) {
                if (items.length > 0) {
                    that.itemSelectionIndex = items[0].index;
                    if (that.isSingleColumn()) {
                        // If snapped or portrait, navigate to a new page containing the
                        // selected item's details.
                        nav.navigate("/pages/medias.html", { group: that.group, selectedIndex: that.itemSelectionIndex });
                    } else {
                        // If fullscreen or filled, update the details column with new data.
                        var details = document.querySelector(".ItemDetails");
                        //$('.BindedDetail').html('');
                        if (items[0].data.displayitem == 'none') {
                            listView.selection.set(items[0].index + 1);
                        } else {
                            binding.processAll(details, items[0].data);
                            details.scrollTop = 0;
                        }

                    }
                } else {
                    //listView.selection.set(1);
                    var t = listView.selection.getItems();
                }
            })
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState) {
            var listView = element.querySelector(".ItemsList").winControl;
            this.updateVisibility();

            if (this.isSingleColumn()) {
                listView.selection.clear();
                if (this.itemSelectionIndex >= 0) {
                    // If the app has snapped into a single-column detail view,
                    // add the single-column list view to the backstack.
                    nav.history.current.state = {
                        group: this.group,
                        selectedIndex: this.itemSelectionIndex
                    };
                    nav.history.backStack.push({
                        location: "/html/splitPage.html",
                        state: { group: this.group }
                    });
                }
            } else {
                // If the app has unsnapped into the two-column view, remove any
                // splitPage instances that got added to the backstack.
                if (nav.canGoBack && nav.history.backStack[nav.history.backStack.length - 1].location === "/html/splitPage.html") {
                    nav.history.backStack.pop();
                }
                listView.selection.set(Math.max(this.itemSelectionIndex, 0));
            }
            listView.forceLayout();
        },

        // This function toggles visibility of the two columns based on the current
        // view state and item selection.
        updateVisibility: function () {
            var oldPrimary = document.querySelector(".primarycolumn");
            if (oldPrimary) {
                utils.removeClass(oldPrimary, "primarycolumn");
            }
            if (this.isSingleColumn()) {
                if (this.itemSelectionIndex >= 0) {
                    utils.addClass(document.querySelector(".articlesection"), "primarycolumn");
                } else {
                    utils.addClass(document.querySelector(".itemlistsection"), "primarycolumn");
                }
            }
        }
    });
})();
