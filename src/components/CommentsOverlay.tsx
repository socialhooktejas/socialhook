import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  TextInput,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, typography, spacing } from '../utils/theme';

const { width, height } = Dimensions.get('window');
const ANIMATION_DURATION = 250;

// Mock data for comments
const MOCK_COMMENTS = [
  {
    id: '1',
    username: 'gmapsfun',
    isCreator: true,
    avatar: 'https://randomuser.me/api/portraits/women/81.jpg',
    comment: 'Location: Wharariki Beach, New Zealand',
    likes: 52200,
    time: '1w',
    isPinned: true,
    verified: true,
  },
  {
    id: '2',
    username: 'Marius Aguinas',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    comment: 'I thought that was gta V',
    likes: 52200,
    time: '1w',
    likedByCreator: true,
  },
  {
    id: '3',
    username: 'Sky Wee',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    comment: 'wow',
    likes: 52200,
    time: '1w',
    likedByCreator: true,
    verified: true,
  },
  {
    id: '4',
    username: 'Liam yess',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    comment: "That's not it I've seen the same thing but also in a cave",
    likes: 52200,
    time: '1w',
  },
  {
    id: '5',
    username: 'johnsmith',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    comment: 'Absolutely stunning view! 😍',
    likes: 1023,
    time: '2d',
  },
  {
    id: '6',
    username: 'travel_addict',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    comment: 'Adding this to my bucket list right now! ✈️',
    likes: 876,
    time: '3d',
    verified: true,
  },
  {
    id: '7',
    username: 'photography_pro',
    avatar: 'https://randomuser.me/api/portraits/men/43.jpg',
    comment: 'What camera settings did you use for this shot? The colors are amazing!',
    likes: 654,
    time: '5d',
  },
  {
    id: '8',
    username: 'nature_lover',
    avatar: 'https://randomuser.me/api/portraits/women/51.jpg',
    comment: 'Mother nature at her finest 🌊🏝️',
    likes: 432,
    time: '1w',
  },
  {
    id: '9',
    username: 'hikingadventures',
    avatar: 'https://randomuser.me/api/portraits/men/35.jpg',
    comment: 'Is it a difficult hike to reach this spot?',
    likes: 321,
    time: '1w',
  },
  {
    id: '10',
    username: 'sunset_chaser',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    comment: 'The lighting is perfect! Golden hour?',
    likes: 210,
    time: '2w',
  },
];

interface CommentsOverlayProps {
  visible: boolean;
  onClose: () => void;
  commentCount: number;
  postOwnerUsername: string;
  postOwnerAvatar: string;
  isPostOwnerVerified: boolean;
}

