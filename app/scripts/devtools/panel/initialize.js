'use strict';

// Create a port with background page for continuous message communication
var port = chrome.extension.connect({name: 'devtools-initialize-tabId-' + chrome.devtools.inspectedWindow.tabId});

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
    //debugger;
    var element = selectedElement;
    element.setAttribute("data-vyp-finder", "1");
    return true;
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
    "Vyper Non-UI5 Recorder",
    function(sidebar) {
        sidebar.setHeight('200px');
        sidebar.setPage('/html/panel/non_ui5/index.html');
        chrome.devtools.panels.elements.onSelectionChanged.addListener(function () {
            var getElementForVyper = _getElementForVyper.toString() + '_getElementForVyper($0);';
            /* JSHINT evil: true */
            chrome.devtools.inspectedWindow.eval(getElementForVyper, {useContentScriptContext: true}, function (isVypAttrSet) {
                port.postMessage({
                    action: 'on-select-element',
                    isVyperAttrSet: isVypAttrSet
                });
            });
        });
        port.postMessage({
            action: 'do-script-injection',
            tabId: chrome.devtools.inspectedWindow.tabId,
            file: '/scripts/content/main_nonui5.js'
        });

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
