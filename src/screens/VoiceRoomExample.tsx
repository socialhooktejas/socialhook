import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import VoiceRoomScreen from './VoiceRoomScreen';

const VoiceRoomExample = () => {
  const [voiceRoomVisible, setVoiceRoomVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Voice Room Demo</Text>
        <Text style={styles.description}>
          Press the button below to open the Voice Room overlay
        </Text>
        
        <TouchableOpacity 
          style={styles.openButton}
          onPress={() => setVoiceRoomVisible(true)}
        >
          <Text style={styles.openButtonText}>Open Voice Rooms</Text>
        </TouchableOpacity>
      </View>

      <VoiceRoomScreen 
        visible={voiceRoomVisible}
        onClose={() => setVoiceRoomVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#AAAAAA',
    textAlign: 'center',
    marginBottom: 32,
  },
  openButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  openButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default VoiceRoomExample; 