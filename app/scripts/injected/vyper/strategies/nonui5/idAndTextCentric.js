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

    this.getAllIframes = function(oElement) {
        var aFrameSels = [];
        var aFrames = [];
        var oElm = oElement;
        var elm = oElm.getRootNode();
        if(elm.getElementById) {
            if(window.frameElement) {
                var ifrm = window.frameElement;
            }
        }
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
        }*/
        if(aFrames.length > 0) {
             // Reverse n --> nearest, 0 --> farest
            for (let index = aFrames.length; index >= 0; index--) {
                let oFrame = aFrames[index];
                const strSel = cssSelectors.getSelector(oFrame);
                if(this.testCssSelectors(strSel)){
                    aFrameSels.push(strSel);
                }
            }
        }
        return aFrameSels;
    };

    this.generateVyperCodeForCssIframe = function(oElement) {
        aResSelectors = this.getAllIframes(oElement);
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

    this.containsText = function(selector, text) {
        var elements = document.querySelectorAll(selector);
        return Array.prototype.filter.call(elements, function(element){
          return RegExp(text).test(element.textContent);
        });
    };

    this.distance = function(sSelector, oElem, isXpath) {
        var aElms = [];
        if(sSelector){
            if(isXpath) {
                let xPathRes = document.evaluate(sXpathSelector, document, null, XPathResult.ANY_TYPE, null);
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
                    if(this.testXPathSelectors(sSelector, oElem)){
                        return 0;
                    }
                }
                return count + 1;
            } else {
                aElms = document.querySelectorAll(sSelector);
                if(aElms.length === 0) return  99;
                if(aElms.length === 1) {
                    if(this.testCssSelectors(sSelector, oElem)){
                        return 0;
                    }
                }
                return aElms.length + 1;
            }
        }
        return 999;
    };

    this.testCssSelectors= function(sSelector, oElement) {
        if(sSelector && oElement){
            if(document.querySelectorAll(sSelector).length > 1 ||
            document.querySelectorAll(sSelector).length === 0) {
                return null;
            }
            let oElem = document.querySelector(sSelector);
            if(oElement.isEqualNode(oElem) &&
                oElement.isSameNode(oElem)){
                    return oElem;
            }
        }
        return null;
    };

    this.testXPathSelectors = function(sXpathSelector, oElement) {
        if(sXpathSelector && oElement){
            var xPathRes = document.evaluate(sXpathSelector, document, null, XPathResult.ANY_TYPE, null);
            var oElem = xPathRes.iterateNext(); 
            if(!oElem || xPathRes.iterateNext()) {
                return null;
            } 
            if(oElement.isEqualNode(oElem) &&
                oElement.isSameNode(oElem)){
                    return oElem;
            }
        }
        return null;
    };

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

    this.testId = function (sId, sSelector, oElem){
        var conC = ['-','_','.',':','[',']','/'];
        
        for (let index = 0; index < conC.length; index++) {
            const sChar = conC[index];
            let aConc = sId.split(sChar);
            let sPart = "";
            for (let i = 0; i < aConc.length; i++) {
                if(sPart) {
                    sPart = sPart + sChar + aConc[i];
                } else {
                    sPart = sChar;
                }
                let sSel = "";
                if(index < conC.length - 2) {
                    sSel = sSelector + "[id*='" + sPart + "']";
                } else {
                    sSel = sSelector + "[id='" + sPart + "']";
                }
                if(this.distance(sSel, oElem) === 0) {
                    return sSel;
                }
            }
        }
        return null;
    };

    this.getSelectorsEachAtributeWithText = function(oElement) {
        if(oElement.textContent){
            let aAttrs = this.retrieveDomProperties(oElement);
            let oAttr = this.getDomPropertyObject(aAttrs, "nodeName");
            let sSelector = oAttr["nodeName"];
            for (let index = 0; index < aAttrs.length; index++) {
                const oAttr = aAttrs[index];
                let key = Object.keys(oAttr)[0];
                let val = oAttr[key];
                if(key !== "nodeName") {
                    let sSel = sSelector;
                    if(key === "id") {
                        let sIdSel = this.testId(val, sSelector, oElement);
                        if(sIdSel) return sIdSel;
                    } else {
                        sSel = sSel + "[" + key + "='" + val + "']";
                        let aRes = this.containsText(sSel, oElement.textContent);
                        if(aRes && aRes.length === 1) {
                            sSel = sSel + ", text=" + oElement.textContent;
                            return sSel;
                        }
                    }
                }
            }
        }
        return null;
    };

    this.getSelectorsEachAtribute = function(oElement) {
        let aAttrs = this.retrieveDomProperties(oElement);
        let oAttr = this.getDomPropertyObject(aAttrs, "nodeName");
        let sSelector = oAttr["nodeName"];
        for (let index = 0; index < aAttrs.length; index++) {
            const oAttr = aAttrs[index];
            let key = Object.keys(oAttr)[0];
            let val = oAttr[key];
            if(key !== "nodeName") {
                let sSel = sSelector;
                if(key === "id") {
                    let sIdSel =this.testId(val, sSelector, oElement);
                    if(sIdSel) return sIdSel;
                } else {
                    sSel = sSel + "[" + key + "='" + val + "']";
                    if(this.distance(sSel, oElement) === 0) {
                        return sSel;
                    }
                }
            }
        }
        return null;
    };

    var aCandAttributes = [];
    this.getSelectorsEachTogetherAtribute = function(oElement) {
        let aAttrs = this.retrieveDomProperties(oElement);
        let oAttr = this.getDomPropertyObject(aAttrs, "nodeName");
        let sSelector = oAttr["nodeName"];
        let sSel = sSelector;
        for (let index = 0; index < aAttrs.length; index++) {
            const oAttr = aAttrs[index];
            let key = Object.keys(oAttr)[0];
            let val = oAttr[key];
            let dist = 999;
            if(key !== "nodeName") {
                
                if(key === "id") {
                    let  sIdSel = this.testId(val, sSelector, oElement);
                    if(sIdSel) {
                        let dId = this.distance(sIdSel, oElement)
                        if(dId < dist) {
                            sSel = sIdSel;
                            aCandAttributes.push(oAttr);
                            if(aCandAttributes.length > 3) {
                                aCandAttributes.shift();
                            }
                        }
                    };
                } else {
                    sSel = sSel + "[" + key + "='" + val + "']";
                    if(this.distance(sSel, oElement) === 0) {
                        return sSel;
                    }
                    if(sSel) {
                        let dSel = this.distance(sSel, oElement)
                        if(dSel < dist) {
                            sSel = dSel;
                            if(aCandAttributes.length > 3) {
                                aCandAttributes.shift();
                            }
                        }
                    };
                }
            }
        }
        return null;
    };

    this.mergeUniqueArrays = function(aItems1, aItems2) {
        if(!aItems1 || !aItems2) return [];
        return aItems1.concat(aItems2.filter((item) => aItems1.indexOf(item) < 0))
    };

    this.validateSelectors= function(oElement, aSelectors, isXpath){
        var aSels = [];
        for (let index = 0; index < aSelectors.length; index++) {
            let sSel = aSelectors[index];
            if(isXpath) {
                sSel = this.testXPathSelectors(sSel, oElement);
                if(sSel) {
                    aSels.push(sSel);
                }
            } else {
                sSel = this.testCssSelectors(sSel, oElement);
                if(sSel) {
                    aSels.push(sSel);
                }
            }
        }
        return aSels;
    };

    this.mergeResultsIntoOneArray= function(oElement, sSelector, 
        aSelectorsAttrFirst,
        aSelectorsAttrFirstSec,
        aSelectorsAttrFirstSecNoId,
        aSelectorsAttrOwnAll,
        aSelectorsAttrOwnAllNoIdLike){
            let allSelectors = [];
            let mySel = [];
            let aValidSelectorsAttrFirst = this.validateSelectors(oElement, aSelectorsAttrFirst);
            if(sSelector) {
                mySel.push(sSelector);
                if(validSels)
                allSelectors = this.mergeUniqueArrays(mySel, aValidSelectorsAttrFirst);
            } else {
                allSelectors = [].concat(aValidSelectorsAttrFirst);
            }

            let aValidSelectorsAttrFirstSec = this.validateSelectors(oElement, aSelectorsAttrFirstSec);
            allSelectors = this.mergeUniqueArrays(allSelectors, aValidSelectorsAttrFirstSec);

            let aValidSelectorsAttrFirstSecNoId = this.validateSelectors(oElement, aSelectorsAttrFirstSecNoId);
            allSelectors = this.mergeUniqueArrays(allSelectors, aValidSelectorsAttrFirstSecNoId);

            let aValidSelectorsAttrOwnAll = this.validateSelectors(oElement, aSelectorsAttrOwnAll);
            allSelectors = this.mergeUniqueArrays(allSelectors, aValidSelectorsAttrOwnAll);

            let aValidSelectorsAttrOwnAllNoIdLike = this.validateSelectors(oElement, aSelectorsAttrOwnAllNoIdLike);
            allSelectors = this.mergeUniqueArrays(allSelectors, aValidSelectorsAttrOwnAllNoIdLike);
            
            return this.sortShorterFirstCssSelectors(allSelectors);
    };

    this.sortShorterFirstCssSelectors= function(allSelectors) {
        return [].concat(allSelectors).sort(function(a, b) {
            return a.length - b.length || // sort by length, if equal then
                   a.localeCompare(b);    // sort by dictionary order
          });
    };


    this.generateVyperCodeForCss = function(aResSelectors) {
        var mResults = {};
        if(aResSelectors) {
            for (let index = 0; index < aResSelectors.length; index++) {
                const sSel = aResSelectors[index];
                let sKey = "alternative css " + (index + 1);
                mResults[sKey] = { "selector": sSel, "action": ""};
                if(sSel.indexOf(", text=") !== -1) {
                    mResults[sKey]["action"] = "non_ui5.common.locator.getElementByCssContainingText"; 
                } else {
                    mResults[sKey]["action"] = "non_ui5.common.locator.getElementByCss";
                }
            }
        }
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
    };

    this.testAndSortAllXpaths= function(oElem, aResSelectors) {
        if(aResSelectors) {
            let aSelectors = this.validateSelectors(oElem, aResSelectors, true);
            return this.sortShorterFirstCssSelectors(aSelectors);
        }
        return [];
    }

    this.getAllElementSelectors = function(oElement) {
        aCandAttributes = [];
        let sSelector = this.getSelectorsEachAtribute(oElement);
        if(!sSelector) {
            sSelector = this.getSelectorsEachTogetherAtribute(oElement);
            if(!sSelector) {

                if(aCandAttributes.length > 0) {
                    sSelector = this.combiCandAttrs(oElement);
                    if(!sSelector) {
                        sSelector = this.getSelectorsEachAtributeWithText(oElement);
                    }
                }
            }
        }
        //Use first degree attributes
        let aSelectorsAttrFirst = cssSelectors.getSelectors(oElement, firstDegreeAttributes);
        //Use first degree + second degree
        let aSelectorsAttrFirstSec = cssSelectors.getSelectors(oElement, this.mergeUniqueArrays(firstDegreeAttributes, secondDegreeAttributes));
        //Use first degree without id + second degree
        let aFirstDegreeAttrs = [].concat(firstDegreeAttributes);
        let aFilteredWithoutId = aFirstDegreeAttrs.filter(function(value){ 
            return value !== "aria-labelledby" && 
            value !== "id" &&
            value !== "data-sap-ui" && 
            value !== "aria-describedby";
        });
        let aSelectorsAttrFirstSecNoId = cssSelectors.getSelectors(oElement, this.mergeUniqueArrays(aFilteredWithoutId, secondDegreeAttributes));
        // Use all attributes given by element
        let aAttrs = this.retrieveDomProperties(oElement);
        let aAttrsName = this.getAllDomPropertyKeys(aAttrs) || [];
        let aSelectorsAttrOwnAll = cssSelectors.getSelectors(oElement,aAttrsName);
        // Use all attributes except id like fields.
        aAttrs = this.retrieveDomProperties(oElement);
        aAttrsName = this.getAllDomPropertyKeys(aAttrs) || [];
        aFilteredWithoutId = aAttrsName.filter(function(value){ 
            return value !== "aria-labelledby" && 
            value !== "id" &&
            value !== "data-sap-ui" && 
            value !== "aria-describedby";
        });
        let aSelectorsAttrOwnAllNoIdLike = cssSelectors.getSelectors(oElement, aFilteredWithoutId);

        // Merge all results
        let mergedResults = this.mergeResultsIntoOneArray(
            oElement,
            sSelector, 
            aSelectorsAttrFirst,
            aSelectorsAttrFirstSec,
            aSelectorsAttrFirstSecNoId,
            aSelectorsAttrOwnAll,
            aSelectorsAttrOwnAllNoIdLike
        );

        if(mergedResults && mergedResults.length > 3){
            //Generate Vyper reuse methods
            return this.generateVyperCodeForCss(mergedResults);
        } else {
            // Fallback xPath
            aAllXpaths = xPathSelectors.findAllXpaths(oElement);
            let mergeXpaths = [].concat(this.testAndSortAllXpaths(aAllXpaths, oElement));
            //Generate Vyper reuse methods
            return this.mergeUniqueArrays(this.generateVyperCodeForCss(mergedResults), this.generateVyperCodeForXPath(mergeXpaths));
        }
    };

    this.buildElementSelectors = function(oElement) {
        var sCode = "";
        var mFrameResults = {};
        var mSelsActionResults = {};
        if(oElement) {
            mFrameResults = this.generateVyperCodeForCssIframe(oElement);
            mSelsActionResults = this.getAllElementSelectors(oElement);
            if(mFrameResults) {
                let oFramesKeys = Object.keys(mFrameResults);
                for (let index = 0; index < oFramesKeys.length; index++) {
                    const sKey = oFramesKeys[index];
                    let sSel = mFrameResults[sKey][selector];
                    let sActions = mFrameResults[sKey][action];
                    sCode = sCode + "await " + sActions + "(" + sSel + ");";
                }
            }
            if(!mSelsActionResults) return "No valid selector could be generated";
            if(mSelsActionResults) {
                let oSelsKeys = Object.keys(mSelsActionResults);
                for (let index = 0; index < oSelsKeys.length; index++) {
                    const sKey = oSelsKeys[index];
                    let sSel = mSelsActionResults[sKey][selector];
                    let sActions = mSelsActionResults[sKey][action];
                    sCode = sCode + "await " + sActions + "(" + sSel + ");";
                }
            }
        }
        return sCode;
    };
};
window.IdAndTextCentricStrategy = new IdAndTextCentricStrategy();
module.exports = window.IdAndTextCentricStrategy;