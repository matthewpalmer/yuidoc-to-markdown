var General = require('./general');

var gen = new General();

// Refactor these into an init() method?
function ParseMethod(comment) {

  // Strip extraneous data
  this.comment = gen.stripComment(comment);
  this.comment = gen.stripAsterix(this.comment);
  this.comment = gen.stripStartingSpace(this.comment);
  this.arrayOfLines = this.comment.split('\n');

  this.mdDict = {
    mName: '##',
    mParams: '###',
    pName: '####',
    pType: '`', // Goes on either side `code`
    rType:'###'

  };

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

  this.methodNameString = this.methodName();
  this.paramsArray = this.params();
  this.descriptionString = this.description();
  this.returnItemObj = this.returnItem();
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

/**
 * [returnItem description] parses the return item of a method
 * @return {Object} The object of the return item
 *                               type: returnType,
                          description: d,
 */
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

/*
  this.mdDict = {
    mName: '##',
    mParams: '###',
    pName: '####',
    pType: '`', // Goes on either side eg `code`
    rType:'###'

  };

  parameters
 *                       name: , type: , description: ,
 */

//Should probably refactor to not use `this.X`
/**
 * composeMarkdown creates a markdown string (with md syntax) from a comment
 * @return {String} The Markdown string of the comment
 */
ParseMethod.prototype.composeMarkdown = function() {
  // Working markdown string
  var wMd = '';
  // Add the method name
  wMd = wMd + this.mdDict.mName + ' ' + this.methodNameString + '\n';
  // Add the description
  wMd = wMd + '\n' + this.descriptionString + '\n';
  // Add the parameters
  wMd = wMd + '\n' + this.mdDict.mParams + ' Arguments' + '\n';
  // Could possibly optimise by forming fragments then adding
  for (var i = 0; i < this.paramsArray.length; i++) {
    // Parameter name
    wMd = wMd + '\n' + this.mdDict.pName + ' ' + this.paramsArray[i].name + '\n';
    // Parameter type
    wMd = wMd + '\n' + this.mdDict.pType + this.paramsArray[i].type + this.mdDict.pType + '\n';
    // Paramter description
    wMd = wMd + '\n' + this.paramsArray[i].description + '\n';
  }
  // Return type, description
  wMd = wMd + '\n' + this.mdDict.rType + ' Return' + '\n';
  wMd = wMd + '\n' + this.mdDict.pType + this.returnItemObj.type + this.mdDict.pType + '\n';
  wMd = wMd + '\n' + this.returnItemObj.description + '\n';

  return wMd;
};



module.exports = ParseMethod;