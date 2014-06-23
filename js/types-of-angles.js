var fs = require("fs");

var $ = require("jquery");
var knockoutWidgets = require("web-widgets-knockout");
var _ = require("underscore");

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
    var types = [
        {
            name: "Acute angle",
            description: "Acute angles are greater than 0° and less than 90°. In other words, acute angles are smaller than right angles.",
            exampleAngle: 30
        },
        {
            name: "Right angle",
            description: "There are 90° in a right angle.",
            exampleAngle: 90
        },
        {
            name: "Obtuse angle",
            description: "Obtuse angles are larger than 90° and smaller than 180°. In other words, obtuse angles are larger than right angles and smaller than straight lines.",
            exampleAngle: 120
        },
        {
            name: "Straight line",
            description: "There are 180° in a straight line.",
            exampleAngle: 180
        },
        {
            name: "Reflex angle",
            description: "Reflex angles are larger than 180°. In other words, reflex angles are larger than straight lines.",
            exampleAngle: 290
        },
        {
            name: "Full turn",
            description: "There are 360° in a full turn",
            exampleAngle: 360
        }
    ];
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
        return {text: angleType.value.name, isCorrect: isCorrect(angleType)};
    }
    
    var explanationWidget = knockoutWidgets.create({
        template: fs.readFileSync(__dirname + "/angle-type-comparison-explanation.html"),
        init: function() {
            return {
                angleTypes: _.pluck(selectedTypes, "value")
            };
        },
        dependencies: {
            "drawAngle": drawAngleWidget
        }
    });
    
    return {
        text: "Which angle is " + operation.name + "?",
        choices: selectedTypes.map(angleTypeToChoice),
        explanationWidget: explanationWidget
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

function drawAngleWidget(element, options) {
    var widgetElement = $('<div class="widget-inline">');
    $(element).append(widgetElement);
    
    var width = 200;
    var height = width;

    var centre = {x: width / 2, y: height / 2};
    
    var startAzimuth = degreesToRadians(options.startAzimuth);
    var angle = degreesToRadians(options.angle);
    var endAzimuth = startAzimuth + angle;
    
    var diagram = geometryDiagrams.create({
        parentElement: widgetElement.get(0),
        width: width,
        height: height
    });
    
    diagram.drawVertex(centre);
    diagram.drawAngleMarker(centre, {start: startAzimuth, end: endAzimuth});
    var armLength = width / 2 * 0.8;
    diagram.drawArm({start: centre, azimuth: startAzimuth, length: armLength});
    diagram.drawArm({start: centre, azimuth: endAzimuth, length: armLength});
    
}

function renderAngleExamplesWidget(element) {
    var initialHeading = element.getAttribute("data-initial-heading");
    var angle = element.getAttribute("data-angle");
    drawAngleWidget(element, {startAzimuth: initialHeading, angle: angle});
}

function degreesToRadians(value) {
    if (value !== null && value !== undefined) {
        return value / 180 * Math.PI;
    } else {
        return value;
    }
}
