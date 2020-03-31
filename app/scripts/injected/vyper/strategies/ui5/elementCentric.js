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
/////////////////////////////////PARALLEL///////////////////////////////////////////////////////////////////////////////////////////////
// ---------> get ancestor and then get descentants, select base on ui5 property value (only where value != boolean?,'', null,undefined) (try it ui5All)
// ---------> not found unique descentant
// ---------> PARALLEL
// ---------> get descendants of the descendants select base on ui5 property value (only where value != '', null,undefined)
// ---------> repeat as long as no descendants found
// ---------> PARALLEL
// ---------> get siblings of the descendants, try bindings,i18n & ui5 properties (only where value != '', null,undefined) (try it ui5All)
// ---------> PARALLEL
// ---------> get direct descendant (only where value != boolean?,'', null,undefined) (try it ui5All)
// ---------> PARALLEL
// ---------> get direct ancestor (try it ui5All) ----> not important
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
// ------> check siblings
// use: bindingPropertyPath or i18n [add. viewName], ui5 properties, otherwise use: id (check not generic) (try it ui5All)
// ------> PARALLEL
// ------> check descendant  
// use: bindingPropertyPath or i18n [add. viewName], ui5 properties,  otherwise use: id (check not generic) (try it ui5All)
// ------> PARALLEL
// ------> check ancestor
// use: bindingPropertyPath or i18n [add. viewName], ui5 properties,  otherwise use: id (check not generic) (try it ui5All)
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
// PARALLEL
// not found
// Check ui5Properties (ignore booleans for this phase)
// PARALLEL
// if not found: check siblings
// use: bindingProperty/aggregation/association Path or i18n [add. viewName], otherwise use: id (check not generic) (try it ui5All)
// PARALLEL
// if not found: check ancestor
// use: bindingProperty/aggregation/association Path or i18n [add. viewName], otherwise use: id (check not generic) (try it ui5All)
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

var vyperUtil = require('../../utils/vyperUtil');
var ui5All = require('../../utils/vyperLocator');
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
var ElementCentricStrategy = function() {
    this.getKeyValue = function(oControlProps, key) {
        if(oControlProps && key !== null && key !== undefined) {
            for (let index = 0; index < oControlProps.length; index++) {
                const prop = oControlProps[index];
                if(prop && prop[key]){
                    return prop[key];
                }
            }
        }
    }

    this.checkAggregationElement = function(oControl) {
        return oControl instanceof ListItemBase ||
        oControl instanceof Row ||
        oControl instanceof Item ||
        oControl instanceof MenuItemBase ||
        oControl instanceof Menu;
    }

    this.checkAggregation = function(oControl) {
        return oControl instanceof NavigationList ||
        oControl instanceof ComboBoxBase ||
        oControl instanceof ListBase ||
        oControl instanceof Table ||
        oControl instanceof MultiInput;
    }

    this.recursiveCheckDescendantOfAggregation = function(oControl) {
        if(this.checkAggregation(oControl)){
            return false;
        } else {
            var oParentControl = vyperUtil.findNextAncestor(oControl);
            if(oParentControl && !this.checkAggregation(oParentControl)) {
                // Get  next parent until finding aggregation element
                return this.recursiveCheckDescendantOfAggregation(oParentControl);
            } else if(oParentControl && this.checkAggregation(oParentControl)) {
                return true;
            } else {
                return false;
            }
        }
    }

    this.recursiveCheckAncestorElemOrDesc = function(oControl) {
        if(this.checkAggregation(oControl)) return false;
        if(!this.checkAggregationElement(oControl)) {
            var oParentControl = vyperUtil.findNextAncestor(oControl);
            if(oParentControl && !this.checkAggregation(oParentControl)) {
                // Get  next parent until finding aggregation element
                return this.recursiveCheckAncestorElemOrDesc(oParentControl);
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    // CASE 1
    this.checkIfAggrOrDescendantElem = function(oControlProps) {
        let cntlId = this.getKeyValue(oControlProps.ui5Properties,"id");
        if(oControlProps && cntlId) {
            var oControl = sap.ui.getCore().byId(cntlId);
            return this.recursiveCheckAncestorElemOrDesc(oControl);
        }
    }

     // CASE 2
     this.checkIfBwtAggrAndAggrElem = function(oControlProps) {
        let cntlId = this.getKeyValue(oControlProps.ui5Properties,"id");
        if(oControlProps && cntlId) {
            var oControl = sap.ui.getCore().byId(cntlId);
            return this.recursiveCheckDescendantOfAggregation(oControl) && 
            (!this.recursiveCheckAncestorElemOrDesc(oControl));
        }
    }

    // CASE 3
    this.checkIfAggregationExactly = function(oControlProps) {
        let cntlId = this.getKeyValue(oControlProps.ui5Properties,"id");
        if(oControlProps && cntlId) {
            var oControl = sap.ui.getCore().byId(cntlId);
            return this.checkAggregation(oControl);
        }
    }

     // Check agreggation element
     this.checkIfAggregationElement = function(oControlProps) {
        let cntlId = this.getKeyValue(oControlProps.ui5Properties,"id");
        if(oControlProps && cntlId) {
            var oControl = sap.ui.getCore().byId(cntlId);
            return this.recursiveCheckDescendantOfAggregation(oControl) || 
            this.recursiveCheckAncestorElemOrDesc(oControl);
        }
    }
};
window.ElementCentricStrategy = new ElementCentricStrategy();
module.exports = new ElementCentricStrategy();
});