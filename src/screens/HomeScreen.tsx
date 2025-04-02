import React, { useState, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  ViewToken,
  TouchableOpacity,
  Image,
  Text,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ReelItem from '../components/ReelItem';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
    imageUri: 'https://i.imgur.com/8tBxTWD.jpg',
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
      'https://i.imgur.com/pKd7Uva.jpg',
      'https://i.imgur.com/qGPof5F.jpg',
      'https://i.imgur.com/0cgwJPZ.jpg',
      'https://i.imgur.com/CjgYnY3.jpg'
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
    type: 'video',
    videoUri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    user: {
      id: 'user3',
      username: 'glammakeup',
      profilePic: 'https://randomuser.me/api/portraits/women/63.jpg',
      isVerified: true,
    },
    description: 'Silver glam look for your holiday parties ✨ #makeup #glam #tutorial',
    likes: 89400,
    comments: 1024,
    shares: 578,
    music: 'Glitter & Gold - Barnes Courtney',
  },
  {
    id: '5',
    type: 'image',
    imageUri: 'https://i.imgur.com/9Yg7vFd.jpg',
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
    id: '6',
    type: 'carousel',
    carouselImages: [
      'https://i.imgur.com/JHT5ERm.jpg',
      'https://i.imgur.com/9vTsXvP.jpg',
      'https://i.imgur.com/YUNsW92.jpg',
      'https://i.imgur.com/8NwxINw.jpg'
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
    id: '7',
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
    id: '8',
    type: 'carousel',
    carouselImages: [
      'https://i.imgur.com/NXy5dBP.jpg',
      'https://i.imgur.com/YrOJJBM.jpg',
      'https://i.imgur.com/xNQroVl.jpg',
      'https://i.imgur.com/KzmtRAs.jpg'
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
    id: '9',
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
    id: '10',
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
    id: '11',
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
    id: '12',
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
const HomeHeader = () => {
  const [activeTab, setActiveTab] = useState('for-you');
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
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
  
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isVisible = index === activeIndex;
    return (
      <ReelItem
        item={item}
        isActive={isVisible}
        onError={handleItemError}
      />
    );
  };
  
  return (
    <View style={styles.container}>
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
      />
      
      {/* Header overlay */}
      <View style={styles.headerContainer}>
        <HomeHeader />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
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
    backgroundColor: '#000',
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
    width: 20,
    height: 20,
    tintColor: 'white',
    marginLeft: 10,
  },
  actionCount: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
});

export default HomeScreen; 