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
    returnItem: (/^@return/gi),
    paramType: /\{([^)]+)\}/,
    paramName: /\ ([^)]+)\ /,
    descr: (/^(?!\@).+/)
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

/**
 * [description description] returns a description of the method
 * @return {String} The description of the method
 */
ParseMethod.prototype.description = function() {
  var desc = '';
  for (var i = 0; i < this.arrayOfLines.length; i++) {
      if (this.arrayOfLines[i].match(this.REGEXES.descr)) {
        var workingString = gen.stripStartingSpace(this.arrayOfLines[i]);

        // Add a space if it's not the last line
        // Not sure if this is working
        if (i != this.arrayOfLines.length - 1) {
          desc = desc + workingString + ' ';
        }


      }
  }

  // Strip trailing space
  desc = gen.stripEndingSpace(desc);
  return desc;
};

ParseMethod.prototype.returnItem = function() {
  for (var i = 0; i < this.arrayOfLines.length; i++) {
   if (this.arrayOfLines[i].match(this.REGEXES.returnItem)) {
      var returnItem = this.arrayOfLines[i].replace(this.REGEXES.returnItem, '');
      // We have to strip the starting space again.
      returnItem = gen.stripStartingSpace(returnItem);

      // Get the description of the return item
      var d = returnItem.replace(this.REGEXES.paramType, '');
      // Strip the starting space
      d = gen.stripStartingSpace(d);
      // Get the type of the return item, strip the curly braces
      var returnType = returnItem.split(' ')[0]
                      .replace(/^\{/g, '')
                      .replace(/\}$/g, '');

      var ob = {
        type: returnType,
        description: d,
      };
      return ob;
    }
  }
  return "No return found";
};



module.exports = ParseMethod;