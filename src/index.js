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
var bridgeBasePath = "http://alexabridge.zwrose.com";
// var bridgeID = 1;
// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
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
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);

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

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Welcome to Bose SoundTouch! " +
        "You can use this skill to start playback, create or collapse groups, play, pause, and/or skip your music, or change the volume of your SoundTouch devices. " +
        "To start the music, say something like, Play preset 4 in the living room.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Please tell me what I should do. You can start music by saying something like, " +
        "Play preset 4 in the living room.";
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function SkipBackIntent(intent, session, callback) {
    console.log("Intents received: ",intent.slots);
    var cardTitle = intent.name;
    var speakerSlot = intent.slots.Speaker;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var alexaID = session.user.userId.slice(23);

    /**
     * NOTICE: you must escape speaker names before making them part of a request back to the server.
     */
    getBoseHomeState(alexaID, function(userHomeState, bridgeID) {
        // check if there is a speaker slot
        if (speakerSlot.value){
            var speaker = speakerSlot.value.toLowerCase();
            console.log('[ OK ] Speaker sent. Skipping back if valid and playing.');
            
            if (userHomeState.speakers.hasOwnProperty(speaker)) {
                if (userHomeState.speakers[speaker].nowPlaying && userHomeState.speakers[speaker].nowPlaying.playStatus == "PLAY_STATE") {
                    // is playing
                    speechOutput = "Skipping back in the " + speaker + ".";
                    shouldEndSession = true;
                    var commandURI = 'http://alexabridge.zwrose.com/api/homeKeys/pushKey?bridgeID=' + bridgeID + '&url=/' 
                    + encodeURIComponent(userHomeState.speakers[speaker].name) + '/key/prev_track';
                    console.log(commandURI);
                    http.get(commandURI, function(res) {
                        res.resume();
                        res.on('end', function(){
                            console.log('[ OK ] Request complete. Sending response to Alexa.');
                            callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                            
                        });
                    });
                    
                } else {
                    // isnt playing
                    console.log('[ OK ] Not playing, cannot skip. Exiting skill.');
                    speechOutput = speaker + " isn't playing...so I can't skip the track back!";
                    shouldEndSession = true;
                    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                    
                }
                
            } else {
                // speaker not found
                console.log('[ WARN ] Speaker is not a vaild option.');
                speechOutput = "I don't see a speaker named " + speaker + " on your network. Please try again!";
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            }
            
            
            
        } else {
            console.log('[ OK ] No speaker sent. Investigating...');
            if (userHomeState.zonesPlaying.length <= 0 || (userHomeState.zonesPlaying.length == 1 && userHomeState.speakers[userHomeState.zonesPlaying[0]].nowPlaying.playStatus == "PAUSE_STATE")) {
                console.log('[ OK ] Nothing is playing, cannot skip. Exiting skill.');
                speechOutput = "Nothing is playing...so nothing I can't skip anything!";
                shouldEndSession = true;
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                
            } else if (userHomeState.zonesPlaying.length == 1 && userHomeState.speakers[userHomeState.zonesPlaying[0]].nowPlaying.playStatus == "PLAY_STATE") {
                speechOutput = "Skipping back.";
                shouldEndSession = true;
                var commandURI = 'http://alexabridge.zwrose.com/api/homeKeys/pushKey?bridgeID=' + bridgeID + '&url=/' 
                + encodeURIComponent(userHomeState.speakers[userHomeState.zonesPlaying[0]].name) + '/key/prev_track';

                console.log(commandURI);
                http.get(commandURI, function(res) {
                    res.resume();
                    res.on('end', function(){
                        console.log('[ OK ] Request complete. Sending response to Alexa.');
                        callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                        
                    });
                });
                
            } else {
                console.log('[ WARN ] Multiple speakers active, none specified. Asking for clarification.');
                speechOutput = "Multiple speakers or groups are active. Please try again and specify where you'd like to skip back. Say something like 'Skip back in the living room.'.";
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                
            }
            
        }
        
    });
}

