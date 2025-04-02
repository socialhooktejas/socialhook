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
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utils/theme';
import LinearGradient from 'react-native-linear-gradient';

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
const earningsIcon = require('../assets/icons/coin.png');

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

  // Handle navigation to earnings hub
  const handleEarningsPress = () => {
    navigation.navigate('EarningsHubScreen');
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
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={backIcon} style={styles.headerIcon} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{PROFILE_DATA.username}</Text>
          </View>
          <TouchableOpacity>
            <Image source={menuIcon} style={styles.headerIcon} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Regular header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={backIcon} style={styles.headerIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{PROFILE_DATA.username}</Text>
        </View>
        <View style={styles.headerRightContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Image source={menuIcon} style={styles.headerIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  const renderProfileInfo = () => (
    <View style={styles.profileInfoContainer}>
      <View style={styles.profileRow}>
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
        <View style={styles.nameVerifiedContainer}>
          <Text style={styles.displayName}>{PROFILE_DATA.displayName}</Text>
          {PROFILE_DATA.isVerified && (
            <Image source={verifiedIcon} style={styles.verifiedIcon} />
          )}
        </View>
        
        <Text style={styles.username}>@{PROFILE_DATA.username}</Text>
        
        <View style={styles.bioInfoRow}>
          <Text style={styles.bioText} numberOfLines={1}>{PROFILE_DATA.bio}</Text>
          
          <View style={styles.websiteLink}>
            <Image source={linkIcon} style={styles.linkIcon} />
            <Text style={styles.websiteText} numberOfLines={1}>{PROFILE_DATA.website}</Text>
          </View>
        </View>
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
      
      {/* Creator Earnings Button */}
      <TouchableOpacity 
        style={styles.earningsButtonContainer}
        onPress={handleEarningsPress}
      >
        <LinearGradient
          colors={['#4A00E0', '#8E2DE2']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.earningsButton}
        >
          <Image source={earningsIcon} style={styles.earningsIcon} />
          <Text style={styles.earningsButtonText}>Creator Earnings</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.highlightsWrapper}>
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
      <StatusBar barStyle="dark-content" backgroundColor="white" translucent={true} />
      <View style={styles.statusBarSpacer} />
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
  statusBarSpacer: {
    height: StatusBar.currentHeight || 0,
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
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    height: 42,
  },
  animatedHeader: {
    position: 'absolute',
    top: StatusBar.currentHeight || 0,
    left: 0,
    right: 0,
    height: 42,
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
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
    paddingTop: 12,
    paddingBottom: 0,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
    marginBottom: 10,
  },
  nameVerifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  displayName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginRight: 4,
  },
  verifiedIcon: {
    width: 16,
    height: 16,
    tintColor: colors.primary,
  },
  username: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bioInfoRow: {
    flexDirection: 'column',
    marginBottom: 4,
  },
  bioText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  websiteLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkIcon: {
    width: 14,
    height: 14,
    tintColor: colors.primary,
    marginRight: 4,
  },
  websiteText: {
    fontSize: 14,
    color: colors.primary,
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
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
    borderRadius: 18,
    paddingVertical: 8,
  },
  messageButton: {
    backgroundColor: '#f0f0f0',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  messageButtonText: {  
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  highlightsWrapper: {
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },
  highlightsScrollView: {
    marginBottom: 4,
  },
  highlightsContainer: {
    paddingBottom: 2,
    paddingRight: 10,
  },
  highlightItem: {
    alignItems: 'center',
    marginRight: 14,
    width: 66,
  },
  highlightImageContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    overflow: 'hidden',
  },
  highlightImage: {
    width: '100%',
    height: '100%',
  },
  highlightTitle: {
    fontSize: 11,
    color: '#555',
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
  followingButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  followingButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryActionButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
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
  followIcon: {
    width: 20,
    height: 20,
    tintColor: '#333',
  },
  earningsButtonContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  earningsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#4A00E0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  earningsIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
    tintColor: 'white',
  },
  earningsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ProfileScreen; 