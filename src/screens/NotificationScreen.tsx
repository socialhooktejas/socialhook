import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Platform,
  Animated,
  Easing
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utils/theme';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Import icons
const backIcon = require('../assets/icons/back.png');

// Sample notification data with more enticing content
const NOTIFICATIONS = [
  {
    id: '1',
    type: 'like',
    user: {
      id: 'user1',
      username: 'jennywilson',
      avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
      isVerified: true,
    },
    content: 'and 24 others liked your post',
    isRead: false,
    time: '2m',
    internal: false,
    teaser: 'See who else liked it...'
  },
  {
    id: '2',
    type: 'dynamic_group',
    user: {
      id: 'user2',
      username: 'DynamicMusic',
      avatar: 'https://randomuser.me/api/portraits/men/63.jpg',
    },
    content: '🔥 Music battle getting intense! 4 rounds left',
    isRead: false,
    time: '8m',
    internal: true,
    highlight: true,
    urgent: true,
    teaser: 'Vote now to win 250 coins'
  },
  {
    id: '3',
    type: 'live',
    user: {
      id: 'user3',
      username: 'brooklynzoe',
      avatar: 'https://randomuser.me/api/portraits/women/43.jpg',
    },
    content: '⚡️ Keyboard battle heating up! Who wins?',
    isRead: false,
    time: 'LIVE',
    internal: true,
    highlight: true,
    liveCount: 324,
    urgent: true,
    teaser: 'Top players streaming now'
  },
  {
    id: '4',
    type: 'follow',
    user: {
      id: 'user4',
      username: 'robertfox',
      avatar: 'https://randomuser.me/api/portraits/men/63.jpg',
    },
    content: 'and 3 others started following you',
    isRead: false,
    time: '22m',
    internal: false,
    teaser: 'View profiles'
  },
  {
    id: '5',
    type: 'trending',
    user: {
      id: 'user5',
      username: 'TrendSpotters',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    content: '🤯 This debate is breaking the internet!',
    isRead: false,
    time: '40m',
    internal: true,
    highlight: true,
    teaser: 'Controversial topic inside'
  },
  {
    id: '6',
    type: 'comment',
    user: {
      id: 'user6',
      username: 'brooklynzoe',
      avatar: 'https://randomuser.me/api/portraits/women/43.jpg',
    },
    content: 'replied: "Wait, is that really...?!"',
    isRead: true,
    time: '1h',
    internal: false,
    teaser: 'See full comment'
  },
  {
    id: '7',
    type: 'party',
    user: {
      id: 'user7',
      username: 'PartyStarters',
      avatar: 'https://randomuser.me/api/portraits/women/64.jpg',
    },
    content: '🎉 Secret party in Reels Zone! 10min left',
    isRead: false,
    time: 'ENDS SOON',
    internal: true,
    highlight: true,
    partyCount: 156,
    urgent: true,
    teaser: 'Exclusive gifts inside'
  },
  {
    id: '8',
    type: 'mention',
    user: {
      id: 'user8',
      username: 'cameronwill',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    content: 'mentioned you in a heated debate',
    isRead: false,
    time: '3h',
    internal: false,
    teaser: 'See what they said'
  },
  {
    id: '9',
    type: 'exclusive',
    user: {
      id: 'user9',
      username: 'VIPAccess',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    },
    content: '🌟 Limited spots: Creator meetup this weekend',
    isRead: false,
    time: '4h',
    internal: true,
    highlight: true,
    teaser: 'Only 8 spots left'
  },
  {
    id: '10',
    type: 'coin',
    user: {
      id: 'user10',
      username: 'kristinhall',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    },
    content: 'sent you 150 coins with a private message',
    isRead: false,
    time: '5h',
    internal: false,
    teaser: 'Tap to view message'
  },
  {
    id: '11',
    type: 'challenge',
    user: {
      id: 'user11',
      username: 'ChallengeChamps',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    },
    content: '🏆 New viral challenge - 1000 coins reward!',
    isRead: false,
    time: '6h',
    internal: true,
    highlight: true,
    teaser: 'Only 50 winners will qualify'
  },
  {
    id: '12',
    type: 'system',
    content: 'Your ranking jumped +12 spots this week!',
    isRead: false,
    time: '1d',
    internal: false,
    teaser: 'See full stats'
  },
];

// Filtered notification sections
const TODAY_NOTIFICATIONS = NOTIFICATIONS.filter(item => 
  item.time.includes('m') || item.time.includes('h')
);

const EARLIER_NOTIFICATIONS = NOTIFICATIONS.filter(item => 
  item.time.includes('d')
);

const NotificationScreen = () => {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState('all');
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const shineAnim = React.useRef(new Animated.Value(-100)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    ).start();
    
    Animated.loop(
      Animated.timing(shineAnim, {
        toValue: 250,
        duration: 1500,
        useNativeDriver: true
      })
    ).start();
  }, []);
  
  const getIconName = (type: string) => {
    switch(type) {
      case 'like': return 'heart';
      case 'follow': return 'user-plus';
      case 'comment': return 'comment';
      case 'mention': return 'at';
      case 'coin': return 'coins';
      case 'system': return 'bell';
      case 'blog': return 'book';
      case 'group': return 'users';
      case 'dynamic_group': return 'users-cog';
      case 'live': return 'broadcast-tower';
      case 'trending': return 'fire-alt';
      case 'party': return 'glass-cheers';
      case 'exclusive': return 'crown';
      case 'challenge': return 'trophy';
      default: return 'bell';
    }
  };
  
  const getIconColor = (type: string) => {
    switch(type) {
      case 'like': return '#FF5655';
      case 'follow': return '#4A90E2';
      case 'comment': return '#50C878';
      case 'mention': return '#9966CC';
      case 'coin': return '#FFD700';
      case 'system': return '#FF9500';
      case 'blog': return '#007AFF';
      case 'group': return '#4A90E2';
      case 'dynamic_group': return '#8A2BE2';
      case 'live': return '#FF0000';
      case 'trending': return '#FF6347';
      case 'party': return '#FF1493';
      case 'exclusive': return '#FFD700';
      case 'challenge': return '#FF4500';
      default: return '#FF9500';
    }
  };
  
  const filteredNotifications = activeFilter === 'all' 
    ? NOTIFICATIONS 
    : activeFilter === 'internal' 
      ? NOTIFICATIONS.filter(item => item.internal) 
      : NOTIFICATIONS.filter(item => !item.internal);
  
  const filteredTodayNotifications = filteredNotifications.filter(item => 
    item.time.includes('m') || item.time.includes('h')
  );
  
  const filteredEarlierNotifications = filteredNotifications.filter(item => 
    item.time.includes('d')
  );

  const renderNotificationItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          !item.isRead && styles.unreadNotification,
          item.highlight && styles.highlightedNotification,
          item.urgent && styles.urgentNotification
        ]}
        activeOpacity={0.7}
      >
        {item.highlight && (
          <Animated.View 
            style={[
              styles.pulseOverlay,
              { transform: [{ scale: pulseAnim }] }
            ]}
          />
        )}
        
        {item.urgent && (
          <Animated.View 
            style={[
              styles.shineEffect,
              { transform: [{ translateX: shineAnim }] }
            ]}
          />
        )}
        
        <View style={styles.notificationContent}>
          {item.type === 'system' ? (
            <View style={[styles.systemIconContainer, {backgroundColor: `${getIconColor(item.type)}20`}]}>
              <FontAwesome5 name={getIconName(item.type)} size={18} color={getIconColor(item.type)} />
            </View>
          ) : (
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: item.user?.avatar }} 
                style={styles.userAvatar} 
              />
              <View style={[
                styles.iconOverlay, 
                {backgroundColor: getIconColor(item.type)}
              ]}>
                <FontAwesome5 name={getIconName(item.type)} size={10} color="#fff" solid />
              </View>
            </View>
          )}
          
          <View style={styles.notificationBody}>
            <View style={styles.notificationTextRow}>
              {item.type !== 'system' && (
                <Text numberOfLines={1} style={styles.username}>
                  {item.user.username}
                  {item.user.isVerified && <Text style={styles.verifiedBadge}> ✓</Text>}
                </Text>
              )}
              <Text numberOfLines={2} style={[
                styles.notificationText,
                item.internal && styles.internalNotificationText,
                item.urgent && styles.urgentText
              ]}>
                {item.content}
              </Text>
            </View>
            
            {item.teaser && (
              <Text style={styles.teaserText}>{item.teaser}</Text>
            )}
            
            {(item.liveCount || item.partyCount) && (
              <View style={styles.countBadge}>
                <FontAwesome5 name="user" size={10} color="#fff" solid />
                <Text style={styles.countText}>{item.liveCount || item.partyCount}</Text>
                <Text style={styles.countLabel}>watching</Text>
              </View>
            )}
            
            <Text style={[
              styles.timeText,
              (item.time === 'LIVE' || item.time === 'ENDS SOON') && styles.liveTimeText
            ]}>
              {item.time}
            </Text>
          </View>

          <View style={styles.actionContainer}>
            {item.internal ? (
              <TouchableOpacity style={[
                styles.joinButton,
                item.urgent && styles.urgentButton
              ]}>
                <Text style={styles.joinButtonText}>
                  {item.urgent ? 'Join Now' : 'View'}
                </Text>
              </TouchableOpacity>
            ) : (
              <MaterialIcons name="chevron-right" size={20} color="rgba(255,255,255,0.6)" />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image source={backIcon} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.settingsButton}>
            <View style={styles.unreadCountBadge}>
              <Text style={styles.unreadCountText}>7</Text>
            </View>
            <FontAwesome5 name="sliders-h" size={18} color="#FFF" />
          </View>
        </View>
        
        {/* Filter tabs */}
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[styles.filterTab, activeFilter === 'all' && styles.activeFilterTab]}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[styles.filterText, activeFilter === 'all' && styles.activeFilterText]}>
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterTab, activeFilter === 'internal' && styles.activeFilterTab]}
            onPress={() => setActiveFilter('internal')}
          >
            <View style={styles.filterTabContent}>
              <Text style={[styles.filterText, activeFilter === 'internal' && styles.activeFilterText]}>
                For You
              </Text>
              <View style={styles.newItemBadge} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterTab, activeFilter === 'external' && styles.activeFilterTab]}
            onPress={() => setActiveFilter('external')}
          >
            <Text style={[styles.filterText, activeFilter === 'external' && styles.activeFilterText]}>
              Activity
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Main content */}
        <FlatList
          data={[
            { key: 'today', title: 'New', data: filteredTodayNotifications },
            { key: 'earlier', title: 'Earlier', data: filteredEarlierNotifications },
          ].filter(section => section.data.length > 0)}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <>
              {renderSectionHeader(item.title)}
              {item.data.map((notification) => (
                <React.Fragment key={notification.id}>
                  {renderNotificationItem({ item: notification })}
                </React.Fragment>
              ))}
            </>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.notificationsList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 44,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backIcon: {
    width: 22,
    height: 22,
    tintColor: '#FFF',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'relative',
  },
  unreadCountBadge: {
    position: 'absolute',
    top: 4,
    right: 0,
    backgroundColor: colors.primary,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  unreadCountText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    backgroundColor: '#0A0A0A',
  },
  filterTab: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    flex: 1,
    alignItems: 'center',
  },
  filterTabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  newItemBadge: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginLeft: 4,
  },
  activeFilterTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  filterText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13.5,
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFF',
    fontWeight: '700',
  },
  notificationsList: {
    paddingBottom: Platform.OS === 'ios' ? 80 : 70,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(10,10,10,0.95)',
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12.5,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notificationItem: {
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
    position: 'relative',
    overflow: 'hidden',
  },
  unreadNotification: {
    backgroundColor: 'rgba(50,128,255,0.08)',
  },
  highlightedNotification: {
    backgroundColor: 'rgba(50,128,255,0.1)',
  },
  urgentNotification: {
    backgroundColor: 'rgba(255,40,40,0.1)',
  },
  pulseOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(74,144,226,0.05)',
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  shineEffect: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 60,
    backgroundColor: 'rgba(255,255,255,0.05)',
    transform: [{ skewX: '-20deg' }],
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 2,
  },
  avatarContainer: {
    position: 'relative',
    width: 42,
    height: 42,
    borderRadius: 21,
    marginTop: 2,
  },
  userAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  iconOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF5655',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#000',
  },
  systemIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,149,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  notificationBody: {
    flex: 1,
    marginLeft: 12,
    marginRight: 4,
    justifyContent: 'flex-start',
  },
  notificationTextRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  username: {
    fontWeight: '700',
    color: '#FFF',
    marginRight: 5,
    fontSize: 14,
    width: '100%',
  },
  notificationText: {
    fontSize: 14,
    lineHeight: 18,
    color: '#FFF',
    flexShrink: 1,
    marginTop: 1,
    width: '100%',
  },
  internalNotificationText: {
    color: '#FFF',
    fontWeight: '500',
  },
  teaserText: {
    fontSize: 12.5,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 3,
  },
  urgentText: {
    color: '#FFF',
    fontWeight: '600',
  },
  verifiedBadge: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  countText: {
    fontSize: 10,
    color: '#FFF',
    marginLeft: 3,
    marginRight: 2,
    fontWeight: '600',
  },
  countLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
  },
  timeText: {
    fontSize: 11.5,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
    fontWeight: '500',
  },
  liveTimeText: {
    color: '#FF3B30',
    fontWeight: '700',
  },
  actionContainer: {
    marginLeft: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 6,
  },
  joinButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  urgentButton: {
    backgroundColor: '#FF3B30',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default NotificationScreen; 