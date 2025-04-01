import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import VoiceRoomScreen from './VoiceRoomScreen';
import VoiceRoomQuickPreview from './VoiceRoomQuickPreview';

// Screen dimensions
const { width, height } = Dimensions.get('window');

// Sample user avatar images
const userAvatars = [
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/46.jpg',
  'https://randomuser.me/api/portraits/women/45.jpg',
  'https://randomuser.me/api/portraits/men/22.jpg',
  'https://randomuser.me/api/portraits/women/26.jpg',
];

// Sample messages for the chat
const SAMPLE_MESSAGES = [
  {
    id: '1',
    user: {
      name: 'Cricket_Lover',
      avatar: userAvatars[0],
      isVerified: true,
    },
    message: '🔥 Amazing! wonderful',
    timestamp: Date.now() - 1000 * 60 * 2,
  },
  {
    id: '2',
    user: {
      name: 'CricketFan98',
      avatar: userAvatars[1],
    },
    message: 'impressive reel',
    timestamp: Date.now() - 1000 * 60,
  },
  {
    id: '3',
    user: {
      name: 'SportsLover',
      avatar: userAvatars[2],
    },
    message: 'Woah nice one',
    timestamp: Date.now() - 1000 * 30,
  },
  {
    id: '4',
    user: {
      name: 'CricketEnthusiast',
      avatar: userAvatars[3],
    },
    message: 'Let\'s go! 🏏',
    timestamp: Date.now() - 1000 * 15,
  },
  {
    id: '5',
    user: {
      name: 'VikramSports',
      avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    },
    message: '👏👏👏',
    timestamp: Date.now() - 1000 * 12,
  },
  {
    id: '6',
    user: {
      name: 'Cricket_Queen',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      isVerified: true,
    },
    message: 'Best match of the season so far!',
    timestamp: Date.now() - 1000 * 10,
  },
  {
    id: '7',
    user: {
      name: 'SportsTalk',
      avatar: 'https://randomuser.me/api/portraits/men/38.jpg',
    },
    message: 'Who else is watching from India? 🇮🇳',
    timestamp: Date.now() - 1000 * 8,
  },
  {
    id: '8',
    user: {
      name: 'CricketFever',
      avatar: 'https://randomuser.me/api/portraits/women/29.jpg',
    },
    message: '❤️❤️❤️',
    timestamp: Date.now() - 1000 * 6,
  },
  {
    id: '9',
    user: {
      name: 'GameLover',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    },
    message: 'Can\'t believe that last over!',
    timestamp: Date.now() - 1000 * 4,
  },
  {
    id: '10',
    user: {
      name: 'Cricket_Updates',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      isVerified: true,
    },
    message: 'What a performance 🏆',
    timestamp: Date.now() - 1000 * 2,
  },
];

