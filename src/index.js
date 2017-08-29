/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */
var http = require('http');

////////// CONFIG //////////
// bridgeBasePath must be the root path to a server running an instance of AlexaSoundTouch_RemoteServer
// AlexaSoundTouch_RemoteServer code can be found at https://github.com/zwrose/AlexaSoundTouch_RemoteServer.git
var bridgeBasePath = "http://<your.basepath.here>";
////////////////////////////
// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.

// --------------------------------------
// -- Defines all the language outputs --
// --------------------------------------

var locale = "en"; // Default Locale
var skillResp = { // All Alexa responses from the skill can be found here
  'getWelcomeResponse': {
    'de': "Willkommen zu Bose SoundTouch! Du kannst diesen Skill nutzen um die Wiedergabe zu starten oder pausieren, Musik zu überspringen, die Lautstärke zu regeln oder Wiedergabegruppen zu erstellen. Um zu starten sage etwas wie Spiele Einstellung 1 in meinem Wohnzimmer.",
    'en': "Welcome to Bose SoundTouch! You can use this skill to start playback, create or collapse groups, play, pause, and/or skip your music, or change the volume of your SoundTouch devices. To start the music, say something like, Play preset 4 in the living room."
  },
  'getWelcomeResponseRepromt': {
    'de': "Bitte sag mir was ich tun soll. Du kannst die Wiedergabe starten indem du sagst 'spiele Einstellung 1 im Wohnzimmer'.",
    'en': "Please tell me what I should do. You can start music by saying something like, 'Play preset 4 in the living room.'."
  },
  // -- SkipBackIntent --
  'SkipBackIntent': {
    'de': "Starte Vorheriges Lied.",
    'en': "Skipping back."
  },
  'SkipBackIntentSpeaker': {
    'de': "Vorheriges Lied auf ${speaker}.",
    'en': "Skipping back in the ${speaker}."
  },
  'SkipBackIntentErrorSpeaker': {
    'de': "Lautsprecher ${speaker} ist nicht eingeschaltet. Daher kann ich das vorherige Lied nicht spielen!",
    'en': "${speaker} isn't playing. So I can't skip the track back!"
  },
  'SkipBackIntentErrorPlayback': {
    'de': "Es erfolgt derzeit keine Wiedergabe. Daher kann ich das vorherige Lied nicht spielen.",
    'en': "Nothing is playing. So I can't skip anything!"
  },
  'SkipBackIntentErrorMultipleSpeakers': {
    'de': "Verschiedene Lautsprecher oder Gruppen sind derzeit aktiv. Bitte versuche es erneut und spezifiziere wo du ein Lied zurück möchtest. Sage etwas wie 'Vorheriges Lied im Wohnzimmer'.",
    'en': "Multiple speakers or groups are active. Please try again and specify where you'd like to skip back. Say something like 'Skip back in the living room.'."
  },
  // -- SkipForwardIntent
  'SkipForwardIntent': {
    'de': "Spiele nächstes Lied.",
    'en': "Skipping forward."
  },
  'SkipForwardIntentSpeaker': {
    'de': "Nächstes Lied auf ${speaker}.",
    'en': "Skipping forward in the ${speaker}."
  },
  'SkipForwardIntentErrorSpeaker': {
    'de': "Lautsprecher ${speaker} ist nicht eingeschaltet. Daher kann ich das nächste Lied nicht spielen!",
    'en': "${speaker} isn't playing. So I can't skip the track forward!"
  },
  'SkipForwardIntentErrorPlayback': {
    'de': "Es erfolgt derzeit keine Wiedergabe. Daher kann ich das nächste Lied nicht spielen!",
    'en': "Nothing is playing. So I can't skip anything!"
  },
  'SkipForwardIntentErrorMultipleSpeakers': {
    'de': "Verschiedene Lautsprecher oder Gruppen sind derzeit aktiv. Bitte versuche es erneut und gib dabei an wo du das nächste Lied spielen möchtest. Sage etwas wie 'Nächstes Lied im Wohnzimmer'.",
    'en': "Multiple speakers or groups are active. Please try again and specify where you'd like to skip forward. Say something like 'Skip forward in the living room.'."
  },
  // -- VolumeChangeIntent --
  'VolumeChangeIntentUp': {
    'de': "Ich mache die Musik lauter.",
    'en': "Turning it up."
  },
  'VolumeChangeIntentDown': {
    'de': "Ich mache die Musik leiser.",
    'en': "Turning it down."
  },
  'VolumeChangeIntentUpSpeaker': {
    'de': "Ich mache den Lautsprecher ${speaker} lauter.",
    'en': "Turning up the ${speaker}."
  },
  'VolumeChangeIntentDownSpeaker': {
    'de': "Ich mache den Lautsprecher ${speaker} leiser.",
    'en': "Turning down the ${speaker}."
  },
  'VolumeChangeIntentErrorInput': {
    'de': "Ich habe dich leider nicht verstanden. Wenn du die Laustärke ändern möchtest, dann benutze die Wörter hoch, lauter, rauf, höher, mehr oder leiser, runter, weniger. Sage soetwas wie 'Musik leiser im Schlafzimmer' oder 'leiser Schlafzimmer'",
    'en': "I didn't understand that. If you are trying to change the volume, please ask again using the words up, louder, down, or softer. Say something like, 'Turn up the living room.'"
  },
  'VolumeChangeIntentErrorMultipleSpeakers': {
    'de': "Verschiedene Lautsprecher oder Gruppen sind derzeit aktiv. Bitte versuche es erneut und gib dabei an wo du die Laustärke ändern möchtest. Sage soetwas wie 'Musik leiser im Schlafzimmer' oder 'leiser Schlafzimmer'",
    'en': "Multiple speakers are active. Please try again and specify where you'd like to change the volume. Say something like 'Turn up the living room.'."
  },
  // -- PlayPresetToSpeakerIntent --
  'PlayPresetToSpeakerIntent': {
    'de': "Starte die Musik auf dem Lautsprecher ${speaker}. Viel Spaß!",
    'en': "Queueing up the jams on your ${speaker} speaker. Enjoy!"
  },
  'PlayPresetToSpeakerIntentErrorWrongPreset': {
    'de': "Ich habe Einstellung ${preset} verstanden, ich kenne aber nur die Einstellungen eins bis sechs. Bitte versuche es erneut.",
    'en': "I heard preset number ${preset}, but I only know presets one through six. Please try again!"
  },
  'PlayPresetToSpeakerIntentErrorInput': {
    'de': "Ich habe dich leider nicht verstanden. Bitte sage mir welche Einstellung du auf welchem Lautsprecher wiedergeben willst, indem du etwas sagst wie 'spiele Einstellung 1 im Wohnzimmer'.",
    'en': "I didn't catch that. Please tell me what preset to play by saying something like, Play preset 4 in the living room."
  },
  // -- ZonesIntent --
  'ZonesIntent': {
    'de': "Ich füge den Lautsprecher ${slave} zur Gruppe von ${master} hinzu.",
    'en': "Adding ${slave} to your ${master} group."
  },
  'ZonesIntentCreate': {
    'de': "Ich verbinde den Lautsprecher ${slave} mit dem Lautsprecher ${master} und erstelle die Gruppe ${master}.",
    'en': "Adding ${slave} to your ${master}, forming ${master} group."
  },
  'ZonesIntentRemove': {
    'de': "Ich entferne den Lautsprecher ${slave} von der Gruppe ${master}.",
    'en': "Removing ${slave} from your ${master} group."
  },
  'ZonesIntentErrorInvalid': {
    'de': "Ich kann Lautsprecher nur zu anderen Lausprechern hinzufügen oder entfernen. Bitte versuche es erneut und sage etwas wie 'Verbinde den Lautsprecher Küche mit dem Schlafzimmer'.",
    'en': "I can only add or remove speakers from other speakers. Please try again by saying something like: 'Add the kitchen to the living room. You must start with either the word 'add' or 'remove.'."
  },
  'ZonesIntentErrorSlave': {
    'de': "Ich kann den Lautsprecher mit dem Namen ${slave} nicht finden. Bitte versuche es erneut.",
    'en': "I don't see a speaker named ${slave} on your network. Please try again!"
  },
  'ZonesIntentErrorMaster': {
    'de': "Ich kann keinen Lautsprecher mit dem Namen ${master} finden der derzeit spielt oder der Haupt-Lautsprecher ist. Du kannst einen Lautsprecher nur zu einem bereits spielenden Haupt-Lautsprecher hinzufügen. Bitte versuche es erneut.",
    'en': "I don't see a speaker named ${master} on your network that is currently playing or is a master speaker. You can only add speakers to a currently playing master speaker. Please try again!"
  },
  'ZonesIntentErrorInput': {
    'de': "Ich habe dich leider nicht verstanden. Um Lautsprecher-Gruppen zu erstellen, sage etwas wie 'Füge Lautsprecher Küche zu Lautsprecher Schlafzimmer hinzu'.",
    'en': "I didn't catch that. Please tell me how to adjust your playback groups by saying something like: 'Add the kitchen to the living room.' You must start with either the word 'add' or 'remove.'"
  },
  // -- PauseIntent --
  'PauseIntent': {
    'de': "Pausiere die Wiedergabe",
    'en': "Pausing."
  },
  'PauseIntentSpeaker': {
    'de': "Pausiere Lautsprecher ${speaker}",
    'en': "Pausing the ${speaker}."
  },
  'PauseIntentErrorSpeakerPlayback': {
    'de': "Derzeit keine Wiedergabe auf Lautsprecher ${speaker} die ich pausieren kann.",
    'en': "${speaker} isn't playing. So it can't be paused!"
  },
  'PauseIntentErrorPlayback': {
    'de': "Derzeit keine Wiedergabe die ich pausieren kann.",
    'en': "Nothing is playing. So nothing can be paused!"
  },
  'PauseIntentErrorMultipleSpeakers': {
    'de': "Verschiedene Lautsprecher oder Gruppen sind derzeit aktiv. Bitte versuche es erneut und gib dabei an wo du die Wiedergabe pausieren möchtest. Sage etwas wie 'Pausiere Küche'.",
    'en': "Multiple speakers or groups are active. Please try again and specify which you'd like to pause. Say something like 'Pause the living room.'."
  },
  // -- PlayIntent --
  'PlayIntent': {
    'de': "Starte Wiedergabe.",
    'en': "Playing."
  },
  'PlayIntentSpeaker': {
    'de': "Starte Wiedergabe auf Lautsprecher ${speaker}.",
    'en': "Powering up and playing the ${speaker}."
  },
  'PlayIntentSpeakerResume': {
    'de': "Fortsetzten auf Lautsprecher ${speaker}.",
    'en': "Playing the ${speaker}."
  },
  'PlayIntentErrorSpeakerPlaying': {
    'de': "Lautsprecher ${speaker} ist bereits aktiv!",
    'en': "${speaker} is already playing!"
  },
  'PlayIntentErrorNothingActive': {
    'de': "Keine aktiven oder pausierten Lautsprecher gefunden. Bitte versuche es erneut und gib an wo du die Wiedergabe starten möchtest. Sage etwas wie 'spiele Musik im Wohnzimmer'.",
    'en': "No active speakers found. Please try again and specify where you want to play. Say something like 'play the kitchen speaker.'."
  },
  'PlayIntentErrorEverythingPlaying': {
    'de': "Alle aktiven Lautsprecher sind bereits am spielen!",
    'en': "Everything that is on is already playing."
  },
  'PlayIntentErrorMultipleSpeakers': {
    'de': "Verschiedene Lautsprecher oder Gruppen sind derzeit aktiv. Bitte versuche es erneut und gib an wo du die Wiedergabe starten möchtest. Sage etwas wie 'Spiele Musik im Wohnzimmer'.",
    'en': "Multiple speakers or groups are active. Please try again and specify which you'd like to play. Say something like 'play the living room.'."
  },
  // -- PowerOffIntent --
  'PowerOffIntent': {
    'de': "Ich stoppe die Wiedergabe aus.",
    'en': "Powering off."
  },
  'PowerOffIntentSpeaker': {
    'de': "Schalte den Lautsprecher ${speaker} aus.",
    'en': "Turning off the ${speaker}."
  },
  'PowerOffIntentErrorNotPlaying': {
    'de': "Ich konnte keine Wiedergabe finden die ich stoppen kann.",
    'en': "Nothing is on!"
  },
  'PowerOffIntentErrorMultipleSpeakers': {
    'de': "Verschiedene Lautsprecher oder Gruppen sind derzeit aktiv. Bitte versuche es erneut und gib an wo du die Wiedergabe stoppen willst. Sage etwas wie 'Stoppe die Wiedergabe im Wohnzimmer'.",
    'en': "Multiple speakers or groups are active. Please try again and specify which you'd like to power off. Say something like 'Turn off the living room.'."
  },
  // -- Different Errors --
  'SpeakerNotFoundError': {
    'de': "Ich kann keinen Lautsprecher mit dem Namen ${speaker} finden. Bitte versuche es erneut.",
    'en': "I don't see a speaker named ${speaker} on your network. Please try again!"
  }
};

