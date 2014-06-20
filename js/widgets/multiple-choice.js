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
    
    return {
        text: question.text,
        choices: question.choices.map(function(choice) {
            return {
                text: choice.text,
                select: function() {
                    if (choice.isCorrect) {
                        resultText("Correct!");
                        resultClass("result-correct");
                    } else {
                        resultText("Incorrect");
                        resultClass("result-incorrect");
                    }
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
