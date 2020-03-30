// Aggregation or type of instanceof sap.m.ListItemBase,
// Or of sap.ui.table.Row or sap.ui.core.Item or has aggregation binding
// Ancestor check root aggregations : sap.tnt.NavigationList
//sap.m.ComboBoxBase, sap.m.ListBase, sap.ui.table.Table, sap.m.MultiInput, sap.ui.unified.MenuItemBase, sap.ui.unified.Menu
// check for aggregation/association binding
// Descendant check for element with i18n, binding, dont us ids
// If ancestor item
// If descentant item
// Use wildcards for bindingContextPath with guid
// bindingingContext + etwas (bindingpath)


// Take more in consideration (2)
// No aggregagation -> check for check for element with i18n, binding (ignore Uxfc, prefer strings over numbers, and booleans : enabled, disabled ), ariaLabelledBy, viewName/Id
// ids, viewId, binindContextPath, properties,ariaLabelledBy, check if generic --> pattern <metadata name> + number
// create wildcards check --> * + difference
// If searchField action --> use reuse methods


// Non UI5
// Get nodeName --> li,div, ...
// Dont retrieve elements with no id, or elements with b or span
// If parent, grand or grand-grand no id, take class or custom attributes
// If nothing else found the take b and span elements
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
*/

'use strict';

    var jaroWinkDistance = require('./jaroWinBundle.js'); 
    var ui5All = require('./vyperLocator'); 
   window.jaroWinkelDistance = jaroWinkDistance;
