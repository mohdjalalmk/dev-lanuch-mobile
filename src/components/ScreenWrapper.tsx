import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

type ScreenWrapperProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
};

const ScreenWrapper = ({
  children,
  style,
  backgroundColor = '#303641',
}: ScreenWrapperProps) => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
          style,
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default ScreenWrapper;
