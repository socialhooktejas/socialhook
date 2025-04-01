import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, typography, spacing } from '../utils/theme';

const { width, height } = Dimensions.get('window');
const ANIMATION_DURATION = 300;

// Icons
const backIcon = require('../assets/icons/back.png');
const heartIcon = require('../assets/icons/heart.png');
const sendIcon = require('../assets/icons/send.png');
const atIcon = require('../assets/icons/at.png');
const moreIcon = require('../assets/icons/more.png');

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
    replies: [
      {
        id: '1-1',
        username: 'travel_enthusiast',
        avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
        comment: 'This place is on my bucket list! When is the best time to visit?',
        likes: 987,
        time: '6d',
        verified: false,
      }
    ]
  },
  {
    id: '2',
    username: 'Marius Aguinas',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    comment: 'I thought that was gta V 😂',
    likes: 52200,
    time: '1w',
    likedByCreator: true,
  },
  {
    id: '3',
    username: 'Sky Wee',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    comment: 'wow 😮',
    likes: 52200,
    time: '1w',
    likedByCreator: true,
    verified: true,
    replies: [
      {
        id: '3-1',
        username: 'photoexpert',
        avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
        comment: 'The colors in this shot are just incredible',
        likes: 1254,
        time: '6d',
        verified: false,
      },
      {
        id: '3-2',
        username: 'gmapsfun',
        isCreator: true,
        avatar: 'https://randomuser.me/api/portraits/women/81.jpg',
        comment: 'Thank you so much! Took it during golden hour with my Sony A7III',
        likes: 827,
        time: '5d',
        verified: true,
      }
    ]
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

interface RouteParams {
  commentCount?: number;
  postOwnerUsername?: string;
  postOwnerAvatar?: string;
  isPostOwnerVerified?: boolean;
  postCaption?: string;
}

const CommentsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as RouteParams || {};
  
  const {
    commentCount = 143000,
    postOwnerUsername = 'gmapsfun',
    postOwnerAvatar = 'https://randomuser.me/api/portraits/women/81.jpg',
    isPostOwnerVerified = true,
    postCaption = "The most beautiful beach I've ever seen! 🏝 #travel #NewZealand #beach"
  } = params;
  
  const [comment, setComment] = useState('');
  const [likedComments, setLikedComments] = useState<string[]>([]);
  const [expandedReplies, setExpandedReplies] = useState<string[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  // Animation values
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Input ref for focusing
  const inputRef = useRef<TextInput>(null);
  
  useEffect(() => {
    // Start animation when component mounts
    StatusBar.setBarStyle('light-content');
    
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION * 0.8,
        useNativeDriver: true,
      }),
    ]).start();
    
    return () => {
      StatusBar.setBarStyle('default');
    };
  }, []);
  
  const handleClose = () => {
    Keyboard.dismiss();
    
    // Animate out
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: height,
        duration: ANIMATION_DURATION * 0.8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: ANIMATION_DURATION * 0.5,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.goBack();
    });
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
  
  const handleReply = (username: string, commentId: string) => {
    setReplyingTo(commentId);
    setComment(`@${username} `);
    inputRef.current?.focus();
  };
  
  const handleCancelReply = () => {
    setReplyingTo(null);
    setComment('');
    Keyboard.dismiss();
  };
  
  const handleSubmitComment = () => {
    if (comment.trim()) {
      // Here you would handle the comment submission to your backend
      console.log('Submitting comment:', comment, replyingTo ? `in reply to: ${replyingTo}` : '');
      setComment('');
      setReplyingTo(null);
      Keyboard.dismiss();
    }
  };
  
  const toggleReplies = (commentId: string) => {
    setExpandedReplies(prev => {
      if (prev.includes(commentId)) {
        return prev.filter(id => id !== commentId);
      } else {
        return [...prev, commentId];
      }
    });
  };
  
  const formatLikes = (likes: number) => {
    if (likes >= 1000000) {
      return `${(likes / 1000000).toFixed(1)}M`;
    } else if (likes >= 1000) {
      return `${(likes / 1000).toFixed(1)}K`;
    }
    return likes.toString();
  };
  
  const renderReplies = (replies: any[]) => {
    return replies.map((reply) => (
      <View style={styles.replyContainer} key={reply.id}>
        <Image source={{ uri: reply.avatar }} style={styles.replyAvatar} />
        
        <View style={styles.replyContent}>
          <View style={styles.commentHeader}>
            <View style={styles.usernameContainer}>
              <Text style={styles.username}>{reply.username}</Text>
              {reply.verified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓</Text>
                </View>
              )}
              {reply.isCreator && (
                <View style={styles.creatorBadge}>
                  <Text style={styles.creatorText}>Creator</Text>
                </View>
              )}
            </View>
            <Text style={styles.timeText}>{reply.time}</Text>
          </View>
          
          <Text style={styles.commentText}>{reply.comment}</Text>
          
          <View style={styles.commentActions}>
            <TouchableOpacity 
              onPress={() => handleReply(reply.username, reply.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.replyText}>Reply</Text>
            </TouchableOpacity>
            <View style={styles.likeContainer}>
              <TouchableOpacity
                onPress={() => handleLikeComment(reply.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Image 
                  source={heartIcon} 
                  style={[
                    styles.heartIcon, 
                    likedComments.includes(reply.id) && styles.likedHeart
                  ]} 
                />
              </TouchableOpacity>
              <Text style={styles.likesText}>{formatLikes(reply.likes)}</Text>
            </View>
          </View>
        </View>
      </View>
    ));
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
          <View style={styles.commentHeaderRight}>
            <Text style={styles.timeText}>{item.time}</Text>
            <TouchableOpacity 
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.moreButton}
            >
              <Image source={moreIcon} style={styles.moreIcon} />
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.commentText}>{item.comment}</Text>
        
        <View style={styles.commentActions}>
          <TouchableOpacity 
            onPress={() => handleReply(item.username, item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.replyText}>Reply</Text>
          </TouchableOpacity>
          <View style={styles.likeContainer}>
            <TouchableOpacity
              onPress={() => handleLikeComment(item.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Image 
                source={heartIcon} 
                style={[
                  styles.heartIcon, 
                  likedComments.includes(item.id) && styles.likedHeart
                ]} 
              />
            </TouchableOpacity>
            <Text style={styles.likesText}>{formatLikes(item.likes)}</Text>
          </View>
        </View>
        
        {item.likedByCreator && (
          <View style={styles.likedByCreatorContainer}>
            <Text style={styles.likedByCreatorText}>Liked by creator</Text>
          </View>
        )}
        
        {item.replies && item.replies.length > 0 && (
          <>
            <TouchableOpacity 
              style={styles.viewRepliesButton}
              onPress={() => toggleReplies(item.id)}
            >
              <View style={styles.repliesLine} />
              <Text style={styles.viewRepliesText}>
                {expandedReplies.includes(item.id)
                  ? 'Hide replies'
                  : `View ${item.replies.length} ${item.replies.length === 1 ? 'reply' : 'replies'}`}
              </Text>
            </TouchableOpacity>
            
            {expandedReplies.includes(item.id) && renderReplies(item.replies)}
          </>
        )}
      </View>
    </View>
  );
  
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={handleClose}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Image source={backIcon} style={styles.backIcon} />
      </TouchableOpacity>
      
      <Text style={styles.commentsTitle}>Comments</Text>
      
      <View style={styles.headerRight} />
    </View>
  );
  
  const renderPostDetails = () => (
    <View style={styles.postDetailsContainer}>
      <Image source={{ uri: postOwnerAvatar }} style={styles.postOwnerAvatar} />
      <View style={styles.postCaptionContainer}>
        <View style={styles.postOwnerContainer}>
          <Text style={styles.postOwnerUsername}>{postOwnerUsername}</Text>
          {isPostOwnerVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓</Text>
            </View>
          )}
        </View>
        <Text style={styles.postCaption}>{postCaption}</Text>
      </View>
    </View>
  );
  
  const renderReplyingBar = () => {
    if (!replyingTo) return null;
    
    const replyingComment = MOCK_COMMENTS.find(c => c.id === replyingTo) || 
                          MOCK_COMMENTS.flatMap(c => c.replies || []).find(r => r.id === replyingTo);
    
    if (!replyingComment) return null;
    
    return (
      <View style={styles.replyingBarContainer}>
        <Text style={styles.replyingText}>
          Replying to <Text style={styles.replyingUsername}>{replyingComment.username}</Text>
        </Text>
        <TouchableOpacity onPress={handleCancelReply}>
          <Text style={styles.cancelReplyText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View 
          style={[
            styles.backdrop,
            { opacity: fadeAnim }
          ]}
        />
      </TouchableWithoutFeedback>
      
      <Animated.View
        style={[
          styles.contentContainer,
          {
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {renderHeader()}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoidView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >
          <FlatList
            data={MOCK_COMMENTS}
            renderItem={renderComment}
            keyExtractor={item => item.id}
            style={styles.commentsList}
            contentContainerStyle={styles.commentsListContent}
            ListHeaderComponent={
              <>
                {renderPostDetails()}
                <View style={styles.commentsCountContainer}>
                  <Text style={styles.commentsCount}>{formatLikes(commentCount)} comments</Text>
                </View>
              </>
            }
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
          
          {renderReplyingBar()}
          
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={inputRef}
                placeholder="Add a comment..."
                placeholderTextColor="#999"
                style={styles.input}
                value={comment}
                onChangeText={setComment}
                multiline
                maxLength={2200}
              />
              <View style={styles.inputActions}>
                <TouchableOpacity style={styles.inputActionButton}>
                  <Image source={atIcon} style={styles.inputActionIcon} />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.postButton, 
                { opacity: comment.trim() ? 1 : 0.7, backgroundColor: comment.trim() ? colors.primary : '#ccc' }
              ]}
              onPress={handleSubmitComment}
              disabled={!comment.trim()}
            >
              <Image source={sendIcon} style={styles.sendIcon} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  contentContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '95%',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 24,
  },
  keyboardAvoidView: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#ffffff',
  },
  closeButton: {
    padding: 4,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#333',
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  headerRight: {
    width: 24,
  },
  postDetailsContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fafafa',
  },
  postOwnerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  postCaptionContainer: {
    flex: 1,
  },
  postOwnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  postOwnerUsername: {
    fontWeight: 'bold',
    marginRight: 4,
    fontSize: 15,
    color: '#111',
  },
  postCaption: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  commentsCountContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f9f9f9',
  },
  commentsCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  commentsList: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  commentsListContent: {
    paddingBottom: 16,
  },
  commentContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#eaeaea',
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
  commentHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  username: {
    fontWeight: 'bold',
    marginRight: 4,
    color: '#333',
    fontSize: 14,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    marginRight: 8,
  },
  moreButton: {
    padding: 2,
  },
  moreIcon: {
    width: 16,
    height: 16,
    tintColor: '#999',
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
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
    fontWeight: '500',
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartIcon: {
    width: 16,
    height: 16,
    tintColor: '#999',
    marginRight: 4,
  },
  likedHeart: {
    tintColor: colors.error,
  },
  likesText: {
    fontSize: 12,
    color: '#999',
  },
  likedByCreatorContainer: {
    marginTop: 4,
  },
  likedByCreatorText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  viewRepliesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: -8,
  },
  repliesLine: {
    width: 24,
    height: 1,
    backgroundColor: '#ddd',
    marginRight: 8,
  },
  viewRepliesText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  replyContainer: {
    flexDirection: 'row',
    marginTop: 12,
    marginLeft: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f8f8f8',
  },
  replyAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  replyContent: {
    flex: 1,
  },
  replyingBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  replyingText: {
    fontSize: 12,
    color: '#666',
  },
  replyingUsername: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  cancelReplyText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#f2f2f2',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  input: {
    flex: 1,
    fontSize: 14,
    padding: 0,
    maxHeight: 80,
    color: '#333',
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputActionButton: {
    marginLeft: 10,
  },
  inputActionIcon: {
    width: 20,
    height: 20,
    tintColor: '#999',
  },
  postButton: {
    marginLeft: 12,
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  sendIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  sendIconDisabled: {
    tintColor: 'rgba(255,255,255,0.5)',
  },
  verifiedBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 16,
    height: 16,
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
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
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
    marginLeft: 4,
  },
  inputLeft: {
    marginRight: 12,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});

export default CommentsScreen; 