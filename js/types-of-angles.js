var $ = require("jquery");

var geometryDiagrams = require("./geometry-diagrams");

renderRectangleAngleWidgets();
renderAngleWidgets();
renderTestWidgets();

function renderTestWidgets() {
    $("*[data-widget='types-of-angles-test']").each(function() {
        renderTestWidget(this);
    });
}

function renderTestWidget(element) {
    var question = generateAngleMultipleChoiceQuestion();
    renderMultipleChoice(element, question);
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

function renderMultipleChoice(element, question) {
    $(element).addClass("test");
    
    var textElement = $("<p>")
        .text(question.text)
        .addClass("question-text");
    $(element).append(textElement);
    
    var choicesElement = $("<ul>").addClass("choices");
    $(element).append(choicesElement);
    
    question.choices.forEach(function(choice) {
        var choiceElement = $("<li>")
            .text(choice.text);
        choicesElement.append(choiceElement);
        
        choiceElement.on("click", function() {
            if (choice.isCorrect) {
                resultElement.addClass("result-correct");
                resultElement.removeClass("result-incorrect");
                resultElement.text("Correct!");
            } else {
                resultElement.addClass("result-incorrect");
                resultElement.removeClass("result-correct");
                resultElement.text("Incorrect");
            }
        });
    });
    
    var resultElement = $("<p>").addClass("result");
    $(element).append(resultElement);
}

function renderRectangleAngleWidgets() {
    $("*[data-widget='rectangle-angle-example']").each(function() {
        renderRectangleAngleExampleWidget(this);
    });
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

function renderAngleWidgets() {
    $("*[data-widget='angle-example']").each(function() {
        renderAngleExamplesWidget(this);
    });
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
