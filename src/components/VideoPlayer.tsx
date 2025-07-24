import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import VideoControls from 'react-native-video-controls';
import Orientation, {
  OrientationType,
} from 'react-native-orientation-locker';

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
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoRef = useRef<any>(null);

  useEffect(() => {
    const handleOrientationChange = (orientation: OrientationType) => {
      if (orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT') {
        setIsFullscreen(true);
      } else if (orientation === 'PORTRAIT') {
        setIsFullscreen(false);
      }
    };

    Orientation.addOrientationListener(handleOrientationChange);

    return () => {
      Orientation.removeOrientationListener(handleOrientationChange);
      Orientation.lockToPortrait(); // reset on exit
    };
  }, []);

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
    <View style={isFullscreen ? styles.fullscreenContainer : styles.container}>
      <VideoControls
        ref={videoRef}
        source={{ uri }}
        poster={thumbnail}
        posterResizeMode="cover"
        paused={paused}
        onEnd={onEnd}
        resizeMode="contain"
        volume={1.0}
        muted={false}
        disableVolume={false}
        style={styles.video}
        onEnterFullscreen={() => {
          Orientation.lockToLandscape();
        }}
        onExitFullscreen={() => {
          Orientation.lockToPortrait();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: (width * 9) / 16,
  },
  fullscreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').height,
    height: Dimensions.get('window').width,
    backgroundColor: '#000',
    zIndex: 999,
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
