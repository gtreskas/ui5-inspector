
    'use strict';
    var ui5inspector = require('../modules/injected/ui5inspector.js');
    var message = require('../modules/injected/message.js');
    var highLighter = require('../modules/content/highLighter.js');
    var idAndTextCentric = require('./vyper/strategies/nonui5/idAndTextCentric');
    var reuseAction = require('./vyper/utils/reuseActions');
    // Create global reference for the extension.
    ui5inspector.createReferences();
    // Name space for message handler functions.
    var messageHandler = {

         /**
         * Select ControlTree element, based on selection in the Element panel.
         * @param {Object} message
         */
        'on-select-element': function (oMess) {
            let mVyperOptionCode = {};
            let mResultFrameElem = {};
            let findElement = null;
            if (oMess.detail && oMess.detail.isVyperAttrSet && idAndTextCentric) {
                let findElems = document.querySelectorAll("[data-vyp-finder='1']");
                if(findElems && findElems.length === 1) {
                    findElement = findElems[0];
                } else {
                    // Check frames
                    mResultFrameElem = idAndTextCentric.getElementWithVyperAttribute();
                    findElement = mResultFrameElem.element;
                }
                try {
                    if(findElement && findElement.element){
                        findElement = findElement.element
                    }
                    if(findElement){
                        findElement.removeAttribute("data-vyp-finder");
                        mVyperOptionCode = idAndTextCentric.buildElementSelectors(findElement, mResultFrameElem.frames);
                    }
                } catch (error) {
                    if(findElement && findElement.element) {
                        findElement = findElement.element;
                    }
                    if(findElement){
                        findElement.removeAttribute("data-vyp-finder");
                    }
                }
                message.sendNonUI5({
                    action: 'on-vyper-nonui5-data',
                    vyperSourceOptions: mVyperOptionCode,
                });
            }
        },

        'do-run-nonui5-vyper': function (oMess) {
            if(oMess && oMess.detail) {
                let oContDocument = document; 
                let bActionSuccess = false;
                let oElement = null;
                let count = 0;
                if(oMess.detail.iframes && oMess.detail.iframes.length > 0) {
                    for (let index = 0; index < oMess.detail.iframes.length; index++) {
                        let valFrame = oMess.detail.iframes[index];
                        
                        if(valFrame.length > 1 && 
                            valFrame.substring(0, 0) === valFrame.substring(1, 1)) {
                            valFrame = valFrame.substring(1, valFrame.length - 1)
                        } 
                        let oFrame = oContDocument.querySelector(valFrame);
                        if(oFrame && oFrame.contentDocument) {
                            oContDocument = oFrame.contentDocument;
                        }
                    }
                }
                if(oMess.detail.selector && oContDocument) {
                    if(!oMess.detail.selector.method || !oMess.detail.selector.value) {
                        oElement = null;
                    } else {
                        let val = "";
                        if(oMess.detail.selector.value.length > 1 && 
                            oMess.detail.selector.value.substring(0, 0) === oMess.detail.selector.value.substring(1, 1)) {
                                val = oMess.detail.selector.value.substring(1, oMess.detail.selector.value.length - 1)
                        } else {
                            val = oMess.detail.selector.value;
                        }

                        if(oMess.detail.selector.method === "non_ui5.common.locator.getElementByCssContainingText") {
                            let sText = "";
                            if(oMess.detail.selector.text && oMess.detail.selector.text.length > 1 && 
                                oMess.detail.selector.text.substring(0, 0) === oMess.detail.selector.text.substring(1, 1)) {
                                    sText = oMess.detail.selector.text.substring(1, oMess.detail.selector.text.length - 1)
                            } else {
                                sText = oMess.detail.selector.text;
                            }

                            let aRes = idAndTextCentric.containsText(
                                val, 
                                sText, 
                                oContDocument);

                            if(aRes && aRes.length === 1) {
                                oElement = aRes[0];
                            }
                            count = aRes.length;
                        } else if(oMess.detail.selector.method === "non_ui5.common.locator.getElementByCss") {
                            let aSelector = oContDocument.querySelectorAll(val);
                            if(aSelector && aSelector.length === 1) {
                                oElement = aSelector[0];
                            }
                            count = aSelector.length;
                        } else if(oMess.detail.selector.method === "non_ui5.common.locator.getElementByXPath") {
                            let xPathRes = oContDocument.evaluate(
                                val, 
                                oContDocument, 
                                null, 
                                XPathResult.ORDERED_NODE_ITERATOR_TYPE,
                                null
                            );
                            let oElem = xPathRes.iterateNext();
                            if(oElem) {
                                Object.assign(oElement, oElem);
                                while (oElem) {
                                    oElem = iterator.iterateNext();
                                    count++;
                                } 
                                if(count > 1){
                                    oElement = null;
                                }
                            } 
                        }   
                    }
                }

                if(oElement && oMess.detail.vyperAction.method) {
                    let val = "";
                    if(oMess.detail.vyperAction.entValue.length > 1 && 
                        oMess.detail.vyperAction.entValue.substring(0, 0) === oMess.detail.vyperAction.entValue.substring(1, 1)) {
                        val = oMess.detail.vyperAction.entValue.substring(1, oMess.detail.vyperAction.entValue.length - 1)
                    } else {
                        val = oMess.detail.vyperAction.entValue;
                    }
                    bActionSuccess = reuseAction.doNonUI5Action(
                        oMess.detail.vyperAction.method, 
                        oElement, 
                        val
                    );        
                } else if(oElement){
                    bActionSuccess = true;
                }

                //Highlight element if succeeded
                if(bActionSuccess && oElement && oContDocument) {
                    // Weird effects being in iframe... never get hiden and freezes the ui
                    //highLighter.setDimensionsNonUI5(oElement, oContDocument);
                }

                message.sendNonUI5({
                    action: 'on-nonui5-vyper-progress',
                    success: bActionSuccess,
                    count: count,
                });
            }
        }
    };
    /**
     * Register custom event for communication with the injected.
     */
    ui5inspector.registerEventListener('ui-communication-with-injected-script', function communicationWithContentScript(event) {
        var action = event.detail.action;
        if( 
            action === 'on-select-element' || 
            action === 'on-vyper-nonui5-data' ||
            action === 'do-run-nonui5-vyper' ||
            action === 'on-nonui5-vyper-progress'){
            if (messageHandler[action]) {
                messageHandler[action](event);
            }
        }
    });