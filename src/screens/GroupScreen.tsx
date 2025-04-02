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
  ListRenderItemInfo,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { colors } from '../utils/theme';
import { useNavigation } from '@react-navigation/native';

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

// Define the poll option type for type safety
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
const pollData: {
  title: string;
  options: PollOption[];
  participants: string;
} = {
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
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('posts');
  const [commentText, setCommentText] = useState('');
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const tabs = ['posts', 'about', 'members', 'media'];
  
  const handleBack = () => {
    navigation.goBack();
  };
  
  const handlePollClick = () => {
    // Use a more appropriate method to navigate without type errors
    const params = {
      groupId: route.params?.groupId || '1',
      groupName: groupDetails.name,
      debateTopic: pollData.title,
      debateType: 'vs'
    };
    
    // @ts-ignore - Ignoring type check for navigation to allow for mixed navigation structure
    navigation.navigate('DynamicGroupScreen', params);
  };
  
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

  const renderPost = useCallback(({ item }: ListRenderItemInfo<Post>) => (
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
  ), []);

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
  return (
            <FlatList
              data={posts}
              renderItem={renderPost}
            keyExtractor={(item) => `post-${item.id}`}
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
            onScroll={(_event: NativeSyntheticEvent<NativeScrollEvent>) => { /* empty function */ }}
            scrollEventThrottle={16}
              ListHeaderComponent={() => (
                <>
                {/* Dynamic Group Poll - Only component in header now */}
                  <View style={styles.dynamicGroupContainer}>
                    <TouchableOpacity 
                      style={styles.pollContainer}
                      activeOpacity={0.9}
                      onPress={handlePollClick}
                    >
                    <View style={styles.dynamicGroupTag}>
                      <Text style={styles.dynamicGroupTagText}>DYNAMIC GROUP</Text>
                    </View>
                    
                    <Text 
                      style={styles.pollTitle} 
                      numberOfLines={1} 
                      ellipsizeMode="tail"
                    >
                      {pollData.title}
                    </Text>
                    
                    <View style={styles.pollImageContainer}>
                      <Image 
                        source={{ uri: 'https://source.unsplash.com/random/600x400/?cricket,kohli,dhoni' }}
                        style={styles.pollImage}
                        resizeMode="cover"
                      />
                      <View style={styles.pollImageOverlay} />
                      <Text style={styles.pollImageText}>Who's the Cricket GOAT?</Text>
                    </View>
                    
                    <View style={styles.pollOptionsContainer}>
                      {pollData.options.map((item, optionIndex) => (
                        <TouchableOpacity 
                          key={`poll-option-${item.id}-${optionIndex}`}
                          style={styles.pollOption} 
                          activeOpacity={0.7}
                          onPress={handlePollClick}
                        >
                          <View style={styles.pollOptionContent}>
                            <Text style={styles.pollOptionName}>{item.name}</Text>
                            <View style={styles.pollVotes}>
                              <Text style={styles.pollVotesText}>{item.votes}</Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.joinButtonContainer}
                      activeOpacity={0.7}
                      onPress={handlePollClick}
                    >
                      <Text style={styles.joinButtonText}>Join Dynamic Group</Text>
                    </TouchableOpacity>
                    
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
        );
        
      case 'about':
        return (
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContentContainer}
          >
            <View style={styles.coverContainer}>
              <Image 
                source={{ uri: groupDetails.coverImage }} 
                style={styles.coverImage} 
                resizeMode="cover" 
            />
          </View>
        
            <View style={styles.aboutSection}>
              <Text style={styles.aboutSectionTitle}>Description</Text>
              <Text style={styles.aboutDescription}>{groupDetails.description}</Text>
            </View>
            
            <View style={styles.aboutSection}>
              <Text style={styles.aboutSectionTitle}>Group Rules</Text>
              {groupDetails.rules.map((rule, index) => (
                <View key={`rule-item-${index}`} style={styles.ruleItem}>
                  <Text style={styles.ruleNumber}>{index + 1}</Text>
                  <Text style={styles.ruleText}>{rule}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.aboutSection}>
              <Text style={styles.aboutSectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {groupDetails.tags.map((tag, index) => (
                  <View key={`tag-item-${index}`} style={styles.tagItem}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.aboutSection}>
              <Text style={styles.aboutSectionTitle}>Admins & Moderators</Text>
              <View style={styles.adminsContainer}>
                {groupDetails.admins.map((admin) => (
                  <View key={`admin-item-${admin.id}`} style={styles.adminItem}>
                    <Image source={{ uri: admin.avatar }} style={styles.adminAvatar} />
                    <Text style={styles.adminName}>{admin.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        );
        
      case 'members':
        return (
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContentContainer}
          >
            <View style={styles.coverContainer}>
              <Image 
                source={{ uri: groupDetails.coverImage }} 
                style={styles.coverImage} 
                resizeMode="cover" 
              />
          </View>
        
            <Text style={styles.membersCountText}>{groupDetails.members}</Text>
            {/* Members list would go here, similar structure to posts */}
            <Text style={styles.comingSoonText}>Member listing coming soon</Text>
          </ScrollView>
        );
        
      case 'media':
        return (
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContentContainer}
          >
            <View style={styles.coverContainer}>
              <Image 
                source={{ uri: groupDetails.coverImage }} 
                style={styles.coverImage} 
                resizeMode="cover" 
              />
          </View>
        
            <View style={styles.mediaGrid}>
              {posts
                .filter(post => post.image)
                .map((post) => (
                  <TouchableOpacity key={`media-item-${post.id}`} style={styles.mediaItem}>
                    <Image source={{ uri: post.image }} style={styles.mediaItemImage} />
                  </TouchableOpacity>
                ))
              }
            </View>
      </ScrollView>
        );
        
      default:
        return null;
    }
  };

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
        {tabs.map((tab) => (
          <TouchableOpacity 
            key={`tab-${tab}`}
            style={[styles.tab, activeTab === tab && styles.activeTab]} 
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
            {activeTab === tab && (
              <View style={styles.tabIndicator} />
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Tab content container */}
      <View style={styles.tabContentWrapper}>
        {renderTabContent()}
      </View>
      
      {/* Bottom Navigation is provided by the Tab.Navigator in AppNavigator */}
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    zIndex: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.primary,
  },
  tabContentWrapper: {
    flex: 1,
    paddingTop: 0,
  },
  coverContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
    marginBottom: 0,
    marginTop: 5,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  dynamicGroupContainer: {
    padding: 0,
    paddingHorizontal: 10,
    marginTop: 5,
    marginBottom: 10,
  },
  pollContainer: {
    backgroundColor: '#2A2A72',
    borderRadius: 16,
    padding: 16,
    paddingTop: 40,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  pollTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 15,
  },
  dynamicGroupTag: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#E53935',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 1,
  },
  dynamicGroupTagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pollImageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#3D3D94',
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  pollImage: {
    width: '100%',
    height: '100%',
  },
  pollImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(26, 27, 53, 0.5)',
  },
  pollImageText: {
    position: 'absolute',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  pollOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  pollOption: {
    backgroundColor: '#3D3D94',
    borderRadius: 10,
    padding: 14,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pollOptionContent: {
    alignItems: 'center',
  },
  pollOptionName: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pollVotes: {
    alignItems: 'center',
    marginTop: 8,
  },
  pollVotesText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  joinButtonContainer: {
    backgroundColor: '#E53935',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pollParticipants: {
    color: '#A5A5F3',
    fontSize: 13,
    textAlign: 'center',
  },
  createPostContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(20,20,20,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 'auto',
  },
  createPostImage: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
    tintColor: 'white',
  },
  postContainer: {
    backgroundColor: 'white',
    marginBottom: 8,
    marginHorizontal: 10,
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
    paddingTop: 5,
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
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
    paddingTop: 12,
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
    marginTop: 5,
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
  scrollContentContainer: {
    paddingBottom: 30,
  },
});

export default GroupScreen; 
