# An Experimental Alexa Skill for SoundTouch - Alexa Skill Component
## Overview
This repository contains one of the three components necessary enable Alexa to control Bose SoundTouch speakers. The other two required components are:
+ [AlexaSoundTouch\_RemoteServer](https://github.com/zwrose/AlexaSoundTouch_RemoteServer)
+ [AlexaSoundTouch\_LocalServer](https://github.com/zwrose/AlexaSoundTouch_LocalServer)

This Alexa Skill Component includes an AWS Lambda function to serve as the logic engine for the skill, as well as the speech assets necessary to build the voice interaction model. The Lambda function talks to an AlexaSoundTouch\_RemoteServer instance to understand the current home environment and to queue up commands for the speakers.

## Setup
These instructions assume you already have set up or otherwise have access to an [AlexaSoundTouch\_RemoteServer](https://github.com/zwrose/AlexaSoundTouch_RemoteServer) instance.

1. From the [AWS Console](https://console.aws.amazon.com), create a Lambda function based on the alexa-skills-kit-color-expert nodejs blueprint.
2. In Step 3 of the Lambda Function configuration, copy the contents of src/index.js from this repository into the Lambda Function Code field.
3. Replace the placeholder bridgeBasePath variable (line 14) with the base path to your AlexaSoundTouch\_RemoteServer instance. Be sure to include "http://" or "https://" in the string.
4. Complete the function using the recommended defaults.
5. From the [Amazon Developer console](http://developer.amazon.com), go to Apps & Services >>> Alexa >>> Alexa Skills Kit >>> Add a new skill
6. Use the wizard to create the skill. Recommended to use "bose" as the invocation word. Use the ARN from your Lambda function for your Endpoint, and use the assets from /speechAssets in this repository when defining the interaction model. Add any of your custom speaker names to the LIST\_OF\_SPEAKERS. Use either the english assets from /en or the german assets from /de to configure your Alexa skill.
7. Proceed to the Test step and ensure the skill is enabled on your account. Go to the Service Simlulator, type in "ask bose to pause". You should see a response saying that the corresponding home was created or doesn't have and speakers associated with it. That response will also contain an AlexaID - use this to configure your AlexaSoundTouch\_LocalServer instance (the bridgeID var in server.js of the Local Server should be set as this AlexaID).

Now proceed to [AlexaSoundTouch\_LocalServer](https://github.com/zwrose/AlexaSoundTouch_LocalServer) setup. Once that instance is also up and running, you should be able to proceed with using the skill!

## Supported Commands
The below are general examples of possible skill usage. Many other word permutations around the listed functionality will also work.

Where possible, the skill will try to be smart about generic requests (e.g., if you ask it to pause without specifying a speaker and only one speaker is playing, it will pause that speaker.)

### Starting Playback
+ "ask bose to play preset \<1-6> on the \<speaker name>"
+ "ask bose to play on the \<speaker name>"

### Controlling Ongoing Playback
+ "ask bose to pause (the \<speaker name>)"
+ "ask bose to play (the \<speaker name>)"
+ "ask bose to skip (the \<speaker name>)"
+ "ask bose to skip back (the \<speaker name>)"
+ "ask bose to turn (it) up (the \<speaker name>)"
+ "ask bose to turn (it) down (the \<speaker name>)"

### Grouping Control
+ "ask bose to add my \<Speaker 1 name> to my \<Speaker 2 name> (Speaker 2 must already be playing)
+ "ask bose to remove my \<Speaker 1 name> from my \<Speaker 2 name> (Speaker 1 and Speaker 2 must be in a group together, and Speaker 2 must be the master)

### Shutting It Down
+ "ask bose to turn off (the \<speaker name>)
