import React, { useState, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  ViewToken,
  TouchableOpacity,
  Image,
  Text
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ReelItem from '../components/ReelItem';

// Import local icons
const searchIcon = require('../assets/icons/search.png');
const podiumIcon = require('../assets/icons/podium.png');
const notificationIcon = require('../assets/icons/notifications.png');

// Sample data
const SAMPLE_REELS = [
  {
    id: '1',
    videoUri: 'https://assets.mixkit.co/videos/preview/mixkit-woman-dancing-under-neon-lights-1230-large.mp4',
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
    videoUri: 'https://assets.mixkit.co/videos/preview/mixkit-young-mother-with-her-little-daughter-decorating-a-christmas-tree-39745-large.mp4',
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
    videoUri: 'https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-fashion-woman-with-silver-makeup-39875-large.mp4',
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
    videoUri: 'https://assets.mixkit.co/videos/preview/mixkit-man-under-multicolored-lights-1237-large.mp4',
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
    videoUri: 'https://assets.mixkit.co/videos/preview/mixkit-girl-with-neon-lights-1232-large.mp4',
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
          onPress={handlePodiumPress}
        >
          <Image source={podiumIcon} style={styles.actionIcon} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleNotificationPress}
        >
          <View style={styles.notificationIconContainer}>
            <Image source={notificationIcon} style={styles.actionIcon} />
            <View style={styles.notificationBadge} />
          </View>
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
  
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
  }).current;
  
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <HomeHeader />
      </View>
      <FlatList
        data={SAMPLE_REELS}
        renderItem={({ item, index }) => (
          <ReelItem 
            item={item} 
            isActive={index === activeIndex}
          />
        )}
        keyExtractor={item => item.id}
        pagingEnabled
        snapToAlignment="start"
        decelerationRate={0.7}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        showsVerticalScrollIndicator={false}
        snapToInterval={Dimensions.get('window').height - 60}
        scrollEventThrottle={16}
        maxToRenderPerBatch={2}
        windowSize={5}
        initialNumToRender={2}
        removeClippedSubviews={false}
        bounces={false}
        bouncesZoom={false}
        contentContainerStyle={{ paddingTop: 80 }}
      />
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
    paddingTop: 40,
    paddingBottom: 6,
    height: 82,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.9)',
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