// Definition: 'SkillName': {'de': "", 'en': ""}
// Use as: skillResp.SpeakerNotFoundError[locale];
// Use with replace: skillResp.SpeakerNotFoundError[locale].replace('${speaker}', speaker);

// ------------------
// -- Main Handler --
// ------------------

exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.[unique-value-here]") {
             context.fail("Invalid Application ID");
        }
        */

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }

    locale = event.request.locale
    if (locale == 'de-DE') {
      locale = "de";
      console.log("de");
    }else{
      locale = "en";
      console.log("en");
    }
};

// -- Called when the session starts --
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +", sessionId=" + session.sessionId);
}

// -- Called when the user launches the skill without specifying what they want --
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +", sessionId=" + session.sessionId);
    getWelcomeResponse(callback); // Dispatch to your skill's launch
}

// -- Called when the user ends the session. Is not called when the skill returns shouldEndSession=true --
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +", sessionId=" + session.sessionId);
    // Add cleanup logic here if needed
}

// -- Called when the user specifies an intent for this skill --
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("PlayPresetToSpeakerIntent" === intentName) {
        PlayPresetToSpeakerIntent(intent, session, callback);
    } else if ("ZonesIntent" === intentName) {
        ZonesIntent(intent, session, callback);
    } else if ("PauseIntent" === intentName) {
        PauseIntent(intent, session, callback);
    } else if ("PlayIntent" === intentName) {
        PlayIntent(intent, session, callback);
    } else if ("PowerOffIntent" === intentName) {
        PowerOffIntent(intent, session, callback);
    } else if ("SkipForwardIntent" === intentName) {
        SkipForwardIntent(intent, session, callback);
    } else if ("SkipBackIntent" === intentName) {
        SkipBackIntent(intent, session, callback);
    } else if ("VolumeChangeIntent" === intentName) {
        VolumeChangeIntent(intent, session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        getWelcomeResponse(callback);
    } else if ("AMAZON.StopIntent" === intentName) {
        exitSkill(callback);
    } else if ("AMAZON.CancelIntent" === intentName) {
        exitSkill(callback);
    } else {
        throw "Invalid intent";
    }
}