function SkipForwardIntent(intent, session, callback) {
    console.log("Intents received: ",intent.slots);
    var cardTitle = intent.name;
    var speakerSlot = intent.slots.Speaker;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var alexaID = session.user.userId.slice(23);

    /**
     * NOTICE: you must escape speaker names before making them part of a request back to the server.
     */
    getBoseHomeState(alexaID, function(userHomeState, bridgeID) {
        // check if there is a speaker slot
        if (speakerSlot.value){
            var speaker = speakerSlot.value.toLowerCase();
            console.log('[ OK ] Speaker sent. Skipping forward if valid and playing.');
            
            if (userHomeState.speakers.hasOwnProperty(speaker)) {
                if (userHomeState.speakers[speaker].nowPlaying && userHomeState.speakers[speaker].nowPlaying.playStatus == "PLAY_STATE") {
                    // is playing
                    speechOutput = "Skipping forward in the " + speaker + ".";
                    shouldEndSession = true;
                    var commandURI = 'http://alexabridge.zwrose.com/api/homeKeys/pushKey?bridgeID=' + bridgeID + '&url=/' 
                    + encodeURIComponent(userHomeState.speakers[speaker].name) + '/key/next_track';    
                    console.log(commandURI);
                    http.get(commandURI, function(res) {
                        res.resume();
                        res.on('end', function(){
                            console.log('[ OK ] Request complete. Sending response to Alexa.');
                            callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                            
                        });
                    });
                    
                } else {
                    // isnt playing
                    console.log('[ OK ] Not playing, cannot skip. Exiting skill.');
                    speechOutput = speaker + " isn't playing...so I can't skip the track forward!";
                    shouldEndSession = true;
                    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                    
                }
                
            } else {
                // speaker not found
                console.log('[ WARN ] Speaker is not a vaild option.');
                speechOutput = "I don't see a speaker named " + speaker + " on your network. Please try again!";
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            }
            
            
            
        } else {
            console.log('[ OK ] No speaker sent. Investigating...');
            if (userHomeState.zonesPlaying.length <= 0 || (userHomeState.zonesPlaying.length == 1 && userHomeState.speakers[userHomeState.zonesPlaying[0]].nowPlaying.playStatus == "PAUSE_STATE")) {
                console.log('[ OK ] Nothing is playing, cannot skip. Exiting skill.');
                speechOutput = "Nothing is playing...so nothing I can't skip anything!";
                shouldEndSession = true;
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                
            } else if (userHomeState.zonesPlaying.length == 1 && userHomeState.speakers[userHomeState.zonesPlaying[0]].nowPlaying.playStatus == "PLAY_STATE") {
                speechOutput = "Skipping forward.";
                shouldEndSession = true;
                var commandURI = 'http://alexabridge.zwrose.com/api/homeKeys/pushKey?bridgeID=' + bridgeID + '&url=/' 
                + encodeURIComponent(userHomeState.speakers[userHomeState.zonesPlaying[0]].name) + '/key/next_track';    
                console.log(commandURI);
                http.get(commandURI, function(res) {
                    res.resume();
                    res.on('end', function(){
                        console.log('[ OK ] Request complete. Sending response to Alexa.');
                        callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                        
                    });
                });
                
            } else {
                console.log('[ WARN ] Multiple speakers active, none specified. Asking for clarification.');
                speechOutput = "Multiple speakers or groups are active. Please try again and specify where you'd like to skip forward. Say something like 'Skip forward in the living room.'.";
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                
            }
            
        }
        
    });
}

