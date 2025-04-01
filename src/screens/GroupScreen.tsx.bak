import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  StatusBar,
  Dimensions,
  TextInput,
  FlatList,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { colors } from '../utils/theme';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  DynamicGroupScreen: {
    groupId: string;
    groupName: string;
    debateTopic: string;
    debateType: string;
  };
};

interface RouteParams {
  groupId?: string;
}

interface PollOption {
  id: string;
  name: string;
  subtitle: string;
  votes: string;
  isLive: boolean;
}

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
    timeAgo: string;
  };
  content: string;
  image: string;
  likes: string;
  comments: string;
  shares: string;
}

const { width } = Dimensions.get('window');

// Mock data for dynamic group poll
const pollData = {
  title: "Who's the GOAT? Cast your vote! 🏏",
  options: [
    { id: '1', name: 'Virat Kohli', subtitle: 'King Kohli', votes: '48.2K', isLive: true },
    { id: '2', name: 'MS Dhoni', subtitle: 'Captain Cool', votes: '45.8K', isLive: true },
  ],
  participants: '12,847 cricket fans discussing'
};

// Mock posts in the group
const initialPosts: Post[] = [
  {
    id: '1',
    author: {
      name: 'Priya Patel',
      avatar: 'https://source.unsplash.com/random/100x100/?portrait,woman',
      verified: true,
      timeAgo: '4h ago'
    },
    content: "Kohli's consistency across all formats is just unreal! 71 international centuries and counting... 👑",
    image: 'https://source.unsplash.com/random/600x600/?cricket,kohli',
    likes: '3.1K',
    comments: '456',
    shares: '189',
  },
  {
    id: '2',
    author: {
      name: 'Rahul Sharma',
      avatar: 'https://source.unsplash.com/random/100x100/?portrait,man',
      verified: true,
      timeAgo: '2h ago'
    },
    content: "That last-ball six by Dhoni in the World Cup final will forever be etched in cricket history! 🏆 What a moment!",
    image: 'https://source.unsplash.com/random/600x600/?cricket,dhoni',
    likes: '2.4K',
    comments: '342',
    shares: '124',
  },
  {
    id: '3',
    author: {
      name: 'Aditya Singh',
      avatar: 'https://source.unsplash.com/random/100x100/?portrait,indian',
      verified: false,
      timeAgo: '6h ago'
    },
    content: "Just witnessed an incredible innings at the IPL! Cricket truly is a religion here in India. 🏏",
    image: 'https://source.unsplash.com/random/600x600/?cricket,stadium',
    likes: '1.8K',
    comments: '257',
    shares: '98',
  },
  {
    id: '4',
    author: {
      name: 'Sarah Williams',
      avatar: 'https://source.unsplash.com/random/100x100/?portrait,girl',
      verified: true,
      timeAgo: '8h ago'
    },
    content: "The atmosphere at today's match was electric! Nothing beats watching cricket live at the stadium 🎉",
    image: 'https://source.unsplash.com/random/600x600/?cricket,crowd',
    likes: '4.2K',
    comments: '521',
    shares: '203',
  },
  {
    id: '5',
    author: {
      name: 'Rajesh Kumar',
      avatar: 'https://source.unsplash.com/random/100x100/?portrait,indian,man',
      verified: true,
      timeAgo: '12h ago'
    },
    content: "What a match-winning performance! The future of Indian cricket looks bright 🌟",
    image: 'https://source.unsplash.com/random/600x600/?cricket,celebration',
    likes: '5.7K',
    comments: '678',
    shares: '345',
  }
];