// -----------------------------------------------
// -- Functions to control the skill's behavior --
// -----------------------------------------------

// -- Will be called if skill is started without other commands --
function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = skillResp.getWelcomeResponse[locale];
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = skillResp.getWelcomeResponseRepromt[locale];
    var shouldEndSession = false;

    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

// -- Skips Back to previous song --
function SkipBackIntent(intent, session, callback) {
    console.log("Intents received: ",intent.slots);
    var cardTitle = intent.name;
    var speakerSlot = intent.slots.Speaker;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var alexaID = session.user.userId;

    // NOTICE: you must escape speaker names before making them part of a request back to the server.
    getBoseHomeState(callback, alexaID, function(userHomeState, bridgeID) {
        if (speakerSlot.value){ // check if there is a speaker slot
            var speaker = speakerSlot.value.toLowerCase();
            console.log('[ OK ] Speaker sent. Skipping back if valid and playing.');

            if (userHomeState.speakers.hasOwnProperty(speaker)) {
                if (userHomeState.speakers[speaker].nowPlaying && userHomeState.speakers[speaker].nowPlaying.playStatus == "PLAY_STATE") { // is playing
                    speechOutput = skillResp.SkipBackIntentSpeaker[locale].replace('${speaker}', speaker);
                    shouldEndSession = true;
                    var commandURI = bridgeBasePath + '/api/homes/pushKey?bridgeID=' + bridgeID + '&url=/'
                    + encodeURIComponent(userHomeState.speakers[speaker].name) + '/key/prev_track';
                    console.log(commandURI);
                    http.get(commandURI, function(res) {
                        res.resume();
                        res.on('end', function(){
                            console.log('[ OK ] Request complete. Sending response to Alexa.');
                            callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                        });
                    });
                } else { // speaker isnt playing
                    console.log('[ OK ] Not playing, cannot skip. Exiting skill.');
                    speechOutput = skillResp.SkipBackIntentErrorSpeaker[locale].replace('${speaker}', speaker);
                    shouldEndSession = true;
                    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                }

            } else { // speaker not found
                console.log('[ WARN ] Speaker is not a vaild option.');
                speechOutput = skillResp.SpeakerNotFoundError[locale].replace('${speaker}', speaker);
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            }

        } else { // No speaker slot found
            console.log('[ OK ] No speaker sent. Investigating...');
            if (userHomeState.zonesPlaying.length <= 0 || (userHomeState.zonesPlaying.length == 1 && userHomeState.speakers[userHomeState.zonesPlaying[0]].nowPlaying.playStatus == "PAUSE_STATE")) {
                console.log('[ OK ] Nothing is playing, cannot skip. Exiting skill.');
                speechOutput = skillResp.SkipBackIntentErrorPlayback[locale];
                shouldEndSession = true;
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            } else if (userHomeState.zonesPlaying.length == 1 && userHomeState.speakers[userHomeState.zonesPlaying[0]].nowPlaying.playStatus == "PLAY_STATE") { // Single playing speaker found
                console.log('[ OK ] Single playing speaker found. Skipping back.');
                speechOutput = skillResp.SkipBackIntent[locale];
                shouldEndSession = true;
                var commandURI = bridgeBasePath + '/api/homes/pushKey?bridgeID=' + bridgeID + '&url=/'
                + encodeURIComponent(userHomeState.speakers[userHomeState.zonesPlaying[0]].name) + '/key/prev_track';
                console.log(commandURI);
                http.get(commandURI, function(res) {
                    res.resume();
                    res.on('end', function(){
                        console.log('[ OK ] Request complete. Sending response to Alexa.');
                        callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                    });
                });

            } else { // Multiple speakers active
                console.log('[ WARN ] Multiple speakers active, none specified. Asking for clarification.');
                speechOutput = skillResp.SkipBackIntentErrorMultipleSpeakers[locale];
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            }
        }
    });
}

