import React, { useRef, useState } from 'react';
import { Button, View, StyleSheet, Text, SafeAreaView, ScrollView } from 'react-native';
import Video from 'react-native-video';

const VideoComponent = ({ videoSource }) => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{videoSource.title}</Text>
      <Video
        ref={videoRef}
        style={styles.video}
        source={videoSource.source}
        resizeMode="contain"
        // repeat={true}
        onPlaybackStatusUpdate={status => setStatus(status)}
        controls={true}
      />
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#008462" }}>
      <ScrollView>
        {videos.map((video, index) => (
          <VideoComponent key={index} videoSource={video} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#008462',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  text: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontWeight: '500',
    color: 'white'
  },
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
});