const additionalPosts: Post[] = [
  {
    id: '6',
    author: {
      name: 'Amit Patel',
      avatar: 'https://source.unsplash.com/random/100x100/?portrait,indian,boy',
      verified: true,
      timeAgo: '1d ago'
    },
    content: "Can't wait for the next big tournament! The energy in cricket is unmatched 🏏✨",
    image: 'https://source.unsplash.com/random/600x600/?cricket,tournament',
    likes: '6.1K',
    comments: '892',
    shares: '445',
  },
  {
    id: '7',
    author: {
      name: 'Meera Shah',
      avatar: 'https://source.unsplash.com/random/100x100/?portrait,indian,woman',
      verified: false,
      timeAgo: '1d ago'
    },
    content: "Historic moment for women's cricket! Breaking barriers and setting new records 💪",
    image: 'https://source.unsplash.com/random/600x600/?cricket,women',
    likes: '8.3K',
    comments: '1.2K',
    shares: '678',
  },
  {
    id: '8',
    author: {
      name: 'Karthik Rajan',
      avatar: 'https://source.unsplash.com/random/100x100/?portrait,south,indian',
      verified: true,
      timeAgo: '2d ago'
    },
    content: "The art of spin bowling - pure magic on the field! 🎯",
    image: 'https://source.unsplash.com/random/600x600/?cricket,bowling',
    likes: '4.5K',
    comments: '567',
    shares: '234',
  },
  {
    id: '9',
    author: {
      name: 'Neha Sharma',
      avatar: 'https://source.unsplash.com/random/100x100/?portrait,girl,indian',
      verified: true,
      timeAgo: '2d ago'
    },
    content: "From gully cricket to international stadiums - the journey of dreams! 🌟",
    image: 'https://source.unsplash.com/random/600x600/?cricket,street',
    likes: '7.2K',
    comments: '934',
    shares: '512',
  },
  {
    id: '10',
    author: {
      name: 'Rohan Kapoor',
      avatar: 'https://source.unsplash.com/random/100x100/?portrait,boy,indian',
      verified: false,
      timeAgo: '3d ago'
    },
    content: "The perfect cover drive - poetry in motion! 🏏✨",
    image: 'https://source.unsplash.com/random/600x600/?cricket,batting',
    likes: '5.9K',
    comments: '723',
    shares: '389',
  }
];

// Group details
const groupDetails = {
  name: 'CricketVerse',
  members: '2.4M members',
  posts: '500+ posts/day',
  trending: '#2 Trending',
  coverImage: 'https://source.unsplash.com/random/1000x400/?cricket,stadium',
  description: 'The ultimate hub for cricket fans worldwide! Discuss matches, players, stats, and everything cricket.',
  rules: [
    'Be respectful to all members',
    'No spam or promotional content',
    'Keep discussions cricket-related',
    'No hate speech or personal attacks'
  ],
  admins: [
    { id: '1', name: 'Virat Fan', avatar: 'https://source.unsplash.com/random/100x100/?man,indian' },
    { id: '2', name: 'Cricket Addict', avatar: 'https://source.unsplash.com/random/100x100/?woman,indian' }
  ],
  tags: ['Cricket', 'Sports', 'IPL', 'ICC', 'TeamIndia']
};

