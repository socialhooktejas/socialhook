import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Easing,
  Dimensions,
  Linking,
  Platform,
  StatusBar,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../utils/theme';

const { width } = Dimensions.get('window');

// Full article data
const ARTICLE_CONTENT = {
  title: "The Evolution of Cinema",
  subtitle: "From silent films to modern blockbusters - the remarkable journey of motion pictures",
  author: "Sarah Parker",
  authorAvatar: "https://randomuser.me/api/portraits/women/32.jpg",
  publishDate: "July 15, 2023",
  readTime: "8 min read",
  image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  contentPart1: `The history of cinema is a fascinating journey through technological innovation, artistic expression, and cultural reflection. Beginning in the late 19th century with simple mechanical devices, cinema has evolved into one of the most influential art forms in human history.

The earliest motion pictures were brief snapshots of everyday life. The Lumière brothers' 1895 screening of "Workers Leaving the Lumière Factory" is often cited as the birth of cinema as a public exhibition medium. These early films, running just a few minutes long, captured the imagination of audiences worldwide.

The silent era flourished in the early 20th century, with visionaries like Georges Méliès introducing narrative storytelling and special effects. His 1902 film "A Trip to the Moon" demonstrated cinema's potential for fantasy and spectacle beyond simple documentation.`,
  contentPart2: `Hollywood emerged as the dominant force in filmmaking during the 1920s, establishing the studio system that would shape the industry for decades. The transition to sound with "The Jazz Singer" (1927) revolutionized the medium, despite initial resistance from some filmmakers who valued the unique visual language of silent cinema.

The Golden Age of Hollywood (1930s-1940s) established genres and star systems that continue to influence cinema today. Films like "Gone with the Wind" and "Citizen Kane" pushed the boundaries of what cinema could achieve artistically and commercially.

Post-World War II cinema saw the rise of international film movements like Italian Neorealism, French New Wave, and Japanese cinema, which challenged Hollywood conventions and introduced new perspectives. Directors like Akira Kurosawa, Federico Fellini, and François Truffaut became household names among cinephiles.

The 1970s marked another turning point with the emergence of "New Hollywood" directors like Francis Ford Coppola, Martin Scorsese, and Steven Spielberg, who combined artistic ambition with commercial appeal. "Jaws" (1975) established the summer blockbuster template, while "Star Wars" (1977) revolutionized special effects and merchandising.`
};

const RedirectScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { videoUrl = 'HomeScreen', title = 'MovieStream' } = route.params || {};
  
  // States
  const [timeLeft, setTimeLeft] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(3);
  const [continueEnabled, setContinueEnabled] = useState(false);
  
  // Ref for ScrollView to enable auto-scrolling
  const scrollViewRef = useRef(null);

  // Animated values
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;
  const timerScale = useRef(new Animated.Value(1)).current;
  const dotScale = useRef([
    new Animated.Value(1),
    new Animated.Value(0.8),
    new Animated.Value(0.8),
  ]).current;

  // Timer effect
  useEffect(() => {
    // Fade in animation
    Animated.timing(opacityAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Auto scroll to download section after component mounts and renders
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ 
          y: 400, // This should position roughly to the first ad
          animated: true 
        });
      }
    }, 500);

    // Start the countdown
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          // Pulse animation when timer reaches zero
          Animated.sequence([
            Animated.timing(timerScale, {
              toValue: 1.2,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(timerScale, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
          
          clearInterval(interval);
          setContinueEnabled(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Update progress bar and page when timer changes
  useEffect(() => {
    // Update progress animation
    Animated.timing(progressAnimation, {
      toValue: ((totalPages - currentPage + 1) * 10 - timeLeft) / (totalPages * 10),
      duration: 300,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start();

    // When one page countdown completes
    if (timeLeft === 0 && currentPage < totalPages) {
      // Move to next page after a slight delay
      const timeout = setTimeout(() => {
        setCurrentPage(prevPage => prevPage + 1);
        setTimeLeft(10);
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [timeLeft, currentPage]);

  // Update progress dots
  useEffect(() => {
    dotScale.forEach((dot, index) => {
      Animated.timing(dot, {
        toValue: currentPage === index + 1 ? 1 : 0.8,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }, [currentPage]);

  // Handle continue button press
  const handleContinue = async () => {
    if (videoUrl === 'HomeScreen') {
      navigation.navigate('Main');
    } else {
      try {
        const canOpen = await Linking.canOpenURL(videoUrl);
        if (canOpen) {
          await Linking.openURL(videoUrl);
        } else {
          console.error('Cannot open URL:', videoUrl);
        }
      } catch (error) {
        console.error('Error opening URL:', error);
      }
    }
  };

  // Render progress dots
  const renderProgressDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {[0, 1, 2].map(index => (
          <Animated.View 
            key={index} 
            style={[
              styles.dot, 
              { 
                opacity: index + 1 <= currentPage ? 1 : 0.5,
                transform: [{ scale: dotScale[index] }],
                backgroundColor: index + 1 < currentPage ? colors.primary : 
                               index + 1 === currentPage ? colors.primary : '#ccc',
              }
            ]} 
          />
        ))}
      </View>
    );
  };

  // Render sticky page indicators
  const renderStickyPageIndicators = () => {
    return (
      <View style={styles.stickyPageIndicators}>
        {[1, 2, 3].map(page => (
          <View 
            key={page} 
            style={[
              styles.stickyPageIndicator,
              currentPage === page && styles.activeStickyPageIndicator
            ]}
          >
            <Text style={[
              styles.stickyPageIndicatorText,
              currentPage === page && styles.activeStickyPageIndicatorText
            ]}>
              {page}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  // Update the header to match BlogDetailsScreen style
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Article</Text>
      </View>
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.headerIconButton}>
          <Text style={styles.headerActionIcon}>⋮</Text>
        </TouchableOpacity>
        <View style={styles.headerPointsBadge}>
          <Text style={styles.headerBadgeIcon}>★</Text>
          <Text style={styles.headerBadgeText}>2.5K</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} translucent={true} />
      <View style={styles.safeContent}>
        {renderHeader()}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollContent}
        >
          <Animated.View 
            style={[styles.content, { opacity: opacityAnimation }]}
          >
            <View style={styles.contentWrapper}>
              {/* Hero Image */}
              <Image source={{ uri: ARTICLE_CONTENT.image }} style={styles.heroImage} />
              
              {/* Title Section */}
              <View style={styles.titleSection}>
                <Text style={styles.title}>{ARTICLE_CONTENT.title}</Text>
                <View style={styles.metaInfoRow}>
                  <Text style={styles.readTime}>{ARTICLE_CONTENT.readTime}</Text>
                  <Text style={styles.metaDivider}>•</Text>
                  <Text style={styles.dateText}>{ARTICLE_CONTENT.publishDate}</Text>
                </View>
              </View>
              
              {/* Author Brief and Action Buttons */}
              <View style={styles.actionRow}>
                <View style={styles.authorBrief}>
                  <Image source={{ uri: ARTICLE_CONTENT.authorAvatar }} style={styles.authorImageSmall} />
                  <TouchableOpacity style={styles.miniFollowButton}>
                    <Text style={styles.miniFollowText}>Follow</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.actionButton}>
                    <View style={styles.actionIconContainer}>
                      <Text style={styles.actionIcon}>♡</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <View style={styles.actionIconContainer}>
                      <Text style={styles.actionIcon}>💬</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <View style={styles.actionIconContainer}>
                      <Text style={styles.actionIcon}>↗</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.divider} />

              {/* First part of article - add id for scrolling */}
              <View style={styles.contentProse} nativeID="downloadSection">
                <Text style={styles.firstParagraph}>{ARTICLE_CONTENT.contentPart1.split('\n\n')[0]}</Text>
              </View>

              {/* Download section starts here */}
              {/* First Ad Banner */}
              <View style={styles.adBanner}>
                <View style={styles.adTag}>
                  <Text style={styles.adTagText}>AD</Text>
                </View>
                <Text style={styles.adText}>Advertisement</Text>
              </View>

              {/* Timer Section */}
              <View style={styles.timerContainer}>
                <Text style={styles.waitText}>Your download will be ready in</Text>
                <Animated.Text 
                  style={[
                    styles.timerText, 
                    { 
                      transform: [{ scale: timerScale }],
                      color: timeLeft === 0 ? '#4CAF50' : colors.primary
                    }
                  ]}
                >
                  {timeLeft}
                </Animated.Text>
                {renderProgressDots()}
              </View>

              {/* Continue Button */}
              <TouchableOpacity 
                style={[
                  styles.continueButton,
                  continueEnabled ? styles.continueButtonEnabled : styles.continueButtonDisabled
                ]}
                disabled={!continueEnabled}
                onPress={handleContinue}
              >
                {!continueEnabled ? (
                  <View style={styles.continueButtonContent}>
                    <ActivityIndicator size="small" color="#999" style={styles.buttonLoader} />
                    <Text style={[
                      styles.continueButtonText,
                      continueEnabled ? styles.continueButtonTextEnabled : styles.continueButtonTextDisabled
                    ]}>
                      Please Wait...
                    </Text>
                  </View>
                ) : (
                  <View style={styles.continueButtonContent}>
                    <Text style={[
                      styles.continueButtonText,
                      continueEnabled ? styles.continueButtonTextEnabled : styles.continueButtonTextDisabled
                    ]}>
                      Continue to Link
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Mid Ad Banner */}
              <View style={styles.midAdBanner}>
                <View style={styles.adTag}>
                  <Text style={styles.adTagText}>AD</Text>
                </View>
                <Text style={styles.adText}>Advertisement</Text>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarHeader}>
                  <Text style={styles.progressLabel}>Download Progress</Text>
                  <Text style={styles.pageText}>Step {currentPage} of {totalPages}</Text>
                </View>
                <View style={styles.progressBarBackground}>
                  <Animated.View 
                    style={[
                      styles.progressBarFill,
                      { width: progressAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%']
                        }) 
                      }
                    ]} 
                  />
                </View>
              </View>

              {/* Remaining article content */}
              <View style={styles.contentProse}>
                <Text style={styles.paragraph}>{ARTICLE_CONTENT.contentPart1.split('\n\n').slice(1).join('\n\n')}</Text>
              </View>

              {/* Article Second Part */}
              <View style={styles.contentProse}>
                <Text style={styles.paragraph}>{ARTICLE_CONTENT.contentPart2}</Text>
              </View>
              
              {/* Author Footer Section */}
              <View style={styles.authorFooter}>
                <View style={styles.authorContainer}>
                  <Image source={{ uri: ARTICLE_CONTENT.authorAvatar }} style={styles.authorImage} />
                  <View style={styles.authorInfo}>
                    <Text style={styles.authorName}>{ARTICLE_CONTENT.author}</Text>
                    <Text style={styles.authorBio}>Content Creator</Text>
                  </View>
                </View>
                
                <TouchableOpacity style={styles.followButton}>
                  <Text style={styles.followButtonText}>Follow</Text>
                </TouchableOpacity>
              </View>

              {/* Ad Banner Bottom */}
              <View style={styles.adBannerBottom}>
                <View style={styles.adTag}>
                  <Text style={styles.adTagText}>AD</Text>
                </View>
                <Text style={styles.adText}>Advertisement</Text>
              </View>
              
              {/* Article Tags */}
              <View style={styles.articleTags}>
                <TouchableOpacity style={styles.articleTag}>
                  <Text style={styles.articleTagText}>Cinema</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.articleTag}>
                  <Text style={styles.articleTagText}>Film History</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.articleTag}>
                  <Text style={styles.articleTagText}>Hollywood</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
        
        {/* Sticky Page Indicators */}
        {renderStickyPageIndicators()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  safeContent: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 10,
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
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  backIcon: {
    fontSize: 20,
    color: 'white',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
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
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerActionIcon: {
    fontSize: 18,
    color: 'white',
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
    fontSize: 14,
    color: '#ffa000',
    marginRight: 4,
  },
  headerBadgeText: {
    color: '#795548',
    fontWeight: '600',
    fontSize: 13,
  },
  scrollContent: {
    flex: 1,
  },
  content: {
    padding: 0,
    paddingBottom: 80, // Extra padding for sticky indicators
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
    fontSize: 16,
    color: '#555',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
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
  adBanner: {
    height: 90,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  adBannerBottom: {
    height: 90,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  midAdBanner: {
    height: 120,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  adTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adTagText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  adText: {
    color: '#888',
    fontSize: 16,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
  },
  waitText: {
    fontSize: 15,
    color: '#666',
    marginBottom: 4,
  },
  timerText: {
    fontSize: 44,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  continueButton: {
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  continueButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLoader: {
    marginRight: 8,
  },
  continueButtonDisabled: {
    backgroundColor: '#f2f2f2',
  },
  continueButtonEnabled: {
    backgroundColor: colors.primary,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButtonTextDisabled: {
    color: '#999',
  },
  continueButtonTextEnabled: {
    color: 'white',
  },
  progressBarContainer: {
    marginBottom: 30,
  },
  progressBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  pageIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  pageIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activePageIndicator: {
    backgroundColor: colors.primary,
  },
  pageIndicatorText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
  },
  activePageIndicatorText: {
    color: 'white',
  },
  pageText: {
    fontSize: 14,
    color: '#666',
  },
  stickyPageIndicators: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stickyPageIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStickyPageIndicator: {
    backgroundColor: colors.primary,
  },
  stickyPageIndicatorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#888',
  },
  activeStickyPageIndicatorText: {
    color: 'white',
  },
  articleTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 16,
  },
  articleTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  articleTagText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  contentDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    color: '#888',
    fontSize: 14,
    marginHorizontal: 12,
    fontWeight: '500',
  },
});

export default RedirectScreen; 