// -- Skips Forward to next song --
function SkipForwardIntent(intent, session, callback) {
    console.log("Intents received: ",intent.slots);
    var cardTitle = intent.name;
    var speakerSlot = intent.slots.Speaker;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var alexaID = session.user.userId;

    // NOTICE: you must escape speaker names before making them part of a request back to the server
    getBoseHomeState(callback, alexaID, function(userHomeState, bridgeID) {
        if (speakerSlot.value){ // check if there is a speaker slot
            var speaker = speakerSlot.value.toLowerCase();
            console.log('[ OK ] Speaker sent. Skipping forward if valid and playing.');

            if (userHomeState.speakers.hasOwnProperty(speaker)) {
                if (userHomeState.speakers[speaker].nowPlaying && userHomeState.speakers[speaker].nowPlaying.playStatus == "PLAY_STATE") { // speaker is playing
                    speechOutput = skillResp.SkipForwardIntentSpeaker[locale].replace('${speaker}', speaker);
                    shouldEndSession = true;
                    var commandURI = bridgeBasePath + '/api/homes/pushKey?bridgeID=' + bridgeID + '&url=/'
                    + encodeURIComponent(userHomeState.speakers[speaker].name) + '/key/next_track';
                    console.log(commandURI);
                    http.get(commandURI, function(res) {
                        res.resume();
                        res.on('end', function(){
                            console.log('[ OK ] Request complete. Sending response to Alexa.');
                            callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                        });
                    });

                } else { // speaker isnt playing
                    console.log('[ OK ] Not playing, cannot skip. Exiting skill.');
                    speechOutput = skillResp.SkipForwardIntentErrorSpeaker[locale].replace('${speaker}', speaker);
                    shouldEndSession = true;
                    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                }

            } else { // speaker not found
                console.log('[ WARN ] Speaker is not a vaild option.');
                speechOutput = skillResp.SpeakerNotFoundError[locale].replace('${speaker}', speaker);
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            }

        } else { // No speaker specified
            console.log('[ OK ] No speaker sent. Investigating...');
            if (userHomeState.zonesPlaying.length <= 0 || (userHomeState.zonesPlaying.length == 1 && userHomeState.speakers[userHomeState.zonesPlaying[0]].nowPlaying.playStatus == "PAUSE_STATE")) { // No Speaker playing
                console.log('[ OK ] Nothing is playing, cannot skip. Exiting skill.');
                speechOutput = skillResp.SkipForwardIntentErrorPlayback[locale];
                shouldEndSession = true;
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            } else if (userHomeState.zonesPlaying.length == 1 && userHomeState.speakers[userHomeState.zonesPlaying[0]].nowPlaying.playStatus == "PLAY_STATE") { // Found a single speaker playing
                console.log('[ OK ] Single playing speaker found, skipping forward.');
                speechOutput = skillResp.SkipForwardIntent[locale];
                shouldEndSession = true;
                var commandURI = bridgeBasePath + '/api/homes/pushKey?bridgeID=' + bridgeID + '&url=/'
                + encodeURIComponent(userHomeState.speakers[userHomeState.zonesPlaying[0]].name) + '/key/next_track';
                console.log(commandURI);
                http.get(commandURI, function(res) {
                    res.resume();
                    res.on('end', function(){
                        console.log('[ OK ] Request complete. Sending response to Alexa.');
                        callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                    });
                });

            } else { // Multiple speakers found
                console.log('[ WARN ] Multiple speakers active, none specified. Asking for clarification.');
                speechOutput = skillResp.SkipForwardIntentErrorMultipleSpeakers[locale];
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            }
        }
    });
}

