// Non UI5
// Get nodeName --> li,div, ...

// Define sequence of importance
//   0:title,name  1: id, 2:custom, 3:class [name, style, data-help-id, generally *id*, role, key, title...] (dont accept attributes with name: data-/*focus*,*context*, menu*, drag*, click, mouse,change,keydown, keyup, attached, maxlengh, or with value: funtion, (), {}, =, ; )
// 2 + system --> fill
// --> id & *-id*  & [name | title ]  --> 1 is enough (first with star, then with $ and without after) --> if not unque continue with wildcard
// --> other custom with restrictions --> 2 needs
// --> css (class, style)
// If id, concatinate and iterate [concat rules: _, ., [],/,\ ]
// Iterate through attributes
//document.querySelectorAll(*)
// var iframe = document.getElementById("application-ServiceContract-create")
//iframe.contentWindow.document.querySelectorAll('input[id*="btadminh_po_number_sold"]')
//$$('iframe')[1].contentDocument.querySelectorAll('input[id*="btadminh_po_number_sold"]')
/*
<iframe id ='if1'>
    <iframe id ='if2'>
        <iframe id ='if3'>
            <iframe id ='if4'>
                <input type='hidden' id ='elementToBeFound'>
            </iframe>
        </iframe>
    </iframe>
</iframe>
const elem = document.getElementById('if1').contentDocument
.getElementById('if2').contentDocument
.getElementById('if3').contentDocument
.getElementById('if4').contentDocument
.getElementById('elementToBeFound')

Contains innerText
function contains(selector, text) {
  var elements = document.querySelectorAll(selector);
  return Array.prototype.filter.call(elements, function(element){
    return RegExp(text).test(element.textContent);
  });
}
contains('div', 'sometext'); // find "div" that contain "sometext"
contains('div', /^sometext/); // find "div" that start with "sometext"
contains('div', /sometext$/i); // find "div" that end with "sometext", case-insensitive

by.cssContainingText 
---------------------
<ul>
  <li class="pet">Dog</li>
  <li class="pet">Cat</li>
</ul>
Code
// Returns the li for the dog, but not cat.
var dog = element(by.cssContainingText('.pet', 'Dog'));

*/

/*
Algorithm
------------------
1. Go through the dom and retrieve all iframes (generate all underlying switches)
-->await non_ui5.common.locator.switchToIframe("iframe[id='frame01']");
--> Switch in chrome (if necessary) with client script
--> Generate selectors for iframe switch use vyper reuse

Generate multiple vairants (one must be without id). Expose options as dropdown
-->let elem = await non_ui5.common.locator.getElementByCss(".input01", 1, 10000);
1. Find tag (node type)
2. Try each individual attribute 
-> Sequence of priority string, numbers, boolean
 -> If id, concatinate and iterate [concat rules: -,_, ., :, [],/,\ ] -> test uniqueness (first with star, then with $ and without after)
    -> Check uniqness of id parts
 -> Use distance as a proof of improovement
3. Try combination of each attribute values (if multiple exists class, style..)
    --> Use distance as a proof of improovement
4. Try combination of different attributes
    --> Use distance as a proof of improovement
5. Try combination of attributes and contains innerText
    --> let elem = await non_ui5.common.locator.getElementByCssContainingText(".input02", "John Doe", 2, 10000); 
    --> Use string attributes like name, id, title, aria, custom, class,
    --> Use distance as a proof of improovement
6. Use generic selector generator
    --> Remove replicated choices from above
    --> Use distance as a proof of improovement
7. Use xpath as fallback
--> Test with document evaluate

var a_tags = document.evaluate( '//a', document, null, XPathResult.ANY_TYPE, null);
var a = a_tags.iterateNext();

while (a) {
 console.log(a);
 a = a_tags.iterateNext();
}  

As preferable choose shortest path
 */

var firstDegreeAttributes = [
    "title",
    "tooltip",
    "name",
    "value",
    "id",
    "data-sap-ui",
    "src",
    "alt",
    "aria-labelledby",
    "aria-describedby",
    "aria-label",
    "aria-controls",
    "aria-colindex",
    "aria-rowindex"
  ];