const CommentsOverlay: React.FC<CommentsOverlayProps> = ({
  visible,
  onClose,
  commentCount,
  postOwnerUsername,
  postOwnerAvatar,
  isPostOwnerVerified
}) => {
  const [comment, setComment] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [likedComments, setLikedComments] = useState<string[]>([]);
  
  const slideAnim = useRef(new Animated.Value(height)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);
  
  // Reset animations when component mounts
  useEffect(() => {
    if (!visible) {
      slideAnim.setValue(height);
      opacityAnim.setValue(0);
    }
  }, []);
  
  // Handle keyboard events
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      e => {
        setKeyboardHeight(e.endCoordinates.height);
        // Auto-expand to full screen when keyboard opens
        if (!isFullScreen) {
          expandToFullScreen();
        }
      }
    );
    
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );
    
    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, [isFullScreen]);
  
  // Handle visibility changes
  useEffect(() => {
    console.log("Visibility changed:", visible);
    if (visible) {
      showOverlay();
    } else {
      hideOverlay();
    }
  }, [visible]);
  
  const showOverlay = () => {
    console.log("Showing overlay");
    // Reset state
    setIsFullScreen(false);
    
    // Start animations immediately
    slideAnim.setValue(height);
    opacityAnim.setValue(0);
    
    // Start animations
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: height / 2,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      })
    ]).start(() => {
      console.log("Show animation completed");
    });
  };
  
  const hideOverlay = () => {
    console.log("Hiding overlay");
    Keyboard.dismiss();
    
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: height,
        duration: ANIMATION_DURATION * 0.5,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: ANIMATION_DURATION * 0.5,
        useNativeDriver: true,
      })
    ]).start(() => {
      console.log("Hide animation completed");
      setIsFullScreen(false);
    });
  };
  
  const expandToFullScreen = () => {
    setIsFullScreen(true);
    
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
  };
  
  const shrinkToHalfScreen = () => {
    if (isFullScreen) {
      Keyboard.dismiss();
      setIsFullScreen(false);
      
      Animated.timing(slideAnim, {
        toValue: height / 2,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();
    }
  };
  
  const handleLikeComment = (commentId: string) => {
    setLikedComments(prev => {
      if (prev.includes(commentId)) {
        return prev.filter(id => id !== commentId);
      } else {
        return [...prev, commentId];
      }
    });
  };
  
  const handleSubmitComment = () => {
    if (comment.trim()) {
      // Here you would handle the comment submission to your backend
      console.log('Submitting comment:', comment);
      setComment('');
    }
  };
  
  const formatLikes = (likes: number) => {
    if (likes >= 1000) {
      return `${(likes / 1000).toFixed(1)}K`;
    }
    return likes.toString();
  };
  
  const renderComment = ({ item }: { item: typeof MOCK_COMMENTS[0] }) => (
    <View style={styles.commentContainer}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <View style={styles.usernameContainer}>
            <Text style={styles.username}>{item.username}</Text>
            {item.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )}
            {item.isCreator && (
              <View style={styles.creatorBadge}>
                <Text style={styles.creatorText}>Creator</Text>
              </View>
            )}
            {item.isPinned && (
              <Text style={styles.pinnedText}>• Pinned</Text>
            )}
          </View>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        
        <Text style={styles.commentText}>{item.comment}</Text>
        
        <View style={styles.commentActions}>
          <Text style={styles.replyText}>Reply</Text>
          <View style={styles.likeContainer}>
            <TouchableOpacity
              onPress={() => handleLikeComment(item.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[
                styles.heartIcon, 
                likedComments.includes(item.id) && styles.likedHeart
              ]}>
                {likedComments.includes(item.id) ? '❤️' : '♡'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.likesText}>{formatLikes(item.likes)}</Text>
          </View>
        </View>
        
        {item.likedByCreator && (
          <View style={styles.likedByCreatorContainer}>
            <Text style={styles.likedByCreatorText}>Liked by creator</Text>
          </View>
        )}
      </View>
    </View>
  );
  
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.handleContainer}>
        <View style={styles.handle} />
      </View>
      
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={shrinkToHalfScreen}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {isFullScreen ? (
            <Text style={styles.backIcon}>←</Text>
          ) : null}
        </TouchableOpacity>
        
        <Text style={styles.commentsTitle}>Comments</Text>
        
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
      </View>
      
      {isFullScreen && (
        <View style={styles.postInfoContainer}>
          <Image source={{ uri: postOwnerAvatar }} style={styles.postOwnerAvatar} />
          <View style={styles.postTextContainer}>
            <Text style={styles.postInfoText}>
              Commenting on 
              <Text style={styles.postOwnerUsername}> {postOwnerUsername}</Text>
              {isPostOwnerVerified && <Text style={styles.verifiedText}> ✓</Text>}'s post
            </Text>
          </View>
        </View>
      )}
    </View>
  );
  
  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalContainer} pointerEvents="box-none">
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View 
            style={[
              styles.overlay,
              { opacity: opacityAnim },
            ]}
            pointerEvents="auto"
          />
        </TouchableWithoutFeedback>
        
        <Animated.View
          style={[
            styles.commentsContainer,
            {
              transform: [{ translateY: slideAnim }],
              height: isFullScreen ? height : height / 2,
            }
          ]}
          pointerEvents="auto"
        >
          {renderHeader()}
          
          <FlatList
            data={MOCK_COMMENTS}
            renderItem={renderComment}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.commentsList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={
              <View style={styles.commentsCountContainer}>
                <Text style={styles.commentsCount}>{commentCount.toLocaleString()} comments</Text>
              </View>
            }
          />
          
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
            style={styles.inputContainer}
          >
            <Image 
              source={{ uri: 'https://randomuser.me/api/portraits/women/43.jpg' }} 
              style={styles.userAvatar} 
            />
            <View style={styles.inputWrapper}>
              <TextInput
                ref={inputRef}
                placeholder="Add comment..."
                placeholderTextColor="#999"
                style={styles.input}
                value={comment}
                onChangeText={setComment}
                multiline
                maxLength={2200}
              />
              <TouchableOpacity
                style={[styles.postButton, { opacity: comment.trim() ? 1 : 0.5 }]}
                onPress={handleSubmitComment}
                disabled={!comment.trim()}
              >
                <Text style={styles.postButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    zIndex: 9999,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  commentsContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    width: '100%',
    maxHeight: height,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    padding: 4,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 18,
    color: '#333',
  },
  backIcon: {
    fontSize: 20,
    color: '#333',
  },
  commentsCountContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  commentsCount: {
    fontSize: 14,
    color: '#666',
  },
  commentsList: {
    paddingBottom: 16,
  },
  commentContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  username: {
    fontWeight: 'bold',
    marginRight: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
  },
  commentText: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 6,
    color: '#333',
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyText: {
    fontSize: 12,
    color: '#999',
    marginRight: 16,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartIcon: {
    fontSize: 16,
    color: '#999',
    marginRight: 4,
  },
  likedHeart: {
    color: colors.error,
  },
  likesText: {
    fontSize: 12,
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  input: {
    flex: 1,
    fontSize: 14,
    padding: 0,
    maxHeight: 80,
    color: '#333',
  },
  postButton: {
    marginLeft: 8,
  },
  postButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  verifiedBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  verifiedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  creatorBadge: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
  },
  creatorText: {
    color: '#666',
    fontSize: 10,
    fontWeight: 'bold',
  },
  pinnedText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
  likedByCreatorContainer: {
    marginTop: 4,
  },
  likedByCreatorText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  postInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  postOwnerAvatar: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    marginRight: 8,
  },
  postTextContainer: {
    flex: 1,
  },
  postInfoText: {
    fontSize: 12,
    color: '#666',
  },
  postOwnerUsername: {
    fontWeight: 'bold',
    color: '#333',
  },
});

export default CommentsOverlay; 