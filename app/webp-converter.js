import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function WebpConverter() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const pickImages = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        alert('Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.pickMultipleAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImages(result.assets);
      }
    } catch (error) {
      console.error('Error picking images:', error);
      alert('Error picking images. Please try again.');
    }
  };

  const shareImages = async () => {
    try {
      if (images.length === 0) {
        alert('Please select images first');
        return;
      }

      setLoading(true);
      
      // Currently in the web version we'll just share the first image
      // In a full native app, you'd want to implement the WebP conversion here
      const firstImage = images[0];
      
      if (!(await Sharing.isAvailableAsync())) {
        alert('Sharing is not available on this platform');
        return;
      }

      await Sharing.shareAsync(firstImage.uri);
    } catch (error) {
      console.error('Error sharing images:', error);
      alert('Error sharing images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Animated WebP Converter</Text>
      
      <TouchableOpacity style={styles.button} onPress={pickImages}>
        <Text style={styles.buttonText}>Select Images</Text>
      </TouchableOpacity>

      <ScrollView style={styles.previewContainer}>
        {images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image.uri }}
            style={styles.preview}
          />
        ))}
      </ScrollView>

      {images.length > 0 && (
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={shareImages}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Processing...' : 'Share Images'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewContainer: {
    width: '100%',
    maxHeight: 300,
    marginVertical: 20,
  },
  preview: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    resizeMode: 'contain',
  },
});
