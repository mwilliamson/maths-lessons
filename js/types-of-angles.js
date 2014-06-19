var $ = require("jquery");

var geometryDiagrams = require("./geometry-diagrams");
var multipleChoice = require("./widgets/multiple-choice");

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

function renderTestWidget(element) {
    var question = generateAngleMultipleChoiceQuestion();
    multipleChoice.render(element, question);
}

function generateAngleMultipleChoiceQuestion() {
    return {
        text: "Which angle is larger?",
        choices: [
            {text: "Acute angle", isCorrect: false},
            {text: "Obtuse angle", isCorrect: true}
        ]
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

    var initialHeading = readInitialHeading(element);
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

function readInitialHeading(element) {
    var angle = readAngleAttribute(element, "data-initial-heading");
    if (angle === null) {
        return randomAngle();
    } else {
        return angle;
    }
}

function readAngleAttribute(element, name) {
    if (element.hasAttribute(name)) {
        var angleDegrees = element.getAttribute(name);
        return angleDegrees / 180 * Math.PI;
    } else {
        return null;
    }
}

function randomAngle() {
    return Math.random() * Math.PI * 2;
}
