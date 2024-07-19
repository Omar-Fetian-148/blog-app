import cloudinary from '../config/cloudinary.js';
import {
  generateError,
} from '../utils/helpers.js';


export default async function generateProfilePictureUrl(stream, language) {
  const options = {
    use_filename: true,
    unique_filename: true,
    resource_type: 'auto',
    folder: 'attachments',
    overwrite: true,
    quality: 'auto',
  };

  try {
    const uploadedFile = await new Promise(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          options,
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        stream.pipe(uploadStream);
      }
    );
    console.log(uploadedFile);
    if (uploadedFile) {
      console.log(uploadedFile)
      return uploadedFile.secure_url;
    } else {
      return generateError('errorOccurred', language);
    }
  } catch (error) {
    return generateError('errorOccurred', language);
  }
};
