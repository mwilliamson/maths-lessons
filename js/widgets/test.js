var fs = require("fs");

var knockout = require("knockout");
var knockoutWidgets = require("web-widgets-knockout");


exports.render = knockoutWidgets.create({
    template: fs.readFileSync(__dirname + "/test.html", "utf8"),
    init: function(options) {
        var generateQuestion = options.generateQuestion;
        
        var showNextQuestion = knockout.observable(false);
        var progress = {
            correct: knockout.observable(0),
            total: 10
        };
        
        var question = knockout.observable();
        next();
        
        function next() {
            question(generateQuestion(onAnswer));
            showNextQuestion(false);
        }
        
        function onAnswer(answer) {
            if (answer.isCorrect) {
                progress.correct(progress.correct() + 1);
            }
            showNextQuestion(true);
        }
        
        return knockout.computed(function() {
            return {
                progress: progress,
                questionWidget: question(),
                showNextQuestion: showNextQuestion,
                next: next
            };
        });
    }
});
