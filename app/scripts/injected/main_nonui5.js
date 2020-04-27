
    'use strict';
    var ui5inspector = require('../modules/injected/ui5inspector.js');
    var message = require('../modules/injected/message.js');
    var idAndTextCentric = require('./vyper/strategies/nonui5/idAndTextCentric');
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
            console.log(oMess);
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
            action === 'do-run-nonui5-vyper'){
            if (messageHandler[action]) {
                messageHandler[action](event);
            }
        }
    });