import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { getUserProfile } from '../slices/userSlice';
import { deleteUser, logoutUser } from '../slices/authSlice';
import ScreenWrapper from '../components/ScreenWrapper';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state: RootState) => state?.user);
  const completedCourses = user?.enrolledCourses?.filter(
    course => course.progress === 100,
  ).length;

  useEffect(() => {
    dispatch(getUserProfile() as any);
  }, []);

  const handleLogout = async () => {
    dispatch(logoutUser() as any);
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete your account? This action is irreversible.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await dispatch(deleteUser() as any);
          },
        },
      ],
    );
  };

  if (loading || !user) {
    return (
      <ScreenWrapper style={styles.loader}>
        <ActivityIndicator size="large" color="#007aff" />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://placehold.co/120x120?text=Avatar' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.role}>{user.role.toUpperCase()}</Text>

        <View style={styles.statContainer}>
          <Text style={styles.statTitle}>Enrolled Courses</Text>
          <Text style={styles.stat}>{user.enrolledCourses.length}</Text>
        </View>

        <View style={styles.statContainer}>
          <Text style={styles.statTitle}>Completed Courses</Text>
          <Text style={styles.stat}>{completedCourses}</Text>
        </View>

        <Button
          mode="outlined"
          style={styles.logoutButton}
          labelStyle={styles.logoutLabel}
          onPress={handleLogout}
        >
          Logout
        </Button>

        <Button
          mode="text"
          textColor="#d11a2a"
          onPress={handleDelete}
          style={styles.deleteButton}
        >
          Delete My Account
        </Button>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 24,
    width: '90%',
    borderRadius: 16,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
  },
  email: {
    fontSize: 16,
    color: '#777',
    marginBottom: 6,
  },
  role: {
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
    fontWeight: '500',
  },
  statContainer: {
    backgroundColor: '#f2f2f2',
    width: '100%',
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 14,
    color: '#444',
  },
  stat: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007aff',
  },
  logoutButton: {
    marginTop: 20,
    width: '100%',
    borderColor: '#007aff',
  },
  logoutLabel: {
    color: '#007aff',
    fontWeight: '500',
  },
  deleteButton: {
    marginTop: 8,
  },
});

export default ProfileScreen;
