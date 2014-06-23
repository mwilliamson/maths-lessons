var fs = require("fs");

var knockout = require("knockout");
var knockoutWidgets = require("web-widgets-knockout");

var multipleChoice = require("./multiple-choice");


exports.render = knockoutWidgets.create({
    template: fs.readFileSync(__dirname + "/test.html", "utf8"),
    init: function(options) {
        var generateQuestion = options.generateQuestion;
        
        var progress = {
            correct: knockout.observable(0),
            total: 10
        };
        
        var question = knockout.observable();
        setQuestion();
        
        function setQuestion() {
            question(generateQuestion());
        }
        
        function onAnswer(answer) {
            if (answer.isCorrect) {
                progress.correct(progress.correct() + 1);
            }
        }
        
        function next() {
            setQuestion();
        }
        
        return knockout.computed(function() {
            return {
                progress: progress,
                questionWidget: {
                    question: question(),
                    onAnswer: onAnswer,
                    next: next
                }
            };
        });
    },
    dependencies: {
        "multiple-choice": multipleChoice.render
    }
});
