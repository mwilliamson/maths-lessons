var fs = require("fs");

var $ = require("jquery");
var knockoutWidgets = require("web-widgets-knockout");
var knockout = require("knockout");
var _ = require("underscore");

var geometryDiagrams = require("./geometry-diagrams");
var random = require("./random");
var arrays = require("./arrays");
var testWidget = require("./widgets/test");
var multipleChoice = require("./widgets/multiple-choice");
var questionWithExplanation = require("./widgets/question-with-explanation");

var renderTestWidget = withOptions(testWidget, {
    generateQuestion: generateQuestion
});

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

function generateQuestion(onAnswer) {
    var generator = random.choice([
        generateAngleTypeComparisonQuestionWidget,
        generateAngleIdentificationQuestionWidget2
    ]);
    return generator(onAnswer);
}

function generateAngleTypeComparisonQuestionWidget(onAnswer) {
    var question = generateAngleTypeComparisonQuestion();
    
    var explanationWidget = knockoutWidgets.create({
        template: fs.readFileSync(__dirname + "/angle-type-comparison-explanation.html"),
        init: function() {
            return {
                angleTypes: question.selectedTypes
            };
        },
        dependencies: {
            "drawAngle": drawAngleWidget
        }
    });
    
    return withOptions(questionWithExplanation, {
        questionWidget: withOptions(multipleChoice, {question: question}),
        explanationWidget: explanationWidget,
        onAnswer: onAnswer
    });
}

function generateAngleTypeComparisonQuestion() {
    var angleTypes = [
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
    
    var selectedTypes = random.sample(arrays.enumerate(angleTypes), 2);
    var operation = random.choice(operations);
    
    function isCorrect(type) {
        return selectedTypes.every(function(selectedType) {
            return operation.apply(type.index, selectedType.index);
        });
    }
    
    function angleTypeToChoice(angleType) {
        return {text: angleType.value.name, isCorrect: isCorrect(angleType)};
    }
    
    return {
        text: "Which angle is " + operation.name + "?",
        choices: selectedTypes.map(angleTypeToChoice),
        selectedTypes: _.pluck(selectedTypes, "value")
    };
}

// TODO: need to think of a *much* better name!
function generateAngleIdentificationQuestionWidget2(onAnswer) {
    var widgets = generateAngleIdentificationQuestionWidgets();
    return withOptions(questionWithExplanation, {
        questionWidget: widgets.question,
        explanationWidget: widgets.explanation,
        onAnswer: onAnswer
    });
}

function generateAngleIdentificationQuestionWidgets() {
    var question = generateAngleIdentificationQuestion();
    
    var answer = knockout.observable("");
    
    var questionWidget = knockoutWidgets.create({
        template: fs.readFileSync(__dirname + "/angle-type-identification.html"),
        init: function(options) {
            function submitAnswer() {
                var isCorrect = question.isCorrect(answer());
                var resultText = isCorrect ?
                    "Correct!" :
                    "The correct answer is: " + question.angleTypeName;
                
                options.onAnswer({
                    isCorrect: isCorrect,
                    resultText: resultText
                });
            }
            
            return {
                drawAngleOptions: {
                    angle: question.angle,
                    startAzimuth: question.startAzimuth
                },
                submitAnswer: submitAnswer,
                answer: answer
            };
        },
        dependencies: {
            "drawAngle": drawAngleWidget
        }
    });
    
    var explanationWidget = knockoutWidgets.create({
        template: fs.readFileSync(__dirname + "/angle-type-identification-explanation.html"),
        init: function() {
            var left;
            var centre;
            var right;
            if (question.explanation.left || question.explanation.right) {
                centre = {
                    name: question.angleTypeName,
                    draw: question
                };
                if (question.explanation.left) {
                    left = {
                        name: question.explanation.left.name,
                        draw: {
                            angle: question.explanation.left.angle,
                            startAzimuth: question.startAzimuth
                        }
                    };
                }
                if (question.explanation.right) {
                    right = {
                        name: question.explanation.right.name,
                        draw: {
                            angle: question.explanation.right.angle,
                            startAzimuth: question.startAzimuth
                        }
                    };
                }
            }
    
            return {
                left: left,
                centre: centre,
                right: right,
                explanationText: question.explanation.text
            };
        },
        dependencies: {
            "drawAngle": drawAngleWidget
        }
    });
    return {
        question: questionWidget,
        explanation: explanationWidget
    };
}

function generateAngleIdentificationQuestion() {
    var angleTypes = [
        {
            keyword: "acute",
            name: "Acute angle",
            range: [0, 90],
            explanation: {
                text: "An acute angle is smaller than a right angle",
                right: {name: "Right angle", angle: 90}
            }
        },
        {
            keyword: "right",
            name: "Right angle",
            angle: 90,
            explanation: {
                text: "A right angle is exactly one quarter of a full turn"
            }
        },
        {
            keyword: "obtuse",
            name: "Obtuse angle",
            range: [90, 180],
            explanation: {
                text: "An obtuse angle is bigger than a right angle and smaller than a straight line",
                left: {name: "Right angle", angle: 90},
                right: {name: "Straight line", angle: 180}
            }
        },
        {
            keyword: "straight",
            name: "Straight line",
            angle: 180,
            explanation: {
                text: "A straight line is exactly half a full turn"
            }
        },
        {
            keyword: "reflex",
            name: "Reflex angle",
            range: [180, 360],
            explanation: {
                text: "A reflex angle is bigger than a straight line and smaller than a full turn",
                left: {name: "Straight line", angle: 180}
            }
        },
        {
            keyword: "full",
            name: "Full turn",
            angle: 360,
            explanation: {
                text: "A full turn is an angle that goes all the way around"
            }
        }
    ];

    var startAzimuth = random.integer(0, 360);
    var angleType = random.choice(angleTypes);
    var angle;
    var range = angleType.range;
    if (range) {
        var anglePadding = 20;
        angle = random.integer(range[0] + anglePadding, range[1] - anglePadding);
    } else {
        angle = angleType.angle;
    }
    
    function isCorrect(answer) {
        // TODO: be a bit more sophisticated (for instance, you can pass just by entering all keywords)
        return answer.toLowerCase().indexOf(angleType.keyword) !== -1;
    }
    
    return {
        angle: angle,
        angleTypeName: angleType.name,
        explanation: angleType.explanation,
        startAzimuth: startAzimuth,
        isCorrect: isCorrect
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

function withOptions(widget, boundOptions) {
    return function(element, options) {
        var finalOptions = _.clone(boundOptions);
        _.extend(finalOptions, options);
        widget(element, finalOptions);
    };
}
