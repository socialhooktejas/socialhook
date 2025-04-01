import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, typography, spacing, borderRadius } from '../utils/theme';

interface InterestCategory {
  id: string;
  name: string;
  icon: string;
}

const { width, height } = Dimensions.get('window');
const COLUMNS = 2;
const ITEM_MARGIN = spacing.large;
const ITEM_WIDTH = (width - (spacing.large * 2) - (ITEM_MARGIN * (COLUMNS - 1))) / COLUMNS;
const MAX_SELECTIONS = 5;

const InterestsScreen = () => {
  const navigation = useNavigation();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [progressAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [gridItemAnims] = useState(
    Array(25).fill(0).map(() => new Animated.Value(0))
  );

  // Animate items on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Stagger animation for grid items
    Animated.stagger(
      20,
      gridItemAnims.map((anim, i) => 
        Animated.timing(anim, {
          toValue: 1,
          duration: 400 + (i % 5) * 50,
          useNativeDriver: true,
          delay: 100,
        })
      )
    ).start();
  }, [fadeAnim, gridItemAnims]);
  
  // Update progress bar when selections change
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: selectedInterests.length / MAX_SELECTIONS,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [selectedInterests, progressAnim]);

  const interestCategories: InterestCategory[] = [
    { id: 'daily_life', name: 'Daily Life', icon: '📱' },
    { id: 'comedy', name: 'Comedy', icon: '😂' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
    { id: 'animals', name: 'Animals', icon: '🐶' },
    { id: 'food', name: 'Food', icon: '🍔' },
    { id: 'beauty_style', name: 'Beauty & Style', icon: '💄' },
    { id: 'drama', name: 'Drama', icon: '🎭' },
    { id: 'learning', name: 'Learning', icon: '📚' },
    { id: 'talent', name: 'Talent', icon: '🎯' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'auto', name: 'Auto', icon: '🚗' },
    { id: 'family', name: 'Family', icon: '👨‍👩‍👧' },
    { id: 'fitness_health', name: 'Fitness & Health', icon: '💪' },
    { id: 'diy_life_hacks', name: 'DIY & Life Hacks', icon: '🔧' },
    { id: 'arts_crafts', name: 'Arts & Crafts', icon: '🎨' },
    { id: 'dance', name: 'Dance', icon: '💃' },
    { id: 'outdoors', name: 'Outdoors', icon: '🏕️' },
    { id: 'oddly_satisfying', name: 'Oddly Satisfying', icon: '✨' },
    { id: 'home_garden', name: 'Home & Garden', icon: '🏡' },
    { id: 'tech', name: 'Technology', icon: '💻' },
    { id: 'gaming', name: 'Gaming', icon: '🎮' },
    { id: 'viral', name: 'Viral Clips', icon: '🔥' },
    { id: 'memes', name: 'Memes', icon: '😎' },
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'travel', name: 'Travel', icon: '✈️' },
  ];

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter(item => item !== id));
    } else {
      if (selectedInterests.length < MAX_SELECTIONS) {
        setSelectedInterests([...selectedInterests, id]);
      }
    }
  };

  const handleContinue = () => {
    // In a real app, you would save the user's interests
    navigation.navigate('Main' as never);
  };

  const handleSkip = () => {
    navigation.navigate('Main' as never);
  };

  const getProgressText = () => {
    return `${selectedInterests.length}/${MAX_SELECTIONS} selected`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary} />
      <LinearGradient
        colors={[colors.goldGradient1, colors.goldGradient2, colors.goldGradient3]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.header}>
            <Text style={styles.title}>Choose your interests</Text>
            <Text style={styles.subtitle}>Get better content recommendations</Text>
          </View>

          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.interestsContainer}>
              {interestCategories.map((category, index) => {
                const isSelected = selectedInterests.includes(category.id);
                return (
                  <Animated.View
                    key={category.id}
                    style={[
                      styles.interestItemWrapper,
                      {
                        opacity: gridItemAnims[index],
                        transform: [
                          { scale: gridItemAnims[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.9, 1]
                          }) },
                          { translateY: gridItemAnims[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [15, 0]
                          }) }
                        ]
                      }
                    ]}
                  >
                    <TouchableOpacity
                      style={[
                        styles.interestItem,
                        isSelected && styles.selectedInterest,
                      ]}
                      onPress={() => toggleInterest(category.id)}
                      activeOpacity={0.7}
                      disabled={selectedInterests.length >= MAX_SELECTIONS && !isSelected}
                    >
                      <View style={styles.interestIconContainer}>
                        <Text style={styles.interestIcon}>{category.icon}</Text>
                      </View>
                      <View style={styles.interestTextContainer}>
                        <Text
                          style={[
                            styles.interestText,
                            isSelected && styles.selectedInterestText,
                          ]}
                          numberOfLines={1}
                        >
                          {category.name}
                        </Text>
                      </View>
                      {isSelected && (
                        <View style={styles.checkmark}>
                          <Text style={styles.checkmarkText}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.progressContainer}>
              <View style={styles.progressTextContainer}>
                <Text style={styles.progressText}>{getProgressText()}</Text>
              </View>
              <View style={styles.progressBar}>
                <Animated.View 
                  style={[
                    styles.progressIndicator, 
                    { width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%']
                    }) }
                  ]} 
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkip}
              >
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  selectedInterests.length === 0 && styles.disabledButton
                ]}
                onPress={handleContinue}
                disabled={selectedInterests.length === 0}
              >
                <Text style={styles.nextText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.medium,
  },
  header: {
    paddingHorizontal: spacing.medium,
    paddingTop: Platform.OS === 'android' ? spacing.large : spacing.medium,
    paddingBottom: spacing.medium,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.buttonText,
    marginBottom: spacing.small,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: typography.fontSize.medium,
    color: colors.buttonText,
    marginBottom: spacing.medium,
  },
  scrollContent: {
    paddingHorizontal: spacing.medium,
    paddingBottom: spacing.xlarge,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  interestItemWrapper: {
    width: ITEM_WIDTH,
    marginBottom: spacing.medium,
  },
  interestItem: {
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.small,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    position: 'relative',
  },
  interestIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.small,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  interestTextContainer: {
    flex: 1,
    paddingRight: spacing.medium,
  },
  selectedInterest: {
    backgroundColor: colors.selected,
  },
  interestIcon: {
    fontSize: 18,
  },
  interestText: {
    fontSize: typography.fontSize.regular,
    color: colors.text,
    fontWeight: '500',
  },
  selectedInterestText: {
    color: colors.buttonText,
    fontWeight: '600',
  },
  checkmark: {
    position: 'absolute',
    top: 14,
    right: 12,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  checkmarkText: {
    color: colors.buttonText,
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    paddingHorizontal: spacing.medium,
  },
  progressContainer: {
    marginBottom: spacing.medium,
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.tiny,
  },
  progressText: {
    fontSize: typography.fontSize.small,
    color: colors.buttonText,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressIndicator: {
    height: '100%',
    backgroundColor: colors.buttonText,
    borderRadius: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.medium,
  },
  skipButton: {
    flex: 1,
    paddingVertical: spacing.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.small,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: borderRadius.medium,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  skipText: {
    fontSize: typography.fontSize.medium,
    color: colors.buttonText,
    fontWeight: '500',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: spacing.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.small,
    borderRadius: borderRadius.medium,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  disabledButton: {
    opacity: 0.5,
  },
  nextText: {
    fontSize: typography.fontSize.medium,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default InterestsScreen; 