// -- Changes Volume --
function VolumeChangeIntent(intent, session, callback) {
    console.log("Intents received: ",intent.slots);
    var cardTitle = intent.name;
    var volumeChangeSlot = intent.slots.VolumeChange;
    var speakerSlot = intent.slots.Speaker;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var volumeChangeUp = ['up', 'louder', 'hoch', 'lauter', 'rauf', 'höher', 'mehr']; // ADD: more commands if changing the VOLUME_CHANGES slot type
    var volumeChangeDown = ['down', 'softer', 'leiser', 'runter', 'weniger']; // ADD: more commands if changing the VOLUME_CHANGES slot type
    var validVolumeChanges = volumeChangeUp.concat(volumeChangeDown); // All valid commands
    var volumeDelta = 10;
    var alexaID = session.user.userId;

    if (!volumeChangeSlot.value) { // did not get a volume change, so don't know what to do.
        console.log('[ WARN ] No VolumeChange. Exiting skill.');
        speechOutput = skillResp.VolumeChangeIntentErrorInput[locale];
        callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    } else if (validVolumeChanges.indexOf(volumeChangeSlot.value) < 0) { // don't understand
        console.log('[ WARN ] Invalid VolumeChange. Exiting skill.');
        speechOutput = skillResp.VolumeChangeIntentErrorInput[locale];
        callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    } else { // good volume change value
        // NOTICE: you must escape speaker names before making them part of a request back to the server.
        getBoseHomeState(callback, alexaID, function(userHomeState, bridgeID) {
            if (speakerSlot.value){ // check if there is a speaker slot
                var speaker = speakerSlot.value.toLowerCase();
                console.log('[ OK ] Speaker sent. Checking if valid.');

                if (userHomeState.speakers.hasOwnProperty(speaker)) { // speaker is valid, so change the volume
                    console.log('[ OK ] Speaker is valid. Changing volume.');
                    if (volumeChangeUp.indexOf(volumeChangeSlot.value) >= 0) { // turn it up
                      speechOutput = skillResp.VolumeChangeIntentUpSpeaker[locale].replace('${speaker}', speaker);
                      shouldEndSession = true;
                      var currentVolume = userHomeState.speakers[speaker].currentVolume;
                      var newVolumeUp = parseInt(currentVolume) + parseInt(volumeDelta);
                      var commandURI = bridgeBasePath + '/api/homes/pushKey?bridgeID=' + bridgeID + '&url=/'
                      + encodeURIComponent(userHomeState.speakers[speaker].name) + '/volume/' + newVolumeUp;

                      console.log(commandURI);
                      http.get(commandURI, function(res) {
                          res.resume();
                          res.on('end', function(){
                              console.log('[ OK ] Request complete. Sending response to Alexa.');
                              callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                          });
                      });
                    } else { // turn it down
                      speechOutput = skillResp.VolumeChangeIntentDownSpeaker[locale].replace('${speaker}', speaker);
                      shouldEndSession = true;
                      var currentVolume = userHomeState.speakers[speaker].currentVolume;
                      var newVolumeDown = parseInt(currentVolume) - parseInt(volumeDelta);
                      var commandURI = bridgeBasePath + '/api/homes/pushKey?bridgeID=' + bridgeID + '&url=/'
                      + encodeURIComponent(userHomeState.speakers[speaker].name) + '/volume/' + newVolumeDown;

                      console.log(commandURI);
                      http.get(commandURI, function(res) {
                          res.resume();
                          res.on('end', function(){
                              console.log('[ OK ] Request complete. Sending response to Alexa.');
                              callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                          });
                      });
                  }

                } else { // speaker not foung
                    console.log('[ WARN ] Speaker is not a vaild option.');
                    speechOutput = skillResp.SpeakerNotFoundError[locale].replace('${speaker}', speaker);
                    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                }

            } else { // No speaker send
                console.log('[ OK ] No speaker sent. Investigating...');

                if (userHomeState.zonesPlaying.length == 1) { // there's no more than 1 zone playing
                    if (userHomeState.speakers[userHomeState.zonesPlaying[0]].isMaster) { // Multiple speakers are playing
                        console.log('[ WARN ] Multiple speakers are active, none specified. Asking for clarification.');
                        speechOutput = skillResp.VolumeChangeIntentErrorMultipleSpeakers[locale];
                        callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                    } else { // just one speaker is playing - do the thing.
                        if (volumeChangeUp.indexOf(volumeChangeSlot.value) >= 0) { // turn it up
                            speechOutput = skillResp.VolumeChangeIntentUp[locale];
                            shouldEndSession = true;
                            var currentVolume = userHomeState.speakers[userHomeState.zonesPlaying[0]].currentVolume;
                            var newVolumeUp = parseInt(currentVolume) + parseInt(volumeDelta);
                            var commandURI = bridgeBasePath + '/api/homes/pushKey?bridgeID=' + bridgeID + '&url=/'
                            + encodeURIComponent(userHomeState.speakers[userHomeState.zonesPlaying[0]].name) + '/volume/' + newVolumeUp;

                            console.log(commandURI);
                            http.get(commandURI, function(res) {
                                res.resume();
                                res.on('end', function(){
                                    console.log('[ OK ] Request complete. Sending response to Alexa.');
                                    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                                });
                            });
                        } else { // turn it down
                            speechOutput = skillResp.VolumeChangeIntentDown[locale];
                            shouldEndSession = true;
                            var currentVolume = userHomeState.speakers[userHomeState.zonesPlaying[0]].currentVolume;
                            var newVolumeDown = parseInt(currentVolume) - parseInt(volumeDelta);
                            var commandURI = bridgeBasePath + '/api/homes/pushKey?bridgeID=' + bridgeID + '&url=/'
                            + encodeURIComponent(userHomeState.speakers[userHomeState.zonesPlaying[0]].name) + '/volume/' + newVolumeDown;

                            console.log(commandURI);
                            http.get(commandURI, function(res) {
                                res.resume();
                                res.on('end', function(){
                                    console.log('[ OK ] Request complete. Sending response to Alexa.');
                                    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                                });
                            });
                        }
                    }

                } else { // either nothing or multiple things are playing
                    console.log('[ WARN ]  Either multiple or zero speakers active, none specified. Asking for clarification.');
                    speechOutput = skillResp.VolumeChangeIntentErrorMultipleSpeakers[locale];
                    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                }
            }
        });
    }
}

// -- Plays a preset --
function PlayPresetToSpeakerIntent(intent, session, callback) {
    var cardTitle = intent.name;
    var presetSlot = intent.slots.Preset;
    var preset = presetSlot.value;
    var speakerSlot = intent.slots.Speaker;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var availablePresets = ['1','2','3','4','5','6'];
    var alexaID = session.user.userId;

    // NOTICE: you must escape speaker names before making them part of a request back to the server.
    getBoseHomeState(callback, alexaID, function(userHomeState, bridgeID) {
        if (presetSlot.value && speakerSlot.value) { // something is in both slots, just need to verify what
            var speaker = speakerSlot.value.toLowerCase();
            console.log('[ OK ] Received both a preset slot and a speaker slot from Alexa.');
            if (availablePresets.indexOf(preset) > -1) { // preset is valid, check speaker
                console.log('[ OK ] Preset is a valid option.');
                if (userHomeState.speakers.hasOwnProperty(speaker)) { // speaker is also valid, so play it!
                    console.log('[ OK ] Speaker is a valid option, too. Sending play request.');
                    speechOutput = skillResp.PlayPresetToSpeakerIntent[locale].replace('${speaker}', speaker);

                    shouldEndSession = true;
                    var commandURI = bridgeBasePath + '/api/homes/pushKey?bridgeID=' + bridgeID + '&url=/'
                    + encodeURIComponent(userHomeState.speakers[speaker].name) + '/key/PRESET_' + encodeURIComponent(presetSlot.value);

                    console.log(commandURI);
                    http.get(commandURI, function(res) {
                        res.resume();
                        res.on('end', function(){
                            console.log('[ OK ] Request complete. Sending response to Alexa.');
                            callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                        });
                    });

                } else { // speaker is not found, ask again
                    console.log('[ FAIL ] Speaker is not a vaild option.');
                    speechOutput = skillResp.SpeakerNotFoundError[locale].replace('${speaker}', speaker);
                    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                }
            } else { // preset number is invalid, ask again
                console.log('[ FAIL ] Preset is not a valid option.');
                speechOutput = skillResp.PlayPresetToSpeakerIntentErrorWrongPreset[locale].replace('${preset}', preset);
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            }

        } else { // One of both slots (speaker or preset) is missing
            console.log('[ FAIL ] Did not receive both a preset slot and a speaker slot from Alexa.'); // in future will more gracefully handle only one piece of data present. for now just ask the user for the whole thing again.
            speechOutput = skillResp.PlayPresetToSpeakerIntentErrorInput[locale];
            callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }
    });
}

