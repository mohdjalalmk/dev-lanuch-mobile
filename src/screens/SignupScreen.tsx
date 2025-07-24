import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Card,
  HelperText,
  Portal,
  IconButton,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../store';
import { signupUser, verifyUserOtp } from '../slices/authSlice';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpVisible, setOtpVisible] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');

  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const handleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      if (!email || !password || !confirmPassword || !name) {
        Toast.show({
          type: 'error',
          text1: 'Missing Fields',
          text2: 'Please fill in all fields before signing up.',
        });
        return setLoading(false);
      }

      if (password !== confirmPassword) {
        Toast.show({
          type: 'error',
          text1: 'Password Mismatch',
          text2: 'Please ensure both passwords match.',
        });
        setLoading(false);
        return;
      }

      const resp = await dispatch(
        signupUser({ name, email, password }),
      ).unwrap();
      if (resp) {
        setOtpVisible(true);
      }
    } catch (err: any) {
      return Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2:
          error.response?.data?.message || 'An error occurred during signup.',
      });
      setError(err.data.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setOtpLoading(true);
    setOtpError('');
    try {
      if (otp.length !== 6) {
        throw new Error('OTP must be 6 digits');
      }

      await dispatch(verifyUserOtp({ email, otp })).unwrap();
      setOtpVisible(false);
    } catch (err: any) {
      setOtpError(err.message || 'OTP verification failed');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/devlaunch-2.png')}
        style={styles.logo}
      />

      <Card style={styles.card} elevation={12}>
        <Card.Title title="Create an Account" titleStyle={styles.title} />
        <Card.Content>
          {error !== '' && (
            <HelperText type="error" visible={true}>
              {error}
            </HelperText>
          )}

          <TextInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity
            onPress={handleSignup}
            disabled={loading}
            style={[styles.signupButton, loading && { opacity: 0.7 }]}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.signupButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <Button
            onPress={() => navigation.goBack()}
            mode="text"
            labelStyle={styles.loginLabel}
          >
            Already have an account? Login
          </Button>
        </Card.Content>
      </Card>

      <Modal
        visible={otpVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setOtpVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Card style={styles.modalCard}>
            <Card.Title
              title="Verify OTP"
              titleStyle={styles.title}
              right={props => (
                <Pressable onPress={() => setOtpVisible(false)}>
                <Icon name="close" size={30} color="#900" />

                </Pressable>
              )}
            />
            <Card.Content>
              {otpError !== '' && (
                <HelperText type="error" visible={true}>
                  {otpError}
                </HelperText>
              )}

              <TextInput
                label="6-digit OTP"
                value={otp}
                onChangeText={setOtp}
                mode="outlined"
                keyboardType="numeric"
                maxLength={6}
                style={styles.input}
              />

              <TouchableOpacity
                onPress={handleVerifyOtp}
                disabled={otpLoading}
                style={[styles.signupButton, otpLoading && { opacity: 0.7 }]}
              >
                {otpLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.signupButtonText}>Verify OTP</Text>
                )}
              </TouchableOpacity>
            </Card.Content>
          </Card>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const brandColor = '#2503a1';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2f',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    fontFamily: 'Poppins',
  },
  logo: {
    width: 240,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  card: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
  },
  title: {
    color: brandColor,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
  input: {
    marginBottom: 16,
    fontSize: 13,
  },
  signupButton: {
    backgroundColor: brandColor,
    paddingVertical: 12,
    marginBottom: 12,
    borderRadius: 8,
    color: 'white',
  },
  loginLabel: {
    color: brandColor,
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '90%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  buttonContent: {
    height: 48,
    justifyContent: 'center',
    color: 'white',
  },
  signupButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SignupScreen;
