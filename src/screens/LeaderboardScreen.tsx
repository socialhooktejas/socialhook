import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utils/theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// Icons
const backIcon = require('../assets/icons/back.png');
const infoIcon = require('../assets/icons/more.png');
const refreshIcon = require('../assets/icons/refresh.png');

// Sample data for the leaderboard
const LEADERBOARD_DATA = [
  {
    id: '1',
    rank: 1,
    username: 'haiifamaj',
    fullName: 'Haifa Majd',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    coins: 459400,
    isVerified: true,
  },
  {
    id: '2',
    rank: 2,
    username: 'neoylady',
    fullName: 'Neha Sharma',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    coins: 307700,
    isVerified: true,
  },
  {
    id: '3',
    rank: 3,
    username: 'daziix',
    fullName: 'Daria Kowalski',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    coins: 303600,
    isVerified: false,
  },
  {
    id: '4',
    rank: 4,
    username: 'cynthia3225',
    fullName: 'Cynthia Rodriguez',
    avatar: 'https://randomuser.me/api/portraits/women/89.jpg',
    coins: 252400,
    isVerified: false,
  },
  {
    id: '5',
    rank: 5,
    username: 'vvip.q8',
    fullName: 'Mohammed Al-Sabah',
    avatar: 'https://randomuser.me/api/portraits/men/76.jpg',
    coins: 246200,
    isVerified: true,
  },
  {
    id: '6',
    rank: 6,
    username: 'falcao8000',
    fullName: 'Falcao Garcia',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    coins: 238500,
    isVerified: true,
  },
  {
    id: '7',
    rank: 7,
    username: 'emma.watson',
    fullName: 'Emma Watson',
    avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
    coins: 215700,
    isVerified: true,
  },
  {
    id: '8',
    rank: 8,
    username: 'tech_guru',
    fullName: 'Ryan Cooper',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    coins: 194300,
    isVerified: false,
  },
  {
    id: '9',
    rank: 9,
    username: 'fitness_pro',
    fullName: 'Jessica Andrews',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    coins: 183600,
    isVerified: true,
  },
  {
    id: '10',
    rank: 10,
    username: 'chef_mike',
    fullName: 'Michael Chen',
    avatar: 'https://randomuser.me/api/portraits/men/34.jpg',
    coins: 175200,
    isVerified: false,
  },
  // Additional data for showing more users
  {
    id: '11',
    rank: 11,
    username: 'travel_addict',
    fullName: 'Sarah Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/29.jpg',
    coins: 165800,
    isVerified: true,
  },
  {
    id: '12',
    rank: 12,
    username: 'music_lover',
    fullName: 'David Kim',
    avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
    coins: 158900,
    isVerified: false,
  },
];

// User's own ranking data (would come from API/authentication in real app)
const USER_RANK = {
  rank: 285,
  username: 'your_username',
  fullName: 'Your Name',
  avatar: 'https://randomuser.me/api/portraits/men/57.jpg',
  coins: 34250,
  isVerified: true,
};

interface LeaderboardItem {
  id: string;
  rank: number;
  username: string;
  fullName: string;
  avatar: string;
  coins: number;
  isVerified: boolean;
}

