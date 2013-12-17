// Core
var fs = require('fs'),
    assert = require('assert');

var CONSTANTS = {
  testCases: __dirname + '/test-cases/'
};

/**
 * Test ParseClass
 */
// Set up a ParseClass instance
//
/*


TODO: Add tests for multiple line descriptions


 */
//
var ParseClass = require('../parseClass');
var pc = new ParseClass();

// Get the contents of the files to be compared
var classJSContents = fs.readFileSync(CONSTANTS.testCases + 'classblock.js',
                                     'utf8');
var classMDContents = fs.readFileSync(CONSTANTS.testCases + 'classblock.md',
                                      'utf8');

// Parse the js file
var parsedJSComments = pc.parseClassComment(classJSContents);

// These tests should be more unit-y
describe('ParseClass', function() {
  it('should parse js CLASS comments to md', function() {
    assert.equal(parsedJSComments, classMDContents);
  });
});
