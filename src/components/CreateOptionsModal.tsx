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

const WINDOW_WIDTH = Dimensions.get('window').width;
const ANIMATION_DURATION = 250;

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
        })
      ]).start();
    }
  }, [visible, slideAnim, opacityAnim]);

  const handleOptionPress = (option: string) => {
    onSelectOption(option);
    onClose();
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
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.handle} />
            
            <View style={styles.optionsRow}>
              <TouchableOpacity 
                style={styles.optionButton}
                onPress={() => handleOptionPress('post')}
                activeOpacity={0.7}
              >
                <View style={[styles.optionIcon, { backgroundColor: '#FF5655' }]}>
                  <Text style={styles.optionIconText}>📝</Text>
                </View>
                <Text style={styles.optionText}>Post</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.optionButton}
                onPress={() => handleOptionPress('group')}
                activeOpacity={0.7}
              >
                <View style={[styles.optionIcon, { backgroundColor: '#4A90E2' }]}>
                  <Text style={styles.optionIconText}>👥</Text>
                </View>
                <Text style={styles.optionText}>Group</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.optionButton}
                onPress={() => handleOptionPress('dynamicGroup')}
                activeOpacity={0.7}
              >
                <View style={[styles.optionIcon, { backgroundColor: colors.primary }]}>
                  <Text style={styles.optionIconText}>🔄</Text>
                </View>
                <Text style={styles.optionText}>Dynamic</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.optionButton}
                onPress={() => handleOptionPress('blog')}
                activeOpacity={0.7}
              >
                <View style={[styles.optionIcon, { backgroundColor: '#50C878' }]}>
                  <Text style={styles.optionIconText}>✍️</Text>
                </View>
                <Text style={styles.optionText}>Blog</Text>
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
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  menuContainer: {
    backgroundColor: '#111111',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 30,
    width: WINDOW_WIDTH,
    alignItems: 'center',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#666',
    marginBottom: 20,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: 12,
  },
  optionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
  },
  optionIcon: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  optionIconText: {
    fontSize: 22,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
});

export default CreateOptionsModal; 