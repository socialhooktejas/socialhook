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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../utils/theme';

const { width } = Dimensions.get('window');

// Sample article data
const SAMPLE_ARTICLES = [
  {
    title: 'The Evolution of Cinema',
    excerpt: 'From silent films to digital streaming, explore the fascinating journey of cinema through the decades...',
  },
  {
    title: 'Behind the Scenes: Blockbuster Production',
    excerpt: 'Discover the intricate process of creating Hollywood\'s biggest films and the teams that make movie magic happen...',
  },
  {
    title: 'Indie Filmmaking Revolution',
    excerpt: 'How independent filmmakers are changing the landscape of modern cinema with innovative storytelling techniques...',
  },
  {
    title: 'The Art of Visual Storytelling',
    excerpt: 'Understanding the visual language of film and how directors craft powerful narratives through imagery...',
  },
  {
    title: 'Film Scores That Defined Generations',
    excerpt: 'Exploring the iconic soundtracks that elevated films to legendary status and influenced popular culture...',
  },
];

const RedirectScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { videoUrl = 'HomeScreen', title = 'MovieStream' } = route.params || {};
  
  // States
  const [timeLeft, setTimeLeft] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(3);
  const [continueEnabled, setContinueEnabled] = useState(false);
  const [currentArticle] = useState(SAMPLE_ARTICLES[Math.floor(Math.random() * SAMPLE_ARTICLES.length)]);
  
  // Animated values
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;
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

    // Start the countdown
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeButtonText}>✕ Close</Text>
        </TouchableOpacity>
      </View>

      <Animated.View 
        style={[styles.content, { opacity: opacityAnimation }]}
      >
        {/* Ad Banner Top */}
        <View style={styles.adBanner}>
          <Text style={styles.adText}>Advertisement</Text>
        </View>

        {/* Article Content */}
        <View style={styles.articleContainer}>
          <Text style={styles.articleTitle}>{currentArticle.title}</Text>
          <Text style={styles.articleExcerpt}>{currentArticle.excerpt}</Text>
        </View>

        {/* Timer Section */}
        <View style={styles.timerContainer}>
          <Text style={styles.waitText}>Please wait</Text>
          <Text style={styles.timerText}>{timeLeft}</Text>
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
          <Text style={[
            styles.continueButtonText,
            continueEnabled ? styles.continueButtonTextEnabled : styles.continueButtonTextDisabled
          ]}>
            Continue to Video
          </Text>
        </TouchableOpacity>

        {/* Redirect Progress */}
        <View style={styles.redirectProgressContainer}>
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>Redirect Progress</Text>
            <View style={styles.pageIndicators}>
              {[1, 2, 3].map(page => (
                <View 
                  key={page} 
                  style={[
                    styles.pageIndicator,
                    currentPage === page && styles.activePageIndicator
                  ]}
                >
                  <Text style={[
                    styles.pageIndicatorText,
                    currentPage === page && styles.activePageIndicatorText
                  ]}>
                    {page}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={styles.pageText}>Page {currentPage} of {totalPages}</Text>
          </View>
        </View>

        {/* Ad Banner Bottom */}
        <View style={styles.adBanner}>
          <Text style={styles.adText}>Advertisement</Text>
        </View>

        {/* Current Page Indicator */}
        <View style={styles.currentPageContainer}>
          <View style={styles.currentPageDot} />
          <Text style={styles.currentPageText}>Current Page</Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  adBanner: {
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  adText: {
    color: '#888',
    fontSize: 16,
  },
  articleContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  articleTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  articleExcerpt: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  waitText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  continueButton: {
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  continueButtonDisabled: {
    backgroundColor: '#e0e0e0',
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
  redirectProgressContainer: {
    marginVertical: 16,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 12,
  },
  pageIndicators: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  pageIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
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
  currentPageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  currentPageDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  currentPageText: {
    fontSize: 14,
    color: '#666',
  },
});

export default RedirectScreen; 