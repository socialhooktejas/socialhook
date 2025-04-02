import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { colors } from '../utils/theme';

// Screens
import SplashScreen from '../screens/SplashScreen';
import AuthScreen from '../screens/AuthScreen';
import InterestsScreen from '../screens/InterestsScreen';

// Placeholder screens - will be replaced with actual screens later
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import CreateOptionsScreen from '../screens/CreateOptionsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import GroupScreen from '../screens/GroupScreen';
import DynamicGroupScreen from '../screens/DynamicGroupScreen';
import CommentsScreen from '../screens/CommentsScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import BlogScreen from '../screens/BlogScreen';
import BlogDetailsScreen from '../screens/BlogDetailsScreen';
import RedirectScreen from '../screens/RedirectScreen';
import UnifiedReelsStream from '../screens/UnifiedReelsStream';
import WithdrawScreen from '../screens/WithdrawScreen';
import NotificationScreen from '../screens/NotificationScreen';
import EarningsHubScreen from '../screens/EarningsHubScreen';

// Import icons
const homeIcon = require('../assets/icons/homepage.png');
const exploreIcon = require('../assets/icons/compass.png');
const plusIcon = require('../assets/icons/plus.png');
const blogIcon = require('../assets/icons/website.png');
const profileIcon = require('../assets/icons/user.png');

// Type definitions
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Interests: undefined;
  Main: undefined;
  CreatePost: undefined;
  GroupScreen: { groupId: string; groupName?: string; debateTopic?: string; debateType?: 'vs' | 'poll' };
  DynamicGroupScreen: { groupId: string; groupName?: string; debateTopic?: string; debateType?: 'vs' | 'poll' };
  CommentsScreen: {
    commentCount?: number;
    postOwnerUsername?: string;
    postOwnerAvatar?: string;
    isPostOwnerVerified?: boolean;
    postCaption?: string;
  };
  LeaderboardScreen: undefined;
  BlogDetailsScreen: { blog: any };
  RedirectScreen: { videoUrl?: string; title?: string };
  ExploreScreen: { focusSearch?: boolean };
  UnifiedReelsStream: undefined;
  WithdrawScreen: undefined;
  EarningsHubScreen: undefined;
  NotificationScreen: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Explore: { focusSearch?: boolean };
  CreateOptions: undefined;
  CreatePost: undefined;
  Blogs: undefined;
  Profile: undefined;
  GroupScreen: { groupId: string; groupName?: string; debateTopic?: string; debateType?: 'vs' | 'poll' };
};

// Create navigators
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Custom Tab Bar Icons - using PNG icons
interface TabIconProps {
  focused: boolean;
}

const HomeIcon: React.FC<TabIconProps> = ({ focused }) => (
  <View style={styles.iconContainer}>
    <Image 
      source={homeIcon} 
      style={[
        styles.tabIconImage, 
        { tintColor: focused ? 'white' : 'rgba(255,255,255,0.7)' }
      ]} 
    />
    <Text 
      style={[styles.tabLabel, focused && styles.tabLabelActive]}
      numberOfLines={1}
    >
      Home
    </Text>
  </View>
);

const ExploreIcon: React.FC<TabIconProps> = ({ focused }) => (
  <View style={styles.iconContainer}>
    <Image 
      source={exploreIcon} 
      style={[
        styles.tabIconImage, 
        { tintColor: focused ? 'white' : 'rgba(255,255,255,0.7)' }
      ]} 
    />
    <Text 
      style={[
        styles.tabLabel, 
        focused && styles.tabLabelActive,
        { fontSize: 9 }
      ]}
      numberOfLines={1}
    >
      Explore
    </Text>
  </View>
);

const CreatePostIcon: React.FC = () => (
  <View style={styles.iconContainer}>
    <View style={styles.createPostContainer}>
      <Image 
        source={plusIcon} 
        style={[
          styles.createPostImage,
          { tintColor: 'white' }
        ]} 
      />
    </View>
  </View>
);

