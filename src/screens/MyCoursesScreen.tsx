import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MyCoursesScreen() {
  return (
    <View style={styles.container}>
      <Text>My Courses Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 