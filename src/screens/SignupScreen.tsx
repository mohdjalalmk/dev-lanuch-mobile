import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Text, Card, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigation = useNavigation<any>();

  const handleSignup = async () => {
    setLoading(true);
    setError('');

    try {
      if (!email || !password || !confirmPassword || !name) {
        throw new Error('All fields are required');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Simulate API
      setTimeout(() => {
        setLoading(false);
        navigation.navigate('Home'); // or Login screen
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Signup failed');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/devlaunch-2.png')} style={styles.logo} />

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

          <Button
            mode="contained"
            onPress={handleSignup}
            loading={loading}
            disabled={loading}
            style={styles.signupButton}
            contentStyle={{ height: 48 }}
          >
            Sign Up
          </Button>

          <Button
            onPress={() => navigation.goBack()}
            mode="text"
            labelStyle={styles.loginLabel}
          >
            Already have an account? Login
          </Button>
        </Card.Content>
      </Card>
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
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 8,
  },
  loginLabel: {
    color: brandColor,
    fontSize: 12,
  },
});

export default SignupScreen;
