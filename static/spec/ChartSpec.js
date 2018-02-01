/**
 * @Author: David Haas
 * @Date: 22.01.2018
 */

var a = {
    1: 'string1',
    2: 'string2'
}

describe("concatenateNumber", function () {
      it("concatenates 2 Numbers", function () {
          expect((concatenateNumber(2,3))).toEqual(23);
      });
      it("returns a Number", function () {
          expect(concatenateNumber(2,3)).toEqual(jasmine.any(Number));
      });
  });

  describe("getNumberOfDigits", function () {
      it("calculates the number of digits", function () {
          expect(getNumberOfDigits(122)).toEqual(3);
      });
      it("returns a Number", function () {
          expect(getNumberOfDigits(132)).toEqual(jasmine.any(Number));
      });
  });

  describe("replaceSelectText", function () {
      it("replaces the part before : with the string of an object at the index found for that part", function () {
          expect(replaceSelectText('1: 200', a)).toEqual('string1: 200');
      });
      it("returns a string", function () {
          expect(replaceSelectText('1: 200', a)).toEqual(jasmine.any(String));
      });
      it("returns the same string if the index isn't found in the object", function () {
          expect(replaceSelectText('3: 200',a)).toEqual('3: 200');
      });
  });

