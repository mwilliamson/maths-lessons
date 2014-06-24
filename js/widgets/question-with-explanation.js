var fs = require("fs");

var knockout = require("knockout");
var knockoutWidgets = require("web-widgets-knockout");

exports.render = knockoutWidgets.create({
    template: fs.readFileSync(__dirname + "/question-with-explanation.html", "utf8"),
    init: init
});

function init(options) {
    var questionWidget = options.questionWidget;
    var explanationWidget = options.explanationWidget;
    var onAnswer = options.onAnswer;
    
    var resultText = knockout.observable();
    var resultClass = knockout.observable();
    var shouldShowExplanation = knockout.observable(false);
    
    return {
        resultText: resultText,
        resultClass: resultClass,
        shouldShowExplanation: shouldShowExplanation,
        showExplanation: shouldShowExplanation.bind(null, true),
        explanationWidget: explanationWidget,
        questionWidget: function(element) {
            questionWidget(element, {
                onAnswer: function(answer) {
                    onAnswer(answer);
                    resultText(answer.resultText);
                    resultClass(answer.isCorrect ? "result-correct" : "result-incorrect");
                }
            });
        }
    };
}
