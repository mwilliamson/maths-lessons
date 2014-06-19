var fs = require("fs");

var knockout = require("knockout");

exports.render = render;

function render(element, question) {
    element.innerHTML = fs.readFileSync(__dirname + "/multiple-choice.html", "utf8");
    
    var resultText = knockout.observable();
    var resultClass = knockout.observable();
    
    var viewModel = {
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
                    
                }
            };
        }),
        resultText: resultText,
        resultClass: resultClass
    };
    
    knockout.applyBindingsToDescendants(viewModel, element);
}
