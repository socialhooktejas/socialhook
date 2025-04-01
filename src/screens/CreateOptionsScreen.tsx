import React, { useState, useEffect } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import CreateOptionsModal from '../components/CreateOptionsModal';

const CreateOptionsScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    // Show modal when screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      setModalVisible(true);
    });

    // Add back button handler
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (modalVisible) {
        setModalVisible(false);
        navigation.goBack();
        return true;
      }
      return false;
    });

    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, [navigation, modalVisible]);

  const handleClose = () => {
    setModalVisible(false);
    
    // Use setTimeout to ensure the animation completes before navigating back
    setTimeout(() => {
      navigation.goBack();
    }, 150);
  };

  const handleSelectOption = (option: string) => {
    switch (option) {
      case 'post':
        // Keep modal hidden
        setModalVisible(false);
        
        // Navigate to create post screen after a short delay
        setTimeout(() => {
          navigation.dispatch(
            CommonActions.navigate({
              name: 'CreatePost',
            })
          );
        }, 200);
        break;
        
      case 'group':
        console.log('Group option selected');
        handleClose();
        break;
        
      case 'dynamicGroup':
        console.log('Dynamic Group option selected');
        handleClose();
        break;
        
      case 'blog':
        console.log('Blog option selected');
        handleClose();
        break;
        
      default:
        handleClose();
        break;
    }
  };

  return (
    <View style={styles.container}>
      <CreateOptionsModal
        visible={modalVisible}
        onClose={handleClose}
        onSelectOption={handleSelectOption}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default CreateOptionsScreen; 