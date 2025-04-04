import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar,
  Animated,
  Easing,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, typography, spacing, borderRadius } from '../utils/theme';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

type AuthMode = 'signup' | 'login';

const AuthScreen = () => {
  const navigation = useNavigation();
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [isChecked, setIsChecked] = useState(false);
  
  // Animations
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.95));
  const [logoAnim] = useState(new Animated.Value(0));
  const [optionsAnim] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]);

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.elastic(1),
      }),
    ]).start();

    // Stagger animation for auth options
    Animated.stagger(150, 
      optionsAnim.map(anim => 
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        })
      )
    ).start();
  }, [fadeAnim, scaleAnim, logoAnim, optionsAnim]);
  
  const renderTitle = () => {
    return authMode === 'signup' 
      ? 'Create your account'
      : 'Welcome back';
  };
  
  const handleContinue = () => {
    // In a real app, you would handle authentication logic here
    navigation.navigate('Interests' as never);
  };

  const switchMode = () => {
    // Animate mode switch
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setAuthMode(authMode === 'signup' ? 'login' : 'signup');
  };

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <LinearGradient
          colors={[colors.goldGradient1, colors.goldGradient2, colors.goldGradient3]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <View style={styles.header}>
              <Animated.View 
                style={[
                  styles.logo,
                  { transform: [{ scale: logoAnim }] }
                ]}
              >
                <Text style={styles.logoText}>S</Text>
              </Animated.View>
              <Text style={styles.title}>
                {renderTitle()}
              </Text>
              <Text style={styles.subtitle}>
                {authMode === 'signup' 
                  ? 'Join Socialhook to connect with friends and share moments.'
                  : 'Log in to continue your social journey.'}
              </Text>
            </View>

            <View style={styles.form}>
              <Animated.View style={{ opacity: optionsAnim[0], transform: [{ translateY: optionsAnim[0].interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              }) }] }}>
                <TouchableOpacity 
                  style={styles.authOption}
                  onPress={() => handleContinue()}
                  activeOpacity={0.7}
                >
                  <View style={styles.authOptionIcon}>
                    <MaterialIcons name="smartphone" size={24} color="#555" />
                  </View>
                  <Text style={styles.authOptionText}>Use phone or email</Text>
                </TouchableOpacity>
              </Animated.View>

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.divider} />
              </View>

              <Animated.View style={{ opacity: optionsAnim[1], transform: [{ translateY: optionsAnim[1].interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              }) }] }}>
                <TouchableOpacity 
                  style={[styles.authOption, styles.facebookOption]}
                  onPress={() => handleContinue()}
                  activeOpacity={0.7}
                >
                  <View style={styles.authOptionIcon}>
                    <FontAwesome5 name="facebook-f" size={24} color="#ffffff" solid />
                  </View>
                  <Text style={styles.authOptionTextWhite}>Continue with Facebook</Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={{ opacity: optionsAnim[2], transform: [{ translateY: optionsAnim[2].interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              }) }] }}>
                <TouchableOpacity 
                  style={[styles.authOption, styles.appleOption]}
                  onPress={() => handleContinue()}
                  activeOpacity={0.7}
                >
                  <View style={styles.authOptionIcon}>
                    <FontAwesome5 name="apple" size={24} color="#ffffff" solid />
                  </View>
                  <Text style={styles.authOptionTextWhite}>Continue with Apple</Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={{ opacity: optionsAnim[3], transform: [{ translateY: optionsAnim[3].interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              }) }] }}>
                <TouchableOpacity 
                  style={styles.authOption}
                  onPress={() => handleContinue()}
                  activeOpacity={0.7}
                >
                  <View style={[styles.authOptionIcon, styles.googleIcon]}>
                    <FontAwesome5 name="google" size={20} color="#4285F4" />
                  </View>
                  <Text style={styles.authOptionText}>Continue with Google</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>

            <View style={styles.footer}>
              <View style={styles.checkboxContainer}>
                <TouchableOpacity 
                  style={styles.checkbox} 
                  onPress={toggleCheckbox}
                  activeOpacity={0.7}
                >
                  {isChecked && (
                    <MaterialIcons name="check" size={16} color="#fff" />
                  )}
                </TouchableOpacity>
                <Text style={styles.termsText}>
                  By continuing, you agree to our{' '}
                  <Text style={styles.termsLink}>Terms</Text> and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </View>

              <View style={styles.loginPrompt}>
                <Text style={styles.loginText}>
                  {authMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
                </Text>
                <TouchableOpacity 
                  onPress={switchMode}
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                >
                  <Text style={styles.loginLink}>
                    {authMode === 'signup' ? 'Log in' : 'Sign up'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  keyboardAvoid: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.medium,
    paddingTop: spacing.xlarge * 1.5,
    paddingBottom: spacing.large,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.medium,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.medium,
  },
  logoText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 66,
  },
  title: {
    fontSize: typography.fontSize.xlarge * 1.2,
    fontWeight: 'bold',
    color: colors.buttonText,
    textAlign: 'center',
    marginBottom: spacing.small,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: typography.fontSize.medium,
    color: colors.buttonText,
    textAlign: 'center',
    marginBottom: spacing.small,
    lineHeight: typography.lineHeight.medium,
    paddingHorizontal: spacing.medium,
  },
  form: {
    width: '100%',
  },
  authOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.medium,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: borderRadius.large,
    marginBottom: spacing.medium,
    height: 64,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  facebookOption: {
    backgroundColor: '#3b5998',
    borderColor: '#3b5998',
  },
  appleOption: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  authOptionIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.medium,
    marginLeft: spacing.medium,
  },
  googleIcon: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  iconText: {
    fontSize: 22,
  },
  facebookIconText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  googleIconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4285F4',
  },
  authOptionText: {
    fontSize: typography.fontSize.medium,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
  },
  authOptionTextWhite: {
    fontSize: typography.fontSize.medium,
    color: '#FFFFFF',
    fontWeight: '500',
    flex: 1,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.small,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  dividerText: {
    marginHorizontal: spacing.medium,
    color: colors.buttonText,
  },
  footer: {
    justifyContent: 'flex-end',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.large,
    paddingHorizontal: spacing.small,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    marginRight: spacing.small,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsText: {
    flex: 1,
    fontSize: typography.fontSize.small,
    color: colors.buttonText,
    lineHeight: typography.lineHeight.small * 1.2,
  },
  termsLink: {
    color: colors.buttonText,
    fontWeight: 'bold',
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: spacing.medium,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  loginText: {
    fontSize: typography.fontSize.medium,
    color: colors.buttonText,
  },
  loginLink: {
    color: colors.buttonText,
    fontWeight: 'bold',
    fontSize: typography.fontSize.medium,
  },
});

export default AuthScreen; 