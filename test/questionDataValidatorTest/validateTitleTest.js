//validateTitleTest.js

var assert = require('assert');
var validateTitle = require('../../app/data/questionDataValidator').validateTitle;

//arange
var title = "zadatak_1"
var title_2 = "";
var title_3 = 5;

describe('questionValidator', function() {
  describe('#validateTitle()', function() {
    it('should return true if title is valid', function() {
      assert.equal(true, validateTitle(title));
    });
  });

  describe("#validateTitle()", function() {
  	it('should return false on empty string', function() {
  		assert.equal(false, validateTitle(title_2));
  	});
  });

  describe("#validateTitle()", function() {
  	it('should return false on number type', function() {
  		assert.equal(false, validateTitle(title_3));
  	});
  });
});
