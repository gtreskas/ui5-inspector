var gradeSchema = {
    index: 40,
    elementProperties: {
        score: 10, 
        properties:{
            idElement : 100,
            idAggregationElement: 10,
            i18nKey: 90,
            bindingPropertyElement: 90,
            bindingPropertyAggregationElement: 10,
            metadata: 120,
            viewName: 70,
            viewId: 70,
            bindingContextPathAggregation: 70,
            bindingContextPathElement: 20, 
            text: 50,
            value: 60,
            ui5Prop: 30
        },
        domProperties: {
            class: 20,
            elementType: 50,
            propContainingText: 50,
            otherProperty: 10
        }
    },
    ancestorProperties: {score: 6, properties:{
        properties:{
            idElement : 50,
            i18nKey: 40,
            bindingPropertyElement: 40,
            metadata: 60,
            viewName: 20,
            viewId: 20,
            bindingContextPathAggregation: 30,
            text: 10,
            value: 30,
            ui5Prop: 10
        },
        domProperties: {
            class: 5,
            elementType: 10,
            propContainingText: 10,
            otherProperty: 2
        }        
    }},
    descendantProperties: {score: 6, properties:{
        properties:{
            idElement : 50,
            i18nKey: 40,
            bindingPropertyElement: 40,
            metadata: 60,
            viewName: 20,
            viewId: 20,
            bindingContextPathAggregation: 30,
            text: 10,
            value: 30,
            ui5Prop: 10
        },
        domProperties: {
            class: 5,
            elementType: 10,
            propContainingText: 10,
            otherProperty: 2
        }     
    }},
    siblingProperties: {score: 4, properties:{
        properties:{
            idElement : 20,
            i18nKey: 20,
            bindingPropertyElement: 10,
            metadata: 30,
            viewName: 10,
            viewId: 10,
            bindingContextPathAggregation: 5,
            text: 5,
            value: 10,
            ui5Prop: 5
        },
        domProperties: {
            class: 3,
            elementType: 5,
            propContainingText: 5,
            otherProperty: 1
        }     
    }},
}



module.exports = {

};