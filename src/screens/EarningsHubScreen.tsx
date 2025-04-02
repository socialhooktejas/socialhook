import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utils/theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import Svg from 'react-native-svg';

// Import icons
const backIcon = require('../assets/icons/back.png');
const coinIcon = require('../assets/icons/coin.png');

// Screen dimensions
const { width, height } = Dimensions.get('window');

// Mock user data
const USER_DATA = {
  name: 'John Doe',
  username: '@johndoe',
  profilePic: 'https://randomuser.me/api/portraits/men/32.jpg',
  coins: 34250,
  usdBalance: 34.25, // 1000 coins = $1 USD
  totalEarned: 125.75,
  pendingPayout: 34.25,
  stats: {
    views: 1245000,
    likes: 87300,
    comments: 4210,
    shares: 6800,
  },
  recentTransactions: [
    { id: '1', type: 'earning', amount: 2500, source: 'Video views', date: '2023-10-15' },
    { id: '2', type: 'earning', amount: 5000, source: 'Challenge completion', date: '2023-10-12' },
    { id: '3', type: 'withdraw', amount: 10000, source: 'PayPal', date: '2023-10-01' },
    { id: '4', type: 'earning', amount: 1800, source: 'Post engagement', date: '2023-09-28' },
  ],
};

// Add earnings analytics data
const PERFORMANCE_DATA = {
  lastMonth: {
    earnings: [5.25, 7.50, 3.80, 9.20, 6.75, 8.15, 12.30, 7.85, 10.50, 8.90, 11.45, 13.75, 9.30, 14.20],
    dates: ['Oct 1', 'Oct 3', 'Oct 5', 'Oct 7', 'Oct 9', 'Oct 11', 'Oct 13', 'Oct 15', 'Oct 17', 'Oct 19', 'Oct 21', 'Oct 23', 'Oct 25', 'Oct 27'],
  },
  contentTypes: [
    { type: 'Videos', percentage: 65, color: '#4A00E0' },
    { type: 'Posts', percentage: 20, color: '#FF5722' },
    { type: 'Comments', percentage: 10, color: '#4CAF50' },
    { type: 'Referrals', percentage: 5, color: '#FFC107' },
  ],
  earningOpportunities: [
    { id: '1', title: 'Create 3 short videos', reward: 500, progress: 1, total: 3, icon: 'video-camera' },
    { id: '2', title: 'Get 10K views on content', reward: 1000, progress: 7500, total: 10000, icon: 'eye' },
    { id: '3', title: 'Invite 5 friends', reward: 750, progress: 2, total: 5, icon: 'user-plus' },
    { id: '4', title: 'Post 7 days in a row', reward: 1200, progress: 4, total: 7, icon: 'calendar-check-o' },
  ]
};

// Add transaction history data
const TRANSACTION_HISTORY = [
  { id: '1', type: 'earning', amount: 2500, source: 'Video views', date: '2023-10-15', status: 'completed' },
  { id: '2', type: 'earning', amount: 5000, source: 'Challenge completion', date: '2023-10-12', status: 'completed' },
  { id: '3', type: 'withdraw', amount: 10000, source: 'PayPal', date: '2023-10-01', status: 'completed' },
  { id: '4', type: 'earning', amount: 1800, source: 'Post engagement', date: '2023-09-28', status: 'completed' },
  { id: '5', type: 'withdraw', amount: 7500, source: 'Bank Transfer', date: '2023-09-15', status: 'completed' },
  { id: '6', type: 'earning', amount: 3200, source: 'Referral bonus', date: '2023-09-10', status: 'completed' },
];

// Add monetization tips data
const MONETIZATION_TIPS = [
  {
    id: '1',
    title: 'Post Consistently',
    description: 'Content creators who post 3-5 times per week earn up to 2.8x more than those who post less frequently.',
    icon: 'calendar',
  },
  {
    id: '2',
    title: 'Engage With Your Audience',
    description: 'Responding to comments within 24 hours can increase your engagement rate by up to 50%.',
    icon: 'comments',
  },
  {
    id: '3',
    title: 'Create Trending Content',
    description: 'Content aligned with current trends receives up to 3x more views and interactions.',
    icon: 'line-chart',
  },
  {
    id: '4',
    title: 'Cross-Promote',
    description: 'Creators who cross-promote their content on other platforms see 70% higher earnings.',
    icon: 'share-alt',
  },
];

