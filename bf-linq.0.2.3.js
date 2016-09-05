"use strict";
Array.prototype.remove = function (item) {
    var ndx = this.indexOf(item);
    if (ndx >= 0) {
        this.splice(ndx, 1);
    }
};
Array.prototype.delete = function (lambda) {
    var ndx = this.indexOfFirst(lambda);
    if (ndx >= 0) {
        this.splice(ndx, 1);
    }
};
Array.prototype.single = function () {
    if (this.length === 1) {
        return this[0];
    }
    else {
        if (this.length === 0) {
            throw 'Collection has no items.';
        }
        else {
            throw 'Collection has more than one item.';
        }
    }
};
Array.prototype.singleOrDefault = function () {
    if (this.length == 0) {
        return null;
    }
    else if (this.length == 1) {
        return this[0];
    }
    else {
        throw 'Collection has more than one item.';
    }
};
Array.prototype.first = function (lambda) {
    if (!lambda && this.length > 0) {
        return this[0];
    }
    var result = null;
    var n = 0;
    while (result === null && n < this.length) {
        var item = this[n];
        if (lambda(item, n)) {
            result = item;
        }
        n++;
    }
    return result;
};
Array.prototype.firstOrDefault = function (lambda) {
    if (this.length == 0)
        return null;
    return this.first(lambda);
};
Array.prototype.indexOfFirst = function (lambda) {
    var result = -1;
    var n = 0;
    while (result < 0 && n < this.length) {
        if (lambda(this[n], n)) {
            result = n;
        }
        n++;
    }
    return result;
};
Array.prototype.any = function (lambda) {
    return this.first(lambda) != null;
};
Array.prototype.select = function (lambda) {
    var result = [];
    for (var n = 0; n < this.length; n++) {
        var item = this[n];
        var transformed = lambda(item, n);
        result.push(transformed);
    }
    return result;
};
Array.prototype.where = function (lambda) {
    var result = [];
    for (var n = 0; n < this.length; n++) {
        if (lambda(this[n], n)) {
            result.push(this[n]);
        }
    }
    return result;
};
Array.prototype.distinct = function (lambda) {
    var result = [];
    var predicate;
    if (lambda) {
        predicate = function (y) { return !result.any(function (x) { return lambda(x, y); }); };
    }
    else {
        predicate = function (i) { return result.indexOf(i) < 0; };
    }
    for (var _i = 0, _a = this; _i < _a.length; _i++) {
        var p = _a[_i];
        if (predicate(p)) {
            result.push(p);
        }
    }
    return result;
};
Array.prototype.count = function (lambda) {
    if (!lambda)
        return this.length;
    return this.where(lambda).length;
};
Array.prototype.aggregate = function (lambda, aggregate) {
    if (aggregate === void 0) { aggregate = null; }
    for (var _i = 0, _a = this; _i < _a.length; _i++) {
        var i = _a[_i];
        aggregate = lambda(aggregate, i);
    }
    return aggregate;
};
Array.prototype.sum = function (lambda) {
    if (!lambda)
        lambda = function (elem) { return elem; };
    var sum = null;
    for (var _i = 0, _a = this; _i < _a.length; _i++) {
        var i = _a[_i];
        if (sum == null) {
            sum = lambda(i);
        }
        else {
            sum = sum + lambda(i);
        }
    }
    return sum;
};
Array.prototype.singleJoin = function (otherArray, selfKeyLambda, otherKeyLambda, pairMap) {
    //Generate list for looking up right elements by keys. This ensures that otherKeyLambda is only
    //called only otherArray.length times at a slight memory cost
    var rightKeyMappings = new Array();
    for (var _i = 0, otherArray_1 = otherArray; _i < otherArray_1.length; _i++) {
        var rightElem = otherArray_1[_i];
        rightKeyMappings.push({
            key: otherKeyLambda(rightElem),
            value: rightElem
        });
    }
    //For each element of this, join with the first match in the other array
    var results = new Array();
    for (var _a = 0, _b = this; _a < _b.length; _a++) {
        var leftElem = _b[_a];
        var key = selfKeyLambda(leftElem);
        var rightElem = rightKeyMappings.first(function (pair) { return pair.key == key; }).value;
        var result = pairMap(leftElem, rightElem);
        results.push(result);
    }
    return results;
};
Array.prototype.last = function (lambda) {
    if (!lambda && this.length > 0) {
        return this[this.length - 1];
    }
    var result = null;
    var n = this.length - 1;
    while (result === null && n >= 0) {
        var item = this[n];
        if (lambda(item, n)) {
            result = item;
        }
        n--;
    }
    return result;
};