var aBlackListed = [
    //sap.m.Input
    "dateFormat",
    "enableSuggestionsHighlighting",
    "fieldWidth",
    "filterSuggests",
    "maxLength",
    "maxSuggestionWidth",
    "showSuggestion",
    "showTableSuggestionValueHelp",
    "showValueHelp",
    "startSuggestion",
    "suggestionRowValidator",
    "textFormatMode",
    "textFormatter",
    "valueHelpOnly",
    "valueLiveUpdate",
    //sap.m.InputBase
    "showValueStateMessage",
    "textAlign",
    "textDirection",
    "valueState",
    "valueStateText",
    "width",
    //sap.ui.core.Control
    "blocked",
    "busy",
    "busyIndicatorDelay",
    "busyIndicatorSize",
    "fieldGroupIds",
    "visible",
    //sap.m.Button
    "iconDensityAware",
    "iconFirst",
    //sap.m.Select
    "autoAdjustWidth",
    "maxWidth",
    "showSecondaryValues",
    //sap.m.BusyDialog
    "customIconDensityAware",
    "customIconHeight",
    "customIconRotationSpeed",
    "customIconWidth",
    "showCancelButton",
    //sap.m.Carousel
    "height",
    "loop",
    "pageIndicatorPlacement",
    "showBusyIndicator",
    "showPageIndicator",
    //sap.m.CheckBox
    "activeHandling",
    "partiallySelected",
    "useEntireWidth",
    "wrapping",
    //sap.m.Column
    "demandPopin",
    "hAlign",
    "mergeDuplicates",
    "minScreenWidth",
    "popinDisplay",
    "popinHAlign",
    "sortIndicator",
    "styleClass",
    "vAlign",
    //sap.m.ListItemBase
    "highlight",
    "highlightText",
    "unread",
    //sap.m.ComboBox
    "filterSecondaryValues",
    //sap.m.CustomListItem
    "noDataDescription",
    "noDataText",
    //sap.m.VBox
    "alignContent",
    "alignItems",
    "backgroundDesign",
    "direction",
    "fitContainer",
    "justifyContent",
    "renderType",
    "wrap",
    //sap.m.Link
    "emphasized",
    "subtle",
    "validateUrl",
    //sap.m.List
    //"sap.m.ListBase",
    "growing",
    "growingDirection",
    "growingScrollToLoad",
    "growingThreshold",
    "growingTriggerText",
    "headerDesign",
    "inset",
    "keyboardMode",
    "modeAnimationOn",
    "rememberSelections",
    "showNoData",
    "showSeparators",
    "showUnread",
    //sap.m.App
    "backgroundColor",
    "backgroundImage",
    "backgroundOpacity",
    "backgroundRepeat",
    "defaultTransitionName",
    "placement",
    //sap.m.BusyIndicator
    "customIconDensityAware",
    "customIconHeight",
    "customIconRotationSpeed",
    "customIconWidth",
    "design",
    "size",
    //sap.m.DatePicker
    "displayFormat",
    "displayFormatType",
    "initialFocusedDateValue",
    "maxDate",
    "minDate",
    "placeholder",
    "secondaryCalendarType",
    "showValueStateMessage",
    "valueFormat",
    "delimiter",
    "required",
    "enabled",
    "editable",
    //sap.m.DateTimePicker
    "minutesStep",
    "secondsStep",
    //sap.m.Dialog
    "contentHeight",
    "contentWidth",
    "draggable",
    "escapeHandler",
    "horizontalScrolling",
    "resizable",
    "showHeader",
    "stretch",
    "stretchOnPhone",
    "verticalScrolling",
    "valueTextDirection",
    //sap.m.DraftIndicator
    "minDisplayTime",
    //sap.m.FacetFilter
    "liveSearch",
    "showPersonalization",
    "showPopoverOKButton",
    "showReset",
    "showSummaryBar",
    "active",
    //sap.m.FacetFilterList
    "enableBusyIndicator",
    "enableCaseInsensitiveSearch",
    "includeItemInSelection",
    "multiSelect",
    "retainListSequence",
    "sequence",
    "showRemoveFacetIcon",
    "swipeDirection",
    "wordWrap",
    "truncateValueTo",
    //sap.m.FeedInput
    "growingMaxLines",
    "showExceededText",
    //sap.m.FeedListItem
    "convertLinksToAnchorTags",
    "lessLabel",
    "maxCharacters",
    "moreLabel",
    "senderActive",
    "showIcon",
    //sap.m.FlexBox
    "displayInline",
    "justifyContent",
    //sap.m.FlexItemData
    "alignSelf",
    "baseSize",
    "growFactor",
    "minHeight",
    "minWidth",
    "maxHeight",
    "shrinkFactor",
    //sap.m.GenericTile
    "failedText",
    "frameType",
    "sizeBehavior",
    "state",
    "wrappingType",
    "titleTextDirection",
    "upperCase",
    "orientation",
    "scrollStep",
    "scrollTime",
    "showDividers",
    "showOverflowItem",
    //sap.m.IconTabFilter
    "showAll",
    //sap.m.IconTabHeader
    "enableTabReordering",
    "mode",
    "showSelection",
    "showOverflowSelectList",
    "tabDensityMode",
    //sap.m.Image
    "backgroundPosition",
    "backgroundRepeat",
    "backgroundSize",
    "decorative",
    "densityAware",
    "placeholderSymbol",
    "regex",
    "useDefaultActionOnly",
    //sap.m.MenuItem
    "startsSection",
    //sap.m.MessageItem
    "activeTitle",
    "markupDescription",
    "enableFormattedText",
    "showNavButton",
    "asyncDescriptionHandler",
    "asyncURLHandler",
    "initiallyExpanded",
    "groupItems",
    "showDetailsPageHeader",
    "timestamp",
    "groupName"
];
function isEmptyObject(obj) {
    return Object.entries(obj).length === 0 && obj.constructor === Object;
}

function isEmptyArray(aValue) {
    return Array.isArray(aValue) && aValue.length === 0;
}

function isArrayOfBindingObjects(aValue) {
    if(Array.isArray(aValue) && aValue.length > 0) {
        return (
            (aValue[0].hasOwnProperty("model") && aValue[0].hasOwnProperty("path")) || 
            (isString(aValue[0]) && !aValue[0].getId)
            );
    }
    return false;
}

function getControlAllProperties(oControl) {
    if(!oControl ||
      !oControl.getMetadata ||
      !oControl.getMetadata() ||
      !oControl.getMetadata().getAllProperties
      ) { return null; }
    return oControl.getMetadata().getAllProperties();
}

