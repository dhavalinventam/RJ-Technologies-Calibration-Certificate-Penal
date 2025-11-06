//validation constant

export const WEBSITE_REGEX = /^(https?:\/\/|www\.)[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+([/?#][^\s]*)?$/

export const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/

export const NAME_REGEX = /^[A-Za-z\s]+$/

export const NO_BLANK_SPACES = /^[^\s]+$/

export const NO_LEADING_TRAILING_SPACES = /^(?!\s)(.*\S)?$/

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/

export const EMAIL_REGEX = /^[a-zA-Z0-9]+([._+-]?[a-z0-9]+)*@[a-z0-9-]+(\.[a-z]{2,})+$/

export const SIGNIN_EMAIL_REGEX = /^[a-zA-Z0-9]+([._+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/

export const PHONE_REGEX = /^\+?[0-9]\d{9,14}$/

export const OTP_NUMERIC_REGEX = /^\d{6}$/

export const OTP_ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]{6}$/

export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/

export const CORP_REGISTER_REGEX = /^[A-Z0-9]{8,15}$/

export const TAN_REGEX = /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/

export const CIN_REGEX = /^[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/

export const IEC_REGEX = /^\d{10}$/

export const MSME_REGEX = /^UANIN[0-9]{12}$/

export const ORGANIZATION_NAME_REGEX = /^(?=.*[A-Za-z])[A-Za-z0-9\s.@$&*_-]+$/

export const COMPANY_NAME_REGEX = /^[a-zA-Z0-9\s&.,\-/]{2,100}$/

export const POSITION_REGEX = /^(?=.*[a-zA-Z])[a-zA-Z0-9\s&.,\-/]{2,100}$/

export const PINCODE_REGEX = /^\d{5,7}$/

export const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/

export const SWIFT_REGEX = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/

export const MICR_REGEX = /^\d{9}$/

export const ACCOUNT_NUMBER_REGEX = /^\d{9,18}$/

export const ALPHA_REGEX = /^[a-zA-Z ]+$/

export const ADDRESS_REGEX = /^[a-zA-Z0-9\s,./'#\-()]{3,50}$/

export const PROJECT_NAME_REGEX = /^(?=.*[A-Za-z0-9])[A-Za-z0-9\s.@$&*_-]+$/

export const ALPHA_NUMERIC_REGEX = /^[a-zA-Z0-9]+$/

export const FACEBOOK = /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9(.?)?]*$/

export const SKYPE = /^skype:[a-zA-Z][a-zA-Z0-9.,-_]{5,31}(\?call)?$/

export const LINKEDIN = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_%]+\/?$/

export const TWITTER = /^https?:\/\/(www\.)?(twitter|x)\.com\/[a-zA-Z0-9_]{1,15}\/?$/

export const WHATSAPP = /^https?:\/\/(wa\.me|api\.whatsapp\.com)\/[0-9]+$/

export const INSTAGRAM = /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/

export const LETTER_NUMBER_SPACE_HYPHEN_UNDERSCORE_REGEX = /^[a-zA-Z0-9\-_]+(?: [a-zA-Z0-9\-_]+)*$/

export const ERROR_MESSAGES = {
  required: (field: any) => `${field} is required`,
  noBlankSpaces: (field: any) => `${field} cannot be blank or contain spaces`,
  minLength: (field: any, length: any) => `${field} must be at least ${length} characters long`,
  maxLength: (field: any, length: any) => `${field} cannot be more than ${length} characters`,
  onlyLetters: (field: any) => `${field} can only contain letters`,
  invalidFormat: (field: any, format: any) => `Invalid ${field} format (${format})`,
  invalidEmailOrPhone: 'Please enter a valid email or phone number',
  invalidEmail: 'Please enter a valid email format',
  phoneNumberFormat: 'Phone number must be between 10 to 15 digits',
  passwordFormat:
    'Password must include at least one lowercase letter, one uppercase letter, one number, and one special character',
  otpLength: 'OTP must be exactly 6 digits',
  otpNumeric: 'OTP must be numeric',
  otpAlphanumeric: 'OTP must be alphanumeric',
  passwordsMustMatch: 'Confirm Passwords must match',
  acceptTerms: 'You must accept the Terms of Service and Privacy Policy to proceed.',
  defaultError: (field: any) => `${field}`,
  inValidCorpRegisterNumber:
    'Invalid Corporate Registration Number format (8-15 characters required e.g., U74140KA2020PTC136401)',
  invalidGSTNO: 'Invalid GST Number format (15 characters required)',
  gstLength: 'GST Number must be exactly 15 characters',
  nameFormate: (field: any) => `${field} can only contain alphanumeric, spaces, and symbols like . @ $ & * _ -`,
  invalidAddress: (field: any) =>
    `${field} can only contain letters, numbers, spaces, comma, period, apostrophe, hash, hyphen, parentheses and must be between 3 to 50 characters`,
  invalidNumber: (field: any) => `${field} must be a number`,
  wholeNumber: (field: any) => `${field} must be a whole number`,
  nonNegative: (field: any) => `${field} must be 0 or greater`,
  invalidSocialMedia: (field: any) => `${field} must be a valid social media URL`,
  letterNumberSpaceHyphenUnderscore: () => `letters, numbers, spaces, hyphens, and underscore not trailing spaces`,
  minValue: (field: any, value: any) => `${field} must be greater than or equal to ${value}`,
  maxValue: (field: any, value: any) => `${field} must be less than or equal to ${value}`,
  integer: (field: any) => `${field} must be a whole number`
}

export const cleanHTML = (value: string) => {
  // Remove empty tags and whitespace
  const strippedValue = value.replace(/<[^>]+>/g, '').trim()
  return strippedValue.length > 0
}