function VolumeChangeIntent(intent, session, callback) {
    console.log("Intents received: ",intent.slots);
    var cardTitle = intent.name;
    var volumeChangeSlot = intent.slots.VolumeChange;
    var speakerSlot = intent.slots.Speaker;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var validVolumeChanges = ['up', 'down', 'louder', 'softer'];
    var volumeDelta = 10;
    var alexaID = session.user.userId.slice(23);
    
    if (!volumeChangeSlot.value) {
        // did not get a volume change, so don't know what to do.
        console.log('[ WARN ] No VolumeChange. Exiting skill.');
        speechOutput = "I didn't understand that. IF you are trying to change the volume, please ask again using the words up or louder, or down or softer. Say something like, 'Ask Bose to turn up the living room.'";
        shouldEndSession = true;
        callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        
    } else if (validVolumeChanges.indexOf(volumeChangeSlot.value) < 0) {
        // don't understand
        console.log('[ WARN ] Invalid VolumeChange. Exiting skill.');
        speechOutput = "I didn't understand that. IF you are trying to change the volume, please ask again using the words up or louder, or down or softer. Say something like, 'Ask Bose to turn up the living room.'";
        shouldEndSession = true;
        callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        
    } else {
        // good volume change value
        /**
         * NOTICE: you must escape speaker names before making them part of a request back to the server.
         */
        getBoseHomeState(alexaID, function(userHomeState, bridgeID) {
            // check if there is a speaker slot
            if (speakerSlot.value){
                var speaker = speakerSlot.value.toLowerCase();
                console.log('[ OK ] Speaker sent. Checking if valid.');
                
                if (userHomeState.speakers.hasOwnProperty(speaker)) {
                    // speaker is valid, so change the volume
                    console.log('[ OK ] Speaker is valid. Changing volume.');
                    if (volumeChangeSlot.value == 'up' || volumeChangeSlot.value == 'louder') {
                            // turn it up
                            speechOutput = "Turning up the " + userHomeState.speakers[speaker].name + ".";
                            shouldEndSession = true;
                            var currentVolume = userHomeState.speakers[speaker].currentVolume;
                            var newVolumeUp = parseInt(currentVolume) + parseInt(volumeDelta);
                            var commandURI = 'http://alexabridge.zwrose.com/api/homeKeys/pushKey?bridgeID=' + bridgeID + '&url=/' 
                            + encodeURIComponent(userHomeState.speakers[speaker].name) + '/volume/' + newVolumeUp;

                            console.log(commandURI);
                            http.get(commandURI, function(res) {
                                res.resume();
                                res.on('end', function(){
                                    console.log('[ OK ] Request complete. Sending response to Alexa.');
                                    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));

                                });
                            });
                        
                            
                        } else {
                            // turn it down
                            speechOutput = "Turning down the " + userHomeState.speakers[speaker].name + ".";
                            shouldEndSession = true;
                            var currentVolume = userHomeState.speakers[speaker].currentVolume;
                            var newVolumeDown = parseInt(currentVolume) - parseInt(volumeDelta);
                            var commandURI = 'http://alexabridge.zwrose.com/api/homeKeys/pushKey?bridgeID=' + bridgeID + '&url=/' 
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
                    
                } else {
                    // speaker not foung
                    console.log('[ WARN ] Speaker is not a vaild option.');
                    speechOutput = "I don't see a speaker named " + speaker + " on your network. Please try again!";
                    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                    
                }
                
            } else {
                console.log('[ OK ] No speaker sent. Investigating...');

                if (userHomeState.zonesPlaying.length == 1) {
                    // there's no more than 1 zone playing
                    
                    if (userHomeState.speakers[userHomeState.zonesPlaying[0]].isMaster) {
                        
                        console.log('[ WARN ] Multiple are speakers active, none specified. Asking for clarification.');
                        speechOutput = "Multiple speakers are active. Please try again and specify where you'd like to change the volume. Say something like 'Turn up the living room.'.";
                        callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                        
                    } else {
                        // just one speaker is playing - do the thing.
                        if (volumeChangeSlot.value == 'up' || volumeChangeSlot.value == 'louder') {
                            // turn it up
                            speechOutput = "Turning up the " + userHomeState.speakers[userHomeState.zonesPlaying[0]] + ".";
                            shouldEndSession = true;
                            var currentVolume = userHomeState.speakers[userHomeState.zonesPlaying[0]].currentVolume;
                            var newVolumeUp = parseInt(currentVolume) + parseInt(volumeDelta);
                            var commandURI = 'http://alexabridge.zwrose.com/api/homeKeys/pushKey?bridgeID=' + bridgeID + '&url=/' 
                            + encodeURIComponent(userHomeState.speakers[userHomeState.zonesPlaying[0]].name) + '/volume/' + newVolumeUp;

                            console.log(commandURI);
                            http.get(commandURI, function(res) {
                                res.resume();
                                res.on('end', function(){
                                    console.log('[ OK ] Request complete. Sending response to Alexa.');
                                    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));

                                });
                            });
                            
                        } else {
                            // turn it down
                            peechOutput = "Turning down the " + userHomeState.speakers[userHomeState.zonesPlaying[0]] + ".";
                            shouldEndSession = true;
                            var currentVolume = userHomeState.speakers[userHomeState.zonesPlaying[0]].currentVolume;
                            var newVolumeDown = parseInt(currentVolume) - parseInt(volumeDelta);
                            var commandURI = 'http://alexabridge.zwrose.com/api/homeKeys/pushKey?bridgeID=' + bridgeID + '&url=/' 
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
     
                } else {
                    // either nothing or multiple things are playing
                    console.log('[ WARN ]  Either multiple or zero speakers active, none specified. Asking for clarification.');
                    speechOutput = "Either zero or multiple speakers or groups are active. Please try again and specify where you'd like to change the volume. Say something like 'Turn up the living room.'.";
                    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                    
                }
                
            }
            
        });
        
    }

    
}

