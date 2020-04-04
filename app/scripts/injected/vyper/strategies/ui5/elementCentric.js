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
sap.ui.require([
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
], function(ListItemBase, Row, Item, MenuItemBase, Menu, NavigationList, ComboBoxBase, ListBase, Table, MultiInput) {
var vyperUtil = require('../../utils/vyperUtil');
var evaluator = require('../../utils/selectorEvaluators');
var ElementCentricStrategy = function() {

    this.checkAggregationElement = function(oControl) {
        if(!oControl) return false;
        return oControl instanceof ListItemBase ||
        oControl instanceof Row ||
        oControl instanceof Item ||
        oControl instanceof MenuItemBase ||
        oControl instanceof Menu;
    }

    this.checkAggregation = function(oControl) {
        if(!oControl) return false;
        return oControl instanceof NavigationList ||
        oControl instanceof ComboBoxBase ||
        oControl instanceof ListBase ||
        oControl instanceof Table ||
        oControl instanceof MultiInput;
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
        var oRes = [];
        var oResPar1 = [];
        if(!sControlId) return {};
        let oElemProperties = vyperUtil.getAllElementProperties(sControlId);
        let oAggrElement = this.checkIfAggrOrDescendantElem(oElemProperties);
        let oAggrElementBwt = this.checkIfBwtAggrAndAggrElem(oElemProperties);
        let oAggrElementExactly = this.checkIfAggregationExactly(oElemProperties);
        if(oAggrElement){
            // CASE 1
            oRes = evaluator.evalElementProperties(oElemProperties, true, false, false);
            if(oRes.success){
                return oRes.selector;
            }
            //Get aggregation & direct ancestor props
            if(oRes.fieldsMap && oAggrElement  && oElemProperties) {
                //let aDescendentProps = vyperUtil.getAllDescendantElementsProps(oElemProperties.ui5Properties.id);
                let oAncestorProperties = vyperUtil.getNextAncestorProperties(oAggrElement.getId());
                let oAncestorElemProperties = vyperUtil.getAllElementProperties(oAggrElement.getId());
                oResPar1 = evaluator.evalAncestorAggrElmProperties(oRes.fieldsMap, oElemProperties, oAncestorProperties, oAncestorElemProperties);
                if(oResPar1.success){
                    return oResPar1.selector;
                }
            } else {
                oResPar1.fieldsMap = oRes.fieldsMap;
            }
            //Get direct descendant recursively until null
            if(oResPar1.fieldsMap && oElemProperties) {
                let aDescendentProps = vyperUtil.getAllDescendantElementsProps(oElemProperties.ui5Properties.id);
                oResPar1 = evaluator.evalDescendantAggrProperties(oResPar1.fieldsMap, oElemProperties, aDescendentProps);
                if(oResPar1.success){
                    return oResPar1.selector;
                }
            }
            // Get ancestor instanceof aggregation element and then get descentants recursively, no current control, select base on ui5 property value
            if(oAggrElement && oRes.fieldsMap && oElemProperties) {
                let oAncestorElemProperties = vyperUtil.getAllElementProperties(oAggrElement.getId());
                let aDescendentProps = vyperUtil.getAllDescendantElementsProps(oAncestorProperties.ui5Properties.id);
                oRes = evaluator.evalAncestorWithDescProperties(oRes.fieldsMap, oElemProperties, oAncestorElemProperties, aDescendentProps);
                if(oRes.success){
                    return oRes.selector;
                }
            }
            // Use index as fallback [use index as property]
            oRes = evaluator.getIndex(oRes.fieldsMap, oElemProperties);
            if(oRes.success){
                return oRes.selector;
            }
            // Finished 
            return oRes.selector;
        } else if(oAggrElementBwt) {
            // CASE 2
            oRes = evaluator.evalElementProperties(oElemProperties, true, true, false);
            if(oRes.success){
                return oRes.selector;
            }

            if(oRes.fieldsMap && oAggrElementBwt) {
               // check ancestor use: bindingPropertyPath or i18n [add. viewName], ui5 properties,  otherwise use: id (check not generic)
               let oAncestorProperties = vyperUtil.getAllElementProperties(oAggrElementBwt.getId());
               oRes = evaluator.evalBwtAncestorProperties(oRes.fieldsMap, oElemProperties, oAncestorProperties);
               if(oRes.success){
                return oRes.selector;
               }
            }

            if(oRes.fieldsMap && oElemProperties) {
                // check descendant use: bindingPropertyPath or i18n [add. viewName], ui5 properties,  otherwise use: id (check not generic)
                let aDescendentProps = vyperUtil.getAllDescendantElementsProps(oElemProperties.ui5Properties.id);
                oRes = evaluator.evalBwtDescendantProperties(oRes.fieldsMap, oElemProperties, aDescendentProps);
                if(oRes.success){
                 return oRes.selector;
                }
            }

            if(oRes.fieldsMap && oElemProperties) {
                // check descendant use: bindingPropertyPath or i18n [add. viewName], ui5 properties,  otherwise use: id (check not generic)
                let aSiblingsProps = vyperUtil.getAllSiblingProperties(oElemProperties.ui5Properties.id);
                oRes = evaluator.evalBwtSiblingsProperties(oRes.fieldsMap, oElemProperties, aSiblingsProps);
                if(oRes.success){
                 return oRes.selector;
                }
            }

             // Use index as fallback [use index as property]
             oRes = evaluator.getIndex(oRes.fieldsMap, oElemProperties);
             if(oRes.success){
                 return oRes.selector;
             }
            // Finished 
            return oRes.selector;
        } else if(oAggrElementExactly) {
            // CASE 3
            oRes = evaluator.evalElementProperties(oElemProperties, true, false, true);
            if(oRes.success){
                return oRes.selector;
            }

            if(oRes.fieldsMap && oAggrElementExactly) {
                // check ancestor use: bindingProperty/aggregation/association Path or i18n [add. viewName], otherwise use: id (check not generic)
                let oAncestorProperties = vyperUtil.getAllElementProperties(oAggrElementExactly.getId());
                oRes = evaluator.evalExactlyAncestorsProperties(oRes.fieldsMap, oElemProperties, oAncestorProperties);
                if(oRes.success){
                 return oRes.selector;
                }
             }

             if(oRes.fieldsMap && oElemProperties) {
                // check descendant use: bindingProperty/aggregation/association Path or i18n [add. viewName], otherwise use: id (check not generic)
                let aDescendentProps = vyperUtil.getAllDescendantElementsProps(oElemProperties.ui5Properties.id);
                oRes = evaluator.evalExactlyDescentantsProperties(oRes.fieldsMap, oElemProperties, aDescendentProps);
                if(oRes.success){
                 return oRes.selector;
                }
            }

            if(oRes.fieldsMap && oElemProperties) {
                // check siblings use: bindingProperty/aggregation/association Path or i18n [add. viewName], otherwise use: id (check not generic)
                let aSiblingsProps = vyperUtil.getAllSiblingProperties(oElemProperties.ui5Properties.id);
                oRes = evaluator.evalExactlySiblingsProperties(oRes.fieldsMap, oElemProperties, aSiblingsProps);
                if(oRes.success){
                 return oRes.selector;
                }
            }
 
            if(oRes.fieldsMap && oElemProperties) {
                oRes = evaluator.evalUIPropertiesForElement(oRes.fieldsMap, oElemProperties);
                if(oRes.success){
                 return oRes.selector;
                }
            }
            // Finished 
            return oRes.selector;
        } else {
            // No agregation element
            oRes = evaluator.evalElementProperties(oElemProperties, false, false, false);
            if(oRes.success){
                return oRes.selector;
            } 

            if(oRes.fieldsMap && oAggrElementExactly) {
                // check ancestor use: bindingProperty/aggregation/association Path or i18n [add. viewName], property, id (check not generic)
                let oAncestorProperties = vyperUtil.getNextAncestorProperties(sControlId);
                oRes = evaluator.evalAncestorsProperties(oRes.fieldsMap, oElemProperties, oAncestorProperties);
                if(oRes.success){
                 return oRes.selector;
                }
             }

             if(oRes.fieldsMap && oElemProperties) {
                // check descendant use: bindingProperty/aggregation/association Path or i18n [add. viewName], property, id (check not generic)
                let aDescendentProps = vyperUtil.getAllDescendantElementsProps(oElemProperties.ui5Properties.id);
                oRes = evaluator.evalDescentantsProperties(oRes.fieldsMap, oElemProperties, aDescendentProps);
                if(oRes.success){
                 return oRes.selector;
                }
            }

            if(oRes.fieldsMap && oElemProperties) {
                // check siblings use: bindingProperty/aggregation/association Path or i18n [add. viewName], property, id (check not generic)
                let aSiblingsProps = vyperUtil.getAllSiblingProperties(oElemProperties.ui5Properties.id);
                oRes = evaluator.evalSiblingsProperties(oRes.fieldsMap, oElemProperties, aSiblingsProps);
                if(oRes.success){
                 return oRes.selector;
                }
            }

            // Finished 
            return oRes.selector;
        }
    }
};
window.ElementCentricStrategy = new ElementCentricStrategy();
module.exports = window.ElementCentricStrategy;
});