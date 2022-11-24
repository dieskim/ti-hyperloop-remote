# ti-hyperloop-remote

Titanium Hyperloop Module allows your Titanium iOS applications to update the MPNowPlayingInfoCenter and get RemoteControl Events.

# How to Use

```javascript
// 1. Add tiRemoteControl.js to app/lib/tiRemoteControl/tiRemoteControl.js

// 2. Require module
var tiRemoteControl = require("tiRemoteControl/tiRemoteControl");

// 3. Subscribe to events and handle as needed
function remoteControlFunctions(event) {
	Ti.API.debug('tiRemoteControlEvents type: ' + event.subtype);

   	// switch event.subtype
	switch(event.subtype) {
		case tiRemoteControl.UIEventSubtypeRemoteControlPlay:
			Ti.API.debug("Remote Control Event - Play");	
			break;
		case tiRemoteControl.UIEventSubtypeRemoteControlPause:
			Ti.API.debug("Remote Control Event - Pause");		
			break;
		case tiRemoteControl.UIEventSubtypeRemoteControlStop:
			Ti.API.debug("Remote Control Event - Stop");		
			break;
		case tiRemoteControl.UIEventSubtypeRemoteControlTogglePlayPause:
			Ti.API.debug("Remote Control Event - TogglePlayPause");			
			break;
		case tiRemoteControl.UIEventSubtypeRemoteControlNextTrack:
			Ti.API.debug("Remote Control Event - Next");			
			break;
		case tiRemoteControl.UIEventSubtypeRemoteControlPreviousTrack:
			Ti.API.debug("Remote Control Event - Prev");	
			break;
		case tiRemoteControl.UIEventSubtypeRemoteControlBeginSeekingBackward:
			Ti.API.debug("Remote Control Event - BeginSeekingBackward");		
			break;
		case tiRemoteControl.UIEventSubtypeRemoteControlEndSeekingBackward:
			Ti.API.debug("Remote Control Event - EndSeekingBackward");			
			break;
		case tiRemoteControl.UIEventSubtypeRemoteControlBeginSeekingForward:
			Ti.API.debug("Remote Control Event - BeginSeekingForward");
			break;
		case tiRemoteControl.UIEventSubtypeRemoteControlEndSeekingForward:
			Ti.API.debug("Remote Control Event - EndSeekingForward");
			break;
		default:
			Ti.API.debug("Remote Control Event not handled with subtype = " + event.subtype);
	}
};

// addEventListener for tiRemoteControlEvents
Ti.App.addEventListener("tiRemoteControlEvents", remoteControlFunctions);

// 4. Set nowPlayingInfo - run any time to update nowPlayingInfo
tiRemoteControl.setNowPlayingInfo({
    artist: 'myArtist',															// artist string
    title: 'MyTitle',															// title string
    albumTitle: 'myAlbumTitle',                     							// albumTitle string
    localAlbumArtwork: 'images/artwork.png', 									// localAlbumArtwork local path and file name - Note: set - tiapp.xml > use-app-thinning = false if not using these images anywhere else, or else they will be removed at compile
    //remoteAlbumArtwork : 'https://titaniumsdk.com/images/tidev-logo.png',		// remoteAlbumArtwork remote path
});

// 5. add audioPlayer 'change' event listener to set nowPlayingInfo rate,duration,progress for pause and play states of audioPlayer so that remote has correct timing at all times
audioPlayer.addEventListener('change', function(e) {
    Ti.API.debug('State: ' + e.description + ' (' + e.state + ')');
	
	if(e.state == Titanium.Media.AUDIO_STATE_PAUSED || e.state == Titanium.Media.AUDIO_STATE_PLAYING){
		tiRemoteControl.setNowPlayingInfo({
			duration: audioPlayer.duration,			// duration of audio playing from audioPlayer
			progress: audioPlayer.progress,			// progress of audio playing from audioPlayer
			rate: audioPlayer.rate,					// rate of audio playing from audioPlayer
		})
	};        

});

// 5. Clear nowPlayingInfo when needed
tiRemoteControl.clearNowPlayingInfo();

// 6. removeEventListener when needed
Ti.App.removeEventListener("tiRemoteControlEvents", remoteControlFunctions);

```

## Notes

For this to work on Titanium.Media.VideoPlayer we will need to add a flag in the core sdk
- AVPlayerViewController updatesNowPlayingInfoCenter = false - See: https://stackoverflow.com/a/49471450/5234751 / https://stackoverflow.com/questions/39396224/mpnowplayinginfocenter-not-showing-details


## Contributing

Titanium is an open source project.  Titanium wouldn't be where it is now without contributions by the community. Please consider forking Titanium to improve, enhance or fix issues. If you feel like the community will benefit from your fork, please open a pull request.

To protect the interests of the Titanium contributors, Appcelerator, customers and end users we require contributors to sign a Contributors License Agreement (CLA) before we pull the changes into the main repository. Our CLA is simple and straightforward - it requires that the contributions you make to any Appcelerator open source project are properly licensed and that you have the legal authority to make those changes. This helps us significantly reduce future legal risk for everyone involved. It is easy, helps everyone, takes only a few minutes, and only needs to be completed once.

[You can digitally sign the CLA](https://github.com/tidev/organization-docs/blob/main/AUTHORIZED_CONTRIBUTORS.md) online. Please indicate your email address in your first pull request so that we can make sure that will locate your CLA.  Once you've submitted it, you no longer need to send one for subsequent submissions.

## Stay Connected

For the latest information, please find us on Twitter: [Titanium SDK](https://twitter.com/titaniumsdk) and [TiDev](https://twitter.com/tidevio).

Join our growing Slack community by visiting https://slack.tidev.io

## Legal

Titanium is a registered trademark of TiDev Inc. All Titanium trademark and patent rights were transferred and assigned to TiDev Inc. on 4/7/2022. Please see the LEGAL information about using our trademarks, privacy policy, terms of usage and other legal information at https://tidev.io/legal.
