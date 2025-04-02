import React, { useRef, useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity,
  Image,
  Animated,
  Pressable,
  TouchableWithoutFeedback
} from 'react-native';
import Video from 'react-native-video';
import { colors, typography, spacing } from '../utils/theme';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// Local icons
const heartIcon = require('../assets/icons/heart.png');
const chatIcon = require('../assets/icons/chat.png'); 
const sendIcon = require('../assets/icons/send.png');
const moreIcon = require('../assets/icons/more.png');

// Other icons still using web URLs
const playIcon = { uri: 'https://img.icons8.com/ios/50/ffffff/play--v1.png' };
const musicIcon = { uri: 'https://img.icons8.com/ios/50/ffffff/musical-notes.png' };

export interface ReelItemProps {
  item: {
    id: string;
    videoUri: any;
    user: {
      id: string;
      username: string;
      profilePic: string;
      isVerified: boolean;
    };
    description: string;
    likes: number;
    comments: number;
    shares: number;
    music: string;
  };
  isActive: boolean;
  onError?: (id: string) => void;
}

const ReelItem: React.FC<ReelItemProps> = ({ item, isActive, onError }) => {
  const navigation = useNavigation();
  
  // Use any type for video ref since TypeScript definitions might be missing
  const videoRef = useRef<any>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [liked, setLiked] = useState(false);
  const [lastTap, setLastTap] = useState<number | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Animation for like button press
  const likeScale = useRef(new Animated.Value(1)).current;
  
  // Animation for double tap heart
  const heartSize = useRef(new Animated.Value(0)).current;
  const heartOpacity = useRef(new Animated.Value(0)).current;
  
  // Reset video state and handle errors when active item changes
  useEffect(() => {
    // When this item becomes active
    if (isActive) {
      // Reset error state
      setVideoError(false);
      
      // If there was an error and we haven't exceeded retry limit
      if (videoError && retryCount < 3) {
        // Wait a bit and try again
        setTimeout(() => {
          setIsPaused(false);
          setRetryCount(prev => prev + 1);
        }, 1000);
      } else if (isActive) {
        // Add a small delay before playing to ensure proper initialization
        setIsPaused(true);
        setTimeout(() => {
          setIsPaused(false);
        }, 300);
      }
    } else {
      // Reset retry count when item becomes inactive
      setRetryCount(0);
      setVideoError(false);
    }
  }, [isActive, videoError, retryCount]);
  
  // Cleanup effect for video
  useEffect(() => {
    return () => {
      // Reset all states on unmount
      if (videoRef.current) {
        videoRef.current.seek(0);
      }
    };
  }, []);

  // Handle unmounting and remounting video component
  useEffect(() => {
    if (!isActive) {
      // Cleanup when not active
      setVideoError(false);
      setRetryCount(0);
      setIsPaused(true);
    }
  }, [isActive]);
  
  const handleVideoPress = useCallback(() => {
    // Handle double tap to like
    const now = Date.now();
    if (lastTap && now - lastTap < 300) { // Double tap detected (300ms threshold)
      handleDoubleTap();
      setLastTap(null);
    } else {
      // Single tap - toggle play/pause
      setIsPaused(!isPaused);
      setLastTap(now);
    }
  }, [isPaused, lastTap]);
  
  const handleDoubleTap = () => {
    if (!liked) {
      setLiked(true);
      
      // Animate the heart in the center
      heartSize.setValue(0);
      heartOpacity.setValue(1);
      
      Animated.sequence([
        Animated.parallel([
          Animated.timing(heartSize, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(heartOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(heartOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          delay: 500,
        }),
      ]).start();
      
      // Also animate the like button
      Animated.sequence([
        Animated.timing(likeScale, {
          toValue: 1.5,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(likeScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };
  
  const handleLikePress = () => {
    setLiked(!liked);
    
    Animated.sequence([
      Animated.timing(likeScale, {
        toValue: 1.5,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(likeScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  const handleCommentPress = () => {
    // Log that we're trying to open comments
    console.log('Opening comments for item', item.id);
    
    // If video is playing, pause it when comments are shown
    if (!isPaused) {
      setIsPaused(true);
    }
    
    // Navigate to CommentsScreen
    // @ts-ignore
    navigation.navigate('CommentsScreen', {
      commentCount: item.comments,
      postOwnerUsername: item.user.username,
      postOwnerAvatar: item.user.profilePic,
      isPostOwnerVerified: item.user.isVerified,
      postCaption: item.description
    });
  };
  
  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback style={styles.videoContainer} onPress={handleVideoPress}>
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: item.videoUri }}
            style={styles.video}
            resizeMode="cover"
            repeat={true}
            paused={!isActive || isPaused}
            muted={true}
            ignoreSilentSwitch="ignore"
            bufferConfig={{
              minBufferMs: 1000,
              maxBufferMs: 5000,
              bufferForPlaybackMs: 500,
              bufferForPlaybackAfterRebufferMs: 1000
            }}
            reportBandwidth={true}
            minLoadRetryCount={5}
            maxBitRate={2000000}
            onError={(error) => {
              console.log('Video error:', item.id);
              setVideoError(true);
              // Call parent error handler if provided
              if (onError) {
                onError(item.id);
              }
            }}
            onLoad={() => {
              console.log('Video loaded:', item.id);
              setVideoError(false);
              if (isActive) {
                setIsPaused(false);
              }
            }}
            onBuffer={(data) => {
              // Handle buffering state
              console.log(`Buffer status for ${item.id}:`, data.isBuffering);
            }}
          />
          
          {videoError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Video Unavailable</Text>
              <TouchableOpacity 
                style={styles.retryButton} 
                onPress={() => {
                  setVideoError(false);
                  setRetryCount(prev => prev + 1);
                  if (videoRef.current) {
                    videoRef.current.seek(0);
                  }
                }}
              >
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {isPaused && !videoError && (
            <View style={styles.pauseIconContainer}>
              <Image source={playIcon} style={styles.playIcon} />
            </View>
          )}
          
          {/* Double tap heart animation */}
          <Animated.View 
            style={[
              styles.heartAnimationContainer,
              {
                opacity: heartOpacity,
                transform: [
                  { scale: heartSize },
                ],
              },
            ]}
            pointerEvents="none"
          >
            <Image 
              source={heartIcon} 
              style={[styles.heartAnimation, {tintColor: '#ff2d55'}]} 
            />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
      
      {/* User info overlay */}
      <View style={styles.overlay}>
        <View style={styles.bottomSection}>
          <View style={styles.bottomLeftSection}>
            <View style={styles.userInfoContainer}>
              <Image 
                source={{ uri: item.user.profilePic }} 
                style={styles.profilePic}
              />
              <Text style={styles.username}>
                {item.user.username}
                {item.user.isVerified && (
                  <Text style={styles.verifiedBadge}> ✓</Text>
                )}
              </Text>
            </View>
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
            <View style={styles.musicContainer}>
              <Image source={musicIcon} style={styles.musicIconImage} />
              <Text style={styles.musicText} numberOfLines={1}>
                {item.music}
              </Text>
            </View>
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleLikePress}
            >
              <Animated.View style={{ transform: [{ scale: likeScale }] }}>
                <Image 
                  source={heartIcon} 
                  style={[styles.actionIconImage, liked && { tintColor: '#ff2d55' }]} 
                />
              </Animated.View>
              <Text style={styles.actionCount}>{formatCount(item.likes)}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleCommentPress}
              activeOpacity={0.7}
              testID="commentButton"
            >
              <Image source={chatIcon} style={styles.actionIconImage} />
              <Text style={styles.actionCount}>{formatCount(item.comments)}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Image source={sendIcon} style={styles.actionIconImage} />
              <Text style={styles.actionCount}>{formatCount(item.shares)}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.menuIconContainer}>
                <Image source={moreIcon} style={styles.menuIconImage} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height: height,
    backgroundColor: '#000',
    position: 'relative',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#000',
  },
  pauseIconContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    padding: 20,
  },
  playIcon: {
    width: 32,
    height: 32,
    tintColor: 'white',
  },
  heartAnimationContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  heartAnimation: {
    width: 100,
    height: 100,
    tintColor: 'white',
  },
  svgIcon: {
    color: 'white',
  },
  pauseIcon: {
    color: 'white',
    fontSize: 32,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: spacing.medium,
    paddingBottom: 52,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 0,
  },
  bottomLeftSection: {
    flex: 1,
    marginRight: spacing.medium,
    marginBottom: 0,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.small,
    borderWidth: 2,
    borderColor: 'white',
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: typography.fontSize.medium,
  },
  verifiedBadge: {
    color: colors.primary,
    fontSize: typography.fontSize.medium,
  },
  description: {
    color: 'white',
    marginBottom: 7,
    fontSize: typography.fontSize.regular,
  },
  musicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  musicIconImage: {
    width: 16,
    height: 16,
    tintColor: 'white',
    marginRight: spacing.tiny,
  },
  musicIcon: {
    color: 'white',
    marginRight: spacing.tiny,
    fontSize: typography.fontSize.regular,
  },
  musicText: {
    color: 'white',
    fontSize: typography.fontSize.small,
    flex: 1,
  },
  actionsContainer: {
    alignItems: 'center',
    width: 65,
    marginBottom: 10,
    marginRight: -5,
    marginTop: -5,
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 14,
  },
  actionIconImage: {
    width: 30,
    height: 30,
    marginBottom: 5,
    tintColor: 'white',
  },
  actionIcon: {
    color: 'white',
    fontSize: 30,
    marginBottom: spacing.tiny,
  },
  likedIcon: {
    color: '#ff2d55',
  },
  actionCount: {
    color: 'white',
    fontSize: typography.fontSize.small,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconImage: {
    width: 30,
    height: 30,
    tintColor: 'white',
  },
  profilePicSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'white',
  },
  plusIcon: {
    position: 'absolute',
    bottom: -5,
    right: -2,
    backgroundColor: colors.primary,
    color: 'black',
    borderRadius: 10,
    width: 20,
    height: 20,
    textAlign: 'center',
    lineHeight: 18,
    fontSize: 14,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  errorText: {
    color: 'white',
    fontSize: typography.fontSize.small,
    marginTop: 10,
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  retryButton: {
    backgroundColor: colors.primary,
    padding: spacing.medium,
    borderRadius: 10,
  },
  retryText: {
    color: 'white',
    fontSize: typography.fontSize.medium,
    fontWeight: 'bold',
  },
});

export default ReelItem; 