const BlogsIcon: React.FC<TabIconProps> = ({ focused }) => (
  <View style={styles.iconContainer}>
    <Image 
      source={blogIcon} 
      style={[
        styles.tabIconImage, 
        { tintColor: focused ? 'white' : 'rgba(255,255,255,0.7)' }
      ]} 
    />
    <Text 
      style={[styles.tabLabel, focused && styles.tabLabelActive]}
      numberOfLines={1}
    >
      Blogs
    </Text>
  </View>
);

const ProfileIcon: React.FC<TabIconProps> = ({ focused }) => (
  <View style={styles.iconContainer}>
    <Image 
      source={profileIcon} 
      style={[
        styles.tabIconImage, 
        { tintColor: focused ? 'white' : 'rgba(255,255,255,0.7)' }
      ]} 
    />
    <Text 
      style={[styles.tabLabel, focused && styles.tabLabelActive]}
      numberOfLines={1}
    >
      Profile
    </Text>
  </View>
);

// Main Tab Navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#8e8e8e',
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarItemStyle: {
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ focused }) => <HomeIcon focused={focused} /> 
        }}
      />
      <Tab.Screen 
        name="Explore" 
        component={ExploreScreen} 
        options={{
          tabBarIcon: ({ focused }) => <ExploreIcon focused={focused} /> 
        }}
      />
      <Tab.Screen
        name="CreateOptions"
        component={CreateOptionsScreen}
        options={{ 
          tabBarIcon: () => <CreatePostIcon /> 
        }}
      />
      <Tab.Screen 
        name="CreatePost" 
        component={CreatePostScreen} 
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: 'none' }
        }}
      />
      <Tab.Screen 
        name="Blogs"
        component={BlogScreen}
        options={{
          tabBarIcon: ({ focused }) => <BlogsIcon focused={focused} /> 
        }}
      />
      <Tab.Screen 
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <ProfileIcon focused={focused} /> 
        }}
      />
      <Tab.Screen 
        name="GroupScreen" 
        component={GroupScreen} 
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: 'none' }
        }}
      />
    </Tab.Navigator>
  );
};

// Root Navigator
const AppNavigator = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
       <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ headerShown: false }}
       >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Interests" component={InterestsScreen} />
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen name="CreatePost" component={CreatePostScreen} />
          <Stack.Screen name="GroupScreen" component={GroupScreen} />
          <Stack.Screen name="DynamicGroupScreen" component={DynamicGroupScreen} />
          <Stack.Screen 
            name="CommentsScreen" 
            component={CommentsScreen} 
            options={{
              presentation: 'transparentModal',
              animation: 'fade',
            }}
          />
          <Stack.Screen 
            name="LeaderboardScreen" 
            component={LeaderboardScreen} 
          />
          <Stack.Screen 
            name="BlogDetailsScreen" 
            component={BlogDetailsScreen} 
          />
          <Stack.Screen 
            name="RedirectScreen" 
            component={RedirectScreen} 
          />
          <Stack.Screen 
            name="ExploreScreen" 
            component={ExploreScreen} 
          />
          <Stack.Screen name="UnifiedReelsStream" component={UnifiedReelsStream} />
          <Stack.Screen name="WithdrawScreen" component={WithdrawScreen} />
          <Stack.Screen name="EarningsHubScreen" component={EarningsHubScreen} />
          <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
       </Stack.Navigator>
     </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: '#000000',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.2)',
    elevation: 0,
    height: 50,
    paddingTop: 8,
    paddingBottom: 4,
    shadowColor: 'transparent',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    paddingTop: 0,
  },
  tabIconImage: {
    width: 22,
    height: 22,
    marginBottom: 4,
    resizeMode: 'contain',
  },
  tabLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    width: 50,
    marginTop: 2,
  },
  tabLabelActive: {
    color: 'white',
    fontWeight: '700',
  },
  createPostContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(20,20,20,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  createPostImage: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
  },
});

export default AppNavigator; 