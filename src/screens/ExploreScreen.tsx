import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image,
  FlatList,
  StatusBar,
  Platform,
  Dimensions,
  Keyboard
} from 'react-native';
import { colors, typography, spacing } from '../utils/theme';
import { useNavigation, useRoute } from '@react-navigation/native';

// Category data
const categories = [
  { id: '1', name: 'Trending', color: '#4E50F4', icon: '📈' },
  { id: '2', name: 'Viral', color: '#FF4081', icon: '🔥' },
  { id: '3', name: 'Memes', color: '#FF9800', icon: '😂' },
  { id: '4', name: 'Movies', color: '#607D8B', icon: '🎬' },
  { id: '5', name: 'Gaming', color: '#9C27B0', icon: '🎮' },
  { id: '6', name: 'Sports', color: '#2196F3', icon: '🏀' },
  { id: '7', name: 'Tech', color: '#009688', icon: '💻' },
  { id: '8', name: 'Music', color: '#9C27B0', icon: '🎵' },
];

// Trending topics data
const trendingTopics = [
  { 
    id: '1', 
    title: 'Virat Kohli vs MS Dhoni - The GOAT Debate', 
    category: 'Sports',
    image: 'https://source.unsplash.com/random/300x200/?cricket', 
    likes: '15.2K', 
    comments: '2.1K',
    tag: 'Join'
  },
  { 
    id: '2', 
    title: 'AI Will Take Over? Tech Talks', 
    category: 'Technology',
    image: 'https://source.unsplash.com/random/300x200/?ai', 
    likes: '8.7K', 
    comments: '1.5K',
    tag: 'Join'
  },
  { 
    id: '3', 
    title: 'Cricket GOAT Debate 🏏', 
    subtitle: 'Virat vs Dhoni - Who\'s the real GOAT?',
    image: 'https://source.unsplash.com/random/300x200/?cricket-players', 
    likes: '15.7K', 
    comments: '2.1K',
    tag: 'Hot'
  },
  { 
    id: '4', 
    title: 'AI Revolution 🤖', 
    subtitle: 'The future of AI and its impact on society',
    image: 'https://source.unsplash.com/random/300x200/?robot', 
    likes: '9.5K', 
    comments: '956',
    tag: 'Trending'
  },
  { 
    id: '5', 
    title: 'Latest Fashion Trends 2023 👗', 
    subtitle: 'What\'s hot and what\'s not this season',
    image: 'https://source.unsplash.com/random/300x200/?fashion', 
    likes: '11.2K', 
    comments: '1.3K',
    tag: 'Hot'
  },
  { 
    id: '6', 
    title: 'Climate Change Solutions 🌍', 
    subtitle: 'Innovative approaches to save our planet',
    image: 'https://source.unsplash.com/random/300x200/?climate', 
    likes: '7.8K', 
    comments: '834',
    tag: 'Important'
  },
  { 
    id: '7', 
    title: 'Cryptocurrency: Bubble or Future? 💰', 
    subtitle: 'Experts debate the long-term viability of crypto',
    image: 'https://source.unsplash.com/random/300x200/?cryptocurrency', 
    likes: '12.4K', 
    comments: '1.7K',
    tag: 'Trending'
  },
  { 
    id: '8', 
    title: 'Mental Health Awareness 🧠', 
    subtitle: 'Breaking stigmas and promoting wellbeing',
    image: 'https://source.unsplash.com/random/300x200/?meditation', 
    likes: '14.9K', 
    comments: '2.3K',
    tag: 'Essential'
  },
];

