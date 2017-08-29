var skillResp = { // All responses from the skill
  'getWelcomeResponse': {
    'de': "Willkommen zu Bose SoundTouch! Du kannst diesen Skill nutzen um die Wiedergabe zu starten oder pausieren, Musik zu überspringen, die Lautstärke zu regeln oder Wiedergabegruppen zu erstellen. Um zu starten sage etwas wie Spiele Einstellung 1 in meinem Wohnzimmer.",
    'en': "Welcome to Bose SoundTouch! You can use this skill to start playback, create or collapse groups, play, pause, and/or skip your music, or change the volume of your SoundTouch devices. To start the music, say something like, Play preset 4 in the living room."
  },
  'getWelcomeResponseRepromt': {
    'de': "Bitte sag mir was ich tun soll. Du kannst die Wiedergabe starten indem du sagst 'spiele Einstellung 1 im Wohnzimmer.'.",
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
    'de': "Ich habe dich leider nicht verstanden. Wenn du die Laustärke ändern möchtest, dann benutze die Wörter hoch, lauter, rauf, höher, mehr oder leiser, runter, weniger. Sage soetwas wie 'Musik leiser im Schlafzimmer.' oder 'leiser Schlafzimmer.'",
    'en': "I didn't understand that. If you are trying to change the volume, please ask again using the words up, louder, down, or softer. Say something like, 'Turn up the living room.'"
  },
  'VolumeChangeIntentErrorMultipleSpeakers': {
    'de': "Verschiedene Lautsprecher oder Gruppen sind derzeit aktiv. Bitte versuche es erneut und gib dabei an wo du die Laustärke ändern möchtest. Sage soetwas wie 'Musik leiser im Schlafzimmer.' oder 'leiser Schlafzimmer.'",
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
    'de': "Ich habe dich leider nicht verstanden. Bitte sage mir welche Einstellung du auf welchem Lautsprecher wiedergeben willst, indem du etwas sagst wie 'spiele Einstellung 1 im Wohnzimmer.'.",
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
    'de': "Ich kann Lautsprecher nur zu anderen Lausprechern hinzufügen oder entfernen. Bitte versuche es erneut und sage etwas wie 'Verbinde den Lautsprecher Küche mit dem Schlafzimmer.'.",
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
    'de': "Ich habe dich leider nicht verstanden. Um Lautsprecher-Gruppen zu erstellen, sage etwas wie 'Füge Lautsprecher Küche zu Lautsprecher Schlafzimmer hinzu.'.",
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
    'de': "Verschiedene Lautsprecher oder Gruppen sind derzeit aktiv. Bitte versuche es erneut und gib dabei an wo du die Wiedergabe pausieren möchtest. Sage etwas wie 'Pausiere Küche.'.",
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
    'de': "Verschiedene Lautsprecher oder Gruppen sind derzeit aktiv. Bitte versuche es erneut und gib an wo du die Wiedergabe starten möchtest. Sage etwas wie 'Spiele Musik im Wohnzimmer.'.",
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
    'de': "Verschiedene Lautsprecher oder Gruppen sind derzeit aktiv. Bitte versuche es erneut und gib an wo du die Wiedergabe stoppen willst. Sage etwas wie 'Stoppe die Wiedergabe im Wohnzimmer.'.",
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
