import React from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import VideoControls from 'react-native-video-controls';

const { width } = Dimensions.get('window');

type VideoPlayerProps = {
  uri: string;
  thumbnail?: string;
  isLocked?: boolean;
  onEnd?: () => void;
  paused?: boolean;
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  uri,
  thumbnail,
  isLocked = false,
  onEnd,
  paused = false,
}) => {
  if (isLocked) {
    return (
      <View style={[styles.container, styles.locked]}>
        <Image
          source={{ uri: thumbnail }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VideoControls
        source={{ uri }}
        poster={thumbnail}
        posterResizeMode="cover"
        paused={paused}
        onEnd={onEnd}
        resizeMode="contain"
        style={styles.video}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: (width * 9) / 16, // 16:9 ratio
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  locked: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
});
