// Core
var domain = require('domain'),
    fs = require('fs');

// User
var YTM = require('../index');

// Set up the parser
var ytm = new YTM();

// Set up options
var opts = {
  testCases: __dirname + '/test-cases/'
};

// Set up constants
var CONSTANTS = {
  DOTJSREGEX: /\.js$/g,
  DOTMDREGEX: /\.md$/g
};

// Set up error handling
var d = domain.create();

d.on('error', function(err) {
  console.error(err);
});

function main() {
  fs.readdir(opts.testCases, readFilesList);

}

function readFilesList(err, list) {
  if (err) throw err;
  list.forEach(openFile);
}

/**
 * Get the javascript test case file, parse it
 * and compare it to the corresponding markdown file.
 */

function openFile(fileName) {
  // Match regexes to filenames
  var isDotJs = CONSTANTS.DOTJSREGEX.exec(fileName);
  var isDotMd = CONSTANTS.DOTMDREGEX.exec(fileName);

  if (isDotJs && !isDotMd) {
    // Read javascript file
    fs.readFile(opts.testCases + fileName, 'utf8', function(err, data) {
      // parse the JS from the file to markdown
      parseJSFile(err, data, function(err, parsedData) {
        // Change .js extension to .md
        var correspondingMDFileName = fileName
                                      .replace(CONSTANTS.DOTJSREGEX, '.md');
        // Read the markdown file
        fs.readFile(opts.testCases + correspondingMDFileName, 'utf8',
                    function(err, data) {
                      compareFiles(err, data, parsedData);
                    });
      });
    });
  } else if (isDotMd && !isDotJs) {
    // fs.readFile(opts.testCases + fileName, 'utf8', parseMDFile);
  } else {
    // console.log('Did not match either .js or .md: ' + fileName);
  }

}

/**
 * Compare the expected markdown to the parsed javascript
 */

function compareFiles(err, mdData, parsedData) {
  console.log('\n\nmddata\n' + mdData);
  console.log('\n\nparseddata\n' + parsedData);
}

/**
 * Parse comments
 */

function parseJSFile(err, data, callback) {
  if (err) throw err;
  callback(err, data);
}

/**
 * Doesn't do anything.
 */

function parseMDFile(err, data) {
  // console.log(err, data);
}

// Run the main function, handling errors with domains
d.run(main);