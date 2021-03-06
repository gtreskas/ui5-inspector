
var QueryBuilder = function() {
    this.buildSelector = function(statement, propsType, existingSelector, parentPropsType, parentLevel) {
        var newSelectorCompl = {};
        if(existingSelector) {
            Object.assign(newSelectorCompl, existingSelector);
        } else {
            newSelectorCompl = {};
        }
        //Reset values
        if(statement && propsType) {
            // Lookup keys of statements
            let keys = Object.keys(statement);
            let oSelectProps = {};
            if(keys && keys.length > 0){
                for (let index = 0; index < keys.length; index++) {
                    let oKey = keys[index];
                    if(oKey === "bindingPropertyPaths"){
                        let mBindingPaths = statement[oKey];
                        let aBindPropKeys = Object.keys(mBindingPaths);
                        for (let index = 0; index < aBindPropKeys.length; index++) {
                            let bindKey = aBindPropKeys[index];
                            let aValues = mBindingPaths[bindKey];
                            let path = "";
                            let aBinds = []
                            for (let j = 0; j < aValues.length; j++) {
                                const oPath = aValues[j];
                                if(oPath.model && oPath.path) path = oPath.model + ">" + oPath.path;
                                else path = oPath.path;
                                aBinds.push({"path": path})
                            }
                            oSelectProps[bindKey] = aBinds; 
                        } 
                    } else if(statement[oKey] && statement[oKey] !== null && statement[oKey] !== undefined
                        || (statement[oKey] && Array.isArray(statement[oKey]) && statement[oKey].length > 0)){
                     oSelectProps[oKey] = statement[oKey];
                    }
                }
            }
            if(parentPropsType) {
                if(!parentLevel) {
                    newSelectorCompl[parentPropsType][propsType] = oSelectProps;
                } else {
                    let selectorLevel = newSelectorCompl[parentPropsType];
                    for (let index = 0; index < parentLevel - 1; index++) {
                        selectorLevel = selectorLevel[parentPropsType];
                    }
                    selectorLevel[propsType] = oSelectProps;
                }
                
            } else {
                newSelectorCompl[propsType] = oSelectProps;
            }
        }
        return newSelectorCompl;
    }
};
window.QueryBuilder = new QueryBuilder();
module.exports = new QueryBuilder();