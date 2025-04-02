import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  ViewToken,
  TouchableOpacity,
  Image,
  Text,
  Platform,
  AppState,
  Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ReelItem from '../components/ReelItem';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

// Helper function to format numbers
const formatCount = (count: number): string => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
};

// Import local icons
const searchIcon = require('../assets/icons/search.png');
const podiumIcon = require('../assets/icons/podium.png');
const musicIcon = require('../assets/icons/music.png');
const heartIcon = require('../assets/icons/heart.png');
const chatIcon = require('../assets/icons/chat.png');
const sendIcon = require('../assets/icons/send.png');
const moreIcon = require('../assets/icons/more.png');

// Sample data with demo video URLs
// These videos will be cached when they load for faster subsequent viewing
const SAMPLE_REELS = [
  {
    id: '1',
    type: 'video',
    videoUri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    user: {
      id: '1',
      username: 'travel_diary',
      profilePic: 'https://randomuser.me/api/portraits/women/1.jpg',
      isVerified: true
    },
    description: 'Exploring the hidden gems of Bali 🌴 #Travel #Adventure',
    likes: 1234,
    comments: 89,
    shares: 45,
    music: 'Original Sound - Travel Diary'
  },
  {
    id: '2',
    type: 'image',
    imageUri: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    user: {
      id: '2',
      username: 'meme_lord',
      profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
      isVerified: false
    },
    description: 'When you finally fix that bug at 3 AM 😅 #coding #memes #developer',
    likes: 856,
    comments: 42,
    shares: 23,
    music: 'Original Sound - Meme Lord'
  },
  {
    id: '3',
    type: 'carousel',
    carouselImages: [
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
      'https://images.unsplash.com/photo-1542831371-29b0f74f9713',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
      'https://images.unsplash.com/photo-1505238680356-667803448bb6'
    ],
    user: {
      id: '3',
      username: 'ui_designer',
      profilePic: 'https://randomuser.me/api/portraits/women/23.jpg',
      isVerified: true
    },
    description: 'My UI design evolution over 4 years 📱 Swipe to see the progress! Which one do you like best? #uidesign #process #design',
    likes: 4521,
    comments: 132,
    shares: 78,
    music: 'Original Sound - Design Thoughts'
  },
  {
    id: '4',
    type: 'dynamicGroup',
    videoUri: null,
    imageUri: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e',
    user: {
      id: '4',
      username: 'cricketverse',
      profilePic: 'https://randomuser.me/api/portraits/men/32.jpg',
      isVerified: true
    },
    description: 'Cricket GOAT Debate: Virat Kohli vs MS Dhoni',
    likes: 15700,
    comments: 2100,
    shares: 954,
    music: null,
    groupDetails: {
      debateTopic: 'Virat Kohli vs MS Dhoni: Who is the GOAT?',
      liveCount: 1200,
      timeAgo: '2h ago',
      closesIn: {
        hours: 2,
        minutes: 45
      },
      player1: {
        name: 'Virat Kohli',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        votePercentage: 52,
        voteCount: 48200,
        gradientColors: ['#00B0FF', '#2979FF']
      },
      player2: {
        name: 'MS Dhoni',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
        votePercentage: 48,
        voteCount: 45800,
        gradientColors: ['#FF4081', '#F50057']
      }
    }
  },
  {
    id: '5',
    type: 'dynamicGroup',
    videoUri: null,
    imageUri: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da',
    user: {
      id: 'cricket101',
      username: 'CricketDebates',
      isVerified: true,
      profilePic: 'https://randomuser.me/api/portraits/men/22.jpg'
    },
    description: 'Who is the Cricket GOAT? Join the debate now!',
    likes: 1845,
    comments: 258,
    shares: 76,
    music: null,
    groupDetails: {
      debateTopic: 'Sachin vs Virat: Who is the GOAT?',
      liveCount: 432,
      timeAgo: '3h ago',
      closesIn: {
        hours: 5,
        minutes: 30
      },
      player1: {
        name: 'Sachin Tendulkar',
        avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
        votePercentage: 52,
        voteCount: 1248,
        gradientColors: ['#00B0FF', '#2979FF']
      },
      player2: {
        name: 'Virat Kohli',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        votePercentage: 48,
        voteCount: 1152,
        gradientColors: ['#FF4081', '#F50057']
      }
    }
  },
  {
    id: '6',
    type: 'image',
    imageUri: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
    user: {
      id: '4',
      username: 'tech_humor',
      profilePic: 'https://randomuser.me/api/portraits/men/36.jpg',
      isVerified: false,
    },
    description: 'My code vs My code after 6 months 😂 #programming #memes #coding',
    likes: 23500,
    comments: 412,
    shares: 98,
    music: 'Original Sound - Tech Humor',
  },
  {
    id: '7',
    type: 'carousel',
    carouselImages: [
      'https://images.unsplash.com/photo-1581276879432-15e50529f34b',
      'https://images.unsplash.com/photo-1505685296765-3a2736de412f',
      'https://images.unsplash.com/photo-1592194996308-7b43878e84a6',
      'https://images.unsplash.com/photo-1555952494-efd681c7e3f9'
    ],
    user: {
      id: '6',
      username: 'webdev_tips',
      profilePic: 'https://randomuser.me/api/portraits/men/45.jpg',
      isVerified: true
    },
    description: '4 CSS tricks every frontend developer should know 💻 Swipe for all tips! #webdev #tips #css #frontend',
    likes: 12680,
    comments: 342,
    shares: 187,
    music: 'Original Sound - WebDev Community'
  },
  {
    id: '8',
    type: 'video',
    videoUri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    user: {
      id: 'user5',
      username: 'neonwave',
      profilePic: 'https://randomuser.me/api/portraits/women/29.jpg',
      isVerified: true,
    },
    description: 'Lost in the neon dream 💫 #neon #aesthetic #vibes',
    likes: 67800,
    comments: 703,
    shares: 412,
    music: 'Retrowave - Neon Dreams',
  },
  {
    id: '9',
    type: 'carousel',
    carouselImages: [
      'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
      'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d',
      'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6'
    ],
    user: {
      id: '8',
      username: 'coding_journey',
      profilePic: 'https://randomuser.me/api/portraits/women/42.jpg',
      isVerified: false
    },
    description: 'My desk setup evolution from beginner to pro developer 🖥️ Swipe to see all phases! Which one is your favorite? #workspace #programming #setup',
    likes: 34560,
    comments: 678,
    shares: 230,
    music: 'Original Sound - Tech Life'
  },
  {
    id: '10',
    type: 'image',
    imageUri: 'https://i.imgur.com/3XZQZ9Y.jpg',
    user: {
      id: '9',
      username: 'dev_jokes',
      profilePic: 'https://randomuser.me/api/portraits/men/42.jpg',
      isVerified: true,
    },
    description: 'When the client says "make it pop" 🎨 #design #memes #developer',
    likes: 32700,
    comments: 456,
    shares: 213,
    music: 'Original Sound - Dev Jokes',
  },
  {
    id: '11',
    type: 'video',
    videoUri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    user: {
      id: 'user7',
      username: 'travel_addict',
      profilePic: 'https://randomuser.me/api/portraits/women/58.jpg',
      isVerified: false,
    },
    description: 'Morning hike in the mountains 🏔️ #travel #adventure #nature',
    likes: 54200,
    comments: 623,
    shares: 312,
    music: 'Adventure - John Smith',
  },
  {
    id: '12',
    type: 'carousel',
    carouselImages: [
      'https://i.imgur.com/xELwDTv.jpg',
      'https://i.imgur.com/uA6Sxwo.jpg',
      'https://i.imgur.com/dBWNPQk.jpg',
      'https://i.imgur.com/vvGjUSE.jpg'
    ],
    user: {
      id: '11',
      username: 'mobile_dev',
      profilePic: 'https://randomuser.me/api/portraits/men/56.jpg',
      isVerified: true
    },
    description: 'React Native vs Flutter - Pros & Cons comparison 📊 Swipe through to see my analysis! Which do you prefer? #reactnative #flutter #mobiledev',
    likes: 56789,
    comments: 1254,
    shares: 842,
    music: 'Original Sound - Tech Talk'
  },
  {
    id: '13',
    type: 'image',
    imageUri: 'https://i.imgur.com/7XZQZ9Y.jpg',
    user: {
      id: '12',
      username: 'code_memes',
      profilePic: 'https://randomuser.me/api/portraits/men/22.jpg',
      isVerified: true,
    },
    description: 'When you find a bug in production 😱 #coding #memes #developer',
    likes: 89100,
    comments: 1423,
    shares: 732,
    music: 'Original Sound - Code Memes',
  }
];

