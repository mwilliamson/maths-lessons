exports.enumerate = enumerate;

function enumerate(array) {
    return array.map(function(value, index) {
        return {value: value, index: index};
    });
}