function getControlAllAggregations(oControl) {
    if(!oControl ||
      !oControl.getMetadata ||
      !oControl.getMetadata() ||
      !oControl.getMetadata().getAllAggregations
      ) { return null; }
    return oControl.getMetadata().getAllAggregations();
}

function getControlAllAssociations(oControl) {
    if(!oControl ||
      !oControl.getMetadata ||
      !oControl.getMetadata() ||
      !oControl.getMetadata().getAllAssociations
      ) { return null; }
    return oControl.getMetadata().getAllAssociations();
}
// Returns if a value is a string
function isString (value) {
    return typeof value === 'string' || value instanceof String;
}

// Returns if a value is really a number
function isNumber (value) {
    return typeof value === 'number' && isFinite(value);
}

// Returns if a value is a function
function isFunction (value) {
    return typeof value === 'function';
}

// Returns if a value is an object
function isObject (value) {
    return value && typeof value === 'object' && value.constructor === Object;
}

// Returns if a value is a boolean
function isBoolean (value) {
    return typeof value === 'boolean';
}

// Returns if value is an error object
function isError (value) {
    return value instanceof Error && typeof value.message !== 'undefined';
}

// Returns if value is a date object
function isDate (value) {
    return value instanceof Date;
}

// Returns if a Symbol
function isSymbol (value) {
    return typeof value === 'symbol';
}

function getControlProperty(oControl, sPropKey) {
    var sPropValue;
    if(!oControl ||
      !oControl.getProperty
      ) { return null; }
    
      return oControl.getProperty(sPropKey);
}

function getAggregationProperty(oControl, sPropKey) {
    var sPropValue;
    if(!oControl ||
      !oControl.getAggregation
      ) { return null; }
      return oControl.getAggregation(sPropKey);
}

function getAssociationProperty(oControl, sPropKey) {
    var sPropValue;
    if(!oControl ||
      !oControl.getAssociation
      ) { return null; }
      return oControl.getAssociation(sPropKey);
}

function getControlBindingContextPath(oControl) {
    if (!oControl) return null;
    var bindingContexts = jQuery.extend({},
      oControl.oPropagatedProperties && oControl.oPropagatedProperties.oBindingContexts,
      oControl.oBindingContexts,
      oControl.mElementBindingContexts
    );
          // reduce object to non-empty contexts
    bindingContexts = Object.keys(bindingContexts).reduce(function (finalContexts, key) {
      if (bindingContexts[key]) {
        finalContexts[key] = bindingContexts[key];
      }
      return finalContexts;
    }, {});

    if (bindingContexts && Object.keys(bindingContexts).length > 0) {
      var aKeys = Object.keys(bindingContexts);
      for (let index = 0; index < aKeys.length; index++) {
        if (aKeys[index] === "$cmd") continue;
        const oBindingContext = bindingContexts[aKeys[index]];
        if (oBindingContext &&
                      oBindingContext.getPath &&
                      oBindingContext.getPath())
          return oBindingContext.getPath();
      }
    }
    return null;
  }

function isValidProperties(oProperty, oPropValue) {
    if(!oProperty || isEmptyObject(oProperty)) return false;

    var aValNames = aBlackListed.filter(function(propName) {
        return Object.keys(oProperty).length > 0
        && propName === Object.keys(oProperty)[0]
    });
    if(aValNames && aValNames.length > 0) return false;

    if(Object.values(oProperty).length <= 0) return false;

    //var oPropValue = Object.values(oProperty)[0];

    if(oPropValue === null ||  oPropValue === undefined || oPropValue.getId || oPropValue === "") return false;

    return isString(oPropValue) || isNumber(oPropValue) ||  isBoolean(oPropValue);
  }


