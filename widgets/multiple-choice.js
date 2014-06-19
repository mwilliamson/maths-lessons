var $ = require("jquery");

exports.render = render;

function render(element, question) {
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