// -- Combines speakers to zones --
function ZonesIntent(intent, session, callback) {
    console.log("Intents received: ",intent.slots);
    var cardTitle = intent.name;
    var actionSlot = intent.slots.Action;
    var masterSlot = intent.slots.Master;
    var slaveSlot = intent.slots.Slave;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var alexaID = session.user.userId;
    var actionValueAdd = ['add', 'hinzufügen', 'verbinden', 'verbinde', 'füge']; // Valid values for adding speakers
    var actionValueRemove = ['remove', 'entfernen', 'trennen', "trenne", "entferne"]; // Valid values for removing speakers

    var validActionValues = actionValueAdd.concat(actionValueRemove); // Valid values for all actions

    // NOTICE: you must escape speaker names before making them part of a request back to the server.
    getBoseHomeState(callback, alexaID, function(userHomeState, bridgeID) {
        if (actionSlot.hasOwnProperty('value') && masterSlot.hasOwnProperty('value') && slaveSlot.hasOwnProperty('value')) { // all slots have a value
            var action = actionSlot.value.toLowerCase();
            var master = masterSlot.value.toLowerCase();
            var slave = slaveSlot.value.toLowerCase();
            console.log('[ OK ] Received an action and both a master slot and a slave slot from Alexa.');

            if (userHomeState.speakers.hasOwnProperty(master) && userHomeState.zonesPlaying.indexOf(master) > -1) { // Master is valid
                console.log('[ OK ] Master is a valid option.');

                if (userHomeState.speakers.hasOwnProperty(slave)) { // Slave is valid
                    console.log('[ OK ] Slave is a valid option, too.');

                    if(actionValueAdd.indexOf(action) >= 0) { // Action is Add
                        console.log('[ OK ] Action is a valid option, too ("add"). Making grouping request');

                        if (userHomeState.speakers[master].isMaster) { // is master actually a master, or not in a zone

                            speechOutput = skillResp.ZonesIntent[locale].replace('${slave}', slave).replace('${master}', master);
                            shouldEndSession = true;
                            var commandURI = bridgeBasePath + '/api/homes/pushKey?bridgeID=' + bridgeID + '&url=/'
                            + encodeURIComponent(userHomeState.speakers[master].name) + '/addZoneSlave/' + encodeURIComponent(userHomeState.speakers[slave].name);

                            console.log(commandURI);
                            http.get(commandURI, function(res) {
                                res.resume();
                                res.on('end', function(){
                                    console.log('[ OK ] Request complete. Sending response to Alexa.');
                                    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                                });
                            });

                        } else { // master is currently not a master, so need to make zone
                            speechOutput = skillResp.ZonesIntentCreate[locale].replace('${slave}', slave).replace('${master}', master);
                            shouldEndSession = true;
                            var commandURI = bridgeBasePath + '/api/homes/pushKey?bridgeID=' + bridgeID + '&url=/'
                            + encodeURIComponent(userHomeState.speakers[master].name) + '/setZone/' + encodeURIComponent(userHomeState.speakers[slave].name);

                            console.log(commandURI);
                            http.get(commandURI, function(res) {
                                res.resume();
                                res.on('end', function(){
                                    console.log('[ OK ] Request complete. Sending response to Alexa.');
                                    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                                });
                            });
                        }
                    } else if (actionValueRemove.indexOf(action) >= 0) { // Action is Remove
                        console.log('[ OK ] Action is a valid option, too ("remove"). Making grouping request');

                        speechOutput = skillResp.ZonesIntentRemove[locale].replace('${slave}', slave).replace('${master}', master);
                        shouldEndSession = true;
                        var commandURI = bridgeBasePath + '/api/homes/pushKey?bridgeID=' + bridgeID + '&url=/'
                        + encodeURIComponent(userHomeState.speakers[master].name) + '/removeZoneSlave/' + encodeURIComponent(userHomeState.speakers[slave].name);

                        console.log(commandURI);
                        http.get(commandURI, function(res) {
                            res.resume();
                            res.on('end', function(){
                                console.log('[ OK ] Request complete. Sending response to Alexa.');
                                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                            });
                        });
                    } else { // Action is not vaild, ask again
                        console.log('[ FAIL ] Action is not a vaild option.');
                        speechOutput = skillResp.ZonesIntentErrorInvalid[locale];
                        callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                    }

                } else { // slave is not found, ask again
                    console.log('[ FAIL ] Slave is not a vaild option.');
                    speechOutput = skillResp.ZonesIntentErrorSlave[locale].replace('${slave}', slave);
                    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                }
            } else { // master is not found, ask again
                console.log('[ FAIL ] Master is not a valid option.');
                    speechOutput = skillResp.ZonesIntentErrorMaster[locale].replace('${master}', master);
                    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            }

        } else { // Did not revieve all slots (action, master, slave)
            console.log('[ FAIL ] Did not receive all parts from Alexa.'); // in future will more gracefully handle only one piece of data present. for now just ask the user for the whole thing again.
            speechOutput = skillResp.ZonesIntentErrorInput[locale];
            callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }
    });
}

