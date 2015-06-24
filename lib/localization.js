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
