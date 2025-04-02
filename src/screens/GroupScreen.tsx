import React, { useState, useCallback, useEffect } from 'react';
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
  FlatList,
  Platform,
  ActivityIndicator,
  RefreshControl,
  ListRenderItemInfo,
} from 'react-native';
import { colors } from '../utils/theme';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
  debateTopic?: string;
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
      name: 'cricket_lover',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      verified: true,
      timeAgo: '2h ago'
    },
    content: 'Who do you think is the GOAT (Greatest Of All Time) in cricket? Is it Virat Kohli or MS Dhoni?',
    image: 'https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    likes: '1.5K',
    comments: '350',
    shares: '120',
    debateTopic: 'Cricket GOAT Debate'
  },
  {
    id: '2',
    author: {
      name: 'jane_smith',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      verified: true,
      timeAgo: '3h ago'
    },
    content: 'Just watched an amazing match! The energy in the stadium was incredible. What a nail-biter finish!',
    image: 'https://images.pexels.com/photos/2464152/pexels-photo-2464152.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    likes: '982',
    comments: '456',
    shares: '189'
  },
  {
    id: '3',
    author: {
      name: 'Aditya Singh',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      verified: false,
      timeAgo: '6h ago'
    },
    content: "The new generation of Indian cricketers is so promising. Future looks bright! 🇮🇳",
    image: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    likes: '1.8K',
    comments: '257',
    shares: '98'
  },
  {
    id: '4',
    author: {
      name: 'Sarah Williams',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      verified: true,
      timeAgo: '8h ago'
    },
    content: "What's everyone's prediction for the upcoming T20 World Cup? I think India has the strongest squad this year!",
    image: 'https://images.pexels.com/photos/163452/cricket-cricket-player-batting-ball-163452.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    likes: '4.2K',
    comments: '521',
    shares: '203'
  },
  {
    id: '5',
    author: {
      name: 'Rajesh Kumar',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      verified: true,
      timeAgo: '12h ago'
    },
    content: "Best cricket stadiums in the world? My pick is MCG, followed by Lords and Eden Gardens. What's yours?",
    image: 'https://images.pexels.com/photos/69773/cricket-children-playing-park-69773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    likes: '5.7K',
    comments: '678',
    shares: '345'
  }
];