var secondDegreeAttributes = [
    "type",
    "action",
    "for",
    "data-tl-id",
    "data-id",
    "style",
    "role",
    "class"
];
var cssSelectors = require('../../utils/cssSelectorsGen');
var xPathSelectors = require('../../utils/xPathGenerator');
var IdAndTextCentricStrategy = function() {
    var framArray = [];
    var aBlackListed = [];
    this.getIframe = function(oElement, oframeElement) {
        let aElms = oframeElement.contentDocument.querySelectorAll("[data-vyp-finder='1']");
        if(aElms && aElms.length === 1 && oElement.isSameNode(aElms[0])) {
            return oframeElement;
        } else {
            let frameChain = {};
            framArray.push(frameChain);
            frameChain["parent"] = oframeElement;
            frameChain["children"] = [];
            var aFrameElements = oframeElement.contentDocument.getElementsByTagName("iframe");
            if(aFrameElements && aFrameElements.length > 0)
                for (let index = 0; index < aFrameElements.length; index++) {
                    let iframElem = aFrameElements[index];
                    frameChain["children"].push(iframElem);
                    let framElement = this.getIframe(oElement, iframElem);  
                    if(framElement) return framElement;
                }
        }
        return null;
    };

    this.getIframeElement = function(oframeElement) {
        let frameChain = {};
        framArray.push(frameChain);
        frameChain["parent"] = oframeElement;
        frameChain["children"] = [];
        if(!oframeElement.contentDocument) return null;
        let aElms = oframeElement.contentDocument.querySelectorAll("[data-vyp-finder='1']");
        if(aElms && aElms.length === 1) {
            return {
                "iframe": oframeElement,
                "element": aElms[0]
            };
        } else {
            var aFrameElements = oframeElement.contentDocument.getElementsByTagName("iframe");
            if(aFrameElements && aFrameElements.length > 0)
                for (let index = 0; index < aFrameElements.length; index++) {
                    let iframElem = aFrameElements[index];
                    frameChain["children"].push(iframElem);
                    let oElm = this.getIframeElement(iframElem);  
                    if(oElm) {
                        return oElm;
                    }
                }
        }
        return null;
    };

    this.getTopDownAllIframes = function(aFrames) {
        var aFrameSels = [];
        
        //Button up
        // var elm = oElm.getRootNode();
        //if(elm.getElementById) {
        //    if(window.frameElement) {
        //        var ifrm = window.frameElement;
        //    }
        // }
        //-->(window.parent != window.top)
        //document = selectedElement.getRootNode()
        //while --> dd.defaultView.document.isSameNode(this.window.top.document)
        //while --> dd.defaultView.frameElement != null
        //--> document = dd.defaultView.frameElement.getRootNode()
        /*while(oElm) {
            if(oElm && oElm.nodeName === "IFRAME") {
                // 0 --> nearest, n --> farest
                aFrames.push(oElm);
            }
            oElm = oElm.parentNode;
        }
            const elem = document.getElementById('if1').contentDocument
            .getElementById('if2').contentDocument
            .getElementById('if3').contentDocument
            .getElementById('if4').contentDocument
            .getElementById('elementToBeFound')
            
        
        */
        /*if(window.top === window) {
            let aElms = document.querySelectorAll("[data-vyp-finder='1']");
            if(aElms && aElms.length === 1 && oElement.isSameNode(aElms[0])) {
                return aFrameSels;
            } else {
                framArray = [];
                var aFrameElements = document.getElementsByTagName("iframe");
                for (let index = 0; index < aFrameElements.length; index++) {
                    let iframElem = aFrameElements[index];
                    let candFrame = this.getIframe(oElement, iframElem);
                    if(candFrame){
                        aFrames.push(candFrame);
                        break;
                    } 
                }
            }
        }*/
        if(aFrames && aFrames.length > 0) {
             // Reverse n --> nearest, 0 --> farest
            for (let index = aFrames.length - 1; index >= 0; index--) {
                let oFrame = aFrames[index];
                const strSel = cssSelectors.getSelector(oFrame, oFrame.ownerDocument);
                if(this.testCssSelectors(strSel, oFrame, oFrame.ownerDocument)){
                    aFrameSels.push(strSel);
                }
            }
        }
        return aFrameSels;
    };

    this.getIframeChain = function(oElmFrame, frameHierachyBuilder) {
        if(framArray.length > 0) {
            var nextFrame = oElmFrame;
            for (let index = 0; index < framArray.length; index++) {
                const oFrameMap = framArray[index];
                if(oFrameMap && oFrameMap["children"] && oFrameMap["children"].length > 0) {
                    for (let i = 0; i < oFrameMap["children"].length; i++) {
                        const oChildFrame = oFrameMap["children"][i];
                        if(oChildFrame.isSameNode(nextFrame)){
                            frameHierachyBuilder.push(oFrameMap["parent"]);
                            nextFrame = oFrameMap["parent"];
                            this.getIframeChain(nextFrame, frameHierachyBuilder);
                        }
                    }
                }
            }
        }
    }

    this.getElementWithVyperAttribute = function() {
        var oElm = null;
        frameHierachyBuilder = [];
        framArray = [];
        if(window.top === window) {
            var aFrameElements = document.getElementsByTagName("iframe");
            for (let index = 0; index < aFrameElements.length; index++) {
                let iframElem = aFrameElements[index];
                let oElFramObj = this.getIframeElement(iframElem);
                if(oElFramObj && oElFramObj.element){
                    oElm = oElFramObj.element;
                    frameHierachyBuilder.push(oElFramObj.iframe);
                    break;
                } 
            }
            if(framArray.length > 0 && frameHierachyBuilder.length > 0) {
                this.getIframeChain(frameHierachyBuilder[0], frameHierachyBuilder);
            }
        }
        return {
            "element": oElm,
            "frames": frameHierachyBuilder
        };
    };

    this.generateVyperCodeForCssIframe = function(aFrames) {
        aResSelectors = this.getTopDownAllIframes(aFrames);
        var mResults = {};
        if(aResSelectors) {
            for (let index = 0; index < aResSelectors.length; index++) {
                const sSel = aResSelectors[index];
                let sKey = "iframe " + (index + 1);
                mResults[sKey] = { "selector": sSel, "action": ""};
                mResults[sKey]["action"] = "non_ui5.common.locator.switchToIframe";
            }
        }
        return mResults;
    };

    this.retrieveDomProperties = function(oNode) {
        var domProperties = [];
        if(!oNode) return domProperties;
        domProperties.push({
            "nodeName" : oNode.nodeName
        });
        if(oNode.attributes && oNode.attributes.length > 0) {
            for (let index = 0; index < oNode.attributes.length; index++) {
                var oElm = oNode.attributes[index];
                if(oElm.nodeName && oElm.nodeValue) {
                    if(
                        oElm.nodeValue.indexOf('%') === -1 &&
                        oElm.nodeValue.indexOf('px') === -1 &&
                        oElm.nodeValue.indexOf('rem') === -1 &&
                        oElm.nodeValue.indexOf('true') === -1 &&
                        oElm.nodeValue.indexOf('false') === -1) {
                            var nodeNm = oElm.nodeName;
                            var nodeValue = oElm.nodeValue;
                            var nodeVN = {};
                            nodeVN[nodeNm] = nodeValue;
                            domProperties.push(nodeVN);
                    }
                }
            }
        }
        return domProperties;
    };

    this.containsText = function(selector, text, contentDocument) {
        var elements = contentDocument.querySelectorAll(selector);
        return Array.prototype.filter.call(elements, function(element){
          return RegExp(text).test(element.textContent);
        });
    };

    this.distance = function(sSelector, oElem, contentDocument, isXpath) {
        var aElms = [];
        if(sSelector){
            if(isXpath) {
                let xPathRes = contentDocument.evaluate(sXpathSelector, contentDocument, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
                let oElem = xPathRes.iterateNext(); 
                if(!oElem) {
                    return 99;
                } 
                let count = 1;
                while (oElem) {
                    oElem = iterator.iterateNext();
                    count++;
                } 
                if(count === 1){
                    if(this.testXPathSelectors(sSelector, oElem, contentDocument)){
                        return 0;
                    }
                }
                return count + 1;
            } else {
                aElms = contentDocument.querySelectorAll(sSelector);
                if(aElms.length === 0) return  99;
                if(aElms.length === 1) {
                    if(this.testCssSelectors(sSelector, oElem, contentDocument)){
                        return 0;
                    }
                }
                return aElms.length + 1;
            }
        }
        return 999;
    };

    this.testCssSelectors= function(sSelector, oElement, contentDocument) {
        if(sSelector && oElement){
            if(contentDocument.querySelectorAll(sSelector).length > 1 ||
            contentDocument.querySelectorAll(sSelector).length === 0) {
                return null;
            }
            let oElem = contentDocument.querySelector(sSelector);
            if(oElement.isEqualNode(oElem) &&
                oElement.isSameNode(oElem)){
                    return oElem;
            }
        }
        return null;
    };

    this.testXPathSelectors = function(sXpathSelector, oElement, contentDocument) {
        if(sXpathSelector && oElement){
            var xPathRes = contentDocument.evaluate(sXpathSelector, contentDocument, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
            var oElem = xPathRes.iterateNext();
            if(!oElem) {
                //Retry
                xPathRes = contentDocument.evaluate(sXpathSelector, contentDocument, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
                oElem = xPathRes.iterateNext();
            } 
            var nextElm = xPathRes.iterateNext();
            if(!oElem || nextElm) {
                return null;
            } 
            if(oElement.isEqualNode(oElem) &&
                oElement.isSameNode(oElem)){
                    return oElem;
            }
        }
        return null;
    };

    ////TO BE CONSIDERED LATER IF INDEX IS NEEDED
    /*
      this.testXPathSelectors = function(sXpathSelector, oElement, contentDocument) {
        if(sXpathSelector && oElement){
            var xPathRes = contentDocument.evaluate(sXpathSelector, contentDocument, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
            var oElem = xPathRes.iterateNext();
            if(!oElem) {
                return null;
            }
            if(oElement.isEqualNode(oElem) &&
                oElement.isSameNode(oElem)){
                    return {
                        "element": oElem,
                        "index": 0
                    };
            }
            let index = 1;
            while (oElem && !oElement.isSameNode(oElem)) {
                oElem = xPathRes.iterateNext();
                if(oElement.isEqualNode(oElem) &&
                oElement.isSameNode(oElem)){
                    return {
                        "element": oElem,
                        "index": index
                    };
                }
                index++;
            }
        }
        return null;
    };
    
    */

    this.getDomPropertyObject = function(aDomProps, sKey) {
        for (let index = 0; index < aDomProps.length; index++) {
            const oAttr = aDomProps[index];
            let key = Object.keys(oAttr)[0];
            let val = oAttr[key];
            if(key === sKey) {
                return oAttr;
            }
        }
    };
    
    this.getAllDomPropertyKeys = function(aDomAttrs) {
        let aAttrNames = [];
        for (let index = 0; index < aDomAttrs.length; index++) {
            const oAttr = aDomAttrs[index];
            let key = Object.keys(oAttr)[0];
            aAttrNames.push(key);
        }
        return aAttrNames;
    };

    this.testId = function (sId, sSelector, oElem, contentDocument){
        var conC = ['#','-','_','.',':','[',']','/'];
        
        for (let index = 0; index < conC.length; index++) {
            const sChar = conC[index];
            let aConc = sId.split(sChar);
            let sPart = "";
            for (let i = 0; i < aConc.length; i++) {
                if(sPart) {
                    sPart = sPart + sChar + aConc[i];
                } else {
                    sPart = aConc[i];
                }
                let sSel = "";
                if(i <= aConc.length - 2 && sPart !== sId) {
                    sSel = sSelector + '[id*="' + sPart + '"]';
                } else {
                    sSel = sSelector + '[id="' + sPart + '"]';
                }
                if(this.distance(sSel, oElem, contentDocument) === 0) {
                    return sSel;
                }
            }
        }
        return null;
    };

    this.getSelectorsEachAtributeWithText = function(oElement, contentDocument) {
        let aSels = [];
        if(oElement.textContent){
            let aAttrs = this.retrieveDomProperties(oElement);
            let oAttr = this.getDomPropertyObject(aAttrs, "nodeName");
            let sSelector = oAttr["nodeName"];
            for (let index = 0; index < aAttrs.length; index++) {
                const oAttr = aAttrs[index];
                let key = Object.keys(oAttr)[0];
                let val = oAttr[key];
                if(val.indexOf('};') !== -1 || val.indexOf('}') !== -1
                || val.indexOf('{') !== -1 || val.indexOf(');') !== -1) {
                    continue;
                }
                if(key !== "nodeName") {
                    let sSel = sSelector;
                    if(key === "id") {
                        let sIdSel = this.testId(val, sSelector, oElement, contentDocument);
                        if(sIdSel) aSels.push(sIdSel);
                        sSel = sSel + '[' + key + '="' + val + '"]';
                        if(oElement.textContent !== null && oElement.textContent !== undefined) {
                            let aRes = this.containsText(sSel, oElement.textContent.trim(), contentDocument);
                            if(aRes && aRes.length === 1) {
                                sSel = sSel + "', '" + oElement.textContent.trim();
                                aSels.push(sSel);
                            }
                        }
                    } else {
                        sSel = sSel + '[' + key + '="' + val + '"]';
                        if(oElement.textContent !== null && oElement.textContent !== undefined) {
                            let aRes = this.containsText(sSel, oElement.textContent.trim(), contentDocument);
                            if(aRes && aRes.length === 1) {
                                sSel = sSel + "', '" + oElement.textContent.trim();
                                aSels.push(sSel);
                            }
                        }
                    }
                } else {
                    if(oElement.textContent !== null && oElement.textContent !== undefined) {
                        let aRes = this.containsText(sSelector, oElement.textContent.trim(), contentDocument);
                        if(aRes && aRes.length === 1) {
                            sSel = sSelector + "', '" + oElement.textContent.trim();
                            aSels.push(sSel);
                        }
                    }
                }
            }
        }
        return aSels;
    };
    
    this.getSelectorsEachAtribute = function(oElement, contentDocument) {
        let aSels = [];
        let aAttrs = this.retrieveDomProperties(oElement);
        let oAttr = this.getDomPropertyObject(aAttrs, "nodeName");
        let sSelector = oAttr["nodeName"];
        for (let index = 0; index < aAttrs.length; index++) {
            const oAttr = aAttrs[index];
            let key = Object.keys(oAttr)[0];
            let val = oAttr[key];
            if(val.indexOf('};') !== -1 || val.indexOf('}') !== -1
            || val.indexOf('{') !== -1 || val.indexOf(');') !== -1) {
                aBlackListed.push(key);
                continue;
            }
            if(key !== "nodeName") {
                let sSel = sSelector;
                if(key === "id") {
                    let sIdSel = this.testId(val, sSelector, oElement, contentDocument);
                    if(sIdSel)  aSels.push(sIdSel);
                } else {
                    sSel = sSel + '[' + key + '="' + val + '"]';
                    if(this.distance(sSel, oElement, contentDocument) === 0) {
                        aSels.push(sSel);
                    }
                }
            } else {
                if(this.distance(sSelector, oElement, contentDocument) === 0) {
                    aSels.push(sSelector);
                }
            }
        }
        return aSels;
    };

    this.combiCandAttrs = function(oElement, contentDocument) {
        let aSels = [];
        let aAttrs = this.retrieveDomProperties(oElement);
        let oAttr = this.getDomPropertyObject(aAttrs, "nodeName");
        let sSelector = oAttr["nodeName"];
        let dist = 999;
        let finalSel = sSelector;
        if(aCandAttributes) {
            let sSel = sSelector;
            for (let index = 0; index < aCandAttributes.length; index++) {
                const oAttr = aCandAttributes[index];
                let key = Object.keys(oAttr)[0];
                let val = oAttr[key];
                if(val.indexOf('};') !== -1 || val.indexOf('}') !== -1
                || val.indexOf('{') !== -1 || val.indexOf(');') !== -1) {
                    continue;
                }
                if(key !== "nodeName") {
                    if(key === "id") {
                        let sIdSel = this.testId(val, sSelector, oElement, contentDocument);
                        if(sIdSel) {
                            aSels.push(sIdSel);
                            sSel = sSelector;
                        }
                    } else {
                        sSel = sSel + '[' + key + '="' + val + '"]';
                        let dSel = this.distance(sSel, oElement, contentDocument);
                        if(dSel === 0) {
                            aSels.push(sIdSel);
                            sSel = sSelector;
                            continue;
                        }
                        if(dSel < dist) {
                            dist = dSel;
                            finalSel = sSel;
                        } else {
                            sSel = finalSel;
                        }
                    }
                }
            }
        }
        return aSels;
    }

    var aCandAttributes = [];
    this.getSelectorsEachTogetherAtribute = function(oElement, contentDocument) {
        let aSels = [];
        let aAttrs = this.retrieveDomProperties(oElement);
        let oAttr = this.getDomPropertyObject(aAttrs, "nodeName");
        let sSelector = oAttr["nodeName"];
        let sSel = sSelector;
        for (let index = 0; index < aAttrs.length; index++) {
            const oAttr = aAttrs[index];
            let key = Object.keys(oAttr)[0];
            let val = oAttr[key];
            if(val.indexOf('};') !== -1 || val.indexOf('}') !== -1
            || val.indexOf('{') !== -1 || val.indexOf(');') !== -1) {
                continue;
            }
            let dist = 999;
            if(key !== "nodeName") {
                let sSelNew = sSel + '[' + key + '="' + val + '"]';
                if(key === "id") {
                    let sIdSel = this.testId(val, sSelector, oElement, contentDocument);
                    if(sIdSel) {
                        aSels.push(sIdSel);
                        sSel = sSelector;
                    } else {
                        let dSel = this.distance(sSelNew, oElement, contentDocument);
                        if(dSel === 0) {
                            aSels.push(sSelNew);
                            sSel = sSelector;
                            continue;
                        }
                        if(sSelNew && dSel < dist) {
                            dist = dSel;
                            sSel = sSelNew;
                            oAttr.dist = dist;
                            aCandAttributes.push(oAttr);
                        }
                    }
                } else {
                    let dSel = this.distance(sSelNew, oElement, contentDocument);
                    if(dSel === 0) {
                        aSels.push(sSelNew);
                        sSel = sSelector;
                        continue;
                    }
                    if(sSelNew && dSel < dist) {
                        dist = dSel;
                        sSel = sSelNew;
                        oAttr.dist = dist;
                        aCandAttributes.push(oAttr);
                    }
                }
            }
        }
        if(aSels.length === 0 && aCandAttributes.length > 5) {
            aCandAttributes = this.sortDescDistance(aCandAttributes);
            aCandAttributes.length = 5;
        }
        if(aCandAttributes) {
            for (let index = 0; index < aCandAttributes.length; index++) {
                let oAttr = aCandAttributes[index];
                if(oAttr.dist !== undefined && oAttr.dist !== null) {
                    delete oAttr.dist;
                }
            }
        }
        return aSels;
    };

    this.mergeUniqueArrays = function(aItems1, aItems2) {
        if(!aItems1 && !aItems2) return [];
        if(!aItems1) return aItems2;
        if(!aItems2) return aItems1;
        return aItems1.concat(aItems2.filter((item) => aItems1.indexOf(item) < 0))
    };

    this.validateSelectors= function(oElement, aSelectors, contentDocument, isXpath){
        var aSels = [];
        for (let index = 0; index < aSelectors.length; index++) {
            let sSel = aSelectors[index];
            if(isXpath) {
                let oElem = this.testXPathSelectors(sSel, oElement, contentDocument);
                if(oElem) {
                    aSels.push(sSel);
                }
            } else {
                let oElem = this.testCssSelectors(sSel, oElement, contentDocument);
                if(oElem) {
                    aSels.push(sSel);
                }
            }
        }
        return aSels;
    };

    this.mergeResultsIntoOneArray= function(
        oElement, 
        aOwnSelectors,
        aOwnSelectorsWithText,
        aSelectorsAttrFirst,
        aSelectorsAttrFirstSec,
        aSelectorsAttrFirstSecNoId,
        aSelectorsAttrOwnAll,
        aSelectorsAttrOwnAllNoIdLike, contentDocument){
            let allSelectors = [];
            let aValidOwnSelectorsAttrFirst = this.validateSelectors(oElement, aOwnSelectors, contentDocument);
            let aValidSelectorsAttrFirst = this.validateSelectors(oElement, aSelectorsAttrFirst, contentDocument);
            if(aValidOwnSelectorsAttrFirst) {
                allSelectors = this.mergeUniqueArrays(aValidOwnSelectorsAttrFirst, aValidSelectorsAttrFirst);
            } else {
                allSelectors = [].concat(aValidSelectorsAttrFirst);
            }

            //Text already validated dont repeat yourself
            if(aOwnSelectorsWithText) {
                allSelectors = this.mergeUniqueArrays(allSelectors, aOwnSelectorsWithText);
            }

            let aValidSelectorsAttrFirstSec = this.validateSelectors(oElement, aSelectorsAttrFirstSec, contentDocument);
            allSelectors = this.mergeUniqueArrays(allSelectors, aValidSelectorsAttrFirstSec);

            let aValidSelectorsAttrFirstSecNoId = this.validateSelectors(oElement, aSelectorsAttrFirstSecNoId, contentDocument);
            allSelectors = this.mergeUniqueArrays(allSelectors, aValidSelectorsAttrFirstSecNoId);

            let aValidSelectorsAttrOwnAll = this.validateSelectors(oElement, aSelectorsAttrOwnAll, contentDocument);
            allSelectors = this.mergeUniqueArrays(allSelectors, aValidSelectorsAttrOwnAll);

            let aValidSelectorsAttrOwnAllNoIdLike = this.validateSelectors(oElement, aSelectorsAttrOwnAllNoIdLike, contentDocument);
            allSelectors = this.mergeUniqueArrays(allSelectors, aValidSelectorsAttrOwnAllNoIdLike);
            
            return this.sortShorterFirstCssSelectors(allSelectors);
    };

    this.sortShorterFirstCssSelectors= function(allSelectors) {
        return [].concat(allSelectors).sort(function(a, b) {
            return a.length - b.length || // sort by length, if equal then
                   a.localeCompare(b);    // sort by dictionary order
          });
    };

    this.sortDescDistance = function(candSelectors) {
        return [].concat(candSelectors).sort(function(a, b) {
            return a.dist > b.dist;
          });
    };


    this.generateVyperCodeForCss = function(aResSelectors) {
        var mResults = {};
        if(aResSelectors) {
            for (let index = 0; index < aResSelectors.length; index++) {
                const sSel = aResSelectors[index];
                let sKey = "alternative css " + (index + 1);
                mResults[sKey] = { "selector": sSel, "action": ""};
                if(sSel.indexOf("', '") !== -1) {
                    mResults[sKey]["action"] = "non_ui5.common.locator.getElementByCssContainingText"; 
                } else {
                    mResults[sKey]["action"] = "non_ui5.common.locator.getElementByCss";
                }
            }
        }
        return mResults;
    };

    this.generateVyperCodeForXPath = function(aResSelectors) {
        var mResults = {};
        if(aResSelectors) {
            for (let index = 0; index < aResSelectors.length; index++) {
                const sSel = aResSelectors[index];
                let sKey = "alternative xpath " + (index + 1);
                mResults[sKey] = { "selector": sSel, "action": ""};
                mResults[sKey]["action"] = "non_ui5.common.locator.getElementByXPath";
            }
        }
        return mResults;
    };

    this.testAndSortAllXpaths= function(aResSelectors, oElem, contentDocument) {
        if(aResSelectors) {
            let aSelectors = this.validateSelectors(oElem, aResSelectors, contentDocument, true);
            return this.sortShorterFirstCssSelectors(aSelectors);
        }
        return [];
    }

    this.getAllElementSelectors = function(oElement, oContentDocument) {
        aBlackListed = [];    
        aCandAttributes = [];
        let aOwnSelectors = this.getSelectorsEachAtribute(oElement, oContentDocument);
        let aOwnSelectorsWithText = [];
        if(aOwnSelectors.length < 6) {
            aOwnSelectors = this.mergeUniqueArrays(aOwnSelectors, this.getSelectorsEachTogetherAtribute(oElement, oContentDocument));
            if(aOwnSelectors.length < 3) {
                if(aCandAttributes.length > 0) {
                    aOwnSelectors = this.mergeUniqueArrays(aOwnSelectors, this.combiCandAttrs(oElement, oContentDocument));
                }
            }
            aOwnSelectorsWithText = this.getSelectorsEachAtributeWithText(oElement, oContentDocument);
        }
        //Clear blacklisted attributes
        firstDegreeAttributes = firstDegreeAttributes.filter(function(value){ 
            return !aBlackListed.includes(value);
        });
        //Second blacklisted attributes
        secondDegreeAttributes = secondDegreeAttributes.filter(function(value){ 
            return !aBlackListed.includes(value);
        });
        //Use first degree attributes
        let aSelectorsAttrFirst = cssSelectors.getSelectors(oElement, oContentDocument, firstDegreeAttributes);
        //Use first degree + second degree
        let aSelectorsAttrFirstSec = cssSelectors.getSelectors(oElement, oContentDocument, this.mergeUniqueArrays(firstDegreeAttributes, secondDegreeAttributes));
        //Use first degree without id + second degree
        let aFirstDegreeAttrs = [].concat(firstDegreeAttributes);
        let aFilteredWithoutId = aFirstDegreeAttrs.filter(function(value){ 
            return value !== "aria-labelledby" && 
            value !== "id" &&
            value !== "data-sap-ui" && 
            value !== "aria-describedby";
        });
        let aSelectorsAttrFirstSecNoId = cssSelectors.getSelectors(oElement, oContentDocument, this.mergeUniqueArrays(aFilteredWithoutId, secondDegreeAttributes));
        // Use all attributes given by element
        let aAttrs = this.retrieveDomProperties(oElement);
        let aAttrsName = this.getAllDomPropertyKeys(aAttrs) || [];
        //Clear blacklisted attributes
        aAttrsName = aAttrsName.filter(function(value){ 
            return !aBlackListed.includes(value);
        });
        let aSelectorsAttrOwnAll = cssSelectors.getSelectors(oElement,oContentDocument, aAttrsName);
        // Use all attributes except id like fields.
        aAttrs = this.retrieveDomProperties(oElement);
        aAttrsName = this.getAllDomPropertyKeys(aAttrs) || [];
        //Clear blacklisted attributes
        aAttrsName = aAttrsName.filter(function(value){ 
            return !aBlackListed.includes(value);
        });
        aFilteredWithoutId = aAttrsName.filter(function(value){ 
            return value !== "aria-labelledby" && 
            value !== "id" &&
            value !== "data-sap-ui" && 
            value !== "aria-describedby";
        });
        let aSelectorsAttrOwnAllNoIdLike = cssSelectors.getSelectors(oElement, oContentDocument, aFilteredWithoutId);

        // Merge all results
        let mergedResults = this.mergeResultsIntoOneArray(
            oElement,
            aOwnSelectors,
            aOwnSelectorsWithText, 
            aSelectorsAttrFirst,
            aSelectorsAttrFirstSec,
            aSelectorsAttrFirstSecNoId,
            aSelectorsAttrOwnAll,
            aSelectorsAttrOwnAllNoIdLike,
            oContentDocument
        );

        /*if(mergedResults && mergedResults.length > 5){
            //Generate Vyper reuse methods
            return this.generateVyperCodeForCss(mergedResults);
        } else {*/
            // Fallback xPath
        xPathSelectors.setDocumentRoot(oContentDocument);
        let allAttributes = aAttrsName.concat(firstDegreeAttributes).concat(secondDegreeAttributes);
        aAllXpaths = xPathSelectors.findAllXpaths(oElement, allAttributes);
        let mergeXpaths = [].concat(this.testAndSortAllXpaths(aAllXpaths, oElement, oContentDocument));
        //Generate Vyper reuse methods
        let mResCss = this.generateVyperCodeForCss(mergedResults);
        let mResXPath = this.generateVyperCodeForXPath(mergeXpaths);

            return Object.assign(mResCss, mResXPath);
        //}
    };

    this.buildElementSelectors = function(oElement, aFrames) {
        var mOption = {};
        var mFrameResults = {};
        var mSelsActionResults = {};
        var oContentDocument = document;
        if(oElement) {
            mFrameResults = this.generateVyperCodeForCssIframe(aFrames);
            if(aFrames && aFrames.length > 0) {
                let oContFrame = aFrames[0];
                oContentDocument = oContFrame.contentDocument;
            }
            mSelsActionResults = this.getAllElementSelectors(oElement, oContentDocument);
            let sCodeFrag = "";
            if(mFrameResults) {
                let oFramesKeys = Object.keys(mFrameResults);
                for (let index = 0; index < oFramesKeys.length; index++) {
                    const sKey = oFramesKeys[index];
                    let sSel = mFrameResults[sKey]["selector"];
                    let sActions = mFrameResults[sKey]["action"];
                    sCodeFrag = sCodeFrag + "await " + sActions + "('" + sSel + "');";
                }
            }
            if(!mSelsActionResults) return "No valid selector could be generated";
            if(mSelsActionResults) {
                let oSelsKeys = Object.keys(mSelsActionResults);
                for (let index = 0; index < oSelsKeys.length; index++) {
                    const sKey = oSelsKeys[index];
                    let sSel = mSelsActionResults[sKey]["selector"];
                    let sActions = mSelsActionResults[sKey]["action"];
                    let sCode = sCodeFrag + "let elem = await " + sActions + "('" + sSel + "');";
                    mOption[sKey]= sCode;
                }
            }
        }
        return mOption;
    };

    this.formatStringVals = function() {
        var a = "[{'column1':'value0','column2':'value1','column3':'value2'}]";
        var b = a.replace("'", "\"");
        console.log(b);
    }

    this.buildElementSelectorsStr = function(mSelsActionResults, mFrameResults) {
        var sCode = "";
        if(mFrameResults) {
            let oFramesKeys = Object.keys(mFrameResults);
            for (let index = 0; index < oFramesKeys.length; index++) {
                const sKey = oFramesKeys[index];
                let sSel = mFrameResults[sKey]["selector"];
                let sActions = mFrameResults[sKey]["action"];
                sCode = sCode + "await " + sActions + "(" + sSel + ");";
            }
        }
        if(!mSelsActionResults) return "No valid selector could be generated";
        if(mSelsActionResults) {
            let oSelsKeys = Object.keys(mSelsActionResults);
            for (let index = 0; index < oSelsKeys.length; index++) {
                const sKey = oSelsKeys[index];
                let sSel = mSelsActionResults[sKey]["selector"];
                let sActions = mSelsActionResults[sKey]["action"];
                sCode = sCode + "await " + sActions + "(" + sSel + ");";
            }
        }
        return sCode;
    };
};
window.IdAndTextCentricStrategy = new IdAndTextCentricStrategy();
module.exports = window.IdAndTextCentricStrategy;