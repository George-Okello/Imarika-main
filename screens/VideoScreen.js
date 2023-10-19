import React, { useRef, useState } from 'react';
import { Button, View, StyleSheet, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';

const VideoComponent = ({ videoSource }) => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handlePlayPauseToggle = () => {
    if (videoRef.current) {
      videoRef.current.seek(0); // Toggle video playback
      setIsPlaying(!isPlaying);
    }
  };
  
  const handlePlayPress = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
/*
  const handleVideoPress = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };
  */
 
  // style={[styles.videoContainer, { aspectRatio }]}
  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>{videoSource.title}</Text> */}
      <View >
        {/* Add TikTok-like UI elements */}
        <Text style={styles.text}>{videoSource.title}</Text>
        {/* Additional elements */}
      </View>
    
    <View>
      
    </View>
      <Video
        ref={videoRef}
        style={styles.video}
        resizeMode="contain"
       // poster={require('../assets/farmer_icon_191446(1).png')} // Specify your thumbnail image path
        //repeat={true}
        source={videoSource.source} 
        paused={isPlaying} // Pause the video when isPlaying is false
        onPlaybackStatusUpdate={status => setStatus(status)}
        //controls={true}
      />
        <TouchableOpacity onPress={handlePlayPauseToggle} style={styles.playPauseButton}>
        <Text>{isPlaying ? 'Pause' : 'Play'}</Text>
      </TouchableOpacity> 
      
    </View>
  );
};

export default function VideoScreen({ navigation }) {
  const videos = [
    {
      title: 'An introduction to Climate Smart Agriculture',
      source: require('../assets/Videos/CSAIntroduction.mp4')
    },
    {
      title: 'Trees - Introduction to Trees (Trees can provide multiple benefits on your shamba)',
      source: require('../assets/Videos/TreesIntro.mp4')
    },
    {
      title: 'Trees - Agroforestry (What is Agroforestry and what are the benefits?)',
      source: require('../assets/Videos/TreesAgroforestry.mp4')
    },
    {
      title: 'Trees - Pruning (Pruning for faster and better growth)',
      source: require('../assets/Videos/TreesPruning.mp4')
    },
    {
      title: 'Trees - Planting (How to plant avocado trees)',
      source: require('../assets/Videos/TreesPlanting.mp4')
    }
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        {videos.map((video, index) => (
          <VideoComponent key={index} videoSource={video} />

        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
// dr.ramani 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin:16,
    //backgroundColor: '#008462',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    height:'100%'
  },
  video: {
    flex: 1,
    height: 400,
  }, 
  playPauseButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }], // Center the button
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    //backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  text: {
   // textAlign: 'start',
    marginTop: 15,
    marginBottom: 2,
    fontWeight: 'bold',
    //color: '#008462',
    fontSize: 18,
    fontWeight: 'light', 
    //backgroundColor:'#008462',
    //paddingHorizontal:15,
    paddingVertical:5,
    //marginHorizontal:10,
    //borderRadius: 24
  },
  video: {
    //alignSelf: 'center',
    flex: 1,
    width: '100%',
    height: 200,
    alignSelf: 'stretch',
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
});
