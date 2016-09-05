/// <reference path="../ts-output/bf-linq.d.ts" />
/// <reference path="../typings/index.d.ts" />

describe('Linq Tests',
    () => {
        interface ITarget {
            id: number;
            name: string;
        }

        var testArray: ITarget[] = [
            { id: 0, name: 'apple' },
            { id: 1, name: 'bananna' },
            { id: 2, name: 'carrot' },
            { id: 3, name: 'date' },
            { id: 4, name: 'egg' },
            { id: 5, name: 'fig' }
        ];

        var testGroupArray: ITarget[] = [
            { id: 0, name: 'apple' },
            { id: 0, name: 'bananna' },
            { id: 0, name: 'orange' },
            { id: 1, name: 'carrot' },
            { id: 1, name: 'squash' },
            { id: 1, name: 'corn' },
            { id: 2, name: 'milk' },
            { id: 2, name: 'cheese' }
        ];

        var testJoinArray: ITarget[] = [
            { id: 0, name: 'fruit' },
            { id: 1, name: 'vegetable' },
            { id: 2, name: 'dairy' }
        ];

        it('Array.remove removes an item.', () => {

            var ta: ITarget[] = [
                { id: 0, name: 'apple' },
                { id: 1, name: 'bananna' },
                { id: 2, name: 'carrot' },
                { id: 3, name: 'date' },
                { id: 4, name: 'egg' },
                { id: 5, name: 'fig' }
            ];

            var toBeRemoved = ta[3];
            ta.remove(toBeRemoved);
            expect(ta.length).toEqual(5);
        });

        it('Array.remove removes the correct item.', () => {

            var ta: ITarget[] = [
                { id: 0, name: 'apple' },
                { id: 1, name: 'bananna' },
                { id: 2, name: 'carrot' },
                { id: 3, name: 'date' },
                { id: 4, name: 'egg' },
                { id: 5, name: 'fig' }
            ];

            var toBeRemoved = ta[3];
            ta.remove(toBeRemoved);
            var ndx = ta.indexOf(toBeRemoved);
            expect(ndx).toEqual(-1);
        });

        it('Array.single returns the record if there is only one.', () => {
            var a: ITarget[] = [
                { id: 0, name: 'apple' }
            ];

            var target = a.single();
            expect(target.id).toEqual(0);
        });

        it('Array.single throws exception if there are no records', () => {
            expect(() => {
                var a: ITarget[] = [];
                // ReSharper disable once UnusedLocals
                var target = a.single();
            }).toThrow('Collection has no items.');
        });

        it('Array.single throws exception if there is more than one record', () => {
            expect(() => {
                // ReSharper disable once UnusedLocals
                var target = testArray.single();
            }).toThrow('Collection has more than one item.');
        });

        it('Array.first returns correct element.', () => {
            var target = testArray.first(x => x.name === 'date');
            expect(target.id).toEqual(3);
        });

        it('Array.singleOrDefault returns the record if there is only one.', () => {
            var a: ITarget[] = [
                { id: 0, name: 'apple' }
            ];
            var target = a.singleOrDefault();
            expect(target.id).toEqual(0);
        });
        it('Array.singleOrDefault returns null if there are no records.', () => {
            var a: ITarget[] = [];
            var target = a.singleOrDefault();
            expect(target).toBeNull();
        });

        it('Array.singleOrDefault throws exception if there is more than one record', () => {
            expect(() => {
                var a: ITarget[] = [
                    { id: 0, name: 'apple' },
                    { id: 1, name: 'bananna' }
                ];
                var target = a.singleOrDefault();
            }).toThrow('Collection has more than one item.');
        });

        it('Array.first returns null when predicate matches nothing.', () => {
            var target = testArray.first(() => false);
            expect(target).toBeNull();
        });

        it('Array.first returns null for an empty array', () => {
            var target = [];
            expect(target.first()).toBeNull();
        });

        it('Array.indexOfFirst returns correct index.', () => {
            var target = testArray.indexOfFirst(x => x.name === 'date');
            expect(target).toEqual(3);
        });

        it('Array.indexOfFirst returns -1 when predicate matches nothing.', () => {
            var target = testArray.indexOfFirst(() => false);
            expect(target).toEqual(-1);
        });

        it('Array.any returns true when predicate matches one element', () => {
            var target = testArray.any(x => x.name === 'date');
            expect(target).toBeTruthy();
        });

        it('Array.any returns true when predicate matches more than one element', () => {
            var target = testArray.any(x => x.name === 'date' || x.name === 'egg');
            expect(target).toBeTruthy();
        });

        it('Array.any returns false when predicate matches zero elements', () => {
            var target = testArray.any(x => false);
            expect(target).toBeFalsy();
        });

        it('Array.select returns an array whose length is equal to the original array.', () => {
            var target = testArray.select(x => x.id) as number[];
            expect(target.length).toEqual(testArray.length);
        });

        it('Array.select returns an array numbers when numbers are selected by the lambda function.', () => {
            var target = testArray.select(x => x.id);
            expect(target[0]).toEqual(jasmine.any(Number));
        });

        it('Array.select returns an array strings when strings are selected by the lambda function.', () => {
            var target = testArray.select(x => x.name);
            expect(target[0]).toEqual(jasmine.any(String));
        });

        it('Array.where returns an array of items specified by a predicate', () => {
            var target = testArray.where(x => x.name[1] === 'a') as any[];
            expect(target.length).toEqual(3);
        });

        it('Array.distinct returns an array of items distinct as specified by a predicate', () => {
            var target = testArray.distinct((a, b) => a.name[1] === b.name[1]) as any[];
            expect(target.length).toEqual(4);
        });

        it('Array.distinct returns an array of distinct items when no predicate is specified', () => {
            var localArray = testArray.slice(0);
            localArray.push(testArray[0]);
            localArray.push(testArray[1]);
            expect(localArray.length).toEqual(8);

            var target = localArray.distinct() as any[];
            expect(target.length).toEqual(6);
        });

        it('Array.count returns the number of items that match a predicate', () => {
            var target = testArray.count(x => x.name[1] === 'a');
            expect(target).toEqual(3);
        });

        it('Array.count returns the length of the array if no predicate is specified', () => {
            var target = testArray.count();
            expect(target).toEqual(6);
        });

        it('Array.aggregate numeric summation works.', () => {
            var summationAggregate = (aggregate: number, t: ITarget) => {
                return aggregate + t.id;
            }
            var target = testArray.aggregate(summationAggregate);
            expect(target).toEqual(15);
        });

        it('Array.aggregate string joining works.', () => {
            var stringJoinAggregate = (aggregate: string, t: ITarget) => {
                if (aggregate == null) return t.name;
                return aggregate + ', ' + t.name;
            }
            var target = testArray.aggregate(stringJoinAggregate);
            expect(target).toEqual('apple, bananna, carrot, date, egg, fig');
        });

        it('Array.aggregate numeric summation with inital aggregate value works', () => {
            var summationAggregate = (aggregate: number, t: ITarget) => {
                return aggregate + t.id;
            }
            var target = testArray.aggregate(summationAggregate, 20);
            expect(target).toEqual(35);
        });

        it('Array.sum adds numeric array without predicate', () => {
            var localTestArray = [0, 1, 2, 3, 4, 5];
            var target = localTestArray.sum();
            expect(target).toEqual(15);
        });

        it('Array.sum adds numeric values with a lambda', () => {
            var getId = (elem: ITarget): number => elem.id;
            var target = testArray.sum(getId);
            expect(target).toEqual(15);
        });

        it('Array.sum adds string values with a lambda', () => {
            var getName = (elem: ITarget): string => elem.name;
            var target = testArray.sum(getName);
            expect(target).toEqual('applebanannacarrotdateeggfig');
        });

        it('Array.singleJoin has correct number of elements on joining larger to smaller', () => {
            var left = testGroupArray;
            var right = testJoinArray;

            var leftKeyLambda = x => x.id;
            var rightKeyLambda = x => x.id;
            var joinLambda = (item, category) => {
                return {
                    item: item.name,
                    category: category.name
                };
            };

            var target = left.singleJoin(right, leftKeyLambda, rightKeyLambda, joinLambda);
            expect(target.count()).toBe(left.length);
        });

        it('Array.singleJoin has correct number of elements on joining smaller to larger', () => {
            var left = testJoinArray;
            var right = testGroupArray;

            var leftKeyLambda = x => x.id;
            var rightKeyLambda = x => x.id;
            var joinLambda = (item, category) => {
                return {
                    item: item.name,
                    category: category.name
                };
            };

            var target = left.singleJoin(right, leftKeyLambda, rightKeyLambda, joinLambda);
            expect(target.count()).toBe(left.length);
        });

        it('Array.singleJoin has correct elements on join', () => {
            var left = testGroupArray;
            var right = testJoinArray;

            var leftKeyLambda = x => x.id;
            var rightKeyLambda = x => x.id;
            var joinLambda = (item, category) => {
                return {
                    item: item.name,
                    category: category.name
                };
            };

            var expected = [
                { item: 'apple', category: 'fruit' },
                { item: 'bananna', category: 'fruit' },
                { item: 'orange', category: 'fruit' },
                { item: 'carrot', category: 'vegetable' },
                { item: 'squash', category: 'vegetable' },
                { item: 'corn', category: 'vegetable' },
                { item: 'milk', category: 'dairy' },
                { item: 'cheese', category: 'dairy' }
            ];

            var target = left.singleJoin(right, leftKeyLambda, rightKeyLambda, joinLambda);
            expect(JSON.stringify(target)).toBe(JSON.stringify(expected));
        });

        it('Array.last returns correct element when given a predicate and the target is the first item.', () => {
            var target = testArray.last(x => x.name === 'apple');
            expect(target.id).toEqual(0);
        });

        it('Array.last returns correct element when given a predicate and the target is in the middle', () => {
            var target = testArray.last(x => x.name === 'date');
            expect(target.id).toEqual(3);
        });

        it('Array.last returns correct element when given a predicate and the target is the last item', () => {
            var target = testArray.last(x => x.name === 'fig');
            expect(target.id).toEqual(5);
        });

        it('Array.last returns correct element when not given a predicate.', () => {
            var target = testArray.last();
            expect(target.id).toEqual(5);
        });

        it('Array.last returns null when predicate matches nothing.', () => {
            var target = testArray.last(() => false);
            expect(target).toBeNull();
        });

        it('Array.last returns null for an empty array', () => {
            var target = [];
            expect(target.last()).toBeNull();
        });
    });
