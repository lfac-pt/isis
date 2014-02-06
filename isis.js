(function () {
    var methods;
    
    function wrapFn(fn) {
        return _.extend(fn, methods);
    };

    function or(fn1, fn2) {
        return function () {
            return fn1.apply(null, arguments) || fn2.apply(null, arguments);
        };
    };
    function and(fn1, fn2) {
        return function () {
            return fn1.apply(null, arguments) && fn2.apply(null, arguments);
        };
    };
    methods = {
        or : function (fn) {
            return or(this, is(fn));
        },
        and : function (fn) {
            return and(this, is(fn));
        },
        to : function (compareToValue) {
            return _.partial(this, _, compareToValue);
        },
        the : function (mutatorFn) {
            return _.compose(this, mutatorFn);
        }
    };
    _.each(methods, function (method, name) {
        methods[name] = _.compose(wrapFn, method);
    })
    methods.than = methods.to;

    function objectWrap(value) {
        return value === undefined || value === null ? value : Object(value);
    };
    function is(fn, value, compareToValue) {
        if (arguments.length === 1) {
            return wrapFn(_.partial(is, fn));    
        }
        return objectWrap(value) instanceof fn || 
            (arguments.length === 2 ? fn(value) : fn(value, compareToValue)) === true; //Don't pass unexpected parameters
    };

    function not(value) {
        return !value;
    };
    function isnt(fn) {
        return wrapFn(_.compose(not, is(fn))); 
    };

    _.mixin({ 
        is: is,
        isnt : isnt
    });
}());