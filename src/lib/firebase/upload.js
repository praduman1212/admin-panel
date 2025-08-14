import { storage } from './config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function uploadProfileImage(file, userId) {
  if (!file || !userId) throw new Error('File and userId are required');
  const ext = file.name.split('.').pop();
  const storageRef = ref(storage, `avatars/${userId}.${ext}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}