function PlayPresetToSpeakerIntent(intent, session, callback) {
    var cardTitle = intent.name;
    var presetSlot = intent.slots.Preset;
    var preset = presetSlot.value;
    var speakerSlot = intent.slots.Speaker;
    var speaker = speakerSlot.value.toLowerCase();
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var availablePresets = ['1','2','3','4','5','6'];
    var alexaID = session.user.userId.slice(23);

    /**
     * NOTICE: you must escape speaker names before making them part of a request back to the server.
     */
    getBoseHomeState(alexaID, function(userHomeState, bridgeID) {
        if (presetSlot && speakerSlot) {
            
            // something is in both slots, need to verify what
            console.log('[ OK ] Received both a preset slot and a speaker slot from Alexa.');
            if (availablePresets.indexOf(preset) > -1) {
                
                // preset is valid, check speaker
                console.log('[ OK ] Preset is a valid option.');

                if (userHomeState.speakers.hasOwnProperty(speaker)) {
                    
                    // speaker is also valid, so play it!
                    console.log('[ OK ] Speaker is a valid option, too. Sending play request.');
                    
                    speechOutput = "Queueing up the jams on your " + speaker + " speaker. Enjoy!";
                    shouldEndSession = true;
                    var commandURI = 'http://alexabridge.zwrose.com/api/homeKeys/pushKey?bridgeID=' + bridgeID + '&url=/' 
                    + encodeURIComponent(userHomeState.speakers[speaker].name) + '/key/PRESET_' + encodeURIComponent(presetSlot.value);
                    
                    console.log(commandURI);
                    http.get(commandURI, function(res) {
                        res.resume();
                        res.on('end', function(){
                            console.log('[ OK ] Request complete. Sending response to Alexa.');
                            callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                            
                        });
                    });
    
                } else {
                    // speaker is not found, ask again
                    console.log('[ FAIL ] Speaker is not a vaild option.');
                    speechOutput = "I don't see a speaker named " + speaker + " on your network. Please try again!";
                    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                }
            } else {
                // preset number is invalid, ask again
                console.log('[ FAIL ] Preset is not a valid option.');
                speechOutput = "I heard preset number " + preset + ", but I only know presets one through six. Please try again!";
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            }
    
        } else {
            // in future will more gracefully handle only one piece of data present. for now just ask the user for the whole thing again.
            console.log('[ FAIL ] Did not receive both a preset slot and a speaker slot from Alexa.');
            speechOutput = "I didn't catch that. Please tell me what preset to play by saying something like, " + "Play preset 4 in the living room.";
            callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }
    });
}

