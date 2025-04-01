import React, { useState } from 'react';
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
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Image source={backIcon} style={styles.backIcon} />
      </TouchableOpacity>
      <View style={styles.pointsContainer}>
        <Image source={pointsIcon} style={styles.pointsIcon} />
        <Text style={styles.pointsText}>{blog.points.toLocaleString()}</Text>
      </View>
    </View>
  );

  const renderContent = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.title}>{blog.title}</Text>
      <Image source={{ uri: blog.image }} style={styles.mainImage} />
      
      <View style={styles.blogActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Image 
            source={isLiked ? heartFilledIcon : heartIcon} 
            style={[styles.actionIcon, isLiked && { tintColor: '#F44336' }]} 
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
          <Image source={commentIcon} style={styles.actionIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Image source={shareIcon} style={styles.actionIcon} />
        </TouchableOpacity>
        <View style={styles.spacer} />
        <TouchableOpacity style={styles.actionButton} onPress={handleBookmark}>
          <Image source={bookmarkIcon} style={styles.actionIcon} />
        </TouchableOpacity>
      </View>

      {Array.isArray(blog.content) && blog.content.map((item, index) => {
        if (item.type === 'paragraph' && item.text) {
          return (
            <Text key={index} style={styles.paragraph}>
              {item.text}
            </Text>
          );
        } else if (item.type === 'video') {
          return (
            <TouchableOpacity key={index} style={styles.videoContainer}>
              <View style={styles.videoIconContainer}>
                <Image 
                  source={downloadIcon} 
                  style={styles.downloadIcon} 
                />
              </View>
              <Text style={styles.videoTitle}>{item.title || 'Watch Video'}</Text>
              <Text style={styles.videoDuration}>{item.duration || ''}</Text>
              <TouchableOpacity 
                style={styles.watchButton}
                onPress={handleWatchVideo}
              >
                <Text style={styles.watchButtonText}>Watch Here</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }
        return null;
      })}

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
          >
            {blog.relatedPosts.slice(0, 2).map((post) => (
              <TouchableOpacity 
                key={post.id} 
                style={styles.relatedPostCard}
                onPress={() => navigation.navigate('BlogDetailsScreen', { blog: post })}
              >
                <Image source={{ uri: post.image }} style={styles.relatedPostImage} />
                <View style={styles.relatedPostInfo}>
                  <Text style={styles.relatedPostTitle} numberOfLines={2}>
                    {post.title}
                  </Text>
                  <Text style={styles.relatedPostMeta}>{post.readTime || '5 min read'}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {blog.relatedPosts.slice(2).map((post) => (
            <TouchableOpacity 
              key={post.id} 
              style={styles.listItemContainer}
              onPress={() => navigation.navigate('BlogDetailsScreen', { blog: post })}
            >
              <Image source={{ uri: post.image }} style={styles.listItemImage} />
              <View style={styles.listItemContent}>
                <Text style={styles.listItemTitle}>{post.title}</Text>
                <Text style={styles.listItemDescription} numberOfLines={2}>
                  {post.description || ''}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderContent()}
        {renderRelatedPosts()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: '#333',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8e1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffd54f',
  },
  pointsIcon: {
    width: 16,
    height: 16,
    tintColor: '#ffa000',
    marginRight: 4,
  },
  pointsText: {
    color: '#795548',
    fontWeight: '600',
    fontSize: 14,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    lineHeight: 32,
  },
  mainImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
  },
  blogActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionButton: {
    marginRight: 24,
  },
  actionIcon: {
    width: 24,
    height: 24,
    tintColor: '#555',
  },
  spacer: {
    flex: 1,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 16,
  },
  videoContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    alignItems: 'center',
  },
  videoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  downloadIcon: {
    width: 24,
    height: 24,
    tintColor: '#555',
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  videoDuration: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  watchButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 60,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 8,
  },
  watchButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  commentInputContainer: {
    marginTop: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 12,
    maxHeight: 100,
    fontSize: 14,
    color: '#333',
  },
  postCommentButton: {
    marginLeft: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
    borderRadius: 16,
  },
  postCommentText: {
    color: '#fff',
    fontWeight: '600',
  },
  relatedPostsContainer: {
    paddingVertical: 16,
    backgroundColor: '#f9f9f9',
  },
  relatedHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  relatedPostsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  relatedPostsContent: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  relatedPostCard: {
    width: width * 0.7,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  relatedPostImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#f0f0f0',
  },
  relatedPostInfo: {
    padding: 12,
  },
  relatedPostTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  relatedPostMeta: {
    fontSize: 12,
    color: '#888',
  },
  listItemContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  listItemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  listItemContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  listItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  listItemDescription: {
    fontSize: 13,
    color: '#777',
    lineHeight: 18,
  },
});

export default BlogDetailsScreen; 