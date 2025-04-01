import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Animated,
  Dimensions,
  ScrollView,
  Pressable,
} from 'react-native';

// Get screen dimensions
const { height } = Dimensions.get('window');

// Define types for our data
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
  type: 'public' | 'friends' | 'private' | 'bitching' | 'couples';
  participants: Participant[];
  listenerCount: number;
  isTrending: boolean;
  color?: string;
  isAICreated?: boolean;
}

// Sample data for voice rooms
const VOICE_ROOMS: VoiceRoom[] = [
  {
    id: '1',
    title: 'Public Voice Space',
    type: 'public',
    participants: [
      { id: '1', name: 'Raj', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', isSpeaking: true, isHost: true },
      { id: '2', name: 'Simran', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', isSpeaking: false },
      { id: '3', name: 'Arjun', avatar: 'https://randomuser.me/api/portraits/men/46.jpg', isSpeaking: true },
      { id: '4', name: 'Priya', avatar: 'https://randomuser.me/api/portraits/women/45.jpg', isSpeaking: false },
      { id: '5', name: 'Vikram', avatar: 'https://randomuser.me/api/portraits/men/41.jpg', isSpeaking: true },
      { id: '6', name: 'Neha', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', isSpeaking: false },
      { id: '7', name: 'Karan', avatar: 'https://randomuser.me/api/portraits/men/36.jpg', isSpeaking: true },
      { id: '8', name: 'Rohit', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', isSpeaking: false },
      { id: '9', name: 'Ananya', avatar: 'https://randomuser.me/api/portraits/women/26.jpg', isSpeaking: true },
      { id: '10', name: 'Ravi', avatar: 'https://randomuser.me/api/portraits/men/54.jpg', isSpeaking: true },
      { id: '11', name: 'Sanjana', avatar: 'https://randomuser.me/api/portraits/women/55.jpg', isSpeaking: false },
      { id: '12', name: 'Rahul', avatar: 'https://randomuser.me/api/portraits/men/62.jpg', isSpeaking: true },
      { id: '13', name: 'Tanya', avatar: 'https://randomuser.me/api/portraits/women/63.jpg', isSpeaking: false },
      { id: '14', name: 'Faraz', avatar: 'https://randomuser.me/api/portraits/men/65.jpg', isSpeaking: false },
    ],
    listenerCount: 57,
    isTrending: true,
    color: '#FF3B30',
  },
  {
    id: '2',
    title: 'Best Friends',
    type: 'friends',
    participants: [
      { id: '15', name: 'Vikram', avatar: 'https://randomuser.me/api/portraits/men/41.jpg', isSpeaking: true, isHost: true },
      { id: '16', name: 'Neha', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', isSpeaking: false },
      { id: '17', name: 'Karan', avatar: 'https://randomuser.me/api/portraits/men/36.jpg', isSpeaking: true },
    ],
    listenerCount: 18,
    isTrending: false,
    color: '#007AFF',
    isAICreated: true,
  },
  {
    id: '3',
    title: 'Bitching',
    type: 'bitching',
    participants: [
      { id: '18', name: 'Rohit', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', isSpeaking: false, isHost: true },
      { id: '19', name: 'Ananya', avatar: 'https://randomuser.me/api/portraits/women/26.jpg', isSpeaking: true },
      { id: '20', name: 'Priya', avatar: 'https://randomuser.me/api/portraits/women/45.jpg', isSpeaking: false },
      { id: '21', name: 'Neha', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', isSpeaking: false },
    ],
    listenerCount: 4,
    isTrending: true,
    color: '#FF9500',
  },
  {
    id: '4',
    title: 'Coupling',
    type: 'couples',
    participants: [
      { id: '22', name: 'Ravi', avatar: 'https://randomuser.me/api/portraits/men/54.jpg', isSpeaking: true, isHost: true },
      { id: '23', name: 'Sanjana', avatar: 'https://randomuser.me/api/portraits/women/55.jpg', isSpeaking: false },
    ],
    listenerCount: 2,
    isTrending: false,
    color: '#AF52DE',
  },
  {
    id: '5',
    title: 'Private Space',
    type: 'private',
    participants: [
      { id: '24', name: 'Unknown', avatar: 'https://randomuser.me/api/portraits/men/41.jpg', isSpeaking: true, isHost: true },
      { id: '25', name: 'Unknown', avatar: 'https://randomuser.me/api/portraits/women/42.jpg', isSpeaking: false },
      { id: '26', name: 'Unknown', avatar: 'https://randomuser.me/api/portraits/men/43.jpg', isSpeaking: false },
    ],
    listenerCount: 3,
    isTrending: false,
    color: '#34C759',
  },
];

interface VoiceRoomProps {
  visible: boolean;
  onClose: () => void;
}

const VoiceRoomScreen: React.FC<VoiceRoomProps> = ({ visible, onClose }) => {
  // Animation values
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  
  useEffect(() => {
    if (visible) {
      // Slide up animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide down animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  // Handle room selection
  const handleRoomPress = (roomId: string) => {
    setSelectedRoomId(roomId);
    // In a real app, this would join the voice room
    console.log('Joining room:', roomId);
  };

  // Filter rooms by category
  const handleCategoryPress = (category: string) => {
    setActiveCategory(category);
  };

  // Handle join room
  const handleJoinRoom = (room: VoiceRoom) => {
    console.log(`Joining ${room.type} room: ${room.title}`);
  };

  // Handle join request
  const handleJoinRequest = (room: VoiceRoom) => {
    console.log(`Requesting to join ${room.type} room: ${room.title}`);
  };

  // Render participant avatars in a horizontal stack
  const renderParticipantStack = (participants: Participant[], isPrivate: boolean = false) => {
    return participants.slice(0, 3).map((participant, index) => (
      <View 
        key={participant.id} 
        style={[
          styles.participantAvatarWrapper, 
          { zIndex: 10 - index, marginLeft: index > 0 ? -15 : 0 }
        ]}
      >
        <Image 
          source={{ uri: participant.avatar }}
          style={[
            styles.participantAvatar,
            isPrivate && styles.privateAvatar
          ]}
        />
        {participant.isSpeaking && (
          <View style={styles.speakingIndicator} />
        )}
      </View>
    ));
  };

  // Get the appropriate join button based on room type
  const getJoinButton = (room: VoiceRoom) => {
    if (room.type === 'public' || room.type === 'bitching') {
      return (
        <TouchableOpacity 
          style={styles.joinButton} 
          onPress={() => handleJoinRoom(room)}
        >
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity 
          style={styles.requestButton} 
          onPress={() => handleJoinRequest(room)}
        >
          <Text style={styles.requestButtonText}>Request</Text>
        </TouchableOpacity>
      );
    }
  };

  // Render a single room item (horizontal card)
  const renderRoomItem = ({ item }: { item: VoiceRoom }) => {
    const isSelected = selectedRoomId === item.id;
    const isPrivate = item.type === 'private';
    
    return (
      <TouchableOpacity
        style={[
          styles.roomItem,
          isSelected && styles.selectedRoomItem,
          { borderLeftColor: item.color || '#FF3B30' }
        ]}
        onPress={() => handleRoomPress(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.roomItemContent}>
          <View style={styles.roomHeader}>
            <View style={styles.titleContainer}>
              <Text style={styles.roomTitle}>{item.title}</Text>
              {isPrivate && (
                <Text style={styles.lockIcon}>🔒</Text>
              )}
              {item.isAICreated && (
                <View style={styles.aiCreatedTag}>
                  <Text style={styles.aiCreatedText}>AI Created</Text>
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.participantsRow}>
            <View style={styles.participantsStack}>
              {renderParticipantStack(item.participants, isPrivate)}
            </View>
            {item.participants.length > 3 && (
              <Text style={styles.moreParticipants}>+{item.participants.length - 3}</Text>
            )}
          </View>
        </View>
        
        <View style={styles.roomActions}>
          {item.isTrending && (
            <View style={styles.trendingTag}>
              <Text style={styles.trendingText}>Trending</Text>
            </View>
          )}
          {getJoinButton(item)}
        </View>
      </TouchableOpacity>
    );
  };

  // Render create room button
  const renderCreateRoomButton = () => (
    <TouchableOpacity 
      style={styles.createRoomButton}
      activeOpacity={0.7}
    >
      <View style={styles.createRoomContent}>
        <Text style={styles.createRoomIcon}>+</Text>
        <Text style={styles.createRoomText}>Create Room</Text>
      </View>
    </TouchableOpacity>
  );
  
  // Categories for rooms
  const categories = ['All', 'Public', 'Friends', 'Private'];

  // Filter rooms based on active category
  const filteredRooms = activeCategory === 'All' 
    ? VOICE_ROOMS 
    : VOICE_ROOMS.filter(room => 
        room.type.toLowerCase() === activeCategory.toLowerCase()
      );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable 
        style={styles.modalBackground}
        onPress={onClose}
      >
        <Animated.View 
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
            <View style={styles.header}>
              <View style={styles.headerHandle} />
              <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>Voice Rooms</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={onClose}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Categories */}
            <View style={styles.categoriesContainer}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesScrollContent}
              >
                {categories.map((category) => (
                  <TouchableOpacity 
                    key={category} 
                    style={[
                      styles.categoryChip,
                      activeCategory === category && styles.activeCategoryChip
                    ]}
                    onPress={() => handleCategoryPress(category)}
                  >
                    <Text 
                      style={[
                        styles.categoryText,
                        activeCategory === category && styles.activeCategoryText
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            {/* Live Rooms Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Live Now</Text>
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            {/* Rooms List */}
            <FlatList
              data={filteredRooms}
              renderItem={renderRoomItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.roomsListContent}
              showsVerticalScrollIndicator={false}
            />
            
            {/* Create Room Button */}
            {renderCreateRoomButton()}
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    height: height * 0.8,
    width: '100%',
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    backgroundColor: '#121212',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  header: {
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
    alignItems: 'center',
  },
  headerHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#555555',
    borderRadius: 2,
    marginBottom: 12,
  },
  headerContent: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '300',
    lineHeight: 32,
    textAlign: 'center',
  },
  categoriesContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  categoriesScrollContent: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    marginRight: 8,
  },
  activeCategoryChip: {
    backgroundColor: '#FF3B30',
  },
  categoryText: {
    color: '#AAAAAA',
    fontSize: 14,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  viewAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewAllText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '500',
  },
  roomsListContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  roomItem: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    borderLeftWidth: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedRoomItem: {
    borderColor: '#FF3B30',
    backgroundColor: '#222222',
  },
  roomItemContent: {
    flex: 1,
  },
  roomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roomTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  lockIcon: {
    fontSize: 14,
    marginLeft: 6,
  },
  aiCreatedTag: {
    backgroundColor: 'rgba(175, 82, 222, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  aiCreatedText: {
    color: '#AF52DE',
    fontSize: 10,
    fontWeight: '600',
  },
  roomCount: {
    fontSize: 14,
    color: '#AAAAAA',
    marginLeft: 8,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#121212',
  },
  privateAvatar: {
    opacity: 0.7,
  },
  speakingIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#34C759',
    borderWidth: 1,
    borderColor: '#121212',
  },
  moreParticipants: {
    fontSize: 14,
    color: '#AAAAAA',
    marginLeft: 8,
  },
  roomActions: {
    alignItems: 'flex-end',
  },
  trendingTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    marginBottom: 8,
  },
  trendingText: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: '500',
  },
  joinButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  requestButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  requestButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  createRoomButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#FF3B30',
    borderRadius: 24,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  createRoomContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createRoomIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  createRoomText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VoiceRoomScreen; 