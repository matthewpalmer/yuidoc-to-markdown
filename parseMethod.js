var General = require('./general');

var gen = new General();

// Refactor these into an init() method?
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
    paramType: /\{([^)]+)\}/,
    paramName: /\ ([^)]+)\ /
  };
}

ParseMethod.prototype.methodName = function() {
  for (var i = 0; i < this.arrayOfLines.length; i++) {
   if (this.arrayOfLines[i].match(this.REGEXES.methodName)) {
      var methodName = this.arrayOfLines[i].replace(this.REGEXES.methodName, '');
      // We have to strip the starting space again.
      methodName = gen.stripStartingSpace(methodName);
      return methodName;
    }
  }
  return "No methodName found";
};

/**
 * [params description] Makes an array of all of the parameters to a function
 * @return {Array} The array of the parameters
 *                       name: , type: , description: ,
 */
ParseMethod.prototype.params = function() {
  var arrayOfParamLines = [];
  for (var i = 0; i < this.arrayOfLines.length; i++) {
      if (this.arrayOfLines[i].match(this.REGEXES.param)) {
        var wholeLine = this.arrayOfLines[i].replace(this.REGEXES.param, '');
        var paramType = wholeLine.match(this.REGEXES.paramType)[1];

        /*

            The next two variables should be done in a much more robust way

         */
        // Could probably be replaced with a regex to be more sturdy
        var paramName = wholeLine.split(' ')[2];
        // Get all the text from after the parameter name
        // Will this break when the description goes for multiple lines
        var paramDescr = wholeLine.split(' ').slice(3).join(' ');

        // Form our object to be added to the array
        var ob = {
          name: paramName,
          type: paramType,
          description: paramDescr
        };

        arrayOfParamLines.push(ob);
      }
  }

  return arrayOfParamLines;
};

ParseMethod.prototype.description = function() {
  var arrayOfDescrLines = [];
 /* for (var i = 0; i < this.arrayOfLines.length; i++) {
      if (this.arrayOfLines[i].match(this.REGEXES.param)) {
        var wholeLine = this.arrayOfLines[i].replace(this.REGEXES.param, '');
        var paramType = wholeLine.match(this.REGEXES.paramType)[1];

        /*

            The next two variables should be done in a much more robust way


        // Could probably be replaced with a regex to be more sturdy
        var paramName = wholeLine.split(' ')[2];
        // Get all the text from after the parameter name
        // Will this break when the description goes for multiple lines
        var paramDescr = wholeLine.split(' ').slice(3).join(' ');

        // Form our object to be added to the array
        var ob = {
          name: paramName,
          type: paramType,
          description: paramDescr
        };

        arrayOfParamLines.push(ob);
      }*/
  }
};

module.exports = ParseMethod;