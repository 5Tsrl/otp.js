'use strict';

var utils = require('./utils');
/*var log = require('./log')('localization');*/
var jed = require('jed');
var Handlebars = require('handlebars');

var language = utils.detectLanguage();

var loadLanguage = function(language) {
    var wanted = "otpjs/lib/locale/" + language + ".json";
    console.log("Detected language: %s", language);
    console.log("Loading: %s", wanted);

    var jedOptions;
    if (language == "en") {
        jedOptions = {};
    } else {
        jedOptions = require(wanted);
        jedOptions.debug = true;
    }
    return jedOptions;
};
var jedOptions = loadLanguage(language);
var info = new jed.Jed(jedOptions);

//This is now handled by localization framework
//TODO: check how it works during language switching
function getOrdinalNumber(n) {
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
}

var absoluteDirectionStrings = {
    // note: keep these lower case (and uppercase via template / code if needed)
    /// TRANSLATORS: Start on [street name] heading [Absolute direction] used in travel plan generation
    'NORTH': info.gettext('north'),
    /// TRANSLATORS: Start on [street name] heading [Absolute direction] used in travel plan generation
    'NORTHEAST': info.gettext('northeast'),
    /// TRANSLATORS: Start on [street name] heading [Absolute direction] used in travel plan generation
    'EAST': info.gettext('east'),
    /// TRANSLATORS: Start on [street name] heading [Absolute direction] used in travel plan generation
    'SOUTHEAST': info.gettext('southeast'),
    /// TRANSLATORS: Start on [street name] heading [Absolute direction] used in travel plan generation
    'SOUTH': info.gettext('south'),
    /// TRANSLATORS: Start on [street name] heading [Absolute direction] used in travel plan generation
    'SOUTHWEST': info.gettext('southwest'),
    /// TRANSLATORS: Start on [street name] heading [Absolute direction] used in travel plan generation
    'WEST': info.gettext('west'),
    /// TRANSLATORS: Start on [street name] heading [Absolute direction] used in travel plan generation
    'NORTHWEST': info.gettext('northwest'),
};

var relativeDirectionStrings = {
    // note: keep these lower case (and uppercase via template / code if needed)
    //TRANSLATORS: Take roundabout [clockwise] to [ordinal exit number] on
    //streetname...
    'CIRCLE_CLOCKWISE': info.gettext('clockwise'),
    //TRANSLATORS: Take roundabout [counter clockwise] to [ordinal exit number] on streetname...
    'CIRCLE_COUNTERCLOCKWISE': info.gettext('counter clockwise'),
    //TRANSLATORS: depart at street name/corner of x y etc. (First instruction in
    //itinerary)
    'DEPART': info.pgettext("itinerary", "depart"),
    //TRANSLATORS: [Relative direction (Hard/Slightly Left/Right...)] to continue
    //on /on to [streetname]
    'HARD_LEFT': info.gettext("hard left"),
    'LEFT': info.gettext("left"),
    'SLIGHTLY_LEFT': info.gettext("slight left"),
    'CONTINUE': info.gettext("continue"),
    'SLIGHTLY_RIGHT': info.gettext("slight right"),
    'RIGHT': info.gettext("right"),
    'HARD_RIGHT': info.gettext("hard right"),
    // rather than just being a direction, this should be
    // full-fledged to take just the exit name at the end
    'ELEVATOR': info.gettext("elevator"),
    'UTURN_LEFT': info.gettext("U-turn left"),
    'UTURN_RIGHT': info.gettext("U-turn right")
};

//Localizes relativeDirection, absoluteDirection
//And exit if current step is roundabout
info.localizeStep = function(step) {
    var absoluteDir = step.absoluteDirection;
    if (absoluteDir in absoluteDirectionStrings) {
        step.localAbsoluteDirection = absoluteDirectionStrings[absoluteDir].toUpperCase();
    } else {
        step.localAbsoluteDirection = absoluteDir;
        console.error("Missing translation for absolute direction:", absoluteDir);
    }
    var relativeDir = step.relativeDirection;
    if (relativeDir in relativeDirectionStrings) {
        step.localRelativeDirection = relativeDirectionStrings[relativeDir].toUpperCase();
    } else {
        step.localRelativeDirection = relativeDir;
        console.error("Missing translation for relative direction:", relativeDir);
    }
    var exit = step.exit;
    //If exit exists and current step is roundabout
    if ((exit !== null && exit !== undefined) && (relativeDir == "CIRCLE_COUNTERCLOCKWISE" ||
                 relativeDir == "CIRCLE_CLOCKWISE")) {
        step.localExit = getOrdinalNumber(Number(exit));
    }
    return step;
};

module.exports = info;

//TODO: this probably doesn't work if language wasn't found
//Gets currently loaded language from Jed options
module.exports.current_language = info.options.locale_data.messages[""].lang;

/*console.log("Info:", info);*/

Handlebars.registerHelper('_', function (key, options) {
	console.debug('Entering nls/_', key, options);
	var out = info.translate(key).fetch(options.hash);
        /*console.debug('translation:', out);*/
	return out;
});

Handlebars.registerHelper('__pgettext', function (context, key) {
	console.debug('Entering nls/_pg',context, key);
	var out = info.translate(key).withContext(context).fetch();
	//console.debug('translation:', out);
	return out;
});

