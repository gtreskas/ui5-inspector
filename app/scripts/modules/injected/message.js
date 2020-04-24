'use strict';

//Fallback if circular ref is detected
function simpleStringify (object){
    var simpleObject = {};
    for (var prop in object ){
        if (!object.hasOwnProperty(prop)){
            continue;
        }
        if (typeof(object[prop]) == 'object'){
            continue;
        }
        if (typeof(object[prop]) == 'function'){
            continue;
        }
        simpleObject[prop] = object[prop];
    }
    return JSON.stringify(simpleObject); // returns cleaned up JSON
};
module.exports = {
    /**
     * Send message to content script.
     * @param {Object} object
     */
    send: function (object) {
        try {
            var message = {
                detail: JSON.parse(JSON.stringify(object))
            };
            
        } catch (error) {
            message = {
                detail: JSON.parse(simpleStringify(object))
            };
        }
        document.dispatchEvent(new CustomEvent('ui5-communication-with-content-script', message));   
    },

    sendNonUI5: function (object) {
        try {
            var message = {
                detail: JSON.parse(JSON.stringify(object))
            };
            
        } catch (error) {
            message = {
                detail: JSON.parse(simpleStringify(object))
            };
        }
        document.dispatchEvent(new CustomEvent('ui-communication-with-content-script', message));   
    }
};
