import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions
} from 'react-native';
import { colors } from '../utils/theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const ANIMATION_DURATION = 300;

interface CreateOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectOption: (option: string) => void;
}

const CreateOptionsModal: React.FC<CreateOptionsModalProps> = ({ 
  visible, 
  onClose,
  onSelectOption
}) => {
  const slideAnim = React.useRef(new Animated.Value(100)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;
  
  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: ANIMATION_DURATION * 0.5,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: ANIMATION_DURATION * 0.5,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: ANIMATION_DURATION * 0.5,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [visible, slideAnim, opacityAnim, scaleAnim]);

  const handleOptionPress = (option: string) => {
    onSelectOption(option);
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <Animated.View 
            style={[
              styles.backdrop, 
              { opacity: opacityAnim }
            ]}
          />
          
          <Animated.View 
            style={[
              styles.menuContainer,
              {
                opacity: opacityAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
              }
            ]}
          >
            <View style={styles.headerContainer}>
              <View style={styles.handle} />
              <Text style={styles.headerText}>Create New</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose} hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}>
                <MaterialIcons name="close" size={22} color="rgba(255,255,255,0.8)" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.optionsContainer}>
              <TouchableOpacity 
                style={styles.optionCard}
                onPress={() => handleOptionPress('post')}
                activeOpacity={0.7}
              >
                <View style={[styles.optionIcon, { backgroundColor: '#FF5655' }]}>
                  <FontAwesome5 name="edit" size={22} color="#fff" solid />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Create Post</Text>
                  <Text style={styles.optionDescription}>Share updates, photos, and more</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={16} color="rgba(255,255,255,0.5)" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.optionCard}
                onPress={() => handleOptionPress('group')}
                activeOpacity={0.7}
              >
                <View style={[styles.optionIcon, { backgroundColor: '#4A90E2' }]}>
                  <FontAwesome5 name="users" size={22} color="#fff" solid />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Create Group</Text>
                  <Text style={styles.optionDescription}>Connect with people who share interests</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={16} color="rgba(255,255,255,0.5)" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.optionCard}
                onPress={() => handleOptionPress('dynamicGroup')}
                activeOpacity={0.7}
              >
                <View style={[styles.optionIcon, { backgroundColor: colors.primary }]}>
                  <FontAwesome5 name="sync-alt" size={22} color="#fff" solid />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Dynamic Group</Text>
                  <Text style={styles.optionDescription}>Create groups with changing members</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={16} color="rgba(255,255,255,0.5)" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.optionCard}
                onPress={() => handleOptionPress('blog')}
                activeOpacity={0.7}
              >
                <View style={[styles.optionIcon, { backgroundColor: '#50C878' }]}>
                  <FontAwesome5 name="book" size={22} color="#fff" solid />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Write Blog</Text>
                  <Text style={styles.optionDescription}>Share in-depth articles and stories</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={16} color="rgba(255,255,255,0.5)" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  menuContainer: {
    backgroundColor: 'rgba(18, 18, 18, 0.92)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    width: WINDOW_WIDTH,
    maxHeight: WINDOW_HEIGHT * 0.6,
    paddingBottom: 16,
    marginBottom: 60, // Exactly match the height of the bottom navigation
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    position: 'relative',
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    position: 'absolute',
    top: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  optionsContainer: {
    width: '100%',
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  optionIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
});

export default CreateOptionsModal; 