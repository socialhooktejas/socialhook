import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utils/theme';

// Icons
const backIcon = require('../assets/icons/back.png');
const infoIcon = require('../assets/icons/more.png');
const coinIcon = require('../assets/icons/coin.png');
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
  const [countdownTimer, setCountdownTimer] = useState('4d 10h 27m 53s');
  const fadeAnim = useState(new Animated.Value(0))[0];
  
  // Simulate countdown timer
  useEffect(() => {
    // In a real app, this would be synchronized with a server
    const interval = setInterval(() => {
      // Just for demo purposes; in a real app, calculate this from an end date
      const times = ['4d 10h 27m 53s', '4d 10h 27m 52s', '4d 10h 27m 51s'];
      setCountdownTimer(times[Math.floor(Math.random() * times.length)]);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
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
              {second.isVerified && <View style={styles.verifiedBadgeSmall} />}
            </View>
            <View style={styles.podiumRankContainer}>
              <Text style={styles.podiumRankNumber}>2</Text>
            </View>
            <View style={styles.podiumBase}>
              <View style={styles.coinContainer}>
                <Image source={coinIcon} style={styles.coinIcon} />
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
              {first.isVerified && <View style={styles.verifiedBadgeSmall} />}
            </View>
            <View style={[styles.podiumRankContainer, styles.podiumRankFirst]}>
              <Text style={styles.podiumRankNumber}>1</Text>
            </View>
            <View style={[styles.podiumBase, styles.podiumBaseFirst]}>
              <View style={styles.coinContainer}>
                <Image source={coinIcon} style={styles.coinIcon} />
                <Text style={styles.podiumCoins}>{formatNumber(first.coins)}</Text>
              </View>
            </View>
          </View>
          
          {/* Third Place */}
          <View style={[styles.podiumItem, styles.podiumThird]}>
            <Image source={{ uri: third.avatar }} style={styles.podiumAvatar} />
            <View style={styles.podiumNameContainer}>
              <Text style={styles.podiumUsername}>@{third.username}</Text>
              {third.isVerified && <View style={styles.verifiedBadgeSmall} />}
            </View>
            <View style={styles.podiumRankContainer}>
              <Text style={styles.podiumRankNumber}>3</Text>
            </View>
            <View style={styles.podiumBase}>
              <View style={styles.coinContainer}>
                <Image source={coinIcon} style={styles.coinIcon} />
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
              {USER_RANK.isVerified && <View style={styles.verifiedBadgeSmall} />}
            </View>
            <Text style={styles.yourRankFullName}>{USER_RANK.fullName}</Text>
          </View>
          
          <View style={styles.yourRankCoinsContainer}>
            <Image source={coinIcon} style={styles.yourRankCoinIcon} />
            <Text style={styles.yourRankCoins}>{formatNumber(USER_RANK.coins)}</Text>
          </View>
        </View>
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
        <Text style={styles.headerTitle}>Weekly Ranking</Text>
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
            {item.isVerified && <View style={styles.verifiedBadgeSmall} />}
          </View>
          <Text style={styles.rankFullName}>{item.fullName}</Text>
        </View>
        
        <View style={styles.rankCoinsContainer}>
          <Image source={coinIcon} style={styles.rankCoinIcon} />
          <Text style={styles.rankCoins}>{formatNumber(item.coins)}</Text>
        </View>
      </View>
    );
  };
  
  const renderListHeader = () => (
    <>
      <View style={styles.refreshContainer}>
        <Text style={styles.refreshText}>Refresh in</Text>
        <View style={styles.timerContainer}>
          <Image source={refreshIcon} style={styles.refreshIcon} />
          <Text style={styles.timerText}>{countdownTimer}</Text>
        </View>
      </View>
      
      {renderPodium()}
      {renderUserRank()}
      
      <View style={styles.listHeaderContainer}>
        <Text style={styles.listHeaderTitle}>All Rankings</Text>
      </View>
    </>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
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
        
        <View style={styles.convertContainer}>
          <TouchableOpacity style={styles.convertButton}>
            <Text style={styles.convertButtonText}>Convert Coins to Cash</Text>
          </TouchableOpacity>
          <Text style={styles.convertNote}>1,000 coins = $1.00 USD</Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    alignItems: 'center',
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  refreshText: {
    fontSize: 14,
    color: '#666',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshIcon: {
    width: 16,
    height: 16,
    tintColor: colors.primary,
    marginRight: 6,
  },
  timerText: {
    fontSize: 14,
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
  coinIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
    tintColor: '#FFD700',
  },
  podiumCoins: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  verifiedBadgeSmall: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginLeft: 4,
  },
  yourRankContainer: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
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
  yourRankCoinIcon: {
    width: 18,
    height: 18,
    marginRight: 6,
    tintColor: '#FFD700',
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
  rankCoinIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
    tintColor: '#FFD700',
  },
  rankCoins: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  convertContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 8,
  },
  convertButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    width: '90%',
    alignItems: 'center',
  },
  convertButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  convertNote: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
});

export default LeaderboardScreen; 