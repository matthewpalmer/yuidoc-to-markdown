var General = require('./general');

var gen = new General();

function ParseMethod(comment) {

  // Strip extraneous data
  this.comment = gen.stripComment(comment);
  this.comment = gen.stripAsterix(this.comment);
  this.comment = gen.stripStartingSpace(this.comment);
  this.arrayOfLines = this.comment.split('\n');

  // Good point for optimisation
  // Refactor?
  for (var i = 0; i < this.arrayOfLines.length; i++) {
    // I'm not sure why this has to be done twice
    this.arrayOfLines[i] = gen.stripStartingSpace(this.arrayOfLines[i]);
  }

  this.REGEXES = {
    methodName: (/^@method/gi),
    param: (/^@param/gi),
    returnItem: (/^@returnItem/gi),
  };
}

ParseMethod.prototype.methodName = function() {
  for (var i = 0; i < this.arrayOfLines.length; i++) {
    if (this.arrayOfLines[i]) {
     if (this.arrayOfLines[i].match(this.REGEXES.methodName)) {
        var methodName = this.arrayOfLines[i].replace(this.REGEXES.methodName, '');
        // We have to strip the starting space again.
        methodName = gen.stripStartingSpace(methodName);
        return methodName;
      }
    }
  }
  return "No methodName found";
};

module.exports = ParseMethod;