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
  TouchableWithoutFeedback,
  Platform,
  ActivityIndicator,
  FlatList,
  ScrollView
} from 'react-native';
import Video from 'react-native-video';
import { colors, typography, spacing } from '../utils/theme';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
    type: 'video' | 'image' | 'carousel';
    videoUri?: string;
    imageUri?: string;
    carouselImages?: string[];
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
  onError?: (error: any) => void;
}

const ReelItem: React.FC<ReelItemProps> = ({ item, isActive, onError }) => {
  const navigation = useNavigation();
  
  // Use any type for video ref since TypeScript definitions might be missing
  const videoRef = useRef<any>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [liked, setLiked] = useState(false);
  const [lastTap, setLastTap] = useState<number | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  
  // Animation values for carousel
  const scrollX = useRef(new Animated.Value(0)).current;
  
  // Animation for like button press
  const likeScale = useRef(new Animated.Value(1)).current;
  
  // Animation for double tap heart
  const heartSize = useRef(new Animated.Value(0)).current;
  const heartOpacity = useRef(new Animated.Value(0)).current;
  
  // Reset video state and handle errors when active item changes
  useEffect(() => {
    if (isActive) {
      setIsPaused(false);
    } else {
      setIsPaused(true);
    }
  }, [isActive]);
  
  // Cleanup effect for video
  useEffect(() => {
    return () => {
      // Reset all states on unmount
      if (videoRef.current) {
        videoRef.current.seek(0);
      }
      setVideoLoaded(false);
      setVideoError(false);
      setIsLoading(true);
      setCurrentCarouselIndex(0);
      // Force pause when unmounting
      setIsPaused(true);
    };
  }, []);

  // Handle app state changes to pause video when app goes to background
  useEffect(() => {
    // Import AppState at the top of the file
    import('react-native').then(({ AppState }) => {
      const handleAppStateChange = (nextAppState: string) => {
        if (nextAppState.match(/inactive|background/)) {
          // App is going to background or inactive, pause video
          setIsPaused(true);
        }
      };

      const subscription = AppState.addEventListener('change', handleAppStateChange);
      
      return () => {
        subscription.remove();
      };
    }).catch(err => console.error('Failed to import AppState:', err));
  }, []);

  // Handle focus/blur events from navigation to ensure videos pause when navigating away
  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      // Only play if this reel is the active one
      if (isActive) {
        setIsPaused(false);
      }
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      // Always pause when navigating away
      setIsPaused(true);
      if (videoRef.current) {
        // Ensure the video is fully paused by calling pause() directly
        videoRef.current.seek(0);
      }
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation, isActive]);
  
  // Handle unmounting and remounting video component
  useEffect(() => {
    if (!isActive) {
      // Cleanup when not active
      setVideoError(false);
      setRetryCount(0);
      setIsPaused(true);
      
      // Ensure video is fully stopped when not visible
      if (videoRef.current && item.type === 'video') {
        try {
          videoRef.current.seek(0);
        } catch (e) {
          console.warn('Error seeking video:', e);
        }
      }
    }
  }, [isActive, item?.type]);
  
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

  const renderCarouselContent = () => {
    const flatListRef = useRef<FlatList>(null);
    
    // Update carousel index and scroll to the new position
    const scrollToImage = (index: number) => {
      if (flatListRef.current && item.carouselImages && index >= 0 && index < item.carouselImages.length) {
        flatListRef.current.scrollToIndex({ index, animated: true });
        setCurrentCarouselIndex(index);
      }
    };
    
    return (
      <View style={styles.carouselContainer}>
        <Animated.FlatList
          ref={flatListRef}
          data={item.carouselImages}
          renderItem={({ item: imageUri, index }) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width
            ];
            
            // Scale animation
            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.95, 1, 0.95],
              extrapolate: 'clamp'
            });
            
            // Opacity animation
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.6, 1, 0.6],
              extrapolate: 'clamp'
            });
            
            return (
              <View style={styles.carouselItem}>
                <Animated.View
                  style={[
                    styles.carouselImageContainer,
                    { 
                      transform: [{ scale }],
                      opacity 
                    }
                  ]}
                >
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.carouselImage}
                    resizeMode="cover"
                    onLoad={() => {
                      setIsLoading(false);
                      setVideoLoaded(true);
                    }}
                    onError={(error) => {
                      console.error('Image error:', error);
                      setVideoError(true);
                      onError?.(error);
                    }}
                  />
                </Animated.View>
              </View>
            );
          }}
          keyExtractor={(_, index) => `carousel-${item.id}-${index}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(
              event.nativeEvent.contentOffset.x / width
            );
            setCurrentCarouselIndex(newIndex);
          }}
          decelerationRate={Platform.OS === 'ios' ? 0.2 : 0.9}
          snapToInterval={width}
          snapToAlignment="center"
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          initialScrollIndex={0}
          scrollEventThrottle={16}
          bounces={false}
        />
        
        {/* Custom indicators */}
        <View style={styles.carouselIndicators}>
          {item.carouselImages?.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width
            ];
            
            // Opacity animation for indicators
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.5, 1, 0.5],
              extrapolate: 'clamp'
            });
            
            // Scale animation for indicators (instead of width)
            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [1, 1.5, 1],
              extrapolate: 'clamp'
            });
            
            return (
              <Animated.View
                key={`indicator-${index}`}
                style={[
                  styles.carouselIndicator,
                  { 
                    opacity,
                    transform: [{ scale }]
                  }
                ]}
              />
            );
          })}
        </View>
        
        {/* Image counter */}
        <View style={styles.imageCounter}>
          <Text style={styles.imageCounterText}>
            {currentCarouselIndex + 1}/{item.carouselImages?.length}
          </Text>
        </View>
        
        {/* Add left/right navigation arrows for carousel */}
        {currentCarouselIndex > 0 && (
          <TouchableOpacity 
            style={[styles.carouselNavButton, styles.carouselNavLeft]}
            onPress={() => scrollToImage(currentCarouselIndex - 1)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="chevron-left" size={36} color="white" />
          </TouchableOpacity>
        )}
        
        {item.carouselImages && currentCarouselIndex < item.carouselImages.length - 1 && (
          <TouchableOpacity 
            style={[styles.carouselNavButton, styles.carouselNavRight]}
            onPress={() => scrollToImage(currentCarouselIndex + 1)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="chevron-right" size={36} color="white" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderContent = () => {
    if (item.type === 'carousel') {
      return renderCarouselContent();
    }
    
    if (item.type === 'image') {
      return (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.imageUri }}
            style={styles.media}
            resizeMode="cover"
            onLoad={() => {
              setIsLoading(false);
              setVideoLoaded(true);
            }}
            onError={(error) => {
              console.error('Image error:', error);
              setVideoError(true);
              onError?.(error);
            }}
          />
        </View>
      );
    }

    return (
      <Video
        ref={videoRef}
        source={{ uri: item.videoUri }}
        style={styles.media}
        resizeMode="cover"
        repeat
        paused={isPaused}
        muted={false}
        volume={1.0}
        onLoad={() => {
          console.log('Video loaded successfully');
          setVideoLoaded(true);
          setIsLoading(false);
        }}
        onError={(error) => {
          console.error('Video error:', error);
          setVideoError(true);
          onError?.(error);
        }}
        onBuffer={(data) => {
          console.log('Buffering:', data.isBuffering);
        }}
        bufferConfig={{
          minBufferMs: 15000,
          maxBufferMs: 50000,
          bufferForPlaybackMs: 2500,
          bufferForPlaybackAfterRebufferMs: 5000
        }}
        maxBitRate={2000000}
      />
    );
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback style={styles.videoContainer} onPress={handleVideoPress}>
        <View style={styles.videoContainer}>
          {renderContent()}
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="white" />
            </View>
          )}
          
          {videoError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Unable to load {item.type}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => {
                  setVideoError(false);
                  setIsLoading(true);
                }}
              >
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {isPaused && !videoError && item.type === 'video' && (
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
              <MaterialIcons name="music-note" size={16} color="white" style={styles.musicIcon} />
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
    height,
    backgroundColor: '#000',
    position: 'relative',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  media: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  imageContainer: {
    width: '100%',
    height: width * 1.5, // Instagram-like aspect ratio
    backgroundColor: '#000',
    alignSelf: 'center',
    marginTop: (height - width * 1.5) / 2, // Center vertically
  },
  carouselContainer: {
    width,
    height,
    backgroundColor: '#000',
    alignSelf: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  carouselItem: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  carouselImageContainer: {
    width: width,
    height: height,
    overflow: 'hidden',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: width,
    height: height,
    backgroundColor: '#000',
  },
  imageCounter: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  imageCounterText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  carouselIndicators: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  carouselIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 4,
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
  musicIcon: {
    marginRight: spacing.tiny,
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
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  carouselNavButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -25 }],
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  carouselNavLeft: {
    left: 10,
  },
  carouselNavRight: {
    right: 10,
  },
});

export default ReelItem; 