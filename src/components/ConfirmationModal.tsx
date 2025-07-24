import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  iconName?: string;
  iconColor?: string;
  onConfirm: () => void;
  onDismiss: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal = ({
  visible,
  title,
  message,
  iconName = 'warning-outline',
  iconColor = '#f44336',
  onConfirm,
  onDismiss,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: Props) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <View style={styles.iconWrapper}>
          <Icon name={iconName} size={32} color={iconColor} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.buttonRow}>
          <Button onPress={onDismiss} style={styles.button}>
            {cancelText}
          </Button>
          <Button
            mode="contained"
            onPress={onConfirm}
            style={styles.button}
            buttonColor={iconColor}
            textColor="#fff"
          >
            {confirmText}
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 24,
    margin: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#444',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
});

export default ConfirmationModal;
