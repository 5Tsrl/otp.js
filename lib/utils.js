'use strict'

var L = window.L
var moment = window.moment

module.exports.filterParams = function filterParams (data) {
  var filtered = {}
  for (var k in data) {
    var val = data[k]
    if (val !== null && val !== undefined) filtered[k] = val
  }
  return filtered
}

function decodePolyline (polyline) {
  var currentPosition = 0

  var currentLat = 0
  var currentLng = 0

  var dataLength = polyline.length

  var polylineLatLngs = []

  while (currentPosition < dataLength) {
    var shift = 0
    var result = 0

    var byte

    do {
      byte = polyline.charCodeAt(currentPosition++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)

    var deltaLat = ((result & 1) ? ~(result >> 1) : (result >> 1))
    currentLat += deltaLat

    shift = 0
    result = 0

    do {
      byte = polyline.charCodeAt(currentPosition++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)

    var deltLng = ((result & 1) ? ~(result >> 1) : (result >> 1))

    currentLng += deltLng

    polylineLatLngs.push(new L.LatLng(currentLat * 0.00001, currentLng * 0.00001))
  }

  return polylineLatLngs
}

module.exports.decodePolyline = decodePolyline

var formatTime = function (time, format, offsetHrs) {
  format = format || 'h:mma'
  var m = moment(time)
  if (offsetHrs) m = m.add('hours', offsetHrs)
  if (!today(m)) format = 'MMM Do h:mma'
  return m.format(format)
}

function today (m) {
  var n = moment()
  return n.date() === m.date() && n.month() === m.month() && n.year() === m.year()
}

module.exports.formatTime = formatTime

var secToHrMin = function (sec) {
  var hrs = Math.floor(sec / 3600)
  var mins = Math.floor(sec / 60) % 60

  var str

  // TODO: localization
  if (hrs === 0 && mins < 1) {
    str = '<1 min'
  } else {
    str = (hrs > 0 ? (hrs + ' hr, ') : '') + mins + ' min'
  }

  return str
}

module.exports.secToHrMin = secToHrMin

var msToHrMin = function (ms) {
  var hrs = Math.floor(ms / 3600000)
  var mins = Math.floor(ms / 60000) % 60

  var str

  // TODO: localization
  if (hrs === 0 && mins < 1) {
    str = '<1 min'
  } else {
    str = (hrs > 0 ? (hrs + ' hr, ') : '') + mins + ' min'
  }

  return str
}

module.exports.msToHrMin = msToHrMin

var distanceStringImperial = function (m) {
  var ft = m * 3.28084
  if (ft < 528) return Math.round(ft) + ' feet'
  return Math.round(ft / 528) / 10 + ' miles'
}

var distanceStringMetric = function (m) {
  var km = m / 1000
  if (km > 100) {
    // 100 km => 999999999 km
    km = km.toFixed(0)
    return km + ' km'
  } else if (km > 1) {
    // 1.1 km => 99.9 km
    km = km.toFixed(1)
    return km + ' km'
  } else {
    // 1m => 999m
    m = m.toFixed(0)
    return m + ' m'
  }
<<<<<<< HEAD
}

var distanceString = function (m, metric) {
  return (metric === true) ? distanceStringMetric(m) : distanceStringImperial(m)
}

module.exports.distanceString = distanceString
=======
};

var distanceString = function(m, metric) {
  return (metric === true) ? distanceStringMetric(m) : distanceStringImperial(
    m);
};

module.exports.distanceString = distanceString;

//Cookies functions from http://www.quirksmode.org/js/cookies.html
var createCookie = function(name,value,days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    expires = "; expires="+date.toGMTString();
  }
  document.cookie = name+"="+value+expires+"; path=/";
};

var readCookie = function(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
};

var eraseCookie = function(name) {
  createCookie(name,"",-1);
};

var detectLanguage = function() {
  var detectLanguage = undefined;


  if (typeof window !== 'undefined') {
    var qsParams = qs.parse(window.location.search);
    console.log("Reading language from params:", window.location.search, qsParams);
    if (qsParams[window.OTP_config.langQS]) {
      detectLanguage = qsParams[window.OTP_config.langQS];
      console.log("Param language:", detectLanguage);
    }
  }

  //User wanted language isn't among languages we support
  if (!_.has(window.OTP_config.availible_languages, detectLanguage)) {
    detectLanguage = undefined;
  }

  if (!detectLanguage && typeof document !== 'undefined') {
    console.log("Reading language from cookie");
    var cookieValue = readCookie(window.OTP_config.cookieName);
    if (cookieValue) {
      console.log("Got cookie: ", cookieValue);
      detectLanguage = cookieValue;
      //User wanted language isn't among languages we support
      if (!_.has(window.OTP_config.availible_languages, detectLanguage)) {
        detectLanguage = undefined;
        eraseCookie(window.OTP_config.cookieName);
      }
    }
  }

  if (!detectLanguage && typeof navigator !== 'undefined') {

    //Chooses among the wanted user language according to user preferences
    if (navigator.languages) {
      console.log("Navigator languages:", navigator.languages);
      //returns first language that user wants that is availible
      detectLanguage = _.find(navigator.languages, function getLang(ilang) {
        console.log("currentLang", ilang, window.OTP_config.availible_languages);
        return _.has(window.OTP_config.availible_languages, ilang);
      });
    } else {
      detectLanguage = (navigator.language || navigator.userLanguage);
    }
  }
  console.log("DetectedLanguage:", detectLanguage);
  //Language wasn't found by any means - usually shouldn't happen
  if (detectLanguage === undefined) {
    console.log("Setting default language");
    return "en";
  //Language was found but we don't necessary have the translation
  } else {
      //User wanted language isn't among languages we support
      if (!_.has(window.OTP_config.availible_languages, detectLanguage)) {
        console.log("Wanted language isn't found:", detectLanguage);
        detectLanguage = "en";
        return detectLanguage;
      }
    console.log("Saving wanted language in a cookie:", detectLanguage);
    //Save wanted language in a cookie for 30 days
    createCookie(window.OTP_config.cookieName, detectLanguage, 30);
  }
  return detectLanguage;
};

module.exports.detectLanguage = detectLanguage;
>>>>>>> Added full language detection
