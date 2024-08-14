import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { storeData } from '../src/utils/storage';

const firebaseConfig = {
  apiKey: Platform.OS === 'ios' ? process.env.EXPO_PUBLIC_API_KEY:process.env.EXPO_PUBLIC_API_KEY_ANDROID, 
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN, 
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID, 
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET, 
  messagingSenderId: process.env.EXPO_PUBLIC_MSG_SENDER_ID,
  appId: Platform.OS === 'ios' ? process.env.EXPO_PUBLIC_APP_ID: process.env.EXPO_PUBLIC_APP_ID_ANDROID, 
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const refreshToken = async() => {
  const user = auth.currentUser;
  if(user){
    try {
      const idToken = await user.getIdToken(true);
      await storeData('bearerToken', idToken);
    } catch (error) {
      console.error("Error refreshing token: ", error);
    }
  }
}

setInterval(refreshToken, 3480000); // 58 mins

export { auth };
