import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase.config';

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

export { uploadBlogFiles };
