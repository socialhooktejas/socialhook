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
          <Animated.View style={[styles.logoShadow, { opacity: shadowOpacity }]} />
          <View style={styles.logoContainer}>
            <View style={styles.logoInner}>
              <Text style={styles.logoText}>S</Text>
            </View>
          </View>
        </Animated.View>

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
    paddingTop: height * 0.25,
    paddingBottom: height * 0.15,
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: Math.min(width * 0.5, 220),
    height: Math.min(width * 0.5, 220),
  },
  logoShadow: {
    position: 'absolute',
    width: Math.min(width * 0.45, 200),
    height: Math.min(width * 0.45, 200),
    borderRadius: Math.min(width * 0.225, 100),
    backgroundColor: 'rgba(0,0,0,0.15)',
    top: 10,
    transform: [{ scaleX: 0.96 }, { scaleY: 0.9 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  logoContainer: {
    width: Math.min(width * 0.45, 200),
    height: Math.min(width * 0.45, 200),
    borderRadius: Math.min(width * 0.225, 100),
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoInner: {
    width: '80%',
    height: '80%',
    borderRadius: 1000,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: colors.buttonText,
    fontSize: Math.min(width * 0.2, 100),
    fontWeight: 'bold',
    includeFontPadding: false,
    textAlign: 'center',
  },
  bottomContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: typography.fontSize.xxlarge * 1.5,
    fontWeight: 'bold',
    color: colors.buttonText,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  tagline: {
    fontSize: typography.fontSize.medium,
    color: colors.buttonText,
    marginTop: spacing.small,
    letterSpacing: 0.8,
    opacity: 0.85,
  },
});

export default SplashScreen; 