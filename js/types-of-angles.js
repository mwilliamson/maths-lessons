var $ = require("jquery");

var geometryDiagrams = require("./geometry-diagrams");
var random = require("./random");
var arrays = require("./arrays");

var testWidget = require("./widgets/test");

var renderTestWidget = function(element) {
    return testWidget.render(element, {
        generateQuestion: generateAngleMultipleChoiceQuestion
    });
};

var widgets = {
    "types-of-angles-test": renderTestWidget,
    "rectangle-angle-example": renderRectangleAngleExampleWidget,
    "angle-example": renderAngleExamplesWidget
};

renderWidgets();

function renderWidgets() {
    $("*[data-widget]").each(function() {
        var widgetName = this.getAttribute("data-widget");
        widgets[widgetName](this);
    });
}

function generateAngleMultipleChoiceQuestion() {
    var types = ["Acute angle", "Right angle", "Obtuse angle", "Straight line", "Reflex angle", "Full turn"];
    var operations = [
        {name: "larger", apply: function(a, b) { return a >= b; }},
        {name: "smaller", apply: function(a, b) { return a <= b; }}
    ];
    
    var selectedTypes = random.sample(arrays.enumerate(types), 2);
    var operation = random.choice(operations);
    
    function isCorrect(type) {
        return selectedTypes.every(function(selectedType) {
            return operation.apply(type.index, selectedType.index);
        });
    }
    
    function angleTypeToChoice(angleType) {
        return {text: angleType.value, isCorrect: isCorrect(angleType)};
    }
    
    return {
        text: "Which angle is " + operation.name + "?",
        choices: selectedTypes.map(angleTypeToChoice)
    };
}

function renderRectangleAngleExampleWidget(element) {
    var width = 1 * element.getAttribute("data-width");
    var height = 1 * element.getAttribute("data-height");
    
    var diagram = geometryDiagrams.create({
        parentElement: element,
        height: height,
        width: width,
        padding: 20
    });
    
    var rectanglePath = [
        [0, 0],
        [width, 0],
        [width, height],
        [0, height],
        [0, 0]
    ];
    
    diagram.drawPath(rectanglePath);
    
    diagram.drawAngleMarker({x: 0, y: 0}, {start: Math.PI / 2, end: Math.PI});
    diagram.drawAngleMarker({x: width, y: 0}, {start: Math.PI, end: Math.PI * 3 / 2});
    diagram.drawAngleMarker({x: 0, y: height}, {start: 0, end: Math.PI / 2});
    diagram.drawAngleMarker({x: width, y: height}, {start: 0, end: -Math.PI / 2});
}

function renderAngleExamplesWidget(element) {
    var width = 200;
    var height = width;

    var centre = {x: width / 2, y: height / 2};

    var initialHeading = readAngleAttribute(element, "data-initial-heading");
    var angle = readAngleAttribute(element, "data-angle");
    var finalHeading = initialHeading + angle;
    
    var diagram = geometryDiagrams.create({
        parentElement: element,
        width: width,
        height: height
    });
    
    diagram.drawVertex(centre);
    diagram.drawAngleMarker(centre, {start: initialHeading, end: finalHeading});
    var armLength = width / 2 * 0.8;
    diagram.drawArm({start: centre, azimuth: initialHeading, length: armLength});
    diagram.drawArm({start: centre, azimuth: finalHeading, length: armLength});
}

function readAngleAttribute(element, name) {
    if (element.hasAttribute(name)) {
        var angleDegrees = element.getAttribute(name);
        return angleDegrees / 180 * Math.PI;
    } else {
        return null;
    }
}
