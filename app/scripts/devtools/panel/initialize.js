'use strict';

// Create a port with background page for continuous message communication
var port = chrome.extension.connect({name: 'devtools-initialize-tabId-' + chrome.devtools.inspectedWindow.tabId});

var sideBarNonUI5 = null;
/**
 * Find the ID of the nearest UI5 control from the current selected element in Chrome elements panel.
 * @param {string} selectedElement - The ID of the selected element in Chrome elements panel
 * @returns {string} The ID of the nearest UI5 Control from the selectedElement
 * @private
 */
function _getNearestUI5ControlID(selectedElement) {
    var element = selectedElement;
    while (!element.getAttribute('data-sap-ui')) {
        if (element.nodeName === 'BODY') {
            return undefined;
        }
        element = element.parentNode;
    }
    return element.id;
}

/**
 * Find the ID of the nearest UI5 control from the current selected element in Chrome elements panel.
 * @param {string} selectedElement - The ID of the selected element in Chrome elements panel
 * @returns {string} The ID of the nearest UI5 Control from the selectedElement
 * @private
 */
function _getElementForVyper(selectedElement) {
    let findElems = document.querySelectorAll("[data-vyp-finder='1']");
    if(findElems && findElems.length > 0) {
        for (let index = 0; index < findElems.length; index++) {
            findElems[index].removeAttribute("data-vyp-finder");   
        }
    }
    var element = selectedElement;
    if(!element && $0) {
        element = $0;
    }
    if(element) {
        element.setAttribute("data-vyp-finder", "1");
        return true;
    }
    return false;
}

chrome.devtools.panels.create('UI5', '/images/icon-128.png', '/html/panel/ui5/index.html', function (panel) {
    panel.onHidden.addListener(function () {
        port.postMessage({
            action: 'on-ui5-devtool-hide'
        });
    });
    panel.onShown.addListener(function () {
        port.postMessage({
            action: 'on-ui5-devtool-show'
        });
    });
});

chrome.devtools.panels.elements.createSidebarPane(
    "Vyper Non-UI5 Spotlight",
    function(sidebar) {
        sideBarNonUI5 = sidebar;
        sidebar.setHeight('200px');
        sidebar.setPage('/html/panel/non_ui5/index.html');
        var getElementForVyper = _getElementForVyper.toString() + '_getElementForVyper($0);';
        //chrome.devtools.inspectedWindow.reload({"injectedScript": getElementForVyper });
        chrome.devtools.panels.elements.onSelectionChanged.addListener(function () {
            // chrome.devtools.inspectedWindow.getResources(function(resources){
            //     var s = resources;
            // });
            //setTimeout(function(){
                /* JSHINT evil: true */
                chrome.devtools.inspectedWindow.eval(getElementForVyper, {useContentScriptContext: true}, function (bResult, exceptionInfo) {
                    port.postMessage({
                        action: 'on-select-element',
                        isVyperAttrSet: bResult
                    });
                });
            //}, 10);
            
        });
        port.postMessage({
            action: 'do-script-injection',
            tabId: chrome.devtools.inspectedWindow.tabId,
            file: '/scripts/content/main_nonui5.js'
        });

});

// Restart everything when the URL is changed
chrome.devtools.network.onNavigated.addListener(function () {
   // chrome.devtools.inspectedWindow.reload();
    if(sideBarNonUI5) {
        sideBarNonUI5.setHeight('100px');
        sideBarNonUI5.setPage('/html/panel/non_ui5/index.html');
        port.postMessage({
            action: 'do-script-injection',
            tabId: chrome.devtools.inspectedWindow.tabId,
            file: '/scripts/content/main_nonui5.js'
        });
    }
});

chrome.devtools.panels.elements.onSelectionChanged.addListener(function () {
    
    // To get the selected element in Chrome elements panel, is needed to use eval and call the function with $0 parameter
    var getNearestUI5Control = _getNearestUI5ControlID.toString() + '_getNearestUI5ControlID($0);';

    /* JSHINT evil: true */
    chrome.devtools.inspectedWindow.eval(getNearestUI5Control, {useContentScriptContext: true}, function (elementId) {
        if (elementId === undefined) {
            return;
        }

        port.postMessage({
            action: 'on-select-ui5-control-from-element-tab',
            nearestUI5Control: elementId
        });
    });
    /* JSHINT evil: false */
});
