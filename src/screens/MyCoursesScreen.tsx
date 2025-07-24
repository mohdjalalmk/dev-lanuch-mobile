import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEnrolledCourses } from '../slices/courseSlice';
import { RootState } from '../store';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';

const MyCoursesScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const { enrolledCourses, loading, error } = useSelector(
    (state: RootState) => state?.courses
  );

  useEffect(() => {
    dispatch(fetchEnrolledCourses() as any);
  }, []);

  const renderCourse = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CourseDetail', { id: item.courseId._id })}
    >
      <Image source={{ uri: item.courseId.thumbnail }} style={styles.thumbnail} />
      <Text style={styles.title}>{item.courseId.title}</Text>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${item.progress}%` }]}
          />
        </View>
        <Text style={styles.progressText}>{item.progress}%</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3fc488" />
      </View>
    );
  }

  if (!loading && enrolledCourses?.length === 0) {
    return (
      <ScreenWrapper style={styles.center}>
        <Text style={styles.emptyText}>You haven’t enrolled in any courses yet.</Text>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
    <FlatList
      data={enrolledCourses}
      renderItem={renderCourse}
      keyExtractor={item => item.courseId._id}
      numColumns={2}
      contentContainerStyle={styles.list}
    />
    </ScreenWrapper>
  );
};

export default MyCoursesScreen;

const cardWidth = Dimensions.get('window').width / 2 - 24;

const styles = StyleSheet.create({
  list: {
    padding: 12,
  },
  card: {
    backgroundColor: '#ecf0f3ff',
    margin: 6,
    borderRadius: 8,
    padding: 10,
    width: cardWidth,
  },
  thumbnail: {
    width: '100%',
    height: 100,
    borderRadius: 6,
    marginBottom: 8,
  },
  title: {
    color: '#000',
    fontSize: 14,
    marginBottom: 6,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#444',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3fc488',
    borderRadius: 4,
  },
  progressText: {
    color: '#000',
    fontSize: 12,
    minWidth: 30,
    textAlign: 'right',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#ccc',
  },
});
