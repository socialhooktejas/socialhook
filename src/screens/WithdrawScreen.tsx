import React, { useState } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utils/theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Icons
const backIcon = require('../assets/icons/back.png');
const coinIcon = require('../assets/icons/coin.png');

// Mock user data with coin balance
const USER_DATA = {
  coins: 34250,
  availableWithdraw: 34.25, // 1000 coins = $1 USD
};

const WithdrawScreen = () => {
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('paypal');
  const [email, setEmail] = useState('');
  const [animatedValue] = useState(new Animated.Value(0));
  
  // Calculate USD value based on coins
  const calculateUSD = (coinAmount: number) => {
    return (coinAmount / 1000).toFixed(2);
  };
  
  // Animate button when pressed
  const handleButtonPress = () => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Show success message or navigate
    alert('Withdrawal request submitted successfully!');
  };
  
  const buttonScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.95],
  });
  
  // Render payment method option
  const renderPaymentMethod = (method: string, title: string, icon: string) => (
    <TouchableOpacity 
      style={[
        styles.paymentMethodOption,
        selectedMethod === method && styles.paymentMethodSelected
      ]}
      onPress={() => setSelectedMethod(method)}
    >
      <FontAwesome name={icon} size={20} color={selectedMethod === method ? colors.primary : '#666'} />
      <Text style={[
        styles.paymentMethodText,
        selectedMethod === method && styles.paymentMethodTextSelected
      ]}>
        {title}
      </Text>
      <View style={[
        styles.paymentMethodRadio,
        selectedMethod === method && styles.paymentMethodRadioSelected
      ]}>
        {selectedMethod === method && <View style={styles.paymentMethodRadioInner} />}
      </View>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} translucent={true} />
      <View style={styles.statusBarSpacer} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image source={backIcon} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Withdraw Coins</Text>
        <View style={styles.placeholderView} />
      </View>
      
      <ScrollView style={styles.content}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceTitle}>Available Balance</Text>
          </View>
          <View style={styles.balanceContent}>
            <View style={styles.coinBalance}>
              <Image source={coinIcon} style={styles.coinIcon} />
              <Text style={styles.coinBalanceText}>{USER_DATA.coins.toLocaleString()}</Text>
            </View>
            <Text style={styles.usdBalance}>${USER_DATA.availableWithdraw.toFixed(2)} USD</Text>
            <Text style={styles.exchangeRate}>1,000 coins = $1.00 USD</Text>
          </View>
        </View>
        
        {/* Withdraw Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>Amount to Withdraw (in coins)</Text>
          <View style={styles.amountInputContainer}>
            <Image source={coinIcon} style={styles.inputCoinIcon} />
            <TextInput
              style={styles.amountInput}
              keyboardType="numeric"
              placeholder="Enter amount"
              placeholderTextColor="#999"
              value={amount}
              onChangeText={setAmount}
            />
            <Text style={styles.usdEquivalent}>
              ≈ ${amount ? calculateUSD(parseInt(amount, 10)) : '0.00'} USD
            </Text>
          </View>
          
          <Text style={styles.formLabel}>Payment Method</Text>
          <View style={styles.paymentMethodsContainer}>
            {renderPaymentMethod('paypal', 'PayPal', 'paypal')}
            {renderPaymentMethod('bank', 'Bank Transfer', 'university')}
            {renderPaymentMethod('venmo', 'Venmo', 'money')}
          </View>
          
          <Text style={styles.formLabel}>Email Address</Text>
          <View style={styles.emailInputContainer}>
            <FontAwesome name="envelope" size={16} color="#666" style={styles.emailIcon} />
            <TextInput
              style={styles.emailInput}
              keyboardType="email-address"
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          
          <View style={styles.infoContainer}>
            <FontAwesome name="info-circle" size={14} color="#666" />
            <Text style={styles.infoText}>
              Minimum withdrawal amount is 5,000 coins ($5.00 USD). Processing may take 1-3 business days.
            </Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Submit Button */}
      <View style={styles.footer}>
        <Animated.View 
          style={{ 
            transform: [{ scale: buttonScale }],
            width: '100%',
          }}
        >
          <TouchableOpacity 
            style={[
              styles.submitButton,
              (!amount || parseInt(amount, 10) < 5000 || !email) && styles.submitButtonDisabled
            ]}
            onPress={handleButtonPress}
            disabled={!amount || parseInt(amount, 10) < 5000 || !email}
          >
            <Text style={styles.submitButtonText}>Withdraw Now</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  statusBarSpacer: {
    height: StatusBar.currentHeight || 0,
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.primary,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholderView: {
    width: 36,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  balanceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
  },
  balanceHeader: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  balanceContent: {
    padding: 16,
    alignItems: 'center',
  },
  coinBalance: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  coinIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    tintColor: '#FFD700',
  },
  coinBalanceText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  usdBalance: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  exchangeRate: {
    fontSize: 12,
    color: '#999',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  inputCoinIcon: {
    width: 18,
    height: 18,
    tintColor: '#FFD700',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  usdEquivalent: {
    fontSize: 14,
    color: '#666',
  },
  paymentMethodsContainer: {
    marginBottom: 16,
  },
  paymentMethodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  paymentMethodSelected: {
    borderColor: colors.primary,
    backgroundColor: '#f0f7ff',
  },
  paymentMethodText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#333',
  },
  paymentMethodTextSelected: {
    color: colors.primary,
    fontWeight: '500',
  },
  paymentMethodRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentMethodRadioSelected: {
    borderColor: colors.primary,
  },
  paymentMethodRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  emailInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  emailIcon: {
    marginRight: 8,
  },
  emailInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
  },
  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  footer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#bbb',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WithdrawScreen; 