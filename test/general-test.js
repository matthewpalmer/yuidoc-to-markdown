// Core
var fs = require('fs'),
    assert = require('assert');

var CONSTANTS = {
  testCases: __dirname + '/test-cases/'
};

var General = require('../general');

var gen = new General();

describe('General', function() {

  it('should get one block comment from a string', function() {
    // The sample contents
    // /test/test-cases/general-GetBlockComment.js
    var s = fs.readFileSync(CONSTANTS.testCases + 'general-GetOneBlockComment.js',
                            'utf8');

    // The expected response
    var e = '/**\n'+' * This is a comment that should be gotten\n'+' */';

    assert.equal(gen.getOneBlockComment(s), e);
  });

  it('should get multiple block comments from a string', function() {
    // Get the contents of the case file
    var sm = fs.readFileSync(CONSTANTS.testCases + 'general-GetMultipleBlockComments.js',
                            'utf8');

    // Convert each of them to strings to allow for
    // comparison of reference objects

    // Parse for multiple block comments, actual response
    var am = gen.getMultipleBlockComments(sm) + '';
    // The expected response
    var em = [ '/**\n * 1. This is a comment that should be gotten\n */',
  '/**\n       *  2. Apples are red\n       */',
  '/**\n * 3. Oranges are orange\n */' ] + '';
    assert.equal(am, em);
  });

  it('should strip asterix from string', function() {
    var as = '* @param  {String} comment The comment string';
    // Note: starting space left in place
    var ex = ' @param  {String} comment The comment string';
    assert.equal(gen.stripAsterix(as), ex);
  });

  it('should strip comment markers', function() {
    var cm = '/**'+
 '* [stripComment description] strips the starting and ending comment markers'+
 '* @param  {String} comment A comment string' +
 '* @return {String}         The comment string without the comment markers' +
 '*/';
    var em = '* [stripComment description] strips the starting and ending comment markers'+
 '* @param  {String} comment A comment string' +
 '* @return {String}         The comment string without the comment markers';
    assert.equal(gen.stripComment(cm), em);
  });

  it('should strip starting spaces', function() {
    var ss = ' @param  {String} comment A comment string';
    var es = '@param  {String} comment A comment string';
    assert.equal(gen.stripStartingSpace(ss), es);
  });

});