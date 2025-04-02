import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Animated,
  ScrollView,
  Dimensions,
  StatusBar,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { colors } from '../utils/theme';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

// Icons
const searchIcon = require('../assets/icons/search.png');
const filterIcon = require('../assets/icons/more.png');

// Banner images for carousel
const BANNER_IMAGES = [
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1542744173-05336fcc7ad4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1516382799247-87df95d790b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
];

// Define BlogPost interface
interface BlogPost {
  id: string;
  title: string;
  summary: string;
  author: string;
  authorAvatar: string;
  points: number;
  views: number;
  image: string;
  isAuthorVerified: boolean;
  category?: string;
}

// Blog post data
const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'How to Maximize Your Productivity',
    summary: 'Learn the best techniques to boost your daily productivity and achieve more...',
    author: 'John Doe',
    authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    points: 2,
    views: 1200,
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmxvZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    isAuthorVerified: true,
  },
  {
    id: '2',
    title: 'Digital Marketing Trends 2025',
    summary: 'Discover the latest trends that are shaping the future of digital marketing...',
    author: 'Sarah Smith',
    authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    points: 2,
    views: 956,
    image: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZGlnaXRhbCUyMG1hcmtldGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    isAuthorVerified: true,
  },
  {
    id: '3',
    title: 'Content Creation Mastery',
    summary: 'Master the art of creating engaging content for social media and beyond...',
    author: 'Michael Johnson',
    authorAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    points: 3,
    views: 845,
    image: 'https://images.unsplash.com/photo-1610552050890-fe99536c2615?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29udGVudCUyMGNyZWF0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    isAuthorVerified: false,
  },
  {
    id: '4',
    title: 'Photography Tips for Beginners',
    summary: 'Essential photography techniques everyone should know before picking up a camera...',
    author: 'Emma Lee',
    authorAvatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    points: 5,
    views: 1780,
    image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGhvdG9ncmFwaHl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    isAuthorVerified: true,
  },
  {
    id: '5',
    title: 'Financial Freedom in 2023',
    summary: "Practical steps to achieve financial independence in today's economy...",
    author: 'Robert Chen',
    authorAvatar: 'https://randomuser.me/api/portraits/men/62.jpg',
    points: 8,
    views: 2340,
    image: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmluYW5jaWFsfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    isAuthorVerified: true,
  },
  {
    id: '6',
    title: 'Mindfulness & Meditation',
    summary: 'How daily meditation can transform your mental health and productivity...',
    author: 'Sophia Garcia',
    authorAvatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    points: 4,
    views: 1456,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    isAuthorVerified: false,
  },
];

// Define Category interface
interface Category {
  id: string;
  name: string;
}

// Categories for filtering
const CATEGORIES: Category[] = [
  { id: 'all', name: 'All' },
  { id: 'productivity', name: 'Productivity' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'technology', name: 'Technology' },
  { id: 'design', name: 'Design' },
  { id: 'finance', name: 'Finance' },
  { id: 'health', name: 'Health & Wellness' },
  { id: 'career', name: 'Career' },
];

const { width } = Dimensions.get('window');

const BlogScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const bannerRef = useRef<FlatList>(null);
  const [userPoints] = useState(247);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    category: 'all',
    sortBy: 'latest',
    readTime: 'any',
  });

  // Auto scroll for banner
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (bannerRef.current && BANNER_IMAGES.length > 0) {
        const nextIndex = (activeBannerIndex + 1) % BANNER_IMAGES.length;
        bannerRef.current.scrollToOffset({
          offset: nextIndex * width,
          animated: true,
        });
        setActiveBannerIndex(nextIndex);
      }
    }, 5000); // Slightly longer interval for better user experience

    return () => clearInterval(interval);
  }, [activeBannerIndex, width]);

  // Handle banner scroll
  const handleBannerScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const onBannerItemChanged = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setActiveBannerIndex(index);
  };

  // Navigate to blog details
  const handleBlogPress = (blog: BlogPost) => {
    navigation.navigate('BlogDetailsScreen', { blog });
  };

  // Render blog banner carousel
  const renderBanner = () => {
    return (
      <View style={styles.bannerContainer}>
        <FlatList
          ref={bannerRef}
          data={BANNER_IMAGES}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              activeOpacity={0.9}
              style={styles.bannerItemContainer}
              onPress={() => handleBannerPress(index)}
            >
              <Image source={{ uri: item }} style={styles.bannerImage} />
              <View style={styles.bannerOverlay}>
                <View style={styles.bannerContent}>
                  <Text style={styles.bannerCategory}>
                    {index % 2 === 0 ? 'FEATURED' : 'TRENDING'}
                  </Text>
                  <Text style={styles.bannerTitle}>
                    {index % 5 === 0 ? 'CONTENT CREATION' : 
                     index % 5 === 1 ? 'PRODUCTIVITY TIPS' : 
                     index % 5 === 2 ? 'TECH TRENDS' : 
                     index % 5 === 3 ? 'DESIGN INSIGHTS' : 'CAREER GROWTH'}
                  </Text>
                  <View style={styles.bannerReadMore}>
                    <Text style={styles.bannerReadMoreText}>Read More</Text>
              </View>
            </View>
              </View>
            </TouchableOpacity>
          )}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleBannerScroll}
          onMomentumScrollEnd={onBannerItemChanged}
          keyExtractor={(_, index) => index.toString()}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          initialScrollIndex={0}
        />
        <View style={styles.dotsContainer}>
          {BANNER_IMAGES.map((_, index) => (
            <TouchableOpacity 
              key={index.toString()} 
              onPress={() => {
                if (bannerRef.current) {
                  bannerRef.current.scrollToOffset({
                    offset: index * width,
                    animated: true,
                  });
                  setActiveBannerIndex(index);
                }
              }}
            >
              <Animated.View
                style={[
                  styles.dot,
                  activeBannerIndex === index && styles.activeDot,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  // Add a handler for banner press
  const handleBannerPress = (index: number) => {
    // Navigate to a specific blog or category based on the banner
    const blogId = BLOG_POSTS[index % BLOG_POSTS.length].id;
    const blog = BLOG_POSTS.find(blog => blog.id === blogId);
    if (blog) {
      handleBlogPress(blog);
    }
  };

  // Render categories
  const renderCategories = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryItem,
              activeCategory === category.id && styles.activeCategoryItem,
            ]}
            onPress={() => setActiveCategory(category.id)}
          >
            <Text
              style={[
                styles.categoryText,
                activeCategory === category.id && styles.activeCategoryText,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  // Render a blog post item
  const renderBlogPost = ({ item }: { item: BlogPost }) => {
    return (
      <TouchableOpacity 
        style={styles.blogPostContainer}
        onPress={() => handleBlogPress(item)}
        activeOpacity={0.92}
      >
        <View style={styles.blogPostImageContainer}>
        <Image source={{ uri: item.image }} style={styles.blogPostImage} />
          <View style={styles.blogPostImageOverlay} />
          <View style={styles.blogPostCategory}>
            <Text style={styles.blogPostCategoryText}>{item.category || 'Featured'}</Text>
          </View>
        </View>
        
        <View style={styles.blogPostContent}>
          <Text style={styles.blogPostTitle} numberOfLines={2}>{item.title}</Text>
          
          <View style={styles.blogPostFooter}>
            <View style={styles.blogPostAuthorContainer}>
              <Image 
                source={{ uri: item.authorAvatar }} 
                style={styles.authorAvatar} 
              />
              <Text style={styles.authorName}>{item.author}</Text>
              {item.isAuthorVerified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedIcon}>✓</Text>
            </View>
              )}
            </View>
            
            <View style={styles.blogPostRightSection}>
            <View style={styles.blogPostViewsContainer}>
              <Image 
                source={require('../assets/icons/search.png')} 
                  style={styles.viewsIcon} 
              />
              <Text style={styles.blogPostViews}>{item.views}</Text>
            </View>
              <TouchableOpacity style={styles.shareButton}>
              <Image 
                  source={require('../assets/icons/send.png')} 
                  style={styles.shareIcon} 
              />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  // Render header with search and filter
  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TouchableOpacity 
            style={styles.filterIconContainer}
            onPress={() => setFilterModalVisible(true)}
          >
            <Image source={filterIcon} style={styles.filterIcon} />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search blogs..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity style={styles.searchIconContainer}>
            <Image source={searchIcon} style={styles.searchIcon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.pointsContainer}>
          <Image 
            source={require('../assets/icons/coin.png')} 
            style={styles.headerPointsIcon} 
          />
          <Text style={styles.headerPointsText}>{userPoints}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Define filter options
  const SORT_OPTIONS = [
    { id: 'latest', label: 'Latest' },
    { id: 'popular', label: 'Most Popular' },
    { id: 'points', label: 'Highest Points' },
  ];

  const READ_TIME_OPTIONS = [
    { id: 'any', label: 'Any Length' },
    { id: 'short', label: '< 5 min' },
    { id: 'medium', label: '5-10 min' },
    { id: 'long', label: '> 10 min' },
  ];

  // Add filter modal component
  const renderFilterModal = () => {
    if (!filterModalVisible) return null;
    
    return (
      <TouchableOpacity 
        style={styles.filterModalOverlay}
        activeOpacity={1}
        onPress={() => setFilterModalVisible(false)}
      >
        <View 
          style={styles.filterModalContainer}
          onStartShouldSetResponder={() => true}
          onResponderRelease={(e) => e.stopPropagation()}
        >
          <View style={styles.filterModalHeader}>
            <Text style={styles.filterModalTitle}>Filter Blogs</Text>
            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <Text style={styles.filterModalClose}>✕</Text>
            </TouchableOpacity>
        </View>
          
          {/* Categories Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Categories</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterOptionsContainer}
            >
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.filterOption,
                    selectedFilters.category === category.id && styles.filterOptionSelected,
                  ]}
                  onPress={() => setSelectedFilters({
                    ...selectedFilters,
                    category: category.id
                  })}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedFilters.category === category.id && styles.filterOptionTextSelected,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
        </View>
          
          {/* Sort By Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Sort By</Text>
            <View style={styles.filterOptionsRow}>
              {SORT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.filterOption,
                    selectedFilters.sortBy === option.id && styles.filterOptionSelected,
                  ]}
                  onPress={() => setSelectedFilters({
                    ...selectedFilters,
                    sortBy: option.id
                  })}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedFilters.sortBy === option.id && styles.filterOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
      </View>
          </View>
          
          {/* Read Time Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Read Time</Text>
            <View style={styles.filterOptionsRow}>
              {READ_TIME_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.filterOption,
                    selectedFilters.readTime === option.id && styles.filterOptionSelected,
                  ]}
                  onPress={() => setSelectedFilters({
                    ...selectedFilters,
                    readTime: option.id
                  })}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedFilters.readTime === option.id && styles.filterOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Apply and Reset Buttons */}
          <View style={styles.filterButtonsContainer}>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => {
                setSelectedFilters({
                  category: 'all',
                  sortBy: 'latest',
                  readTime: 'any',
                });
                setActiveCategory('all');
              }}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={() => {
                setActiveCategory(selectedFilters.category);
                setFilterModalVisible(false);
                // In a real app, you'd apply other filters here
              }}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Add random categories to blog posts if they don't have them
  BLOG_POSTS.forEach(post => {
    if (!post.category) {
      const categories = ['Tech', 'Design', 'Business', 'Lifestyle', 'Health'];
      post.category = categories[Math.floor(Math.random() * categories.length)];
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor="transparent" />
      
      {/* Main content */}
      <View style={styles.content}>
        {renderHeader()}
        
        <FlatList
          data={BLOG_POSTS}
          renderItem={renderBlogPost}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <>
              {renderBanner()}
              <View style={styles.latestBlogsHeader}>
                <Text style={styles.latestBlogsTitle}>Latest Blogs</Text>
                <TouchableOpacity 
                  style={styles.viewAllButton}
                  onPress={() => setActiveCategory('all')}
                >
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              {renderCategories()}
            </>
          )}
          contentContainerStyle={styles.listContentContainer}
        />
      </View>
      
      {/* Filter Modal */}
      {renderFilterModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    paddingVertical: 7,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    elevation: 1,
    marginTop: 5,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 8,
    height: 38,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    paddingVertical: 8,
    paddingLeft: 4,
  },
  searchIconContainer: {
    padding: 4,
  },
  filterIconContainer: {
    paddingHorizontal: 6,
  },
  searchIcon: {
    width: 18,
    height: 18,
    tintColor: '#999',
  },
  filterIcon: {
    width: 14,
    height: 14,
    tintColor: '#888',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  headerPointsIcon: {
    width: 16,
    height: 16,
    tintColor: '#FFC107',
    marginRight: 4,
  },
  headerPointsText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '700',
  },
  bannerContainer: {
    height: 240, // Increased height for better visual impact
    width: '100%',
    position: 'relative',
    marginTop: 8,
    marginBottom: 8,
  },
  bannerItemContainer: {
    width,
    height: 240, // Match the container height
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darker overlay for better text readability
    justifyContent: 'flex-end', // Align content to bottom
    alignItems: 'flex-start', // Align to left
    padding: 20,
  },
  bannerContent: {
    width: '80%',
  },
  bannerCategory: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  bannerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.5,
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bannerReadMore: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  bannerReadMoreText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginHorizontal: 4,
  },
  latestBlogsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 6,
  },
  latestBlogsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllButton: {
    padding: 5,
  },
  viewAllText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  categoriesContainer: {
    marginTop: 0,
    marginBottom: 8,
    paddingHorizontal: 16,
    maxHeight: 36,
  },
  categoriesContent: {
    paddingRight: 8,
  },
  categoryItem: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  activeCategoryItem: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 12,
    color: '#777',
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  listContentContainer: {
    paddingBottom: 16,
  },
  blogPostContainer: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 0,
    position: 'relative',
  },
  blogPostImageContainer: {
    position: 'relative',
    height: 200,
    width: '100%',
  },
  blogPostImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  blogPostImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  blogPostCategory: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  blogPostCategoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  blogPostContent: {
    padding: 18,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
  },
  blogPostTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 14,
    lineHeight: 26,
  },
  blogPostFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  blogPostAuthorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  authorName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    borderWidth: 1.5,
    borderColor: 'white',
  },
  verifiedIcon: {
    fontSize: 9,
    color: 'white',
    fontWeight: 'bold',
  },
  blogPostRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blogPostViewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 12,
    backgroundColor: '#f7f7f7',
    borderRadius: 16,
  },
  viewsIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
    tintColor: '#777',
  },
  blogPostViews: {
    fontSize: 13,
    color: '#555',
    fontWeight: '600',
  },
  shareButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  shareIcon: {
    width: 16,
    height: 16,
    tintColor: '#555',
  },
  filterModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterModalContainer: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    maxHeight: '80%',
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  filterModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  filterModalClose: {
    fontSize: 20,
    color: '#999',
    padding: 4,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 10,
  },
  filterOptionsContainer: {
    paddingRight: 8,
  },
  filterOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  filterOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterOptionText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  filterOptionTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
  },
  resetButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  resetButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  applyButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  applyButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
});

export default BlogScreen; 