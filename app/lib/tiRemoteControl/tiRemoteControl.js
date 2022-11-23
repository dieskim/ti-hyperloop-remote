// FOR this to work on Titanium.Media.VideoPlayer we will need to add a flag in the core sdk
// AVPlayerViewController updatesNowPlayingInfoCenter = false - https://stackoverflow.com/a/49471450/5234751 / https://stackoverflow.com/questions/39396224/mpnowplayinginfocenter-not-showing-details

Ti.API.debug("remoteControlModule Start")

exports.setNowPlayingInfo  = function(nowPlayingInfo){

    // require classes
    var MediaPlayer = require('MediaPlayer');
    var MPNowPlayingInfoCenterClass = require('MediaPlayer/MPNowPlayingInfoCenter');

    // set constants
    var MPMediaItemPropertyArtist = MediaPlayer.MPMediaItemPropertyArtist;
    var MPMediaItemPropertyTitle = MediaPlayer.MPMediaItemPropertyTitle;
    var MPMediaItemPropertyAlbumTitle = MediaPlayer.MPMediaItemPropertyAlbumTitle;
    var MPMediaItemPropertyArtwork = MediaPlayer.MPMediaItemPropertyArtwork;
    var MPMediaItemPropertyPlaybackDuration = MediaPlayer.MPMediaItemPropertyPlaybackDuration;
    var MPNowPlayingInfoPropertyElapsedPlaybackTime = MediaPlayer.MPNowPlayingInfoPropertyElapsedPlaybackTime;
    var MPNowPlayingInfoPropertyPlaybackRate = MediaPlayer.MPNowPlayingInfoPropertyPlaybackRate;

    // get current nowPlayingInfo
    var currentNowPlayingInfo = MPNowPlayingInfoCenterClass.defaultCenter().nowPlayingInfo;

    // create songInfo NSMutableDictionary
    var NSMutableDictionary = require('Foundation/NSMutableDictionary');
    var songInfo = new NSMutableDictionary();
    
    // set MPMediaItemPropertyArtist
    if(nowPlayingInfo.artist){
        songInfo.setObjectForKey(nowPlayingInfo.artist, MPMediaItemPropertyArtist);
    } else if (currentNowPlayingInfo.objectForKey(MPMediaItemPropertyArtist)){
        songInfo.setObjectForKey(currentNowPlayingInfo.objectForKey(MPMediaItemPropertyArtist), MPMediaItemPropertyArtist);
    };

    // set MPMediaItemPropertyTitle
    if(nowPlayingInfo.title){
        songInfo.setObjectForKey(nowPlayingInfo.title, MPMediaItemPropertyTitle);
    } else if (currentNowPlayingInfo.objectForKey(MPMediaItemPropertyTitle)){
        songInfo.setObjectForKey(currentNowPlayingInfo.objectForKey(MPMediaItemPropertyTitle), MPMediaItemPropertyTitle);
    };

    // set MPMediaItemPropertyAlbumTitle
    if(nowPlayingInfo.albumTitle){
        songInfo.setObjectForKey(nowPlayingInfo.albumTitle, MPMediaItemPropertyAlbumTitle);
    } else if (currentNowPlayingInfo.objectForKey(MPMediaItemPropertyAlbumTitle)){
        songInfo.setObjectForKey(currentNowPlayingInfo.objectForKey(MPMediaItemPropertyAlbumTitle), MPMediaItemPropertyAlbumTitle);
    };

    // MPMediaItemPropertyArtwork 
    if(nowPlayingInfo.localAlbumArtwork || nowPlayingInfo.remoteAlbumArtwork){
        if(nowPlayingInfo.localAlbumArtwork){
            // local file short method
            var UIImage = require('UIKit/UIImage');
            var albumArtworkUIImage = UIImage.imageNamed("images/artwork.png");
            // local file long method - better for system cache / memory according to apple - https://developer.apple.com/documentation/uikit/uiimage/1624146-imagenamed?language=objc
            //var NSBundle = require('Foundation/NSBundle');
            //var imagePath = NSBundle.mainBundle.pathForResourceOfType("images/artwork", "png");
            //Ti.API.debug(imagePath.toString());
            //var UIImage = require('UIKit/UIImage');
            //var albumArtworkUIImage = UIImage.alloc().initWithContentsOfFile(imageStringPath); 
        } else if(nowPlayingInfo.remoteAlbumArtwork){
            // remote file
            var NSURL = require('Foundation/NSURL');
            var imageURL = NSURL.alloc().initWithString();
            
            var NSData = require('Foundation/NSData');
            var imageData =  NSData.alloc().initWithContentsOfURL(imageURL);
            
            var UIImage = require('UIKit/UIImage');
            var albumArtworkUIImage = UIImage.alloc().initWithData(imageData);
        };

        // create MPMediaItemArtwork
        var MPMediaItemArtwork = MediaPlayer.MPMediaItemArtwork;
        var albumArtwork = MPMediaItemArtwork.alloc().initWithImage(albumArtworkUIImage)
        songInfo.setObjectForKey(albumArtwork, MPMediaItemPropertyArtwork)

    } else if (currentNowPlayingInfo.objectForKey(MPMediaItemPropertyArtwork)){
        songInfo.setObjectForKey(currentNowPlayingInfo.objectForKey(MPMediaItemPropertyArtwork), MPMediaItemPropertyArtwork)
    };

    // set MPMediaItemPropertyPlaybackDuration
    if(nowPlayingInfo.duration){
        songInfo.setObjectForKey((nowPlayingInfo.duration/1000), MPMediaItemPropertyPlaybackDuration);
    } else if (currentNowPlayingInfo.objectForKey(MPMediaItemPropertyPlaybackDuration)){
        songInfo.setObjectForKey(currentNowPlayingInfo.objectForKey(MPMediaItemPropertyPlaybackDuration), MPMediaItemPropertyPlaybackDuration)
    };

    // set MPNowPlayingInfoPropertyElapsedPlaybackTime
    if(nowPlayingInfo.progress){
        songInfo.setObjectForKey((nowPlayingInfo.progress/1000), MPNowPlayingInfoPropertyElapsedPlaybackTime);
    } else if (currentNowPlayingInfo.objectForKey(MPNowPlayingInfoPropertyElapsedPlaybackTime)){
        songInfo.setObjectForKey(currentNowPlayingInfo.objectForKey(MPNowPlayingInfoPropertyElapsedPlaybackTime), MPNowPlayingInfoPropertyElapsedPlaybackTime)
    };

    // set MPNowPlayingInfoPropertyPlaybackRate
    if(nowPlayingInfo.rate){
        songInfo.setObjectForKey(nowPlayingInfo.rate.toFixed(1), MPNowPlayingInfoPropertyPlaybackRate);
    } else if (currentNowPlayingInfo.objectForKey(MPNowPlayingInfoPropertyPlaybackRate)){
        songInfo.setObjectForKey(currentNowPlayingInfo.objectForKey(MPNowPlayingInfoPropertyPlaybackRate), MPNowPlayingInfoPropertyPlaybackRate)
    };

    Ti.API.debug("set nowPlayingInfo");
    MPNowPlayingInfoCenterClass.defaultCenter().nowPlayingInfo = songInfo;

    // leaving in case we ever need to do this - https://stackoverflow.com/questions/38993801/how-to-disable-all-the-mpremotecommand-objects-from-mpremotecommandcenter
    //var MPRemoteCommandCenter = require('MediaPlayer/MPRemoteCommandCenter');
    //MPRemoteCommandCenter.sharedCommandCenter().previousTrackCommand.enabled = "YES";
    //var dummyClass = Hyperloop.defineClass('dummyClass', 'NSObject');
    //dummyClass.addMethod({
    //    selector : 'dummyCommand:',
    //    instance : true,
    //    arguments : ['MPRemoteCommandEvent'],
    //    //returnType: 'MPRemoteCommandHandlerStatus', - this does not seem to work but adds return type as enum MPRemoteCommandHandlerStatus - manually editing the hyperloop class to return MPRemoteCommandHandlerStatus works
    //    callback : function(event) {
    //        Ti.API.debug("dummyClass event");
    //        //return MPRemoteCommandHandlerStatusSuccess;
    //    }
    //});
    //var dummy = dummyClass.alloc().init();
    //MPRemoteCommandCenter.sharedCommandCenter().previousTrackCommand.addTargetAction(dummy,"dummyCommand:");

}

