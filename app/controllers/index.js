var audioPlayer = Ti.Media.createAudioPlayer({
    allowBackground: true,
	//audioSessionCategory: Titanium.Media.AUDIO_SESSION_CATEGORY_PLAYBACK,
	url: "audio/example_audio.mp3",
});    

var tiRemoteControl = require("tiRemoteControl/tiRemoteControl");

function updateNowPlayingInfo(){	
	// run tiRemoteControl.setNowPlayingInfo
	tiRemoteControl.setNowPlayingInfo({
		artist: 'updateArtist',															// artist string
		title: 'updateTitle',															// title string
	});
}

// run tiRemoteControl.remoteControlEvents - to get events back from remoteControl
tiRemoteControl.remoteControlEvents({
	play: function(){
		Ti.API.debug("remoteControlEventListener - Play");
		 pauseResume()
	},
	pause: function(){
		Ti.API.debug("remoteControlEventListener - pause");
		 pauseResume()
	},
	stop: function(){
		Ti.API.debug("remoteControlEventListener - stop");
	},
	togglePlayPause: function(){
		Ti.API.debug("remoteControlEventListener - togglePlayPause");
	},
	togglePlayPause: function(){
		Ti.API.debug("remoteControlEventListener - togglePlayPause");
	},
	next: function(){
		Ti.API.debug("remoteControlEventListener - next");
	},
	prev: function(){
		Ti.API.debug("remoteControlEventListener - prev");
	},
	beginSeekingBackward: function(){
		Ti.API.debug("remoteControlEventListener - beginSeekingBackward");
	},
	endSeekingBackward: function(){
		Ti.API.debug("remoteControlEventListener - endSeekingBackward");
	},
	beginSeekingForward: function(){
		Ti.API.debug("remoteControlEventListener - beginSeekingForward");
	},
	endSeekingForward: function(){
		Ti.API.debug("remoteControlEventListener - endSeekingForward");
	},
});



function startStop() {
    // When paused, playing returns false.
    // If both are false, playback is stopped.
    if (audioPlayer.playing || audioPlayer.paused) {
        
		audioPlayer.stop();
        $.pauseResumeButton.enabled = false;
        audioPlayer.release();
		
		// tiRemoteControl.clearNowPlayingInfo - to clear NowPlayingInfo 
		tiRemoteControl.clearNowPlayingInfo();

    } else {

		// tiRemoteControl.setNowPlayingInfo - to set nowPlayingInfo
		tiRemoteControl.setNowPlayingInfo({
			artist: 'myArtist',															// artist string
			title: 'MyTitle',															// title string
			albumTitle: 'myAlbumTitle',                     							// albumTitle string
			localAlbumArtwork: 'images/artwork.png', 									// localAlbumArtwork local path and file name - make sure to set - tiapp.xml > use-app-thinning = false if you are not using these images anywhere else, or else they will be removed at compile
			//remoteAlbumArtwork : 'https://titaniumsdk.com/images/tidev-logo.png',		// remoteAlbumArtwork remote path
		});

		audioPlayer.start();		
        $.pauseResumeButton.enabled = true;
    }
}

function pauseResume() {
    if (audioPlayer.paused) {
		audioPlayer.start();
    } else {		
        audioPlayer.pause();
    }
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