const GroupScreen = ({ route }: { route: { params?: RouteParams } }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState('posts');
  const [commentText, setCommentText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const handleBack = () => {
    navigation.goBack();
  };
  
  const handlePollClick = () => {
    // Navigate to the DynamicGroupScreen
    navigation.navigate('DynamicGroupScreen', {
      groupId: route.params?.groupId || '1',
      groupName: groupDetails.name,
      debateTopic: pollData.title,
      debateType: 'vs'
    });
  };
  
  const renderPollOption = ({ item }: { item: PollOption }) => (
    <TouchableOpacity 
      style={styles.pollOption} 
      activeOpacity={0.7}
      onPress={handlePollClick}
    >
      <View style={styles.pollOptionContent}>
        <View>
          <Text style={styles.pollOptionName}>{item.name}</Text>
          <Text style={styles.pollOptionSubtitle}>{item.subtitle}</Text>
        </View>
        <View style={styles.pollVotes}>
          <Text style={styles.pollVotesText}>{item.votes}</Text>
          {item.isLive && <Text style={styles.pollLiveTag}>LIVE</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const loadMorePosts = useCallback(() => {
    if (loading) return;
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setPosts(currentPosts => [...currentPosts, ...additionalPosts]);
      setLoading(false);
    }, 1500);
  }, [loading]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setPosts(initialPosts);
      setRefreshing(false);
    }, 1500);
  }, []);

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <View style={styles.postHeaderLeft}>
          <Image source={{ uri: item.author.avatar }} style={styles.postAvatar} />
          <View style={styles.postHeaderInfo}>
            <View style={styles.postAuthorRow}>
              <Text style={styles.postAuthorName}>{item.author.name}</Text>
              {item.author.verified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓</Text>
                </View>
              )}
            </View>
            <Text style={styles.postTime}>{item.author.timeAgo}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.postMoreButton}>
          <Image 
            source={require('../assets/icons/more.png')} 
            style={styles.postMoreIcon} 
          />
        </TouchableOpacity>
      </View>

      <Image 
        source={{ uri: item.image }} 
        style={styles.postImage}
        resizeMode="cover"
      />

      <View style={styles.postActions}>
        <View style={styles.postActionsLeft}>
          <TouchableOpacity style={styles.postAction}>
            <Image 
              source={require('../assets/icons/heart.png')} 
              style={styles.actionIcon} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.postAction}>
            <Image 
              source={require('../assets/icons/chat.png')} 
              style={styles.actionIcon} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.postAction}>
            <Image 
              source={require('../assets/icons/send.png')} 
              style={styles.actionIcon} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.postEngagement}>
        <Text style={styles.likesText}>{item.likes} likes</Text>
      </View>

      <View style={styles.postCaption}>
        <Text style={styles.captionText}>
          <Text style={styles.captionUsername}>{item.author.name}</Text>{' '}
          {item.content}
        </Text>
      </View>

      <TouchableOpacity style={styles.commentsButton}>
        <Text style={styles.commentsText}>
          View all {item.comments} comments
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Image 
            source={require('../assets/icons/back.png')} 
            style={styles.backIcon} 
          />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.headerTitle}>{groupDetails.name}</Text>
            <View style={styles.trendingContainer}>
              <Text style={styles.headerSubtitle}>{groupDetails.trending}</Text>
            </View>
          </View>
          <Text style={styles.groupStats}>{groupDetails.members} • {groupDetails.posts}</Text>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Image 
            source={require('../assets/icons/more.png')} 
            style={styles.menuButtonIcon} 
          />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]} 
          onPress={() => setActiveTab('posts')}
        >
          <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'about' && styles.activeTab]} 
          onPress={() => setActiveTab('about')}
        >
          <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'members' && styles.activeTab]} 
          onPress={() => setActiveTab('members')}
        >
          <Text style={[styles.tabText, activeTab === 'members' && styles.activeTabText]}>Members</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'media' && styles.activeTab]} 
          onPress={() => setActiveTab('media')}
        >
          <Text style={[styles.tabText, activeTab === 'media' && styles.activeTabText]}>Media</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Image 
              source={require('../assets/icons/search.png')} 
              style={styles.searchIcon} 
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search in group"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
        
        {/* Group Cover & Info */}
        <View style={styles.coverContainer}>
          <Image 
            source={{ uri: groupDetails.coverImage }} 
            style={styles.coverImage} 
            resizeMode="cover" 
          />
        </View>
        
        {/* Posts Tab Content */}
        {activeTab === 'posts' && (
          <View style={styles.tabContent}>
            {/* Dynamic Group Poll */}
            <View style={styles.dynamicGroupContainer}>
              <TouchableOpacity 
                style={styles.pollContainer}
                activeOpacity={0.9}
                onPress={handlePollClick}
              >
                <Text style={styles.pollTitle}>{pollData.title}</Text>
                <FlatList
                  data={pollData.options}
                  renderItem={renderPollOption}
                  keyExtractor={item => item.id}
                  scrollEnabled={false}
                />
                <Text style={styles.pollParticipants}>{pollData.participants}</Text>
              </TouchableOpacity>
            </View>
            
            {/* Create Post Input */}
            <View style={styles.createPostContainer}>
              <Image 
                source={{ uri: 'https://source.unsplash.com/random/100x100/?portrait' }} 
                style={styles.userAvatar} 
              />
              <TouchableOpacity style={styles.createPostInput} activeOpacity={0.7}>
                <Text style={styles.createPostPlaceholder}>Share your thoughts...</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createPostMedia}>
                <Text style={styles.createPostMediaIcon}>📷</Text>
              </TouchableOpacity>
            </View>
            
            {/* Group Posts */}
            <FlatList
              data={posts}
              renderItem={renderPost}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              onEndReached={loadMorePosts}
              onEndReachedThreshold={0.5}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor="#1A1B35"
                />
              }
              ListHeaderComponent={() => (
                <>
                  <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                      <Image 
                        source={require('../assets/icons/search.png')} 
                        style={styles.searchIcon} 
                      />
                      <TextInput
                        style={styles.searchInput}
                        placeholder="Search in group"
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                      />
                    </View>
                  </View>
                  <View style={styles.dynamicGroupContainer}>
                    <TouchableOpacity 
                      style={styles.pollContainer}
                      activeOpacity={0.9}
                      onPress={handlePollClick}
                    >
                      <Text style={styles.pollTitle}>{pollData.title}</Text>
                      <FlatList
                        data={pollData.options}
                        renderItem={renderPollOption}
                        keyExtractor={item => item.id}
                        scrollEnabled={false}
                      />
                      <Text style={styles.pollParticipants}>{pollData.participants}</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
              ListFooterComponent={() => (
                loading ? (
                  <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#1A1B35" />
                  </View>
                ) : null
              )}
            />
          </View>
        )}
        
        {/* About Tab Content */}
        {activeTab === 'about' && (
          <View style={styles.tabContent}>
            <View style={styles.aboutSection}>
              <Text style={styles.aboutSectionTitle}>Description</Text>
              <Text style={styles.aboutDescription}>{groupDetails.description}</Text>
            </View>
            
            <View style={styles.aboutSection}>
              <Text style={styles.aboutSectionTitle}>Group Rules</Text>
              {groupDetails.rules.map((rule, index) => (
                <View key={index} style={styles.ruleItem}>
                  <Text style={styles.ruleNumber}>{index + 1}</Text>
                  <Text style={styles.ruleText}>{rule}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.aboutSection}>
              <Text style={styles.aboutSectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {groupDetails.tags.map((tag, index) => (
                  <View key={index} style={styles.tagItem}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.aboutSection}>
              <Text style={styles.aboutSectionTitle}>Admins & Moderators</Text>
              <View style={styles.adminsContainer}>
                {groupDetails.admins.map((admin) => (
                  <View key={admin.id} style={styles.adminItem}>
                    <Image source={{ uri: admin.avatar }} style={styles.adminAvatar} />
                    <Text style={styles.adminName}>{admin.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
        
        {/* Members Tab Content */}
        {activeTab === 'members' && (
          <View style={styles.tabContent}>
            <Text style={styles.membersCountText}>{groupDetails.members}</Text>
            {/* Members list would go here, similar structure to posts */}
            <Text style={styles.comingSoonText}>Member listing coming soon</Text>
          </View>
        )}
        
        {/* Media Tab Content */}
        {activeTab === 'media' && (
          <View style={styles.tabContent}>
            <View style={styles.mediaGrid}>
              {posts
                .filter(post => post.image)
                .map(post => (
                  <TouchableOpacity key={post.id} style={styles.mediaItem}>
                    <Image source={{ uri: post.image }} style={styles.mediaItemImage} />
                  </TouchableOpacity>
                ))
              }
            </View>
          </View>
        )}
      </ScrollView>
      
      {/* Comment Input (Fixed at Bottom) */}
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={commentText}
          onChangeText={setCommentText}
        />
        <TouchableOpacity 
          style={[styles.commentSendButton, commentText.length > 0 && styles.commentSendButtonActive]}
          disabled={commentText.length === 0}
        >
          <Image 
            source={require('../assets/icons/send.png')} 
            style={[
              styles.commentSendIcon, 
              commentText.length > 0 && { tintColor: 'white' }
            ]} 
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  headerContainer: {
    backgroundColor: '#1A1B35',
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Platform.OS === 'ios' ? 88 : 70 + (StatusBar.currentHeight || 0),
    zIndex: 1,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginRight: 8,
  },
  trendingContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  headerSubtitle: {
    color: '#A5A5F3',
    fontSize: 12,
    fontWeight: '500',
  },
  groupStats: {
    color: '#A5A5F3',
    fontSize: 13,
  },
  menuButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtonIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  coverContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  tabContent: {
    backgroundColor: '#F9F9F9',
  },
  dynamicGroupContainer: {
    padding: 10,
  },
  pollContainer: {
    backgroundColor: '#1B1464',
    borderRadius: 16,
    padding: 15,
  },
  pollTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  pollOption: {
    backgroundColor: '#2D2B8F', // Slightly lighter blue
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  pollOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pollOptionName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pollOptionSubtitle: {
    color: '#A5A5F3', // Light purple
    fontSize: 14,
  },
  pollVotes: {
    alignItems: 'flex-end',
  },
  pollVotesText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pollLiveTag: {
    color: '#4CAF50', // Green
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  pollParticipants: {
    color: '#A5A5F3', // Light purple
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  createPostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  createPostInput: {
    flex: 1,
    height: 36,
    justifyContent: 'center',
  },
  createPostPlaceholder: {
    color: '#999',
    fontSize: 14,
  },
  createPostMedia: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  createPostMediaIcon: {
    fontSize: 18,
  },
  postContainer: {
    backgroundColor: 'white',
    marginBottom: 8,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  postHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postHeaderInfo: {
    marginLeft: 10,
  },
  postAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  postAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAuthorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262626',
    marginRight: 4,
  },
  verifiedBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#3897F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  postTime: {
    fontSize: 12,
    color: '#8E8E8E',
  },
  postMoreButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postMoreIcon: {
    width: 16,
    height: 16,
    tintColor: '#262626',
  },
  postImage: {
    width: '100%',
    height: width,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  postActionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAction: {
    marginRight: 16,
  },
  actionIcon: {
    width: 24,
    height: 24,
    tintColor: '#262626',
  },
  postEngagement: {
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  likesText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262626',
  },
  postCaption: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  captionText: {
    fontSize: 14,
    color: '#262626',
    lineHeight: 18,
  },
  captionUsername: {
    fontWeight: '600',
  },
  commentsButton: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  commentsText: {
    fontSize: 14,
    color: '#8E8E8E',
  },
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  // About Tab Styles
  aboutSection: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 10,
  },
  aboutSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  aboutDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  ruleItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  ruleNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 10,
    fontSize: 12,
    fontWeight: 'bold',
  },
  ruleText: {
    flex: 1,
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagItem: {
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 13,
    color: '#555',
  },
  adminsContainer: {
    flexDirection: 'row',
  },
  adminItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  adminAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 6,
  },
  adminName: {
    fontSize: 13,
    color: '#333',
  },
  // Members Tab Styles
  membersCountText: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 16,
    color: '#333',
  },
  comingSoonText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    padding: 30,
  },
  // Media Tab Styles
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 2,
  },
  mediaItem: {
    width: (width - 8) / 3,
    height: (width - 8) / 3,
    margin: 1,
  },
  mediaItemImage: {
    width: '100%',
    height: '100%',
  },
  // Bottom Comment Input
  commentInputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    height: 36,
    backgroundColor: '#F0F0F0',
    borderRadius: 18,
    paddingHorizontal: 15,
    fontSize: 14,
  },
  commentSendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  commentSendButtonActive: {
    backgroundColor: colors.primary,
  },
  commentSendIcon: {
    width: 16,
    height: 16,
    tintColor: '#999',
    transform: [{ rotate: '45deg' }],
  },
  searchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  searchIcon: {
    width: 16,
    height: 16,
    tintColor: '#777',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
    fontSize: 14,
  },
});

export default GroupScreen; 
