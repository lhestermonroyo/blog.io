import {
  ref,
  uploadString,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { storage } from '../../firebase.config';

const isBase64 = (str: string) => {
  const base64Regex =
    /^(data:image\/(png|jpeg|jpg|gif|webp);base64,)[A-Za-z0-9+/=]+$/;
  return base64Regex.test(str);
};

const readFile = (file: any) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
};

const uploadBlogFiles = async (uploadArr: any[]) => {
  try {
    const uploadRequests = uploadArr.map(async (upload: any) => {
      const file = `/blog.io-uploads/blogs/${upload.id}.jpg`;
      const storageRef = ref(storage, file);

      await uploadString(storageRef, upload.data.file.url, 'data_url');

      return {
        id: upload.id,
        url: await getDownloadURL(storageRef)
      };
    });

    return await Promise.all(uploadRequests);
  } catch (error) {
    throw new Error();
  }
};

const deleteBlogFiles = async (blogFiles: any[]) => {
  try {
    const deleteRequests = blogFiles.map(
      async (file: { data: { file: { url: string } } }) => {
        const fileRef = ref(storage, file.data.file.url);
        await deleteObject(fileRef);
      }
    );

    await Promise.all(deleteRequests);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

export { uploadBlogFiles, readFile, isBase64, deleteBlogFiles };
