var fs = require("fs");

var knockout = require("knockout");

var knockoutWidgets = require("../knockout-widgets");

exports.render = knockoutWidgets.create({
    template: fs.readFileSync(__dirname + "/multiple-choice.html", "utf8"),
    init: init
});

function init(options) {
    var question = options.question;
    var onAnswer = options.onAnswer;
    
    var resultText = knockout.observable();
    var resultClass = knockout.observable();
    var disabled = knockout.observable(false);
    
    return {
        text: question.text,
        choices: question.choices.map(function(choice) {
            var selected = knockout.observable(false);
            return {
                text: choice.text,
                disabled: disabled,
                selected: selected,
                select: function() {
                    if (disabled()) {
                        return;
                    }
                    if (choice.isCorrect) {
                        resultText("Correct!");
                        resultClass("result-correct");
                    } else {
                        resultText("Incorrect");
                        resultClass("result-incorrect");
                    }
                    selected(true);
                    disabled(true);
                    onAnswer({
                        isCorrect: choice.isCorrect
                    });
                }
            };
        }),
        resultText: resultText,
        resultClass: resultClass
    };
}