// Add more diverse trending topics
const diverseTrendingPosts = [
  { 
    id: '1', 
    title: 'Latest Gadgets of 2023', 
    category: 'Tech',
    image: 'https://source.unsplash.com/random/300x200/?gadgets', 
    likes: '12.5K', 
    comments: '1.8K',
    tag: 'New'
  },
  { 
    id: '2', 
    title: 'Remote Work Tips & Tricks', 
    category: 'Work',
    image: 'https://source.unsplash.com/random/300x200/?workspace', 
    likes: '9.3K', 
    comments: '1.2K',
    tag: 'Useful'
  },
  { 
    id: '3', 
    title: 'Healthy Meal Prep Ideas', 
    category: 'Food',
    image: 'https://source.unsplash.com/random/300x200/?healthy-food', 
    likes: '18.7K', 
    comments: '2.9K',
    tag: 'Trending'
  },
  { 
    id: '4', 
    title: 'Future of Electric Vehicles', 
    category: 'Automotive',
    image: 'https://source.unsplash.com/random/300x200/?electric-car', 
    likes: '10.1K', 
    comments: '1.5K',
    tag: 'Hot'
  },
  { 
    id: '5', 
    title: 'Travel Destinations 2023', 
    category: 'Travel',
    image: 'https://source.unsplash.com/random/300x200/?travel-destination', 
    likes: '22.4K', 
    comments: '3.2K',
    tag: 'Popular'
  },
];

// Recommended groups data
const recommendedGroups = [
  {
    id: '1',
    name: 'Startup Founders Hub',
    category: 'Tech',
    description: 'Connect with fellow entrepreneurs and share your startup journey',
    members: '5.2K',
    posts: '12K posts today'
  },
  {
    id: '2',
    name: 'Home Workout Warriors',
    category: 'Fitness',
    description: 'Share tips, routines, and progress for home fitness enthusiasts',
    members: '3.8K',
    posts: '850 posts today'
  },
  {
    id: '3',
    name: 'Startup Hub',
    category: 'Tech & innovation',
    description: 'Connect with founders, share ideas, and grow together',
    members: '5.2K',
    posts: 'Very active'
  },
  {
    id: '4',
    name: 'Sustainable Living',
    category: 'Lifestyle',
    description: 'Tips and discussions about eco-friendly lifestyle',
    members: '3.8K',
    posts: 'Active'
  }
];

// Content creators data
const contentCreators = [
  {
    id: '1',
    name: 'John Smith',
    username: '@johnsmith',
    avatar: 'https://source.unsplash.com/random/100x100/?portrait,man',
    followers: '1.2M',
    category: 'Tech',
    verified: true
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    username: '@sarahcreates',
    avatar: 'https://source.unsplash.com/random/100x100/?portrait,woman',
    followers: '456K',
    category: 'Lifestyle',
    verified: true
  },
  {
    id: '3',
    name: 'Mike Chen',
    username: '@miketech',
    avatar: 'https://source.unsplash.com/random/100x100/?portrait,asian',
    followers: '890K',
    category: 'Gaming',
    verified: false
  },
  {
    id: '4',
    name: 'Jessica Lee',
    username: '@jesslee',
    avatar: 'https://source.unsplash.com/random/100x100/?portrait,girl',
    followers: '2.5M',
    category: 'Fashion',
    verified: true
  }
];

// For You content data
const forYouContent = [
  {
    id: '1',
    type: 'post',
    title: 'The Rise of AI in Healthcare',
    content: 'Artificial intelligence is transforming healthcare delivery and patient outcomes.',
    image: 'https://source.unsplash.com/random/300x200/?healthcare,technology',
    author: {
      name: 'Dr. Alex Johnson',
      avatar: 'https://source.unsplash.com/random/100x100/?doctor',
      verified: true
    },
    likes: '3.4K',
    comments: '286',
    time: '2h ago'
  },
  {
    id: '2',
    type: 'question',
    question: 'What programming language should I learn in 2023?',
    answers: '24 answers',
    topAnswer: 'It depends on your goals. For web development, JavaScript/TypeScript is essential. For data science, Python is dominant...',
    tags: ['Programming', 'Career Advice', 'Tech'],
    image: 'https://source.unsplash.com/random/300x200/?programming,code',
    time: '4h ago'
  }
];

const { width } = Dimensions.get('window');

const ExploreScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [activeCategory, setActiveCategory] = useState('1');
  const [searchText, setSearchText] = useState('');
  const searchInputRef = useRef<TextInput>(null);
  
  // Check if we should auto-focus the search input
  useEffect(() => {
    if (route.params?.focusSearch) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300); // Small delay to ensure component is fully mounted
    }
  }, [route.params?.focusSearch]);

  const handleGroupPress = () => {
    navigation.navigate('GroupScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Extra padding to fix header positioning */}
        <View style={styles.headerSpacer} />

        <View style={styles.header}>
          <Text style={styles.title}>Explore</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Image source={require('../assets/icons/search.png')} style={styles.searchIcon} />
            <TextInput 
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Search groups & topics"
              placeholderTextColor="#888"
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearButton}>
                <View style={styles.clearButtonInner}>
                  <Text style={styles.clearButtonText}>✕</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Image source={require('../assets/icons/shuffle.png')} style={styles.filterIcon} />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
              <TouchableOpacity 
                style={[
                  styles.categoryItem, 
                  {backgroundColor: item.color},
                  activeCategory === item.id && styles.activeCategoryItem
                ]}
                activeOpacity={0.8}
                onPress={() => setActiveCategory(item.id)}
              >
                <Text style={styles.categoryIcon}>{item.icon}</Text>
                <Text style={styles.categoryName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Trending Now section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Trending Now</Text>
              <View style={styles.fireIcon}>
                <Text>🔥</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {/* Trending Cards - Horizontal Slider */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingCardsSliderContainer}
            decelerationRate="fast"
            snapToInterval={(width - 96) / 2 + 12}
          >
            {[...trendingTopics, ...diverseTrendingPosts].slice(0, 8).map((item, index) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.trendingSliderCard} 
                activeOpacity={0.9}
                onPress={handleGroupPress}
              >
                <Image source={{uri: item.image}} style={styles.trendingSliderCardImage} />
                <View style={styles.trendingCardOverlay}>
                  <View style={styles.categoryTag}>
                    <Text style={styles.categoryTagText}>{item.category || 'Topic'}</Text>
                  </View>
                </View>
                <View style={styles.trendingSliderCardContent}>
                  <Text style={styles.trendingSliderCardTitle} numberOfLines={2}>{item.title}</Text>
                  <View style={styles.trendingCardStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.cardStatIcon}>👥</Text>
                      <Text style={styles.cardStatText}>{item.likes}</Text>
                    </View>
                    <TouchableOpacity style={styles.joinButton}>
                      <Text style={styles.joinButtonText}>Join</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Vertical Full-Size Cards */}
          <View style={styles.verticalCardsContainer}>
            {[...trendingTopics, ...diverseTrendingPosts].slice(2, 6).map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.fullSizeCard} 
                activeOpacity={0.9}
                onPress={handleGroupPress}
              >
                <Image source={{uri: item.image}} style={styles.fullSizeCardImage} />
                <View style={styles.fullSizeCardOverlay}>
                  <View style={styles.topicTagsContainer}>
                    <View style={styles.categoryTag}>
                      <Text style={styles.categoryTagText}>{item.category || 'Topic'}</Text>
                    </View>
                    <View style={styles.liveUserTag}>
                      <Text style={styles.liveUserTagText}>🔴 {Math.floor(Math.random() * 800) + 200} live</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.fullSizeCardContent}>
                  <Text style={styles.fullSizeCardTitle} numberOfLines={2}>{item.title}</Text>
                  {item.subtitle && (
                    <Text style={styles.fullSizeCardSubtitle} numberOfLines={2}>{item.subtitle}</Text>
                  )}
                  <View style={styles.fullSizeCardStats}>
                    <View style={styles.statsGroup}>
                      <View style={styles.statItem}>
                        <Text style={styles.cardStatIcon}>👥</Text>
                        <Text style={styles.cardStatText}>{item.likes}</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.cardStatIcon}>💬</Text>
                        <Text style={styles.cardStatText}>{item.comments}</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.fullSizeJoinButton}>
                      <Text style={styles.fullSizeJoinButtonText}>Join Discussion</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            
            {/* Load More Button */}
            <TouchableOpacity style={styles.loadMoreButton} activeOpacity={0.8}>
              <Text style={styles.loadMoreText}>Load More</Text>
            </TouchableOpacity>
          </View>

          {/* Hot Topics Section */}
          <View style={styles.hotTopicsSection}>
            <Text style={styles.hotTopicsHeader}>Hot Topics</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hotTopicsContainer}
            >
              {trendingTopics.slice(4).map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.hotTopicItem} 
                  activeOpacity={0.9}
                  onPress={handleGroupPress}
                >
                  <Image source={{uri: item.image}} style={styles.hotTopicImage} />
                  <View style={styles.hotTopicOverlay}>
                    <View style={styles.hotTopicTagContainer}>
                      <Text style={styles.hotTopicTagText}>{item.tag}</Text>
                    </View>
                    <Text style={styles.hotTopicTitle} numberOfLines={2}>{item.title}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* For You section - improved layout */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>For You</Text>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>🎯</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.refreshButton}>
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
          
          {/* First card - post type */}
          <TouchableOpacity 
            style={styles.forYouCard} 
            activeOpacity={0.8}
            onPress={handleGroupPress}
          >
            <View>
              {/* Author Info Row */}
              <View style={styles.forYouAuthorRow}>
                <Image 
                  source={{uri: forYouContent[0].author.avatar}} 
                  style={styles.forYouAuthorAvatar} 
                />
                <View style={styles.forYouAuthorInfo}>
                  <View style={styles.authorNameRow}>
                    <Text style={styles.forYouAuthorName}>{forYouContent[0].author.name}</Text>
                    {forYouContent[0].author.verified && (
                      <View style={styles.smallVerifiedBadge}>
                        <Text style={styles.smallVerifiedText}>✓</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.forYouPostTime}>{forYouContent[0].time}</Text>
                </View>
              </View>
              
              {/* Post Image */}
              <Image 
                source={{uri: forYouContent[0].image}} 
                style={styles.forYouPostImage} 
              />
              
              {/* Post Title */}
              <Text style={styles.forYouPostTitle}>{forYouContent[0].title}</Text>
              
              {/* Action Buttons */}
              <View style={styles.forYouActionBar}>
                <View style={styles.forYouActions}>
                  <View style={styles.forYouAction}>
                    <Text style={styles.forYouActionIcon}>❤️</Text>
                    <Text style={styles.forYouActionText}>{forYouContent[0].likes}</Text>
                  </View>
                  <View style={styles.forYouAction}>
                    <Text style={styles.forYouActionIcon}>💬</Text>
                    <Text style={styles.forYouActionText}>{forYouContent[0].comments}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.forYouShareButton}>
                  <Text style={styles.forYouShareText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
          
          {/* Second card - question type */}
          <TouchableOpacity 
            style={styles.forYouCard} 
            activeOpacity={0.8}
            onPress={handleGroupPress}
          >
            <View>
              {/* Question Header */}
              <View style={styles.questionHeader}>
                <View style={styles.questionBadge}>
                  <Text style={styles.questionBadgeText}>Q</Text>
                </View>
                <Text style={styles.questionPostedTime}>{forYouContent[1].time}</Text>
              </View>
              
              {/* Question Image */}
              <Image 
                source={{uri: forYouContent[1].image}} 
                style={styles.questionImage} 
              />
              
              {/* Question Title */}
              <Text style={styles.questionTitle}>{forYouContent[1].question}</Text>
              
              {/* Answer Button */}
              <TouchableOpacity style={styles.answerButtonContainer}>
                <Text style={styles.answerButtonText}>Answer this question</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        {/* Discover Creators */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Discover Creators</Text>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>✨</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.creatorsScrollContent}
          >
            {contentCreators.map(creator => (
              <TouchableOpacity 
                key={creator.id} 
                style={styles.creatorCard} 
                activeOpacity={0.9}
                onPress={handleGroupPress}
              >
                <View style={styles.creatorAvatarContainer}>
                  <Image source={{uri: creator.avatar}} style={styles.creatorAvatar} />
                  {creator.verified && (
                    <View style={styles.verifiedBadge}>
                      <Text style={styles.verifiedText}>✓</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.creatorName} numberOfLines={1}>{creator.name}</Text>
                <Text style={styles.creatorUsername} numberOfLines={1}>{creator.username}</Text>
                <Text style={styles.creatorCategory}>{creator.category}</Text>
                <View style={styles.creatorStats}>
                  <Text style={styles.creatorFollowers}>{creator.followers} followers</Text>
                </View>
                <TouchableOpacity style={styles.followButton}>
                  <Text style={styles.followButtonText}>Follow</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recommended Groups */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Recommended Groups</Text>
            </View>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {/* Group items */}
          {recommendedGroups.map((group, index) => (
            <TouchableOpacity 
              key={group.id} 
              style={styles.groupItem} 
              activeOpacity={0.8}
              onPress={handleGroupPress}
            >
              <View style={styles.groupLeftSection}>
                <View style={[
                  styles.groupIcon, 
                  group.category === 'Tech' ? styles.techIcon : 
                  group.category === 'Fitness' ? styles.fitnessIcon :
                  group.category === 'Tech & innovation' ? styles.purpleIcon :
                  styles.greenIcon
                ]}>
                  <Text style={styles.groupIconText}>
                    {group.category === 'Tech' ? '💻' : 
                     group.category === 'Fitness' ? '💪' :
                     group.category === 'Tech & innovation' ? '🚀' :
                     '🌿'}
                  </Text>
                </View>
                <View style={styles.groupDetails}>
                  <View style={styles.groupTitleRow}>
                    <Text style={styles.groupName} numberOfLines={1}>{group.name}</Text>
                    <TouchableOpacity style={styles.joinGroupButton} activeOpacity={0.8}>
                      <Text style={styles.joinGroupText}>Join</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.groupCategory}>{group.category}</Text>
                  <Text style={styles.groupDescription} numberOfLines={2}>{group.description}</Text>
                  <View style={styles.groupStats}>
                    <View style={styles.groupStatItem}>
                      <Text style={styles.groupStatIcon}>👥</Text>
                      <Text style={styles.groupStatText}>{group.members} members</Text>
                    </View>
                    <View style={styles.groupStatItem}>
                      <Text style={styles.groupStatIcon}>💬</Text>
                      <Text style={styles.groupStatText}>{group.posts}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Bottom Space */}
        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Bottom Navigation Hint */}
      <View style={styles.navHint}>
        <View style={styles.navPill} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContainer: {
    flex: 1,
  },
  headerSpacer: {
    height: Platform.OS === 'ios' ? 15 : 18,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 30,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    width: 18,
    height: 18,
    tintColor: '#888',
    marginRight: 10,
    marginLeft: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: 44,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 6,
  },
  clearButtonInner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
    lineHeight: 16,
  },
  filterButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  filterIcon: {
    width: 24,
    height: 24,
    tintColor: '#555',
  },
  categoriesContainer: {
    marginBottom: 25,
    paddingLeft: 16,
  },
  categoryItem: {
    width: 90,
    height: 36,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeCategoryItem: {
    borderWidth: 2,
    borderColor: 'white',
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 4,
    color: 'white',
  },
  categoryName: {
    fontSize: 13,
    color: 'white',
    fontWeight: '500',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  fireIcon: {
    marginLeft: 6,
  },
  seeAllButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  trendingCardsSliderContainer: {
    paddingLeft: 16,
    paddingRight: 4,
    paddingBottom: 12,
  },
  trendingSliderCard: {
    width: (width - 96) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    height: 200,
  },
  trendingSliderCardImage: {
    width: '100%',
    height: 110,
  },
  trendingSliderCardContent: {
    padding: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
  trendingSliderCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
    lineHeight: 18,
  },
  trendingCardOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  trendingCardStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  joinButton: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  verticalCardsContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  fullSizeCard: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  fullSizeCardImage: {
    width: '100%',
    height: 180,
  },
  fullSizeCardOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
  },
  topicTagsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  liveUserTag: {
    backgroundColor: 'rgba(255, 55, 55, 0.85)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  liveUserTagText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  fullSizeCardContent: {
    padding: 16,
  },
  fullSizeCardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    lineHeight: 22,
  },
  fullSizeCardSubtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
    lineHeight: 20,
  },
  fullSizeCardStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statsGroup: {
    flexDirection: 'row',
  },
  loadMoreButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  loadMoreText: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '600',
  },
  hotTopicsSection: {
    marginTop: 20,
    marginBottom: 10,
  },
  hotTopicsHeader: {
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 12,
    color: '#333',
  },
  hotTopicsContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  hotTopicItem: {
    width: 150,
    height: 110,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
  },
  hotTopicImage: {
    width: '100%',
    height: '100%',
  },
  hotTopicOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 10,
    justifyContent: 'space-between',
  },
  hotTopicTagContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  hotTopicTagText: {
    fontSize: 11,
    color: 'white',
    fontWeight: '600',
  },
  hotTopicTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 18,
  },
  forYouAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  forYouAuthorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  forYouAuthorInfo: {
    flex: 1,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forYouAuthorName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginRight: 4,
  },
  forYouPostTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  forYouPostTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    lineHeight: 22,
  },
  forYouPostImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  forYouActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  forYouActions: {
    flexDirection: 'row',
  },
  forYouAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  forYouActionIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  forYouActionText: {
    color: '#666',
    fontSize: 14,
  },
  forYouShareButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  forYouShareText: {
    color: '#555',
    fontSize: 13,
    fontWeight: '500',
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionPostedTime: {
    fontSize: 12,
    color: '#888',
    marginLeft: 'auto',
  },
  questionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    lineHeight: 24,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  questionTag: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 6,
  },
  questionTagText: {
    fontSize: 12,
    color: '#555',
  },
  questionImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
  },
  answerButtonContainer: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  answerButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  refreshButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  refreshButtonText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  groupItem: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  groupLeftSection: {
    flexDirection: 'row',
  },
  groupIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  techIcon: {
    backgroundColor: '#E3F2FD',
  },
  fitnessIcon: {
    backgroundColor: '#E8F5E9',
  },
  purpleIcon: {
    backgroundColor: '#EDE7F6',
  },
  greenIcon: {
    backgroundColor: '#E0F2F1',
  },
  groupIconText: {
    fontSize: 20,
  },
  groupDetails: {
    flex: 1,
  },
  groupTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    width: '70%',
  },
  joinGroupButton: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  joinGroupText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  groupCategory: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  groupDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    lineHeight: 20,
  },
  groupStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  groupStatIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  groupStatText: {
    fontSize: 12,
    color: '#888',
  },
  bottomSpace: {
    height: 80,
  },
  creatorsScrollContent: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  creatorCard: {
    width: 150,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  creatorAvatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  creatorAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  verifiedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  creatorName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
    textAlign: 'center',
  },
  creatorUsername: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    textAlign: 'center',
  },
  creatorCategory: {
    fontSize: 12,
    color: '#888',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 8,
  },
  creatorStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  creatorFollowers: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  followButton: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  followButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  sectionBadge: {
    marginLeft: 6,
  },
  sectionBadgeText: {
    fontSize: 16,
  },
  cardStatIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  cardStatText: {
    color: '#666',
    fontSize: 13,
  },
  categoryTag: {
    backgroundColor: colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  categoryTagText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  fullSizeJoinButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  fullSizeJoinButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  navHint: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 8,
  },
  navPill: {
    width: 40,
    height: 5,
    backgroundColor: '#DDD',
    borderRadius: 3,
  },
  smallVerifiedBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallVerifiedText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  questionBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF5722',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  questionBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  forYouCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
});

export default ExploreScreen; 