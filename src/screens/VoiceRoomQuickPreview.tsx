import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
} from 'react-native';

// Get screen dimensions
const { width } = Dimensions.get('window');

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isSpeaking: boolean;
  isHost?: boolean;
}

interface VoiceRoom {
  id: string;
  title: string;
  type: string;
  participants: Participant[];
  color?: string;
}

interface VoiceRoomQuickPreviewProps {
  visible: boolean;
  onClose: () => void;
  onRoomPress: (roomId: string) => void;
  onLongPress: () => void;
  activeRooms: VoiceRoom[];
  currentRoomId?: string | null;
}

const VoiceRoomQuickPreview: React.FC<VoiceRoomQuickPreviewProps> = ({
  visible,
  onClose,
  onRoomPress,
  onLongPress,
  activeRooms,
  currentRoomId,
}) => {
  // Animation values (changed to bottom-up)
  const slideAnim = useRef(new Animated.Value(150)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Bottom-up slide in animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide down animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 150,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  // Render participant avatars in a horizontal stack
  const renderParticipantStack = (participants: Participant[]) => {
    return participants.slice(0, 3).map((participant, index) => (
      <View
        key={participant.id}
        style={[
          styles.participantAvatarWrapper,
          { zIndex: 10 - index, marginLeft: index > 0 ? -10 : 0 }
        ]}
      >
        <Image
          source={{ uri: participant.avatar }}
          style={styles.participantAvatar}
        />
        {participant.isSpeaking && (
          <View style={styles.speakingIndicator} />
        )}
      </View>
    ));
  };

  if (!visible) return null;

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Voice Rooms</Text>
            <TouchableOpacity style={styles.expandButton} onPress={onLongPress}>
              <Text style={styles.expandText}>Expand</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.roomsContainer} showsVerticalScrollIndicator={false}>
            {activeRooms.length === 0 ? (
              <Text style={styles.noRoomsText}>No active voice rooms</Text>
            ) : (
              activeRooms.map((room) => (
                <TouchableOpacity
                  key={room.id}
                  style={[
                    styles.roomItem,
                    currentRoomId === room.id && styles.activeRoomItem,
                    { borderLeftColor: room.color || '#FF3B30' }
                  ]}
                  onPress={() => onRoomPress(room.id)}
                  onLongPress={onLongPress}
                  delayLongPress={500}
                >
                  <View style={styles.roomContent}>
                    <Text style={styles.roomTitle} numberOfLines={1}>
                      {room.title}
                    </Text>
                    <View style={styles.participantsRow}>
                      <View style={styles.participantsStack}>
                        {renderParticipantStack(room.participants)}
                      </View>
                      {room.participants.length > 3 && (
                        <Text style={styles.moreParticipants}>
                          +{room.participants.length - 3}
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          <TouchableOpacity 
            style={styles.createRoomButton} 
            onPress={onLongPress}
          >
            <Text style={styles.createRoomText}>Create Room</Text>
          </TouchableOpacity>
        </Pressable>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 110,
    left: 0,
    right: 0,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  container: {
    marginLeft: 16,
    width: width * 0.5,
    maxWidth: 220,
    backgroundColor: 'rgba(18, 18, 18, 0.7)',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  expandButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  expandText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  roomsContainer: {
    padding: 12,
    maxHeight: 180,
  },
  noRoomsText: {
    color: '#AAAAAA',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 16,
  },
  roomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderLeftWidth: 3,
  },
  activeRoomItem: {
    backgroundColor: 'rgba(50, 50, 50, 0.8)',
    borderColor: '#FF3B30',
  },
  roomContent: {
    flex: 1,
  },
  roomTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  participantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantsStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantAvatarWrapper: {
    position: 'relative',
  },
  participantAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#121212',
  },
  speakingIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
    borderWidth: 1,
    borderColor: '#121212',
  },
  moreParticipants: {
    fontSize: 12,
    color: '#AAAAAA',
    marginLeft: 4,
  },
  createRoomButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    alignItems: 'center',
  },
  createRoomText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default VoiceRoomQuickPreview; 