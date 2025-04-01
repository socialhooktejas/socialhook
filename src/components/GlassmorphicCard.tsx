import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ViewStyle,
  TextStyle,
  ImageBackground,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';

interface GlassmorphicCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  onButtonPress?: () => void;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  buttonStyle?: ViewStyle;
  buttonTextStyle?: TextStyle;
  blurIntensity?: number;
  backgroundImage?: any;
  children?: React.ReactNode;
  badges?: React.ReactNode;
  isDarkMode?: boolean;
}

/**
 * A modern Glassmorphic Card component with a frosted glass effect
 * Works on both iOS and Android with optimal performance
 */
const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  title,
  subtitle,
  description,
  buttonText,
  onButtonPress,
  containerStyle,
  titleStyle,
  subtitleStyle,
  descriptionStyle,
  buttonStyle,
  buttonTextStyle,
  blurIntensity = 10,
  backgroundImage,
  children,
  badges,
  isDarkMode = false,
}) => {
  // Define base color scheme based on theme
  const colors = isDarkMode
    ? {
        background: 'rgba(25, 25, 30, 0.75)',
        border: 'rgba(255, 255, 255, 0.15)',
        text: '#FFFFFF',
        textSecondary: 'rgba(255, 255, 255, 0.7)',
        button: '#FF3B30',
        buttonText: '#FFFFFF',
      }
    : {
        background: '#FFFFFF',
        border: 'rgba(230, 230, 230, 0.8)',
        text: 'black',
        textSecondary: '#666666',
        button: '#FF3B30',
        buttonText: '#FFFFFF',
      };

  // Conditional rendering for different platforms
  const renderCardContent = () => (
    <View style={[styles.cardContent, { backgroundColor: 'transparent' }]}>
      {badges && <View style={styles.badgesContainer}>{badges}</View>}
      
      <Text style={[styles.title, { color: colors.text }, titleStyle]}>
        {title}
      </Text>
      
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textSecondary }, subtitleStyle]}>
          {subtitle}
        </Text>
      )}
      
      {description && (
        <Text style={[styles.description, { color: colors.textSecondary }, descriptionStyle]}>
          {description}
        </Text>
      )}
      
      {children}
      
      {buttonText && onButtonPress && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.button }, buttonStyle]}
          onPress={onButtonPress}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }, buttonTextStyle]}>
            {buttonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Use different implementations for iOS and Android
  if (backgroundImage) {
    return (
      <ImageBackground
        source={backgroundImage}
        style={[styles.container, containerStyle]}
        imageStyle={styles.backgroundImage}
      >
        {Platform.OS === 'ios' ? (
          // iOS-specific implementation with native blur
          <BlurView
            style={styles.blurContainer}
            blurType={isDarkMode ? 'dark' : 'light'}
            blurAmount={blurIntensity}
            reducedTransparencyFallbackColor={colors.background}
          >
            <View
              style={[
                styles.innerContainer,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              {renderCardContent()}
            </View>
          </BlurView>
        ) : (
          // Android fallback
          <View
            style={[
              styles.innerContainer,
              styles.blurContainer,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            {renderCardContent()}
          </View>
        )}
      </ImageBackground>
    );
  }

  // Version without background image
  return (
    <View style={[styles.container, containerStyle]}>
      {Platform.OS === 'ios' ? (
        <BlurView
          style={styles.blurContainer}
          blurType={isDarkMode ? 'dark' : 'light'}
          blurAmount={blurIntensity}
          reducedTransparencyFallbackColor={colors.background}
        >
          <View
            style={[
              styles.innerContainer,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            {renderCardContent()}
          </View>
        </BlurView>
      ) : (
        <View
          style={[
            styles.innerContainer,
            styles.blurContainer,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          {renderCardContent()}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 3, // Android shadow
    // iOS shadow handled in innerContainer
  },
  backgroundImage: {
    borderRadius: 16,
  },
  blurContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  innerContainer: {
    borderWidth: 1,
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardContent: {
    padding: 20,
    flex: 1,
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    // Button shadow (Android)
    elevation: 3,
    // Button shadow (iOS)
    shadowColor: 'rgba(0,0,0,0.25)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default GlassmorphicCard; 