// elementProperties
//
// check agreggation element???
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//---> yes
// CASE 1:
// ___ instanceof sap.m.ListItemBase, sap.ui.table.Row, sap.ui.core.Item, sap.ui.unified.MenuItemBase, sap.ui.unified.Menu or descentant of them
// dont use: id, use: bindingContextPath (no guid elements) & bindingPropertyPath or i18n [add. viewName] (try it ui5All)
// ------> bindingContextPath no other valid element besides guid, empty & boolean params (try it ui5All)  
// ------> no valid bindingContextPath
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ---------> get ancestor instanceof sap.m.ListItemBase... and then get descentants, select base on ui5 property value (only where value != boolean?,'', null,undefined) (try it ui5All)
// ---------> not found unique descentant
// ---------> get descendants of the descendants (parallel) select base on ui5 property value (only where value != '', null,undefined)
// ---------> repeat as long as no descendants found  try bindings,i18n & ui5 properties (only where value != '', null,undefined)
// ---------> PARALLEL
// ---------> get direct descendant (only where value != boolean?,'', null,undefined) (try it ui5All)
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ---------> RESULT: no --> use index (try it ui5All --> check resulted id)
// (+1) if only 2, otherwise dont --> add Ancestor if type: sap.tnt.NavigationList
// sap.m.ComboBoxBase, sap.m.ListBase, sap.ui.table.Table, sap.m.MultiInput, sap.ui.unified.MenuItemBase, sap.ui.unified.Menu
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CASE 2 [ELSE IF]:
// ___ descendant of sap.tnt.NavigationList
// sap.m.ComboBoxBase, sap.m.ListBase, sap.ui.table.Table, sap.m.MultiInput, sap.ui.unified.MenuItemBase, sap.ui.unified.Menu
//  use: bindingContextPath (no guid elements) & bindingPropertyPath or i18n [add. viewName], otherwise use: id (check not generic) (try it ui5All)
// ------> bindingContextPath no other valid element besides guid, empty & boolean params (try it ui5All)  
// ------> PARALLEL
// ------> if not valid check ui5 properties (try it ui5All) 
// ------> PARALLEL
// ------> check siblings use: bindingPropertyPath or i18n [add. viewName], ui5 properties, otherwise use: id (check not generic) (try it ui5All)
// ------> PARALLEL
// ------> check descendant use: bindingPropertyPath or i18n [add. viewName], ui5 properties,  otherwise use: id (check not generic) (try it ui5All)
// ------> PARALLEL
// ------> check ancestor use: bindingPropertyPath or i18n [add. viewName], ui5 properties,  otherwise use: id (check not generic) (try it ui5All)
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DECISION OF PARALLEL: Depends on value of finding( bindingContextPath, i18n > id > properties)
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RESULTS not found --> check domProperties
// (+1) if no binding or id only properties, then add --> Ancestor if type: sap.tnt.NavigationList
// sap.m.ComboBoxBase, sap.m.ListBase, sap.ui.table.Table, sap.m.MultiInput, sap.ui.unified.MenuItemBase, sap.ui.unified.Menu
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CASE 3 [ELSE]
// instanceof sap.m.ComboBoxBase, sap.m.ListBase, sap.ui.table.Table, sap.m.MultiInput, sap.ui.unified.MenuItemBase, sap.ui.unified.Menu
// use: bindingProperty/aggregation/association Path or i18n [add. viewName], otherwise use: id (check not generic) (try it ui5All)
// not found
// PARALLEL
// Check ui5Properties (ignore booleans for this phase)
// PARALLEL
// if not found: check siblings use: bindingProperty/aggregation/association Path or i18n [add. viewName], otherwise use: id (check not generic) (try it ui5All)
// PARALLEL
// if not found: check ancestor
// use: bindingProperty/aggregation/association Path or i18n [add. viewName], otherwise use: id (check not generic) (try it ui5All)
// if not found: check descendant (aggregation elements)
// no id, use: bindingContextPath (no guid elements) & bindingPropertyPath or i18n [add. viewName] (try it ui5All)
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DECISION OF PARALLEL: Depends on value of finding( bindingproperty > i18n > id > properties)
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RESULTS not found --> check DomProperties
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//---> no
//
// use: id (check not generic) (try it ui5All) (use viewName/Id, namespace if id has them) -- use id only if doesnt contain number
// not found correct
// check for i18n or bindingPropertyPath (ignore Uxfc, prefer strings over numbers, favor value, title, text props, and booleans use as last resort --> editable, enabled, disabled )  [add. viewName], otherwise 
// not found
// PARALLEL
// Check Ancestor 
// ---> use: id (check not generic) (try it ui5All) (use viewName/Id, namespace if id has them) -- use id only if doesnt contain number
// ---> not found correct
// ---> check for i18n or bindingPropertyPath (ignore Uxfc, prefer strings over numbers, and booleans use as last resort --> editable, enabled, disabled )  [add. viewName], otherwise 
// --> not found
// --> Check ui5Properties (ignore booleans for this phase)
// PARALLEL
// Check Descendant 
// ---> use: id (check not generic) (try it ui5All) (use viewName/Id, namespace if id has them) -- use id only if doesnt contain number
// ---> not found correct
// ---> check for i18n or bindingPropertyPath (ignore Uxfc, prefer strings over numbers, and booleans use as last resort --> editable, enabled, disabled )  [add. viewName], otherwise 
// --> not found
// --> Check ui5Properties (ignore booleans for this phase)
// PARALLEL
// Check Siblings 
// ---> use: id (check not generic) (try it ui5All) (use viewName/Id, namespace if id has them) -- use id only if doesnt contain number
// ---> not found correct
// ---> check for i18n or bindingPropertyPath (ignore Uxfc, prefer strings over numbers, and booleans use as last resort --> editable, enabled, disabled )  [add. viewName], otherwise 
// --> not found
// --> Check ui5Properties (ignore booleans for this phase)
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RESULTS --> use additional booleans props or check domProperties
///////////////////////////////////////////////////////////////////////////////////////////////////////
// use id only if doesnt contain number (dont use generic ones):
/*
var matches = val.match(/\d+/g);
if (matches != null) {
    alert('number');
}
*/
/*sap.ui.require([
    "sap/m/ListItemBase",
    "sap/ui/table/Row",
    "sap/ui/core/Item",
    "sap/ui/unified/MenuItemBase",
    "sap/ui/unified/Menu",
    "sap/tnt/NavigationList",
    "sap/m/ComboBoxBase",
    "sap/m/ListBase",
    "sap/ui/table/Table",
    "sap/m/MultiInput"
], function(ListItemBase, Row, Item, MenuItemBase, Menu, NavigationList, ComboBoxBase, ListBase, Table, MultiInput) {*/
var vyperUtil = require('../../utils/vyperUtil');
var ui5All = require('../../utils/vyperLocator');
var evaluator = require('../../utils/selectorEvaluators');
var deepExtend = require('deep-extend');
var ElementCentricStrategy = function() {

    this.checkAggregationElement = function(oControl) {
        if(!oControl) return false;
        return sap && 
            (sap.m && oControl instanceof sap.m.ListItemBase) ||
            (sap.ui && sap.ui.table && oControl instanceof sap.ui.table.Row) ||
            (sap.ui && sap.ui.core && oControl instanceof sap.ui.core.Item) ||
            (sap.ui && sap.ui.unified && oControl instanceof sap.ui.unified.MenuItemBase) ||
            (sap.ui && sap.ui.unified && oControl instanceof sap.ui.unified.Menu) ||
            (sap.m  && oControl instanceof sap.m.Token);
    }

    this.checkAggregation = function(oControl) {
        if(!oControl) return false;
        return sap &&  
            (sap.tnt && oControl instanceof sap.tnt.NavigationList) ||
            (sap.m && oControl instanceof sap.m.ComboBoxBase) ||
            (sap.m && oControl instanceof sap.m.ListBase) ||
            (sap.ui && sap.ui.table && oControl instanceof sap.ui.table.Table) ||
            (sap.m && oControl instanceof sap.m.MultiInput) ||
            (sap.ui && sap.ui.unified && oControl instanceof sap.ui.unified.MenuItemBase) ||
            (sap.ui && sap.ui.unified && oControl instanceof sap.ui.unified.Menu) ||
            (sap.m  && oControl instanceof sap.m.Tokenizer);
    }

    this.recursiveCheckDescendantOfAggregation = function(oControl) {
        if(this.checkAggregation(oControl)){
            return null;
        } else if(oControl){
            var oParentControl = vyperUtil.findNextAncestor(oControl);
            if(oParentControl && !this.checkAggregation(oParentControl)) {
                // Get  next parent until finding aggregation element
                return this.recursiveCheckDescendantOfAggregation(oParentControl);
            } else if(oParentControl && this.checkAggregation(oParentControl)) {
                return oParentControl;
            } else {
                return null;
            }
        }
        return null;
    }

    this.recursiveCheckAncestorElemOrDesc = function(oControl) {
        if(this.checkAggregation(oControl)) return null;
        if(!oControl) return null;
        if(!this.checkAggregationElement(oControl)) {
            var oParentControl = vyperUtil.findNextAncestor(oControl);
            if(oParentControl && !this.checkAggregation(oParentControl)) {
                // Get  next parent until finding aggregation element
                return this.recursiveCheckAncestorElemOrDesc(oParentControl);
            } else {
                return null;
            }
        } else {
            return oControl;
        }
    }

    // CASE 1
    this.checkIfAggrOrDescendantElem = function(oControlProps) {
        if(!oControlProps || !oControlProps.ui5Properties) return null;
        let cntlId = vyperUtil.getKeyValue(oControlProps.ui5Properties,"id");
        if(oControlProps && cntlId) {
            var oControl = sap.ui.getCore().byId(cntlId);
            return this.recursiveCheckAncestorElemOrDesc(oControl);
        }
    }

     // CASE 2
     this.checkIfBwtAggrAndAggrElem = function(oControlProps) {
        if(!oControlProps || !oControlProps.ui5Properties) return null;
        let cntlId = vyperUtil.getKeyValue(oControlProps.ui5Properties,"id");
        if(oControlProps && cntlId) {
            var oControl = sap.ui.getCore().byId(cntlId);
            var oCandControl = this.recursiveCheckDescendantOfAggregation(oControl);
            if(oCandControl && (!this.recursiveCheckAncestorElemOrDesc(oControl))) {
                return oCandControl;
            }
            return null;
        }
    }

    // CASE 3
    this.checkIfAggregationExactly = function(oControlProps) {
        if(!oControlProps || !oControlProps.ui5Properties) return null;
        let cntlId = vyperUtil.getKeyValue(oControlProps.ui5Properties,"id");
        if(oControlProps && cntlId) {
            var oControl = sap.ui.getCore().byId(cntlId);
             if(this.checkAggregation(oControl)){
                return oControl;
             } else {
                 return null;
             }
        }
    }

     // Check agreggation element
     this.checkIfAggregationElement = function(oControlProps) {
        if(!oControlProps.ui5Properties) return null;
        let cntlId = vyperUtil.getKeyValue(oControlProps.ui5Properties,"id");
        if(oControlProps && cntlId) {
            var oControl = sap.ui.getCore().byId(cntlId);
            var oCandDescControl = this.recursiveCheckDescendantOfAggregation(oControl);
            var oCandAncControl = this.recursiveCheckAncestorElemOrDesc(oControl);
            return oCandDescControl || oCandAncControl;
        }
    }

    this.getOptSelectors = function(sControlId) {
        var oRes = {};
        var oResPar1 = [];
        let finalRes = {};
        if(!sControlId) return {};
        let oElemProperties = vyperUtil.getAllElementProperties(sControlId);
        if(!oElemProperties) return {};
        let oAggrElement = this.checkIfAggrOrDescendantElem(oElemProperties);
        let oAggrElementBwt = this.checkIfBwtAggrAndAggrElem(oElemProperties);
        let oAggrElementExactly = this.checkIfAggregationExactly(oElemProperties);
        if(oAggrElement){
            // CASE 1
            oRes = evaluator.evalElementProperties(oElemProperties);
            if(oRes.success){
                return oRes.selector;
            }
            Object.assign(finalRes, oRes);

            let oRes1 = {};
            let oRes2 = {};
            let oRes3 = {};
            if(oRes.fieldsMap && oElemProperties) {
                // check ancestor use: bindingProperty/aggregation/association Path or i18n [add. viewName], property, id (check not generic)
                let oAncestorProperties = vyperUtil.getNextAncestorProperties(sControlId);
                const currentId = vyperUtil.getKeyValue(oAncestorProperties.ui5Properties, "id");
                const elmId = oAggrElement.getId();
                if(elmId !== currentId) {
                    evaluator.selectorDist = {
                        "success": false,
                        "distance": 999,
                        "fieldsMap": oRes.fieldsMap,
                        "selector": {},
                        "aNodes": []
                    };
                    oRes1 = evaluator.evalAncestorProperties(sControlId, oRes.fieldsMap, oAncestorProperties, 5, elmId);
                    if(oRes1.success){
                        return oRes1.selector;
                    }
                    if(oRes1.distance < finalRes.distance){
                        finalRes={};
                        Object.assign(finalRes, oRes1);
                    }
                }
             }

             if(oRes.fieldsMap && oElemProperties) {
                // check descendant use: bindingProperty/aggregation/association Path or i18n [add. viewName], property, id (check not generic)
                let aDescendentProps = vyperUtil.getAllDescendantElementsProps(sControlId);
                evaluator.selectorDist = {
                    "success": false,
                    "distance": 999,
                    "fieldsMap": oRes.fieldsMap,
                    "selector": {},
                    "aNodes": []
                };
                oRes2 = evaluator.evalDescendantProperties(sControlId, oRes.fieldsMap, aDescendentProps);
                if(oRes2 && oRes2.success){
                 return oRes2.selector;
                }
                if(oRes2.distance < finalRes.distance){
                    finalRes={};
                    Object.assign(finalRes, oRes2);
                }
            }

            if(oRes.fieldsMap && oElemProperties) {
                // check siblings use: bindingProperty/aggregation/association Path or i18n [add. viewName], property, id (check not generic)
                let aSiblingsProps = vyperUtil.getAllSiblingProperties(sControlId);
                oRes3 = evaluator.evalSiblingsProperties(sControlId, oRes.fieldsMap, aSiblingsProps);
                if(oRes3 && oRes3.success){
                 return oRes3.selector;
                }
                if(oRes3.distance < finalRes.distance){
                    finalRes={};
                    Object.assign(finalRes, oRes3);
                }
            }

            if(oRes && oRes1 && oRes2 && oRes.selector && 
                oRes1.selector && oRes2.selector){
                //Check combi
                let oSel = deepExtend(oRes1.selector, oRes2.selector, oRes.selector);
                let aCandNodes = ui5All(oSel);
                let distComp = vyperUtil.distanceNode(aCandNodes, sControlId);
                if(aCandNodes && distComp === 0) {
                    return oSel;
                }
                if(distComp < finalRes.distance){
                    finalRes.success = false;
                    finalRes.selector = oSel;
                    finalRes.distance = distComp;
                    finalRes.aNodes = aCandNodes;
                }

            }

            if(oRes && oRes1 && oRes3 && oRes.selector && 
                oRes1.selector && oRes3.selector){
                //Check combi
                let oSel = deepExtend(oRes1.selector, oRes3.selector, oRes.selector);
                let aCandNodes = ui5All(oSel);
                let distComp = vyperUtil.distanceNode(aCandNodes, sControlId);
                if(aCandNodes && distComp === 0) {
                    return oSel;
                }
                if(distComp < finalRes.distance){
                    finalRes.success = false;
                    finalRes.selector = oSel;
                    finalRes.distance = distComp;
                    finalRes.aNodes = aCandNodes;
                }
            }

            if(oRes && oRes1 && oRes2 && oRes3 && oRes.selector && 
                oRes1.selector && oRes2.selector && oRes3.selector){
                //Check combi
                oSel = deepExtend(oRes1.selector, oRes2.selector, oRes3.selector, oRes.selector);
                aCandNodes = ui5All(oSel);
                let distComp = vyperUtil.distanceNode(aCandNodes, sControlId);
                if(aCandNodes && distComp === 0) {
                    return oSel;
                }
                if(distComp < finalRes.distance){
                    finalRes.success = false;
                    finalRes.selector = oSel;
                    finalRes.distance = distComp;
                    finalRes.aNodes = aCandNodes;
                }
            }
        
            //Get aggregation & direct ancestor props
            if(oRes.fieldsMap && oAggrElement  && oElemProperties) {
                let oAncestorProperties = vyperUtil.getNextAncestorProperties(oAggrElement.getId());
                let oAncestorElemProperties = vyperUtil.getAllElementProperties(oAggrElement.getId());
                oResPar1 = evaluator.evalAncestorAggrElmProperties(finalRes.selector, oElemProperties, oAncestorElemProperties, oAncestorProperties);
                if(oResPar1.success){
                    return oResPar1.selector;
                }
                if(oResPar1.distance < finalRes.distance){
                    finalRes={};
                    Object.assign(finalRes, oResPar1);
                }
            } 
            //Get direct descendant recursively until null
            if(oRes.fieldsMap && oElemProperties) {
                let aDescendentProps = vyperUtil.getAllDescendantElementsProps(sControlId);
                evaluator.selectorDist = {
                    "success": false,
                    "distance": 999,
                    "fieldsMap": oRes.fieldsMap,
                    "selector": {},
                    "aNodes": []
                };
                oResPar1 = evaluator.evalDescendantProperties(sControlId, oRes.fieldsMap, aDescendentProps, finalRes.selector);
                if(oResPar1 && oResPar1.success){
                    return oResPar1.selector;
                }
                if(oResPar1.distance < finalRes.distance){
                    finalRes={};
                    Object.assign(finalRes, oResPar1);
                }
            }
            // Get ancestor instanceof aggregation element and then get descentants recursively, no current control, select base on ui5 property value
            if(oAggrElement && oRes.fieldsMap && oElemProperties) {
                let oAncestorElemProperties = vyperUtil.getAllElementProperties(oAggrElement.getId());
                let oAncestorProperties = vyperUtil.getNextAncestorProperties(oAggrElement.getId());
                const elmId = vyperUtil.getKeyValue(oAncestorElemProperties.ui5Properties, "id");
                let aDescendentProps = vyperUtil.getAllDescendantElementsProps(elmId);
                evaluator.selectorDist = {
                    "success": false,
                    "distance": 999,
                    "fieldsMap": oRes.fieldsMap,
                    "selector": {},
                    "aNodes": []
                };
                oResPar1 = evaluator.evalAncestorWithDescProperties(oRes.fieldsMap, oElemProperties, oAncestorElemProperties, oAncestorProperties, aDescendentProps);
                if(oResPar1.success){
                    return oResPar1.selector;
                }
                
            }
            // Retry with legacy selector
            // Get ancestor instanceof aggregation element and then get descentants recursively, no current control, select base on ui5 property value
            if(oAggrElement && oRes.fieldsMap && oElemProperties) {
                let oAncestorElemProperties = vyperUtil.getAllElementProperties(oAggrElement.getId());
                let oAncestorProperties = vyperUtil.getNextAncestorProperties(oAggrElement.getId());
                const elmId = vyperUtil.getKeyValue(oAncestorElemProperties.ui5Properties, "id");
                let aDescendentProps = vyperUtil.getAllDescendantElementsProps(elmId);
                evaluator.selectorDist = {
                    "success": false,
                    "distance": 999,
                    "fieldsMap": oRes.fieldsMap,
                    "selector": {},
                    "aNodes": []
                };
                let parentLevel = null;
                if(finalRes.selector["ancestorProperties"]) {
                    parentLevel = 1;
                    if(finalRes.selector["ancestorProperties"]["ancestorProperties"]) {
                        parentLevel = 2;
                    }
                }
                oResPar1 = evaluator.evalAncestorWithDescProperties(finalRes.fieldsMap, oElemProperties, oAncestorElemProperties, oAncestorProperties, aDescendentProps, finalRes.selector, parentLevel);
                if(oResPar1.success){
                    return oResPar1.selector;
                }
            }
            // Use index as fallback [use index as property]
            let oResIdx = evaluator.getSelectorIndex(oRes.selector, sControlId, 0);
            if(oResIdx.success){ 
                oRes.selector.elementProperties["index"] = oResIdx.index;
                return oRes.selector;
            }
            // Finished nothing found [TODO Fallback --> Try with domProperties? -> Give back all the selectors? ]
            return oRes.selector;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        } else if(oAggrElementBwt) {
            // CASE 2
            oRes = evaluator.evalElementProperties(oElemProperties);
            if(oRes.success){
                return oRes.selector;
            }
            Object.assign(finalRes, oRes);

            let oRes1 = {};
            let oRes2 = {};
            let oRes3 = {};

            if(oRes.fieldsMap && oAggrElementBwt) {
               // check ancestor use: bindingPropertyPath or i18n [add. viewName], ui5 properties,  otherwise use: id (check not generic)
               let oAncestorProperties = vyperUtil.getAllElementProperties(sControlId);
               const currentId = vyperUtil.getKeyValue(oAncestorProperties.ui5Properties, "id");
               const elmId = oAggrElementBwt.getId();
               if(elmId !== currentId) {
                    evaluator.selectorDist = {
                    "success": false,
                    "distance": 999,
                    "fieldsMap": oRes.fieldsMap,
                    "selector": {},
                    "aNodes": []
                    };
                   oRes1 = evaluator.evalAncestorProperties(sControlId, oRes.fieldsMap, oAncestorProperties, 5, elmId);
                   if(oRes1.success){
                    return oRes1.selector;
                   }
                   if(oRes1.distance < finalRes.distance){
                        finalRes={};
                        Object.assign(finalRes, oRes1);
                    }
               }
            }

            if(oRes.fieldsMap && oElemProperties) {
                // check descendant up untill null use: bindingPropertyPath or i18n [add. viewName], ui5 properties,  otherwise use: id (check not generic)
                let aDescendentProps = vyperUtil.getAllDescendantElementsProps(sControlId);
                evaluator.selectorDist = {
                    "success": false,
                    "distance": 999,
                    "fieldsMap": oRes.fieldsMap,
                    "selector": {},
                    "aNodes": []
                };
                oRes2 = evaluator.evalDescendantProperties(sControlId, oRes.fieldsMap, aDescendentProps);
                if(oRes2 && oRes2.success){
                 return oRes2.selector;
                }
                if(oRes2.distance < finalRes.distance){
                    finalRes={};
                    Object.assign(finalRes, oRes2);
                }
            }

            if(oRes.fieldsMap && oElemProperties) {
                // check siblings use: bindingPropertyPath or i18n [add. viewName], ui5 properties,  otherwise use: id (check not generic)
                let aSiblingsProps = vyperUtil.getAllSiblingProperties(sControlId);
                oRes3 = evaluator.evalSiblingsProperties(sControlId, oRes.fieldsMap, aSiblingsProps);
                if(oRes3 && oRes3.success){
                 return oRes3.selector;
                }
                if(oRes3.distance < finalRes.distance){
                    finalRes={};
                    Object.assign(finalRes, oRes3);
                }
            }

            if(oRes && oRes1 && oRes2 && oRes.selector && 
                oRes1.selector && oRes2.selector){
                //Check combi
                let oSel = deepExtend(oRes1.selector, oRes2.selector, oRes.selector);
                let aCandNodes = ui5All(oSel);
                let distComp = vyperUtil.distanceNode(aCandNodes, sControlId);
                if(aCandNodes && distComp === 0) {
                    return oSel;
                }
                if(distComp < finalRes.distance){
                    finalRes.success = false;
                    finalRes.selector = oSel;
                    finalRes.distance = distComp;
                    finalRes.aNodes = aCandNodes;
                }

            }

            if(oRes && oRes1 && oRes3 && oRes.selector && 
                oRes1.selector && oRes3.selector){
                //Check combi
                let oSel = deepExtend(oRes1.selector, oRes3.selector, oRes.selector);
                let aCandNodes = ui5All(oSel);
                let distComp = vyperUtil.distanceNode(aCandNodes, sControlId);
                if(aCandNodes && distComp === 0) {
                    return oSel;
                }
                if(distComp < finalRes.distance){
                    finalRes.success = false;
                    finalRes.selector = oSel;
                    finalRes.distance = distComp;
                    finalRes.aNodes = aCandNodes;
                }
            }

            if(oRes && oRes1 && oRes2 && oRes3 && oRes.selector && 
                oRes1.selector && oRes2.selector && oRes3.selector){
                //Check combi
                oSel = deepExtend(oRes1.selector, oRes2.selector, oRes3.selector, oRes.selector);
                aCandNodes = ui5All(oSel);
                let distComp = vyperUtil.distanceNode(aCandNodes, sControlId);
                if(aCandNodes && distComp === 0) {
                    return oSel;
                }
                if(distComp < finalRes.distance){
                    finalRes.success = false;
                    finalRes.selector = oSel;
                    finalRes.distance = distComp;
                    finalRes.aNodes = aCandNodes;
                }
            }

            // Get ancestor instanceof aggregation element and then get descentants recursively, no current control, select base on ui5 property value
            if(oAggrElementBwt && oRes.fieldsMap && oElemProperties) {
                let oAncestorElemProperties = vyperUtil.getAllElementProperties(oAggrElementBwt.getId());
                let oAncestorProperties = vyperUtil.getNextAncestorProperties(oAggrElementBwt.getId());
                const elmId = vyperUtil.getKeyValue(oAncestorElemProperties.ui5Properties, "id");
                let aDescendentProps = vyperUtil.getAllDescendantElementsProps(elmId);
                evaluator.selectorDist = {
                    "success": false,
                    "distance": 999,
                    "fieldsMap": oRes.fieldsMap,
                    "selector": {},
                    "aNodes": []
                };
                oResPar1 = evaluator.evalAncestorWithDescProperties(oRes.fieldsMap, oElemProperties, oAncestorElemProperties, oAncestorProperties, aDescendentProps);
                if(oResPar1.success){
                    return oResPar1.selector;
                }
            }

            // Retry with legacy selector
            // Get ancestor instanceof aggregation element and then get descentants recursively, no current control, select base on ui5 property value
            if(oAggrElementBwt && oRes.fieldsMap && oElemProperties) {
                let oAncestorElemProperties = vyperUtil.getAllElementProperties(oAggrElementBwt.getId());
                let oAncestorProperties = vyperUtil.getNextAncestorProperties(oAggrElementBwt.getId());
                const elmId = vyperUtil.getKeyValue(oAncestorElemProperties.ui5Properties, "id");
                let aDescendentProps = vyperUtil.getAllDescendantElementsProps(elmId);
                evaluator.selectorDist = {
                    "success": false,
                    "distance": 999,
                    "fieldsMap": oRes.fieldsMap,
                    "selector": {},
                    "aNodes": []
                };
                let parentLevel = null;
                if(finalRes.selector["ancestorProperties"]) {
                    parentLevel = 1;
                    if(finalRes.selector["ancestorProperties"]["ancestorProperties"]) {
                        parentLevel = 2;
                    }
                }
                oResPar1 = evaluator.evalAncestorWithDescProperties(finalRes.fieldsMap, oElemProperties, oAncestorElemProperties, oAncestorProperties, aDescendentProps, finalRes.selector, parentLevel);
                if(oResPar1.success){
                    return oResPar1.selector;
                }
            }

             // Use index as fallback [use index as property]
             let oResIdx = evaluator.getSelectorIndex(oRes.selector, sControlId, 0);
             if(oResIdx.success){ 
                 oRes.selector.elementProperties["index"] = oResIdx.index;
                 return oRes.selector;
             }
            // Finished 
            return oRes.selector;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
        } else if(oAggrElementExactly) {
            if(!oElemProperties) return {};
            
            // CASE 3
            oRes = evaluator.evalElementProperties(oElemProperties);
            if(oRes.success){
                return oRes.selector;
            }

            Object.assign(finalRes, oRes);

            let oRes1 = {};
            let oRes2 = {};
            let oRes3 = {};

            if(oRes.fieldsMap && oAggrElementExactly) {
                // check ancestor use: bindingProperty/aggregation/association Path or i18n [add. viewName], otherwise use: id (check not generic)
                let oAncestorProperties = vyperUtil.getNextAncestorProperties(sControlId);
                evaluator.selectorDist = {
                    "success": false,
                    "distance": 999,
                    "fieldsMap": oRes.fieldsMap,
                    "selector": {},
                    "aNodes": []
                };
                oRes1 = evaluator.evalAncestorProperties(sControlId, oRes.fieldsMap, oAncestorProperties, 5);
                if(oRes1.success){
                 return oRes1.selector;
                }
                if(oRes1.distance < finalRes.distance){
                    finalRes={};
                    Object.assign(finalRes, oRes1);
                }
             }

             if(oRes.fieldsMap && oElemProperties) {
                // check descendant use: bindingProperty/aggregation/association Path or i18n [add. viewName], otherwise use: id (check not generic)
                let aDescendentProps = vyperUtil.getAllDescendantElementsProps(sControlId);
                evaluator.selectorDist = {
                    "success": false,
                    "distance": 999,
                    "fieldsMap": oRes.fieldsMap,
                    "selector": {},
                    "aNodes": []
                };
                oRes2 = evaluator.evalDescendantProperties(sControlId, oRes.fieldsMap, aDescendentProps);
                if(oRes2.success){
                 return oRes2.selector;
                }
                if(oRes2.distance < finalRes.distance){
                    finalRes={};
                    Object.assign(finalRes, oRes2);
                }
            }

            if(oRes.fieldsMap && oElemProperties) {
                // check siblings use: bindingProperty/aggregation/association Path or i18n [add. viewName], otherwise use: id (check not generic)
                let aSiblingsProps = vyperUtil.getAllSiblingProperties(sControlId);
                oRes3 = evaluator.evalSiblingsProperties(sControlId, oRes.fieldsMap, aSiblingsProps);
                if(oRes3.success){
                 return oRes3.selector;
                }
                if(oRes3.distance < finalRes.distance){
                    finalRes={};
                    Object.assign(finalRes, oRes3);
                }
            }

            if(oRes && oRes1 && oRes2 && oRes.selector && 
                oRes1.selector && oRes2.selector){
                //Check combi
                let oSel = deepExtend(oRes1.selector, oRes2.selector, oRes.selector);
                let aCandNodes = ui5All(oSel);
                let distComp = vyperUtil.distanceNode(aCandNodes, sControlId);
                if(aCandNodes && distComp === 0) {
                    return oSel;
                }
                if(distComp < finalRes.distance){
                    finalRes.success = false;
                    finalRes.selector = oSel;
                    finalRes.distance = distComp;
                    finalRes.aNodes = aCandNodes;
                }

            }

            if(oRes && oRes1 && oRes3 && oRes.selector && 
                oRes1.selector && oRes3.selector){
                //Check combi
                let oSel = deepExtend(oRes1.selector, oRes3.selector, oRes.selector);
                let aCandNodes = ui5All(oSel);
                let distComp = vyperUtil.distanceNode(aCandNodes, sControlId);
                if(aCandNodes && distComp === 0) {
                    return oSel;
                }
                if(distComp < finalRes.distance){
                    finalRes.success = false;
                    finalRes.selector = oSel;
                    finalRes.distance = distComp;
                    finalRes.aNodes = aCandNodes;
                }
            }

            if(oRes && oRes1 && oRes2 && oRes3 && oRes.selector && 
                oRes1.selector && oRes2.selector && oRes3.selector){
                //Check combi
                oSel = deepExtend(oRes1.selector, oRes2.selector, oRes3.selector, oRes.selector);
                aCandNodes = ui5All(oSel);
                let distComp = vyperUtil.distanceNode(aCandNodes, sControlId);
                if(aCandNodes && distComp === 0) {
                    return oSel;
                }
                if(distComp < finalRes.distance){
                    finalRes.success = false;
                    finalRes.selector = oSel;
                    finalRes.distance = distComp;
                    finalRes.aNodes = aCandNodes;
                }
            }

             // Use index as fallback [use index as property]
             let oResIdx = evaluator.getSelectorIndex(oRes.selector, sControlId, 0);
             if(oResIdx.success){ 
                 oRes.selector.elementProperties["index"] = oResIdx.index;
                 return oRes.selector;
             }

            // Finished 
            return oRes.selector;
        } else {
            let oRes1 = {};
            let oRes2 = {};
            let oRes3 = {};
            // No agregation element
            oRes = evaluator.evalElementProperties(oElemProperties);
            if(oRes.success){
                return oRes.selector;
            }

            Object.assign(finalRes, oRes);

            if(oRes.fieldsMap && oElemProperties) {
                // check ancestor use: bindingProperty/aggregation/association Path or i18n [add. viewName], property, id (check not generic)
                let oAncestorProperties = vyperUtil.getNextAncestorProperties(sControlId);
                evaluator.selectorDist = {
                    "success": false,
                    "distance": 999,
                    "fieldsMap": oRes.fieldsMap,
                    "selector": {},
                    "aNodes": []
                };
                oRes1 = evaluator.evalAncestorProperties(sControlId, oRes.fieldsMap, oAncestorProperties, 5);
                if(oRes1.success){
                 return oRes1.selector;
                }
                if(oRes1.distance < finalRes.distance){
                    finalRes={};
                    Object.assign(finalRes, oRes1);
                }
             }

             if(oRes.fieldsMap && oElemProperties) {
                // check descendant use: bindingProperty/aggregation/association Path or i18n [add. viewName], property, id (check not generic)
                let aDescendentProps = vyperUtil.getAllDescendantElementsProps(sControlId);
                evaluator.selectorDist = {
                    "success": false,
                    "distance": 999,
                    "fieldsMap": oRes.fieldsMap,
                    "selector": {},
                    "aNodes": []
                };
                oRes2 = evaluator.evalDescendantProperties(sControlId, oRes.fieldsMap, aDescendentProps);
                if(oRes2.success){
                 return oRes2.selector;
                }
                if(oRes2.distance < finalRes.distance){
                    finalRes={};
                    Object.assign(finalRes, oRes2);
                }
            }

            if(oRes.fieldsMap && oElemProperties) {
                // check siblings use: bindingProperty/aggregation/association Path or i18n [add. viewName], property, id (check not generic)
                let aSiblingsProps = vyperUtil.getAllSiblingProperties(sControlId);
                oRes3 = evaluator.evalSiblingsProperties(sControlId, oRes.fieldsMap, aSiblingsProps);
                if(oRes3.success){
                 return oRes3.selector;
                }
                if(oRes3.distance < finalRes.distance){
                    finalRes={};
                    Object.assign(finalRes, oRes3);
                }
            }
//////////////////////////////////////////Try with selectors associations//////////////////////////////

            if(oRes && oRes1 && oRes2 && oRes.selector && 
                oRes1.selector && oRes2.selector){
                //Check combi
                let oSel = deepExtend(oRes1.selector, oRes2.selector, oRes.selector);
                let aCandNodes = ui5All(oSel);
                if(aCandNodes && vyperUtil.distanceNode(aCandNodes, id) === 0) {
                    return oSel;
                }

            }

            if(oRes && oRes1 && oRes2 && oRes3 && oRes.selector && 
                oRes1.selector && oRes2.selector && oRes3.selector){
                //Check combi
                oSel = deepExtend(oRes1.selector, oRes2.selector, oRes3.selector, oRes.selector);
                aCandNodes = ui5All(oSel);
                let distComp = vyperUtil.distanceNode(aCandNodes, id);
                if(aCandNodes && distComp === 0) {
                    return oSel;
                }
                if(distComp < finalRes.distance){
                    finalRes.success = false;
                    finalRes.selector = oSel;
                    finalRes.distance = distComp;
                    finalRes.aNodes = aCandNodes;
                }
            }

            if(oRes && oRes1 && oRes3 && oRes.selector && 
                oRes1.selector && oRes3.selector){
                //Check combi
                let oSel = deepExtend(oRes1.selector, oRes3.selector, oRes.selector);
                let aCandNodes = ui5All(oSel);
                let distComp = vyperUtil.distanceNode(aCandNodes, sControlId);
                if(aCandNodes && distComp === 0) {
                    return oSel;
                }
                if(distComp < finalRes.distance){
                    finalRes.success = false;
                    finalRes.selector = oSel;
                    finalRes.distance = distComp;
                    finalRes.aNodes = aCandNodes;
                }
            }

            if(oRes && oRes1 && oRes2 && oRes3 && oRes.selector && 
                oRes1.selector && oRes2.selector && oRes3.selector){
                //Check combi
                oSel = deepExtend(oRes1.selector, oRes2.selector, oRes3.selector, oRes.selector);
                aCandNodes = ui5All(oSel);
                let distComp = vyperUtil.distanceNode(aCandNodes, sControlId);
                if(aCandNodes && distComp === 0) {
                    return oSel;
                }
                if(distComp < finalRes.distance){
                    finalRes.success = false;
                    finalRes.selector = oSel;
                    finalRes.distance = distComp;
                    finalRes.aNodes = aCandNodes;
                }
            }

             // Use index as fallback [use index as property]
             let oResIdx = evaluator.getSelectorIndex(oRes.selector, sControlId, 0);
             if(oResIdx.success){ 
                 oRes.selector.elementProperties["index"] = oResIdx.index;
                 return oRes.selector;
             }

            // Finished 
            return oRes.selector;
        }
    }
};
window.ElementCentricStrategy = new ElementCentricStrategy();
module.exports = window.ElementCentricStrategy;
//});