// -- Pauses playback --
function PauseIntent(intent, session, callback) {
    console.log("Intents received: ",intent.slots);
    var cardTitle = intent.name;
    var speakerSlot = intent.slots.Speaker;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var alexaID = session.user.userId;

    // NOTICE: you must escape speaker names before making them part of a request back to the server.
    getBoseHomeState(callback, alexaID, function(userHomeState, bridgeID) {
        if (speakerSlot.value){ // check if there is a speaker slot
            var speaker = speakerSlot.value.toLowerCase();
            console.log('[ OK ] Speaker sent. Pausing if valid and playing.');

            if (userHomeState.speakers.hasOwnProperty(speaker)) { // A speaker is active
                if (userHomeState.speakers[speaker].nowPlaying && userHomeState.speakers[speaker].nowPlaying.playStatus == "PLAY_STATE") { // is playing
                    console.log('[ OK ] Speaker is valid and playing. Pausing.');
                    speechOutput = skillResp.PauseIntentSpeaker[locale].replace('${speaker}', speaker);
                    shouldEndSession = true;
                     var commandURI = bridgeBasePath + '/api/homes/pushKey?bridgeID=' + bridgeID + '&url=/'
                     + encodeURIComponent(userHomeState.speakers[speaker].name) + '/key/pause';

                    console.log(commandURI);
                    http.get(commandURI, function(res) {
                        res.resume();
                        res.on('end', function(){
                            console.log('[ OK ] Request complete. Sending response to Alexa.');
                            callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                        });
                    });

                } else { // speaker isnt playing
                    console.log('[ OK ] Not playing, cannot pause. Exiting skill.');
                    speechOutput = skillResp.PauseIntentErrorSpeakerPlayback[locale].replace('${speaker}', speaker);
                    shouldEndSession = true;
                    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                }

            } else { // speaker not found
                console.log('[ WARN ] Speaker is not a vaild option.');
                speechOutput = skillResp.SpeakerNotFoundError[locale].replace('${speaker}', speaker);
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            }

        } else { // No speaker sent
            console.log('[ OK ] No speaker sent. Investigating...');
            if (userHomeState.zonesPlaying.length <= 0 || (userHomeState.zonesPlaying.length == 1 && userHomeState.speakers[userHomeState.zonesPlaying[0]].nowPlaying.playStatus == "PAUSE_STATE")) { // No speaker is currently playing
                console.log('[ OK ] Nothing is playing, cannot pause. Exiting skill.');
                speechOutput = skillResp.PauseIntentErrorPlayback[locale];
                shouldEndSession = true;
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            } else if (userHomeState.zonesPlaying.length == 1 && userHomeState.speakers[userHomeState.zonesPlaying[0]].nowPlaying.playStatus == "PLAY_STATE") { // A speaker is currently playing
                console.log('[ OK ] A speaker is playing, will pause.');
                speechOutput = skillResp.PauseIntent[locale];
                shouldEndSession = true;
                var commandURI = bridgeBasePath + '/api/homes/pushKey?bridgeID=' + bridgeID + '&url=/'
                + encodeURIComponent(userHomeState.speakers[userHomeState.zonesPlaying[0]].name) + '/key/pause';

                console.log(commandURI);
                http.get(commandURI, function(res) {
                    res.resume();
                    res.on('end', function(){
                        console.log('[ OK ] Request complete. Sending response to Alexa.');
                        callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                    });
                });

            } else { // Multiple speakers are active
                console.log('[ WARN ] Multiple speakers active, none specified. Asking for clarification.');
                speechOutput =
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            }
        }
    });
}

// -- Starts playback --
function PlayIntent(intent, session, callback) {
    console.log("Intents received: ",intent.slots);
    var cardTitle = intent.name;
    var speakerSlot = intent.slots.Speaker;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var alexaID = session.user.userId;

    // NOTICE: you must escape speaker names before making them part of a request back to the server.
    getBoseHomeState(callback, alexaID, function(userHomeState, bridgeID) {
        if (speakerSlot.value){ // check if there is a speaker slot
            var speaker = speakerSlot.value.toLowerCase();
            console.log('[ OK ] Speaker sent. Playing if valid and paused.');
            if (userHomeState.speakers.hasOwnProperty(speaker)) { // Check if the speaker is active
                if (userHomeState.speakers[speaker].nowPlaying && userHomeState.speakers[speaker].nowPlaying.playStatus == "PAUSE_STATE") { // the speaker is paused
                    console.log('[ OK ] Speaker is paused. Playing.');
                    speechOutput = skillResp.PlayIntentSpeakerResume[locale].replace('${speaker}', speaker);
                    shouldEndSession = true;
                    var commandURI = bridgeBasePath + '/api/homes/pushKey?bridgeID=' + bridgeID + '&url=/'
                    + encodeURIComponent(userHomeState.speakers[speaker].name) + '/key/play';

                    console.log(commandURI);
                    http.get(commandURI, function(res) {
                        res.resume();
                        res.on('end', function(){
                            console.log('[ OK ] Request complete. Sending response to Alexa.');
                            callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                        });
                    });

                } else if (userHomeState.speakers[speaker].nowPlaying && userHomeState.speakers[speaker].nowPlaying.playStatus == "PLAY_STATE") { // speaker is already playing
                    console.log('[ OK ] Already playing, cannot play more. Exiting skill.');
                    speechOutput = skillResp.PlayIntentErrorSpeakerPlaying[locale].replace('${speaker}', speaker);
                    shouldEndSession = true;
                    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                } else { // speaker is off
                    console.log('[ OK ] Speaker is off. Playing.');
                    speechOutput = skillResp.PlayIntentSpeaker[locale].replace('${speaker}', speaker);
                    shouldEndSession = true;
                    var commandURI = bridgeBasePath + '/api/homes/pushKey?bridgeID=' + bridgeID + '&url=/'
                    + encodeURIComponent(userHomeState.speakers[speaker].name) + '/powerOn';

                    console.log(commandURI);
                    http.get(commandURI, function(res) {
                        res.resume();
                        res.on('end', function(){
                            console.log('[ OK ] Request complete. Sending response to Alexa.');
                            callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                        });
                    });
                }

            } else { // speaker is not found
                console.log('[ WARN ] Speaker is not a vaild option.');
                speechOutput = skillResp.SpeakerNotFoundError[locale].replace('${speaker}', speaker);
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            }

        } else { // No speaker sent
            console.log('[ OK ] No speaker sent. Investigating...');
            if (userHomeState.zonesPlaying.length <= 0) { // No playing or paused speakers found
                console.log('[ OK ] No active or paused speakers found to start playing.');
                speechOutput = skillResp.PlayIntentErrorNothingActive[locale];
                shouldEndSession = true;
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            }else if (userHomeState.zonesPlaying.length == 1 && userHomeState.speakers[userHomeState.zonesPlaying[0]].nowPlaying.playStatus == "PLAY_STATE") { // Anything that is on, is playing
                console.log('[ OK ] Anything that is on is already playing.');
                speechOutput = skillResp.PlayIntentErrorEverythingPlaying[locale];
                shouldEndSession = true;
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            } else if (userHomeState.zonesPlaying.length == 1 && userHomeState.speakers[userHomeState.zonesPlaying[0]].nowPlaying.playStatus == "PAUSE_STATE") { // A paused speaker found
                console.log('[ OK ] Paused speaker found. Playing.');
                speechOutput = skillResp.PlayIntent[locale];
                shouldEndSession = true;
                var commandURI = bridgeBasePath + '/api/homes/pushKey?bridgeID=' + bridgeID + '&url=/'
                + encodeURIComponent(userHomeState.speakers[userHomeState.zonesPlaying[0]].name) + '/key/play';

                console.log(commandURI);
                http.get(commandURI, function(res) {
                    res.resume();
                    res.on('end', function(){
                        console.log('[ OK ] Request complete. Sending response to Alexa.');
                        callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                    });
                });

            } else { // Multiple speakers found
                console.log('[ WARN ] Multiple speakers active, none specified. Asking for clarification.');
                speechOutput = skillResp.PlayIntentErrorMultipleSpeakers[locale];
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            }
        }
    });
}

