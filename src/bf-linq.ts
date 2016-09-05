export {};

export type predicate<T> = (item: T) => boolean;
export type indexedPredicate<T> = (item: T, number?: number) => boolean;

export interface KeyValuePair<K, T> {
    key: K;
    value: T;
}

export interface KeyArrayPair<K, T> {
    key: K;
    array: Array<T>;
}

declare global {
    interface Array<T> {
        single(): T;
        singleOrDefault(): T;
        first(lambda?: indexedPredicate<T>): T;
        firstOrDefault(lambda?: indexedPredicate<T>): T;
        indexOfFirst(lambda: indexedPredicate<T>): number;
        any(lambda?: indexedPredicate<T>): boolean;
        select<TR>(lambda?: (item: T) => TR): TR[];
        where(lambda: indexedPredicate<T>): T[];
        distinct(lambda?: (a: T, b: T) => boolean): T[];
        count(lambda?: indexedPredicate<T>): number;
        remove(item: T);
        delete(lambda?: indexedPredicate<T>);
        last(lambda?: indexedPredicate<T>): T;

        /**
         * Aggregates the elements of the array into the aggregate object via the aggregate lambda operator
         * s.t. aggregate(agg, lambda) = lambda( lambda( ... lamba(agg, R_0) , R_(n-2) ), R_(n-1) )
         * @param aggregate The initial/empty value to be aggregated into
         * @param lambda The function which returns the result of aggregating an individual element into a
         *  running aggregate object
         * @returns The final result of calling the aggregate lambda on every element in the array.
         */
        aggregate<R>(lambda: (agg: R, elem: T) => R, aggregate?: R): R;
        /**
         * Sums the values of the array as mapped by the lambda. If no lambda is provided, this sums the elements
         * of the array.
         * @param lambda To map the element to what should be summed
         * @returns The sum of lambda(element) over each element in the array
         */
        sum<R>(lambda?: (elem: T) => R): R;
        /**
         * Groups the elements of the array into KeyArrayPairs with each element's key provided by lambda(elem).
         * @param lambda Method that generates the group key from an element in the array
         * @returns An array of KeyArrayPair values with keys corresponding to the results of the provided lambda
         * and arrays of elements that map to respective keys
         */
        singleJoin<R, K, O>(otherArray: Array<R>, selfKeyLambda: (T) => K, otherKeyLambda: (R) => K, pairMap: (T, R) => O): Array<O>;
        /**
         * Joins a group of elements of the provided array to each element of this array
         * @param otherArray Array of elements to join to elements in this array
         * @param selfKeyLambda Lambda that maps elements of this array into their joining key
         * @param otherKeyLambda Lambda that maps elements of the other array into their joining key
         * @returns An array of KeyArrayPairs with the keys corresponding to elements of this array and the pair's array
         *  corresponding to the group of elements in otherArray with matching keys
         */
        groupJoin<R, K>(otherArray: Array<R>, selfKeyLambda: (T) => K, otherKeyLambda: (R) => K): Array<KeyArrayPair<T, R>>;
    }
}

Array.prototype.remove = function <T>(item: T) {
    const ndx = this.indexOf(item);
    if (ndx >= 0) {
        this.splice(ndx, 1);
    }
}

Array.prototype.delete = function <T>(lambda: indexedPredicate<T>) {
    const ndx = this.indexOfFirst(lambda);
    if (ndx >= 0) {
        this.splice(ndx, 1);
    }
}

Array.prototype.single = function () {
    if (this.length === 1) {
        return this[0];
    } else {
        if (this.length === 0) {
            throw 'Collection has no items.';
        } else {
            throw 'Collection has more than one item.';
        }
    }
}

Array.prototype.singleOrDefault = function () {
    if (this.length == 0) {
        return null;
    } else if (this.length == 1) {
        return this[0];
    } else {
        throw 'Collection has more than one item.';
    }
}

Array.prototype.first = function <T>(lambda?: indexedPredicate<T>): T {
    if (!lambda && this.length > 0) {
        return this[0];
    }

    var result = null;
    var n = 0;
    while (result === null && n < this.length) {
        const item = this[n];
        if (lambda(item, n)) {
            result = item;
        }
        n++;
    }
    return result;
}

Array.prototype.firstOrDefault = function <T>(lambda?: indexedPredicate<T>): T {
    if (this.length == 0)
        return null;

    return this.first(lambda);
}

Array.prototype.indexOfFirst = function <T>(lambda?: indexedPredicate<T>): number {
    var result = -1;
    var n = 0;
    while (result < 0 && n < this.length) {
        if (lambda(this[n], n)) {
            result = n;
        }
        n++;
    }
    return result;
}

Array.prototype.any = function <T>(lambda?: indexedPredicate<any>): boolean {
    return this.first(lambda) != null;
}

Array.prototype.select = function <T, TR>(lambda?: (item: T, index?: number) => TR): TR[] {
    const result: TR[] = [];
    for (let n = 0; n < this.length; n++) {
        const item = this[n];
        const transformed = lambda(item, n);
        result.push(transformed);
    }
    return result;
}

Array.prototype.where = function <T>(lambda: indexedPredicate<T>): Array<T> {
    const result = [];
    for (let n = 0; n < this.length; n++) {
        if (lambda(this[n], n)) {
            result.push(this[n]);
        }
    }
    return result;
}

Array.prototype.distinct = function (lambda?: (a, b) => boolean) {
    var result = [];
    var predicate: predicate<any>;

    if (lambda) {
        predicate = y => !result.any(x => lambda(x, y));
    } else {
        predicate = i => result.indexOf(i) < 0;
    }

    for (let p of this) {
        if (predicate(p)) {
            result.push(p);
        }
    }

    return result;
}

Array.prototype.count = function <T>(lambda?: indexedPredicate<T>): number {
    if (!lambda) return this.length;
    return this.where(lambda).length;
}

Array.prototype.aggregate = function <R>(lambda: (agg: R, elem: any) => R, aggregate: R = null) {
    for (var i of this) {
        aggregate = lambda(aggregate, i);
    }
    return aggregate;
}

Array.prototype.sum = function <R>(lambda?: (elem: any) => R): R {
    if (!lambda) lambda = elem => elem;

    var sum: R = null;
    for (var i of this) {
        if (sum == null) {
            sum = lambda(i);
        } else {
            sum = (<any>sum) + lambda(i);
        }
    }

    return sum;
}

Array.prototype.singleJoin = function <R, K, O>(otherArray: Array<R>, selfKeyLambda: (any) => K, otherKeyLambda: (R) => K, pairMap: (any, R) => O): Array<O> {
    //Generate list for looking up right elements by keys. This ensures that otherKeyLambda is only
    //called only otherArray.length times at a slight memory cost
    var rightKeyMappings = new Array<KeyValuePair<K, R>>();
    for (var rightElem of otherArray) {
        rightKeyMappings.push({
            key: otherKeyLambda(rightElem),
            value: rightElem
        });
    }

    //For each element of this, join with the first match in the other array
    var results = new Array<O>();
    for (var leftElem of this) {
        var key = selfKeyLambda(leftElem);
        var rightElem = rightKeyMappings.first(pair => pair.key == key).value;
        var result = pairMap(leftElem, rightElem);
        results.push(result);
    }

    return results;
}

Array.prototype.last = function <T>(lambda?: indexedPredicate<T>): T {
    if (!lambda && this.length > 0) {
        return this[this.length - 1];
    }

    var result = null;
    var n = this.length - 1;
    while (result === null && n >= 0) {
        const item = this[n];
        if (lambda(item, n)) {
            result = item;
        }
        n--;
    }
    return result;
}