const LeaderboardScreen = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [leaderboardData] = useState<LeaderboardItem[]>(LEADERBOARD_DATA);
  const [countdownTimer, setCountdownTimer] = useState('');
  const fadeAnim = useState(new Animated.Value(0))[0];
  const refreshIconAnim = useState(new Animated.Value(1))[0];
  
  // Reference to track if component is mounted
  const isMounted = useRef(true);
  
  // End time for the countdown (current time + 4 days, 10 hours, etc.)
  const endTimeRef = useRef(new Date().getTime() + (4 * 24 * 60 * 60 * 1000) + (10 * 60 * 60 * 1000) + (27 * 60 * 1000) + (53 * 1000));
  
  // Function to format countdown time
  const formatCountdown = (timeLeft: number) => {
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };
  
  // Real countdown timer
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const timeLeft = endTimeRef.current - now;
      
      if (timeLeft <= 0) {
        setCountdownTimer('0d 0h 0m 0s');
        return;
      }
      
      setCountdownTimer(formatCountdown(timeLeft));
    };
    
    // Initialize timer immediately
    updateTimer();
    
    // Then update every second
    const interval = setInterval(() => {
      if (isMounted.current) {
        updateTimer();
      }
    }, 1000);
    
    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, []);
  
  // Animate refresh icon
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(refreshIconAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(refreshIconAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    
    pulseAnimation.start();
    
    return () => pulseAnimation.stop();
  }, [refreshIconAnim]);
  
  // Fade in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);
  
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refreshing data
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };
  
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };
  
  const handleNavigateToWithdraw = () => {
    navigation.navigate('WithdrawScreen');
  };
  
  const renderPodium = () => {
    const top3 = leaderboardData.slice(0, 3);
    const [first, second, third] = top3;
    
    return (
      <View style={styles.podiumContainer}>
        <View style={styles.podiumWrapper}>
          {/* Second Place */}
          <View style={[styles.podiumItem, styles.podiumSecond]}>
            <Image source={{ uri: second.avatar }} style={styles.podiumAvatar} />
            <View style={styles.podiumNameContainer}>
              <Text style={styles.podiumUsername}>@{second.username}</Text>
            </View>
            <View style={styles.podiumRankContainer}>
              <Text style={styles.podiumRankNumber}>2</Text>
            </View>
            <View style={styles.podiumBase}>
              <View style={styles.coinContainer}>
                <FontAwesome5 name="coins" size={16} color="#FFD700" style={styles.coinIconFA} />
                <Text style={styles.podiumCoins}>{formatNumber(second.coins)}</Text>
              </View>
            </View>
          </View>
          
          {/* First Place */}
          <View style={[styles.podiumItem, styles.podiumFirst]}>
            <Image source={{ uri: first.avatar }} style={styles.podiumAvatarLarge} />
            <View style={[styles.podiumCrown]}>
              <Text style={styles.crownText}>👑</Text>
            </View>
            <View style={styles.podiumNameContainer}>
              <Text style={styles.podiumUsername}>@{first.username}</Text>
            </View>
            <View style={[styles.podiumRankContainer, styles.podiumRankFirst]}>
              <Text style={styles.podiumRankNumber}>1</Text>
            </View>
            <View style={[styles.podiumBase, styles.podiumBaseFirst]}>
              <View style={styles.coinContainer}>
                <FontAwesome5 name="coins" size={16} color="#FFD700" style={styles.coinIconFA} />
                <Text style={styles.podiumCoins}>{formatNumber(first.coins)}</Text>
              </View>
            </View>
          </View>
          
          {/* Third Place */}
          <View style={[styles.podiumItem, styles.podiumThird]}>
            <Image source={{ uri: third.avatar }} style={styles.podiumAvatar} />
            <View style={styles.podiumNameContainer}>
              <Text style={styles.podiumUsername}>@{third.username}</Text>
            </View>
            <View style={styles.podiumRankContainer}>
              <Text style={styles.podiumRankNumber}>3</Text>
            </View>
            <View style={styles.podiumBase}>
              <View style={styles.coinContainer}>
                <FontAwesome5 name="coins" size={16} color="#FFD700" style={styles.coinIconFA} />
                <Text style={styles.podiumCoins}>{formatNumber(third.coins)}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };
  
  const renderUserRank = () => {
    return (
      <View style={styles.yourRankWrapper}>
        <View style={styles.yourRankContainer}>
          <View style={styles.yourRankHeader}>
            <Text style={styles.yourRankTitle}>Your Ranking</Text>
            <TouchableOpacity>
              <Text style={styles.viewHistoryButton}>View History</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.yourRankContent}>
            <View style={styles.rankNumberContainer}>
              <Text style={styles.rankNumberText}>#{USER_RANK.rank}</Text>
            </View>
            
            <Image source={{ uri: USER_RANK.avatar }} style={styles.yourRankAvatar} />
            
            <View style={styles.yourRankDetails}>
              <View style={styles.yourRankNameContainer}>
                <Text style={styles.yourRankUsername}>@{USER_RANK.username}</Text>
              </View>
              <Text style={styles.yourRankFullName}>{USER_RANK.fullName}</Text>
            </View>
            
            <View style={styles.yourRankCoinsContainer}>
              <FontAwesome5 name="coins" size={18} color="#FFD700" style={styles.coinIconFA} />
              <Text style={styles.yourRankCoins}>{formatNumber(USER_RANK.coins)}</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.inlineConvertButton}
          onPress={handleNavigateToWithdraw}
          activeOpacity={0.8}
        >
          <View style={styles.convertIconContainer}>
            <FontAwesome5 name="coins" size={18} color="#FFD700" style={styles.coinIconFA} />
          </View>
          <View style={styles.convertTextContainer}>
            <Text style={styles.inlineConvertButtonText}>Convert Coins to Cash</Text>
            <Text style={styles.inlineConvertNote}>1,000 coins = $1.00 USD</Text>
          </View>
          <View style={styles.convertArrowContainer}>
            <FontAwesome name="chevron-right" size={14} color="#FFD700" />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Image source={backIcon} style={styles.backIcon} />
      </TouchableOpacity>
      
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>Leaderboard Ranking</Text>
      </View>
      
      <TouchableOpacity style={styles.infoButton}>
        <Image source={infoIcon} style={styles.infoIcon} />
      </TouchableOpacity>
    </View>
  );
  
  const renderItem = ({ item }: { item: LeaderboardItem }) => {
    // Skip rendering top 3 since they're in the podium
    if (item.rank <= 3) return null;
    
    return (
      <View style={styles.rankItemContainer}>
        <View style={styles.rankNumberContainer}>
          <Text style={styles.rankNumberText}>#{item.rank}</Text>
        </View>
        
        <Image source={{ uri: item.avatar }} style={styles.rankAvatar} />
        
        <View style={styles.rankDetails}>
          <View style={styles.rankNameContainer}>
            <Text style={styles.rankUsername}>@{item.username}</Text>
          </View>
          <Text style={styles.rankFullName}>{item.fullName}</Text>
        </View>
        
        <View style={styles.rankCoinsContainer}>
          <FontAwesome5 name="coins" size={16} color="#FFD700" style={styles.coinIconFA} />
          <Text style={styles.rankCoins}>{formatNumber(item.coins)}</Text>
        </View>
      </View>
    );
  };
  
  const renderListHeader = () => (
    <>
      <TouchableOpacity 
        style={styles.refreshContainer}
        onPress={onRefresh}
        activeOpacity={0.7}
      >
        <View style={styles.refreshLeftSection}>
          <View style={styles.refreshTextRow}>
            <Text style={styles.refreshText}>Leaderboard refreshes in:</Text>
          </View>
          <Text style={styles.timerText}>{countdownTimer}</Text>
        </View>
        <View style={styles.timerContainer}>
          <Animated.View style={{ transform: [{ scale: refreshIconAnim }] }}>
            <FontAwesome name="refresh" size={14} color={colors.primary} style={{marginRight: 4}} />
          </Animated.View>
          <Text style={styles.refreshNowText}>Refresh</Text>
        </View>
      </TouchableOpacity>
      
      {renderPodium()}
      {renderUserRank()}
      
      <View style={styles.listHeaderContainer}>
        <Text style={styles.listHeaderTitle}>All Rankings</Text>
      </View>
    </>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={true} />
      <View style={styles.statusBarSpacer} />
      
      {renderHeader()}
      
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        <FlatList
          data={leaderboardData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListHeaderComponent={renderListHeader}
          showsVerticalScrollIndicator={false}
          onRefresh={onRefresh}
          refreshing={refreshing}
          contentContainerStyle={styles.listContentContainer}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  statusBarSpacer: {
    height: StatusBar.currentHeight || 0,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    marginTop: -1, // Close the gap between header and content
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 5,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    height: 40,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: '#333',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  infoButton: {
    padding: 8,
  },
  infoIcon: {
    width: 20,
    height: 20,
    tintColor: '#333',
  },
  listContentContainer: {
    paddingBottom: 100,
  },
  refreshContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  refreshLeftSection: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  refreshTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  refreshText: {
    fontSize: 12,
    color: '#666',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d0e3ff',
  },
  refreshIcon: {
    width: 14,
    height: 14,
    tintColor: colors.primary,
    marginRight: 4,
  },
  timerText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
  },
  refreshNowText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  podiumContainer: {
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  podiumWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
  },
  podiumItem: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  podiumFirst: {
    marginTop: -25,
    zIndex: 3,
  },
  podiumSecond: {
    marginBottom: 15,
    zIndex: 2,
  },
  podiumThird: {
    marginBottom: 25,
    zIndex: 1,
  },
  podiumAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  podiumAvatarLarge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  podiumCrown: {
    position: 'absolute',
    top: -22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crownText: {
    fontSize: 24,
  },
  podiumNameContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 8,
  },
  podiumUsername: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginRight: 2,
  },
  podiumRankContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#C0C0C0',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  podiumRankFirst: {
    backgroundColor: '#FFD700',
  },
  podiumRankNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  podiumBase: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
  },
  podiumBaseFirst: {
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIconFA: {
    marginRight: 6,
  },
  podiumCoins: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  verifiedIcon: {
    width: 14,
    height: 14,
    tintColor: colors.primary,
    marginLeft: 4,
  },
  yourRankWrapper: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  yourRankContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  yourRankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.primary,
  },
  yourRankTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  viewHistoryButton: {
    fontSize: 12,
    color: '#fff',
    textDecorationLine: 'underline',
  },
  yourRankContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  rankNumberContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  yourRankAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 12,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  yourRankDetails: {
    flex: 1,
    marginLeft: 10,
  },
  yourRankNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yourRankUsername: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  yourRankFullName: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  yourRankCoinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  yourRankCoins: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  listHeaderContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  listHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  rankItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rankAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 12,
  },
  rankDetails: {
    flex: 1,
    marginLeft: 10,
  },
  rankNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankUsername: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  rankFullName: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  rankCoinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankCoins: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  inlineConvertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FFE082',
    marginTop: 4,
  },
  convertIconContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  convertTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  inlineConvertButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
  inlineConvertNote: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  convertArrowContainer: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LeaderboardScreen; 