
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

function addViewForControl(oControl, elemProperties) {
    // Get View name
    if(sap.ui.core.Element && sap.ui.core.mvc.View) {
        var aViews = sap.ui.core.Element.registry.filter(function (oElement) {
            return oElement instanceof sap.ui.core.mvc.View;
        });
        for (let index = 0; index < aViews.length; index++) {
            var oView = aViews[index];
            if(oView.getId() && oControl.getId() &&
            oControl.getId().indexOf(oView.getId()) !== -1) {
                elemProperties.push({
                    'viewId': oView.getId()
                });
                elemProperties.push({
                    'viewName': oView.getViewName()
                });
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
    if(aBindingInfoParts && aBindingInfoParts.length > 0) {
        //console.log("Binding length has property--------> "+ sPropKey+ ", " + aBindingInfoParts.length);
        for (var i = 0; i < aBindingInfoParts.length; i++) {
            var sModel = "";
            //console.log("Binding parts path--------> "+ aBindingInfoParts[i].path);
            if(!aBindingInfoParts[i].path) continue;
            if(aBindingInfoParts[i].model) sModel = aBindingInfoParts[i].model;
            aBindingInfos.push({
                model: sModel,
                path: aBindingInfoParts[i].path
            });
        }
    } else {
        var sBindingDataStr = oControl.getBindingInfo(sPropKey).path;
        if(sBindingDataStr) {
            aBindingInfos.push({
                    model: "",
                    path: sBindingDataStr
            });
        }
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

function generateAllControlSelector(sControlId) {
    var elemUI5Properties = [];
    var domProperties = [];
    var elemBindingProperties = [];
    var elemBindingContextsPath = [];
    var elemControlType = [];
    var sapBody = document.getElementsByClassName('sapUiBody');
    if(!sapBody || !sapBody[0]) {
        throw new Error('No body found')
    }
    var oNode = document.getElementById(sControlId);
    var oControl = sap.ui.getCore().byId(sControlId);
    if(oControl) {
        // Get all selectors properties
        domProperties = retrieveDomProperties(oNode);
        elemUI5Properties = retrieveUI5Properties(oControl);
        elemBindingProperties = retrieveUI5BindingProperties(oControl);
        elemBindingContextsPath = retrieveBindingContextPath(oControl); 
        elemControlType =  retrieveControlType(oControl); 
    }
    return [].concat(domProperties, elemUI5Properties, elemBindingProperties, elemBindingContextsPath, elemControlType);
}

window.generateAllControlSelector = generateAllControlSelector;

// Add locator to test
window.ui5All = ui5All;