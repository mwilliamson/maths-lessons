var fs = require("fs");

var _ = require("underscore");
var knockout = require("knockout");
var knockoutWidgets = require("web-widgets-knockout");

exports.render = knockoutWidgets.create({
    template: fs.readFileSync(__dirname + "/multiple-choice.html", "utf8"),
    init: init
});

function init(options) {
    var question = options.question;
    var onAnswer = options.onAnswer;
    
    var disabled = knockout.observable(false);
    
    function correctChoice() {
        return _.find(question.choices, function(choice) {
            return choice.isCorrect;
        });
    }
    
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
                    selected(true);
                    disabled(true);
                    
                    var resultText = choice.isCorrect ?
                        "Correct!" :
                        "The correct answer is: " + correctChoice().text;
                    
                    onAnswer({
                        isCorrect: choice.isCorrect,
                        resultText: resultText
                    });
                }
            };
        })
    };
}
