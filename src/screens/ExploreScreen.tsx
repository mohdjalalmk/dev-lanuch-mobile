import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';
import debounce from 'lodash.debounce';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { CourseCard } from '../components/CourseCard';
import { fetchCoursesThunk, fetchEnrolledCourses } from '../slices/courseSlice';
import { RootState } from '../store';
import ScreenWrapper from '../components/ScreenWrapper';

const ExploreScreen = () => {
  const [search, setSearch] = useState('');
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<any>();

  const { groupedCourses, enrolledCourseIds } = useSelector(
    (state: RootState) => state.courses
  );  

  const debouncedFetch = useCallback(
    debounce((query: string) => {
      dispatch(fetchCoursesThunk(query));
    }, 400),
    []
  );

  useEffect(() => {
    dispatch(fetchCoursesThunk(''));
    dispatch(fetchEnrolledCourses());
  }, []);

  useEffect(() => {
    debouncedFetch(search);
  }, [search]);

  const viewCourse = (id: string) => {
    navigation.navigate('CourseDetail', { id });
  };

  return (
    <ScreenWrapper style={styles.container}>
        <Text style={styles.heading}>All Courses</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search courses..."
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
        />
<ScrollView>
      {groupedCourses.map((category: any) => (
        <View key={category.name} style={styles.categoryBlock}>
          <Text style={styles.categoryTitle}>{category.name}</Text>
          <FlatList
            data={category.courses}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <CourseCard
                course={item}
                enrolled={enrolledCourseIds.includes(item._id)}
                onPress={() => viewCourse(item._id)}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          />
        </View>
      ))}
    </ScrollView>
  </ScreenWrapper>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    gap: 24,
  },
  header: {
    marginBottom: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#2c2c2c',
    color: '#f0f0f0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#555',
  },
  categoryBlock: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 12,
  },
});