// -- Powers off --
function PowerOffIntent(intent, session, callback) {
    console.log("Intents received: ",intent.slots);
    var cardTitle = intent.name;
    var speakerSlot = intent.slots.Speaker;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var alexaID = session.user.userId;

    // NOTICE: you must escape speaker names before making them part of a request back to the server.
    getBoseHomeState(callback, alexaID, function(userHomeState, bridgeID) {
        if (speakerSlot.value){ // check if there is a speaker slot
            var speaker = speakerSlot.value.toLowerCase();
            console.log('[ OK ] Speaker sent. Turning off.');

            if (userHomeState.speakers.hasOwnProperty(speaker)) { // Speaker is correct
                speechOutput = skillResp.PowerOffIntentSpeaker[locale].replace('${speaker}', speaker);
                shouldEndSession = true;
                var commandURI = bridgeBasePath + '/api/homes/pushKey?bridgeID=' + bridgeID + '&url=/'
                + encodeURIComponent(userHomeState.speakers[speaker].name) + '/powerOff';

                console.log(commandURI);
                http.get(commandURI, function(res) {
                    res.resume();
                    res.on('end', function(){
                        console.log('[ OK ] Request complete. Sending response to Alexa.');
                        callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                    });
                });

            } else { // speaker is wrong
                console.log('[ WARN ] Speaker is not a vaild option.');
                speechOutput = skillResp.SpeakerNotFoundError[locale].replace('${speaker}', speaker);
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            }

        } else { // No speaker sent
            console.log('[ OK ] No speaker sent. Investigating...');
            if (userHomeState.zonesPlaying.length <= 0) { // No speakers are active
                console.log('[ OK ] Nothing is on. Exiting skill.');
                speechOutput = skillResp.PowerOffIntentErrorNotPlaying[locale];
                shouldEndSession = true;
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            } else if (userHomeState.zonesPlaying.length == 1) { // one speaker is active
                speechOutput = skillResp.PowerOffIntent[locale];
                shouldEndSession = true;
                var commandURI = bridgeBasePath + '/api/homes/pushKey?bridgeID=' + bridgeID + '&url=/'
                + encodeURIComponent(userHomeState.speakers[userHomeState.zonesPlaying[0]].name) + '/powerOff';

                console.log(commandURI);
                http.get(commandURI, function(res) {
                    res.resume();
                    res.on('end', function(){
                        console.log('[ OK ] Request complete. Sending response to Alexa.');
                        callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                    });
                });

            } else { // Multiple speakers are active
                console.log('[ WARN ] Multiple speakers active, none specified. Asking for clarification.');
                speechOutput = skillResp.PowerOffIntentErrorMultipleSpeakers[locale];
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            }
        }
    });
}

// -- Exits the alexa skill --
function exitSkill (callback) {
    var cardTitle ="";
    var sessionAttributes = {};
    var speechOutput = "";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "";
    var shouldEndSession = true;

    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

// ----------------------
// -- Helper functions --
// ----------------------

// -- Helper that gets info about the state of the user's home --
function getBoseHomeState(callback, alexaID, boseCallback) {
    http.get(bridgeBasePath + '/api/homes/' + alexaID, function(res) {
        var homeStateBody = '';
        res.on('data', function(chunk) {homeStateBody += chunk;});
        res.on('end', function() {
            var homeState = JSON.parse(homeStateBody);
            if(homeState.error){
                console.log("Home does not yet exist for this AlexaID. Creating home with AlexaID:", alexaID);
                var bodyString = JSON.stringify({
                  "alexaID": "",
                  "keyStack": [],
                  "currentState": {},
                  "id": alexaID
                });

                var headers = {
                    'Content-Type': 'application/json',
                    'Content-Length': bodyString.length
                };

                var options = {
                    host: bridgeBasePath.slice(7),
                    path: '/api/homes',
                    method: 'PUT',
                    headers: headers
                };

                var homeCreated = function(res) {
                    res.resume();
                    res.on('end', function(){
                        console.log('PUT complete');
                        callback({}, buildSpeechletResponse("New Home", "This home had not yet been configured. I've attempted to create a new home instance on the remote server using AlexaID: " + alexaID + ". A corresponding local server will need to be configured to report to that home.", "", true));
                    });
                };

                http.request(options, homeCreated).on('error', function(e) {
                    console.log("Got error: " + e.message);
                }).write(bodyString);

            } else if(Object.keys(homeState.currentState).length === 0){
                console.log("Home exists, but the currentState is empty. AlexaID:", alexaID);
                callback({}, buildSpeechletResponse("No Home State", "This home, based on AlexaID: " + alexaID + ", does not appear to have any speakers on the network. Please be sure the local server is running and reporting to the correct home instance in the remote server.", "", true));
            } else {
                boseCallback(homeState.currentState, homeState.id);
            }
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
}

// -- Helpers that build all of the responses --
function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

// -- Helpers that build all of the responses --
function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
