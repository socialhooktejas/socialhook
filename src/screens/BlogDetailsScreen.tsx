import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Share,
  TextInput,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../utils/theme';

// Icons
const backIcon = require('../assets/icons/back.png');
const heartIcon = require('../assets/icons/heart.png');
const heartFilledIcon = require('../assets/icons/heart-filled.png');
const commentIcon = require('../assets/icons/chat.png');
const shareIcon = require('../assets/icons/send.png');
const bookmarkIcon = require('../assets/icons/bookmark.png');
const pointsIcon = require('../assets/icons/coin.png');
const downloadIcon = require('../assets/icons/download.png');

const { width } = Dimensions.get('window');

// Define content item types
interface ContentItem {
  type: string;
  text?: string;
  title?: string;
  duration?: string;
}

// Define blog post interface
interface BlogPost {
  id: string;
  title: string;
  image: string;
  author: string;
  authorAvatar: string;
  content: ContentItem[];
  date: string;
  readTime: string;
  points: number;
  relatedPosts: any[];
}

// Default blog data
const DEFAULT_BLOG: BlogPost = {
  id: '1',
  title: 'How to Increase Social Media Engagement',
  image: 'https://i.imgur.com/7MxNEj2.png',
  author: 'Marketing Expert',
  authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  content: [
    {
      type: 'paragraph',
      text: 'Social media engagement is crucial for building a strong online presence. Here are some effective strategies to boost your engagement rates and grow your following organically.',
    },
    {
      type: 'paragraph',
      text: 'One of the most important aspects is consistency in posting and engaging with your audience. Regular interaction helps build trust and creates a loyal community around your brand.',
    },
    {
      type: 'paragraph',
      text: 'Understanding your audience\'s preferences and peak activity times can significantly impact your content\'s performance.',
    },
    {
      type: 'paragraph',
      text: 'Consistency in posting and engaging with your followers can significantly impact your social media success. Using the right hashtags and posting at optimal times can increase your reach.',
    },
    {
      type: 'video',
      title: 'Click Here to Watch Movie',
      duration: '10s',
    },
  ],
  date: '2023-09-15',
  readTime: '5 min read',
  points: 2500,
  relatedPosts: [
    {
      id: '101',
      title: '10 Tips for Better Content Strategy',
      image: 'https://i.imgur.com/V5MvCj2.png',
      readTime: '5 min read',
    },
    {
      id: '102',
      title: 'Analytics for Beginners',
      image: 'https://i.imgur.com/yDvhxPQ.png',
      readTime: '7 min read',
    },
    {
      id: '103',
      title: 'Content Creation Tips',
      image: 'https://i.imgur.com/bJt3z8y.png',
      description: 'Learn the best practices for creating engaging social media content...',
    },
    {
      id: '104',
      title: 'Instagram Growth Hacks',
      image: 'https://i.imgur.com/tMfChGb.png',
      description: 'Discover proven strategies to grow your Instagram following...',
    },
    {
      id: '105',
      title: 'TikTok Success Guide',
      image: 'https://i.imgur.com/l9rIGKB.png',
      description: 'Master the art of creating viral TikTok content...',
    },
  ],
};

const BlogDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Merge route params with default data to ensure all fields exist
  const blogData = route.params?.blog || {};
  const blog: BlogPost = {
    ...DEFAULT_BLOG,
    ...blogData,
    // Ensure content is always an array
    content: blogData.content || DEFAULT_BLOG.content,
    // Ensure relatedPosts is always an array
    relatedPosts: blogData.relatedPosts || DEFAULT_BLOG.relatedPosts,
  };

  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [remainingTime, setRemainingTime] = useState(10); // 10 seconds timer

  // Timer effect for countdown
  useEffect(() => {
    let timer;
    if (remainingTime > 0) {
      timer = setTimeout(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [remainingTime]);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing article: ${blog.title} - SocialHook Blog`,
        title: blog.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleComment = () => {
    setShowCommentInput(!showCommentInput);
  };

  const handleBookmark = () => {
    // Implement bookmark functionality
  };

  const handleDownload = () => {
    // Implement download functionality
  };

  // Handle video button click
  const handleWatchVideo = () => {
    navigation.navigate('RedirectScreen', {
      videoUrl: 'https://www.youtube.com/watch?v=example', // Example URL - will redirect to HomeScreen as per requirements
      title: 'MovieStream'
    });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image source={backIcon} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Article</Text>
      </View>
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.headerIconButton} onPress={handleBookmark}>
          <Image source={bookmarkIcon} style={styles.headerActionIcon} />
        </TouchableOpacity>
        <View style={styles.headerPointsBadge}>
          <Image source={pointsIcon} style={styles.headerBadgeIcon} />
          <Text style={styles.headerBadgeText}>{blog.points.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );

  const renderVideoCard = (item, index) => {
    const formattedTime = `00:${remainingTime < 10 ? '0' : ''}${remainingTime}`;
    return (
      <TouchableOpacity 
        key={index} 
        style={styles.videoContainer}
        onPress={handleWatchVideo}
        activeOpacity={0.9}
      >
        <View style={styles.videoContentWrapper}>
          <View style={styles.videoLeftContent}>
            <Text style={styles.videoTitle}>{item.title || 'Click Here to Watch Movie'}</Text>
            <View style={styles.videoMetaRow}>
              <View style={styles.timerContainer}>
                <Text style={styles.timerText}>{formattedTime}</Text>
              </View>
              <Text style={styles.videoSubtitle}>Limited time offer</Text>
            </View>
          </View>
          
          <View style={styles.videoIconsContainer}>
            <View style={styles.timerCircle}>
              <Text style={styles.timerCircleText}>{remainingTime}</Text>
            </View>
            <View style={styles.videoActionContainer}>
              <TouchableOpacity 
                style={styles.downloadButton}
                onPress={handleDownload}
              >
                <Image 
                  source={downloadIcon} 
                  style={styles.downloadIcon} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.watchButton}
          onPress={handleWatchVideo}
        >
          <Text style={styles.watchButtonText}>Watch Now</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderContent = () => (
    <View style={styles.contentContainer}>
      <Image source={{ uri: blog.image }} style={styles.heroImage} />
      <View style={styles.contentWrapper}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{blog.title}</Text>
          <View style={styles.metaInfoRow}>
            <Text style={styles.readTime}>{blog.readTime}</Text>
            <Text style={styles.metaDivider}>•</Text>
            <Text style={styles.dateText}>{blog.date}</Text>
          </View>
        </View>
        
        <View style={styles.actionRow}>
          <View style={styles.authorBrief}>
            <Image source={{ uri: blog.authorAvatar }} style={styles.authorImageSmall} />
            <TouchableOpacity style={styles.miniFollowButton}>
              <Text style={styles.miniFollowText}>Follow</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <View style={[styles.actionIconContainer, isLiked && styles.actionIconContainerActive]}>
                <Image 
                  source={isLiked ? heartFilledIcon : heartIcon} 
                  style={[styles.actionIcon, isLiked && { tintColor: '#fff' }]} 
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
              <View style={styles.actionIconContainer}>
                <Image source={commentIcon} style={styles.actionIcon} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <View style={styles.actionIconContainer}>
                <Image source={shareIcon} style={styles.actionIcon} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.contentProse}>
          {Array.isArray(blog.content) && blog.content.map((item, index) => {
            if (item.type === 'paragraph' && item.text) {
              // Add a styled first paragraph
              if (index === 0) {
                return (
                  <Text key={index} style={styles.firstParagraph}>
                    {item.text}
                  </Text>
                );
              }
              return (
                <Text key={index} style={styles.paragraph}>
                  {item.text}
                </Text>
              );
            } else if (item.type === 'video') {
              return renderVideoCard(item, index);
            }
            return null;
          })}
        </View>

        <View style={styles.authorFooter}>
          <View style={styles.authorContainer}>
            <Image source={{ uri: blog.authorAvatar }} style={styles.authorImage} />
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{blog.author}</Text>
              <Text style={styles.authorBio}>Content Creator</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableOpacity>
        </View>

        {showCommentInput && (
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <TouchableOpacity 
              style={styles.postCommentButton}
              onPress={() => {
                setCommentText('');
                setShowCommentInput(false);
              }}
            >
              <Text style={styles.postCommentText}>Post</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  const renderRelatedPosts = () => (
    <View style={styles.relatedPostsContainer}>
      <View style={styles.relatedHeaderContainer}>
        <Text style={styles.relatedPostsTitle}>For You</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      {Array.isArray(blog.relatedPosts) && blog.relatedPosts.length > 0 && (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.relatedPostsContent}
            decelerationRate="fast"
            snapToInterval={width * 0.75 + 16}
            snapToAlignment="center"
          >
            {blog.relatedPosts.slice(0, 2).map((post) => (
              <TouchableOpacity 
                key={post.id} 
                style={styles.relatedPostCard}
                onPress={() => navigation.navigate('BlogDetailsScreen', { blog: post })}
                activeOpacity={0.9}
              >
                <Image source={{ uri: post.image }} style={styles.relatedPostImage} />
                <View style={styles.relatedPostOverlay} />
                <View style={styles.relatedPostInfo}>
                  <Text style={styles.relatedPostReadTime}>{post.readTime || '5 min read'}</Text>
                  <Text style={styles.relatedPostTitle} numberOfLines={2}>
                    {post.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {blog.relatedPosts.slice(2).map((post) => (
            <TouchableOpacity 
              key={post.id} 
              style={styles.listItemContainer}
              onPress={() => navigation.navigate('BlogDetailsScreen', { blog: post })}
              activeOpacity={0.8}
            >
              <Image source={{ uri: post.image }} style={styles.listItemImage} />
              <View style={styles.listItemContent}>
                <Text style={styles.listItemTitle}>{post.title}</Text>
                <Text style={styles.listItemDescription} numberOfLines={2}>
                  {post.description || ''}
                </Text>
                <Text style={styles.listItemReadTime}>5 min read</Text>
              </View>
            </TouchableOpacity>
          ))}
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <View style={styles.content}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderContent()}
          {renderRelatedPosts()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomColor: 'rgba(0,0,0,0.05)',
    borderBottomWidth: 1,
    height: 56,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  backIcon: {
    width: 18,
    height: 18,
    tintColor: '#333',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  headerActionIcon: {
    width: 18,
    height: 18,
    tintColor: '#555',
  },
  headerPointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8e1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffd54f',
    marginLeft: 10,
  },
  headerBadgeIcon: {
    width: 14,
    height: 14,
    tintColor: '#ffa000',
    marginRight: 4,
  },
  headerBadgeText: {
    color: '#795548',
    fontWeight: '600',
    fontSize: 13,
  },
  contentContainer: {
    padding: 0,
  },
  heroImage: {
    width: '100%',
    height: 260,
    backgroundColor: '#f0f0f0',
  },
  contentWrapper: {
    padding: 16,
    paddingTop: 12,
  },
  titleSection: {
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 6,
    lineHeight: 28,
  },
  metaInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readTime: {
    fontSize: 12,
    color: '#666',
  },
  metaDivider: {
    fontSize: 10,
    color: '#999',
    marginHorizontal: 6,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  authorBrief: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorImageSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.primary + '30',
  },
  miniFollowButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginLeft: 8,
  },
  miniFollowText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 8,
  },
  actionIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  actionIconContainerActive: {
    backgroundColor: '#F44336',
  },
  actionIcon: {
    width: 16,
    height: 16,
    tintColor: '#555',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
  },
  authorFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    marginTop: 14,
    marginBottom: 16,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: colors.primary + '30',
  },
  authorInfo: {
    justifyContent: 'center',
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 2,
  },
  authorBio: {
    fontSize: 13,
    color: '#666',
  },
  followButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  commentInputContainer: {
    marginTop: 24,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    padding: 14,
    maxHeight: 100,
    fontSize: 14,
    color: '#333',
  },
  postCommentButton: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
    borderRadius: 24,
  },
  postCommentText: {
    color: '#fff',
    fontWeight: '600',
  },
  relatedPostsContainer: {
    paddingVertical: 24,
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 8,
  },
  relatedHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  relatedPostsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  relatedPostsContent: {
    paddingLeft: 16,
    paddingRight: 8,
    paddingBottom: 8,
  },
  relatedPostCard: {
    width: width * 0.75,
    height: 200,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    position: 'relative',
  },
  relatedPostImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  relatedPostOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    backgroundGradient: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
  },
  relatedPostInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  relatedPostReadTime: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 6,
  },
  relatedPostTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  listItemContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  listItemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  listItemContent: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    lineHeight: 22,
  },
  listItemDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
  },
  listItemReadTime: {
    fontSize: 12,
    color: '#888',
  },
  contentProse: {
    marginBottom: 24,
  },
  firstParagraph: {
    fontSize: 18,
    lineHeight: 28,
    color: '#333',
    marginBottom: 20,
    fontWeight: '500',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 26,
    color: '#444',
    marginBottom: 20,
    letterSpacing: 0.2,
  },
  videoContainer: {
    backgroundColor: '#1A2C42',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 14,
    overflow: 'hidden',
  },
  videoContentWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  videoLeftContent: {
    flex: 1,
    marginRight: 16,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 12,
  },
  videoMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerContainer: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 10,
  },
  timerText: {
    color: '#FF9800',
    fontSize: 14,
    fontWeight: '600',
  },
  videoSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  videoIconsContainer: {
    alignItems: 'center',
  },
  timerCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF9800',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  timerCircleText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  videoActionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  downloadButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  watchButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  watchButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default BlogDetailsScreen; 