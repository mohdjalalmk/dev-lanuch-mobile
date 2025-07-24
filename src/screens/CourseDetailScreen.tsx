import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCourseById,
  fetchCourseProgress,
  enrollCourse,
  fetchSignedVideoUrl,
  toggleVideoCompletion,
  selectVideo,
  fetchEnrolledCourses,
  resetCourseState,
  fetchCoursesThunk,
  downloadCertificate,
} from '../slices/courseSlice';
import { RootState } from '../store';
import { Video } from '../utils/types';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { VideoPlayer } from '../components/VideoPlayer';
import ScreenWrapper from '../components/ScreenWrapper';
import { saveCertificate } from '../utils/downloadCertificate';

export const CourseDetailScreen = ({ route }) => {
  const courseId = route.params.id;
  const dispatch = useDispatch();
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  const {
    course,
    selectedVideo,
    signedVideoUrl,
    enrolled,
    progress,
    completedVideoKeys,
    loading,
  } = useSelector((state: RootState) => state.courses);

  useEffect(() => {
    dispatch(resetCourseState()); // clear stale data

    dispatch(fetchEnrolledCourses() as any);
    dispatch(fetchCourseById(courseId) as any);
    dispatch(fetchCourseProgress(courseId) as any);

    return () => {
      dispatch(resetCourseState()); // clear stale data
    };
  }, [courseId]);

  const handlePlay = (video: Video) => {
    if (!enrolled) return;
    dispatch(selectVideo(video));
    dispatch(fetchSignedVideoUrl({ courseId, videoKey: video.key }) as any);
  };

  const handleToggleComplete = (video: Video) => {
    if (!enrolled) return;
    dispatch(toggleVideoCompletion({ courseId, videoKey: video.key }) as any);
  };

  const handleEnroll = () => {
    dispatch(enrollCourse(courseId) as any);
    setShowEnrollModal(false);
  };

 const handleDownloadCertificate = async () => {
  const result = await dispatch(downloadCertificate(course._id) as any);
  const certUrl = result?.payload?.certificateUrl;

  if (!certUrl) {
    Alert.alert('Error', 'Certificate not available.');
    return;
  }

  await saveCertificate(certUrl);
};


  const renderVideoItem = ({ item }: { item: Video }) => (
    <TouchableOpacity style={styles.videoItem} onPress={() => handlePlay(item)}>
      <View style={styles.videoLeft}>
        <Text style={styles.playIcon}>▶️</Text>
        <Text style={styles.videoTitleText}>{item.title}</Text>
      </View>
      <View style={styles.videoRight}>
        {enrolled ? (
          <TouchableOpacity onPress={() => handleToggleComplete(item)}>
            <Text>{completedVideoKeys?.includes(item.key) ? '✅' : '⬜'}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.locked}>🔒</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const LoadingIndicator = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3fc488" />
      </View>
    );
  };

  if (!course) {
    return (
      <ScreenWrapper style={styles.container}>
        <LoadingIndicator />
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper style={styles.container}>
      {loading && <LoadingIndicator />}
      <View style={styles.videoSection}>
        <VideoPlayer
          uri={signedVideoUrl || ''}
          thumbnail={selectedVideo?.thumbnail || course?.thumbnail || ''}
          isLocked={!enrolled}
        />
        {selectedVideo && (
          <View style={styles.videoInfo}>
            <Text style={styles.videoTitle}>{selectedVideo.title}</Text>
            <Text style={styles.videoDescription}>
              {selectedVideo.description || 'No description available.'}
            </Text>
            {enrolled && (
              <View style={styles.certificateSection}>
                <TouchableOpacity
                onPress={handleDownloadCertificate}
                  style={[
                    styles.certificateBtn,
                    progress < 100 && { backgroundColor: '#555' },
                  ]}
                  disabled={progress < 100}
                >
                  <Text style={styles.certificateText}>
                    {progress < 100
                      ? 'Complete course to unlock certificate 🎓'
                      : 'Download Certificate 🎓'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.videoList}>
        <Text style={styles.sectionTitle}>Course Videos</Text>
        {enrolled && (
          <>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress}% completed</Text>
          </>
        )}
        {course?.videos?.length ? (
          <FlatList
            data={course.videos}
            renderItem={renderVideoItem}
            keyExtractor={item => item.key}
          />
        ) : (
          <Text style={{ color: '#888', marginTop: 8 }}>
            No videos available.
          </Text>
        )}

        {!enrolled && (
          <TouchableOpacity
            style={styles.enrollBtn}
            onPress={() => setShowEnrollModal(true)}
          >
            <Text style={{ color: 'white' }}>Enroll to watch</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Enroll Modal */}
      <Modal visible={showEnrollModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Enroll in "{course.title}"</Text>
            <Text style={styles.modalText}>
              This course costs ₹{course.price}. Do you want to continue?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={handleEnroll} style={styles.payBtn}>
                <Text style={{ color: 'white' }}>Pay & Enroll</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowEnrollModal(false)}
                style={styles.cancelBtn}
              >
                <Text style={{ color: 'white' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12,marginHorizontal: 8 },
  videoSection: {},
  thumbnail: { width: '100%', aspectRatio: 16 / 9, borderRadius: 6 },
  videoInfo: { marginTop: 12 },
  videoTitle: { fontSize: 18, color: '#f0f0f0' },
  videoDescription: { fontSize: 14, color: '#ccc', marginTop: 4 },
  certificateSection: { marginTop: 16 },
  certificateBtn: {
    padding: 10,
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    alignItems: 'center',
  },
  certificateText: { color: 'white' },
  videoList: { marginTop: 24 },
  sectionTitle: { fontSize: 16, color: '#f0f0f0', marginBottom: 8 },
  progressBar: { height: 6, backgroundColor: '#444', borderRadius: 4 },
  progressFill: { height: '100%', backgroundColor: '#3fc488', borderRadius: 4 },
  progressText: { fontSize: 12, color: '#ccc', marginVertical: 4 },
  videoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#2c2c2c',
    padding: 10,
    borderRadius: 4,
    marginVertical: 4,
  },
  videoLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  playIcon: { marginRight: 8, fontSize: 16 },
  videoTitleText: { color: '#f0f0f0' },
  videoRight: { flexDirection: 'row', alignItems: 'center' },
  locked: { color: '#888' },
  enrollBtn: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#3fc488',
    borderRadius: 6,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30,30,47,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#2c2c3f',
    padding: 24,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, color: 'white', marginBottom: 12 },
  modalText: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalActions: { flexDirection: 'row', gap: 12 },
  payBtn: {
    padding: 10,
    backgroundColor: '#3fc488',
    borderRadius: 6,
    marginRight: 8,
  },
  cancelBtn: {
    padding: 10,
    backgroundColor: '#555',
    borderRadius: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
});
