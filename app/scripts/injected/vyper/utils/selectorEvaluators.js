var vyperUtil = require('./vyperUtil');
var ui5All = require('./vyperLocator');
var queryBuilder = require('./queryBuilder');
var Evaluator = function() {
    this.evaluateBindingContextPath = function(sBindingContextPathVal) {
        var sBinding = sBindingContextPathVal;
        if(sBindingContextPathVal) {
            let aSplBPathAll = []; 
            let aSplBPath = sBindingContextPathVal.split(","); 
            for (let index = 0; index < aSplBPath.length; index++) {
                let sPart = aSplBPath[index];
                let aRest = sPart.split("(");
                if(aRest) {
                    for (let index = 0; index < aRest.length; index++) {
                        const sStr = aRest[index];
                        aSplBPathAll.push(sStr);
                    }
                }
            }
            if(aSplBPathAll && aSplBPathAll.length > 0){
                let aUsedPart = [];
                for (let index = 0; index < aSplBPathAll.length; index++) {
                    let sPart = aSplBPathAll[index];
                    if(sPart.indexOf("guid") === -1 && 
                        sPart.indexOf("true") === -1 &&
                        sPart.indexOf("false") === -1 &&
                        sPart.indexOf("'true'") === -1 &&
                        sPart.indexOf("'false'") === -1) {
                            aUsedPart.push(sPart);
                            if(index < aSplBPathAll.length -1) {
                                aUsedPart.push("*");
                            }
                        }
                }
                if(aUsedPart){
                    sBinding = "";
                    for (let index = 0; index < aUsedPart.length; index++) {
                        sBinding = sBinding + aUsedPart[index];
                    }
                }
            }
        }
        return sBinding;
    }

    this.filterBindingProperties = function(aBindingPropertiesPaths, aExludeProps, aExclPatterns, aExclTypes, aPrefProperties) {
        aBindingProps = {};
        if(aBindingPropertiesPaths && aBindingPropertiesPaths.length > 0) {
            for (let index = 0; index < aBindingPropertiesPaths.length; index++) {
                const oPropObj = aBindingPropertiesPaths[index];
                const key = Object.keys(oPropObj)[0];
                const aValues = oPropObj[key];
                // Exclude props
                let mustExcl = false;
                if(aExludeProps) {
                    for (let i = 0; i < aExludeProps.length; i++) {
                        const exProp = aExludeProps[i];
                        if(exProp && key){
                            const exPropLow = exProp.toLocaleLowerCase();
                            const keyLow = key.toLocaleLowerCase();
                            if(keyLow === exPropLow) {
                                mustExcl = true;
                                break;
                            }
                        }  
                    }
                } 
                if(!mustExcl) {
                    let aBindFiltCand = {};
                    let aValCand = [];
                    if(aExclPatterns) {
                        for (let i = 0; i < aValues.length; i++) {
                            const oValue = aValues[i];
                            const bindPath = oValue.path;
                            let bIsExPattern = false;
                            for (let j = 0; j < aExclPatterns.length; j++) {
                                const exPatern = aExclPatterns[j]; 
                                if(exPatern && bindPath) {
                                    if(bindPath.toLocaleLowerCase().indexOf(exPatern) !== -1){
                                        bIsExPattern = true;
                                        break;
                                    }
                                }
                            }
                            if(!bIsExPattern) {
                                aValCand.push(oValue);
                            }
                        }
                        if(aValCand.length > 0) {
                            aBindFiltCand[key] = aValCand;
                        }
                    } else {
                        aBindFiltCand[key] = aValues;
                    }

                    if(aExclTypes) {
                        let aValCand2 = [];
                        for (let i = 0; i < aBindFiltCand[key].length; i++) {
                            const oValue = aBindFiltCand[key][i];
                            const bindType = oValue.type;
                            let bIsExType = false;
                            for (let j = 0; j < aExclTypes.length; j++) {
                                const exType = aExclTypes[j]; 
                                if(exType && bindType) {
                                    if(bindType.indexOf(exType) !== -1){
                                        bIsExType = true;
                                        break;
                                    }
                                }
                            }
                            if(!bIsExType) {
                                aValCand2.push(oValue);
                            }
                        }
                        if(aValCand2.length > 0) {
                            aBindingProps[key] = aValCand2;
                        }
                    } else {
                        aBindingProps[key] = aBindFiltCand[key];
                    }
                } 
            }
        }
        if(aPrefProperties && aPrefProperties.length > 0 && aBindingProps){
            // Filtered bindingProp
            let aBindFilteredProp = {}; 
            let aKeys = Object.keys(aBindingProps);
            //Filter only preferable
            for (let index = 0; index < aKeys.length; index++) {
                const sKey = aKeys[index];
                if(aPrefProperties.includes(sKey)){
                    aBindFilteredProp[sKey] = aBindingProps[sKey];
                    return aBindFilteredProp;
                }
            }
            // Default Filtered bindingProp
            aBindFilteredProp1 = {};
            //Filter only preferable first i18n
            for (let index = 0; index < aKeys.length; index++) {
                const sKey = aKeys[index];
                if(aBindingProps[sKey]){
                    let aValues = aBindingProps[sKey];
                   for (let i = 0; i < aValues.length; i++) {
                       const binding = aValues[i];
                       if(binding && binding.model &&
                        binding.model.indexOf("i18") !== -1){
                            aBindFilteredProp1[sKey] = aValues;
                            return aBindFilteredProp1;
                        }
                   }
                }
            }

            //Fallback
            let aBindFilteredProp2 = {};
            if(aKeys && aKeys.length > 0) {
                aBindFilteredProp2[aKeys[0]] = aBindingProps[aKeys[0]];
                return aBindFilteredProp2;
            }
        }
        return aBindingProps;
    }

    this.wildCardIdsViewName = function(id, viewId, compId) {
        let elmId = id;
        if(elmId && (viewId || compId)) {
            if(viewId && elmId.indexOf(viewId) !== -1){
                elmId = id.replace(viewId, "");
            }
            if(compId && elmId.indexOf(compId) !== -1){
                elmId = id.replace(compId, "");
            }
            if(elmId) {
                // Remove ---
                if(elmId.indexOf("-") === 0) {
                    elmId = elmId.replace("-", "");
                }
                if(elmId.indexOf("-") === 0) {
                    elmId = elmId.replace("-", "");
                }
                if(elmId.indexOf("-") === 0) {
                    elmId = elmId.replace("-", "");
                }
                // Remove ::
                if(elmId.indexOf(":") === 0) {
                    elmId = elmId.replace(":", "");
                }
                if(elmId.indexOf(":") === 0) {
                    elmId = elmId.replace(":", "");
                }
                // Remove .
                if(elmId.indexOf(".") === 0) {
                    elmId = elmId.replace(".", "");
                }
                // Remove ,
                if(elmId.indexOf(",") === 0) {
                    elmId = elmId.replace(",", "");
                }
                if(id !== elmId) {
                    elmId = "*" + elmId
                }

            }
        }
        return elmId;
    }

    this.evalElementProperties = function(oElemProperties) {
        var includedFields = {};
        var finalFields = {};
        var aFoundNodes = [];
        var selector = null;
        var finalSelector= null;
        var dist = 99;
        var finalDist = 999;
        if(!oElemProperties) return {};
        // Add view Name if exists
        const viewName = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewName");
        if(viewName) {
            includedFields["viewName"] = viewName;
        }
        includedFields["metadata"] = oElemProperties.metadata[0].metadata;

        // Add id
        const id = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "id");
        if(id) {
            if(!vyperUtil.isIdGeneric(id)) {
                const viewId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewId");
                const compId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "componentId");
                includedFields["id"] = this.wildCardIdsViewName(id, viewId, compId);
            }
        }

        if(Object.keys(includedFields).length > 0) {
            // If bindingContextPath & at least one bindingProperty (test ui5All)
            selector = queryBuilder.buildSelector(includedFields, "elementProperties");
            aFoundNodes = ui5All(selector);
        }

        dist = vyperUtil.distanceNode(aFoundNodes, id);
        if(aFoundNodes &&  dist === 0) {
                // Success
                return {
                "success": true,
                "selector": selector,
                "aNodes": aFoundNodes,
                "fieldsMap": includedFields,
                "distance": dist
            };
        }

        if(dist < finalDist){
            finalSelector={};
            Object.assign(finalSelector, selector);
            finalDist = dist;
            finalFields = {};
            Object.assign(finalFields, includedFields);
        } else {
            includedFields = {};
            Object.assign(includedFields, finalFields);
        }

        // Evaluate bindingContextPath
        let bindingContextPath = null;
        if(oElemProperties.bindingContextPath && oElemProperties.bindingContextPath.length > 0) {
            // Remove empty, guid, and booleans
            bindingContextPath = this.evaluateBindingContextPath(oElemProperties.bindingContextPath[0].bindingContextPath);
            if(bindingContextPath) {
                includedFields["bindingContextPath"] = bindingContextPath;
            }
        }

        if(Object.keys(includedFields).length > 0) {
            // If bindingContextPath & at least one bindingProperty (test ui5All)
            selector = queryBuilder.buildSelector(includedFields, "elementProperties");
            aFoundNodes = ui5All(selector);
        }

        dist = vyperUtil.distanceNode(aFoundNodes, id);
        if(aFoundNodes &&  dist === 0) {
                // Success
                return {
                "success": true,
                "selector": selector,
                "aNodes": aFoundNodes,
                "fieldsMap": includedFields,
                "distance": dist
            };
        }

        if(dist < finalDist){
            finalSelector={};
            Object.assign(finalSelector, selector);
            finalDist = dist;
            finalFields = {};
            Object.assign(finalFields, includedFields);
        } else {
            includedFields = {};
            Object.assign(includedFields, finalFields);
        }

        // Add bindingProperties [priority i18n!! and title, text, value, and low enabled, editable uxfc/ _fc or fc_ fields,]
        const exclProps = ["mandatory","editable", "visible", "enabled"];
        const aExclTypes = ["boolean", "sap.m.ListMode"];
        const exclPaterns = ["uxfc", "_fc", "fc_"];
        const prefProps = ["value", "text", "tooltip", "title","items"];
        includedFields["bindingPropertyPaths"] = this.filterBindingProperties(oElemProperties.bindingPropertyPaths, exclProps, exclPaterns, aExclTypes, prefProps);
        

        if(Object.keys(includedFields).length > 0) {
            // If bindingContextPath & at least one bindingProperty (test ui5All)
            selector = queryBuilder.buildSelector(includedFields, "elementProperties");
            aFoundNodes = ui5All(selector);
        }

        dist = vyperUtil.distanceNode(aFoundNodes, id);
        if(aFoundNodes && dist === 0) {
            // Success
            return {
                "success": true,
                "selector": selector,
                "aNodes": aFoundNodes,
                "fieldsMap": includedFields,
                "distance": dist
            };
        }

        if(dist < finalDist){
            finalSelector={};
            Object.assign(finalSelector, selector);
            finalDist = dist;
            finalFields = {};
            Object.assign(finalFields, includedFields);
        } else {
            includedFields = {};
            Object.assign(includedFields, finalFields);
        }

        const labelForId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "labelFor");
        if(labelForId){
            if(!vyperUtil.isIdGeneric(labelForId)) {
                const viewId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewId");
                const compId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "componentId");
                includedFields["labelFor"] = this.wildCardIdsViewName(labelForId, viewId, compId);
                }  
        }

        const ariaLabelledBy = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "ariaLabelledBy");
        if(ariaLabelledBy && ariaLabelledBy.length > 0){
            const viewId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewId");
            const compId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "componentId");
            for (let index = 0; index < ariaLabelledBy.length; index++) {
                const elemId = ariaLabelledBy[index];
                if(!vyperUtil.isIdGeneric(elemId)) {
                    if(!includedFields["ariaLabelledBy"]) includedFields["ariaLabelledBy"] = [];
                    includedFields["ariaLabelledBy"].push(this.wildCardIdsViewName(elemId, viewId, compId));
                    }   
            }
        }

        const ariaDescribedBy = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "ariaDescribedBy");
        if(ariaDescribedBy && ariaDescribedBy.length > 0){
            const viewId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewId");
            const compId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "componentId");
            for (let index = 0; index < ariaDescribedBy.length; index++) {
                const elemId = ariaDescribedBy[index];
                if(!vyperUtil.isIdGeneric(elemId)) {
                    if(!includedFields["ariaDescribedBy"]) includedFields["ariaDescribedBy"] = [];
                    includedFields["ariaDescribedBy"].push(this.wildCardIdsViewName(elemId, viewId, compId));
                    }   
            }
        }

        if(Object.keys(includedFields).length > 1) {
            selector = queryBuilder.buildSelector(includedFields, "elementProperties");
            aFoundNodes = ui5All(selector);
        }

        let dist2 = vyperUtil.distanceNode(aFoundNodes, id);
        if(aFoundNodes && dist2 === 0) {
            // Success
            return {
                "success": true,
                "selector": selector,
                "aNodes": aFoundNodes,
                "fieldsMap": includedFields,
                "distance": dist2
            };
        }

        if(dist2 < finalDist){
            finalSelector={};
            Object.assign(finalSelector, selector);
            finalDist = dist2;
            finalFields = {};
            Object.assign(finalFields, includedFields);
        } else {
            includedFields = {};
            Object.assign(includedFields, finalFields);
        }

        //Check UI5 properties [no boolean, null, undefined], preferable list [icon, tooltip, text, value, title], [string, number]
        // Check no UI5 property and binding property
        const prefUIProps = ["src", "icon", "value", "text", "tooltip", "title"];
        retObject = this.filterUIProperties(oElemProperties.ui5Properties, includedFields, finalSelector, prefUIProps, "elementProperties", null, finalDist, id);
        
        dist = retObject.distance;
        if(retObject.aNodes && dist === 0) {
            // Success
            return retObject;
        } else {
            let fieldMp = includedFields;
            let aNods = aFoundNodes;
            if(dist < finalDist){
                finalSelector={};
                Object.assign(finalSelector, retObject.selector);
                finalDist = dist;
                fieldMp = retObject.fieldsMap;
                aNods = retObject.aNodes;
            }

            // Didnt succeed
            return {
                "success": false,
                "fieldsMap": fieldMp,
                "selector": finalSelector,
                "aNodes": aNods,
                "distance": finalDist
            };
        }
    }

    this.filterUIProperties = function(ui5Properties, includedFields, oSelector, prefProps, propLevel, parentPropType, distance, id, parentLevel) {
        let addFields = {};
        if(!distance)  distance = 99;
        if(ui5Properties) {
            const viewId = vyperUtil.getKeyValue(ui5Properties, "viewId");
            const compId = vyperUtil.getKeyValue(ui5Properties, "componentId");
            Object.assign(addFields, includedFields);
            let uiSanProps = [];
            for (let index = 0; index < ui5Properties.length; index++) {
                let uiProp = ui5Properties[index];
                let uiPropKey = Object.keys(uiProp)[0];
                let valUIProp = uiProp[uiPropKey];
                let bSameAsPropBind = false;
                // Filter out props used as bindingProperties
                if(addFields["bindingPropertyPaths"]){
                    let mBindingPaths = addFields["bindingPropertyPaths"];
                    let aBindPropKeys = Object.keys(mBindingPaths);
                    for (let i = 0; i < aBindPropKeys.length; i++) {
                        let bindKey = aBindPropKeys[i];
                        if(bindKey === uiPropKey) {
                            bSameAsPropBind = true;
                            break;
                        }
                    }
                }
                //if(!bSameAsPropBind) {
                    //Check for boolean null undefined
                    if(valUIProp !== null && 
                        valUIProp !== undefined && 
                        //!vyperUtil.isBoolean(valUIProp) &&
                        //valUIProp !== "false" && valUIProp !== "true" && 
                        uiPropKey !== "id" &&
                        uiPropKey !== "ariaDescribedBy" &&
                        uiPropKey !== "labelFor" &&
                        uiPropKey !== "icon" &&
                        uiPropKey !== "src" &&
                        uiPropKey !== "ariaLabelledBy" &&
                        uiPropKey !== "selectedItems" &&
                        uiPropKey !== "viewId" &&
                        uiPropKey !== "viewName" &&
                        uiPropKey !== "componentId") {
                        uiSanProps.push(uiProp);
                    }
                //}
                
            }
            // Test with prefProps
            if(uiSanProps && uiSanProps.length > 0) {
                let setFields = {};
                Object.assign(setFields, includedFields);
                for (let index = 0; index < uiSanProps.length; index++) {
                    let uiProp = uiSanProps[index];
                    if(prefProps) {
                        for (let i = 0; i < prefProps.length; i++) {
                            const key = prefProps[i];
                            if(uiProp[key] !== null && uiProp[key] !== undefined) {
                                let valUIProp = uiProp[key];
                                if(valUIProp !== null && valUIProp !== undefined) {
                                    if(!vyperUtil.isString(valUIProp)) {
                                        setFields[key] = valUIProp.toString();
                                    } else {
                                        setFields[key] = valUIProp;
                                    }
                                }
                                let selector = queryBuilder.buildSelector(setFields, propLevel, oSelector, parentPropType, parentLevel);
                                let aFoundNodes = ui5All(selector);
                                let distance1 = vyperUtil.distanceNode(aFoundNodes, id);
                                if(aFoundNodes && distance1 === 0) {
                                    // Success
                                    return {
                                        "success": true,
                                        "selector": selector,
                                        "aNodes": aFoundNodes,
                                        "distance": distance1
                                    };
                                } else {
                                    if(distance1 < distance) {
                                        distance = distance1;
                                        includedFields = {};
                                        Object.assign(includedFields, setFields);
                                    } else {
                                        setFields = {};
                                        //If not improving reset
                                        Object.assign(setFields, includedFields);
                                    }
                                }
                            }   
                        }
                    } 
                }
                // Check again with rest strings
                let setFields2 = {};
                // Test with only string
                Object.assign(setFields2, includedFields);
                for (let index = 0; index < uiSanProps.length; index++) {
                    let uiProp = uiSanProps[index];
                    const key = Object.keys(uiProp)[0];
                    if(uiProp[key] !== null && uiProp[key] !== undefined) {
                        let valUIProp = uiProp[key];
                        //Check for generic ids
                        if(Array.isArray(valUIProp)){
                            let aNewValProp = [];
                            for (let i = 0; i < valUIProp.length; i++) {
                                const elemId = valUIProp[i];
                                if(valUIProp[i] !== null && valUIProp[i] !== undefined) {
                                    if(!vyperUtil.isString(valUIProp[i])) {
                                        elemId = valUIProp[i].toString();
                                    }
                                }
                                if(!vyperUtil.isIdGeneric(elemId)) {             
                                    aNewValProp.push(this.wildCardIdsViewName(elemId, viewId, compId));
                                }
                            }
                            setFields2[key] = aNewValProp;
                        } else {
                            let elm = valUIProp;
                            if(valUIProp !== null && valUIProp !== undefined) {
                                if(!vyperUtil.isString(valUIProp)) {
                                    elm = valUIProp.toString();
                                }
                            }
                            setFields2[key] = elm;
                        }
                        let selector = queryBuilder.buildSelector(setFields2, propLevel, oSelector, parentPropType, parentLevel);
                        let aFoundNodes = ui5All(selector);
                        let distance1 = vyperUtil.distanceNode(aFoundNodes, id);
                        if(aFoundNodes && distance1 === 0) {
                            // Success
                            return {
                                "success": true,
                                "selector": selector,
                                "aNodes": aFoundNodes,
                                "distance": distance1
                            };
                        } else {
                            if(distance1 < distance) {
                                distance = distance1;
                                includedFields = {};
                                Object.assign(includedFields, setFields2);
                            } else {
                                setFields2 = {};
                                //If not improving reset
                                Object.assign(setFields2, includedFields);
                            }
                        }   
                    } 
                }
                // Didnt succeed
                return {
                    "success": false,
                    "fieldsMap": includedFields,
                    "selector": oSelector,
                    "aNodes": [],
                    "distance": distance
                }
            }
        }
         // Didnt succeed
         return {
            "success": false,
            "fieldsMap": includedFields,
            "selector": oSelector,
            "aNodes": [],
            "distance": distance
        }
    }

    this.getElementImportantProps = function(oElemProperties, existingFields, propType, elemId, dist) {
        if(!oElemProperties) return null;
        var includedFields = {};
        var selector = {};
        var finalSelector= null;
        var finalDist = dist || 99;
        var elemDist = 999;
        // Add view Name if exists
        const viewName = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewName");
        if(viewName) {
            includedFields["viewName"] = viewName;
        }

        includedFields["metadata"] = oElemProperties.metadata[0].metadata;
         // Add id
         const id = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "id");
         const viewId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewId");
         const compId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "componentId");
         if(id) {
             if(!vyperUtil.isIdGeneric(id)) {
                 includedFields["id"] = this.wildCardIdsViewName(id, viewId, compId);
             }
         }

         if(Object.keys(includedFields).length > 1) {
            // If bindingContextPath & at least one bindingProperty (test ui5All)
            selector = queryBuilder.buildSelector(existingFields, "elementProperties");
            if(selector.elementProperties){
                selector = queryBuilder.buildSelector(includedFields, propType, selector);
            }
            aFoundNodes = ui5All(selector);
        }
        elemDist = vyperUtil.distanceNode(aFoundNodes, elemId);
        if(aFoundNodes &&  elemDist === 0) {
            // Success
            return {
                "success": true,
                "selector": selector,
                "aNodes": aFoundNodes,
                "fieldsMap": includedFields,
                "distance": elemDist
            };
        }

        if(elemDist < finalDist){
            finalSelector={};
            Object.assign(finalSelector, selector);
            finalDist = elemDist;
            finalFields = {};
            Object.assign(finalFields, includedFields);
        } else {
            includedFields = {};
            Object.assign(includedFields, finalFields);
        }

        // Evaluate bindingContextPath
        let bindingContextPath = null;
        if(oElemProperties.bindingContextPath && oElemProperties.bindingContextPath.length > 0) {
            // Remove empty, guid, and booleans
            bindingContextPath = this.evaluateBindingContextPath(oElemProperties.bindingContextPath[0].bindingContextPath);
            if(bindingContextPath) {
                includedFields["bindingContextPath"] = bindingContextPath;
            }
            if(Object.keys(includedFields).length > 1) {
                // If bindingContextPath & at least one bindingProperty (test ui5All)
                selector = queryBuilder.buildSelector(existingFields, "elementProperties");
                if(selector.elementProperties){
                    selector = queryBuilder.buildSelector(includedFields, propType, selector);
                }
                aFoundNodes = ui5All(selector);
            }
            
            elemDist = vyperUtil.distanceNode(aFoundNodes, elemId);
            if(aFoundNodes &&  elemDist === 0) {
                // Success
                return {
                    "success": true,
                    "selector": selector,
                    "aNodes": aFoundNodes,
                    "fieldsMap": includedFields,
                    "distance": elemDist
                };
            }
    
            if(elemDist < finalDist){
                finalSelector={};
                Object.assign(finalSelector, selector);
                finalDist = elemDist;
                finalFields = {};
                Object.assign(finalFields, includedFields);
            } else {
                includedFields = {};
                Object.assign(includedFields, finalFields);
            }
        }

        // Add bindingProperties [priority i18n!! and title, text, value, and low enabled, editable uxfc/ _fc or fc_ fields,]
        const exclProps = ["mandatory","editable", "visible", "enabled"];
        const aExclTypes = ["boolean", "sap.m.ListMode"];
        const exclPaterns = ["uxfc", "_fc", "fc_"];
        const prefProps = ["value", "text", "tooltip", "title","items"];
        includedFields["bindingPropertyPaths"] = this.filterBindingProperties(oElemProperties.bindingPropertyPaths, exclProps, exclPaterns, aExclTypes, prefProps);
        

        if(Object.keys(includedFields).length > 1) {
            // If bindingContextPath & at least one bindingProperty (test ui5All)
            selector = queryBuilder.buildSelector(existingFields, "elementProperties");
            if(selector.elementProperties){
                selector = queryBuilder.buildSelector(includedFields, propType, selector);
            }
            aFoundNodes = ui5All(selector);
        }
        
        elemDist = vyperUtil.distanceNode(aFoundNodes, elemId);
        if(aFoundNodes &&  elemDist === 0) {
            // Success
            return {
                "success": true,
                "selector": selector,
                "aNodes": aFoundNodes,
                "fieldsMap": includedFields,
                "distance": elemDist
            };
        }

        if(elemDist < finalDist){
            finalSelector={};
            Object.assign(finalSelector, selector);
            finalDist = elemDist;
            finalFields = {};
            Object.assign(finalFields, includedFields);
        } else {
            includedFields = {};
            Object.assign(includedFields, finalFields);
        }

        const labelForId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "labelFor");
        if(labelForId){
            if(!vyperUtil.isIdGeneric(labelForId)) {
                const viewId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewId");
                const compId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "componentId");
                includedFields["labelFor"] = this.wildCardIdsViewName(labelForId, viewId, compId);
             }  
        }

        const ariaLabelledBy = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "ariaLabelledBy");
        if(ariaLabelledBy && ariaLabelledBy.length > 0){
            const viewId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewId");
            const compId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "componentId");
            for (let index = 0; index < ariaLabelledBy.length; index++) {
                const elemId2 = ariaLabelledBy[index];
                if(!vyperUtil.isIdGeneric(elemId2)) {
                    if(!includedFields["ariaLabelledBy"]) includedFields["ariaLabelledBy"] = [];
                    includedFields["ariaLabelledBy"].push(this.wildCardIdsViewName(elemId2, viewId, compId));
                 }   
            }
        }

        const ariaDescribedBy = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "ariaDescribedBy");
        if(ariaDescribedBy && ariaDescribedBy.length > 0){
            const viewId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewId");
            const compId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "componentId");
            for (let index = 0; index < ariaDescribedBy.length; index++) {
                const elemId2 = ariaDescribedBy[index];
                if(!vyperUtil.isIdGeneric(elemId2)) {
                    if(!includedFields["ariaDescribedBy"]) includedFields["ariaDescribedBy"] = [];
                    includedFields["ariaDescribedBy"].push(this.wildCardIdsViewName(elemId2, viewId, compId));
                 }   
            }
        }

        const icon = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "icon");
        if(icon){
            includedFields["icon"] = icon;
        }

        const src = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "src");
        if(src){
            includedFields["src"] = src;
        }

        if(Object.keys(includedFields).length > 1) {
            // If bindingContextPath & at least one bindingProperty (test ui5All)
            selector = queryBuilder.buildSelector(existingFields, "elementProperties");
            if(selector.elementProperties){
                selector = queryBuilder.buildSelector(includedFields, propType, selector);
            }
            aFoundNodes = ui5All(selector);
        }
        
        elemDist = vyperUtil.distanceNode(aFoundNodes, elemId);
        if(aFoundNodes &&  elemDist === 0) {
            // Success
            return {
                "success": true,
                "selector": selector,
                "aNodes": aFoundNodes,
                "fieldsMap": includedFields,
                "distance": elemDist
            };
        }

        if(elemDist < finalDist){
            finalSelector={};
            Object.assign(finalSelector, selector);
            finalDist = elemDist;
            finalFields = {};
            Object.assign(finalFields, includedFields);
        } else {
            includedFields = {};
            Object.assign(includedFields, finalFields);
        }

        //Check UI5 properties [no boolean, null, undefined], preferable list [icon, tooltip, text, value, title], [string, number]
        // Check no UI5 property and binding property
        const prefUIProps = ["src", "icon", "value", "text", "tooltip", "title"];
        retObject = this.filterUIProperties(oElemProperties.ui5Properties, includedFields, finalSelector, prefUIProps, propType, null, finalDist, elemId);
        
        elemDist = retObject.distance;
        if(retObject.aNodes && elemDist === 0) {
            // Success
            return retObject;
        } else {
            let fieldMp = includedFields;
            let aNods = aFoundNodes;
            if(elemDist < finalDist){
                finalSelector={};
                Object.assign(finalSelector, retObject.selector);
                finalDist = elemDist;
                fieldMp = retObject.fieldsMap;
                aNods = retObject.aNodes;
            }

            // Didnt succeed
            return {
                "success": false,
                "fieldsMap": fieldMp,
                "selector": finalSelector,
                "aNodes": aNods,
                "distance": finalDist
            };
        }
    }

    this.getElementNestedImportantProps = function(oElemProperties, oSelector, propType, parentPropType, elemId, parentLevel, dist) {
        if(!oElemProperties) return null;
        var includedFields = {};
        var selector = {};
        var finalSelector= null;
        var finalDist = dist || 99;
        var elemDist = 999;
        // Add view Name if exists
        const viewName = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewName");
        if(viewName) {
            includedFields["viewName"] = viewName;
        }

        includedFields["metadata"] = oElemProperties.metadata[0].metadata;
        // Add id
        const id = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "id");
        const viewId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewId");
        const compId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "componentId");
        if(id) {
            if(!vyperUtil.isIdGeneric(id)) {
                includedFields["id"] = this.wildCardIdsViewName(id, viewId, compId);
            }
        }

        if(Object.keys(includedFields).length > 1) {
            // If bindingContextPath & at least one bindingProperty (test ui5All)
            selector = queryBuilder.buildSelector(includedFields, propType, oSelector, parentPropType, parentLevel);
            aFoundNodes = ui5All(selector);
        }
        elemDist = vyperUtil.distanceNode(aFoundNodes, elemId);
        if(aFoundNodes &&  elemDist === 0) {
            // Success
            return {
                "success": true,
                "selector": selector,
                "aNodes": aFoundNodes,
                "fieldsMap": includedFields,
                "distance": elemDist
            };
        }

        if(elemDist < finalDist){
            finalSelector={};
            Object.assign(finalSelector, selector);
            finalDist = elemDist;
            finalFields = {};
            Object.assign(finalFields, includedFields);
        } else {
            includedFields = {};
            Object.assign(includedFields, finalFields);
        }

        // Evaluate bindingContextPath
        let bindingContextPath = null;
        if(oElemProperties.bindingContextPath && oElemProperties.bindingContextPath.length > 0) {
            // Remove empty, guid, and booleans
            bindingContextPath = this.evaluateBindingContextPath(oElemProperties.bindingContextPath[0].bindingContextPath);
            if(bindingContextPath) {
                includedFields["bindingContextPath"] = bindingContextPath;
            }

            if(Object.keys(includedFields).length > 1) {
                // If bindingContextPath & at least one bindingProperty (test ui5All)
                selector = queryBuilder.buildSelector(includedFields, propType, oSelector, parentPropType, parentLevel);
                aFoundNodes = ui5All(selector);
            }
            elemDist = vyperUtil.distanceNode(aFoundNodes, elemId);
            if(aFoundNodes &&  elemDist === 0) {
                // Success
                return {
                    "success": true,
                    "selector": selector,
                    "aNodes": aFoundNodes,
                    "fieldsMap": includedFields,
                    "distance": elemDist
                };
            }
    
            if(elemDist < finalDist){
                finalSelector={};
                Object.assign(finalSelector, selector);
                finalDist = elemDist;
                finalFields = {};
                Object.assign(finalFields, includedFields);
            } else {
                includedFields = {};
                Object.assign(includedFields, finalFields);
            }
        }

        // Add bindingProperties [priority i18n!! and title, text, value, and low enabled, editable uxfc/ _fc or fc_ fields,]
        const exclProps = ["mandatory","editable", "visible", "enabled"];
        const aExclTypes = ["boolean", "sap.m.ListMode"];
        const exclPaterns = ["uxfc", "_fc", "fc_"];
        const prefProps = ["value", "text", "tooltip", "title","items"];
        includedFields["bindingPropertyPaths"] = this.filterBindingProperties(oElemProperties.bindingPropertyPaths, exclProps, exclPaterns, aExclTypes, prefProps);

        if(Object.keys(includedFields).length > 1) {
            // If bindingContextPath & at least one bindingProperty (test ui5All)
            selector = queryBuilder.buildSelector(includedFields, propType, oSelector, parentPropType, parentLevel);
            aFoundNodes = ui5All(selector);
        }
        elemDist = vyperUtil.distanceNode(aFoundNodes, elemId);
        if(aFoundNodes &&  elemDist === 0) {
            // Success
            return {
                "success": true,
                "selector": selector,
                "aNodes": aFoundNodes,
                "fieldsMap": includedFields,
                "distance": elemDist
            };
        }

        if(elemDist < finalDist){
            finalSelector={};
            Object.assign(finalSelector, selector);
            finalDist = elemDist;
            finalFields = {};
            Object.assign(finalFields, includedFields);
        } else {
            includedFields = {};
            Object.assign(includedFields, finalFields);
        }

        const labelForId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "labelFor");
        if(labelForId){
            if(!vyperUtil.isIdGeneric(labelForId)) {
                const viewId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewId");
                const compId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "componentId");
                includedFields["labelFor"] = this.wildCardIdsViewName(labelForId, viewId, compId);
             }  
        }

        const ariaLabelledBy = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "ariaLabelledBy");
        if(ariaLabelledBy && ariaLabelledBy.length > 0){
            const viewId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewId");
            const compId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "componentId");
            for (let index = 0; index < ariaLabelledBy.length; index++) {
                const elemId2 = ariaLabelledBy[index];
                if(!vyperUtil.isIdGeneric(elemId2)) {
                    if(!includedFields["ariaLabelledBy"]) includedFields["ariaLabelledBy"] = [];
                    includedFields["ariaLabelledBy"].push(this.wildCardIdsViewName(elemId2, viewId, compId));
                 }   
            }
        }

        const ariaDescribedBy = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "ariaDescribedBy");
        if(ariaDescribedBy && ariaDescribedBy.length > 0){
            const viewId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewId");
            const compId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "componentId");
            for (let index = 0; index < ariaDescribedBy.length; index++) {
                const elemId2 = ariaDescribedBy[index];
                if(!vyperUtil.isIdGeneric(elemId2)) {
                    if(!includedFields["ariaDescribedBy"]) includedFields["ariaDescribedBy"] = [];
                    includedFields["ariaDescribedBy"].push(this.wildCardIdsViewName(elemId2, viewId, compId));
                 }   
            }
        }

        const icon = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "icon");
        if(icon){
            includedFields["icon"] = icon;
        }

        const src = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "src");
        if(src){
            includedFields["src"] = src;
        }

        if(Object.keys(includedFields).length > 1) {
            // If bindingContextPath & at least one bindingProperty (test ui5All)
            selector = queryBuilder.buildSelector(includedFields, propType, oSelector, parentPropType, parentLevel);
            aFoundNodes = ui5All(selector);
        }
        elemDist = vyperUtil.distanceNode(aFoundNodes, elemId);
        if(aFoundNodes &&  elemDist === 0) {
            // Success
            return {
                "success": true,
                "selector": selector,
                "aNodes": aFoundNodes,
                "fieldsMap": includedFields,
                "distance": elemDist
            };
        }

        if(elemDist < finalDist){
            finalSelector={};
            Object.assign(finalSelector, selector);
            finalDist = elemDist;
            finalFields = {};
            Object.assign(finalFields, includedFields);
        } else {
            includedFields = {};
            Object.assign(includedFields, finalFields);
        }

        //Check UI5 properties [no boolean, null, undefined], preferable list [icon, tooltip, text, value, title], [string, number]
        // Check no UI5 property and binding property
        const prefUIProps = ["src", "icon", "value", "text", "tooltip", "title"];
        retObject = this.filterUIProperties(oElemProperties.ui5Properties, includedFields, finalSelector, prefUIProps, propType, parentPropType, finalDist, elemId, parentLevel);

        elemDist = retObject.distance;
        if(retObject.aNodes && elemDist === 0) {
            // Success
            return retObject;
        } else {
            let fieldMp = includedFields;
            let aNods = aFoundNodes;
            if(elemDist < finalDist){
                finalSelector={};
                Object.assign(finalSelector, retObject.selector);
                finalDist = elemDist;
                fieldMp = retObject.fieldsMap;
                aNods = retObject.aNodes;
            }

            // Didnt succeed
            return {
                "success": false,
                "fieldsMap": fieldMp,
                "selector": finalSelector,
                "aNodes": aNods,
                "distance": finalDist
            };
        }
    }

    this.selectorDist = {
        "success": false,
        "distance": 999,
        "fieldsMap": {},
        "selector": {},
        "aNodes": []
    };

    this.exploreDescendantsRecurs = function(sControlId, aDescendentProps, enhancedFields, selector, parentType, parentLevel) {
        let oRes = {};
        let aIds = [];
        if(!aDescendentProps || aDescendentProps.length === 0) return this.selectorDist;
        for (let index = 0;  index < aDescendentProps.length; index++) {
            const descendantProps = aDescendentProps[index];
            // Element is under a aggregation element - try
            if(sControlId !== descendantProps["id"]){
                aIds.push(descendantProps["id"]);
                if(parentType) {
                    oRes = this.getElementNestedImportantProps(descendantProps["properties"], selector, "descendantProperties", parentType, sControlId, parentLevel);
                } else {
                    oRes = this.getElementImportantProps(descendantProps["properties"], enhancedFields, "descendantProperties", sControlId);
                }
                if(oRes.success) {
                    return oRes;
                }
                if(oRes.distance < this.selectorDist.distance) {
                    this.selectorDist.distance = oRes.distance;
                    this.selectorDist.selector = oRes.selector;
                    this.selectorDist.fieldsMap = oRes.fieldsMap;
                    this.selectorDist.aNodes = oRes.aNodes;
                }
            }  
        }
        if(aIds.length === 0) return this.selectorDist;
        //Nothing found
        for (let index = 0; index < aIds.length; index++) {
            const id = aIds[index];
            let aNewDescendentProps = vyperUtil.getAllDescendantElementsProps(id);
            if(parentType) {
               oRes = this.exploreDescendantsRecurs(sControlId, aNewDescendentProps, enhancedFields, selector, parentType, parentLevel);
            } else {
                oRes = this.exploreDescendantsRecurs(sControlId, aNewDescendentProps, enhancedFields);
            }
            if(oRes.success) {
                return oRes;
            }

            if(oRes.distance < this.selectorDist.distance) {
                this.selectorDist.distance = oRes.distance;
                this.selectorDist.selector = oRes.selector;
                this.selectorDist.fieldsMap = oRes.fieldsMap;
                this.selectorDist.aNodes = oRes.aNodes;
            }
        }
        return this.selectorDist;
    }

    this.evalDescendantProperties = function(sControlId, existingFields, aDescendentProps, selector, parentPropType){
        var enhancedFields = {};
        let oRes = {};
        if(existingFields) {
            Object.assign(enhancedFields, existingFields);
        } else {
            enhancedFields = {};
        }
    
        oRes = this.exploreDescendantsRecurs(sControlId, aDescendentProps, enhancedFields, selector, parentPropType);
        return oRes;
    }

    this.evalSiblingsProperties = function(sControlId, existingFields, aSiblingsProps){
        var enhancedFields = {};
        let oRes = {};
        let finalRes = {};
        finalRes.success = false;
        finalRes.distance = 999;
        finalRes.fieldsMap = existingFields;
        if(existingFields) {
            Object.assign(enhancedFields, existingFields);
        } else {
            existingFields = {};
        }
        if(!aSiblingsProps || aSiblingsProps.length === 0) return finalRes;
        for (let index = 0;  index < aSiblingsProps.length; index++) {
            const siblingProps = aSiblingsProps[index];
            oRes = this.getElementImportantProps(siblingProps["properties"], enhancedFields, "siblingProperties", sControlId);
            if(oRes.success) {
                return oRes;
            }  
            if(oRes.distance < finalRes.distance){
                finalRes = oRes;
            }
        }

        // Didnt succeed
        return finalRes;
    }

    this.evalAncestorWithDescProperties = function(existingFields, oElemProperties, oAncestorElemProperties, oAncestorProperties, aDescendentProps, oSelector, parentLevel) {
        var enhancedFields = {};
        let oRes1 = {};
        let oRes2 = {};
        if(existingFields) {
            Object.assign(enhancedFields, existingFields);
        } else {
            enhancedFields = {};
        }
        oRes1.selector = oSelector;

        if(oElemProperties && oAncestorElemProperties && oAncestorProperties && 
            aDescendentProps && oElemProperties.ui5Properties && oAncestorElemProperties.ui5Properties) {
            const elemId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "id");
            const ancElemId = vyperUtil.getKeyValue(oAncestorElemProperties.ui5Properties, "id");
        // Case 1 Element is a desc of Ancestor element --> [Opt: Get Ancestor] Get ancestor element + get all descendants except element and control in depth
            if(elemId !== ancElemId) {
                if(!parentLevel || parentLevel <= 1) {
                    // Element is under a aggregation element - try
                    oRes1 = this.getElementImportantProps(oAncestorElemProperties, enhancedFields, "ancestorProperties", elemId);
                    if(oRes1.success) {
                        return oRes1;
                    } 
                } 
                /*
                //Already done once
                else {
                    oRes1 = this.getElementNestedImportantProps(oAncestorElemProperties, oSelector, "ancestorProperties", "ancestorProperties", elemId, parentLevel);
                    if(oRes1.success) {
                        return oRes1;
                    } 
                } */
                
            } else {
                if(!parentLevel || parentLevel <= 1) {
                    oRes1 = this.getElementImportantProps(oAncestorProperties, enhancedFields, "ancestorProperties", elemId);
                    if(oRes1.success) {
                        return oRes1;
                    }
                } /*else {
                     // Case 2 Element is the ancestor Element --> Check only descendants + ancestor
                    // Try ancestor of ancestor element
                    oRes1 = this.getElementNestedImportantProps(oAncestorElemProperties, oSelector, "ancestorProperties", "ancestorProperties", elemId, parentLevel);
                    if(oRes1.success) {
                        return oRes1;
                    } 
                }*/
            }
            filtDescentantProps = [];
            //Remove self descendants
            for (let index = 0; index < aDescendentProps.length; index++) {
                const descend = aDescendentProps[index];
                if(descend["id"] !== elemId) {
                    filtDescentantProps.push(descend);
                } 
            }
            if(!parentLevel || parentLevel <= 1) {
                // Check descendants
                oRes2 = this.exploreDescendantsRecurs(elemId, filtDescentantProps, oRes1.fieldsMap, oRes1.selector, "ancestorProperties");
                if(oRes2 && oRes2.success) {
                    return oRes2;
                } 
            } else {
                oRes2 = this.exploreDescendantsRecurs(elemId, filtDescentantProps, oRes1.fieldsMap, oRes1.selector, "ancestorProperties", parentLevel);
                if(oRes2 && oRes2.success) {
                    return oRes2;
                }
            }
            let selTor = oRes2.selector;
            let distFinal = oRes2.distance;
            let fldMaps = oRes2.fieldsMap;
            if(oRes2.distance >= oRes1.distance) {
                selTor = oRes1.selector;
                distFinal = oRes1.distance;
                fldMaps = oRes1.fieldsMap;
            }
            // Didnt succeed
            return {
                "success": false,
                "distance": distFinal,
                "fieldsMap": fldMaps,
                "selector": selTor,
                "aNodes": []
            }
        }
    }

    this.evalAncestorAggrElmProperties = function(oSelector, oElemProperties, oAncestorElemProperties, oAncestorProperties) {
        var enhancedFields = {};
        var oSel = {};
        if(oSelector) {
            Object.assign(oSel, oSelector);
        } else {
            oSel = {};
        }

        let oRes1 = {};
        let oRes2 = {};
        if(oElemProperties && oAncestorElemProperties && oAncestorProperties &&
            oElemProperties.ui5Properties && oAncestorElemProperties.ui5Properties) {
            const elemId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "id");
            const acPropElemId = vyperUtil.getKeyValue(oAncestorElemProperties.ui5Properties, "id");    
            if(elemId !== acPropElemId) {
                if(oSel["ancestorProperties"]) {
                    // Element is under a aggregation element - try
                    oRes1 = this.getElementNestedImportantProps(oAncestorElemProperties, oSel, "ancestorProperties", "ancestorProperties", elemId);
                    if(oRes1.success) {
                        return oRes1;
                    }
                } else {
                    // Element is under a aggregation element - try
                    oRes1 = this.getElementNestedImportantProps(oAncestorElemProperties, oSel, "ancestorProperties", null, elemId);
                    if(oRes1.success) {
                        return oRes1;
                    }
                }
            }

            if(oSel["ancestorProperties"]) {
                // Element is the aggregation element
                // Try ancestor of ancestor element
                oRes2 = this.getElementImportantProps(oAncestorProperties, oSel, "ancestorProperties", "ancestorProperties", elemId);
                if(oRes2.success) {
                    return oRes2;
                }
            } else {
                oRes2 = this.getElementImportantProps(oAncestorProperties, oSel, "ancestorProperties", null, elemId);
                if(oRes2.success) {
                    return oRes2;
                }       
            }

            if(oRes2.distance >= oRes1.distance) {
                // Didnt succeed
                return oRes1;
            } else {
               // Didnt succeed
               return oRes2;
            }
            
        }

        // Didnt succeed
        return {
            "success": false,
            "distance": 99,
            "fieldsMap": {},
            "selector": oSelector,
            "aNodes": []
        }
    }

    this.evalAncestorProperties = function(sControlId, existingFields, oAncestorProperties, level, stopId) {
        var enhancedFields = {};
        if(existingFields) {
            Object.assign(enhancedFields, existingFields);
        } else {
            existingFields = {};
        }
        let oRes2 = {};
        if(oAncestorProperties) {

            // Element is the aggregation element
            // Try ancestor of ancestor element
            oRes2 = this.getElementImportantProps(oAncestorProperties, enhancedFields, "ancestorProperties", sControlId);
            if(oRes2.success) {
                return oRes2;
            }
            if(oRes2.distance < this.selectorDist.distance) {
                this.selectorDist.distance = oRes2.distance;
                this.selectorDist.selector = oRes2.selector;
                this.selectorDist.fieldsMap = oRes2.fieldsMap;
                this.selectorDist.aNodes = oRes2.aNodes;
            }
            if(level && level > 0) {
                level--;
                const elemId = vyperUtil.getKeyValue(oAncestorProperties.ui5Properties, "id");
                let oNextAncestorProperties = vyperUtil.getNextAncestorProperties(elemId);
                if(oNextAncestorProperties && oNextAncestorProperties.ui5Properties) {
                    const ancElemId = vyperUtil.getKeyValue(oNextAncestorProperties.ui5Properties, "id");   
                    if(stopId && ancElemId !== stopId) {
                        let ret1 = this.evalAncestorProperties(sControlId, enhancedFields, oNextAncestorProperties, level, stopId);
                        if(ret1.success) {
                            return ret1;
                        }
                    } else if(!stopId) {
                        let ret1 = this.evalAncestorProperties(sControlId, enhancedFields, oNextAncestorProperties, level);
                        if(ret1.success) {
                            return ret1;
                        }
                    } else {
                        // Didnt succeed
                        return this.selectorDist;
                    }            
                }
            } else {
                 // Didnt succeed
                return this.selectorDist;
            }
        }
        // Didnt succeed
        return this.selectorDist;
    }

    this.getSelectorIndex = function(oSelector, id, idx, maxLength) {
        let aFoundNodes=[];
        if(oSelector) {
            if(idx !== undefined && idx !== null && maxLength) {
                // If bindingContextPath & at least one bindingProperty (test ui5All)
                aFoundNodes = ui5All(oSelector, idx);
                if(aFoundNodes.length === 1 && aFoundNodes[0].id === id) {
                    // Success
                    return {
                        "success": true,
                        "index": idx
                    };
                } else if(idx < maxLength) {
                    idx++;
                    return this.getSelectorIndex(oSelector, id, idx, maxLength);
                } else {
                    // Didnt succeed
                    return {
                        "success": false
                    }
                }
                
            } else {
                // If bindingContextPath & at least one bindingProperty (test ui5All)
                aFoundNodes = ui5All(oSelector);
            }
            
            if(aFoundNodes && aFoundNodes.length > 1){
                return this.getSelectorIndex(oSelector, id, idx, aFoundNodes.length);
            }
        }
    }
    
};
window.ui5All = ui5All;
window.Evaluator = new Evaluator();
module.exports = window.Evaluator;