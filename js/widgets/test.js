var fs = require("fs");

var knockout = require("knockout");
var knockoutWidgets = require("web-widgets-knockout");

// TODO: this is a bit of hack to add the CSS class
module.exports = function(element, options) {
    element.classList.add("test");
    return innerWidget(element, options);
};

var innerWidget = knockoutWidgets.create({
    template: fs.readFileSync(__dirname + "/test.html", "utf8"),
    init: function(options) {
        var generateQuestion = options.generateQuestion;
        
        var showNextQuestion = knockout.observable(false);
        var progress = {
            correct: knockout.observable(0),
            target: 10,
            marks: function() {
                var marks = [];
                var i;
                for (i = 0; i < progress.correct(); i++) {
                    marks.push({
                        className: "mark-correct",
                        text: "✓"
                    });
                }
                for (i = progress.correct(); i < progress.target; i++) {
                    marks.push({
                        className: "mark-unknown",
                        text: "?"
                    });
                }
                return marks;
            }
        };
        progress.done = knockout.computed(function() {
            return progress.correct() >= progress.target;
        });
        
        var question = knockout.observable();
        next();
        
        function next() {
            question(generateQuestion(onAnswer));
            showNextQuestion(false);
        }
        
        function onAnswer(answer) {
            if (answer.isCorrect) {
                progress.correct(progress.correct() + 1);
            } else {
                progress.correct(0);
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
