var knockout = require("knockout");

exports.create = create;


knockout.bindingHandlers.widget = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var name = knockout.unwrap(valueAccessor());
        var options = knockout.unwrap(allBindingsAccessor().widgetOptions);
        
        var widgets = findWidgets(bindingContext);

        widgets[name](element, options);
        
        return {
            controlsDescendantBindings: true
        };
    }
};

knockout.bindingHandlers.__widgetBind = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var widgets = knockout.utils.domData.get(element, "__widgets");
        var innerBindingContext = bindingContext.extend({__widgets: widgets});
        knockout.applyBindingsToDescendants(innerBindingContext, element);
        return { controlsDescendantBindings: true };
    }
}

function findWidgets(bindingContext) {
    while (bindingContext) {
        if ("__widgets" in bindingContext) {
            return bindingContext.__widgets;
        }
        bindingContext = bindingContext.$parentContext;
    }
    throw new Error("Could not find widgets");
}

knockout.virtualElements.allowedBindings.widget = true;
knockout.virtualElements.allowedBindings.__widgetBind = true;

function create(widgetOptions) {
    var template = widgetOptions.template;
    var init = widgetOptions.init;
    var dependencies = widgetOptions.dependencies || {};
    
    return function(element) {
        var args = Array.prototype.slice.call(arguments, 1);
        knockout.computed(function() {
            var viewModel = knockout.unwrap(init.apply(widgetOptions, args));
            var content = "<!-- ko __widgetBind: $data -->" + template + "<!-- /ko -->";
            
            var temporaryElement = document.createElement("div");
            temporaryElement.innerHTML = content;
            var nodes = Array.prototype.slice.call(temporaryElement.childNodes, 0);
            
            // TODO: do we need to tidy up old bindings?
            knockout.virtualElements.setDomNodeChildren(element, nodes);

            knockout.utils.domData.set(knockout.virtualElements.firstChild(element), "__widgets", dependencies);

            knockout.applyBindingsToDescendants(viewModel, element);
        });
    };
}

