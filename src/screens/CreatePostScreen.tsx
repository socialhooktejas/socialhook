import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  StatusBar,
  Switch,
  Platform,
  Animated,
  Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utils/theme';

const CreatePostScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // State variables
  const [caption, setCaption] = useState('#answerto 🎭 Billieeeeeee <3  #duet\nwith ❤️ googlemapsfun\n#niceapploopyfe #thepantryboy');
  const [selectedTab, setSelectedTab] = useState('hashtags');
  const [location] = useState('Mumbai, India');
  const [allowComments, setAllowComments] = useState(true);
  const [allowDuet, setAllowDuet] = useState(true);
  const [allowStitch, setAllowStitch] = useState(true);
  const [postTypeModalVisible, setPostTypeModalVisible] = useState(false);
  const [selectedPostType, setSelectedPostType] = useState('Image');
  
  // Post type options
  const postTypes = [
    { id: 'image', label: 'Image', icon: '🖼️' },
    { id: 'reel', label: 'Reel', icon: '📹' },
    { id: 'carousel', label: 'Carousel', icon: '📱' },
    { id: 'text', label: 'Text Only', icon: '📝' }
  ];
  
  // Define PostType interface
  interface PostType {
    id: string;
    label: string;
    icon: string;
  }
  
  // Toggle functions
  const toggleComments = () => setAllowComments(!allowComments);
  const toggleDuet = () => setAllowDuet(!allowDuet);
  const toggleStitch = () => setAllowStitch(!allowStitch);
  
  // Handle navigation back
  const handleGoBack = () => {
    navigation.goBack();
  };

  // Handle post submission
  const handlePost = () => {
    // Animate button press
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
    
    setTimeout(() => {
      console.log('Post submitted');
      navigation.goBack();
    }, 400);
  };
  
  // Handle draft saving
  const handleSaveDraft = () => {
    console.log('Draft saved');
  };
  
  // Toggle post type modal
  const togglePostTypeModal = () => {
    setPostTypeModalVisible(!postTypeModalVisible);
  };
  
  // Select post type
  const selectPostType = (type: PostType) => {
    setSelectedPostType(type.label);
    togglePostTypeModal();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Image 
            source={require('../assets/icons/back.png')} 
            style={styles.backIcon} 
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
        <View style={styles.emptySpace} />
      </View>
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Caption Input */}
        <View style={styles.captionContainer}>
          <TextInput
            style={styles.captionInput}
            multiline
            value={caption}
            onChangeText={setCaption}
            placeholder="What's happening?"
            placeholderTextColor="#888"
          />
          
          {/* Cover Image */}
          <View style={styles.coverImageContainer}>
            <Image 
              source={{uri: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e'}} 
              style={styles.coverImage} 
            />
            <View style={styles.coverImageOverlay}>
              <Text style={styles.coverImageText}>Select cover</Text>
            </View>
          </View>
        </View>
        
        {/* Post Type Selector */}
        <TouchableOpacity 
          style={styles.postTypeContainer}
          onPress={togglePostTypeModal}
        >
          <View style={styles.optionIconContainer}>
            <Text style={styles.postTypeIcon}>
              {postTypes.find(type => type.label === selectedPostType)?.icon || '🖼️'}
            </Text>
          </View>
          <Text style={styles.optionText}>Post Type: {selectedPostType}</Text>
          <View style={styles.chevronContainer}>
            <Text style={styles.chevron}>▼</Text>
          </View>
        </TouchableOpacity>
        
        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, selectedTab === 'hashtags' && styles.selectedTab]}
            onPress={() => setSelectedTab('hashtags')}
          >
            <Text style={[styles.tabText, selectedTab === 'hashtags' && styles.selectedTabText]}># Hashtags</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, selectedTab === 'friends' && styles.selectedTab]}
            onPress={() => setSelectedTab('friends')}
          >
            <Text style={[styles.tabText, selectedTab === 'friends' && styles.selectedTabText]}>@ Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, selectedTab === 'videos' && styles.selectedTab]}
            onPress={() => setSelectedTab('videos')}
          >
            <Text style={[styles.tabText, selectedTab === 'videos' && styles.selectedTabText]}>◎ Videos</Text>
          </TouchableOpacity>
        </View>
        
        {/* Location */}
        <TouchableOpacity style={styles.optionContainer}>
          <View style={styles.optionIconContainer}>
            <Text style={styles.locationIcon}>📍</Text>
          </View>
          <Text style={styles.optionText}>{location}</Text>
          <TouchableOpacity style={styles.clearButton}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        
        {/* Add Link */}
        <TouchableOpacity style={styles.optionContainer}>
          <View style={styles.optionIconContainer}>
            <Image source={require('../assets/icons/link.png')} style={styles.optionIcon} />
          </View>
          <Text style={styles.optionText}>Add link</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        
        {/* AR Cat */}
        <View style={styles.arOptionContainer}>
          <TouchableOpacity style={styles.arBadge}>
            <View style={styles.arIcon}>
              <Text>🔳</Text>
            </View>
            <Text style={styles.arText}>AR Cat</Text>
          </TouchableOpacity>
        </View>
        
        {/* Visibility */}
        <TouchableOpacity style={styles.optionContainer}>
          <View style={styles.optionIconContainer}>
            <Image source={require('../assets/icons/lock.png')} style={styles.optionIcon} />
          </View>
          <Text style={styles.optionText}>Visible to everyone</Text>
          <View style={styles.chevronContainer}>
            <Text style={styles.chevron}>›</Text>
          </View>
        </TouchableOpacity>
        
        {/* Allow Comments */}
        <View style={styles.toggleOptionContainer}>
          <View style={styles.toggleOptionLeft}>
            <View style={styles.optionIconContainer}>
              <Image source={require('../assets/icons/chat.png')} style={styles.optionIcon} />
            </View>
            <Text style={styles.optionText}>Allow comments</Text>
          </View>
          <Switch
            trackColor={{ false: "#e0e0e0", true: "#FFECB3" }}
            thumbColor={allowComments ? colors.primary : "#f4f3f4"}
            ios_backgroundColor="#e0e0e0"
            onValueChange={toggleComments}
            value={allowComments}
            style={styles.switch}
          />
        </View>
        
        {/* Allow Duet */}
        <View style={styles.toggleOptionContainer}>
          <View style={styles.toggleOptionLeft}>
            <View style={styles.optionIconContainer}>
              <Image source={require('../assets/icons/duet.png')} style={styles.optionIcon} />
            </View>
            <Text style={styles.optionText}>Allow Duet</Text>
          </View>
          <Switch
            trackColor={{ false: "#e0e0e0", true: "#FFECB3" }}
            thumbColor={allowDuet ? colors.primary : "#f4f3f4"}
            ios_backgroundColor="#e0e0e0"
            onValueChange={toggleDuet}
            value={allowDuet}
            style={styles.switch}
          />
        </View>
        
        {/* Allow Stitch */}
        <View style={styles.toggleOptionContainer}>
          <View style={styles.toggleOptionLeft}>
            <View style={styles.optionIconContainer}>
              <Image source={require('../assets/icons/stitch.png')} style={styles.optionIcon} />
            </View>
            <Text style={styles.optionText}>Allow Stitch</Text>
          </View>
          <Switch
            trackColor={{ false: "#e0e0e0", true: "#FFECB3" }}
            thumbColor={allowStitch ? colors.primary : "#f4f3f4"}
            ios_backgroundColor="#e0e0e0"
            onValueChange={toggleStitch}
            value={allowStitch}
            style={styles.switch}
          />
        </View>
        
        {/* Automatically share to */}
        <View style={styles.shareContainer}>
          <Text style={styles.shareTitle}>Automatically share to:</Text>
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialIcon}>f</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Bottom Space */}
        <View style={styles.bottomSpace}></View>
      </ScrollView>
      
      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.draftsButton} onPress={handleSaveDraft}>
          <Image source={require('../assets/icons/draft.png')} style={styles.draftsIcon} />
          <Text style={styles.draftsText}>Drafts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.postButton} 
          onPress={handlePost}
          activeOpacity={0.8}
        >
          <Animated.View style={[styles.postButtonOverlay, { opacity: fadeAnim }]} />
          <Image source={require('../assets/icons/upload.png')} style={styles.postIcon} />
          <Text style={styles.postText}>Post</Text>
        </TouchableOpacity>
      </View>
      
      {/* Post Type Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={postTypeModalVisible}
        onRequestClose={togglePostTypeModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={togglePostTypeModal}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Post Type</Text>
              <TouchableOpacity onPress={togglePostTypeModal}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.postTypeOptions}>
              {postTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.postTypeOption,
                    selectedPostType === type.label && styles.selectedPostTypeOption
                  ]}
                  onPress={() => selectPostType(type)}
                >
                  <Text style={styles.postTypeOptionIcon}>{type.icon}</Text>
                  <Text style={[
                    styles.postTypeOptionText,
                    selectedPostType === type.label && styles.selectedPostTypeOptionText
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: colors.text,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  emptySpace: {
    width: 36,
  },
  scrollContainer: {
    flex: 1,
  },
  captionContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  captionInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
    paddingTop: 0,
    paddingRight: 10,
  },
  coverImageContainer: {
    width: 110,
    height: 110,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    alignItems: 'center',
  },
  coverImageText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  postTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#FFFDF7',
  },
  postTypeIcon: {
    fontSize: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    backgroundColor: '#FFFDF7',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  selectedTabText: {
    color: colors.text,
    fontWeight: '600',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  optionIconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionIcon: {
    width: 20,
    height: 20,
    tintColor: colors.text,
  },
  locationIcon: {
    fontSize: 20,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  clearButton: {
    padding: 8,
  },
  clearText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  addButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    lineHeight: 20,
  },
  arOptionContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  arBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
    padding: 8,
    borderRadius: 4,
  },
  arIcon: {
    marginRight: 8,
  },
  arText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  chevronContainer: {
    padding: 4,
  },
  chevron: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  toggleOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  toggleOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  switch: {
    transform: Platform.OS === 'ios' ? [{ scaleX: 0.8 }, { scaleY: 0.8 }] : [],
  },
  shareContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  shareTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  socialContainer: {
    flexDirection: 'row',
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  socialIcon: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#888',
  },
  bottomSpace: {
    height: 60,
  },
  bottomBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
  },
  draftsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  draftsIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
    tintColor: colors.text,
  },
  draftsText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  postButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 4,
    backgroundColor: colors.primary,
    overflow: 'hidden',
    position: 'relative',
  },
  postButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
  },
  postIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
    tintColor: colors.buttonText,
  },
  postText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.buttonText,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  modalCloseButton: {
    fontSize: 18,
    color: colors.textSecondary,
    padding: 4,
  },
  postTypeOptions: {
    padding: 16,
  },
  postTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  selectedPostTypeOption: {
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  postTypeOptionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  postTypeOptionText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedPostTypeOptionText: {
    fontWeight: 'bold',
  }
});

export default CreatePostScreen; 