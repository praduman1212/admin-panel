import { auth, db, storage } from './config';
import { 
  signInAnonymously, 
  signOut 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  deleteDoc,
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { 
  ref, 
  uploadString, 
  deleteObject,
  getDownloadURL 
} from 'firebase/storage';

const testFirebaseConnection = async () => {
  console.log('🔥 Starting Firebase Configuration Test...\n');
  const results = {
    auth: false,
    firestore: false,
    storage: false,
    errors: []
  };

  try {
    // Test Authentication
    console.log('📝 Testing Authentication...');
    const anonymousUser = await signInAnonymously(auth);
    if (anonymousUser) {
      console.log('✅ Authentication working: Successfully signed in anonymously');
      results.auth = true;
      await signOut(auth);
      console.log('✅ Successfully signed out\n');
    }
  } catch (error) {
    console.error('❌ Authentication Error:', error.message);
    results.errors.push({ service: 'Authentication', error: error.message });
  }

  try {
    // Test Firestore
    console.log('📝 Testing Firestore...');
    const testCollection = collection(db, 'test_collection');
    
    // Add a document
    const testDoc = await addDoc(testCollection, {
      test: true,
      timestamp: new Date().toISOString()
    });
    console.log('✅ Successfully added test document');

    // Query the document
    const q = query(testCollection, where('test', '==', true));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      console.log('✅ Successfully queried test document');
      results.firestore = true;
    }

    // Clean up
    await deleteDoc(testDoc);
    console.log('✅ Successfully deleted test document\n');
  } catch (error) {
    console.error('❌ Firestore Error:', error.message);
    results.errors.push({ service: 'Firestore', error: error.message });
  }

  try {
    // Test Storage
    console.log('📝 Testing Storage...');
    const testFileRef = ref(storage, 'test/test-file.txt');
    
    // Upload a string
    await uploadString(testFileRef, 'Hello, Firebase!');
    console.log('✅ Successfully uploaded test file');

    // Get download URL
    const downloadURL = await getDownloadURL(testFileRef);
    if (downloadURL) {
      console.log('✅ Successfully retrieved download URL');
      results.storage = true;
    }

    // Clean up
    await deleteObject(testFileRef);
    console.log('✅ Successfully deleted test file\n');
  } catch (error) {
    console.error('❌ Storage Error:', error.message);
    results.errors.push({ service: 'Storage', error: error.message });
  }

  // Summary
  console.log('📊 Test Summary:');
  console.log('================');
  console.log(`Authentication: ${results.auth ? '✅ Working' : '❌ Failed'}`);
  console.log(`Firestore: ${results.firestore ? '✅ Working' : '❌ Failed'}`);
  console.log(`Storage: ${results.storage ? '✅ Working' : '❌ Failed'}`);
  
  if (results.errors.length > 0) {
    console.log('\n❌ Errors encountered:');
    results.errors.forEach(({ service, error }) => {
      console.log(`${service}: ${error}`);
    });
  }

  return results;
};

export { testFirebaseConnection }; 