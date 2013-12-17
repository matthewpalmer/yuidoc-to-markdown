var General = require('./general');

var gen = new General();

/**
 * ParseClass is used to parse YUIDoc comments relating to Classes.
 * For example (not escaped in practice):
 *   /**
    * This is the description for my class.
    *
    * @class MyClass
    * @constructor
    *\/

    Becomes:
      ```
      # MyClass

      __Constructor__

      This is a description for my class.
      ````
 */

function ParseClass() {
  this.CONSTANTS = {
    oneCommentRegex: (/\/\*\*(.|\n)+?\*\//),
    multipleCommentRegex: (/\/\*\*(.|\n)+?\*\//g),
    classRegex: (/^@class/gi),
    constructorRegex: (/^@constructor/gi),
    descriptionRegex: (/^./gi),
  };

  // A dictionary of the markdown associated with the properties
  this.declarationSyntax = {
    classMd: '#',
    constructorMd: '__', // Will need to be added twice eg. __WORD__
  };

  // We build this up to eventually be written to file
  this.mdComponents = {
    className: '',
    constructorName: '',
    description: ''
  };
}

/**
 * parseClassComment parses the @class descriptions for a file
 * @param  {String} data A string containing the entire file's contents
 * @return {String}      A markdown-ified string of the file's comments
 */

ParseClass.prototype.parseClassComment = function(data) {
  // Strip extraneous data
  data = gen.stripAsterix(data);
  data = gen.stripComment(data);
  data = gen.stripStartingSpace(data);

  var arrayOfLines = data.split('\n');


  // Good point for optimisation
  // This could possibly get unruly with if/elses
  // Refactor?
  for (var i = 0; i < arrayOfLines.length; i++) {
    // I'm not sure why this has to be done twice
    arrayOfLines[i] = gen.stripStartingSpace(arrayOfLines[i]);

    // Do I want to get rid of the newlines/empty array items?

    if (arrayOfLines[i].match(this.CONSTANTS.classRegex)) {
      // The line was a @class declaration

      var className = arrayOfLines[i].replace(this.CONSTANTS.classRegex, '');

      this.formComponents('class', className);


    } else if (arrayOfLines[i].match(this.CONSTANTS.constructorRegex)) {
      // The line was a @constructor declaration

      var constructorName = 'Constructor';
      this.formComponents('constructor', constructorName);

    } else if (arrayOfLines[i].match(this.CONSTANTS.descriptionRegex)) {
      // Description
      this.formComponents('description', arrayOfLines[i]);
    }
  }

  var mds = this.composeMd(this.mdComponents);
  return mds;
};

/**
 * [formComponents description] forms an object to be used to write markdwon
 * @param  {String} type    The type of line [class|constructor|description]
 * @param  {String} content The content to be written to the dictionary
 * @return {[type]}         [description]
 */

// Should I be writing to the `this` up in the main function?
ParseClass.prototype.formComponents = function(type, content) {
  if (type == 'class' || type == 'constructor' || type == 'description') {

    // Was of valid type
    if (type == 'class') {
      this.mdComponents.className = content;
    } else if (type == 'description') {
      // POSSIBLE ERROR POINT IF
      // We have to append for description because it can be multi-line
      this.mdComponents.description = content;
    } else if (type == 'constructor') {
      this.mdComponents.constructorName = content;
    } else {
      console.error('No types correct');
    }


  } else {
    // Invalid type
    console.error('Err: Invalid type to addMarkdown(): ' + type);
  }
};

/**
 * [composeMd description] creates a markdown string
 * @param  {Object} dict The object from which we get our content.
                          className: '',
                          constructorName: '',
                          description: ''

 * @return {String}      A string formed from the dict with markdown syntax
 */
ParseClass.prototype.composeMd = function(dict) {
  var wMd = ''; // Working markdown string
  // Add the class name first
  wMd = wMd + this.declarationSyntax.classMd + dict.className + '\n';

  // Then add constructor
  wMd = wMd + '\n' + this.declarationSyntax.constructorMd +
            dict.constructorName + this.declarationSyntax.constructorMd + '\n';

  // Finally, add the description
  wMd = wMd + '\n' + dict.description;

  return wMd;
};


module.exports = ParseClass;