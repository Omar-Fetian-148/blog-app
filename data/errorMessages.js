/*
Error status codes
400 [Bad Request]
401 [Unauthorized]
402 [Payment Required]
403 [Forbidden]
404 [Not Found]
405 [Method Not Allowed]
406 [Not Acceptable]
408 [Request Timeout]
429 [Too Many Requests]
451 [Unavailable For Legal Reasons]
*/


export default {
  unauthorized: {
    code: 401,
    success: false,
    message: 'unauthorized',
    ar: 'غير مصرح',
    en: 'unauthorized',
  },
  userNotFound: {
    code: 404,
    success: false,
    message: 'user Not Found',
    ar: 'المستخدم غير موجود',
    en: 'user Not Found',
  },
  postNotFound: {
    code: 404,
    success: false,
    message: 'post Not Found',
    ar: 'المنشور غير موجود',
    en: 'post Not Found',
  },
  commentNotFound: {
    code: 404,
    success: false,
    message: 'comment Not Found',
    ar: 'التعليق غير موجود',
    en: 'comment Not Found',
  }
}