function exitSkill (callback) {
    var cardTitle ="";
    var sessionAttributes = {};
    var speechOutput = "";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "";
    var shouldEndSession = true;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

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
    var alexaID = session.user.userId.slice(23);

    /**
     * NOTICE: you must escape speaker names before making them part of a request back to the server.
     */
    getBoseHomeState(alexaID, function(userHomeState, bridgeID) {
        // check if all slots were received
        if (actionSlot.hasOwnProperty('value') && masterSlot.hasOwnProperty('value') && slaveSlot.hasOwnProperty('value')) {
            var action = actionSlot.value.toLowerCase();
            var master = masterSlot.value.toLowerCase();
            var slave = slaveSlot.value.toLowerCase();
            console.log('[ OK ] Received an action and both a master slot and a slave slot from Alexa.');
            
            // check master validity
            if (userHomeState.speakers.hasOwnProperty(master) && userHomeState.zonesPlaying.indexOf(master) > -1) {
                
                console.log('[ OK ] Master is a valid option.');

                // check slave validity
                if (userHomeState.speakers.hasOwnProperty(slave)) {
                    
                    console.log('[ OK ] Slave is a valid option, too.');
                    
                    // check action validity
                    if(action == 'add') {
                        
                        console.log('[ OK ] Action is a valid option, too ("add"). Making grouping request');
                        
                        // is master actually a master, or not in a zone
                        if (userHomeState.speakers[master].isMaster) {
                            
                            // is a master, so need to just add slave
                            speechOutput = "Adding " + slave + " to your " + master + " group.";
                            shouldEndSession = true;
                            var commandURI = 'http://alexabridge.zwrose.com/api/homeKeys/pushKey?bridgeID=' + bridgeID + '&url=/' 
                            + encodeURIComponent(userHomeState.speakers[master].name) + '/addZoneSlave/' + encodeURIComponent(userHomeState.speakers[slave].name);
                            
                            console.log(commandURI);
                            http.get(commandURI, function(res) {
                                res.resume();
                                res.on('end', function(){
                                    console.log('[ OK ] Request complete. Sending response to Alexa.');
                                    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                                    
                                });
                            });
                            
                        } else {
                            
                            // not a master, so need to make zone
                            speechOutput = "Adding " + slave + " to your " + master + ", forming " + master + " group.";
                            shouldEndSession = true;
                            var commandURI = 'http://alexabridge.zwrose.com/api/homeKeys/pushKey?bridgeID=' + bridgeID + '&url=/' 
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
                    } else if (action == 'remove') {
                        
                        console.log('[ OK ] Action is a valid option, too ("remove"). Making grouping request');
                        
                        speechOutput = "Removing " + slave + " from your " + master + " group.";
                        shouldEndSession = true;
                        var commandURI = 'http://alexabridge.zwrose.com/api/homeKeys/pushKey?bridgeID=' + bridgeID + '&url=/' 
                        + encodeURIComponent(userHomeState.speakers[master].name) + '/removeZoneSlave/' + encodeURIComponent(userHomeState.speakers[slave].name);
                        
                        console.log(commandURI);
                        http.get(commandURI, function(res) {
                            res.resume();
                            res.on('end', function(){
                                console.log('[ OK ] Request complete. Sending response to Alexa.');
                                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                                
                            });
                        });
                    } else {
                        // Action is not vaild, ask again
                        console.log('[ FAIL ] Action is not a vaild option.');
                        speechOutput = "I can only add or remove speakers from other speakers. Please try again by saying something like: 'Add the kitchen to the living room. You must start with either the word 'add' or 'remove.''";
                        callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                    }
                    
                } else {
                    // slave is not found, ask again
                    console.log('[ FAIL ] Slave is not a vaild option.');
                    speechOutput = "I don't see a speaker named " + slave + " on your network. Please try again!";
                    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                }
            } else {
                // master is not found, ask again
                console.log('[ FAIL ] Master is not a valid option.');
                    speechOutput = "I don't see a speaker named " + master + " on your network that is currently playing or is a master speaker. You can only add speakers to a currently playing master speaker. Please try again!";
                    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            }
    
        } else {
            // in future will more gracefully handle only one piece of data present. for now just ask the user for the whole thing again.
            console.log('[ FAIL ] Did not receive all parts from Alexa.');
            speechOutput = "I didn't catch that. Please tell me how to adjust your playback groups by saying something like: 'Add the kitchen to the living room.' You must start with either the word 'add' or 'remove.'";
            callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }
        
    });
}

function PauseIntent(intent, session, callback) {
    console.log("Intents received: ",intent.slots);
    var cardTitle = intent.name;
    var speakerSlot = intent.slots.Speaker;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var alexaID = session.user.userId.slice(23);

    /**
     * NOTICE: you must escape speaker names before making them part of a request back to the server.
     */
    getBoseHomeState(alexaID, function(userHomeState, bridgeID) {
        // check if there is a speaker slot
        if (speakerSlot.value){
            var speaker = speakerSlot.value.toLowerCase();
            console.log('[ OK ] Speaker sent. Pausing if valid and playing.');
            
            if (userHomeState.speakers.hasOwnProperty(speaker)) {
                if (userHomeState.speakers[speaker].nowPlaying && userHomeState.speakers[speaker].nowPlaying.playStatus == "PLAY_STATE") {
                    // is playing
                    speechOutput = "Pausing the " + speaker + ".";
                    shouldEndSession = true;
                     var commandURI = 'http://alexabridge.zwrose.com/api/homeKeys/pushKey?bridgeID=' + bridgeID + '&url=/' 
                     + encodeURIComponent(userHomeState.speakers[speaker].name) + '/key/pause';
                    
                    console.log(commandURI);
                    http.get(commandURI, function(res) {
                        res.resume();
                        res.on('end', function(){
                            console.log('[ OK ] Request complete. Sending response to Alexa.');
                            callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                            
                        });
                    });
                    
                } else {
                    // isnt playing
                    console.log('[ OK ] Not playing, cannot pause. Exiting skill.');
                    speechOutput = speaker + " isn't playing...so it can't be paused!";
                    shouldEndSession = true;
                    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                    
                }
                
            } else {
                // speaker not found
                console.log('[ WARN ] Speaker is not a vaild option.');
                speechOutput = "I don't see a speaker named " + speaker + " on your network. Please try again!";
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            }
            
        } else {
            console.log('[ OK ] No speaker sent. Investigating...');
            if (userHomeState.zonesPlaying.length <= 0 || (userHomeState.zonesPlaying.length == 1 && userHomeState.speakers[userHomeState.zonesPlaying[0]].nowPlaying.playStatus == "PAUSE_STATE")) {
                console.log('[ OK ] Nothing is playing, cannot pause. Exiting skill.');
                speechOutput = "Nothing is playing...so nothing can be paused!";
                shouldEndSession = true;
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                
            } else if (userHomeState.zonesPlaying.length == 1 && userHomeState.speakers[userHomeState.zonesPlaying[0]].nowPlaying.playStatus == "PLAY_STATE") {
                speechOutput = "Pausing.";
                shouldEndSession = true;
                var commandURI = 'http://alexabridge.zwrose.com/api/homeKeys/pushKey?bridgeID=' + bridgeID + '&url=/' 
                + encodeURIComponent(userHomeState.speakers[userHomeState.zonesPlaying[0]].name) + '/key/pause';
                
                console.log(commandURI);
                http.get(commandURI, function(res) {
                    res.resume();
                    res.on('end', function(){
                        console.log('[ OK ] Request complete. Sending response to Alexa.');
                        callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                        
                    });
                });
                
            } else {
                console.log('[ WARN ] Multiple speakers active, none specified. Asking for clarification.');
                speechOutput = "Multiple speakers or groups are active. Please try again and specify which you'd like to pause. Say something like 'Pause the living room.'.";
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                
            }
            
        }
        
    });
}

function PlayIntent(intent, session, callback) {
    console.log("Intents received: ",intent.slots);
    var cardTitle = intent.name;
    var speakerSlot = intent.slots.Speaker;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var alexaID = session.user.userId.slice(23);

    /**
     * NOTICE: you must escape speaker names before making them part of a request back to the server.
     */
    getBoseHomeState(alexaID, function(userHomeState, bridgeID) {
        // check if there is a speaker slot
        if (speakerSlot.value){
            var speaker = speakerSlot.value.toLowerCase();
            console.log('[ OK ] Speaker sent. Playing if valid and paused.');
            if (userHomeState.speakers.hasOwnProperty(speaker)) {
                if (userHomeState.speakers[speaker].nowPlaying && userHomeState.speakers[speaker].nowPlaying.playStatus == "PAUSE_STATE") {
                    // is paused
                    speechOutput = "Playing the " + speaker + ".";
                    shouldEndSession = true;
                    var commandURI = 'http://alexabridge.zwrose.com/api/homeKeys/pushKey?bridgeID=' + bridgeID + '&url=/' 
                    + encodeURIComponent(userHomeState.speakers[speaker].name) + '/key/play';
                    
                    console.log(commandURI);
                    http.get(commandURI, function(res) {
                        res.resume();
                        res.on('end', function(){
                            console.log('[ OK ] Request complete. Sending response to Alexa.');
                            callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                            
                        });
                    });
                    
                } else if (userHomeState.speakers[speaker].nowPlaying && userHomeState.speakers[speaker].nowPlaying.playStatus == "PLAY_STATE") {
                    // isnt playing
                    console.log('[ OK ] Already playing, cannot play...more. Exiting skill.');
                    speechOutput = speaker + " is already playing!";
                    shouldEndSession = true;
                    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                    
                } else {
                    // is off
                    speechOutput = "Powering up and playing the " + speaker + ".";
                    shouldEndSession = true;
                    var commandURI = 'http://alexabridge.zwrose.com/api/homeKeys/pushKey?bridgeID=' + bridgeID + '&url=/' 
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
                
            } else {
                // speaker not found
                console.log('[ WARN ] Speaker is not a vaild option.');
                speechOutput = "I don't see a speaker named " + speaker + " on your network. Please try again!";
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            }

            
            
        } else {
            console.log('[ OK ] No speaker sent. Investigating...');
            console.log(userHomeState.zonesPlaying.length);
            console.log(userHomeState.speakers[userHomeState.zonesPlaying[0]].nowPlaying.playStatus);
            if (userHomeState.zonesPlaying.length <= 0 || (userHomeState.zonesPlaying.length == 1 && userHomeState.speakers[userHomeState.zonesPlaying[0]].nowPlaying.playStatus == "PLAY_STATE")) {
                console.log('[ OK ] Anything that is on is already playing.');
                speechOutput = "Everything that is on is already playing.";
                shouldEndSession = true;
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                
            } else if (userHomeState.zonesPlaying.length == 1 && userHomeState.speakers[userHomeState.zonesPlaying[0]].nowPlaying.playStatus == "PAUSE_STATE") {
                speechOutput = "Playing.";
                shouldEndSession = true;
                var commandURI = 'http://alexabridge.zwrose.com/api/homeKeys/pushKey?bridgeID=' + bridgeID + '&url=/' 
                + encodeURIComponent(userHomeState.speakers[userHomeState.zonesPlaying[0]].name) + '/key/play';
                
                console.log(commandURI);
                http.get(commandURI, function(res) {
                    res.resume();
                    res.on('end', function(){
                        console.log('[ OK ] Request complete. Sending response to Alexa.');
                        callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                        
                    });
                });
                
            } else {
                console.log('[ WARN ] Multiple speakers active, none specified. Asking for clarification.');
                speechOutput = "Multiple speakers or groups are active. Please try again and specify which you'd like to play. Say something like 'play the living room.'.";
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                
            }
            
        }
        
    });
}


// --------------- Helper that gets info about the state of the user's home -----------------------

function getBoseHomeState(alexaID, boseCallback) {
    http.get('http://alexabridge.zwrose.com/api/homeStates/' + bridgeID, function(res) {
        var homeStateBody = '';
        res.on('data', function(chunk) {homeStateBody += chunk;});
        res.on('end', function() {
            var homeState = JSON.parse(homeStateBody).currentState;
            if(!homeState){
                console.log("Home State not returned, creating new user.");
                
            } else {
                boseCallback(homeState, bridgeID);
            }
            
            
            

        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
}

// --------------- Helpers that build all of the responses -----------------------

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

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}