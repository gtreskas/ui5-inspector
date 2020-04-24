(function () {
    'use strict';

    // Create a port with background page for continuous message communication
    // ================================================================================
    var port = chrome.extension.connect({name: 'devtools-tabId-' + chrome.devtools.inspectedWindow.tabId});

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
    var deepExtend = require('deep-extend');

   
/////////////////////////Vyper//////////////////////////////////////////////////////////////

 //////////////////////////////////////////////////////////////////////////////////////   
    // ================================================================================
    // Communication
    // ================================================================================

    // Name space for message handler functions.
    var messageHandler = {

        'on-vyper-nonui5-data': function(event) {
            let mSourceCodeOptions = event.vyperSourceOptions;
            if(!edt) {
                var edt = nonUi5VyperEditor;
                if(!edt) {
                    edtDom = document.querySelector('.CodeMirror');
                    if(edtDom && edtDom.CodeMirror) {
                        edt = edtDom.CodeMirror;
                    }
                }
            }
            if(mSourceCodeOptions) {
                let sFirstCode = "";
                var aOptions = Object.keys(mSourceCodeOptions);
                for (let index = 0; index < aOptions.length; index++) {
                    const sKey = aOptions[index];
                    //Add key and code in option save them globally for switching in an dictionary mSourceCodeOptions = global
                    let sCode = mSourceCodeOptions[sKey];
                    if(!sFirstCode) {
                        sFirstCode = sCode;
                    }
                }
                if(sFirstCode && beautifier) {
                    let jsBeautifyExec = beautifier.js_beautify;
                    let beautifiedJs = jsBeautifyExec(sFirstCode);
                    edt.setOption("value", beautifiedJs);
                } else {
                    edt.setOption("value", "No valid selector could be generated");
                }
            }
        },

        /**
         * Send object to background page.
         * @param {Object} message
         */
        'on-port-connection': function (message) {
        },

        /**
         * Handler for ControlTree element selecting.
         * @param {Object} message
         */
        'on-control-select': function (message) {
        },

        /**
         * Select ControlTree element, based on right click and context menu.
         * @param {Object} message
         */
        'on-contextMenu-control-select': function (message) {
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
        //port.postMessage({action: 'do-ui5-detection'});
    });
}());
