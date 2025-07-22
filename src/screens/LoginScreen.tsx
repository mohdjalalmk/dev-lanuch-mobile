import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import {
  TextInput,
  Button,
  Card,
  HelperText,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '../slices/authSlice';
import { useAppDispatch } from '../store';


const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigation = useNavigation<any>();
const dispatch = useAppDispatch();


const handleLogin = async () => {
  setLoading(true);
  setError('');
  try {
    if (!email || !password) {
      throw new Error('Email and Password are required');
    }

    await dispatch(loginUser({ email, password })).unwrap();

    setLoading(false);
  } catch (err: any) {
    setError(err.message || 'Login failed');
    setLoading(false);
  }
};


  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/devlaunch-2.png')}
        style={styles.logo}
      />

      <Card style={styles.card} elevation={12}>
        <Card.Title title="Login to DevLaunch" titleStyle={styles.title} />
        <Card.Content>
          {error !== '' && (
            <HelperText type="error" visible={true} padding="none">
              {error}
            </HelperText>
          )}

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

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.loginButton}
            contentStyle={{ height: 48 }}
          >
            Login
          </Button>

          <Button
            onPress={() => navigation.navigate('Signup')}
            mode="text"
            labelStyle={styles.signupLabel}
          >
            Don’t have an account? Sign Up
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

export default LoginScreen;
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
  loginButton: {
    backgroundColor: brandColor,
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 8,
  },
  signupLabel: {
    color: brandColor,
    fontSize: 12,
  },
});
