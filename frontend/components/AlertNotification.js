import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AlertNotification = ({ alertMessage }) => {
  return (
    alertMessage ? (
      <View style={styles.alertBox}>
        <Text style={styles.alertText}>{alertMessage}</Text>
      </View>
    ) : null
  );
};

const styles = StyleSheet.create({
  alertBox: {
    backgroundColor: '#ff4d4d', padding: 15, borderRadius: 10, margin: 10, shadowColor: '#000', shadowOpacity: 0.2, elevation: 5
  },
  alertText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default AlertNotification;
