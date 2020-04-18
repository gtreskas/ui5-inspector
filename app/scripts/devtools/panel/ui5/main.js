(function () {
    'use strict';

    // ================================================================================
    // Main controller for 'UI5' tab in devtools
    // ================================================================================

    // ================================================================================
    // Bootstrap
    // ================================================================================

    // Components that need to be required and reference
    // ================================================================================
    var utils = require('../../../modules/utils/utils.js');
    var beautifier = require('../../../../html/lib/beautify.js');
    var TabBar = require('../../../modules/ui/TabBar.js');
    var ControlTree = require('../../../modules/ui/ControlTree.js');
    var DataView = require('../../../modules/ui/DataView.js');
    var Splitter = require('../../../modules/ui/SplitContainer.js');
    var deepExtend = require('deep-extend');
    // Apply theme
    // ================================================================================
    utils.applyTheme(chrome.devtools.panels.themeName);

    // Create a port with background page for continuous message communication
    // ================================================================================
    var port = chrome.extension.connect({name: 'devtools-tabId-' + chrome.devtools.inspectedWindow.tabId});

    // Bootstrap for 'Control inspector' tab
    // ================================================================================
    utils.setOSClassName();

    // Main tabbar inside 'UI5' devtools panel
    var UI5TabBar = new TabBar('ui5-tabbar');

    // Horizontal Splitter for 'Control Inspector' tab
    var controlInspectorHorizontalSplitter = new Splitter('horizontal-splitter', {
        isEndContainerClosable: true,
        hideEndContainer: false
        //endContainerWidth: '400px'
    });

    // Control tree
    var controlTree = new ControlTree('control-tree', {

        /**
         * Send message, that the a new element is selected in the ControlTree.
         * @param {string} selectedElementId
         */
        onSelectionChanged: function (selectedElementId) {
            port.postMessage({
                action: 'do-control-select',
                target: selectedElementId
            });
        },

        /**
         * Send message, that the a new element is hovered in the ControlTree.
         * @param {string} hoveredElementId
         */
        onHoverChanged: function (hoveredElementId) {
            port.postMessage({
                action: 'on-control-tree-hover',
                target: hoveredElementId
            });
        },

        /**
         * Fired at first rendering of the ControlTree.
         */
        onInitialRendering: function () {
            var controls = this.getData().controls;
            this.setSelectedElement(controls[0].id);
        }
    });

    // Tabbar for Controltree additional information (Properties, Binding and etc)
    var controlTreeTabBar = new TabBar('control-tree-tabbar');

    // Dataview for control properties
    var controlProperties = new DataView('control-properties', {

        /**
         * Send message, that an proprety in the DataView is changed.
         * @param {Object} changeData
         */
        onPropertyUpdated: function (changeData) {
            port.postMessage({
                action: 'do-control-property-change',
                data: changeData
            });
        }
    });

    // Vertical splitter for 'Bindings' tab
    var controlBindingsSplitter = new Splitter('control-bindings-splitter', {
        hideEndContainer: true,
        isEndContainerClosable: true,
        endContainerTitle: 'Model Information'
    });

    // Dataview for control binding information - left part
    var controlBindingInfoLeftDataView = new DataView('control-bindings-left', {

        /**
         * Method fired when a clickable element is clicked.
         * @param {Object} event
         */
        onValueClick: function (event) {
            var dataFormatedForDataView = {
                modelInfo: {
                    options: {
                        title: 'Model Information',
                        expandable: false,
                        expanded: true,
                        hideTitle: true
                    },
                    data: event.data
                }
            };

            controlBindingInfoRightDataView.setData(dataFormatedForDataView);
            controlBindingsSplitter.showEndContainer();
        }
    });

    // Dataview for control binding information
    var controlBindingInfoRightDataView = new DataView('control-bindings-right');

    // Bootstrap for 'Control inspector' tab
    // ================================================================================

    // Dataview for 'Application information' tab
    var appInfo = new DataView('app-info');
/////////////////////////Vyper//////////////////////////////////////////////////////////////
    var ReuseDictionary = {
        "no action": "ui5.common.locator.getDisplayedElement",
        "click": "ui5.common.userInteraction.click",
        "clear": "ui5.common.userInteraction.clear",
        "clearAndRetry": "ui5.common.userInteraction.clearAndRetry",
        "fill": "ui5.common.userInteraction.fill",
        "fillAndRetry":"ui5.common.userInteraction.fillAndRetry",
        "clearAndFill": "ui5.common.userInteraction.clearAndFill",
        "clearFillAndRetry": "ui5.common.userInteraction.clearFillAndRetry"

    };
    var vyperButton = document.getElementById("runVyper");
    var vyperAction = document.getElementById("selectAction");
    var oCurrentSelector = {};
    //Attach action changed
    vyperAction.addEventListener("change", function(){
        //Get editor instance
        if(!edt) {
            var edt = vyperEditor;
            if(!edt) {
                edtDom = document.querySelector('.CodeMirror');
                if(edtDom && edtDom.CodeMirror) {
                    edt = edtDom.CodeMirror;
                }
            }
        }

        let jsBeautifyExec = beautifier.js_beautify;
        var formCode = formatVyperCode(oCurrentSelector);
        let beautifiedJs = jsBeautifyExec(formCode);
        edt.setOption("value", beautifiedJs);
    });


    // Attach run vyper event
    vyperButton.addEventListener("click", function(){
        //Get editor instance
        if(!edt) {
            var edt = vyperEditor;
            if(!edt) {
                edtDom = document.querySelector('.CodeMirror');
                if(edtDom && edtDom.CodeMirror) {
                    edt = edtDom.CodeMirror;
                }
            }
        }
        // Get value of editor
        let strVal = edt.getValue();
        let jsonStr = "";
        let busyi = document.getElementById("busybox");
        busyi.style.display = "none";

        if(strVal && vyperAction.value && strVal.indexOf('{') !== -1) {
            try {
                jsonStr = strVal.substring(strVal.indexOf('{'), strVal.indexOf(';'));
                let sel = JSON.parse(jsonStr);
                let idx = null;
                if(strVal.indexOf("index") !== -1 && strVal.split("index").length > 2) {
                    //Action  index
                    let idxStr = strVal.substring(strVal.indexOf("index"));
                    idxStr = idxStr.substring(idxStr.indexOf('=') + 1, idxStr.indexOf(';'))
                    if(idxStr && !Number.isNaN(parseInt(idxStr.trim()))){
                        try {
                            idx = parseInt(idxStr.trim());
                            if(idx < 0) {
                                let failedDom = document.getElementById("failed");
                                failedDom.innerText =  "Failed! Index should be a non-negative integer number";
                                return;
                            }
                        } catch (error) {
                            let failedDom = document.getElementById("failed");
                            failedDom.innerText =  "Failed! Index should be an integer number";
                            return;
                        }
                    } else {
                        let failedDom = document.getElementById("failed");
                        failedDom.innerText =  "Failed! Index should be an integer number";
                        return;
                        
                    }
                }
                
                let sValEnter = "";
                if(vyperAction.value !== "click" && vyperAction.value !== "no action" && strVal.indexOf("valueToEnter") !== -1 && strVal.split("valueToEnter").length > 2){
                    // Get value
                    sValEnter = strVal.substring(strVal.indexOf("valueToEnter"));
                    sValEnter = sValEnter.substring(sValEnter.indexOf('"') + 1, sValEnter.indexOf('";'))
                } 

                //Send message
                port.postMessage({
                    action: 'do-run-vyper-script',
                    selector: sel,
                    methodVyp: {"method": vyperAction.value, "index": idx, "entValue": sValEnter}
                });
            } catch (error) {
                throw new Error("Something went wrong with the parsing of the information");
            }
        } else {
            // Nothing to run ignore...
        }
    });

    var formatVyperCode = function(sel) {
        if(!sel || isEmptyObj(sel))  return "No valid selector could be generated";
        let currSel = {};
        deepExtend(currSel, sel, {});
        let idx = null;
        if(currSel.elementProperties && currSel.elementProperties.index !== null && currSel.elementProperties.index !== undefined) {
            idx = currSel.elementProperties.index;
            delete currSel.elementProperties.index;
        } 
        var sSelector = JSON.stringify(currSel);
        var strSel = 'const selector = ' + sSelector + ';';
        if(vyperAction.value !== "click" && vyperAction.value !== "no action") {
            strSel = strSel + 'const valueToEnter = "myValue";';
        }
        if(idx !== null && idx !== undefined) {
            strSel = strSel + 'const index = '+ idx + ';';
        }

        if(vyperAction.value) {
            strSel = strSel +  'await ' + ReuseDictionary[vyperAction.value] + '(selector';
            if(vyperAction.value !== "click" && vyperAction.value !== "no action") {
                strSel = strSel + ', valueToEnter'; 
            }
            if(idx !== null && idx !== undefined) {
                strSel = strSel + ', index);'
            } else {
                strSel = strSel + ');'
            }
        }
        return strSel;
    }

    var isEmptyObj = function(obj) {
        return Object.entries(obj).length === 0 && obj.constructor === Object;
    }

 //////////////////////////////////////////////////////////////////////////////////////   
    // ================================================================================
    // Communication
    // ================================================================================

    // Name space for message handler functions.
    var messageHandler = {

        'on-vyper-req-progress': function(event) {
            let successDom = document.getElementById("success");
            let failedDom = document.getElementById("failed");
            successDom.style.display = "none";
            failedDom.style.display = "none";

            let isBusy = event.isBusy.value;
            let busyi = document.getElementById("busybox");
            if(busyi) {
                if(isBusy) {
                    busyi.style.display = "block";
                    
                } else { 
                    busyi.style.display = "none";
                }
            } else {
                throw new Error("Busy indicator is undefined");
            }

            if(event.success !== undefined){
                let res = event.success.value;
                if(res.resnum > 0) {
                    if(res.actionSuccess) {
                        successDom.innerText = "Success! Total number of elements found:" + res.num;
                        successDom.style.display = "block";
                        failedDom.style.display = "none";
                    } else if(res.resnum === 0){
                        failedDom.innerText =  "Failed! Total number of elements found:" + res.num;
                        successDom.style.display = "none";
                        failedDom.style.display = "block";
                    } else {
                        failedDom.innerText =  "Action failed! Total number of elements found:" + res.num;
                        successDom.style.display = "none";
                        failedDom.style.display = "block";
                    }
                } else { 
                    failedDom.innerText =  "Failed! Total number of elements found:" + res.num;
                    successDom.style.display = "none";
                    failedDom.style.display = "block";
                }
            }
        },

        'on-vyper-data': function(event) {
            let successDom = document.getElementById("success");
            let failedDom = document.getElementById("failed");
            successDom.style.display = "none";
            failedDom.style.display = "none";
            let sel = event.selector;
            if(!edt) {
                var edt = vyperEditor;
                if(!edt) {
                    edtDom = document.querySelector('.CodeMirror');
                    if(edtDom && edtDom.CodeMirror) {
                        edt = edtDom.CodeMirror;
                    }
                }
            }
            if(sel && beautifier && !isEmptyObj(sel)) {
                let jsBeautifyExec = beautifier.js_beautify;
                oCurrentSelector= sel;
                var formCode = formatVyperCode(sel);
                let beautifiedJs = jsBeautifyExec(formCode);
                edt.setOption("value", beautifiedJs);
            } else {
                oCurrentSelector = {};
                edt.setOption("value", "No valid selector could be generated");
            }
        },

        /**
         * Send object to background page.
         * @param {Object} message
         */
        'on-port-connection': function (message) {
            port.postMessage({action: 'do-ui5-detection'});
        },

        /**
         * Handler for UI5 detection on the current inspected page.
         * @param {Object} message
         */
        'on-ui5-detected': function (message) {
            var overlay = document.getElementById('supportability');
            var overlayNoUI5Section = overlay.querySelector('[no-ui5-version]');
            var overlayUnsupportedVersionSection = overlay.querySelector('[unsupported-version]');

            if (message.isVersionSupported) {
                overlay.setAttribute('hidden', true);
            } else {
                overlay.removeAttribute('hidden');
                overlayNoUI5Section.style.display = 'none';
                overlayUnsupportedVersionSection.style.display = 'block';
            }

            port.postMessage({
                action: 'do-script-injection',
                tabId: chrome.devtools.inspectedWindow.tabId,
                file: '/scripts/content/main.js'
            });
        },

        /**
         * Get the initial needed information, when the main injected script is available.
         * @param {Object} message
         */
        'on-main-script-injection': function (message) {
            port.postMessage({
                action: 'get-initial-information'
            });
        },

        /**
         * Visualize the initial needed data for the extension.
         * @param {Object} message
         */
        'on-receiving-initial-data': function (message) {
            controlTree.setData(message.controlTree);
            appInfo.setData(message.applicationInformation);
        },

        /**
         * Updates the ControlTree, when the DOM in the inspected window is changed.
         * @param {Object} message
         */
        'on-application-dom-update': function (message) {
            controlTree.setData(message.controlTree);
        },

        /**
         * Handler for ControlTree element selecting.
         * @param {Object} message
         */
        'on-control-select': function (message) {
            controlProperties.setData(message.controlProperties);
            controlBindingInfoLeftDataView.setData(message.controlBindings);

            if(message.controlBindings){
                // Set bindings count
                document.querySelector('#tab-bindings count').innerHTML = '&nbsp;(' + Object.keys(message.controlBindings).length + ')';
            }

            // Close possible open binding info and/or methods info
            controlBindingsSplitter.hideEndContainer();
        },

        /**
         * Select ControlTree element, based on selection in the Element panel.
         * @param {Object} message
         */
        'on-select-ui5-control-from-element-tab': function (message) {
            controlTree.setSelectedElement(message.nearestUI5Control);
        },

        /**
         * Select ControlTree element, based on right click and context menu.
         * @param {Object} message
         */
        'on-contextMenu-control-select': function (message) {
            controlTree.setSelectedElement(message.target);
        },

        /**
         * Handler for UI5 none detection on the current inspected page.
         * @param {Object} message
         */
        'on-ui5-not-detected': function (message) {
            var overlay = document.getElementById('supportability');
            var overlayNoUI5Section = overlay.querySelector('[no-ui5-version]');
            var overlayUnsupportedVersionSection = overlay.querySelector('[unsupported-version]');

            overlay.removeAttribute('hidden');

            overlayNoUI5Section.style.display = 'block';
            overlayUnsupportedVersionSection.style.display = 'none';
        }
    };

    // Listen for messages from the background page
    port.onMessage.addListener(function (message, messageSender, sendResponse) {
        // Resolve incoming messages
        utils.resolveMessage({
            message: message,
            messageSender: messageSender,
            sendResponse: sendResponse,
            actions: messageHandler
        });
    });

    // Restart everything when the URL is changed
    chrome.devtools.network.onNavigated.addListener(function () {
        port.postMessage({action: 'do-ui5-detection'});
    });
}());
