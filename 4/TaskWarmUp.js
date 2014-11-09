var MyCalculator = {
    value: 0,
    set: function(v) {
        MyCalculator.value = v;
        return MyCalculator;
    },
    add: function(v) {
        MyCalculator.value += v;
        return MyCalculator;
    },
    multiply: function(v) {
        MyCalculator.value *= v;
        return MyCalculator;
    },
    minus: function(v) {
        MyCalculator.value -= v;
        return MyCalculator;
    },
    divide: function(v) {
        MyCalculator.value /= v;
        return MyCalculator;
    },
    get: function() {
        return MyCalculator.value;
    }
}