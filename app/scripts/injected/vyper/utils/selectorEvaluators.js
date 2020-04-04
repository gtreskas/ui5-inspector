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

    this.wildCardIdsViewName = function(id, viewId) {
        let elmId = id;
        if(elmId && viewId) {
            if(elmId.indexOf(viewId) !== -1){
                elmId = id.replace(viewId, "");
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

    this.evalElementProperties = function(oElemProperties, isAggregationElement, isAgreggationElementBtw, isAggregationExactly) {
        var includedFields = {};
        var aFoundNodes = [];
        var selector = null;
        //CASE 1///////////////////////////////////////////////////////////////////////////
        if(isAggregationElement && !isAgreggationElementBtw && !isAggregationExactly) {

            // Add view Name if exists
            const viewName = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewName");
            if(viewName) {
                includedFields["viewName"] = viewName;
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

            // Add bindingProperties [priority i18n!! and title, text, value, and low enabled, editable uxfc/ _fc or fc_ fields,]
            const exclProps = ["mandatory","editable", "visible", "enabled"];
            const aExclTypes = ["boolean", "sap.m.ListMode"];
            const exclPaterns = ["uxfc", "_fc", "fc_"];
            const prefProps = ["value", "text", "tooltip", "title","items"];
            includedFields["bindingPropertyPaths"] = this.filterBindingProperties(oElemProperties.bindingPropertyPaths, exclProps, exclPaterns, aExclTypes, prefProps);
            
            
            if(includedFields["bindingContextPath"] && Object.keys(includedFields).length > 1) {
                // If bindingContextPath & at least one bindingProperty (test ui5All)
                includedFields["metadata"] = oElemProperties.metadata[0].metadata;
                selector = queryBuilder.buildSelector(includedFields, "elementProperties");
                aFoundNodes = ui5All(selector);
            }
            const id = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "id");
            if(aFoundNodes && vyperUtil.distanceNode(aFoundNodes, id) === 0) {
                // Success
                return {
                    "success": true,
                    "selector": selector,
                    "aNodes": aFoundNodes
                };
            }

            const labelForId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "labelFor");
            if(labelForId){
                if(!vyperUtil.isIdGeneric(labelForId)) {
                    const viewId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewId");
                    includedFields["labelFor"] = this.wildCardIdsViewName(labelForId, viewId);
                 }  
            }

            const ariaLabelledBy = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "ariaLabelledBy");
            if(ariaLabelledBy && ariaLabelledBy.length > 0){
                const viewId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewId");
                for (let index = 0; index < ariaLabelledBy.length; index++) {
                    const elemId = ariaLabelledBy[index];
                    if(!vyperUtil.isIdGeneric(elemId)) {
                        if(!includedFields["ariaLabelledBy"]) includedFields["ariaLabelledBy"] = [];
                        includedFields["ariaLabelledBy"].push(this.wildCardIdsViewName(elemId, viewId));
                     }   
                }
            }

            const ariaDescribedBy = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "ariaDescribedBy");
            if(ariaDescribedBy && ariaDescribedBy.length > 0){
                const viewId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewId");
                for (let index = 0; index < ariaDescribedBy.length; index++) {
                    const elemId = ariaDescribedBy[index];
                    if(!vyperUtil.isIdGeneric(elemId)) {
                        if(!includedFields["ariaDescribedBy"]) includedFields["ariaDescribedBy"] = [];
                        includedFields["ariaDescribedBy"].push(this.wildCardIdsViewName(elemId, viewId));
                     }   
                }
            }

            if(Object.keys(includedFields).length > 1) {
                selector = queryBuilder.buildSelector(includedFields, "elementProperties");
                aFoundNodes = ui5All(selector);
            }

            if(aFoundNodes && vyperUtil.distanceNode(aFoundNodes, id) === 0) {
                // Success
                return {
                    "success": true,
                    "selector": selector,
                    "aNodes": aFoundNodes
                };
            }

            // Didnt succeed
            return {
                "success": false,
                "fieldsMap": includedFields,
                "aNodes": aFoundNodes
            };
        } else if(isAggregationElement && isAgreggationElementBtw && !isAggregationExactly){
            // CASE 2 /////////////////////////////////////////////////////////////////////////

            // Add view Name if exists
            const viewName = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewName");
            if(viewName) {
                includedFields["viewName"] = viewName;
            }

             // Add id
             const id = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "id");
             if(id) {
                 if(!vyperUtil.isIdGeneric(id)) {
                    const viewId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewId");
                     includedFields["id"] = this.wildCardIdsViewName(id, viewId);
                 }
             }


             if(Object.keys(includedFields).length > 0) {
                // If bindingContextPath & at least one bindingProperty (test ui5All)
                includedFields["metadata"] = oElemProperties.metadata[0].metadata;
                selector = queryBuilder.buildSelector(includedFields, "elementProperties");
                aFoundNodes = ui5All(selector);
            }

             if(aFoundNodes && vyperUtil.distanceNode(aFoundNodes, id) === 0) {
                // Success
                return {
                    "success": true,
                    "selector": selector,
                    "aNodes": aFoundNodes
                };
            } 

            // Add bindingProperties [priority i18n!! and title, text, value, and low enabled, editable uxfc/ _fc or fc_ fields,]
            const exclProps = ["mandatory","editable", "visible", "enabled"];
            const exclPaterns = ["uxfc", "_fc", "fc_"];
            const aExclTypes = ["boolean", "sap.m.ListMode"];
            const prefProps = ["value", "text", "tooltip", "title","items"];
            includedFields["bindingPropertyPaths"] = this.filterBindingProperties(oElemProperties.bindingPropertyPaths, exclProps, exclPaterns, aExclTypes, prefProps);     
            
            if(Object.keys(includedFields).length > 1) {
                // If bindingContextPath & at least one bindingProperty (test ui5All)
                includedFields["metadata"] = oElemProperties.metadata[0].metadata;
                selector = queryBuilder.buildSelector(includedFields, "elementProperties");
                aFoundNodes = ui5All(selector);
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

            const labelForId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "labelFor");
            if(labelForId){
                if(!vyperUtil.isIdGeneric(labelForId)) {
                    const viewId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewId");
                    includedFields["labelFor"] = this.wildCardIdsViewName(labelForId, viewId);
                 }  
            }

            const ariaLabelledBy = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "ariaLabelledBy");
            if(ariaLabelledBy && ariaLabelledBy.length > 0){
                const viewId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewId");
                for (let index = 0; index < ariaLabelledBy.length; index++) {
                    const elemId = ariaLabelledBy[index];
                    if(!vyperUtil.isIdGeneric(elemId)) {
                        if(!includedFields["ariaLabelledBy"]) includedFields["ariaLabelledBy"] = [];
                        includedFields["ariaLabelledBy"].push(this.wildCardIdsViewName(elemId, viewId));
                     }   
                }
            }

            const ariaDescribedBy = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "ariaDescribedBy");
            if(ariaDescribedBy && ariaDescribedBy.length > 0){
                const viewId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewId");
                for (let index = 0; index < ariaDescribedBy.length; index++) {
                    const elemId = ariaDescribedBy[index];
                    if(!vyperUtil.isIdGeneric(elemId)) {
                        if(!includedFields["ariaDescribedBy"]) includedFields["ariaDescribedBy"] = [];
                        includedFields["ariaDescribedBy"].push(this.wildCardIdsViewName(elemId, viewId));
                     }   
                }
            }

            if(aFoundNodes && vyperUtil.distanceNode(aFoundNodes, id) === 0) {
                // Success
                return {
                    "success": true,
                    "selector": selector,
                    "aNodes": aFoundNodes
                };
            } 


            //Check UI5 properties [no boolean, null, undefined], preferable list [icon, tooltip, text, value, title], [string, number]
            // Check no UI5 property and binding property
            const prefUIProps = ["src", "icon", "value", "text", "tooltip", "title"];
            retObject = this.filterUIProperties(oElemProperties.ui5Properties, includedFields, prefUIProps, "elementProperties");

            if(retObject.aNodes && vyperUtil.distanceNode(retObject.aNodes, id) === 0) {
                // Success
                return retObject;
            } else {
                // Didnt succeed
                return {
                    "success": false,
                    "fieldsMap": retObject.fieldsMap,
                    "aNodes": retObject.aNodes
                };
            }

        } else if (isAggregationElement && !isAgreggationElementBtw && isAggregationExactly) {
            // CASE 3
            // Add view Name if exists
            const viewName = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewName");
            if(viewName) {
                includedFields["viewName"] = viewName;
            }

             // Add id
             const id = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "id");
             if(id) {
                 if(!vyperUtil.isIdGeneric(id)) {
                    const viewId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewId");
                     includedFields["id"] = this.wildCardIdsViewName(id, viewId);
                 }
             }

              // Add bindingProperties [priority i18n!! and title, text, value, and low enabled, editable uxfc/ _fc or fc_ fields,]
              const exclProps = ["mandatory","editable", "visible", "enabled"];
              const exclPaterns = ["uxfc", "_fc", "fc_"];
              const aExclTypes = ["boolean", "sap.m.ListMode"];
              const prefProps = ["value", "text", "tooltip", "title", "items"];
              includedFields["bindingPropertyPaths"] = this.filterBindingProperties(oElemProperties.bindingPropertyPaths, exclProps, exclPaterns, aExclTypes, prefProps);     
            
            if(includedFields["id"] && Object.keys(includedFields).length > 0) {
                // If bindingContextPath & at least one bindingProperty (test ui5All)
                includedFields["metadata"] = oElemProperties.metadata[0].metadata;
                selector = queryBuilder.buildSelector(includedFields, "elementProperties");
                aFoundNodes = ui5All(selector);
            }

            if(aFoundNodes && vyperUtil.distanceNode(aFoundNodes, id) === 0) {
                // Success
                return {
                    "success": true,
                    "selector": selector,
                    "aNodes": aFoundNodes
                };
            } else {
                // Didnt succeed
                return {
                    "success": false,
                    "fieldsMap": includedFields,
                    "aNodes": aFoundNodes
                };
            }

        } else {
            // No aggregation
            if(!oElemProperties) return {
                "success": false,
                "fieldsMap": includedFields,
                "aNodes": aFoundNodes
            };
            // Add view Name if exists
            const viewName = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewName");
            if(viewName) {
                includedFields["viewName"] = viewName;
            }

             // Add id
             const id = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "id");
             const viewId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewId");
             if(id) {
                 if(!vyperUtil.isIdGeneric(id)) {
                     includedFields["id"] = this.wildCardIdsViewName(id, viewId);
                 }
             }

             if(includedFields["id"]) {
                // If bindingContextPath & at least one bindingProperty (test ui5All)
                includedFields["metadata"] = oElemProperties.metadata[0].metadata;
                selector = queryBuilder.buildSelector(includedFields, "elementProperties");
                aFoundNodes = ui5All(selector);
            }

            if(aFoundNodes && vyperUtil.distanceNode(aFoundNodes, id) === 0) {
                // Success
                return {
                    "success": true,
                    "selector": selector,
                    "aNodes": aFoundNodes
                };
            } 
            // Add further identifiers
            const labelForId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "labelFor");
            if(labelForId){
                if(!vyperUtil.isIdGeneric(labelForId)) {
                    const viewId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewId");
                    includedFields["labelFor"] = this.wildCardIdsViewName(labelForId, viewId);
                 }  
            }

            const ariaLabelledBy = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "ariaLabelledBy");
            if(ariaLabelledBy && ariaLabelledBy.length > 0){
                const viewId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewId");
                for (let index = 0; index < ariaLabelledBy.length; index++) {
                    const elemId = ariaLabelledBy[index];
                    if(!vyperUtil.isIdGeneric(elemId)) {
                        if(!includedFields["ariaLabelledBy"]) includedFields["ariaLabelledBy"] = [];
                        includedFields["ariaLabelledBy"].push(this.wildCardIdsViewName(elemId, viewId));
                     }   
                }
            }

            const ariaDescribedBy = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "ariaDescribedBy");
            if(ariaDescribedBy && ariaDescribedBy.length > 0){
                const viewId = vyperUtil.getKeyValue(oElemProperties.ui5Properties, "viewId");
                for (let index = 0; index < ariaDescribedBy.length; index++) {
                    const elemId = ariaDescribedBy[index];
                    if(!vyperUtil.isIdGeneric(elemId)) {
                        if(!includedFields["ariaDescribedBy"]) includedFields["ariaDescribedBy"] = [];
                        includedFields["ariaDescribedBy"].push(this.wildCardIdsViewName(elemId, viewId));
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

            
            
            // Didnt succeed
            // Add bindingProperties [priority i18n!! and title, text, value, and low enabled, editable uxfc/ _fc or fc_ fields,]
              const exclProps = ["mandatory","editable", "visible", "enabled"];
              const exclPaterns = ["uxfc", "_fc", "fc_"];
              const aExclTypes = ["boolean", "sap.m.ListMode"];
              const prefProps = ["value", "text", "tooltip", "title","items"];
              includedFields["bindingPropertyPaths"] = this.filterBindingProperties(oElemProperties.bindingPropertyPaths, exclProps, exclPaterns, aExclTypes, prefProps);
            
            if(Object.keys(includedFields).length > 0) {
                // If bindingContextPath & at least one bindingProperty (test ui5All)
                includedFields["metadata"] = oElemProperties.metadata[0].metadata;
                selector = queryBuilder.buildSelector(includedFields, "elementProperties");
                aFoundNodes = ui5All(selector);
            }

            if(aFoundNodes && vyperUtil.distanceNode(aFoundNodes, id) === 0) {
                // Success
                return {
                    "success": true,
                    "selector": selector,
                    "aNodes": aFoundNodes
                };
            } else {
                // Didnt succeed
                return {
                    "success": false,
                    "fieldsMap": includedFields,
                    "aNodes": aFoundNodes
                };
            }
        }
    }

    this.filterUIProperties = function(ui5Properties, includedFields, prefProps, propLevel) {
        if(ui5Properties && includedFields) {
            let addFields = {};
            let distance = 99;
            let chosenFields = {};
            Object.assign(addFields, includedFields);
            Object.assign(chosenFields, includedFields);
            const id = vyperUtil.getKeyValue(ui5Properties, "id");
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
                if(!bSameAsPropBind) {
                    //Check for boolean null undefined
                    if(valUIProp !== null && valUIProp !== undefined && !vyperUtil.isBoolean(valUIProp) &&
                    valUIProp !== "false" && valUIProp !== "true" && 
                    uiPropKey !== "id" &&
                    uiPropKey !== "ariaDescribedBy" &&
                    uiPropKey !== "ariaLabelledBy" &&
                    uiPropKey !== "selectedItems" &&
                    uiPropKey !== "viewId" &&
                    uiPropKey !== "viewName" &&
                    uiPropKey !== "componentId") {
                        uiSanProps.push(uiProp);
                    }
                }
                
            }
            // Test with prefProps
            if(uiSanProps) {
                let setFields = {};
                Object.assign(setFields, includedFields);
                for (let index = 0; index < uiSanProps.length; index++) {
                    let uiProp = uiSanProps[index];
                    if(prefProps) {
                        for (let i = 0; i < prefProps.length; i++) {
                            const key = prefProps[i];
                            if(uiProp[key]) {
                                let valUIProp = uiProp[key];
                                setFields[key] = valUIProp;
                                let selector = queryBuilder.buildSelector(setFields, propLevel);
                                let aFoundNodes = ui5All(selector);
                                let distance1 = vyperUtil.distanceNode(aFoundNodes, id);
                                if(aFoundNodes && distance1 === 0) {
                                    // Success
                                    return {
                                        "success": true,
                                        "selector": selector,
                                        "aNodes": aFoundNodes
                                    };
                                } else {
                                    if(distance1 < distance) {
                                        chosenFields = setFields;
                                        distance = distance1;
                                    } else {
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
                    if(uiProp[key] && (vyperUtil.isString(uiProp[key]) || Array.isArray(uiProp[key]))) {
                        let valUIProp = uiProp[key];
                        //Check for generic ids
                        if(Array.isArray(valUIProp)){
                            let aNewValProp = [];
                            for (let i = 0; i < valUIProp.length; i++) {
                                const elemId = valUIProp[i];
                                if(!vyperUtil.isIdGeneric(elemId)) {
                                    aNewValProp.push(elemId);
                                }
                            }
                            setFields2[key] = aNewValProp;
                        } else {
                            setFields2[key] = valUIProp;
                        }
                        let selector = queryBuilder.buildSelector(setFields2, propLevel);
                        let aFoundNodes = ui5All(selector);
                        let distance1 = vyperUtil.distanceNode(aFoundNodes, id);
                        if(aFoundNodes && distance1 === 0) {
                            // Success
                            return {
                                "success": true,
                                "selector": selector,
                                "aNodes": aFoundNodes
                            };
                        } else {
                            if(distance1 < distance) {
                                chosenFields = setFields2;
                                distance = distance1;
                            } else {
                                //If not improving reset
                                Object.assign(setFields2, includedFields);
                            }
                        }   
                    } 
                }
                // Didnt succeed
                return {
                    "success": false,
                    "fieldsMap": chosenFields,
                    "aNodes": []
                }
            }
        }
    }
    
};
window.ui5All = ui5All;
window.Evaluator = new Evaluator();
module.exports = window.Evaluator;