// Header component
const HomeHeader = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('for-you');
  
  const handlePodiumPress = () => {
    navigation.navigate('LeaderboardScreen');
  };

  const handleSearchPress = () => {
    navigation.navigate('ExploreScreen', { focusSearch: true });
  };
  
  const handleNotificationPress = () => {
    navigation.navigate('NotificationScreen');
  };
  
  return (
    <View style={styles.header}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setActiveTab('following')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'following' && styles.activeTabText
          ]}>
            Following
          </Text>
          {activeTab === 'following' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setActiveTab('for-you')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'for-you' && styles.activeTabText
          ]}>
            For You
          </Text>
          {activeTab === 'for-you' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleNotificationPress}
        >
          <View style={styles.notificationIconContainer}>
            <MaterialIcons name="notifications" size={24} color="white" />
            <View style={styles.notificationBadge} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handlePodiumPress}
        >
          <Image source={podiumIcon} style={styles.actionIcon} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleSearchPress}
        >
          <Image source={searchIcon} style={styles.actionIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HomeScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadingError, setLoadingError] = useState(false);
  const [isScreenFocused, setIsScreenFocused] = useState(true);
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  // Listen for navigation focus/blur events
  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      setIsScreenFocused(true);
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      setIsScreenFocused(false);
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);
  
  // Handle app state changes to pause videos when app goes to background
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState.match(/inactive|background/)) {
        setIsScreenFocused(false);
      } else if (nextAppState === 'active') {
        setIsScreenFocused(true);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
    };
  }, []);
  
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
  }).current;
  
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80
  };
  
  const handleItemError = (itemId: string) => {
    console.log(`Video error for item ${itemId}`);
    setLoadingError(true);
  };
  
  const handleJoinDebate = (item) => {
    // Fade out animation
    Animated.timing(fadeAnim, {
      toValue: 0.3,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ offset: 0, animated: true });
      }
      
      setTimeout(() => {
        navigation.navigate('DynamicGroupScreen', { groupId: item.user.id });
        
        // Fade back in after navigation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }, 300);
    });
  };
  
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    // Only consider the item active if it's the active index AND the screen is focused
    const isVisible = index === activeIndex && isScreenFocused;
    
    // If it's a dynamic group card, render the custom group card
    if (item.type === 'dynamicGroup') {
      const formatCountdown = () => {
        const { hours, minutes } = item.groupDetails.closesIn;
        return `${hours}h ${minutes}m`;
      };
      
      // Right sidebar actions that are standard across all reel types
      const renderRightSidebar = () => (
        <View style={styles.interactionSidebar}>
          <View style={styles.interactionButton}>
            <Image source={heartIcon} style={styles.actionIconImage} />
            <Text style={styles.actionCount}>{formatCount(item.likes)}</Text>
          </View>
          
          <View style={styles.interactionButton}>
            <Image source={chatIcon} style={styles.actionIconImage} />
            <Text style={styles.actionCount}>{formatCount(item.comments)}</Text>
          </View>
          
          <View style={styles.interactionButton}>
            <Image source={sendIcon} style={styles.actionIconImage} />
            <Text style={styles.actionCount}>{formatCount(item.shares)}</Text>
          </View>
          
          <View style={styles.interactionButton}>
            <Image source={moreIcon} style={styles.actionIconImage} />
          </View>
        </View>
      );
      
      return (
        <View style={styles.reelContainer}>
          {/* User info overlay */}
          <TouchableOpacity 
            style={styles.userInfoOverlay}
            onPress={() => navigation.navigate('ProfileScreen', { userId: item.user.id })}
          >
            <Image 
              source={{ uri: item.user.profilePic }} 
              style={styles.profilePic}
            />
            <View>
              <Text style={styles.username}>
                {item.user.username}
                {item.user.isVerified && (
                  <Text style={styles.verifiedBadge}> ✓</Text>
                )}
              </Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </TouchableOpacity>
          
          {/* Hot debate card - exact copy from GroupScreen */}
          <View style={styles.hotDebateContainer}>
            <View style={styles.debateCardContainer}>
              {/* Top row with tags */}
              <View style={styles.debateCardTopRow}>
                <View style={styles.debateCardBadge}>
                  <Text style={styles.debateCardBadgeText}>HOT DEBATE</Text>
                </View>
                <View style={styles.liveCountBadge}>
                  <View style={styles.liveIndicator} />
                  <Text style={styles.liveCountText}>12K LIVE</Text>
                </View>
              </View>
              
              {/* Title section */}
              <Text style={styles.debateCardTitle}>
                {item.groupDetails.debateTopic}
              </Text>
              
              {/* Image with timer overlay */}
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: item.imageUri }} 
                  style={styles.debateImage}
                  resizeMode="cover"
                  defaultSource={require('../assets/icons/placeholder.png')}
                />
                <View style={styles.timerContainer}>
                  <LinearGradient
                    colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.6)']}
                    style={styles.timerGradient}
                  >
                    <MaterialIcons name="timer" size={14} color="#FFFFFF" />
                    <Text style={styles.timerText}>
                      Closes in {formatCountdown()}
                    </Text>
                  </LinearGradient>
                </View>
              </View>
              
              {/* Vote cards row */}
              <View style={styles.voteCardsContainer}>
                <TouchableOpacity style={styles.voteCard} onPress={() => handleJoinDebate(item)}>
                  <View style={styles.voteCardTop}>
                    <Image 
                      source={{uri: 'https://randomuser.me/api/portraits/men/32.jpg'}} 
                      style={styles.playerAvatar}
                      defaultSource={require('../assets/icons/profile.png')}
                    />
                    <Text style={styles.playerName}>Virat Kohli</Text>
                  </View>
                  <View style={styles.voteProgressContainer}>
                    <LinearGradient
                      colors={['#00B0FF', '#2979FF']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                      style={[styles.voteProgressBar, {width: '52%'}]}
                    />
                  </View>
                  <Text style={styles.votePercentage}>52% · 48.2K votes</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.voteCard} onPress={() => handleJoinDebate(item)}>
                  <View style={styles.voteCardTop}>
                    <Image 
                      source={{uri: 'https://randomuser.me/api/portraits/men/45.jpg'}} 
                      style={styles.playerAvatar}
                      defaultSource={require('../assets/icons/profile.png')}
                    />
                    <Text style={styles.playerName}>MS Dhoni</Text>
                  </View>
                  <View style={styles.voteProgressContainer}>
                    <LinearGradient
                      colors={['#FF4081', '#F50057']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                      style={[styles.voteProgressBar, {width: '48%'}]}
                    />
                  </View>
                  <Text style={styles.votePercentage}>48% · 45.8K votes</Text>
                </TouchableOpacity>
              </View>
              
              {/* Join button row */}
              <View style={styles.engagementRow}>
                <TouchableOpacity style={styles.joinButton} onPress={() => handleJoinDebate(item)}>
                  <LinearGradient
                    colors={['#FFC107', '#FF9800']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.joinButtonGradient}
                  >
                    <Text style={styles.joinButtonText}>Join Debate</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          {renderRightSidebar()}
        </View>
      );
    }
    
    // Otherwise render normal reel item
    return (
      <ReelItem
        item={item}
        isActive={isVisible}
        onError={handleItemError}
      />
    );
  };
  
  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <HomeHeader navigation={navigation} />
      
      <FlatList
        data={SAMPLE_REELS}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        pagingEnabled
        snapToAlignment="start"
        decelerationRate="fast"
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        showsVerticalScrollIndicator={false}
        snapToInterval={Dimensions.get('window').height}
        scrollEventThrottle={16}
        maxToRenderPerBatch={1}
        windowSize={3}
        initialNumToRender={1}
        removeClippedSubviews={true}
        bounces={false}
        bouncesZoom={false}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
        getItemLayout={(data, index) => ({
          length: Dimensions.get('window').height,
          offset: Dimensions.get('window').height * index,
          index,
        })}
        ref={flatListRef}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 45,
    paddingBottom: 10,
    height: Platform.OS === 'ios' ? 100 : 90,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3,
  },
  tabButton: {
    paddingHorizontal: 16,
    position: 'relative',
    alignItems: 'center',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 7,
  },
  activeTabText: {
    color: 'white',
    fontWeight: '700',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 20,
    height: 3,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    marginRight: -2,
  },
  actionButton: {
    marginLeft: 18,
  },
  actionIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
    marginTop: 0,
  },
  notificationIconContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: 'black',
  },
  reelContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#121212',
    position: 'relative',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  bottomLeftSection: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  username: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  verifiedBadge: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
  },
  description: {
    color: 'white',
    fontSize: 14,
    fontWeight: '400',
  },
  musicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  musicIcon: {
    marginRight: 5,
  },
  musicText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '400',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconImage: {
    width: 32,
    height: 32,
    tintColor: 'white',
  },
  actionCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 3,
  },
  menuIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconImage: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  debateCardContainer: {
    width: Dimensions.get('window').width,
    backgroundColor: '#3F51B5',
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#5C6BC0',
    borderRadius: 0,
    overflow: 'hidden',
  },
  debateCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#3F51B5',
  },
  debateCardBadge: {
    backgroundColor: '#FFC107',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  debateCardBadgeText: {
    color: '#212121',
    fontWeight: 'bold',
    fontSize: 11,
    letterSpacing: 0.3,
  },
  liveCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F44336',
    marginRight: 4,
  },
  liveCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  debateCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  imageContainer: {
    width: Dimensions.get('window').width,
    height: 240,
    position: 'relative',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderColor: '#EFEFEF',
    backgroundColor: '#000',
  },
  debateImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.9,
  },
  timerContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  timerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: '100%',
    height: '100%',
  },
  timerText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  voteCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#3F51B5',
  },
  voteCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  voteCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  playerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  playerName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  voteProgressContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 4,
    marginBottom: 6,
    overflow: 'hidden',
  },
  voteProgressBar: {
    height: '100%',
    borderRadius: 5,
  },
  votePercentage: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  engagementRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#3F51B5',
  },
  joinButton: {
    borderRadius: 24,
    overflow: 'hidden',
    width: '80%',
    alignSelf: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  joinButtonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  joinButtonText: {
    color: '#212121',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rightSidebar: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    alignItems: 'center',
    zIndex: 10,
  },
  sidebarIconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  sidebarIconText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
  userInfoOverlay: {
    position: 'absolute',
    bottom: 70,
    left: 16,
    right: 100,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  hotDebateContainer: {
    width: Dimensions.get('window').width,
    marginTop: Platform.OS === 'ios' ? 110 : 100,
    backgroundColor: '#303F9F',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    alignSelf: 'center',
  },
  playerNameBig: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  votePercentageBig: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  interactionSidebar: {
    position: 'absolute',
    bottom: 120,
    right: 16,
    alignItems: 'center',
    zIndex: 100,
  },
  interactionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default HomeScreen; 