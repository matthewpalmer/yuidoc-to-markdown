// Core
var fs = require('fs'),
    assert = require('assert');

var CONSTANTS = {
  testCases: __dirname + '/test-cases/'
};

/**
 * Test ParseMethod
 */

var ParseMethod = require('../parseMethod');


var methodJSFile = fs.readFileSync(CONSTANTS.testCases + 'methodblock.js', 'utf8');
var expectedMdFile = fs.readFileSync(CONSTANTS.testCases + 'methodblock.md', 'utf8');

var pm = new ParseMethod(methodJSFile);

/**
* My method description.  Like other pieces of your comment blocks,
* this can span multiple lines.
*
* @method methodName
* @param {String} foo Argument 1
* @param {Object} config A config object
* @param {String} config.name The name on the config object
* @param {Function} config.callback A callback function on the config object
* @param {Boolean} [extra=false] Do extra, optional work
* @return {Boolean} Returns true on success
*/

describe('ParseMethod', function() {
  it('should parse the methodName', function() {
    var methName = pm.methodName();
    var exp = 'methodName';
    assert.equal(methName, exp);

  });

  it('should parse to an array of parameters', function() {
    // Convert to strings to allow for easier comparison
    var arrayOfParams = pm.params() + '';
    var exp = [
  { name: 'foo',
    type: 'String',
    description: 'Argument 1' },
  { name: 'config',
    type: 'Object',
    description: 'A config object' },
  { name: 'config.name',
    type: 'String',
    description: 'The name on the config object' },
  { name: 'config.callback',
    type: 'Function',
    description: 'A callback function on the config object' },
  { name: '[extra=false]',
    type: 'Boolean',
    description: 'Do extra, optional work' } ] + '';

    assert.equal(arrayOfParams, exp);
  });

  it('should parse the description', function() {

  });

  it('should parse the return item', function() {
    var returnItem = pm.returnItem();
  });
});