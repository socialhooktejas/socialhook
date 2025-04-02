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

// Import local icons
const searchIcon = require('../assets/icons/search.png');
const podiumIcon = require('../assets/icons/podium.png');

// Sample data with demo video URLs
// These videos will be cached when they load for faster subsequent viewing
const SAMPLE_REELS = [
  {
    id: '1',
    videoUri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    user: {
      id: 'user1',
      username: 'dancequeen',
      profilePic: 'https://randomuser.me/api/portraits/women/81.jpg',
      isVerified: true,
    },
    description: 'Dancing in the neon lights 💃 #dance #neonlights #nightlife',
    likes: 45600,
    comments: 892,
    shares: 210,
    music: 'Original Sound - Dance Queen',
  },
  {
    id: '2',
    videoUri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    user: {
      id: 'user2',
      username: 'familytime',
      profilePic: 'https://randomuser.me/api/portraits/women/45.jpg',
      isVerified: false,
    },
    description: 'Creating Christmas memories with my little one 🎄 #christmas #family #holidays',
    likes: 15200,
    comments: 342,
    shares: 89,
    music: 'All I Want for Christmas - Mariah Carey',
  },
  {
    id: '3',
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
    id: '4',
    videoUri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    user: {
      id: 'user4',
      username: 'urbanvibes',
      profilePic: 'https://randomuser.me/api/portraits/men/36.jpg',
      isVerified: false,
    },
    description: 'Friday night vibes in the city 🌃 #nightlife #urban #weekend',
    likes: 23500,
    comments: 412,
    shares: 98,
    music: 'Blinding Lights - The Weeknd',
  },
  {
    id: '5',
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
    id: '6',
    videoUri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    user: {
      id: 'user6',
      username: 'streetlife',
      profilePic: 'https://randomuser.me/api/portraits/men/42.jpg',
      isVerified: true,
    },
    description: 'Street photography tour downtown 📸 #photography #urban #streetlife',
    likes: 32700,
    comments: 456,
    shares: 213,
    music: 'City Lights - Electronic Dreams',
  },
  {
    id: '7',
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
    id: '8',
    videoUri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    user: {
      id: 'user8',
      username: 'fitness_guru',
      profilePic: 'https://randomuser.me/api/portraits/men/22.jpg',
      isVerified: true,
    },
    description: 'Quick 5-minute home workout 💪 #fitness #workout #motivation',
    likes: 89100,
    comments: 1423,
    shares: 732,
    music: 'Pump It Up - Workout Mix',
  },
  {
    id: '9',
    videoUri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    user: {
      id: 'user9',
      username: 'food_lover',
      profilePic: 'https://randomuser.me/api/portraits/women/33.jpg',
      isVerified: false,
    },
    description: 'Easy 15-minute pasta recipe 🍝 #cooking #food #recipe',
    likes: 76300,
    comments: 982,
    shares: 543,
    music: 'Kitchen Vibes - Cooking Songs',
  },
  {
    id: '10',
    videoUri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    user: {
      id: 'user10',
      username: 'pet_paradise',
      profilePic: 'https://randomuser.me/api/portraits/women/91.jpg',
      isVerified: true,
    },
    description: 'My dog learning a new trick 🐕 #pets #dogs #cute',
    likes: 123400,
    comments: 2341,
    shares: 987,
    music: 'Happy Days - Pet Lovers',
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
  
  return (
    <View style={styles.container}>
      <FlatList
        data={SAMPLE_REELS}
        renderItem={({ item, index }) => (
          <ReelItem 
            item={item} 
            isActive={index === activeIndex}
            onError={() => handleItemError(item.id)}
          />
        )}
        keyExtractor={item => item.id}
        pagingEnabled
        snapToAlignment="start"
        decelerationRate={0.9}
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
});

export default HomeScreen; 