var ReuseDictionary = {
    "no action": "ui5.common.locator.getDisplayedElement",
    "click": "ui5.common.userInteraction.click",
    "clear": "ui5.common.userInteraction.clear",
    "clearAndRetry": "ui5.common.userInteraction.clearAndRetry",
    "fill": "ui5.common.userInteraction.fill",
    "fillAndRetry":"ui5.common.userInteraction.fillAndRetry",
    "clearAndFill": "ui5.common.userInteraction.clearAndFill",
    "clearFillAndRetry": "ui5.common.userInteraction.clearFillAndRetry"

};

var ReuseActions = function(){
    this.doNonUI5Action = function(sAction, oElm, sVal) {
        if(sAction && oElm) {
            if(sAction === ""){
                return true;
            } else if(sVal && sAction.indexOf("clearAndFill")!== -1 || sAction.indexOf("clearAndFillAndRetry")!== -1) {
                this.setValueNonUI5(oElm, "");
                return this.setValueNonUI5(oElm, sVal);
            } else if(sVal && sAction.indexOf("fill")!== -1 || sAction.indexOf("fillAndRetry")!== -1) {
                return this.setValueNonUI5(oElm, sVal);
            } else if(sAction.indexOf("clear")!== -1 || sAction.indexOf("clearAndRetry")!== -1) {
                return this.setValueNonUI5(oElm, "");
            } else if(sAction.indexOf("click")!== -1) {
                return this.clickNonUI5(oElm);
            } 
        }
        return false;
    },

     //non_ui5.common.userInteraction.click
     this.clickNonUI5 = function(oElm) {
        if(oElm.click) {
            oElm.click();
            return true;
        }
        return false;
    },

    //non_ui5.common.userInteraction.clear
    //non_ui5.common.userInteraction.clearAndRetry
    //non_ui5.common.userInteraction.fill
    //non_ui5.common.userInteraction.fillAndRetry
    //non_ui5.common.userInteraction.clearAndFill
    //non_ui5.common.userInteraction.clearAndFillAndRetry
    this.setValueNonUI5 = function(oElm, val) {
        if(oElm && (oElm.value !== null && oElm.value !== undefined)) {
            oElm.value = val;
            return true;
        } 
        return false;
    }



    this.doAction = function(sAction, oElm, sVal) {
        if(sAction && oElm) {
            if(sAction === "no action"){
                return true;
            } else if(sAction === "click") {
                return this.click(oElm);
            } else if(sAction === "clear" || sAction === "clearAndRetry") {
                return this.setValue(oElm, "");
            } else if(sVal && sAction === "fill" || sAction === "fillAndRetry") {
                return this.setValue(oElm, sVal);
            } else if(sVal && sAction === "clearAndFill" || sAction === "clearFillAndRetry") {
                this.setValue(oElm, "");
                return this.setValue(oElm, sVal);
            }
        }
        return false;
    },
    //ui5.common.userInteraction.click
    this.click = function(oElm) {
        let oControl = sap.ui.getCore().byId(oElm.id);
        if(oControl && oControl.firePress) {
            oControl.firePress();
            return true;
        } else if(oControl && oControl.fireSelect){
            oControl.fireSelect();
            return true;
        }
        if(oElm.click) {
            oElm.click();
            return true;
        }
        return false;
    },
    //ui5.common.userInteraction.clear
    //ui5.common.userInteraction.clearAndRetry
    //ui5.common.userInteraction.fill
    //ui5.common.userInteraction.fillAndRetry
    //ui5.common.userInteraction.clearAndFill
    //ui5.common.userInteraction.clearFillAndRetry
    this.setValue = function(oElm, val) {

        let oControl = sap.ui.getCore().byId(oElm.id);
        if(oControl && oControl.setValue) {
            oControl.setValue(val);
            return true;
        }

        if(oControl && oControl.setText) {
            oControl.setText(val);
            return true;
        }

        let nElem = document.querySelector('input[id*="' + oElm.id + '"]');
        if(nElem && (nElem.value !== null && nElem.value !== undefined)) {
            nElem.value = val;
            return true;
        }

        nElem = document.querySelector('textarea[id*="' + oElm.id + '"]');
        if(nElem && (nElem.value !== null && nElem.value !== undefined)) {
            nElem.value = val;
            return true;
        }

        if(oElm.value !== null && oElm.value !== undefined) {
            oElm.value = val;
            return true;
        } 
        return false;
    }
    
};
module.exports = new ReuseActions();