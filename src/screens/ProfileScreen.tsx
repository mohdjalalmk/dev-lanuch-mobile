import React, { useEffect, useState } from 'react';
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
import ConfirmationModal from '../components/ConfirmationModal';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state: RootState) => state?.user);
  const completedCourses = user?.enrolledCourses?.filter(
    course => course.progress === 100,
  ).length;

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmProps, setConfirmProps] = useState({
    title: '',
    message: '',
    iconName: 'warning-outline',
    iconColor: '#f44336',
    confirmText: 'Confirm',
  });

  useEffect(() => {
    dispatch(getUserProfile() as any);
  }, []);

  const handleLogout = () => {
    setConfirmProps({
      title: 'Logout',
      message: 'Are you sure you want to log out?',
      iconName: 'log-out-outline',
      iconColor: '#3fc488',
      confirmText: 'Logout',
    });
    setConfirmAction(() => () => dispatch(logoutUser() as any));
    setConfirmVisible(true);
  };

  const handleDelete = () => {
    setConfirmProps({
      title: 'Delete Account',
      message:
        'This will permanently delete your account and cannot be undone.',
      iconName: 'trash-outline',
      iconColor: '#d11a2a',
      confirmText: 'Delete',
    });
    setConfirmAction(() => () => dispatch(deleteUser() as any));
    setConfirmVisible(true);
  };

  if (loading || !user) {
    return (
      <ScreenWrapper style={styles.loader}>
        <ActivityIndicator size="large" color="#3fc488" />
      </ScreenWrapper>
    );
  }

  const ConfiormPopUp = () => (
    <ConfirmationModal
      visible={confirmVisible}
      title={confirmProps.title}
      message={confirmProps.message}
      iconName={confirmProps.iconName}
      iconColor={confirmProps.iconColor}
      confirmText={confirmProps.confirmText}
      onConfirm={() => {
        confirmAction();
        setConfirmVisible(false);
      }}
      onDismiss={() => setConfirmVisible(false)}
    />
  );

  return (
    <ScreenWrapper style={styles.container}>
      {ConfiormPopUp()}
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
