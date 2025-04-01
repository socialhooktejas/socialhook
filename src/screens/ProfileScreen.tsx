import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Animated,
  FlatList,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utils/theme';

// Icons
const backIcon = require('../assets/icons/back.png');
const notificationIcon = require('../assets/icons/notifications.png');
const menuIcon = require('../assets/icons/more.png');
const gridIcon = require('../assets/icons/explore.png');
const heartIcon = require('../assets/icons/heart.png');
const shareIcon = require('../assets/icons/send.png');
const messageIcon = require('../assets/icons/messages.png');
const linkIcon = require('../assets/icons/link.png');
const verifiedIcon = require('../assets/icons/verified.png');
const followIcon = require('../assets/icons/user.png');
const playIcon = require('../assets/icons/play.png');
const bookmarkIcon = require('../assets/icons/bookmark.png');
const tagIcon = require('../assets/icons/at.png');

const { width } = Dimensions.get('window');

// Profile data
const PROFILE_DATA = {
  username: 'falcao8000',
  displayName: 'Radamel Falcao',
  avatar: 'https://i.imgur.com/lqe9Brx.jpg',
  bio: 'Join my livestream everyday',
  following: 583,
  followers: 921900,
  likes: 19600000,
  website: 'https://youtube.com/channel/UCMvgzN1E-...',
  isVerified: true,
  isLive: true,
};

// Video content data
const VIDEO_DATA = [
  {
    id: '1',
    thumbnail: 'https://i.imgur.com/yWHfKiG.jpg',
    views: 5412,
    duration: '0:30',
    type: 'video',
    likes: 2540,
  },
  {
    id: '2',
    thumbnail: 'https://i.imgur.com/KQpMuli.jpg',
    views: 8247,
    duration: '0:45',
    type: 'video',
    likes: 3875,
  },
  {
    id: '3',
    thumbnail: 'https://i.imgur.com/bkSG1x2.jpg',
    views: 17200,
    duration: '1:20',
    type: 'video',
    likes: 7320,
  },
  {
    id: '4',
    thumbnail: 'https://i.imgur.com/FQdNGFb.jpg',
    views: 7823,
    duration: '0:50',
    type: 'video',
    likes: 4215,
  },
  {
    id: '5',
    thumbnail: 'https://i.imgur.com/sUpqYG8.jpg',
    views: 9324,
    duration: '1:05',
    type: 'video',
    likes: 4893,
  },
  {
    id: '6',
    thumbnail: 'https://i.imgur.com/HiJXK3M.jpg',
    views: 11248,
    duration: '0:35',
    type: 'video',
    likes: 5732,
  },
  {
    id: '7',
    thumbnail: 'https://i.imgur.com/yWHfKiG.jpg',
    views: 6521,
    duration: '0:42',
    type: 'video',
    likes: 3109,
  },
  {
    id: '8',
    thumbnail: 'https://i.imgur.com/KQpMuli.jpg',
    views: 8912,
    duration: '1:10',
    type: 'video',
    likes: 4621,
  },
  {
    id: '9',
    thumbnail: 'https://i.imgur.com/bkSG1x2.jpg',
    views: 10453,
    duration: '0:55',
    type: 'video',
    likes: 5240,
  },
  {
    id: '10',
    thumbnail: 'https://i.imgur.com/FQdNGFb.jpg',
    views: 14325,
    duration: '1:30',
    type: 'video',
    likes: 7856,
  },
  {
    id: '11',
    thumbnail: 'https://i.imgur.com/sUpqYG8.jpg',
    views: 7634,
    duration: '0:38',
    type: 'video',
    likes: 3942,
  },
  {
    id: '12',
    thumbnail: 'https://i.imgur.com/HiJXK3M.jpg',
    views: 9532,
    duration: '1:15',
    type: 'video',
    likes: 5124,
  },
];

// Interactive features
const INTERACTIVE_FEATURES = [
  {
    id: '1',
    title: '10 S.challenge',
    icon: playIcon,
  },
  {
    id: '2',
    title: 'TimeWarpScan',
    icon: playIcon,
  },
  {
    id: '3',
    title: 'Quiz',
    icon: playIcon,
  },
];

