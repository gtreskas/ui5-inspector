module.exports = function(ui5Selector, index, opt_parentElement) {
    var aCandidateControls = [];
    function isEmptyObject(obj) {
      return Object.entries(obj).length === 0 && obj.constructor === Object;
    }

    function getControlAllProperties(oControl) {
      if (!oControl ||
		!oControl.getMetadata ||
		!oControl.getMetadata() ||
		!oControl.getMetadata().getAllProperties
      ) { return null; }
      return oControl.getMetadata().getAllProperties();
    }

    function getControlAllAggregations(oControl) {
      if (!oControl ||
		!oControl.getMetadata ||
		!oControl.getMetadata() ||
		!oControl.getMetadata().getAllAggregations
      ) { return null; }
      return oControl.getMetadata().getAllAggregations();
    }

    function getControlAllAssociations(oControl) {
      if (!oControl ||
		!oControl.getMetadata ||
		!oControl.getMetadata() ||
		!oControl.getMetadata().getAllAssociations
      ) { return null; }
      return oControl.getMetadata().getAllAssociations();
    }

    function getControlProperty(oControl, sPropKey) {
      if (!oControl ||
		!oControl.getProperty
      ) { return null; }
      return oControl.getProperty(sPropKey);
    }

    function getAggregationProperty(oControl, sPropKey) {
      if (!oControl ||
			!oControl.getAggregation
      ) { return null; }
      return oControl.getAggregation(sPropKey);
    }

    function getAssociationProperty(oControl, sPropKey) {
      if (!oControl ||
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

    function isControlInViewName(oControl, sViewName) {
      try {
        // eslint-disable-next-line no-undef
        if (!oControl || !sap.ui.core.Element || !sap.ui.core.mvc.View) {
          return false;
        }
        if (oControl.getViewName &&
					// eslint-disable-next-line no-undef
					oControl instanceof sap.ui.core.mvc.View &&
					wildCardAndNormalCompare(sViewName, oControl.getViewName())) {
          return true;
        } else {
          return isControlInViewName(oControl.getParent(), sViewName);
        }
      } catch (error) {
        return false;
      }
    }

    function isControlInViewId(oControl, sViewId) {
      try {
        // eslint-disable-next-line no-undef
        if (!oControl || !sap.ui.core.Element || !sap.ui.core.mvc.View) {
          return false;
        }
        if (oControl.getId &&
					wildCardAndNormalCompare(sViewId, oControl.getId()) &&
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

    function convertToString(value) {
      if (value === undefined || value === null) { return null;}
      return value.toString();
    }

    function retrieveNodesFromBody(index, opt_parentElement) {
			// Logic to retrieve the element for chaining
      if (index){
        if (!Number.isInteger(index) && index.nodeType){
          return index.querySelectorAll("*");
        } else if (opt_parentElement && opt_parentElement.nodeType) {
          return opt_parentElement.querySelectorAll("*");
        }
      }

      var sapBody = document.getElementsByClassName("sapUiBody");
      if (!sapBody || !sapBody[0]) {
        throw new Error("No body found");
      }
      return sapBody[0].querySelectorAll("*");
    }

    function retrieveNodeName(oNode) {
      if (oNode) {
        return oNode.nodeName;
      }
      return null;
    }

    function retrieveNodeAttributes(oNode) {
      var domProperties = [];
      if (oNode.attributes && oNode.attributes.length > 0) {
        for (let index = 0; index < oNode.attributes.length; index++) {
          var oElm = oNode.attributes[index];
          if (oElm.nodeName && oElm.nodeValue) {
            var nodeNm = oElm.nodeName;
            var nodeValue = oElm.nodeValue;
            var nodeVN = {};
            nodeVN[nodeNm] = nodeValue;
            domProperties.push(nodeVN);
          }
        }
      }
      return domProperties;
    }

    function retrieverBindingPaths(oControl, sPropKey) {
      var aBindingInfos = [];
      var aBindingInfoParts = oControl.getBindingInfo(sPropKey).parts;
      if (aBindingInfoParts && aBindingInfoParts.length > 0) {
					//console.log("Binding length has property--------> "+ sPropKey+ ", " + aBindingInfoParts.length);
        for (var i = 0; i < aBindingInfoParts.length; i++) {
          var sModel = "";
						//console.log("Binding parts path--------> "+ aBindingInfoParts[i].path);
          if (!aBindingInfoParts[i].path) continue;
          if (aBindingInfoParts[i].model) sModel = aBindingInfoParts[i].model;
          aBindingInfos.push({
            model: sModel,
            path: aBindingInfoParts[i].path
          });
        }
      } else {
        var sBindingDataStr = oControl.getBindingInfo(sPropKey).path;
        if (sBindingDataStr) {
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
          if (!oControl || !sPropKey
							|| !aAggregation.hasOwnProperty(sPropKey)
							|| !oControl.getBindingInfo
							|| !oControl.getBindingInfo(sPropKey)) return aBindingInfos;
          aBindingInfos = retrieverBindingPaths(oControl, sPropKey);
        }
      } catch (e) {
          // Do nothing
      }
      return aBindingInfos;
    }

    function getBindDataForAssociation(oControl, sPropKey) {
      var aAssociation = getControlAllAssociations(oControl);
      var aBindingInfos = [];
      try {
        if (aAssociation.hasOwnProperty(sPropKey)) {
          if (!oControl || !sPropKey
							|| !aAssociation.hasOwnProperty(sPropKey)
							|| !oControl.getBindingInfo
							|| !oControl.getBindingInfo(sPropKey)) return aBindingInfos;
          aBindingInfos = retrieverBindingPaths(oControl, sPropKey);
        }
      } catch (e) {
          // Do nothing
      }
      return aBindingInfos;
    }

    function getBindDataForProperty(oControl, sPropKey) {
      var aProperties = getControlAllProperties(oControl);
      var aBindingInfos = [];
      try {
        if (aProperties.hasOwnProperty(sPropKey)) {
          if (!oControl || !sPropKey
							|| !aProperties.hasOwnProperty(sPropKey)
							|| !oControl.getBindingInfo
							|| !oControl.getBindingInfo(sPropKey)) return aBindingInfos;
          aBindingInfos = retrieverBindingPaths(oControl, sPropKey);
        }
      } catch (e) {
          // Do nothing
      }
      return aBindingInfos;
    }

    function retrieveValidUI5ControlsSubElements(nodes) {
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
                retrieveValidUI5ControlsSubElements(chNode.children);
                return false;
              }
            } else {
								//console.log("Im in else iterate 2");
              retrieveValidUI5ControlsSubElements(chNode.children);
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
            retrieveValidUI5ControlsSubElements(node.children);
            return false;
          }
        }
        return oControl;
      });
    }

    function findSiblingControls(oControl, oParentControl) {
      if (!oControl || !oControl.getId || !oControl.getId()) return null;
      if (!oParentControl.getId ||!oParentControl.getId()) return null;
      var sParentId = oParentControl.getId();
      var aAllSiblingNodes = document.getElementById(sParentId).children;
      aCandidateControls = [];
      retrieveValidUI5ControlsSubElements(aAllSiblingNodes);
      var aValidControls = aCandidateControls;
      if (!aValidControls || aValidControls.length === 0) return null;
      var oControlIndx = aValidControls.findIndex((element) => {
        return element.getId() === oControl.getId();
      });
      if (oControlIndx === -1) { throw new Error("Something is very wrong with prev/next control finder"); }
      else {
        aValidControls.splice(oControlIndx, 1);
        return aValidControls;
      }
    }

    function findPrevNextControl(oControl, oParentControl, bIsNext) {
      if (!oControl || !oControl.getId || !oControl.getId()) return null;
      if (!oParentControl.getId ||!oParentControl.getId()) return null;
      var sParentId = oParentControl.getId();
      var aAllSiblingNodes = document.getElementById(sParentId).children;
      aCandidateControls = [];
      retrieveValidUI5ControlsSubElements(aAllSiblingNodes);
      var aValidControls = aCandidateControls;
      if (!aValidControls || aValidControls.length === 0) return null;
      var oControlIndx = aValidControls.findIndex((element) => {
        return element.getId() === oControl.getId();
      });
      if (oControlIndx === -1) { throw new Error("Something is very wrong with prev/next control finder"); }
      if (bIsNext && ((aValidControls.length - 1) > oControlIndx)) {
        return aValidControls[oControlIndx + 1];
      } else if (!bIsNext && (oControlIndx > 0)) {
        return aValidControls[oControlIndx - 1];
      }
      return null;
    }

    function extractBindingPathAndModelProperty(pathObj) {
      var binding = {
        model: "",
        path: ""
      };
      if (!pathObj || !pathObj.path) return binding;
      if (pathObj.path.indexOf(">") !== -1) {
        binding.model = pathObj.path.substring(0, pathObj.path.indexOf(">"));
        binding.path = pathObj.path.substring(pathObj.path.indexOf(">") + 1, pathObj.path.length);
      } else {
        binding.path = pathObj.path;
      }
      return binding;
    }

    function compareBindingPathAndModelProperty(key, locatorProperty, oControl) {
      var extrPath = extractBindingPathAndModelProperty(locatorProperty);
      var aBindindInfo = getBindDataForProperty(oControl, key);
      if (aBindindInfo.length === 0) {
        aBindindInfo = getBindDataForAggregation(oControl, key);
      }
      if (aBindindInfo.length === 0) {
        aBindindInfo =  getBindDataForAssociation(oControl, key);
      }
      if (
        (!extrPath.path && aBindindInfo.length > 0) ||
					(!extrPath.path && aBindindInfo.length === 0)
      ) {
        return true;
      } else if (extrPath.path && aBindindInfo.length === 0) {
        return false;
      }
      var aCandidatePath = [];
      for (var bindindInfo of aBindindInfo) {
        if ((extrPath.model && bindindInfo.model)) {
          if ((extrPath.path && (bindindInfo.path !== null && bindindInfo.path !== undefined))
								&& wildCardAndNormalCompare(extrPath.model, bindindInfo.model)) {
									//if(convertToString(bindindInfo.path) === convertToString(extrPath.path))
            if (wildCardAndNormalCompare(extrPath.path,bindindInfo.path))
              aCandidatePath.push(bindindInfo.path);
          }
        } else {
          if (extrPath.path && (bindindInfo.path !== null && bindindInfo.path !== undefined)) {
							//if(convertToString(bindindInfo.path) === convertToString(extrPath.path))
            if (wildCardAndNormalCompare(extrPath.path,bindindInfo.path))
              aCandidatePath.push(bindindInfo.path);
          }
        }
      }
      return aCandidatePath.length > 0;
    }

    function wildCardAndNormalCompare(sWild, sValue) {
      if (!sWild.trim() || !sWild.includes("*")){
        return (convertToString(sWild) === convertToString(sValue));
      }
      var aWilds = convertToString(sWild).trim().split("*");
      sValue = convertToString(sValue);
      for (var i = 0; i < aWilds.length; i++) {
        if (!aWilds[i]) continue;
        if (!sValue.includes(aWilds[i])) return false;
      }
      return true;
    }

    function compareAttributeToElementAttributes(sKey, sValue, aNodeAttributes) {
      if (!sKey || !sValue || !aNodeAttributes) return false;
      for (let index = 0; index < aNodeAttributes.length; index++) {
        var oElm = aNodeAttributes[index];
        if (oElm) {
          const aAttrKey = Object.keys(oElm);
          const aAttrValue = Object.values(oElm);
          if (aAttrKey && aAttrValue &&
						aAttrKey.length > 0 && aAttrValue.length > 0 &&
						aAttrValue[0] !== undefined && aAttrValue[0] !== null) {
            if (aAttrKey[0] === sKey) {
              var val = aAttrValue[0].toString();
              if (wildCardAndNormalCompare(sValue, val)) {
                return true;
              }
            }

          }
        }
      }
      return false;
    }

    function compareToDomProperties(oNode, mProperties) {
      var bPass = true;
      if (!mProperties || !oNode) {
        console.log("No dom properties or no node to compare");
        return bPass;
      }
      var aNodeAttributes = retrieveNodeAttributes(oNode);
      for (var key in mProperties) {
        var value = mProperties[key];
        if (value) {
          if (key === "nodeName") {
            const nodeName = retrieveNodeName(oNode);
            bPass = bPass && (nodeName.toLowerCase() === value.toLowerCase());
          } else {
            if (Array.isArray(value)) {
              value.map(function (attrValue) {
                bPass = bPass && compareAttributeToElementAttributes(key, attrValue, aNodeAttributes);
              });
            } else {
              bPass = bPass && compareAttributeToElementAttributes(key, value, aNodeAttributes);
            }
          }
        } else {
          return false;
        }
      }
      return bPass;
    }

    function compareToProperties(mProperties, oControl) {
      var bPass = true;
      if (!mProperties) {
        console.log("No properties to compare");
        return bPass;
      }

				//debugger;
      for (var key in mProperties) {
        var value = mProperties[key];
        if (value && Array.isArray(value)) {
          value.map(function(locatorBindingData){
            bPass = bPass && compareBindingPathAndModelProperty(key, locatorBindingData, oControl);
          });
        } else if (value && typeof value === "object") {
          bPass = bPass && compareBindingPathAndModelProperty(key, value, oControl);
        } else if (key === "bindingContextPath") {
          var sPath = getControlBindingContextPath(oControl);
          if (sPath && value) {
            bPass = bPass && wildCardAndNormalCompare(value, sPath);
          } else if (!sPath && (value !== undefined && value !== null)) {
            bPass = false;
          }
        } else if (key === "viewName") {
          bPass = bPass && isControlInViewName(oControl, value);
        } else if (key === "viewId") {
          bPass = bPass && isControlInViewId(oControl, value);
        } else {
          if (key === "id") {
            var bIdProp = compareId(oControl, value);
            bPass = bPass && bIdProp;
          } else {
            var bPropVal = compareProperty(oControl, key, value);
            if (!bPropVal) bPropVal = compareAggregation(oControl, key, value);
            if (!bPropVal) bPropVal = compareAssociation(oControl, key, value);
            bPass = bPass && bPropVal;
          }
        }
      }
      return bPass;
    }

    function compareProperty(oControl, key, value) {
      var controlVal = null;
      try {
        controlVal = getControlProperty(oControl, key);
      } catch (e) {
					// Property doesnt exist
      }
      if (controlVal !== null && controlVal !== undefined && value) {
					//return convertToString(controlVal) === convertToString(value);
        return wildCardAndNormalCompare(value, controlVal);
      } else if ((controlVal === null || controlVal === undefined) && value) {
        return false;
      }
    }

    function getId(oControl) {
      if (!oControl ||
		!oControl.getId
      ) { return null; }
      return oControl.getId();
    }

    function compareId(oControl, value) {
      var controlVal = null;
      try {
        controlVal = getId(oControl);
      } catch (e) {
					// Property doesnt exist
      }
      if (controlVal !== null && controlVal !== undefined && value) {
					//return convertToString(controlVal) === convertToString(value);
        return wildCardAndNormalCompare(value, controlVal);
      } else if ((controlVal === null || controlVal === undefined) && value) {
        return false;
      }
    }

    function compareAggregation(oControl, key, value) {
      var controlVal = null;
      try {
        controlVal = getAggregationProperty(oControl, key);
      } catch (e) {
					// Aggregation doesnt exist
      }
      if (controlVal !== null && controlVal !== undefined && value) {
					//return convertToString(controlVal) === convertToString(value);
        return wildCardAndNormalCompare(value, controlVal);
      } else if ((controlVal === null || controlVal === undefined) && value) {
        return false;
      }
    }

    function compareAssociation(oControl, key, value) {
      var controlVal = null;
      try {
        controlVal = getAssociationProperty(oControl, key);
      } catch (e) {
					// Association doesnt exist
      }
      if (controlVal !== null && controlVal !== undefined && value) {
					//return convertToString(controlVal) === convertToString(value);
        return wildCardAndNormalCompare(value, controlVal);
      } else if ((controlVal === null || controlVal === undefined) && value) {
        return false;
      }
    }

    function filterMetadata(elementProperties, oControl) {
				//console.log("Beggining control---->" + controlVal);
      var bPass = true;
      var controlVal = oControl.getMetadata().getName();
      if (!elementProperties) return bPass;
      if (!elementProperties.metadata) return bPass;
      var metadata = elementProperties.metadata;
      if (!controlVal && metadata) {
        bPass = false;
        return bPass;
      } else if (controlVal && metadata){
					//console.log("Control val---->" + controlVal + " metadata--->"+ metadata);
        bPass = bPass && (controlVal === metadata);
      }
      return bPass;
    }

    function compareToElementProperties(elementProperties, oControl) {
      var bPass = true;
      if ((!elementProperties || isEmptyObject(elementProperties)) && oControl) {
        return bPass;
      } else if ((elementProperties && !isEmptyObject(elementProperties)) && !oControl) {
        return false;
      } else if ((!elementProperties || isEmptyObject(elementProperties)) && !oControl){
        return bPass;
      }
      bPass = bPass && filterMetadata(elementProperties, oControl);
      if (!bPass) return bPass;
      for (var key in elementProperties) {
        var value = elementProperties[key];
					//console.log("Key--->" + key + " Value--->" + value);
        if (typeof value === "object" &&
						elementProperties.mProperties &&
						key === "mProperties") {
							//if(oControl.getId() === "__box0")
							//debugger;
          bPass = bPass && compareToProperties(value, oControl);
        } else if (typeof value === "object" &&
        elementProperties.domProperties &&
        key === "domProperties") {
          var oNode = convertToDomElement(oControl);
          bPass = bPass && compareToDomProperties(oNode, value);
        }
      }
      if (bPass) {
					/*console.log("Element Property Control Type -->"
					+ oControl.getMetadata().getName()
					+ ", Id-->" + oControl.getId()
					+ ", bPass-->" + bPass);*/
      }
      return bPass;
    }

    function compareToPrevElementProperties(elementProperties, oControl, oParentControl) {
      var bPass = true;
      if ((!elementProperties || isEmptyObject(elementProperties)) && oParentControl) {
        return bPass;
      } else if ((elementProperties && !isEmptyObject(elementProperties)) && !oParentControl) {
        return false;
      } else if ((!elementProperties || isEmptyObject(elementProperties)) && !oParentControl){
        return bPass;
      }
      var oPrevControl = findPrevNextControl(oControl, oParentControl, false);
      if ((!elementProperties || isEmptyObject(elementProperties)) && oPrevControl) {
        return bPass;
      } else if ((elementProperties && !isEmptyObject(elementProperties)) && !oPrevControl) {
        return false;
      } else if ((!elementProperties || isEmptyObject(elementProperties)) && !oPrevControl){
        return bPass;
      }
				/*console.log("Previous Property Control Type -->"
				+ oPrevControl.getMetadata().getName()
				+ ", Id-->" + oPrevControl.getId());*/
      return compareToElementProperties(elementProperties, oPrevControl);
    }

    function retrieveValidUI5Controls(nodes) {
      var aCandidateValidControls = [];
      if (!nodes || nodes.length === 0) {
        throw new Error("no node html elements found");
      }
      Array.prototype.filter.call(nodes, function(node) {
        var nodeId = node.getAttribute("id");
        if (!nodeId) { return false;}
        // eslint-disable-next-line no-undef
        var oControl = sap.ui.getCore().byId(nodeId);
        if (oControl) {
          aCandidateValidControls.push(oControl);
        }
        return oControl;
      });
      return aCandidateValidControls;
    }

    function injectDataForProperties(domElement, oControl) {
				// Inject properties
      var aProperties = Object.keys(getControlAllProperties(oControl));
      Array.prototype.filter.call(aProperties, function(key) {
        var controlVal = getControlProperty(oControl, key);
        domElement.setAttribute("data-" + key, controlVal);
        return domElement;
      });

				// Inject aggregations
      var aAggregation = Object.keys(getControlAllAggregations(oControl));
      Array.prototype.filter.call(aAggregation, function(key) {
        var controlVal = getAggregationProperty(oControl, key);
        domElement.setAttribute("data-" + key, controlVal);
        return domElement;
      });

				// Inject associations
      var aAssociation = Object.keys(getControlAllAssociations(oControl));
      Array.prototype.filter.call(aAssociation, function(key) {
        var controlVal = getAssociationProperty(oControl, key);
        domElement.setAttribute("data-" + key, controlVal);
        return domElement;
      });

				//Inject bindingContextPath
      var sBindingPathValue = getControlBindingContextPath(oControl);
      if (sBindingPathValue) {
        domElement.setAttribute("data-bindingContextPath", sBindingPathValue);
      }

				//Inject BindingPath for property
      Array.prototype.filter.call(aProperties, function(key) {
        var oBindingDataStr = getBindingInfoDataString(oControl, key);
        if (oBindingDataStr !== null && oBindingDataStr !== undefined) {
          var sBindingDataStr = oBindingDataStr.toString();
          if (sBindingDataStr && sBindingDataStr.trim() !== "") {
            domElement.setAttribute("data-" + key + "-path", sBindingDataStr);
          }
        } else {
          return false;
        }
        return domElement;
      });

				//Inject BindingPath for aggregation
      Array.prototype.filter.call(aAggregation, function(key) {
        var oBindingDataStr = getBindingInfoDataAggregationString(oControl, key);
        if (oBindingDataStr !== null && oBindingDataStr !== undefined) {
          var sBindingDataStr = oBindingDataStr.toString();
          if (sBindingDataStr && sBindingDataStr.trim() !== "") {
							/*console.log("control-->"+ oControl.getId()
							+ ", key-->" + key
							+", binding path-->" + sBindingDataStr);*/
            domElement.setAttribute("data-" + key + "-path", sBindingDataStr);
          }
        } else {
          return false;
        }
        return domElement;
      });

				//Inject BindingPath for associations
      Array.prototype.filter.call(aAssociation, function(key) {
        var oBindingDataStr = getBindingInfoDataAssociationString(oControl, key);
        if (oBindingDataStr !== null && oBindingDataStr !== undefined) {
          var sBindingDataStr = oBindingDataStr.toString();
          if (sBindingDataStr && sBindingDataStr.trim() !== "") {
							/*console.log("control-->"+ oControl.getId()
							+ ", key-->" + key
							+", binding path-->" + sBindingDataStr);*/
            domElement.setAttribute("data-" + key + "-path", sBindingDataStr);
          }
        } else {
          return false;
        }
        return domElement;
      });
    }

    function getBindingInfoDataString(oControl, key) {
      var aBindingInfos = [];
      try {
        if (!oControl || !key
						|| !oControl.getBindingInfo
						|| !oControl.getBindingInfo(key)) return aBindingInfos;
        var aBindingInfoParts = oControl.getBindingInfo(key).parts;
        if (aBindingInfoParts && aBindingInfoParts.length > 0) {
          for (var i = 0; i < aBindingInfoParts.length; i++) {
            if (!aBindingInfoParts[i].path) continue;
            var sJoin = "";
            if (!aBindingInfoParts[i].model) sJoin = aBindingInfoParts[i].path;
            else sJoin = aBindingInfoParts[i].model + ">" + aBindingInfoParts[i].path;
            aBindingInfos.push(sJoin);
          }
        } else {
          sJoin = oControl.getBindingInfo(key).path;
          aBindingInfos.push(sJoin);
        }
      } catch (e) {
					// Just ignore and move forward
      }
      if (aBindingInfos.length > 0) {
        return aBindingInfos.join();
      } else {
        return null;
      }
    }

    function getBindingInfoDataAggregationString(oControl, key) {
      var aBindingInfos = [];
      try {
        if (!oControl || !key
						|| !oControl.getBindingInfo
						|| !oControl.getBindingInfo(key)
						|| !oControl.getBindingInfo(key)) return aBindingInfos;
        var aBindingInfoParts = oControl.getBindingInfo(key).parts;
        if (aBindingInfoParts && aBindingInfoParts.length > 0) {
          for (var i = 0; i < aBindingInfoParts.length; i++) {
            if (!aBindingInfoParts[i].path) continue;
            var sJoin = "";
            if (!aBindingInfoParts[i].model) sJoin = aBindingInfoParts[i].path;
            else sJoin = aBindingInfoParts[i].model + ">" + aBindingInfoParts[i].path;
            aBindingInfos.push(sJoin);
          }
        } else {
          sJoin = oControl.getBindingInfo(key).path;
          aBindingInfos.push(sJoin);
        }
      } catch (e) {
					// Just ignore and move forward
      }
      if (aBindingInfos.length > 0) {
        return aBindingInfos.join();
      } else {
        return null;
      }
    }

    function getBindingInfoDataAssociationString(oControl, key) {
      var aBindingInfos = [];
      try {
        if (!oControl || !key
						|| !oControl.getBindingInfo
						|| !oControl.getBindingInfo(key)
						|| !oControl.getBindingInfo(key)) return aBindingInfos;
        var aBindingInfoParts = oControl.getBindingInfo(key).parts;
        if (aBindingInfoParts && aBindingInfoParts.length > 0) {
          for (var i = 0; i < aBindingInfoParts.length; i++) {
            if (!aBindingInfoParts[i].path) continue;
            var sJoin = "";
            if (!aBindingInfoParts[i].model) sJoin = aBindingInfoParts[i].path;
            else sJoin = aBindingInfoParts[i].model + ">" + aBindingInfoParts[i].path;
            aBindingInfos.push(sJoin);
          }
        } else {
          sJoin = oControl.getBindingInfo(key).path;
          aBindingInfos.push(sJoin);
        }
      } catch (e) {
					// Just ignore and move forward
      }
      if (aBindingInfos.length > 0) {
        return aBindingInfos.join();
      } else {
        return null;
      }
    }

    function convertToDomElement(oControl) {
      if (!oControl || !oControl.getId || !oControl.getId()) { return null; }
      var domElem = document.getElementById(oControl.getId());
      if (domElem) {
        return domElem;
      }
      return null;
    }

    function convertToDomElements(aControls) {
      var aFoundNodes = [];
      Array.prototype.filter.call(aControls, function(oControl) {
        if (!oControl || !oControl.getId || !oControl.getId()) { return false;}
        var domElem = document.getElementById(oControl.getId());
        if (domElem) {
          injectDataForProperties(domElem, oControl);
          aFoundNodes.push(domElem);
        }
        return domElem;
      });
      return aFoundNodes;
    }

    function compareToNextElementProperties(elementProperties, oControl, oParentControl) {
      var bPass = true;
      if ((!elementProperties || isEmptyObject(elementProperties)) && oParentControl) {
        return bPass;
      } else if ((elementProperties && !isEmptyObject(elementProperties)) && !oParentControl) {
        return false;
      } else if ((!elementProperties || isEmptyObject(elementProperties)) && !oParentControl){
        return bPass;
      }

      var oNextControl = findPrevNextControl(oControl, oParentControl, true);
      if ((!elementProperties || isEmptyObject(elementProperties)) && oNextControl) {
        return bPass;
      } else if ((elementProperties && !isEmptyObject(elementProperties)) && !oNextControl) {
        return false;
      } else if ((!elementProperties || isEmptyObject(elementProperties)) && !oNextControl){
        return bPass;
      }
				/*console.log("Next Property Control Type -->"
				+ oNextControl.getMetadata().getName()
				+ ", Id-->" + oNextControl.getId()
				+ ", bPass-->"+ bPass);*/
      return compareToElementProperties(elementProperties, oNextControl);
    }

    function compareToDescendantElementProperties(elementProperties, oControl) {
      var bPass = true;
      if ((!elementProperties || isEmptyObject(elementProperties)) && oControl) {
        return bPass;
      } else if ((elementProperties && !isEmptyObject(elementProperties)) && !oControl) {
        return false;
      } else if ((!elementProperties || isEmptyObject(elementProperties)) && !oControl) {
        return bPass;
      }
      var aChildrenControls = [];
      var aAllChildrenNodes = document.getElementById(oControl.getId()).children;
      aCandidateControls = [];
      retrieveValidUI5ControlsSubElements(aAllChildrenNodes);
      var aValidControls = aCandidateControls;
      if ((elementProperties || !isEmptyObject(elementProperties))
				&& (!aValidControls || aValidControls.length === 0)) {
        return false;
      } else if ((!elementProperties || isEmptyObject(elementProperties))
				&& (aValidControls && aValidControls.length > 0)) {
        return bPass;
      } else if ((!elementProperties || isEmptyObject(elementProperties))
				&& (!aValidControls || aValidControls.length === 0)) {
        return bPass;
      }
      Array.prototype.filter.call(aValidControls, function (oChildControl) {
        var bIsEqual = compareToElementProperties(elementProperties, oChildControl);
        if (bIsEqual) {
          aChildrenControls.push(oChildControl);
        }
        return bIsEqual;
      });
      if (aChildrenControls && aChildrenControls.length > 0) {
        return true;
      } else {
        if (!aValidControls) return false;
        for (let index = 0; index < aValidControls.length; index++) {
          const childControl = aValidControls[index];
          if (compareToDescendantElementProperties(elementProperties, childControl)) {
            return true;
          }
        }
        return false;
      }
    }

    function compareToChildElementProperties(elementProperties, oControl) {
      var bPass = true;
      if ((!elementProperties || isEmptyObject(elementProperties)) && oControl) {
        return bPass;
      } else if ((elementProperties && !isEmptyObject(elementProperties)) && !oControl) {
        return false;
      } else if ((!elementProperties || isEmptyObject(elementProperties)) && !oControl){
        return bPass;
      }
      var aChildrenControls = [];
      var aAllChildrenNodes = document.getElementById(oControl.getId()).children;
      aCandidateControls = [];
      retrieveValidUI5ControlsSubElements(aAllChildrenNodes);
      var aValidControls = aCandidateControls;
      if ((elementProperties || !isEmptyObject(elementProperties))
					&& (!aValidControls || aValidControls.length === 0)){
        return false;
      } else if ((!elementProperties || isEmptyObject(elementProperties))
					&& (aValidControls && aValidControls.length > 0)) {
        return bPass;
      } else if ((!elementProperties || isEmptyObject(elementProperties))
					&& (!aValidControls || aValidControls.length === 0)){
        return bPass;
      }
      Array.prototype.filter.call(aValidControls, function(oChildControl) {
        var bIsEqual = compareToElementProperties(elementProperties, oChildControl);
        if (bIsEqual) {
          aChildrenControls.push(oChildControl);
        }
        return bIsEqual;
      });
      if (aChildrenControls && aChildrenControls.length > 0) {
					/*console.log("Child Property Control Type -->"
					+ aChildrenControls[0].getMetadata().getName()
					+ ", Id-->" + aChildrenControls[0].getId());*/
      }
      return aChildrenControls && aChildrenControls.length > 0;
    }

    function compareToSiblingElementProperties(elementProperties, oControl, oParentControl) {
      var bPass = true;
      if ((!elementProperties || isEmptyObject(elementProperties)) && oParentControl) {
        return bPass;
      } else if ((elementProperties && !isEmptyObject(elementProperties)) && !oParentControl) {
        return false;
      } else if ((!elementProperties || isEmptyObject(elementProperties)) && !oParentControl){
        return bPass;
      }
      var aSiblingControls = findSiblingControls(oControl, oParentControl);
      if ((elementProperties || !isEmptyObject(elementProperties))
					&& (!aSiblingControls || aSiblingControls.length === 0)){
        return false;
      } else if ((!elementProperties || isEmptyObject(elementProperties))
					&& (aSiblingControls && aSiblingControls.length > 0)) {
        return bPass;
      } else if ((!elementProperties || isEmptyObject(elementProperties))
					&& (!aSiblingControls || aSiblingControls.length === 0)){
        return bPass;
      }
      for (var i = 0; i < aValidControls.length; i++) {
        var bIsEqual = compareToElementProperties(elementProperties, aValidControls[i]);
        if (bIsEqual) {
          return bPass;
        }
      }
      return false;
    }

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

    function filterByIndex(aControls) {
      if ((index !== null && index !== undefined)
					&& aControls && aControls.length > 0){
        if ((index <= (aControls.length - 1)) && (index >= 0)) {
          return [aControls[index]];
        }
      }
      return aControls;
    }

    function compareToAncestorProperties(elementProperties, oControl) {
      if ((!elementProperties || isEmptyObject(elementProperties)) && oControl) {
        return true;
      } else if ((elementProperties && !isEmptyObject(elementProperties)) && !oControl) {
        return false;
      } else if ((!elementProperties || isEmptyObject(elementProperties)) && !oControl){
        return true;
      }
      var oAncestorControl = oControl;
      for (;;) {
        oAncestorControl = getValidParentControl(oAncestorControl);
        if (!oAncestorControl) return false;
        if (compareToElementProperties(elementProperties, oAncestorControl)) {
          return true;
        }
      }
    }

    // eslint-disable-next-line no-undef
    if (!sap.ui || !sap.ui.getCore()) {
      throw new Error("This is not an UI5 App, please use other locators");
    }
    var nodes = retrieveNodesFromBody(index, opt_parentElement);
    if (!nodes || nodes.length === 0) {
      throw new Error("no node html elements found");
    }

    var aCandidateControl = [];
    var aValidControls = retrieveValidUI5Controls(nodes);
    if (aValidControls === null || aValidControls === undefined) return aCandidateControl;
			//console.log("going in...");
    Array.prototype.filter.call(aValidControls, function(oControl) {
      var isNotCandidate = !compareToElementProperties(ui5Selector.elementProperties, oControl);
      if (isNotCandidate) return false;

      var oParentControl = getValidParentControl(oControl);
      if (!oParentControl && ui5Selector.parentProperties) { throw new Error("no parent control found"); }

      var isParentNotCandidate = !compareToElementProperties(ui5Selector.parentProperties, oParentControl);
      if (isParentNotCandidate) return false;

      var isAncestorNotCandidate = !compareToAncestorProperties(ui5Selector.ancestorProperties, oControl);
      if (isAncestorNotCandidate) return false;

      var isSiblingNotCandidate = !compareToSiblingElementProperties(ui5Selector.siblingProperties, oControl, oParentControl);
      if (isSiblingNotCandidate) return false;

      var isPrevSiblingNotCandidate = !compareToPrevElementProperties(ui5Selector.prevSiblingProperties, oControl, oParentControl);
      if (isPrevSiblingNotCandidate) return false;

      var isNextSiblingNotCandidate = !compareToNextElementProperties(ui5Selector.nextSiblingProperties, oControl, oParentControl);
      if (isNextSiblingNotCandidate) return false;

      var isChildNotCandidate = !compareToChildElementProperties(ui5Selector.childProperties, oControl);
      if (isChildNotCandidate) return false;

      var isDescendantNotCandidate = !compareToDescendantElementProperties(ui5Selector.descendantProperties, oControl);
      if (isDescendantNotCandidate) return false;
      
      if (oControl !== null && oControl !== undefined) {
        aCandidateControl.push(oControl);
      }
      return oControl !== null && oControl !== undefined;
    });
    aCandidateControl = filterByIndex(aCandidateControl);
	//console.log("Candidates found --->" + aCandidateControl.length);
			//debugger;
    var aNodesFound = convertToDomElements(aCandidateControl);
    return aNodesFound;
  };