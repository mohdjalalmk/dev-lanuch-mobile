import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { Course } from '../utils/types';


type Props = {
  course: Course;
  enrolled: boolean;
  onPress: (event: GestureResponderEvent) => void;
};

export const CourseCard: React.FC<Props> = ({ course, enrolled, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={{ uri: course.thumbnail }} style={styles.thumbnail} />
    <Text style={styles.title}>{course.title}</Text>
    {enrolled && <Text style={styles.enrolled}>Enrolled</Text>}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#3a3a3a',
    padding: 10,
    borderRadius: 8,
    width: 200,
  },
  thumbnail: {
    width: '100%',
    height: 100,
    borderRadius: 6,
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  enrolled: {
    fontSize: 12,
    color: '#7cffb2',
  },
});
