import { Types } from 'mongoose';
import { Post, Comment } from '../../../data/models/index.js';
import { config } from "dotenv";
config()
import {
  mutationFailResponse,
  mutationSuccessResponse,
  generateError
} from '../../../utils/helpers.js';
import validateComment from "../../../utils/validate/validateComment.js";


export default async (
  _,
  { commentId, postId, action },
  { user, language }
) => {
  try {
    if (!user) return generateError('unauthorized', language)

    let target
    if (commentId) {
      target = await Comment.findById(commentId)
    }else if(postId){
      target = await Post.findById(postId)
    }else{
      return generateError('checkYourInput', language)
    }
    console.log(target);

    if (!target) return generateError('checkYourInput', language)

    if (action === 'LIKE') {
      target.likes++
    }else{
      target.likes--
    }
    await target.save()

    

    return mutationSuccessResponse('successfulOperation', language)
  } catch (error) {
    return mutationFailResponse(error)
  }
}