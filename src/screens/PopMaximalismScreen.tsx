import React, {useState, useEffect} from 'react';
import {
  Alert,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
} from 'react-native-image-picker';
import {PopBadge} from '../components/atoms/PopBadge';
import {PopButton} from '../components/atoms/PopButton';
import {PopCard} from '../components/molecules/PopCard';
import {handleError} from '../utils/errorHandler';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '../navigation/AppNavigator';

interface PopMaximalismScreenProps
  extends NativeStackScreenProps<AppStackParamList, 'PopMaximalism'> {}

// Placeholder image assets (high saturation comic art style)
const CAMERA_PLACEHOLDER =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAVFjqzg7kanH6WHAOB9RX4nzx4UNrj-A9g0s4e1PkZoNh82Lb0yyIsVwnAGZCvpSCpDfpJE7bRyCQPAqvPL2lEJQSkEMRohjj1tucAXWJ9rhicfb0trmuvoS3TNSqoDoo7amWfcFE_jz813K-qPZncDbNJVdj1NnP95_euepDnNJFFMCl-PSO-7T1YKu-AWhu82eWA4k1sQNvsQofgbKL280tl-9x3_IKF6cpX78FJCtadeEAow4uw3Idp2AEWueKxQLUPmnWqkl4';

const GALLERY_PLACEHOLDER =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDBdJoaGo9OyY52B3Fd2xCl0cpbU2E6ZKRRsYDZt0bn-C-1a6MFxgnVMkNFcLRfciMh6rFwR2kGhtFNgqpP1LWRiqB2g9e0TESRiwGTZoRKM1Nr7oAWJl_mVCEgyuPR5_qiWl0-xaEHGVKENL-K4rsuzcV1F2byJv2t5yD3k8Qq3NZkZaAMUX_sRmpGeqJOiLE83lk41hj3wHUZQTYzb-N5QyLco4cslLqpCB2YyXcqCYSqIhncfAj3eIZRX7MbcA8_fXmnIysmmec';

export const PopMaximalismScreen = ({
  navigation,
}: PopMaximalismScreenProps) => {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [sourceType, setSourceType] = useState<'camera' | 'gallery' | undefined>(
    undefined
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSelectedImage(undefined);
      setSourceType(undefined);
    });
    return unsubscribe;
  }, [navigation]);

  const handleCameraLaunch = (): void => {
    try {
      launchCamera(
        {
          mediaType: 'photo',
          quality: 0.8,
          saveToPhotos: true,
        },
        (response: ImagePickerResponse) => {
          if (response.didCancel) {
            return;
          }
          if (response.errorMessage) {
            handleError(new Error(response.errorMessage), {
              componentName: 'PopMaximalismScreen',
              actionName: 'launchCamera',
            });
            return;
          }
          if (response.assets && response.assets.length > 0) {
            const uri = response.assets[0].uri;
            if (uri) {
              setSelectedImage(uri);
              setSourceType('camera');
              navigation.navigate('UploadSuccess', {imageUri: uri});
            }
          }
        }
      );
    } catch (error) {
      handleError(error, {
        componentName: 'PopMaximalismScreen',
        actionName: 'handleCameraLaunch',
      });
    }
  };

  const handleGalleryLaunch = (): void => {
    try {
      launchImageLibrary(
        {
          mediaType: 'photo',
          quality: 0.8,
        },
        (response: ImagePickerResponse) => {
          if (response.didCancel) {
            return;
          }
          if (response.errorMessage) {
            handleError(new Error(response.errorMessage), {
              componentName: 'PopMaximalismScreen',
              actionName: 'launchImageLibrary',
            });
            return;
          }
          if (response.assets && response.assets.length > 0) {
            const uri = response.assets[0].uri;
            if (uri) {
              setSelectedImage(uri);
              setSourceType('gallery');
              navigation.navigate('UploadSuccess', {imageUri: uri});
            }
          }
        }
      );
    } catch (error) {
      handleError(error, {
        componentName: 'PopMaximalismScreen',
        actionName: 'handleGalleryLaunch',
      });
    }
  };

  const handleGoGraduate = (): void => {
    if (!selectedImage) {
      Alert.alert(
        'Eksik Fotoğraf! 📸',
        'Lütfen mezuniyet portrenizi oluşturmak için önce bir selfie çekin veya galeriden bir fotoğraf seçin!',
        [{text: 'Tamam', style: 'default'}]
      );
      return;
    }

    navigation.navigate('UploadSuccess', {imageUri: selectedImage});
  };

  const handleResetImage = (): void => {
    setSelectedImage(undefined);
    setSourceType(undefined);
  };

  return (
    <ImageBackground
      source={require('../assets/images/halftone.png')}
      resizeMode="repeat"
      style={{flex: 1}}
    >
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1, paddingBottom: 64}}
          style={{flex: 1}}
          className="px-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Area */}
          <View className="items-center mt-12 mb-16 relative w-full">
            {/* Pulsing Star Badge (Top Left) */}
            <PopBadge
              color="blue"
              size="lg"
              rotation={-12}
              pulse={true}
              className="absolute -top-12 left-4 z-20"
            >
              <Text className="text-3xl">⭐</Text>
            </PopBadge>

            {/* Static Bolt Badge (Top Right) */}
            <PopBadge
              color="red"
              size="md"
              rotation={12}
              className="absolute -top-6 right-6 z-20"
            >
              <Text className="text-2xl">⚡</Text>
            </PopBadge>

            {/* Comic Outline Title */}
            <View
              style={{transform: [{rotate: '-2deg'}]}}
              className="px-6 py-4 bg-pop-red border-4 border-black rounded-2xl relative z-10"
            >
              <Text
                style={{
                  textShadowColor: '#000000',
                  textShadowOffset: {width: 3, height: 3},
                  textShadowRadius: 0.1,
                }}
                className="font-pop-display text-white text-5xl md:text-6xl text-center font-black tracking-widest uppercase"
              >
                SAY CHEESE!
              </Text>
            </View>
          </View>

          {/* Cards Grid / Stack */}
          <View className="gap-8 w-full z-10 px-2">
            {/* Selfie Picker Card */}
            <PopCard
              onPress={handleCameraLaunch}
              title="SNAP A SELFIE!"
              emoji="📸"
              color="yellow"
              placeholderImageUri={CAMERA_PLACEHOLDER}
              selectedImageUri={
                sourceType === 'camera' ? selectedImage : undefined
              }
              rotation={-2}
            />

            {/* Gallery Picker Card */}
            <PopCard
              onPress={handleGalleryLaunch}
              title="PICK FROM PIX!"
              emoji="🖼️"
              color="blue"
              placeholderImageUri={GALLERY_PLACEHOLDER}
              selectedImageUri={
                sourceType === 'gallery' ? selectedImage : undefined
              }
              rotation={2}
            />
          </View>

          {/* Reset Action */}
          {selectedImage && (
            <View className="mt-8 items-center">
              <PopButton
                onPress={handleResetImage}
                title="TEMİZLE / RESET"
                color="white"
                className="w-full max-w-xs"
              />
            </View>
          )}

          {/* Primary Action Button */}
          <View className="mt-16 w-full items-center">
            <PopButton
              onPress={handleGoGraduate}
              title="GO GRADUATE!"
              color="red"
              badgeText="POW!"
              className="w-full max-w-sm"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};
