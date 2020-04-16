var ReuseDictionary = {
    "click": "ui5.common.userInteraction.click",
    "clear": "ui5.common.userInteraction.clear",
    "clearAndRetry": "ui5.common.userInteraction.clearAndRetry",
    "fill": "ui5.common.userInteraction.fill",
    "fillAndRetry":"ui5.common.userInteraction.fillAndRetry",
    "clearAndFill": "ui5.common.userInteraction.clearAndFill",
    "clearFillAndRetry": "ui5.common.userInteraction.clearFillAndRetry"

};

var ReuseActions = function(){
    this.doAction = function(sAction, oElm, sVal) {
        if(sAction && oElm) {
            if(sAction === "click") {
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
            if(oControl.getVisible() && oControl.getEnabled()) {
                oControl.firePress();
                return true;
            }
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
            if(oControl.getVisible() && oControl.getEnabled()) {
                oControl.setValue(val);
                return true;
            }
        }

        if(oControl && oControl.setText) {
            if(oControl.getVisible() && oControl.getEnabled()) {
                oControl.setText(val);
                return true;
            }
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