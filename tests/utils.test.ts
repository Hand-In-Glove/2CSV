import { normalizeArray, normalizeObject } from '../src/utils';

describe('normalizeObject', () => {
    const toTest = { first: "first", second: { second: "second"}, third: { third: { third: "third"}}};
    const result = normalizeObject(toTest);
    it('should return an object with no nested objects or arrays', () => {
        Object.values(result).map(value => {
            expect( typeof value).not.toBe('object');
        })
    });

    it('should flatten nested field names with an underscore', () => {
        expect(result.hasOwnProperty('first')).toBe(true);
        expect(result.hasOwnProperty('second_second')).toBe(true);
        expect(result.hasOwnProperty('third_third_third')).toBe(true);
    }) 
});

describe('normalizeArray', () => {
    const toTest = ["one", ["two", ["three"]]];
    const result = normalizeArray(toTest, 'test');
    it('should return an object with no nested objects or arrays', () => {
        Object.values(result).map(value => {
            expect( typeof value).not.toBe('object');
        })
    });

    it('should flatten nested field names with an underscore', () => {
        expect(result.hasOwnProperty('test_0')).toBe(true);
        expect(result.hasOwnProperty('test_1_0')).toBe(true);
        expect(result.hasOwnProperty('test_1_1_0')).toBe(true);
    }) 
});