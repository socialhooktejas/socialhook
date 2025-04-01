import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Animated,
  Image
} from 'react-native';
import { colors, typography, spacing } from '../utils/theme';

// Import icons
const searchIcon = require('../assets/icons/search.png');
const podiumIcon = require('../assets/icons/podium.png');

interface HomeHeaderProps {
  onNotificationPress: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ onNotificationPress }) => {
  const [activeTab, setActiveTab] = useState<'following' | 'forYou'>('forYou');

  const handleTabPress = (tab: 'following' | 'forYou') => {
    setActiveTab(tab);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={styles.tabButton} 
          onPress={() => handleTabPress('following')}
        >
          <Text style={[
            styles.tabText, 
            activeTab === 'following' && styles.activeTabText
          ]}>
            Following
          </Text>
          {activeTab === 'following' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabButton} 
          onPress={() => handleTabPress('forYou')}
        >
          <Text style={[
            styles.tabText, 
            activeTab === 'forYou' && styles.activeTabText
          ]}>
            For You
          </Text>
          {activeTab === 'forYou' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Image source={podiumIcon} style={styles.actionIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Image source={searchIcon} style={styles.actionIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.medium,
    paddingTop: spacing.medium + 10, // Add 10px from top as requested
    paddingBottom: spacing.small,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  tabButton: {
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    position: 'relative',
    alignItems: 'center',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: typography.fontSize.medium,
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 20,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: spacing.medium,
  },
  actionIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
    resizeMode: 'contain',
  },
});

export default HomeHeader; 