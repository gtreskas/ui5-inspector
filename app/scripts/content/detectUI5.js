(function () {
    'use strict';

     // Inject a script file in the current page
     var scriptUI5 = document.createElement('script');
     scriptUI5.src = chrome.extension.getURL('/scripts/injected/detectUI5.js');
     document.head.appendChild(scriptUI5);
 
     // Inject a the vyper util file in the current page
     //var scriptVyper = document.createElement('script');
     //scriptVyper.src = chrome.extension.getURL('/scripts/injected/vyper/utils/vyperUtil.js');
     //document.head.appendChild(scriptVyper);

    // Inject a the vyper util file in the current page
    var scriptElementCentricVyperStrategy = document.createElement('script');
    scriptElementCentricVyperStrategy.src = chrome.extension.getURL('/scripts/injected/vyper/strategies/ui5/elementCentric.js');
    document.head.appendChild(scriptElementCentricVyperStrategy);

     // Inject the jaro winkel distance util file in the current page
     //var jaroWinkelScript = document.createElement('script');
     //jaroWinkelScript.src = chrome.extension.getURL('/scripts/injected/vyper/utils/jaroWinBundle.js');
     //document.head.appendChild(jaroWinkelScript);
 
     /**
      * Delete the injected file, when it is loaded.
      */
     scriptUI5.onload = function () {
         scriptUI5.parentNode.removeChild(scriptUI5);
     };
 
     /**
      * Delete the injected file, when it is loaded.
      */
     //scriptVyper.onload = function () {
     //    scriptVyper.parentNode.removeChild(scriptVyper);
     //};

      /**
      * Delete the injected file, when it is loaded.
      */
     scriptElementCentricVyperStrategy.onload = function () {
        scriptElementCentricVyperStrategy.parentNode.removeChild(scriptElementCentricVyperStrategy);
    };

     /**
      * Delete the injected file, when it is loaded.
      */
     //jaroWinkelScript.onload = function () {
     //   jaroWinkelScript.parentNode.removeChild(jaroWinkelScript);
    //};
 
     // Create a port with background page for continuous message communication
     var port = chrome.extension.connect({name: 'do-ui5-detection'});
 
     // Listen for messages from the background page
     port.onMessage.addListener(function (message) {
         if (message.action === 'do-ui5-detection') {
             document.dispatchEvent(new Event('do-ui5-detection-injected'));
         }
     });
 
     /**
      *  Listens for messages from the injected script.
      */
     document.addEventListener('detect-ui5-content', function sendEvent(detectEvent) {
         // Send the received event detail object to background page
         port.postMessage(detectEvent.detail);
     }, false);
}());
