(function () {
    'use strict';

    var utils = require('../modules/utils/utils.js');
    var port = chrome.runtime.connect({name: 'contentNonUI5'});
    // ================================================================================
    // Inject needed scripts into the inspected page
    // ================================================================================
    /**
     * Inject javascript file into the page.
     * @param {string} source - file path
     * @callback
     */
    var injectScript = function (source, callback) {
        var script = document.createElement('script');
        script.src = chrome.extension.getURL(source);
        document.head.appendChild(script);

        /**
         * Delete the injected file, when it is loaded.
         */
        script.onload = function () {
            script.parentNode.removeChild(script);

            if (callback) {
                callback();
            }
        };
    };
    injectScript('/scripts/injected/main_nonui5.js', function () {
    });

    // ================================================================================
    // Communication
    // ================================================================================

    /**
     * Send message to injected script.
     * @param {Object} message
     */
    var sendCustomMessageToInjectedScript = function (message) {
        document.dispatchEvent(new CustomEvent('ui-communication-with-injected-script', {
            detail: message
        }));
    };

    // Name space for message handler functions.
    var messageHandler = {
    };

    port.onMessage.addListener(function (message, messageSender, sendResponse) {
        // Resolve incoming messages
        utils.resolveMessage({
            message: message,
            messageSender: messageSender,
            sendResponse: sendResponse,
            actions: messageHandler
        });

        // Send events to injected script
        sendCustomMessageToInjectedScript(message);
    });

    /**
     * Listener for messages from the injected script.
     */
    document.addEventListener('ui-communication-with-content-script', function sendEvent(detectEvent) {
        // Send the received event detail object to background page
        port.postMessage(detectEvent.detail);
    }, false);
}());
