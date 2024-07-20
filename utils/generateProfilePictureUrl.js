import cloudinary from '../config/cloudinary.js';
import {
  generateError,
} from '../utils/helpers.js';


export default async (
  stream,
  language
)=> {
  const options = {
    use_filename: true,
    unique_filename: true,
    resource_type: 'auto',
    folder: 'profilePicture',
    overwrite: true,
    quality: 'auto',
    fetch_format: 'auto',
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
    if (uploadedFile) {
      console.log(uploadedFile)
      return uploadedFile.secure_url;
    } else {
      return generateError('errorOcurred', language);
    }
  } catch (error) {
    return generateError('errorOcurred', language);
  }
};
