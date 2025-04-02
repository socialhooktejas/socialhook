import React, { useEffect, useMemo, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Easing, 
  Dimensions,
  StatusBar 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, typography, spacing } from '../utils/theme';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const navigation = useNavigation();
  const logoRotation = useRef(new Animated.Value(0)).current;
  
  const animations = useMemo(() => ({
    logoOpacity: new Animated.Value(0),
    logoScale: new Animated.Value(0.3),
    textOpacity: new Animated.Value(0),
    textTranslateY: new Animated.Value(30),
    shadowOpacity: new Animated.Value(0),
    gradientOpacity: new Animated.Value(0.7),
  }), []);
  
  const { 
    logoOpacity, 
    logoScale, 
    textOpacity, 
    textTranslateY,
    shadowOpacity,
    gradientOpacity
  } = animations;

  const spin = logoRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const gradientProgress = gradientOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1]
  });

  useEffect(() => {
    // Logo animation sequence
    Animated.sequence([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.elastic(1.1),
        }),
        Animated.timing(logoRotation, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(shadowOpacity, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
        Animated.timing(gradientOpacity, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.cubic),
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(textTranslateY, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
    ]).start();

    // Navigate to Auth screen after animations
    const timer = setTimeout(() => {
      navigation.navigate('Auth' as never);
    }, 3200);

    return () => clearTimeout(timer);
  }, [navigation, logoOpacity, logoScale, logoRotation, textOpacity, textTranslateY, shadowOpacity, gradientOpacity]);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Animated.View style={[styles.gradientContainer, { opacity: gradientProgress }]}>
        <LinearGradient
          colors={[colors.goldGradient1, colors.goldGradient2, colors.goldGradient3]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>

      <View style={styles.content}>
        <View style={styles.logoSection}>
          <Animated.View
            style={[
              styles.logoWrapper,
              {
                opacity: logoOpacity,
                transform: [
                  { scale: logoScale },
                  { rotate: spin }
                ],
              },
            ]}
          >
            <View style={styles.logo}>
              <Text style={styles.logoText}>S</Text>
            </View>
          </Animated.View>
        </View>

        <Animated.View 
          style={[
            styles.bottomContainer,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }]
            }
          ]}
        >
          <Text style={styles.appName}>Socialhook</Text>
          <Text style={styles.tagline}>Connect. Share. Engage.</Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  gradientContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: height * 0.05,
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: Math.min(width * 0.5, 220),
    height: Math.min(width * 0.5, 220),
  },
  logo: {
    width: Math.min(width * 0.45, 200),
    height: Math.min(width * 0.45, 200),
    borderRadius: Math.min(width * 0.225, 100),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoText: {
    color: colors.primary,
    fontSize: Math.min(width * 0.3, 140),
    fontWeight: 'bold',
    includeFontPadding: false,
    textAlign: 'center',
    lineHeight: Math.min(width * 0.33, 155),
    textShadowColor: '#000000',
    textShadowOffset: { width: 1.5, height: 1.5 },
    textShadowRadius: 1,
  },
  logoTextShadow: {
    display: 'none',
  },
  bottomContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: spacing.medium,
    position: 'absolute',
    bottom: height * 0.05,
  },
  appName: {
    fontSize: typography.fontSize.xlarge * 1.5,
    fontWeight: '700',
    color: colors.buttonText,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: typography.fontSize.medium * 0.85,
    color: colors.buttonText,
    marginTop: spacing.small / 2,
    letterSpacing: 0.5,
    opacity: 0.8,
  },
});

export default SplashScreen; 