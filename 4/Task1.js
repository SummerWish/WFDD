function mul(v) {
    function next(p) {
        v *= p;
        return next;
    }
    next.toString = function() {
        return v;
    }
    return next;
}