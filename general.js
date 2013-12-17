/**
 * General provides a set of methods that are used by all of the functions
 */
function General() {
  this.CONSTANTS = {
    oneCommentRegex: (/\/\*\*(.|\n)+?\*\//),
    multipleCommentRegex: (/\/\*\*(.|\n)+?\*\//g)
  };
}

/*

Perhaps this could be refactored to a fs-oriented module and a comment-ori
ented module to make things easier?


 */

/**
 * getOneBlockComment gets a comment from a whole string of javascript
 * @param  {String} fileContents The contents of a js file
 * @return {String}              The contents of the comment
 */
General.prototype.getOneBlockComment = function(fileContents) {
  // Match ONE block comment from the string.
  // The first item in the array from .match()
  // is the first comment
  return fileContents.match(this.CONSTANTS.multipleCommentRegex)[0];
};

/**
 * getMultipleBlockComments get many block comments from javascript
 * @param  {String} fileContents A string of Javascript
 * @return {Array}              An array of matching comments
 */
General.prototype.getMultipleBlockComments = function(fileContents) {
  return fileContents.match(this.CONSTANTS.multipleCommentRegex);
};

/**
 * [stripAsterix description] strips the asterix and the starting space from comments
 * @param  {String} comment The comment string
 * @return {String}              The comment string without asterixes and starting spaces
 */
General.prototype.stripAsterix = function(comment) {
  // Remove the asterixes and the starting space
  comment = comment.replace(/\*/g, '');
  return comment;
};

/**
 * [stripStartingSpace description] strips spaces that appear at the start of a line
 * @param  {String} comment A comment string
 * @return {String}         A comment string without any beginning spaces
 */
General.prototype.stripStartingSpace = function(comment) {
  comment = comment.replace(/^\ /g, '');
  return comment;
};

/**
 * [stripComment description] strips the starting and ending comment markers
 * @param  {String} comment A comment string
 * @return {String}         The comment string without the comment markers
 */
General.prototype.stripComment = function(comment) {
  // Remove the starting comment marker
  comment = comment.replace(/^\/\*\*/, '');
  // Remove the ending comment marker
  comment = comment.replace(/\*\/$/g, '');

  // I don't know why I have to do this twice but I do.
  comment = comment.replace(/^\//g, '');
  comment = comment.replace(/\/$/g, '');

  return comment;
};

module.exports = General;