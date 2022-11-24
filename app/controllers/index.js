var audioPlayer = Ti.Media.createAudioPlayer({
    allowBackground: true,
	//audioSessionCategory: Titanium.Media.AUDIO_SESSION_CATEGORY_PLAYBACK,
	url: "audio/example_audio.mp3",
});    

var tiRemoteControl = require("tiRemoteControl/tiRemoteControl");

function remoteControlFunctions(event) {
	Ti.API.debug('tiRemoteControlEvents type: ' + event.subtype);

   	// switch event.subtype
	switch(event.subtype) {
		case tiRemoteControl.UIEventSubtypeRemoteControlPlay:
			Ti.API.debug("Remote Control Event - Play");
			pauseResume();		
			break;
		case tiRemoteControl.UIEventSubtypeRemoteControlPause:
			Ti.API.debug("Remote Control Event - Pause");
			pauseResume();			
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

// tiRemoteControl.setNowPlayingInfo - to set nowPlayingInfo
tiRemoteControl.setNowPlayingInfo({
	artist: 'myArtist',															// artist string
	title: 'MyTitle',															// title string
	albumTitle: 'myAlbumTitle',                     							// albumTitle string
	localAlbumArtwork: 'images/artwork.png', 									// localAlbumArtwork local path and file name - make sure to set - tiapp.xml > use-app-thinning = false if you are not using these images anywhere else, or else they will be removed at compile
	//remoteAlbumArtwork : 'https://titaniumsdk.com/images/tidev-logo.png',		// remoteAlbumArtwork remote path
});

function updateNowPlayingInfo(){	
	// run tiRemoteControl.setNowPlayingInfo
	tiRemoteControl.setNowPlayingInfo({
		artist: 'updateArtist',															// artist string
		title: 'updateTitle',															// title string
	});
}

function removeEventListener(){	
	// removeEventListener tiRemoteControlEvents
	Ti.App.removeEventListener("tiRemoteControlEvents", remoteControlFunctions);
}

function startStop() {
    // When paused, playing returns false.
    // If both are false, playback is stopped.
    if (audioPlayer.playing || audioPlayer.paused) {      
		audioPlayer.stop();
        $.pauseResumeButton.enabled = false;
        audioPlayer.release();
		
		// tiRemoteControl.clearNowPlayingInfo - to clear NowPlayingInfo 
		tiRemoteControl.clearNowPlayingInfo();

		// removeEventListener tiRemoteControlEvents
		Ti.App.removeEventListener("tiRemoteControlEvents", remoteControlFunctions);

    } else {
		audioPlayer.start();		
        $.pauseResumeButton.enabled = true;
    };
}

function pauseResume() {
    if (audioPlayer.paused) {
		audioPlayer.start();
    } else {		
        audioPlayer.pause();
    };
}

audioPlayer.addEventListener('progress', function(e) {
    Ti.API.debug('Time Played: ' + Math.round(e.progress) + ' milliseconds');
});

audioPlayer.addEventListener('change', function(e) {
    Ti.API.debug('State: ' + e.description + ' (' + e.state + ')');
	
	// setNowPlayingInfoFunction rate,duration,progress for pause and play states of audioPlayer so that remote has correct timing at all times
	if(e.state == Titanium.Media.AUDIO_STATE_PAUSED || e.state == Titanium.Media.AUDIO_STATE_PLAYING){
		tiRemoteControl.setNowPlayingInfo({
			duration: audioPlayer.duration,			// duration of audio playing from audioPlayer
			progress: audioPlayer.progress,			// progress of audio playing from audioPlayer
			rate: audioPlayer.rate,					// rate of audio playing from audioPlayer
		})
	};        

});

$.mainWindow.add(audioPlayer);	
$.mainWindow.open();