// Sample active voice rooms
const ACTIVE_VOICE_ROOMS = [
  {
    id: '1',
    title: 'Public Voice Space',
    type: 'public',
    participants: [
      { id: '1', name: 'Raj', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', isSpeaking: true, isHost: true },
      { id: '2', name: 'Simran', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', isSpeaking: false },
      { id: '3', name: 'Arjun', avatar: 'https://randomuser.me/api/portraits/men/46.jpg', isSpeaking: true },
    ],
    color: '#FF3B30',
  },
  {
    id: '2',
    title: 'Best Friends',
    type: 'friends',
    participants: [
      { id: '15', name: 'Vikram', avatar: 'https://randomuser.me/api/portraits/men/41.jpg', isSpeaking: true, isHost: true },
      { id: '16', name: 'Neha', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', isSpeaking: false },
    ],
    color: '#007AFF',
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
    color: '#FF9500',
  },
  {
    id: '4',
    title: 'Couples Chat',
    type: 'couples',
    participants: [
      { id: '22', name: 'Ravi', avatar: 'https://randomuser.me/api/portraits/men/54.jpg', isSpeaking: true, isHost: true },
      { id: '23', name: 'Sanjana', avatar: 'https://randomuser.me/api/portraits/women/55.jpg', isSpeaking: false },
    ],
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
    color: '#34C759',
  },
];

const UnifiedReelsStream = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  // States
  const [messages, setMessages] = useState(SAMPLE_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [likes, setLikes] = useState(87400);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState(2100);
  const [typing, setTyping] = useState(true);
  const [voiceRoomVisible, setVoiceRoomVisible] = useState(false);
  const [quickPreviewVisible, setQuickPreviewVisible] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [showSongInfo, setShowSongInfo] = useState(true);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [randomEmoji, setRandomEmoji] = useState(null);
  const [showFireworks, setShowFireworks] = useState(false);
  const [expandDescription, setExpandDescription] = useState(false);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  
  // Refs
  const scrollViewRef = useRef<ScrollView>(null);
  const flatListRef = useRef<FlatList>(null);
  const lastTapRef = useRef(0);
  const textInputRef = useRef<TextInput>(null);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const micButtonAnim = useRef(new Animated.Value(1)).current;
  const songTextPosition = useRef(new Animated.Value(0)).current;
  const randomEmojiAnim = useRef(new Animated.Value(0)).current;
  const fireworksAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Simulate typing animation
    const typingTimer = setTimeout(() => {
      setTyping(false);
    }, 3000);
    
    // Start song text animation
    startSongTextAnimation();
    
    // Hide song info after 7 seconds
    const songInfoTimer = setTimeout(() => {
      setShowSongInfo(false);
    }, 7000);

    return () => {
      clearTimeout(typingTimer);
      clearTimeout(songInfoTimer);
    };
  }, []);
  
  // Song text scrolling animation
  const startSongTextAnimation = () => {
    // Calculate the distance to scroll based on song text length
    const songTitle = "Love me like you do - Ellie Goulding";
    const estimatedTextWidth = songTitle.length * 8; // Rough estimate of text width
    const scrollDistance = -estimatedTextWidth;
    
    Animated.sequence([
      // Give a short delay before starting
      Animated.delay(1000),
      // Scroll the text to the left
      Animated.timing(songTextPosition, {
        toValue: scrollDistance,
        duration: 8000,
        useNativeDriver: true,
      }),
      // Quickly reset to start position without animation
      Animated.timing(songTextPosition, {
        toValue: width / 3,
        duration: 0,
        useNativeDriver: true,
      }),
      // Scroll back to initial position
      Animated.timing(songTextPosition, {
        toValue: 0,
        duration: 8000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Restart animation
      if (showSongInfo) {
        startSongTextAnimation();
      }
    });
  };
  
  // Handle emoji button click
  const handleEmojiButtonClick = () => {
    // Check for double tap
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected - show fireworks
      handleEmojiDoubleTap();
    } else {
      // Single tap - focus on text input and show emoji keyboard
      if (textInputRef.current) {
        textInputRef.current.focus();
        // This is a workaround to show the emoji keyboard
        // On Android, we need to implement platform-specific code
        if (Platform.OS === 'android') {
          // For Android, we need to send a specific keycode to open emoji keyboard
          // This requires native module implementation
          console.log('Opening emoji keyboard');
        } else {
          // For iOS
          console.log('Opening emoji keyboard');
        }
      }
    }
    
    lastTapRef.current = now;
  };
  
  // Toggle music functionality
  const handleToggleMusic = () => {
    setIsMusicEnabled(!isMusicEnabled);
    // Show song info when toggled (regardless of state)
    setShowSongInfo(true);
    // Hide after 7 seconds
    setTimeout(() => {
      setShowSongInfo(false);
    }, 7000);
  };
  
  // Add auto-scroll simulation for live chat
  useEffect(() => {
    // Auto-scroll to bottom when component mounts
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 500);
    
    // Simulate new messages coming in every few seconds
    const liveChatInterval = setInterval(() => {
      const newLiveMessage = {
        id: String(Date.now()),
        user: {
          name: `User_${Math.floor(Math.random() * 1000)}`,
          avatar: userAvatars[Math.floor(Math.random() * userAvatars.length)],
          isVerified: Math.random() > 0.8,
        },
        message: getLiveMessage(),
        timestamp: Date.now(),
      };
      
      setMessages(prevMessages => {
        // Keep only the last 15 messages to avoid performance issues
        const updatedMessages = [...prevMessages, newLiveMessage].slice(-15);
        
        // Auto-scroll to bottom with smooth animation when new message arrives
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ 
            animated: true
          });
        }, 50);
        
        return updatedMessages;
      });
    }, 2500); // Slightly faster message rate for more lively chat
    
    return () => clearInterval(liveChatInterval);
  }, []);
  
  // Generate random live messages
  const getLiveMessage = () => {
    const liveMessages = [
      '🔥🔥🔥',
      'Amazing!',
      'Love this content',
      'Hello from Brazil! 🇧🇷',
      'First time watching',
      'Keep it up!',
      '❤️',
      'Is this live?',
      'Great job',
      'Wow!',
      'I can\'t believe it',
      'Incredible performance',
      '👍',
      'Following you now',
      'This is so good',
      'My favorite!',
      '🙌',
    ];
    
    return liveMessages[Math.floor(Math.random() * liveMessages.length)];
  };
  
  // Handle back button press
  const handleBackPress = () => {
    navigation.goBack();
  };
  
  // Handle like button press
  const handleLikePress = () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikes(prevLikes => newLiked ? prevLikes + 1 : prevLikes - 1);
    
    // Animate the heart button
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  // Handle message submission
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg = {
      id: String(Date.now()),
      user: {
        name: 'You',
        avatar: userAvatars[0],
      },
      message: newMessage.trim(),
      timestamp: Date.now(),
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Scroll to the bottom of the chat
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Handle voice room button press
  const handleVoiceRoomToggle = () => {
    // Animate the mic button
    Animated.sequence([
      Animated.timing(micButtonAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(micButtonAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Toggle quick preview instead of full screen
    setQuickPreviewVisible(prev => !prev);
    
    // Close the full voice room if open
    if (voiceRoomVisible) {
      setVoiceRoomVisible(false);
    }
  };
  
  // Handle long press on mic button to open full voice room
  const handleVoiceRoomLongPress = () => {
    setQuickPreviewVisible(false);
    setVoiceRoomVisible(true);
  };
  
  // Handle room selection in quick preview
  const handleRoomPress = (roomId: string) => {
    setCurrentRoomId(roomId);
    console.log('Selected room:', roomId);
  };
  
  // Handle emoji button long press
  const handleEmojiLongPress = () => {
    // Generate a random emoji with variable reward effect
    const emojis = ['❤️', '😂', '🎉', '👍', '🔥', '💯', '⭐', '🏆', '💪', '👏', '🙌', '🌟', '💫', '💖', '💎'];
    const selectedEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    setRandomEmoji(selectedEmoji);
    
    // Animate the random emoji with enhanced visual impact
    randomEmojiAnim.setValue(0);
    Animated.sequence([
      Animated.timing(randomEmojiAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(randomEmojiAnim, {
        toValue: 0.8,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(randomEmojiAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => setRandomEmoji(null));
  };
  
  // Handle emoji double tap
  const handleEmojiDoubleTap = () => {
    setShowFireworks(true);
    
    // Animate the fireworks with enhanced visual impact
    fireworksAnim.setValue(0);
    Animated.timing(fireworksAnim, {
      toValue: 1,
      duration: 2000, // Longer duration for better effect
      useNativeDriver: true,
    }).start(() => setShowFireworks(false));
  };
  
  // Render a chat message
  const renderMessage = ({ item }) => (
    <View style={styles.messageContainer}>
      <View style={styles.messageAvatarGroup}>
        <Image source={{ uri: item.user.avatar }} style={styles.messageAvatar} />
      </View>
      <View style={styles.messageContent}>
        <Text style={styles.messageUserName}>{item.user.name} {item.user.isVerified && '✓'}</Text>
        <Text style={styles.messageBubble}>{item.message}</Text>
      </View>
    </View>
  );
  
  // Render the user avatars in the chat
  const renderUserAvatars = () => (
    <View style={styles.userAvatarsContainer}>
      {userAvatars.slice(0, 3).map((avatar, index) => (
        <Image 
          key={index}
          source={{ uri: avatar }}
          style={[
            styles.userAvatar,
            { zIndex: userAvatars.length - index, marginLeft: index > 0 ? -12 : 0 }
          ]}
        />
      ))}
    </View>
  );
  
  // Function to toggle description expansion
  const toggleDescriptionExpand = () => {
    setExpandDescription(!expandDescription);
  };
  
  // Add sample reels data
  const SAMPLE_REELS = [
    {
      id: '1',
      user: {
        name: 'CricketInsider',
        avatar: userAvatars[0],
        isVerified: true,
      },
      description: 'Incredible match highlights from yesterday\'s game! What an amazing performance by team India. The batting was spectacular 🏏',
      likes: 87400,
      comments: 2100,
    },
    {
      id: '2',
      user: {
        name: 'SportsDaily',
        avatar: userAvatars[1],
        isVerified: true,
      },
      description: 'Pre-match analysis with the experts. Who\'s your favorite to win today?',
      likes: 45200,
      comments: 980,
    },
    {
      id: '3',
      user: {
        name: 'CricketFever',
        avatar: userAvatars[2],
        isVerified: false,
      },
      description: 'The crowd goes wild as India scores the winning run! What a moment! 🇮🇳',
      likes: 128900,
      comments: 3400,
    },
  ];

  // Handle scroll for reels
  const handleReelScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / height);
    
    if (index !== currentReelIndex && index < SAMPLE_REELS.length) {
      setCurrentReelIndex(index);
      // Reset likes and comments for the new reel
      setLikes(SAMPLE_REELS[index].likes);
      setComments(SAMPLE_REELS[index].comments);
      setIsLiked(false);
      setExpandDescription(false); // Reset description expansion when scrolling
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Scrollable Reels */}
      <ScrollView
        style={styles.reelsScrollView}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onScroll={handleReelScroll}
        scrollEventThrottle={16}
      >
        {SAMPLE_REELS.map((reel, index) => (
          <View key={reel.id} style={styles.reelContainer}>
            {/* This would be a video component in a real implementation */}
            <Image 
              source={{ uri: 'https://i.ibb.co/n3wjfJb/concert-audience.jpg' }}
              style={styles.videoBackground}
              resizeMode="cover"
            />
            
            {/* Overlay gradient for better readability */}
            <View style={styles.gradientOverlay} />
          </View>
        ))}
      </ScrollView>
      
      {/* Top bar with back button and live indicator */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Image 
            source={require('../assets/icons/back.png')} 
            style={styles.backIcon}
          />
        </TouchableOpacity>
        
        {/* Song info in the center - animated */}
        {showSongInfo && (
          <View style={styles.songInfoWrapper}>
            <Animated.View 
              style={[
                styles.songInfoContainer,
                { transform: [{ translateX: songTextPosition }] }
              ]}
            >
              <View style={styles.musicIconContainer}>
                <Text style={styles.musicIconText}>
                  {isMusicEnabled ? '🎵' : '🎵'}
                </Text>
                {!isMusicEnabled && (
                  <Text style={styles.musicCrossIcon}>✕</Text>
                )}
              </View>
              <Text style={styles.songText} numberOfLines={1}>
                Love me like you do - Ellie Goulding
              </Text>
            </Animated.View>
          </View>
        )}
        
        <View style={styles.liveIndicator}>
          <Text style={styles.liveIcon}>•</Text>
          <Text style={styles.liveText}>12.4k</Text>
        </View>
      </View>
      
      {/* Right side interaction buttons */}
      <View style={styles.interactionButtons}>
        <TouchableOpacity style={styles.profileButton}>
          <Image 
            source={{ uri: userAvatars[0] }}
            style={styles.profileButtonImage}
          />
          <View style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.likeButton}
          onPress={handleLikePress}
          activeOpacity={0.8}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Image 
              source={require('../assets/icons/heart.png')} 
              style={[styles.sideBarIcon, {tintColor: isLiked ? '#FF3B30' : '#FFFFFF'}]} 
            />
          </Animated.View>
          <Text style={styles.interactionCount}>{(likes / 1000).toFixed(1)}k</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.commentButton}>
          <Image 
            source={require('../assets/icons/chat.png')} 
            style={[styles.sideBarIcon, {tintColor: '#FFFFFF'}]} 
          />
          <Text style={styles.interactionCount}>{(comments / 1000).toFixed(1)}k</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.shareButton}>
          <Image 
            source={require('../assets/icons/send.png')} 
            style={[styles.sideBarIcon, {tintColor: '#FFFFFF'}]} 
          />
          <Text style={styles.interactionCount}>Share</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.moreButton}>
          <Image 
            source={require('../assets/icons/more.png')} 
            style={[styles.sideBarIcon, {tintColor: '#FFFFFF'}]} 
          />
        </TouchableOpacity>
      </View>
      
      {/* Chat section at the bottom */}
      <View style={styles.chatContainer}>
        {typing && (
          <View style={styles.typingIndicator}>
            <Text style={styles.typingText}>typing...</Text>
          </View>
        )}
        
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.chatMessagesContainer}
          showsVerticalScrollIndicator={false}
          onScrollToIndexFailed={() => {}}
          scrollEventThrottle={16}
          snapToAlignment="start"
          decelerationRate="fast"
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
      </View>
      
      {/* Post Description - Below live chat */}
      <TouchableOpacity 
        style={styles.postDescriptionContainer}
        onPress={toggleDescriptionExpand}
        activeOpacity={0.9}
      >
        <Text 
          style={styles.postDescription} 
          numberOfLines={expandDescription ? undefined : 1}
        >
          {currentReelIndex < SAMPLE_REELS.length ? SAMPLE_REELS[currentReelIndex].description : ''}
          {!expandDescription && SAMPLE_REELS[currentReelIndex].description.length > 40 && (
            <Text style={styles.dots}>...</Text>
          )}
        </Text>
      </TouchableOpacity>
      
      {/* Message input bar with updated icons */}
      <View style={styles.messageInputContainer}>
        <View style={styles.leftIconsContainer}>
          <Animated.View style={{ transform: [{ scale: micButtonAnim }] }}>
            <TouchableOpacity 
              style={[styles.micButton, (voiceRoomVisible || quickPreviewVisible) && styles.micButtonActive]}
              onPress={handleVoiceRoomToggle}
              onLongPress={handleVoiceRoomLongPress}
              delayLongPress={500}
            >
              <Image 
                source={require('../assets/icons/voice.png')} 
                style={styles.inputIcon} 
              />
            </TouchableOpacity>
          </Animated.View>
          
          <TouchableOpacity style={styles.spotifyButton} onPress={handleToggleMusic}>
            <Image 
              source={require('../assets/icons/spotify.png')} 
              style={[
                styles.inputIcon,
                !isMusicEnabled && { opacity: 0.5 }
              ]} 
            />
            {!isMusicEnabled && (
              <View style={styles.disabledIndicator}>
                <Text style={styles.disabledText}>✕</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.emojiButton}
            onPress={handleEmojiButtonClick}
            onLongPress={handleEmojiLongPress}
            delayLongPress={500}
          >
            <Image 
              source={require('../assets/icons/emoji.png')} 
              style={styles.inputIcon} 
            />
          </TouchableOpacity>
        </View>
        
        <TextInput
          style={styles.messageInput}
          placeholder="Message here..."
          placeholderTextColor="#AAAAAA"
          value={newMessage}
          onChangeText={setNewMessage}
          ref={textInputRef}
        />
        
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          <Image 
            source={require('../assets/icons/send-message.png')} 
            style={styles.inputIcon} 
          />
        </TouchableOpacity>
      </View>

      {/* Voice Room Quick Preview */}
      <VoiceRoomQuickPreview 
        visible={quickPreviewVisible}
        onClose={() => setQuickPreviewVisible(false)}
        onRoomPress={handleRoomPress}
        onLongPress={handleVoiceRoomLongPress}
        activeRooms={ACTIVE_VOICE_ROOMS}
        currentRoomId={currentRoomId}
      />

      {/* Voice Room Full Screen */}
      <VoiceRoomScreen 
        visible={voiceRoomVisible}
        onClose={() => setVoiceRoomVisible(false)}
      />

      {/* Random Emoji Animation - Enhanced */}
      {randomEmoji && (
        <Animated.View 
          style={[
            styles.randomEmojiContainer,
            {
              opacity: randomEmojiAnim,
              transform: [
                { scale: randomEmojiAnim.interpolate({
                  inputRange: [0, 0.3, 0.6, 0.8, 1],
                  outputRange: [0.5, 1.8, 1.5, 1.3, 1]
                })},
                { translateY: randomEmojiAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, -150, -120]
                })},
                { rotate: randomEmojiAnim.interpolate({
                  inputRange: [0, 0.3, 0.6, 1],
                  outputRange: ['0deg', '-15deg', '15deg', '0deg']
                })}
              ]
            }
          ]}
        >
          <Text style={styles.randomEmojiText}>{randomEmoji}</Text>
          <Animated.View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              opacity: randomEmojiAnim.interpolate({
                inputRange: [0, 0.3, 0.7, 1],
                outputRange: [0, 0.6, 0.3, 0]
              })
            }}
          >
            <Text style={[styles.randomEmojiText, {fontSize: 55, opacity: 0.5}]}>{randomEmoji}</Text>
          </Animated.View>
        </Animated.View>
      )}
      
      {/* Fireworks Animation - Enhanced visual impact */}
      {showFireworks && (
        <Animated.View 
          style={[
            styles.fireworksContainer,
            {
              opacity: fireworksAnim.interpolate({
                inputRange: [0, 0.1, 0.8, 1],
                outputRange: [0, 1, 1, 0]
              })
            }
          ]}
        >
          <View style={styles.fireworksInner}>
            {['🎉', '✨', '💫', '⭐', '🔥', '💥', '🎊', '🎈', '🏆', '❤️'].map((emoji, index) => (
              <Animated.Text 
                key={index}
                style={[
                  styles.fireworksEmoji,
                  {
                    left: `${(index % 5) * 20}%`,
                    top: `${Math.floor(index / 5) * 30}%`,
                    transform: [
                      { translateY: fireworksAnim.interpolate({
                        inputRange: [0, 0.4, 0.8, 1],
                        outputRange: [100, -80 * ((index % 3) + 1), -40 * ((index % 3) + 1), 0]
                      })},
                      { translateX: fireworksAnim.interpolate({
                        inputRange: [0, 0.4, 0.8, 1],
                        outputRange: [0, (index % 2 === 0 ? 100 : -100), (index % 2 === 0 ? 50 : -50), 0]
                      })},
                      { scale: fireworksAnim.interpolate({
                        inputRange: [0, 0.2, 0.8, 1],
                        outputRange: [0.5, 2, 1.5, 0.8]
                      })},
                      { rotate: fireworksAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', `${(index % 2 === 0 ? '' : '-')}${180 + (index * 30)}deg`]
                      })}
                    ]
                  }
                ]}
              >
                {emoji}
              </Animated.Text>
            ))}
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  reelsScrollView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  reelContainer: {
    width,
    height,
    position: 'relative',
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  videoBackground: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    marginTop: -5,
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 45,
    paddingHorizontal: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  songInfoWrapper: {
    flex: 1,
    marginHorizontal: 10,
    height: 28,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 14,
    marginTop: -5,
  },
  songInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: 'auto',
  },
  musicIconContainer: {
    marginRight: 5,
    position: 'relative',
  },
  musicIconText: {
    fontSize: 13,
  },
  musicCrossIcon: {
    position: 'absolute',
    right: -2,
    top: -2,
    fontSize: 10,
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  songText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    height: 28,
    marginTop: -5,
  },
  liveIcon: {
    color: '#FF3B30',
    fontSize: 18,
    marginRight: 3,
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  interactionButtons: {
    position: 'absolute',
    right: 12,
    bottom: 100,
    alignItems: 'center',
    zIndex: 10,
  },
  profileButton: {
    width: 40,
    height: 40,
    marginBottom: 18,
    position: 'relative',
  },
  profileButtonImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  addButton: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  likeButton: {
    alignItems: 'center',
    marginBottom: 16,
  },
  commentButton: {
    alignItems: 'center',
    marginBottom: 16,
  },
  shareButton: {
    alignItems: 'center',
    marginBottom: 16,
  },
  moreButton: {
    alignItems: 'center',
  },
  sideBarIcon: {
    width: 30,
    height: 30,
    marginBottom: 4,
  },
  likedIcon: {
    color: '#FF3B30',
  },
  interactionCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  chatContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 67,
    height: 187,
    paddingBottom: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  typingIndicator: {
    position: 'absolute',
    top: -24,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  typingText: {
    color: '#BBBBBB',
    fontSize: 11,
  },
  chatMessagesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 30,
  },
  chatAvatarsContainer: {
    position: 'absolute',
    left: 16,
    bottom: 80,
  },
  userAvatarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatAvatarBubblesContainer: {
    paddingRight: 40,
  },
  chatAvatarBubble: {
    backgroundColor: 'rgba(145, 71, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  chatAvatarBubbleText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  messageAvatarGroup: {
    width: 24,
    marginRight: 6,
  },
  messageAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(145, 71, 255, 0.4)',
  },
  messageContent: {
    flex: 1,
    marginBottom: 2,
  },
  messageUserName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 3,
    opacity: 0.95,
  },
  messageBubble: {
    backgroundColor: 'rgba(145, 71, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    color: '#FFFFFF',
    fontSize: 13,
    maxWidth: '75%',
    lineHeight: 18,
  },
  messageInputContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: 'rgba(50, 50, 50, 0.8)',
    borderRadius: 20,
    paddingHorizontal: 6,
    height: 40,
    zIndex: 11,
  },
  leftIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 2,
  },
  micButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  micButtonActive: {
    backgroundColor: '#FF3B30',
  },
  messageInput: {
    flex: 1,
    height: 36,
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 6,
    paddingHorizontal: 2,
    paddingVertical: 8,
    marginBottom: 2,
  },
  sendButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputIcon: {
    width: 28,
    height: 28,
  },
  spotifyButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
  },
  emojiButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 2,
  },
  disabledIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  disabledText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  randomEmojiContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  randomEmojiText: {
    color: '#FFFFFF',
    fontSize: 45,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  fireworksContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  fireworksInner: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  fireworksEmoji: {
    position: 'absolute',
    color: '#FFD700',
    fontSize: 40,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  postDescriptionContainer: {
    position: 'absolute',
    left: 0,
    right: 70,
    bottom: 55,
    paddingHorizontal: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 4,
  },
  postDescription: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 16,
  },
  dots: {
    fontSize: 13,
    color: '#BBBBBB',
  },
});

export default UnifiedReelsStream; 