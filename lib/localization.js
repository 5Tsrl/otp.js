'use strict';

var utils = require('./utils');
/*var log = require('./log')('localization');*/
var jed = require('jed');
var Handlebars = require('handlebars');

var language = utils.detectLanguage();
var wanted = "otpjs/lib/locale/" + language + ".json";
console.log("Detected language: %s", language);
console.log("Loading: %s", wanted);

var jedOptions = require(wanted);
jedOptions.debug = true;
var info = new jed.Jed(jedOptions);

module.exports = info;

/*console.log("Info:", info);*/

Handlebars.registerHelper('_', function (key) {
	console.debug('Entering nls/_', key);
	var out = info.translate(key).fetch();
        /*console.debug('translation:', out);*/
	return out;
});

Handlebars.registerHelper('__pgettext', function (context, key) {
	console.debug('Entering nls/_pg',context, key);
	var out = info.translate(key).withContext(context).fetch();
	//console.debug('translation:', out);
	return out;
});

//This is now handled by localization framework
//TODO: check how it works during language switching
Handlebars.registerHelper('ordinal', function(n) {
  //TODO: translator comments
  var exits = [
      'empty',
      info.gettext("first"),
      info.gettext("second"),
      info.gettext("third"),
      info.gettext("fourth"),
      info.gettext("fifth"),
      info.gettext("sixth"),
      info.gettext("seventh"),
      info.gettext("eight"),
      info.gettext("ninth"),
      info.gettext("tenth")
  ];

  //return number. for large roundabouts with large number of exits
  if (n > 10 && n < 14) return n + '.';
  //otherwise returns localized exit number
  return exits[n];
});
