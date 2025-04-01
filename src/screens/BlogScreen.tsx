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
  'https://images.unsplash.com/photo-1542435503-956c469947f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmxvZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmxvZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmxvZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YmxvZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/photo-1487611459768-bd414656ea10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJsb2d8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
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

  // Auto scroll for banner
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (bannerRef.current) {
        const nextIndex = (activeBannerIndex + 1) % BANNER_IMAGES.length;
        bannerRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        setActiveBannerIndex(nextIndex);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [activeBannerIndex]);

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
          renderItem={({ item }) => (
            <View style={styles.bannerItemContainer}>
              <Image source={{ uri: item }} style={styles.bannerImage} />
              <View style={styles.bannerOverlay}>
                <Text style={styles.bannerTitle}>BLOG</Text>
              </View>
            </View>
          )}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleBannerScroll}
          onMomentumScrollEnd={onBannerItemChanged}
          keyExtractor={(_, index) => index.toString()}
        />
        <View style={styles.dotsContainer}>
          {BANNER_IMAGES.map((_, index) => {
            // Calculate dot opacity based on current index
            const dotOpacity = scrollX.interpolate({
              inputRange: [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ],
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            // Calculate dot width based on current index
            const dotWidth = scrollX.interpolate({
              inputRange: [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ],
              outputRange: [6, 10, 6],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index.toString()}
                style={[
                  styles.dot,
                  { opacity: dotOpacity, width: dotWidth, height: dotWidth },
                  activeBannerIndex === index && styles.activeDot,
                ]}
              />
            );
          })}
        </View>
      </View>
    );
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
      >
        <Image source={{ uri: item.image }} style={styles.blogPostImage} />
        <View style={styles.blogPostContent}>
          <Text style={styles.blogPostTitle}>{item.title}</Text>
          <Text style={styles.blogPostSummary} numberOfLines={2}>
            {item.summary}
          </Text>
          <View style={styles.blogPostFooter}>
            <View style={styles.blogPostPointsContainer}>
              <Image 
                source={require('../assets/icons/coin.png')} 
                style={styles.pointIcon} 
              />
              <Text style={styles.blogPostPoints}>{item.points} points</Text>
            </View>
            <View style={styles.blogPostViewsContainer}>
              <Image 
                source={require('../assets/icons/search.png')} 
                style={[styles.viewsIcon, {tintColor: '#888'}]} 
              />
              <Text style={styles.blogPostViews}>{item.views}</Text>
            </View>
            <View style={styles.blogPostAuthorContainer}>
              <Image 
                source={{ uri: item.authorAvatar }} 
                style={styles.authorAvatar} 
              />
              <Text style={styles.authorName}>{item.author}</Text>
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
        <TouchableOpacity style={styles.filterButton}>
          <Image source={filterIcon} style={styles.filterIcon} />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // User points footer
  const renderPointsFooter = () => {
    return (
      <View style={styles.pointsFooterContainer}>
        <View style={styles.pointsInfo}>
          <Image 
            source={require('../assets/icons/coin.png')} 
            style={styles.pointsFooterIcon} 
          />
          <Text style={styles.pointsText}>Your Points</Text>
        </View>
        <Text style={styles.pointsValue}>{userPoints}</Text>
        <View style={styles.pointsActions}>
          <Text style={styles.pointsActionText}>Create: +2 points</Text>
          <Text style={styles.pointsActionText}>Read: +1 point</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
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
              <View style={styles.latestBlogsContainer}>
                <Text style={styles.latestBlogsTitle}>Latest Blogs</Text>
                {renderCategories()}
              </View>
            </>
          )}
          contentContainerStyle={styles.listContentContainer}
        />
      </View>
      
      {renderPointsFooter()}
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    elevation: 1,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 30,
    paddingHorizontal: 16,
    marginRight: 12,
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
  searchIcon: {
    width: 18,
    height: 18,
    tintColor: '#999',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  filterIcon: {
    width: 14,
    height: 14,
    tintColor: '#888',
    marginRight: 4,
  },
  filterText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  bannerContainer: {
    height: 200,
    width: '100%',
  },
  bannerItemContainer: {
    width,
    height: 200,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 4,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#ffffff',
  },
  latestBlogsContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  latestBlogsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  categoriesContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  categoriesContent: {
    paddingRight: 16,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  activeCategoryItem: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 13,
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
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  blogPostImage: {
    height: 180,
    width: '100%',
    resizeMode: 'cover',
  },
  blogPostContent: {
    padding: 16,
  },
  blogPostTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  blogPostSummary: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  blogPostFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  blogPostPointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointIcon: {
    width: 16,
    height: 16,
    tintColor: '#FFC107',
    marginRight: 4,
  },
  blogPostPoints: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },
  blogPostViewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewsIcon: {
    width: 15,
    height: 15,
    marginRight: 4,
  },
  blogPostViews: {
    fontSize: 13,
    color: '#888',
  },
  blogPostAuthorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 6,
  },
  authorName: {
    fontSize: 12,
    color: '#777',
    fontWeight: '500',
  },
  pointsFooterContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.primary,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  pointsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsFooterIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFD700',
    marginRight: 8,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  pointsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  pointsActions: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  pointsActionText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
  },
});

export default BlogScreen; 