// Story highlights data
const HIGHLIGHTS = [
  {
    id: '1',
    title: 'Travel',
    thumbnail: 'https://i.imgur.com/FQdNGFb.jpg',
  },
  {
    id: '2',
    title: 'Music',
    thumbnail: 'https://i.imgur.com/KQpMuli.jpg',
  },
  {
    id: '3',
    title: 'Food',
    thumbnail: 'https://i.imgur.com/sUpqYG8.jpg',
  },
  {
    id: '4',
    title: 'Sports',
    thumbnail: 'https://i.imgur.com/bkSG1x2.jpg',
  },
  {
    id: '5',
    title: 'New',
    thumbnail: '',
    isAdd: true,
  }
];

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('grid');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });
  const [likedVideos, setLikedVideos] = useState<string[]>([]);
  const likingAnimations = useRef<{[key: string]: Animated.Value}>({});
  
  // Initialize animations for each video
  useEffect(() => {
    VIDEO_DATA.forEach(video => {
      if (!likingAnimations.current[video.id]) {
        likingAnimations.current[video.id] = new Animated.Value(0);
      }
    });
  }, []);
  
  const handleDoubleTap = (videoId: string) => {
    // Add to liked videos if not already there
    if (!likedVideos.includes(videoId)) {
      setLikedVideos([...likedVideos, videoId]);
      
      // Animate heart
      likingAnimations.current[videoId].setValue(0);
      Animated.sequence([
        Animated.timing(likingAnimations.current[videoId], {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(likingAnimations.current[videoId], {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        })
      ]).start();
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const renderHeader = () => (
    <>
      {/* Animated header for scroll effect */}
      <Animated.View 
        style={[
          styles.animatedHeader, 
          { opacity: headerOpacity }
        ]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={backIcon} style={styles.headerIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{PROFILE_DATA.username}</Text>
          <TouchableOpacity>
            <Image source={menuIcon} style={styles.headerIcon} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Regular header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={backIcon} style={styles.headerIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{PROFILE_DATA.username}</Text>
        <View style={styles.headerRightContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Image source={notificationIcon} style={styles.headerIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Image source={menuIcon} style={styles.headerIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  const renderProfileInfo = () => (
    <View style={styles.profileInfoContainer}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: PROFILE_DATA.avatar }} style={styles.avatar} />
          {PROFILE_DATA.isLive && (
            <View style={styles.liveIndicator}>
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{formatNumber(VIDEO_DATA.length)}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{formatNumber(PROFILE_DATA.followers)}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{formatNumber(PROFILE_DATA.following)}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>

      <View style={styles.bioContainer}>
        <View style={styles.usernameContainer}>
          <Text style={styles.displayName}>{PROFILE_DATA.displayName}</Text>
          {PROFILE_DATA.isVerified && (
            <Image source={verifiedIcon} style={styles.verifiedIcon} />
          )}
        </View>
        <Text style={styles.username}>@{PROFILE_DATA.username}</Text>
        <Text style={styles.bioText}>{PROFILE_DATA.bio}</Text>
        
        <TouchableOpacity style={styles.websiteContainer}>
          <Image source={linkIcon} style={styles.linkIcon} />
          <Text style={styles.websiteText}>{PROFILE_DATA.website}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            styles.primaryActionButton,
            isFollowing && styles.followingButton
          ]}
          onPress={handleFollow}
        >
          <Text style={isFollowing ? styles.followingButtonText : styles.actionButtonText}>
            {isFollowing ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.primaryActionButton, styles.messageButton]}
        >
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.secondaryActionButton]}>
          <Image source={followIcon} style={styles.followIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.highlightsScrollView}
        contentContainerStyle={styles.highlightsContainer}
      >
        {HIGHLIGHTS.map(highlight => (
          <TouchableOpacity key={highlight.id} style={styles.highlightItem}>
            <View style={styles.highlightImageContainer}>
              {highlight.isAdd ? (
                <View style={styles.addHighlightButton}>
                  <Text style={styles.addHighlightIcon}>+</Text>
                </View>
              ) : (
                <Image 
                  source={{ uri: highlight.thumbnail }} 
                  style={styles.highlightImage}
                  resizeMode="cover"
                />
              )}
            </View>
            <Text style={styles.highlightTitle} numberOfLines={1}>{highlight.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'grid' && styles.activeTab]} 
        onPress={() => setActiveTab('grid')}
      >
        <Image 
          source={gridIcon} 
          style={[styles.tabIcon, activeTab === 'grid' && styles.activeTabIcon]} 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'reels' && styles.activeTab]} 
        onPress={() => setActiveTab('reels')}
      >
        <Image 
          source={playIcon} 
          style={[styles.tabIcon, activeTab === 'reels' && styles.activeTabIcon]} 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'tagged' && styles.activeTab]} 
        onPress={() => setActiveTab('tagged')}
      >
        <Image 
          source={tagIcon} 
          style={[styles.tabIcon, activeTab === 'tagged' && styles.activeTabIcon]} 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'liked' && styles.activeTab]} 
        onPress={() => setActiveTab('liked')}
      >
        <Image 
          source={heartIcon} 
          style={[styles.tabIcon, activeTab === 'liked' && styles.activeTabIcon]} 
        />
      </TouchableOpacity>
    </View>
  );

  const renderVideoGrid = () => (
    <View style={styles.videoGrid}>
      {VIDEO_DATA.map(video => {
        const scale = likingAnimations.current[video.id]?.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 1.3, 1],
        }) || new Animated.Value(0);
        
        return (
          <TouchableOpacity 
            key={video.id} 
            style={styles.videoItem}
            onPress={() => {}}
            delayLongPress={200}
            onLongPress={() => handleDoubleTap(video.id)}
          >
            <Image source={{ uri: video.thumbnail }} style={styles.videoThumbnail} resizeMode="cover" />
            <View style={styles.videoOverlay}>
              <View style={styles.videoInfoContainer}>
                <View style={styles.videoStats}>
                  <Image source={heartIcon} style={styles.videoStatIcon} />
                  <Text style={styles.videoViews}>
                    {formatNumber(likedVideos.includes(video.id) ? video.likes + 1 : video.likes)}
                  </Text>
                </View>
                <View style={styles.videoDurationContainer}>
                  <Text style={styles.videoDuration}>{video.duration}</Text>
                </View>
              </View>
            </View>
            {video.type === 'video' && (
              <View style={styles.videoPlayButton}>
                <Image source={playIcon} style={styles.playIcon} />
              </View>
            )}
            
            <Animated.View 
              style={[
                styles.likeAnimation, 
                { opacity: likingAnimations.current[video.id], transform: [{ scale }] }
              ]}
            >
              <Image source={heartIcon} style={styles.likeAnimationIcon} />
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderInteractiveFeatures = () => (
    <View style={styles.interactiveContainer}>
      <Text style={styles.interactiveHeader}>Try these interactive features</Text>
      <FlatList
        data={INTERACTIVE_FEATURES}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.interactiveList}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.interactiveItem}>
            <View style={styles.interactiveIconContainer}>
              <Image source={item.icon} style={styles.interactiveIcon} />
            </View>
            <Text style={styles.interactiveTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );

  const renderTabContent = () => {
    if (activeTab === 'grid' || activeTab === 'reels') {
      return renderVideoGrid();
    } else if (activeTab === 'liked' || activeTab === 'tagged') {
      return (
        <View style={styles.likedContent}>
          <Image 
            source={activeTab === 'liked' ? heartIcon : tagIcon} 
            style={styles.emptyStateIcon} 
          />
          <Text style={styles.emptyStateText}>
            {activeTab === 'liked' 
              ? 'Videos this user liked will appear here'
              : 'Photos and videos this user is tagged in will appear here'}
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {renderProfileInfo()}
        {renderInteractiveFeatures()}
        {renderTabs()}
        {renderTabContent()}
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#fff',
    zIndex: 999,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: '100%',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerIcon: {
    width: 24,
    height: 24,
    tintColor: '#333',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 15,
  },
  profileInfoContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 3,
    borderColor: colors.primary,
    backgroundColor: '#f0f0f0',
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 20,
  },
  bioContainer: {
    marginBottom: 14,
  },
  displayName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 4,
  },
  username: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  messageButton: {
    backgroundColor: '#f0f0f0',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  messageButtonText: {  
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  highlightsScrollView: {
    marginTop: 10,
    marginBottom: 10,
  },
  highlightsContainer: {
    paddingBottom: 6,
    paddingRight: 20,
  },
  highlightItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  highlightImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  highlightImage: {
    width: '100%',
    height: '100%',
  },
  highlightTitle: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  addHighlightButton: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addHighlightIcon: {
    fontSize: 28,
    color: '#999',
  },
  bioText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  websiteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  linkIcon: {
    width: 16,
    height: 16,
    tintColor: '#888',
    marginRight: 6,
  },
  websiteText: {
    fontSize: 14,
    color: colors.primary,
  },
  interactiveContainer: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  interactiveHeader: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginLeft: 16,
    marginBottom: 12,
  },
  interactiveList: {
    paddingHorizontal: 16,
  },
  interactiveItem: {
    alignItems: 'center',
    marginRight: 24,
  },
  interactiveIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  interactiveIcon: {
    width: 22,
    height: 22,
    tintColor: '#333',
  },
  interactiveTitle: {
    fontSize: 12,
    color: '#333',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    elevation: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabIcon: {
    width: 22,
    height: 22,
    tintColor: '#888',
  },
  activeTabIcon: {
    tintColor: colors.primary,
  },
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  videoItem: {
    width: width / 3,
    height: width / 3,
    position: 'relative',
    borderWidth: 0.5,
    borderColor: '#fff',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    justifyContent: 'flex-end',
    padding: 6,
  },
  videoPlayButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 30,
    height: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -15 }, { translateY: -15 }],
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  playIcon: {
    width: 14,
    height: 14,
    tintColor: '#fff',
    marginLeft: 2,
  },
  videoInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoStatIcon: {
    width: 12,
    height: 12,
    tintColor: '#fff',
    marginRight: 3,
  },
  videoViews: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  videoDurationContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  videoDuration: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  likedContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
    width: 40,
    height: 40,
    tintColor: '#ccc',
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  liveIndicator: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#FF9500',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
    transform: [{ translateY: -5 }],
  },
  liveText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  verifiedIcon: {
    width: 16,
    height: 16,
    tintColor: colors.primary,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    width: '100%',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryActionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    marginRight: 8,
    borderRadius: 20,
    paddingVertical: 10,
  },
  followingButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  secondaryActionButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  followingButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  followIcon: {
    width: 20,
    height: 20,
    tintColor: '#333',
  },
  likeAnimation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  likeAnimationIcon: {
    width: 50,
    height: 50,
    tintColor: '#fff',
  },
});

export default ProfileScreen; 