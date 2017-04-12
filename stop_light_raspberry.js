
import RPi.GPIO as GPIO
import time

led = 11

GPIO.setmode(GPIO.BOARD)
GPIO.setup(led, GPIO.OUT)
GPIO.output(led, GPIO.HIGH)
time.sleep(2)
GPIO.output(led, GPIO.LOW)



npm install --save rpio sleep



{
  "name": "lights",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "bluebird": "^3.4.7",
    "dotenv": "^4.0.0",
    "rpio": "^0.9.15",
    "sentiment": "^3.0.0",
    "sleep": "^5.1.0",
    "twitter": "^1.7.0"
  }
}





require('dotenv').config();
const Twitter = require('twitter');
const sentiment = require('sentiment');
const rpio = require('rpio');
const Promise = require('bluebird');

function delay(ms) {
  var deferred = Promise.pending();
  setTimeout(function() { deferred.resolve(); }, ms);
  return deferred.promise;
}

const red = 15;
const green = 11;
rpio.open(red, rpio.OUTPUT, rpio.LOW);
rpio.open(green, rpio.OUTPUT, rpio.LOW);

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var tweets = [];
var busy = false;

client.stream('statuses/filter', {track: 'donald trump'}, function(stream) {
  stream.on('data', function(event) {
    //    console.log(event && event.text);
    if (event) {
      tweets.push(event.text);
      if (tweets.length > 5 && !busy) {
        busy = true;
        var avg = tweets.reduce((acc, tweet) => {
           return acc + sentiment(tweet).score;
        }, 0) / tweets.length;
        console.log("Sentiment: ", avg);
        console.log(JSON.stringify(tweets));
        var pin = red;
        if (avg >= 0) {
          pin = green;
        }
        tweets = [];
        rpio.open(pin, rpio.OUTPUT, rpio.HIGH);
        delay(2000)
          .then(() => {
            rpio.open(pin, rpio.OUTPUT, rpio.LOW);
            return delay(500);
          })
          .then(() => busy = false);
      }
    }
  });

  stream.on('error', function(error) {
    throw error;
  });
});





const rpio = require('rpio');
const sleep = require("sleep").msleep;
const Promise = require('bluebird');


function delay(ms) {
  var deferred = Promise.pending();
  setTimeout(function() { deferred.resolve(); }, ms);
  return deferred.promise;
}

const red = 11;
const yellow = 13;
const green = 15;

rpio.open(red, rpio.OUTPUT, rpio.LOW);
rpio.open(yellow, rpio.OUTPUT, rpio.LOW);
rpio.open(green, rpio.OUTPUT, rpio.LOW);

rpio.write(red, rpio.HIGH);

console.log("STOP!");
delay(8000)
  .then(() => {
    rpio.write(red, rpio.LOW);
    rpio.write(green, rpio.HIGH);
    console.log("GO!");
    return delay(8000);
  })
  .then(() => {
    rpio.write(green, rpio.LOW);
    rpio.write(yellow, rpio.HIGH);
    console.log("CAUTION!");
    return delay(2000);
  })
  .then(() => {
    rpio.write(yellow, rpio.LOW);
    rpio.write(red, rpio.HIGH);
    console.log("STOP");
    return delay(8000);
  })
  .then(() => {
    rpio.write(red, rpio.LOW)
    return delay(100);
   })
  .then(() => console.log("DONE!"))
  .catch((e) => {
    console.log(e);
  });
