var shuffle = require('knuth-shuffle').knuthShuffle;

exports.select = select;

function select(array, count) {
    return shuffle(array).slice(0, count);
}