// Add quick actions data
const QUICK_ACTIONS = [
  { id: '1', title: 'Withdraw', icon: 'money', color: '#4CAF50', screen: 'WithdrawScreen' },
  { id: '2', title: 'Analytics', icon: 'bar-chart', color: '#2196F3', screen: 'AnalyticsScreen' },
  { id: '3', title: 'Referrals', icon: 'users', color: '#FF9800', screen: 'ReferralScreen' },
  { id: '4', title: 'Settings', icon: 'cog', color: '#9C27B0', screen: 'EarningsSettingsScreen' },
];

const EarningsHubScreen = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [calculatorVisible, setCalculatorVisible] = useState(false);
  const [calculatorValues, setCalculatorValues] = useState({
    views: '10000',
    engagementRate: '5',
    contentFrequency: '3',
  });
  const calculatorRef = useRef(null);
  
  // Handle navigation back
  const handleBackPress = () => {
    navigation.goBack();
  };
  
  // Placeholder for future functionality
  const handleWithdrawPress = () => {
    navigation.navigate('WithdrawScreen');
  };
  
  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Format date string to display in a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Calculate potential earnings based on user inputs
  const calculatePotentialEarnings = () => {
    const views = parseInt(calculatorValues.views) || 0;
    const engagementRate = parseInt(calculatorValues.engagementRate) || 0;
    const contentFrequency = parseInt(calculatorValues.contentFrequency) || 0;
    
    // Simple calculation for demo purposes
    const weeklyViews = views * contentFrequency;
    const monthlyViews = weeklyViews * 4;
    const engagements = monthlyViews * (engagementRate / 100);
    
    // Assume a CPM of $3.75 (earning per 1000 views)
    const viewEarnings = (monthlyViews / 1000) * 3.75;
    
    // Assume engagement bonus
    const engagementBonus = engagements * 0.001;
    
    // Total monthly earnings
    const totalEarnings = viewEarnings + engagementBonus;
    
    return {
      weekly: (totalEarnings / 4).toFixed(2),
      monthly: totalEarnings.toFixed(2),
      yearly: (totalEarnings * 12).toFixed(2),
    };
  };
  
  // Handle quick action navigation
  const handleQuickAction = (screen) => {
    if (screen === 'WithdrawScreen') {
      navigation.navigate(screen);
    } else {
      // For screens that might not exist yet, show a coming soon message
      alert(`${screen} coming soon!`);
    }
  };
  
  // Balance card with animated shine effect
  const renderBalanceCard = () => {
    return (
      <LinearGradient
        colors={['#4A00E0', '#8E2DE2']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.balanceCard}
      >
        <View style={styles.balanceCardContent}>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <TouchableOpacity 
              style={styles.withdrawButton}
              onPress={handleWithdrawPress}
            >
              <Text style={styles.withdrawButtonText}>Withdraw</Text>
              <FontAwesome name="arrow-right" size={12} color="white" style={styles.withdrawArrow} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.coinsContainer}>
            <Image source={coinIcon} style={styles.coinIconLarge} />
            <Text style={styles.coinBalance}>{formatNumber(USER_DATA.coins)}</Text>
          </View>
          
          <Text style={styles.usdBalance}>${USER_DATA.usdBalance.toFixed(2)} USD</Text>
          
          <View style={styles.exchangeRateContainer}>
            <Text style={styles.exchangeRate}>1,000 coins = $1.00 USD</Text>
          </View>
        </View>
        
        {/* Card highlight effect */}
        <View style={styles.shine}></View>
      </LinearGradient>
    );
  };
  
  // Earnings stats cards
  const renderEarningsStats = () => {
    return (
      <View style={styles.statsContainer}>
        <View style={styles.statsCard}>
          <View style={styles.statsIconContainer}>
            <FontAwesome name="dollar" size={16} color="#4A00E0" />
          </View>
          <Text style={styles.statsTitle}>Total Earned</Text>
          <Text style={styles.statsValue}>${USER_DATA.totalEarned}</Text>
          <Text style={styles.statsSubtext}>Lifetime</Text>
        </View>
        
        <View style={styles.statsCard}>
          <View style={styles.statsIconContainer}>
            <FontAwesome name="clock-o" size={16} color="#FF5722" />
          </View>
          <Text style={styles.statsTitle}>Pending</Text>
          <Text style={styles.statsValue}>${USER_DATA.pendingPayout}</Text>
          <Text style={styles.statsSubtext}>Processing</Text>
        </View>
        
        <View style={styles.statsCard}>
          <View style={styles.statsIconContainer}>
            <FontAwesome name="line-chart" size={16} color="#4CAF50" />
          </View>
          <Text style={styles.statsTitle}>CPM</Text>
          <Text style={styles.statsValue}>$3.75</Text>
          <Text style={styles.statsSubtext}>Average</Text>
        </View>
      </View>
    );
  };
  
  // Render earnings chart with simpler implementation and better fallback
  const renderEarningsChart = () => {
    // Simple fallback chart that doesn't rely on external library
    const renderBasicChart = () => {
      const chartData = [
        { week: 'Week 1', amount: 5.25 },
        { week: 'Week 2', amount: 8.75 },
        { week: 'Week 3', amount: 10.50 },
        { week: 'Week 4', amount: 14.20 },
      ];
      
      // Find max value for scaling
      const maxValue = Math.max(...chartData.map(item => item.amount));
      
      return (
        <View style={styles.basicChartContainer}>
          <View style={styles.basicChartBars}>
            {chartData.map((item, index) => (
              <View key={index} style={styles.basicChartBarContainer}>
                <View style={styles.basicChartBarWrapper}>
                  <LinearGradient
                    colors={['#8E2DE2', '#4A00E0']}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                    style={[
                      styles.basicChartBar, 
                      { height: `${(item.amount / maxValue) * 100}%` }
                    ]}
                  />
                </View>
                <Text style={styles.basicChartValue}>${item.amount}</Text>
                <Text style={styles.basicChartLabel}>{item.week}</Text>
              </View>
            ))}
          </View>
        </View>
      );
    };
    
    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Earnings Trend</Text>
          <Text style={styles.chartPeriod}>Last 30 Days</Text>
        </View>
        
        {renderBasicChart()}
      </View>
    );
  };
  
  // Render revenue breakdown
  const renderRevenueBreakdown = () => {
    return (
      <View style={styles.breakdownContainer}>
        <Text style={styles.sectionTitle}>Revenue Breakdown</Text>
        <View style={styles.breakdownContent}>
          {PERFORMANCE_DATA.contentTypes.map((item, index) => (
            <View key={index} style={styles.breakdownItem}>
              <View style={styles.breakdownVisual}>
                <View style={[styles.breakdownBar, { width: `${item.percentage}%`, backgroundColor: item.color }]} />
              </View>
              <View style={styles.breakdownInfo}>
                <Text style={styles.breakdownType}>{item.type}</Text>
                <Text style={styles.breakdownPercentage}>{item.percentage}%</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };
  
  // Render earning opportunities
  const renderEarningOpportunities = () => {
    return (
      <View style={styles.opportunitiesContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Earning Opportunities</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {PERFORMANCE_DATA.earningOpportunities.map((item) => (
          <View key={item.id} style={styles.opportunityCard}>
            <View style={styles.opportunityIcon}>
              <FontAwesome name={item.icon} size={18} color="#4A00E0" />
            </View>
            
            <View style={styles.opportunityContent}>
              <Text style={styles.opportunityTitle}>{item.title}</Text>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${(item.progress / item.total) * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {Math.round((item.progress / item.total) * 100)}%
                </Text>
              </View>
            </View>
            
            <View style={styles.opportunityReward}>
              <Image source={coinIcon} style={styles.opportunityCoinIcon} />
              <Text style={styles.opportunityRewardText}>{item.reward}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };
  
  // Render transaction history
  const renderTransactionHistory = () => {
    return (
      <View style={styles.transactionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {TRANSACTION_HISTORY.slice(0, 4).map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={[
              styles.transactionIconContainer, 
              { backgroundColor: transaction.type === 'earning' ? '#E8F5E9' : '#FFF3E0' }
            ]}>
              <FontAwesome 
                name={transaction.type === 'earning' ? 'arrow-down' : 'arrow-up'} 
                size={14} 
                color={transaction.type === 'earning' ? '#4CAF50' : '#FF9800'} 
              />
            </View>
            
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionSource}>{transaction.source}</Text>
              <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
            </View>
            
            <View style={styles.transactionAmountContainer}>
              <Text style={[
                styles.transactionAmount,
                { color: transaction.type === 'earning' ? '#4CAF50' : '#FF9800' }
              ]}>
                {transaction.type === 'earning' ? '+' : '-'} {transaction.amount}
              </Text>
              <Image source={coinIcon} style={styles.transactionCoinIcon} />
            </View>
          </View>
        ))}
        
        <TouchableOpacity style={styles.showMoreButton}>
          <Text style={styles.showMoreText}>Show More Transactions</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  // Render earnings calculator
  const renderEarningsCalculator = () => {
    const potentialEarnings = calculatePotentialEarnings();
    
    return (
      <View style={styles.calculatorContainer} ref={calculatorRef}>
        <View style={styles.calculatorHeader}>
          <Text style={styles.calculatorTitle}>Earnings Calculator</Text>
          <TouchableOpacity 
            style={styles.calculatorToggle}
            onPress={() => setCalculatorVisible(!calculatorVisible)}
          >
            <FontAwesome 
              name={calculatorVisible ? 'chevron-up' : 'chevron-down'} 
              size={14} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>
        
        {calculatorVisible && (
          <View style={styles.calculatorContent}>
            <Text style={styles.calculatorDescription}>
              Estimate your potential earnings based on your content performance.
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Average Views per Content</Text>
              <TextInput
                style={styles.calculatorInput}
                keyboardType="numeric"
                value={calculatorValues.views}
                onChangeText={(value) => setCalculatorValues({...calculatorValues, views: value})}
                placeholder="10000"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Engagement Rate (%)</Text>
              <TextInput
                style={styles.calculatorInput}
                keyboardType="numeric"
                value={calculatorValues.engagementRate}
                onChangeText={(value) => setCalculatorValues({...calculatorValues, engagementRate: value})}
                placeholder="5"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Content Per Week</Text>
              <TextInput
                style={styles.calculatorInput}
                keyboardType="numeric"
                value={calculatorValues.contentFrequency}
                onChangeText={(value) => setCalculatorValues({...calculatorValues, contentFrequency: value})}
                placeholder="3"
              />
            </View>
            
            <View style={styles.resultContainer}>
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>Weekly</Text>
                <Text style={styles.resultValue}>${potentialEarnings.weekly}</Text>
              </View>
              
              <View style={[styles.resultCard, styles.primaryResultCard]}>
                <Text style={[styles.resultLabel, {color: 'white'}]}>Monthly</Text>
                <Text style={[styles.resultValue, {color: 'white'}]}>${potentialEarnings.monthly}</Text>
              </View>
              
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>Yearly</Text>
                <Text style={styles.resultValue}>${potentialEarnings.yearly}</Text>
              </View>
            </View>
            
            <Text style={styles.calculatorDisclaimer}>
              * These calculations are estimates based on platform averages.
              Actual earnings may vary based on content quality, audience engagement, and other factors.
            </Text>
          </View>
        )}
      </View>
    );
  };
  
  // Render quick actions
  const renderQuickActions = () => {
    return (
      <View style={styles.quickActionsContainer}>
        {QUICK_ACTIONS.map((action) => (
          <TouchableOpacity 
            key={action.id} 
            style={styles.quickActionButton}
            onPress={() => handleQuickAction(action.screen)}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
              <FontAwesome name={action.icon} size={18} color="white" />
            </View>
            <Text style={styles.quickActionTitle}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  // Render monetization tips
  const renderMonetizationTips = () => {
    return (
      <View style={styles.tipsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Monetization Tips</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>More Tips</Text>
          </TouchableOpacity>
        </View>
        
        {MONETIZATION_TIPS.slice(0, 2).map((tip) => (
          <View key={tip.id} style={styles.tipCard}>
            <View style={styles.tipIconContainer}>
              <FontAwesome name={tip.icon} size={18} color="#4A00E0" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipDescription}>{tip.description}</Text>
            </View>
          </View>
        ))}
        
        <TouchableOpacity style={styles.seeMoreTipsButton}>
          <Text style={styles.seeMoreTipsText}>SEE ALL MONETIZATION TIPS</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  // Footer with upgrade to pro option
  const renderFooter = () => {
    return (
      <View style={styles.footerContainer}>
        <LinearGradient
          colors={['rgba(74, 0, 224, 0.05)', 'rgba(74, 0, 224, 0.15)']}
          style={styles.footerGradient}
        >
          <View style={styles.footerContent}>
            <View style={styles.footerTextContainer}>
              <Text style={styles.footerTitle}>Upgrade to Creator Pro</Text>
              <Text style={styles.footerDescription}>
                Unlock premium features and earn up to 30% more from your content
              </Text>
            </View>
            
            <TouchableOpacity style={styles.upgradeButton}>
              <LinearGradient
                colors={['#4A00E0', '#8E2DE2']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.upgradeButtonGradient}
              >
                <Text style={styles.upgradeButtonText}>UPGRADE</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A00E0" />
      
      {/* Header */}
      <LinearGradient
        colors={['#4A00E0', '#8E2DE2']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <Image source={backIcon} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Creator Earnings</Text>
        <TouchableOpacity style={styles.infoButton}>
          <FontAwesome name="question-circle" size={22} color="white" />
        </TouchableOpacity>
      </LinearGradient>
      
      {/* Main Content */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Card */}
        {renderBalanceCard()}
        
        {/* Quick Actions */}
        {renderQuickActions()}
        
        {/* Earnings Stats */}
        {renderEarningsStats()}
        
        {/* Earnings Calculator */}
        {renderEarningsCalculator()}
        
        {/* Earnings Analytics */}
        {renderEarningsChart()}
        
        {/* Revenue Breakdown */}
        {renderRevenueBreakdown()}
        
        {/* Transaction History */}
        {renderTransactionHistory()}
        
        {/* Earning Opportunities */}
        {renderEarningOpportunities()}
        
        {/* Monetization Tips */}
        {renderMonetizationTips()}
        
        {/* Footer */}
        {renderFooter()}
        
        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 16,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  infoButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  balanceCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  balanceCardContent: {
    position: 'relative',
    zIndex: 2,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  balanceLabel: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    fontWeight: '500',
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  withdrawButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 5,
  },
  withdrawArrow: {
    marginTop: 1,
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  coinIconLarge: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  coinBalance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  usdBalance: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
    opacity: 0.9,
  },
  exchangeRateContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  exchangeRate: {
    fontSize: 12,
    color: 'white',
    opacity: 0.9,
  },
  shine: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 50,
    height: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: [{ rotate: '30deg' }],
    zIndex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 15,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statsIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statsTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  statsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  statsSubtext: {
    fontSize: 10,
    color: '#999',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  chartPeriod: {
    fontSize: 12,
    color: '#666',
  },
  breakdownContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  breakdownContent: {
    marginTop: 10,
  },
  breakdownItem: {
    marginBottom: 14,
  },
  breakdownVisual: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  breakdownBar: {
    height: '100%',
    borderRadius: 4,
  },
  breakdownInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownType: {
    fontSize: 12,
    color: '#666',
  },
  breakdownPercentage: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  opportunitiesContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
  },
  viewAllText: {
    fontSize: 12,
    color: '#666',
  },
  opportunityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  opportunityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  opportunityContent: {
    flex: 1,
  },
  opportunityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A00E0',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    width: 30,
  },
  opportunityReward: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  opportunityCoinIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
  },
  opportunityRewardText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  transactionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionSource: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  transactionAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  transactionCoinIcon: {
    width: 16,
    height: 16,
  },
  showMoreButton: {
    marginTop: 15,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  showMoreText: {
    fontSize: 14,
    color: '#4A00E0',
    fontWeight: '500',
  },
  calculatorContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  calculatorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calculatorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  calculatorToggle: {
    padding: 5,
  },
  calculatorContent: {
    marginTop: 15,
  },
  calculatorDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  calculatorInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  resultContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 15,
  },
  resultCard: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  primaryResultCard: {
    backgroundColor: '#4A00E0',
    elevation: 3,
    shadowColor: '#4A00E0',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  resultLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  calculatorDisclaimer: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
  bottomPadding: {
    height: 30,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 20,
  },
  quickActionButton: {
    alignItems: 'center',
    width: (width - 32) / 4,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  quickActionTitle: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  tipsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tipCard: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  seeMoreTipsButton: {
    marginTop: 15,
    paddingVertical: 12,
    alignItems: 'center',
  },
  seeMoreTipsText: {
    fontSize: 14,
    color: '#4A00E0',
    fontWeight: '600',
  },
  footerContainer: {
    marginHorizontal: -16,
    marginTop: 10,
    overflow: 'hidden',
  },
  footerGradient: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  footerDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  upgradeButton: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#4A00E0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  upgradeButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  basicChartContainer: {
    height: 220,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
  },
  basicChartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
  },
  basicChartBarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    marginHorizontal: 5,
  },
  basicChartBarWrapper: {
    width: 24,
    height: 140,
    backgroundColor: 'rgba(74, 0, 224, 0.1)',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  basicChartBar: {
    width: '100%',
    backgroundColor: '#4A00E0',
    borderRadius: 12,
  },
  basicChartValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 5,
  },
  basicChartLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 10,
  },
});

export default EarningsHubScreen; 