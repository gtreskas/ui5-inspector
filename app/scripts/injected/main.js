sap.ui.require(['ToolsAPI'], function (ToolsAPI) {
    'use strict';

    var ui5inspector = require('../modules/injected/ui5inspector.js');
    var message = require('../modules/injected/message.js');
    var controlUtils = require('../modules/injected/controlUtils.js');
    var rightClickHandler = require('../modules/injected/rightClickHandler.js');
    var applicationUtils = require('../modules/injected/applicationUtils');
    var vyperElemCentricStrategy = require('./vyper/strategies/ui5/elementCentric');
    var reuseAction = require('./vyper/utils/reuseActions');
    // Create global reference for the extension.
    ui5inspector.createReferences();

    /**
     * Mutation observer for DOM elements
     * @type {{init: Function, _observer: MutationObserver, _options: {subtree: boolean, childList: boolean, attributes: boolean}}}
     */
    var mutation = {

        /**
         * Initialize the observer.
         */
        init: function () {
            this._observer.observe(document.body, this._options);
        },

        /**
         * Create an observer instance.
         */
        _observer: new MutationObserver(function (mutations) {
            var isMutationValid = true;
            var controlTreeModel;
            var commonInformation;

            mutations.forEach(function (mutation) {
                if (mutation.target.id === 'ui5-highlighter' || mutation.target.id === 'ui5-highlighter-container') {
                    isMutationValid = false;
                    return;
                }
            });

            if (isMutationValid === true) {
                controlTreeModel = ToolsAPI.getRenderedControlTree();
                commonInformation = ToolsAPI.getFrameworkInformation().commonInformation;

                message.send({
                    action: 'on-application-dom-update',
                    controlTree: controlUtils.getControlTreeModel(controlTreeModel, commonInformation)
                });
            }
        }),

        // Configuration of the observer
        _options: {
            subtree: true,
            childList: true,
            // If this is set to true, some controls will trigger mutation(example: newsTile changing active tile)
            attributes: false
        }
    };

    // Initialize
    mutation.init();

    var contrIdForProm = null;
    var vyperLocatorTriggered= false;

    function getVyperOptLocator(controlId) {
        var sel = null;
        if(!vyperLocatorTriggered){
            vyperLocatorTriggered = true;
            return new Promise(function(res,rej){
                if(contrIdForProm !== controlId){
                    let val = {
                        "value": true
                    }
                    message.send({
                        action: 'on-vyper-req-progress',
                        isBusy: val
                    });
                    contrIdForProm = controlId;
                    sel = vyperElemCentricStrategy.getOptSelectors(contrIdForProm);
                }
                vyperLocatorTriggered = false;
                res(sel);
            });
        } else {
            return Promise.resolve(sel);
        }
    };

    function testVyperLocatorAndAction(selector, action, sVal, index) {
        var res = vyperElemCentricStrategy.testLocator(selector, index = 0);
        if(res.oRes && res.oRes.id) {
            res.actionSuccess = reuseAction.doAction(action, res.oRes, sVal);
        } 
        delete res.oRes;
        //Results not found, or multiple found
        return res;
        
    };

    // Name space for message handler functions.
    var messageHandler = {
        /**
         * Send message with the needed initial information for the extension.
         */
        'get-initial-information': function () {
            var controlTreeModel = ToolsAPI.getRenderedControlTree();
            var frameworkInformation = ToolsAPI.getFrameworkInformation();

            message.send({
                action: 'on-receiving-initial-data',
                applicationInformation: applicationUtils.getApplicationInfo(frameworkInformation),
                controlTree: controlUtils.getControlTreeModel(controlTreeModel, frameworkInformation.commonInformation)
            });
        },

        /**
         * Send framework information.
         */
        'get-framework-information': function () {
            var frameworkInformation = ToolsAPI.getFrameworkInformation();

            message.send({
                action: 'on-framework-information',
                frameworkInformation: applicationUtils.getInformationForPopUp(frameworkInformation)
            });
        },

        'do-run-vyper-script': function(event){
            let val = {
                "value": true
            }
            message.send({
                action: 'on-vyper-req-progress',
                isBusy: val,
            });
            let sel = event.detail.selector;
            let act = event.detail.methodVyp.method;
            let idx = event.detail.methodVyp.index;
            let entValue = event.detail.methodVyp.entValue;
            let succ = {
                "value": testVyperLocatorAndAction(sel, act, entValue, idx)
            };
            val.value = false;
            message.send({
                action: 'on-vyper-req-progress',
                isBusy: val,
                success: succ
            });
        },
        

        /**
         * Handler for logging event listener fucntion.
         * @param {Object} event
         */
        'do-console-log-event-listener': function (event) {
            var evtData = event.detail.data;
            console.log(sap.ui.getCore().byId(evtData.controlId).mEventRegistry[evtData.eventName][evtData.listenerIndex].fFunction);
        },

        /**
         * Handler for element selection in the ControlTree.
         * @param {Object} event
         */
        'do-control-select': function (event) {
            var controlId = event.detail.target;
            var controlProperties = ToolsAPI.getControlProperties(controlId);
            var controlBindings = ToolsAPI.getControlBindings(controlId);
            //var controlAggregations = ToolsAPI.getControlAggregations(controlId);
            //var controlEvents = ToolsAPI.getControlEvents(controlId);

            message.send({
                action: 'on-control-select',
                controlProperties: controlUtils.getControlPropertiesFormattedForDataView(controlId, controlProperties),
                controlBindings: controlUtils.getControlBindingsFormattedForDataView(controlBindings),
                controlAggregations: controlUtils.getControlAggregationsFormattedForDataView(controlId, controlAggregations),
                controlEvents: controlUtils.getControlEventsFormattedForDataView(controlId, controlEvents)
            });
            let sl = getVyperOptLocator(controlId);
            sl.then(function(sel){
                if(sel) {
                    message.send({
                        action: 'on-vyper-data',
                        selector: sel
                    });
                    let val = {
                        "value": false
                    }
                    message.send({
                        action: 'on-vyper-req-progress',
                        isBusy: val
                    });
                    
                    //console.log(sel);
                }
            });
        },

        /**
         * Send message with the inspected UI5 control, from the context menu.
         * @param {Object} event
         */
        'select-control-tree-element-event': function (event) {
            var portMessage = event.detail;

            message.send({
                action: 'on-contextMenu-control-select',
                target: portMessage.target
            });
        },

        /**
         * Change control property, based on editing in the DataView.
         * @param {Object} event
         */
        'do-control-property-change': function (event) {
            var data = event.detail.data;
            var controlId = data.controlId;
            var property = data.property;
            var newValue = data.value;

            var control = sap.ui.getCore().byId(controlId);

            if (!control) {
                return;
            }

            try {
                // Change the property through its setter
                control['set' + property](newValue);
            } catch (error) {
                console.warn(error);
            }

            // Update the DevTools with the actual property value of the control
            this['do-control-select']({
                detail: {
                    target: controlId
                }
            });
        }
    };

    /**
     * Register mousedown event.
     */
    ui5inspector.registerEventListener('mousedown', function rightClickTarget(event) {
        if (event.button === 2) {
            rightClickHandler.setClickedElementId(event.target);
            message.send({
                action: 'on-right-click',
                target: rightClickHandler.getClickedElementId()
            });
        }
    });

    /**
     * Register custom event for communication with the injected.
     */
    ui5inspector.registerEventListener('ui5-communication-with-injected-script', function communicationWithContentScript(event) {
        var action = event.detail.action;

        if (messageHandler[action]) {
            messageHandler[action](event);
        }
    });
});