function retrieveDomProperties(oNode) {
    var domProperties = [];
    domProperties.push({
        "nodeName" : oNode.nodeName
    });
    if(oNode.attributes && oNode.attributes.length > 0) {
        for (let index = 0; index < oNode.attributes.length; index++) {
            var oElm = oNode.attributes[index];
            if(oElm.nodeName && oElm.nodeValue) {
                if(
                    //oElm.nodeName.indexOf('id') === -1 &&
                    //oElm.nodeName.indexOf('style') === -1 &&
                    oElm.nodeValue.indexOf('%') === -1 &&
                    oElm.nodeValue.indexOf('px') === -1 &&
                    oElm.nodeValue.indexOf('rem') === -1 &&
                    oElm.nodeValue.indexOf('true') === -1 &&
                    oElm.nodeValue.indexOf('false') === -1 &&
                    isNaN(oElm.nodeValue)) {
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
}

window.retrieveDomProperties = retrieveDomProperties;

function isControlInViewId(oControl, sViewId) {
    try {
      // eslint-disable-next-line no-undef
      if (!oControl || !sap.ui.core.Element || !sap.ui.core.mvc.View) {
        return false;
      }
      if (oControl.getId && sViewId === oControl.getId() &&
        // eslint-disable-next-line no-undef
        oControl instanceof sap.ui.core.mvc.View) {
        return true;
      } else {
        return isControlInViewId(oControl.getParent(), sViewId);
      }
    } catch (error) {
      return false;
    }
  }

  function isControlInComponentId(oControl, sComponentId) {
    try {
      // eslint-disable-next-line no-undef
      if (!oControl || !sap.ui.core.Element || !sap.ui.core.Component) {
        return false;
      }
      if (oControl.getId && sComponentId === oControl.getId() &&
        // eslint-disable-next-line no-undef
        oControl instanceof sap.ui.core.UIComponent) {
        return true;
      } else {
        return isControlInComponentId(oControl.getParent(), sComponentId);
      }
    } catch (error) {
      return false;
    }
  }

function addViewForControl(oControl, elemProperties) {
    // Get View name
    if(sap.ui.core.Element && sap.ui.core.mvc.View) {
        var aViews = sap.ui.core.Element.registry.filter(function (oElement) {
            return oElement instanceof sap.ui.core.mvc.View;
        });
        for (let index = 0; index < aViews.length; index++) {
            var oView = aViews[index];
            if(oView.getId() && oControl.getId() &&
            isControlInViewId(oControl, oView.getId())) {
               var aComponents = [].concat(sap.ui.core.Component.registry.filter(function (oElem) {
                    return oElem instanceof sap.ui.core.UIComponent;
                }));
                for (let j = 0; j < aComponents.length; j++) {
                    const oComponent = aComponents[j];
                    if(isControlInComponentId(oView, oComponent.getId())) {
                        elemProperties.push({
                            'componentId': oComponent.getId()
                        });
                        break;
                    }
                }
                elemProperties.push({
                    'viewId': oView.getId()
                });
                elemProperties.push({
                    'viewName': oView.getViewName()
                });
                return;
            }
        }
    }
}

function addControlProperties(oControl, elemProperties) {
    var mProperties = getControlAllProperties(oControl);
    if(!mProperties) return;
    
    var aPropertiesKeys = Object.keys(mProperties);
    if(aPropertiesKeys && 
        aPropertiesKeys.length <= 0) return;
    
    for (let index = 0; index < aPropertiesKeys.length; index++) {
        const sPropName = aPropertiesKeys[index];
        const sPropValue = getControlProperty(oControl, sPropName);
        var oProperty = {};
        oProperty[sPropName] = sPropValue;
        if(isValidProperties(oProperty, sPropValue)) {
            elemProperties.push(oProperty);
        }
    }
};

function addControlAggregation(oControl, elemProperties) {
    var mProperties = getControlAllAggregations(oControl);
    if(!mProperties) return;
    
    var aPropertiesKeys = Object.keys(mProperties);
    if(aPropertiesKeys && 
        aPropertiesKeys.length <= 0) return;
    
    for (let index = 0; index < aPropertiesKeys.length; index++) {
        const sPropName = aPropertiesKeys[index];
        const sPropValue = getAggregationProperty(oControl, sPropName);
        var oProperty = {};
        oProperty[sPropName] = sPropValue;
        if(isValidProperties(oProperty, sPropValue)) {
            elemProperties.push(oProperty);
        }
    }
};

function addAssociationProperty(oControl, elemProperties) {
    var mProperties = getControlAllAssociations(oControl);
    if(!mProperties) return;
    
    var aPropertiesKeys = Object.keys(mProperties);
    if(aPropertiesKeys && 
        aPropertiesKeys.length <= 0) return;
    
    for (let index = 0; index < aPropertiesKeys.length; index++) {
        const sPropName = aPropertiesKeys[index];
        const sPropValue = getAssociationProperty(oControl, sPropName);
        var oProperty = {};
        oProperty[sPropName] = sPropValue;
        if(isValidProperties(oProperty, sPropValue)) {
            elemProperties.push(oProperty);
        }
    }
};

function retrieveBindingContextPath(oControl) {
    var elemProperties = [];
    var bindPath = {};
    bindPath['bindingContextPath'] = getControlBindingContextPath(oControl);
    if(!bindPath['bindingContextPath']) return elemProperties;
     // Add Binding Path
     elemProperties.push(bindPath);
    return elemProperties;
}
window.retrieveBindingContextPath = retrieveBindingContextPath;

function retrieverBindingPaths(oControl, sPropKey) {
    var aBindingInfos = [];
    var aBindingInfoParts = oControl.getBindingInfo(sPropKey).parts;
    try {
        if (aBindingInfoParts && aBindingInfoParts.length > 0) {
            for (var i = 0; i < aBindingInfoParts.length; i++) {
                var sModel = "";
                if (!aBindingInfoParts[i].path) continue;
                if (aBindingInfoParts[i].model) sModel = aBindingInfoParts[i].model;
                aBindingInfos.push({
                model: sModel,
                path: aBindingInfoParts[i].path,
                value: ""
                });
            }
            if(oControl.getBinding && oControl.getBinding(sPropKey)) {
                var oBinding = oControl.getBinding(sPropKey);
                if(oBinding.getBindings && oBinding.getBindings() && 
                    aBindingInfos && aBindingInfos.length > 1) {
                    var aBindings = oControl.getBindingInfo(sPropKey).getBindings();
                    for (var i = 0; i < aBindings.length; i++) {
                        for (var j = 0; j < aBindingInfos.length; j++) {
                    var aBindings = oControl.getBindingInfo(sPropKey).getBindings();
                            if(aBindingInfos[j].path === aBindings[i].getPath()) {
                                aBindingInfos[j].value = aBindings[i].getValue();
                            }
                        }
                    }
                } else if(aBindingInfos && aBindingInfos.length === 1 &&
                    aBindingInfos[0].path === oBinding.getPath()) {
                    aBindingInfos[0].value = oBinding.getValue();
                }
            }
            } else {
                var sBindingDataStr = oControl.getBindingInfo(sPropKey).path;
                var sBindingDataModelStr = oControl.getBindingInfo(sPropKey).model;
                if (sBindingDataStr) {
                aBindingInfos.push({
                    model: sBindingDataModelStr,
                    path: sBindingDataStr,
                    value: ""
                });
                if(oControl.getBinding && oControl.getBinding(sPropKey)) {
                    var oBinding = oControl.getBinding(sPropKey);
                    if(oBinding.getBindings && oBinding.getBindings() && 
                    aBindingInfos && aBindingInfos.length > 1) {
                        var aBindings = oControl.getBindingInfo(sPropKey).getBindings();
                        if(aBindings.length > 0 && aBindings[0].getPath() === sBindingDataStr) {
                            aBindingInfos[0].value = aBindings[0].getValue();
                        }
                    } else if(aBindingInfos && aBindingInfos.length === 1 &&
                        aBindingInfos[0].path === oBinding.getPath()) {
                        aBindingInfos[0].value = oBinding.getValue();
                    }
                }
            }
        }
    } catch (error) {
        //Continue
    }
    return aBindingInfos;
}

function getBindDataForAggregation(oControl, sPropKey) {
    var aAggregation = getControlAllAggregations(oControl);
    var aBindingInfos = [];
    try {
        if (aAggregation.hasOwnProperty(sPropKey)) {
            if(!oControl || !sPropKey
                || !aAggregation.hasOwnProperty(sPropKey)
                || !oControl.getBindingInfo
                || !oControl.getBindingInfo(sPropKey)) return aBindingInfos;
            aBindingInfos = retrieverBindingPaths(oControl, sPropKey);
        }
    } catch(e) {
// Do nothing
    }
    return aBindingInfos;
}

function getBindDataForAssociation(oControl, sPropKey) {
    var aAssociation = getControlAllAssociations(oControl);
    var aBindingInfos = [];
    try {
        if (aAssociation.hasOwnProperty(sPropKey)) {
            if(!oControl || !sPropKey
                || !aAssociation.hasOwnProperty(sPropKey)
                || !oControl.getBindingInfo
                || !oControl.getBindingInfo(sPropKey)) return aBindingInfos;
            aBindingInfos = retrieverBindingPaths(oControl, sPropKey);
        }
    } catch(e) {
// Do nothing
    }
    return aBindingInfos;
}

function getBindDataForProperty(oControl, sPropKey) {
    var aProperties = getControlAllProperties(oControl);
    var aBindingInfos = [];
    try {
        if (aProperties.hasOwnProperty(sPropKey)) {
            if(!oControl || !sPropKey
                || !aProperties.hasOwnProperty(sPropKey)
                || !oControl.getBindingInfo
                || !oControl.getBindingInfo(sPropKey)) return aBindingInfos;
                aBindingInfos = retrieverBindingPaths(oControl, sPropKey);
            }
    } catch(e) {
// Do nothing
    }
    return aBindingInfos;
}

function retrieveBindingProperties(oControl) {
    var elemProperties = [];

    var mProperties = getControlAllProperties(oControl);
    if(!mProperties) return elemProperties;
    
    var aPropertiesKeys = Object.keys(mProperties);
    if(aPropertiesKeys && 
        aPropertiesKeys.length <= 0) return elemProperties;

    for (let index = 0; index < aPropertiesKeys.length; index++) {
        const sPropName = aPropertiesKeys[index];
        let oBindingProp = {};
        oBindingProp[sPropName] = [];
        oBindingProp[sPropName] = getBindDataForProperty(oControl, sPropName);
        if(!isEmptyArray(oBindingProp[sPropName])){
            // Add Binding Path
            elemProperties.push(oBindingProp);
        }
    }
    return elemProperties;
}

function retrieveAggregationBindingProperties(oControl) {
    var elemProperties = [];

    var mProperties = getControlAllAggregations(oControl);
    if(!mProperties) return elemProperties;
    
    var aPropertiesKeys = Object.keys(mProperties);
    if(aPropertiesKeys && 
        aPropertiesKeys.length <= 0) return elemProperties;

    for (let index = 0; index < aPropertiesKeys.length; index++) {
        const sPropName = aPropertiesKeys[index];
        let oBindingProp = {};
        oBindingProp[sPropName] = [];
        oBindingProp[sPropName] = getBindDataForAggregation(oControl, sPropName);
        if(!isEmptyArray(oBindingProp[sPropName])){
            // Add Binding Path
            elemProperties.push(oBindingProp);
        }
    }
    return elemProperties;
}

function retrieveAssociationBindingProperties(oControl) {
    var elemProperties = [];

    var mProperties = getControlAllAssociations(oControl);
    if(!mProperties) return elemProperties;
    
    var aPropertiesKeys = Object.keys(mProperties);
    if(aPropertiesKeys && 
        aPropertiesKeys.length <= 0) return elemProperties;

    for (let index = 0; index < aPropertiesKeys.length; index++) {
        const sPropName = aPropertiesKeys[index];
        let oBindingProp = {};
        oBindingProp[sPropName] = [];
        oBindingProp[sPropName] = getBindDataForAssociation(oControl, sPropName);
        if(!isEmptyArray(oBindingProp[sPropName])){
            // Add Binding Path
            elemProperties.push(oBindingProp);
        }
    }
    return elemProperties;
}

function retrieveUI5BindingProperties(oControl) {
    // Get all binding properties
    var bindProps = retrieveBindingProperties(oControl);

    // Get all aggregation properties
    var bindAggregProps = retrieveAggregationBindingProperties(oControl);

    // Get all associations properties
    var bindAssocProps = retrieveAssociationBindingProperties(oControl);

    return [].concat(bindProps).concat(bindAggregProps).concat(bindAssocProps);

}

window.retrieveUI5BindingProperties = retrieveUI5BindingProperties;

function retrieveUI5Properties(oControl) {
    var elemProperties = [];
    elemProperties.push({
        'id': oControl.getId()
    });
    
    // Add component name
    /*
    sap.ui.core.Component.registry.filter(function (oElem) {
            return oElem instanceof sap.ui.core.UIComponent;
        });
        oView.getId().indexOf(comps[2].getId())
    */
    // Get View name
    addViewForControl(oControl, elemProperties);
    // Get control properties
    addControlProperties(oControl, elemProperties);
    // Get aggregation properties
    addControlAggregation(oControl, elemProperties);
    // Get association properties
    addAssociationProperty(oControl, elemProperties);

    return elemProperties;
   
}

function retrieveControlType(oControl) {
    var elemProperties = [];
    elemProperties.push({
        'metadata': oControl.getMetadata().getName()
    });
    return elemProperties;
}

window.retrieveUI5Properties = retrieveUI5Properties;

function generateAllControlSelectorById(sControlId) {
    var sapBody = document.getElementsByClassName('sapUiBody');
    if(!sapBody || !sapBody[0]) {
        throw new Error('No body found')
    }
    var oControl = sap.ui.getCore().byId(sControlId);
    return generateAllControlSelector(oControl);
}

function generateAllControlSelector(oControl) {
    var elemUI5Properties = [];
    var domProperties = [];
    var elemBindingProperties = [];
    var elemBindingContextsPath = [];
    var elemControlType = [];
    if(!oControl) return null;
    var oNode = document.getElementById(oControl.getId());
    // Get all selectors properties
    domProperties = retrieveDomProperties(oNode);
    elemUI5Properties = retrieveUI5Properties(oControl);
    elemBindingProperties = retrieveUI5BindingProperties(oControl);
    elemBindingContextsPath = retrieveBindingContextPath(oControl); 
    elemControlType =  retrieveControlType(oControl); 
    var propsCollection = {
        "domProperties": domProperties || [],
        "ui5Properties": elemUI5Properties || [],
        "bindingContextPath": elemBindingContextsPath || [],
        "bindingPropertyPaths": elemBindingProperties || [],
        "metadata": elemControlType || []
    }
    return propsCollection;
}

function getAllElementProperties(sControlId) {
    return generateAllControlSelectorById(sControlId);
}

window.getAllElementProperties = getAllElementProperties;

function getValidParentControl(oControl) {
    if (!oControl || !oControl.getId || !oControl.getId()) return null;
    var oParentControl = null;
    var domElem = document.getElementById(oControl.getId());
    if (!domElem) return null;
    var domParent = domElem.parentElement;
    for (;;) {
        if (!domParent) return null;
        var nodeId = domParent.getAttribute("id");
        if (nodeId) {
        // eslint-disable-next-line no-undef
        oParentControl = sap.ui.getCore().byId(nodeId);
        if (oParentControl) {
            /*console.log("Candidate Parent Property Control Type -->"
            + oParentControl.getMetadata().getName()
            + ", Id-->" + oParentControl.getId());*/
            return oParentControl;
        }
        }
        domParent = domParent.parentElement;
    }
}

function findNextAncestor(oControl) {
    if(oControl) {
        return getValidParentControl(oControl);
    }
};

function findNextAncestorByControlId(sControlId) {
    var oControl = sap.ui.getCore().byId(sControlId);
    return findNextAncestor(oControl);
};

function getNextAncestorProperties(sControlId) {
    var oParentControl = findNextAncestorByControlId(sControlId);
    return generateAllControlSelector(oParentControl);
}

window.getNextAncestorProperties = getNextAncestorProperties;

function retrieveValidUI5ControlsSubElements(nodes, aCandidateControls) {
    if (!nodes || nodes.length === 0) {
        //console.log('no node html elements found');
      return aCandidateControls;
    }
    Array.prototype.filter.call(nodes, function(node) {
        //console.log("node -->" + node);
      var nodeId = node.getAttribute("id");
      if (!nodeId) {
        var childNod = node.children;
          //console.log("Number of child elements-->"+ childNod.length);
        if (!childNod) return false;
        Array.prototype.filter.call(childNod, function(chNode) {
          var chNodeId = chNode.getAttribute("id");
          if (chNodeId) {
            // eslint-disable-next-line no-undef
            var oControl = sap.ui.getCore().byId(chNodeId);
            if (oControl) {
                //console.log("Control pushed-->"+ oControl.getId());
              aCandidateControls.push(oControl);
            } else {
                //console.log("Im in else iterate 1");
              retrieveValidUI5ControlsSubElements(chNode.children, aCandidateControls);
              return false;
            }
          } else {
              //console.log("Im in else iterate 2");
            retrieveValidUI5ControlsSubElements(chNode.children, aCandidateControls);
            return false;
          }
        });
      } else {
        // eslint-disable-next-line no-undef
        var oControl = sap.ui.getCore().byId(nodeId);
        if (oControl) {
            //console.log("Control pushed-->" + oControl.getId());
            //console.log("Control pushed-->"+ oControl.getId());
          aCandidateControls.push(oControl);
        } else {
            //console.log("Im in else iterate 3 -->" + node.children.length);
          retrieveValidUI5ControlsSubElements(node.children, aCandidateControls);
          return false;
        }
      }
      return oControl;
    });
    return aCandidateControls;
  }

function getAllDescendantElementsProps(sControlId) {
    var aAllChildrenNodes = document.getElementById(sControlId).children;
    var aPropsForAllDescentants = [];
    var aCandidateControls = [];
    var aValidControls = [];
    aValidControls = retrieveValidUI5ControlsSubElements(aAllChildrenNodes, aCandidateControls);
    if (!aValidControls || aValidControls.length === 0) return null;
    
    for (let index = 0; index < aValidControls.length; index++) {
        const oControl = aValidControls[index];
        aPropsForAllDescentants.push({
            "id": oControl.getId(),
            "properties": generateAllControlSelector(oControl)
        });
    }
    return aPropsForAllDescentants;
}

window.getAllDescendantElementsProps = getAllDescendantElementsProps;

function findSiblingControls(oControl, oParentControl) {
    var aValidControls = [];
    var aCandidateControls = [];
    if (!oControl || !oControl.getId || !oControl.getId()) return null;
    if (!oParentControl.getId ||!oParentControl.getId()) return null;
    var sParentId = oParentControl.getId();
    var aAllSiblingNodes = document.getElementById(sParentId).children;
    aValidControls = retrieveValidUI5ControlsSubElements(aAllSiblingNodes, aCandidateControls);
    if (!aValidControls || aValidControls.length === 0) return null;
    var oControlIndx = aValidControls.findIndex(function(element) {
      return element.getId() === oControl.getId();
    }); 
    if (oControlIndx === -1) { throw new Error("Something is very wrong with prev/next control finder"); }
    else {
      aValidControls.splice(oControlIndx, 1);
      return aValidControls;
    }
  }

function getAllSiblingProperties(sControlId) {
    var allSiblingsProps = [];
    var allSblControls = [];
    var oParentControl = findNextAncestorByControlId(sControlId);
    var oControl = sap.ui.getCore().byId(sControlId);
    if (oControl && oParentControl) {
        allSblControls = findSiblingControls(oControl, oParentControl);
    }
    if (!allSblControls || allSblControls.length === 0) return null;
    for (let index = 0; index < allSblControls.length; index++) {
        const oCandControl = allSblControls[index];
        allSiblingsProps.push({
            "id": oCandControl.getId(),
            "properties": generateAllControlSelector(oCandControl)
        });
    }
    return allSiblingsProps;
}

window.getAllSiblingProperties = getAllSiblingProperties;

// Add locator to test
window.ui5All = ui5All;