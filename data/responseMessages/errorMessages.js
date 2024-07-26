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
  passwordNotMatch: {
    code: 401,
    success: false,
    message: 'PassWord Doesn\'t Match',
    ar: 'كلمة سر غير مطابقة',
    en: 'PassWord Doesn\'t Match',
  },
  userAlreadyExists: {
    code: 404,
    success: false,
    message: 'User Already Exists',
    ar: 'المستخدم غير موجود',
    en: 'User Already Exists',
  },
  invalidEmailOrPassword: {
    code: 404,
    success: false,
    message: 'Invalid Email Or Password',
    ar: 'المستخدم غير موجود',
    en: 'Invalid Email Or Password',
  },
  invalidOTP: {
    code: 400,
    success: false,
    message: 'Invalid OTP',
    ar: 'المستخدم غير موجود',
    en: 'Invalid OTP',
  },
  EmailIsNotVerified: {
    code: 400,
    success: false,
    message: 'Email Is Not Verified',
    ar: 'المستخدم غير موجود',
    en: 'Email Is Not Verified',
  },
  errorOccurred: {
    code: 400,
    success: false,
    message: 'Error Occurred',
    ar: 'المستخدم غير موجود',
    en: 'Error Occurred',
  },
  userNotFound: {
    code: 404,
    success: false,
    message: 'User Not Found',
    ar: 'المستخدم غير موجود',
    en: 'User Not Found',
  },
  relationAlreadyExists: {
    code: 404,
    success: false,
    message: 'Relation Already Exists',
    ar: 'المستخدم غير موجود',
    en: 'Relation Already Exists',
  },
}