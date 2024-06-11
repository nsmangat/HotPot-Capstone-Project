import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: Platform.OS === 'ios' ? process.env.EXPO_PUBLIC_API_KEY:process.env.EXPO_PUBLIC_API_KEY_ANDROID, 
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN, 
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID, 
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET, 
  messagingSenderId: process.env.EXPO_PUBLIC_MSG_SENDER_ID,
  appId: Platform.OS === 'ios' ? process.env.EXPO_PUBLIC_APP_ID:EXPO_PUBLIC_APP_ID_ANDROID, 
};

const app = initializeApp(firebaseConfig);
//const auth = getAuth(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth };
