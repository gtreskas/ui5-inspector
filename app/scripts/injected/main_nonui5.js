
    'use strict';
    var ui5inspector = require('../modules/injected/ui5inspector.js');
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
            console.log(oMess);
            let mResults = {};
            if (oMess.isVyperAttrSet && idAndTextCentric) {
                let findElement = document.querySelectorAll("[data-vyp-finder='1']")[0];
                findElement.removeAttribute("data-vyp-finder");
                mResults = idAndTextCentric.buildElementSelectors(findElement);
            }
        },

    };
    /**
     * Register custom event for communication with the injected.
     */
    ui5inspector.registerEventListener('ui-communication-with-injected-script', function communicationWithContentScript(event) {
        var action = event.detail.action;

        if (messageHandler[action]) {
            messageHandler[action](event);
        }
    });