const additionalPosts: Post[] = [
  {
    id: '6',
    author: {
      name: 'Amit Patel',
      avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
      verified: true,
      timeAgo: '1d ago'
    },
    content: "Anyone following the Women's Cricket League? Some absolutely stunning performances this season!",
    image: 'https://images.pexels.com/photos/3755761/pexels-photo-3755761.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    likes: '6.1K',
    comments: '892',
    shares: '445'
  },
  {
    id: '7',
    author: {
      name: 'Meera Shah',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      verified: false,
      timeAgo: '1d ago'
    },
    content: "Just bought tickets for the India vs. Australia series. Can't wait to witness this epic rivalry live!",
    image: 'https://images.pexels.com/photos/411207/pexels-photo-411207.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    likes: '8.3K',
    comments: '1.2K',
    shares: '678'
  },
  {
    id: '8',
    author: {
      name: 'Karthik Rajan',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      verified: true,
      timeAgo: '2d ago'
    },
    content: "Top 5 cricket moments that gave you goosebumps? Mine would start with Dhoni's World Cup winning six!",
    image: 'https://images.pexels.com/photos/3621613/pexels-photo-3621613.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    likes: '4.5K',
    comments: '567',
    shares: '234'
  },
  {
    id: '9',
    author: {
      name: 'Neha Sharma',
      avatar: 'https://randomuser.me/api/portraits/women/48.jpg',
      verified: true,
      timeAgo: '2d ago'
    },
    content: "The evolution of cricket gear over the decades is fascinating. From minimal protection to high-tech equipment!",
    image: 'https://images.pexels.com/photos/1432039/pexels-photo-1432039.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    likes: '7.2K',
    comments: '934',
    shares: '512'
  },
  {
    id: '10',
    author: {
      name: 'Rohan Kapoor',
      avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
      verified: false,
      timeAgo: '3d ago'
    },
    content: "Best cricket commentary moments? Tony Greig's 'They're dancing in the aisles in Sharjah' is my absolute favorite!",
    image: 'https://images.pexels.com/photos/4667954/pexels-photo-4667954.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    likes: '5.9K',
    comments: '723',
    shares: '389'
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
  const [_commentText, _setCommentText] = useState('');
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [countdown, setCountdown] = useState({
    hours: 2,
    minutes: 45,
    seconds: 0
  });
  
  // Create a simpler image cache tracking
  const [_cachedImages, setCachedImages] = useState<{[key: string]: boolean}>({});
  const cachedImagesRef = React.useRef<{[key: string]: boolean}>({});
  
  // Simpler preload approach - just mark images as loaded
  useEffect(() => {
    const imagesToCache = posts.map(post => post.image);
    
    // Avoid multiple fetches by marking them as cached
    const newCachedState = {...cachedImagesRef.current};
    imagesToCache.forEach(img => {
      newCachedState[img] = true;
    });
    
    cachedImagesRef.current = newCachedState;
    setCachedImages(newCachedState);
  }, [posts]); // Only depend on posts, not on cachedImages
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prevTime => {
        let { hours, minutes, seconds } = prevTime;
        
        if (seconds > 0) {
          seconds -= 1;
        } else {
          if (minutes > 0) {
            minutes -= 1;
            seconds = 59;
          } else {
            if (hours > 0) {
              hours -= 1;
              minutes = 59;
              seconds = 59;
            } else {
              clearInterval(timer);
            }
          }
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatCountdown = useCallback(() => {
    const { hours, minutes, seconds } = countdown;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }, [countdown]);
  
  const tabs = ['posts', 'about', 'members', 'media'];
  
  const handleBack = () => {
    navigation.goBack();
  };
  
  const handlePollClick = useCallback(() => {
    // Use a more appropriate method to navigate without type errors
    const params = {
      groupId: route.params?.groupId || '1',
      groupName: groupDetails.name,
      debateTopic: pollData.title,
      debateType: 'vs'
    };
    
    // @ts-ignore - Ignoring type check for navigation to allow for mixed navigation structure
    navigation.navigate('DynamicGroupScreen', params);
  }, [navigation, route.params?.groupId]);
  
  const loadMorePosts = useCallback(() => {
    if (loading) return;
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Check if we already loaded additional posts to prevent duplication
      if (posts.length <= initialPosts.length) {
        setPosts(currentPosts => [...currentPosts, ...additionalPosts]);
      }
      setLoading(false);
    }, 1500);
  }, [loading, posts.length]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh - reset to initial posts only
    setTimeout(() => {
      setPosts([...initialPosts]);
      setRefreshing(false);
    }, 1500);
  }, []);

  // Create separate component for post item to use useState inside
  const PostItem = React.memo(({ item, index }: { item: Post; index: number }) => {
    // Simplified loading state - just loading, no animations
    const [isLoading, setIsLoading] = useState(false);
    
    // Get static image fallback for unreliable images
    const getImageSource = () => {
      if (index === 3) {
        return {uri: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'};
      }
      if (index === 4) {
        return {uri: 'https://images.pexels.com/photos/3628914/pexels-photo-3628914.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'};
      }
      return {uri: item.image};
    };
    
    return (
      <View style={[
        styles.postContainer, 
        index % 2 === 0 && styles.evenPost
      ]}>
        <View style={styles.postHeader}>
          <View style={styles.postHeaderLeft}>
            <Image 
              source={{ uri: item.author.avatar }} 
              style={styles.postAvatar} 
              defaultSource={require('../assets/icons/profile.png')}
            />
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
            <MaterialIcons name="more-vert" size={20} color="#262626" />
          </TouchableOpacity>
        </View>

        <View style={styles.postImageContainer}>
          <Image 
            source={getImageSource()} 
            style={styles.postImage}
            resizeMode="cover"
            onLoadStart={() => setIsLoading(true)}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
          {isLoading && (
            <View style={styles.imageLoading}>
              <ActivityIndicator color="#3F51B5" size="small" />
            </View>
          )}
        </View>

        <View style={styles.postActions}>
          <View style={styles.postActionsLeft}>
            <TouchableOpacity style={styles.postAction}>
              <MaterialIcons name="favorite-border" size={24} color="#262626" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.postAction}>
              <MaterialIcons name="chat-bubble-outline" size={22} color="#262626" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.postAction}>
              <MaterialIcons name="send" size={22} color="#262626" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.postAction}>
            <MaterialIcons name="bookmark-border" size={24} color="#262626" />
          </TouchableOpacity>
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
  });
  
  // Simple render function that doesn't need useCallback
  const renderPost = ({ item, index }: ListRenderItemInfo<Post>) => {
    return <PostItem item={item} index={index} />;
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

      {/* Tab navigation - outside scrollable content */}
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

      {/* Main content area */}
      <View style={styles.mainContainer}>
        {/* Render the "Posts" tab with FlatList */}
        {activeTab === 'posts' && (
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
            removeClippedSubviews={true}
            maxToRenderPerBatch={5}
            windowSize={10}
            contentContainerStyle={styles.flatListContent}
            ListHeaderComponent={() => (
              <View style={styles.hotDebateContainer}>
                <View style={styles.debateCardContainer}>
                  {/* Top row with tags */}
                  <View style={styles.debateCardTopRow}>
                    <View style={styles.debateCardBadge}>
                      <Text style={styles.debateCardBadgeText}>HOT DEBATE</Text>
                    </View>
                    <View style={styles.liveCountBadge}>
                      <View style={styles.liveIndicator} />
                      <Text style={styles.liveCountText}>1.2K LIVE</Text>
                    </View>
                  </View>
                  
                  {/* Title section */}
                  <Text style={styles.debateCardTitle}>
                    Cricket GOAT Debate: Virat Kohli vs MS Dhoni
                  </Text>
                  
                  {/* Image with timer overlay */}
                  <View style={styles.imageContainer}>
                    <Image 
                      source={{uri: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'}} 
                      style={styles.debateImage}
                      resizeMode="cover"
                      defaultSource={require('../assets/icons/placeholder.png')}
                    />
                    <View style={styles.timerContainer}>
                      <LinearGradient
                        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.6)']}
                        style={styles.timerGradient}
                      >
                        <MaterialIcons name="timer" size={14} color="#FFFFFF" />
                        <Text style={styles.timerText}>Closes in {formatCountdown()}</Text>
                      </LinearGradient>
                    </View>
                  </View>
                  
                  {/* Vote cards row */}
                  <View style={styles.voteCardsContainer}>
                    <TouchableOpacity style={styles.voteCard} onPress={() => console.log('Voted for Kohli')}>
                      <View style={styles.voteCardTop}>
                        <Image 
                          source={{uri: 'https://randomuser.me/api/portraits/men/32.jpg'}} 
                          style={styles.playerAvatar}
                          defaultSource={require('../assets/icons/profile.png')}
                        />
                        <Text style={styles.playerName}>Virat Kohli</Text>
                      </View>
                      <View style={styles.voteProgressContainer}>
                        <LinearGradient
                          colors={['#00B0FF', '#2979FF']}
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 0}}
                          style={[styles.voteProgressBar, {width: '52%'}]}
                        />
                      </View>
                      <Text style={styles.votePercentage}>52% · 48.2K votes</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.voteCard} onPress={() => console.log('Voted for Dhoni')}>
                      <View style={styles.voteCardTop}>
                        <Image 
                          source={{uri: 'https://randomuser.me/api/portraits/men/45.jpg'}} 
                          style={styles.playerAvatar}
                          defaultSource={require('../assets/icons/profile.png')}
                        />
                        <Text style={styles.playerName}>MS Dhoni</Text>
                      </View>
                      <View style={styles.voteProgressContainer}>
                        <LinearGradient
                          colors={['#FF4081', '#F50057']}
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 0}}
                          style={[styles.voteProgressBar, {width: '48%'}]}
                        />
                      </View>
                      <Text style={styles.votePercentage}>48% · 45.8K votes</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {/* Engagement row */}
                  <View style={styles.engagementRow}>
                    <View style={styles.debateStats}>
                      <TouchableOpacity style={styles.statButton}>
                        <MaterialIcons name="favorite-border" size={24} color="#FFFFFF" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.statButton}>
                        <MaterialIcons name="chat-bubble-outline" size={22} color="#FFFFFF" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.statButton}>
                        <MaterialIcons name="share" size={22} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.joinButton} onPress={handlePollClick}>
                      <LinearGradient
                        colors={['#FF6D00', '#FF3D00']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={styles.joinButtonGradient}
                      >
                        <Text style={styles.joinButtonText}>Join Debate</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                  
                  {/* Stats row */}
                  <View style={styles.statsRow}>
                    <Text style={styles.statsText}>15.7K participants • 2.1K comments</Text>
                    <Text style={styles.timeText}>2h ago</Text>
                  </View>
                </View>
              </View>
            )}
            ListFooterComponent={() => (
              loading ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="#1A1B35" />
                </View>
              ) : null
            )}
          />
        )}
        
        {/* Render "About" tab with ScrollView */}
        {activeTab === 'about' && (
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
        )}
        
        {/* Render "Members" tab with ScrollView */}
        {activeTab === 'members' && (
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
        )}
        
        {/* Render "Media" tab with ScrollView */}
        {activeTab === 'media' && (
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
        )}
      </View>
      
      {/* Bottom Navigation is provided by the Tab.Navigator in AppNavigator */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },
  headerContainer: {
    backgroundColor: '#1A1B35',
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Platform.OS === 'ios' ? 88 : 70 + (StatusBar.currentHeight || 0),
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
  scrollContainer: {
    flex: 1,
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
    position: 'relative',
  },
  activeTab: {
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  tabText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
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
  mainContent: {
    flex: 1,
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
  postContainer: {
    backgroundColor: 'white',
    marginBottom: 12,
    marginHorizontal: 0,
    width: width,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  postHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postHeaderInfo: {
    marginLeft: 8,
  },
  postAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  postAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAuthorName: {
    fontSize: 13,
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
    fontSize: 11,
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
  postImageContainer: {
    width: width,
    height: width,
    backgroundColor: '#FAFAFA',
    position: 'relative',
  },
  imageLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 250, 250, 0.7)',
  },
  postImage: {
    width: width,
    height: width,
    backgroundColor: '#FAFAFA',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  postActionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAction: {
    marginRight: 14,
  },
  actionIcon: {
    width: 24,
    height: 24,
    tintColor: '#262626',
  },
  postEngagement: {
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  likesText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#262626',
  },
  postCaption: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  captionText: {
    fontSize: 13,
    color: '#262626',
    lineHeight: 18,
  },
  captionUsername: {
    fontWeight: '600',
  },
  commentsButton: {
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  commentsText: {
    fontSize: 13,
    color: '#8E8E8E',
  },
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
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
  hotDebateContainer: {
    width: width,
    marginBottom: 16,
    backgroundColor: '#303F9F',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  debateCardContainer: {
    width: width,
    backgroundColor: '#3F51B5',
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#5C6BC0',
    borderRadius: 0,
    overflow: 'hidden',
  },
  debateCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#3F51B5',
  },
  debateCardBadge: {
    backgroundColor: '#FFC107',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  debateCardBadgeText: {
    color: '#212121',
    fontWeight: 'bold',
    fontSize: 11,
    letterSpacing: 0.3,
  },
  liveCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F44336',
    marginRight: 4,
  },
  liveCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  debateCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  imageContainer: {
    width: width,
    height: 240,
    position: 'relative',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderColor: '#EFEFEF',
    backgroundColor: '#000',
  },
  debateImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.9,
  },
  timerContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  timerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: '100%',
    height: '100%',
  },
  timerText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  vsOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 40,
    height: 40,
    marginLeft: -20,
    marginTop: -20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  vsText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1B35',
  },
  voteCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#3F51B5',
  },
  voteCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  voteCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  playerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  playerName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  voteProgressContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 4,
    marginBottom: 6,
    overflow: 'hidden',
  },
  voteProgressBar: {
    height: '100%',
    borderRadius: 5,
  },
  votePercentage: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  engagementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#5C6BC0',
    borderBottomWidth: 1,
    borderBottomColor: '#5C6BC0',
    backgroundColor: '#3F51B5',
  },
  debateStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statButton: {
    marginRight: 16,
  },
  joinButton: {
    borderRadius: 6,
    overflow: 'hidden',
  },
  joinButtonGradient: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: '#3F51B5',
  },
  statsText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  timeText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  evenPost: {
    backgroundColor: '#FCFCFC',
  },
  flatListContent: {
    paddingBottom: 20,
    paddingTop: 0,
  },
  postsContainer: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
});

export default GroupScreen; 
