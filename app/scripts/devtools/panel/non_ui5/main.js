(function () {
    'use strict';

    // Create a port with background page for continuous message communication
    // ================================================================================
    var port = chrome.extension.connect({name: 'devtools-nonui5-tabId-' + chrome.devtools.inspectedWindow.tabId});

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
    var vyperButton = document.getElementById("runNonUI5Vyper");
    var vyperAction = document.getElementById("selectAction");
    var vyperSumElems = document.getElementById("sumOfElems");
    var mSelectorOptions = {};
    var vyperSelectAlts = document.getElementById("selectorAlt");
/////////////////////////Vyper//////////////////////////////////////////////////////////////

var ReuseDictionary = {
    "no action": "",
    "click": "non_ui5.common.userInteraction.click",
    "clear": "non_ui5.common.userInteraction.clear",
    "clearAndRetry": "non_ui5.common.userInteraction.clearAndRetry",
    "fill": "non_ui5.common.userInteraction.fill",
    "fillAndRetry":"non_ui5.common.userInteraction.fillAndRetry",
    "clearAndFill": "non_ui5.common.userInteraction.clearAndFill",
    "clearAndFillAndRetry": "non_ui5.common.userInteraction.clearAndFillAndRetry"
};
// Attach run vyper event
vyperButton.addEventListener("click", function(){
    //Get editor instance
    if(!edt) {
        var edt = nonUi5VyperEditor;
        if(!edt) {
            edtDom = document.querySelector('.CodeMirror');
            if(edtDom && edtDom.CodeMirror) {
                edt = edtDom.CodeMirror;
            }
        }
    }
    let strVal = edt.getValue();
    let action = ReuseDictionary[vyperAction.value];
    if(strVal && mSelectorOptions && vyperAction.value && action !== null && action !== undefined) {
        let selectedOption = vyperSelectAlts.options[vyperSelectAlts.selectedIndex].text;
        let strAllCode = mSelectorOptions[selectedOption];
        let strCode = "";
        if(strAllCode) {
            if(strAllCode.indexOf('getElementByCssContainingText') !== -1){
                strCode = "non_ui5.common.locator.getElementByCssContainingText";
            } else if(strAllCode.indexOf('getElementByCss') !== -1){
                strCode = "non_ui5.common.locator.getElementByCss";
            } else if(strAllCode.indexOf('getElementByXPath') !== -1){
                strCode = "non_ui5.common.locator.getElementByXPath";
            } 
        }
        let sMethodFram = 'non_ui5.common.locator.switchToIframe';
        let iframe = "";
        if(strVal.indexOf(sMethodFram) !== -1) {
            let cutFrame = strVal.substring(strVal.lastIndexOf(sMethodFram));
            iframe = cutFrame.substring(cutFrame.lastIndexOf(sMethodFram) + (sMethodFram.length + 1), cutFrame.indexOf(');'));
        }
        
        let sSel = "";
        let sText = "";
        if(strCode && strVal.indexOf(strCode) !== -1) {
            let cutMethod = strVal.substring(strVal.lastIndexOf(strCode));
            sSel = cutMethod.substring(cutMethod.lastIndexOf(strCode) + (strCode.length + 1), cutMethod.indexOf(');'));
            if(cutMethod.indexOf('getElementByCssContainingText') !== -1) {
                let aSel = sSel.split(',');
                if(aSel && aSel.length > 1){
                    sSel = aSel[0];
                    sText = aSel[1];
                }
            }
        }
        
        let sValEnter = "";
        if(action && strVal.indexOf(action) !== -1) {
            let cutAction = strVal.substring(strVal.lastIndexOf(action));
            let cutVal = cutAction.substring(cutAction.lastIndexOf(action) + (action.length + 1), cutAction.indexOf(');'));
            let aValEnter = cutVal.split(',');
            if(aValEnter && aValEnter.length > 1){
                sValEnter = aValEnter[1];
            }
        }

        // Get value of editor
        let failedDom = document.getElementById("failed");
        failedDom.innerText =  "Failed! Parsing issue with selector";
        failedDom.style.display = "block";
        let successDom = document.getElementById("success");
        successDom.style.display = "none";
        
        //Send message
        port.postMessage({
            action: 'do-run-nonui5-vyper',
            iframe: iframe,
            selector: {"method": strCode, "value": sSel, "text": sText},
            vyperAction: {"method": action, "entValue": sValEnter.trim()}
        });
    }
});

vyperAction.addEventListener("change", function(){
      //Get editor instance
      if(!edt) {
        var edt = nonUi5VyperEditor;
        if(!edt) {
            edtDom = document.querySelector('.CodeMirror');
            if(edtDom && edtDom.CodeMirror) {
                edt = edtDom.CodeMirror;
            }
        }
    }
    if(mSelectorOptions) {
        let selectedOption = vyperSelectAlts.options[vyperSelectAlts.selectedIndex].text;
        let strCode = mSelectorOptions[selectedOption];
        if(vyperAction.value !== "no action"){
            if(vyperAction.value.indexOf('clearAndFillAndRetry') !== -1 ||
                vyperAction.value.indexOf('clearAndFill') !== -1 ||
                vyperAction.value.indexOf('fillAndRetry') !== -1 ||
                vyperAction.value.indexOf('fill') !== -1) {
                strCode = strCode + "await " + ReuseDictionary[vyperAction.value] + "(elem, 'testValue');";        
            } else {
                strCode = strCode + "await " + ReuseDictionary[vyperAction.value] + "(elem);";
            }
        }
        if(strCode && beautifier) {
            let jsBeautifyExec = beautifier.js_beautify;
            let beautifiedJs = jsBeautifyExec(strCode);
            edt.setOption("value", beautifiedJs);
        }
    }
});

vyperSelectAlts.addEventListener("change", function(){
    vyperAction.value = "no action";
    //Get editor instance
    if(!edt) {
        var edt = nonUi5VyperEditor;
        if(!edt) {
            edtDom = document.querySelector('.CodeMirror');
            if(edtDom && edtDom.CodeMirror) {
                edt = edtDom.CodeMirror;
            }
        }
    }
    if(mSelectorOptions) {
        let selectedOption = vyperSelectAlts.options[vyperSelectAlts.selectedIndex].text;
        if( selectedOption && mSelectorOptions[selectedOption] && beautifier) {
            let jsBeautifyExec = beautifier.js_beautify;
            let beautifiedJs = jsBeautifyExec(mSelectorOptions[selectedOption]);
            edt.setOption("value", beautifiedJs);
        } else {
            edt.setOption("value", "No valid selector could be generated");
        }
    }
});


 //////////////////////////////////////////////////////////////////////////////////////   
    // ================================================================================
    // Communication
    // ================================================================================

    // Name space for message handler functions.
    var messageHandler = {

        'on-vyper-nonui5-data': function(event) {
            let mSourceCodeOptions = event.vyperSourceOptions;
            vyperAction.value = "no action";
            mSelectorOptions = mSourceCodeOptions;
            if(!edt) {
                var edt = nonUi5VyperEditor;
                if(!edt) {
                    edtDom = document.querySelector('.CodeMirror');
                    if(edtDom && edtDom.CodeMirror) {
                        edt = edtDom.CodeMirror;
                    }
                }
            }
            if(vyperSelectAlts) {
                // Clear options
                while (vyperSelectAlts.options.length) vyperSelectAlts.remove(0);
            }
            if(mSourceCodeOptions) {
                let sFirstCode = "";
                var aOptions = Object.keys(mSourceCodeOptions);
                for (let index = 0; index < aOptions.length; index++) {
                    const sKey = aOptions[index];
                    //Add key and code in option save them globally for switching in an dictionary mSourceCodeOptions = global
                    let sCode = mSourceCodeOptions[sKey];
                    
                    // Generate entries
                    let option = document.createElement("option");
                    option.text = sKey;
                    vyperSelectAlts.add(option);
           
                    if(!sFirstCode) {
                        vyperSelectAlts.selectedIndex = 0;
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
}());
