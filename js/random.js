var shuffle = require('knuth-shuffle').knuthShuffle;

exports.sample = sample;
exports.choice = choice;
exports.integer = integer;

function sample(array, count) {
    return shuffle(array).slice(0, count);
}

function choice(array) {
    return array[integer(0, array.length - 1)];
}

function integer(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