exports.clearNowPlayingInfo = function(){
    var MPNowPlayingInfoCenterClass = require('MediaPlayer/MPNowPlayingInfoCenter');
    
    // create empty songInfo NSMutableDictionary
    var NSMutableDictionary = require('Foundation/NSMutableDictionary');
    var emptyInfo = new NSMutableDictionary();

    MPNowPlayingInfoCenterClass.defaultCenter().nowPlayingInfo = emptyInfo; // should be set to nil but not sure how to get a nil from javascript into native layer so using empty dictionary
}

exports.remoteControlEvents = function(eventData){

    // require classes
    var NotificationCenter = require('Foundation/NSNotificationCenter');
    var UIEvent = require('UIKit/UIEvent');

    // set constants
    var UIEventSubtypeRemoteControlPlay = require('UIKit').UIEventSubtypeRemoteControlPlay;
    var UIEventSubtypeRemoteControlPause = require('UIKit').UIEventSubtypeRemoteControlPause;
    var UIEventSubtypeRemoteControlStop = require('UIKit').UIEventSubtypeRemoteControlStop;
    var UIEventSubtypeRemoteControlTogglePlayPause = require('UIKit').UIEventSubtypeRemoteControlTogglePlayPause;
    var UIEventSubtypeRemoteControlNextTrack = require('UIKit').UIEventSubtypeRemoteControlNextTrack;
    var UIEventSubtypeRemoteControlPreviousTrack = require('UIKit').UIEventSubtypeRemoteControlPreviousTrack;
    var UIEventSubtypeRemoteControlBeginSeekingBackward = require('UIKit').UIEventSubtypeRemoteControlBeginSeekingBackward;
    var UIEventSubtypeRemoteControlEndSeekingBackward = require('UIKit').UIEventSubtypeRemoteControlEndSeekingBackward;
    var UIEventSubtypeRemoteControlBeginSeekingForward = require('UIKit').UIEventSubtypeRemoteControlBeginSeekingForward;
    var UIEventSubtypeRemoteControlEndSeekingForward = require('UIKit').UIEventSubtypeRemoteControlEndSeekingForward;

    // create remoteControlEvent class
    var remoteControlEvent = Hyperloop.defineClass('remoteControlEvent', 'NSObject');
    remoteControlEvent.addMethod({
        selector : 'handleEvent:',
        instance : true,
        arguments : ['NSNotification'],
        callback : function(notification) {
            
            // get notificationEvent by casting to UIEvent - notification as NSNotification - userInfo as NSDictionary - event as uievent (needs casting)
            var notificationEvent = UIEvent.cast(notification.userInfo.objectForKey("event"));
          
            Ti.API.debug("event subtype = " + notificationEvent.subtype);
            // switch event subtype
            switch(notificationEvent.subtype) {
                case UIEventSubtypeRemoteControlPlay:
                    Ti.API.debug("Remote Control Event - Play");
                    if(eventData.play){
                        eventData.play();
                    };
                    break;
                case UIEventSubtypeRemoteControlPause:
                    Ti.API.debug("Remote Control Event - Pause");
                    if(eventData.pause){
                        eventData.pause();
                    };
                    break;
                case UIEventSubtypeRemoteControlStop:
                    Ti.API.debug("Remote Control Event - Stop");
                    if(eventData.stop){
                        eventData.stop();
                    };
                    break;
                case UIEventSubtypeRemoteControlTogglePlayPause:
                    Ti.API.debug("Remote Control Event - TogglePlayPause");
                    if(eventData.togglePlayPause){
                        eventData.togglePlayPause();
                    };
                    break;
                case UIEventSubtypeRemoteControlNextTrack:
                    Ti.API.debug("Remote Control Event - Next");
                    if(eventData.next){
                        eventData.next();
                    };
                    break;
                case UIEventSubtypeRemoteControlPreviousTrack:
                    Ti.API.debug("Remote Control Event - Prev")
                    if(eventData.prev){
                        eventData.prev();
                    };
                    break;
                case UIEventSubtypeRemoteControlBeginSeekingBackward:
                    Ti.API.debug("Remote Control Event - BeginSeekingBackward");
                    if(eventData.beginSeekingBackward){
                        eventData.beginSeekingBackward();
                    };
                    break;
                case UIEventSubtypeRemoteControlEndSeekingBackward:
                    Ti.API.debug("Remote Control Event - EndSeekingBackward");
                    if(eventData.endSeekingBackward){
                        eventData.endSeekingBackward();
                    };
                    break;
                case UIEventSubtypeRemoteControlBeginSeekingForward:
                    Ti.API.debug("Remote Control Event - BeginSeekingForward");
                    if(eventData.beginSeekingForward){
                        eventData.beginSeekingForward();
                    };
                    break;
                case UIEventSubtypeRemoteControlEndSeekingForward:
                    Ti.API.debug("Remote Control Event - EndSeekingForward");
                     if(eventData.endSeekingForward){
                        eventData.endSeekingForward();
                    };
                    break;
                default:
                    Ti.API.debug("Remote Control Event not handled with subtype = " + notificationEvent.subtype);
            }
        }
    });

    // init remoteControlEvent class and add to NotificationCenter listening for events with name TiRemoteControl - https://github.com/tidev/titanium_mobile/blob/master/iphone/TitaniumKit/TitaniumKit/Sources/API/TiRootViewController.m#L205
    var remoteEvent = remoteControlEvent.alloc().init();
    NotificationCenter.defaultCenter.addObserverSelectorNameObject(remoteEvent,'handleEvent:','TiRemoteControl',null);

}