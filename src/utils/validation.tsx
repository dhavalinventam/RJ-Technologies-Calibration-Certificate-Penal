import * as yup from 'yup'
import {
  ACCOUNT_NUMBER_REGEX,
  ADDRESS_REGEX,
  ALPHA_REGEX,
  CIN_REGEX,
  cleanHTML,
  EMAIL_REGEX,
  ERROR_MESSAGES,
  FACEBOOK,
  GST_REGEX,
  IEC_REGEX,
  IFSC_REGEX,
  INSTAGRAM,
  LINKEDIN,
  MICR_REGEX,
  MSME_REGEX,
  NAME_REGEX,
  NO_LEADING_TRAILING_SPACES,
  ORGANIZATION_NAME_REGEX,
  OTP_ALPHANUMERIC_REGEX,
  OTP_NUMERIC_REGEX,
  PAN_REGEX,
  PASSWORD_REGEX,
  PHONE_REGEX,
  PINCODE_REGEX,
  POSITION_REGEX,
  PROJECT_NAME_REGEX,
  SIGNIN_EMAIL_REGEX,
  SKYPE,
  SWIFT_REGEX,
  TAN_REGEX,
  TWITTER,
  WEBSITE_REGEX,
  WHATSAPP,
  LETTER_NUMBER_SPACE_HYPHEN_UNDERSCORE_REGEX,
  NO_BLANK_SPACES
} from './validation-constant'
import { capitalizeWords, datePickerMinDate } from './common'

export const signUpSchema = yup.object().shape({
  first_name: yup
    .string()
    .required(ERROR_MESSAGES.required('First Name'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('First Name'))
    .min(2, ERROR_MESSAGES.minLength('First Name', 2))
    .max(50, ERROR_MESSAGES.maxLength('First Name', 50))
    .matches(NAME_REGEX, ERROR_MESSAGES.onlyLetters('First Name')),

  last_name: yup
    .string()
    .required(ERROR_MESSAGES.required('Last Name'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Last Name'))
    .min(2, ERROR_MESSAGES.minLength('Last Name', 2))
    .max(50, ERROR_MESSAGES.maxLength('Last Name', 50))
    .matches(NAME_REGEX, ERROR_MESSAGES.onlyLetters('Last Name')),

  email: yup
    .string()
    .required(ERROR_MESSAGES.required('Email'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Email'))
    .matches(EMAIL_REGEX, ERROR_MESSAGES.invalidEmail)
    .max(64, ERROR_MESSAGES.maxLength('Email', 64)),
  contact_no: yup
    .string()
    .required(ERROR_MESSAGES.required('Phone Number'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Phone Number'))
    .matches(PHONE_REGEX, ERROR_MESSAGES.phoneNumberFormat),

  password: yup
    .string()
    .required(ERROR_MESSAGES.required('Password'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Password'))
    .min(8, ERROR_MESSAGES.minLength('Password', 8))
    .matches(PASSWORD_REGEX, ERROR_MESSAGES.passwordFormat),

  confirm_password: yup
    .string()
    .required(ERROR_MESSAGES.required('Confirm Password'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Confirm Password'))
    .oneOf([yup.ref('password')], ERROR_MESSAGES.passwordsMustMatch),

  terms: yup.boolean().oneOf([true], ERROR_MESSAGES.acceptTerms).required(ERROR_MESSAGES.required('Terms'))
})

export const loginSchema = yup.object().shape({
  loginId: yup
    .string()
    .required(ERROR_MESSAGES.required('Email / Phone Number'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Email / Phone Number'))
    .test('loginId', ERROR_MESSAGES.invalidEmailOrPhone, value => {
      if (!value) {
        return false
      }
      return PHONE_REGEX.test(value) || SIGNIN_EMAIL_REGEX.test(value)
    }),

  password: yup
    .string()
    .required(ERROR_MESSAGES.required('Password'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Password'))
    .min(8, ERROR_MESSAGES.minLength('Password', 8))
    .matches(PASSWORD_REGEX, ERROR_MESSAGES.passwordFormat),

  remember_me: yup.boolean()
})

export const forgotPasswordSchema = yup.object().shape({
  loginId: yup
    .string()
    .required(ERROR_MESSAGES.required('Email'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Email'))
    .matches(EMAIL_REGEX, ERROR_MESSAGES.invalidEmail)
    .max(64, ERROR_MESSAGES.maxLength('Email', 64))
})

export const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required(ERROR_MESSAGES.required('Password'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Password'))
    .min(8, ERROR_MESSAGES.minLength('Password', 8))
    .matches(PASSWORD_REGEX, ERROR_MESSAGES.passwordFormat),

  confirm_password: yup
    .string()
    .required(ERROR_MESSAGES.required('Confirm Password'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Confirm Password'))
    .oneOf([yup.ref('password')], ERROR_MESSAGES.passwordsMustMatch)
})

export const otpValidationSchema = yup.object().shape({
  mobileOtp: yup
    .string()
    .required(ERROR_MESSAGES.required('Mobile OTP'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Mobile OTP'))
    .length(6, ERROR_MESSAGES.otpLength)
    .matches(OTP_NUMERIC_REGEX, ERROR_MESSAGES.otpNumeric),

  emailOtp: yup
    .string()
    .required(ERROR_MESSAGES.required('Email OTP'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Email OTP'))
    .length(6, ERROR_MESSAGES.otpLength)
    .matches(OTP_ALPHANUMERIC_REGEX, ERROR_MESSAGES.otpAlphanumeric)
})

export const organizationValidationSchema = yup.object().shape({
  organizationType: yup.string().required(ERROR_MESSAGES.required('Organization Type')),
  industryType: yup.string().required(ERROR_MESSAGES.required('Industry')),
  country: yup.string().required(ERROR_MESSAGES.required('Country')),
  language: yup.string().required(ERROR_MESSAGES.required('Language'))
})

export const taxationValidationSchema = yup.object().shape({
  panNumber: yup
    .string()
    .nullable()
    .notRequired()
    .trim()
    .test('valid-pan', 'Invalid PAN format', function (value) {
      const { path, createError } = this
      if (!value || value.trim() === '') return true
      if (!NO_BLANK_SPACES.test(value)) {
        return createError({
          path,
          message: ERROR_MESSAGES.noBlankSpaces('PAN Number')
        })
      }
      if (!PAN_REGEX.test(value)) {
        return createError({
          path,
          message: ERROR_MESSAGES.invalidFormat('PAN', 'e.g., ABCDE1234F')
        })
      }
      return true
    }),
  organizationType: yup.string().required(ERROR_MESSAGES.required('Organization Type')),
  corpRegisterNumber: yup
    .string()
    .nullable()
    .notRequired()
    .trim()
    .test('corp-reg-validation', 'Invalid Corporate Registration Number', function (value) {
      const { path, createError } = this
      if (!value || value.trim() === '') return true
      if (!NO_BLANK_SPACES.test(value)) {
        return createError({
          path,
          message: ERROR_MESSAGES.noBlankSpaces('Corporate Registration Number')
        })
      }
      if (!CIN_REGEX.test(value)) {
        return createError({
          path,
          message: ERROR_MESSAGES.inValidCorpRegisterNumber
        })
      }
      return true
    }),
  tanNumber: yup
    .string()
    .nullable()
    .notRequired()
    .trim()
    .test('tan-validation', 'Invalid TAN Number', function (value) {
      const { path, createError } = this
      if (!value || value.trim() === '') return true
      if (!NO_BLANK_SPACES.test(value)) {
        return createError({
          path,
          message: ERROR_MESSAGES.noBlankSpaces('TAN Number')
        })
      }
      if (!TAN_REGEX.test(value)) {
        return createError({
          path,
          message: ERROR_MESSAGES.invalidFormat('TAN', 'e.g., ABCD12345E')
        })
      }
      return true
    }),

  iecCode: yup
    .string()
    .nullable()
    .notRequired()
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('IEC Code'))
    .matches(IEC_REGEX, ERROR_MESSAGES.defaultError(`IEC Code must be exactly 10 digits`))
    .transform(value => (value === '' ? null : value)),
  is_gst_registered: yup.boolean(),

  msmeNumber: yup.string().when('is_gst_registered', {
    is: true,
    then: schema =>
      schema
        .required(ERROR_MESSAGES.required('MSME Number'))
        .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('MSME Number'))
        .matches(MSME_REGEX, ERROR_MESSAGES.invalidFormat('MSME Number', 'e.g., UANIN123456789012')),
    otherwise: schema => schema.notRequired()
  })
})

export const companyDetailsValidationSchema = yup.object().shape({
  isGSTRegistered: yup.boolean(),

  gstId: yup.string().when('isGSTRegistered', {
    is: true,
    then: schema =>
      schema
        .required(ERROR_MESSAGES.required('GST Number'))
        .test('gst-length', 'GST Number must be exactly 15 characters', value => !value || value.length === 15)
        .matches(GST_REGEX, {
          excludeEmptyString: true,
          message: 'Invalid GST Number format (e.g., 27AAAAA0000A1Z1)'
        }),
    otherwise: schema => schema.nullable()
  }),
  gstType: yup.string().when('isGSTRegistered', {
    is: true,
    then: schema => schema.required(ERROR_MESSAGES.required('GST Type'))
  }),

  organizationName: yup
    .string()
    .required(ERROR_MESSAGES.required('Organization Name'))
    .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('Organization Name'))
    .matches(ORGANIZATION_NAME_REGEX, ERROR_MESSAGES.nameFormate('Organization Name'))
    .min(3, ERROR_MESSAGES.minLength('Organization Name', 3))
    .max(50, ERROR_MESSAGES.maxLength('Organization Name', 50)),
  alias: yup
    .string()
    .nullable()
    .notRequired()
    .test('alias-conditional-validation', 'Invalid alias', function (value) {
      const { path, createError } = this
      if (!value || value.trim() === '') return true
      if (value.length < 2) {
        return createError({
          path,
          message: ERROR_MESSAGES.minLength('Alias', 2)
        })
      }
      if (value.length > 50) {
        return createError({
          path,
          message: ERROR_MESSAGES.maxLength('Alias', 50)
        })
      }
      if (!NO_BLANK_SPACES.test(value)) {
        return createError({
          path,
          message: ERROR_MESSAGES.noBlankSpaces('Alias')
        })
      }
      if (!ORGANIZATION_NAME_REGEX.test(value)) {
        return createError({
          path,
          message: ERROR_MESSAGES.nameFormate('Alias')
        })
      }
      return true
    }),
  currency: yup.string().required(ERROR_MESSAGES.required('Currency')),
  contactPerson: yup
    .string()
    .required(ERROR_MESSAGES.required('Contact Person'))
    .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('Contact Person'))
    .min(2, ERROR_MESSAGES.minLength('Contact Person', 2))
    .max(50, ERROR_MESSAGES.maxLength('Contact Person', 50))
    .matches(NAME_REGEX, ERROR_MESSAGES.defaultError('Contact Person can only contain letters')),
  phoneNumber: yup
    .string()
    .required(ERROR_MESSAGES.required('Phone Number'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Phone Number'))
    .matches(PHONE_REGEX, ERROR_MESSAGES.phoneNumberFormat),

  address_line_1: yup
    .string()
    .required(ERROR_MESSAGES.required('House No / Flat / Building Name'))
    .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('House No / Flat / Building Name'))
    .min(3, ERROR_MESSAGES.minLength('House No / Flat / Building Name', 3))
    .max(50, ERROR_MESSAGES.maxLength('House No / Flat / Building Name', 50))
    .matches(ADDRESS_REGEX, ERROR_MESSAGES.invalidAddress('House No / Flat / Building Name'))
    .test('not-only-numbers', 'House No / Flat / Building Name cannot be only numbers', value => {
      if (!value) {
        return true
      } // In case field is empty, required() will handle it
      return !/^\d+$/.test(value) // ❌ Fail if it's only digits
    }),
  address_line_2: yup
    .string()
    .required(ERROR_MESSAGES.required('Area / Sector / Locality'))
    .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('Area / Sector / Locality'))
    .min(3, ERROR_MESSAGES.minLength('Area / Sector / Locality', 3))
    .max(50, ERROR_MESSAGES.maxLength('Area / Sector / Locality', 50))
    .matches(ADDRESS_REGEX, ERROR_MESSAGES.invalidAddress('Area / Sector / Locality'))
    .test('not-only-numbers', 'Area / Sector / Locality cannot be only numbers', value => {
      if (!value) {
        return true
      } // In case field is empty, required() will handle it
      return !/^\d+$/.test(value) // ❌ Fail if it's only digits
    }),
  state: yup.string().required(ERROR_MESSAGES.required('State')),
  city: yup.string().required(ERROR_MESSAGES.required('City')),
  pincode: yup
    .string()
    .required(ERROR_MESSAGES.required('Pincode'))
    .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('Pincode'))
    .matches(PINCODE_REGEX, ERROR_MESSAGES.invalidFormat('Pincode', '5-7 digits')),

  // email: yup
  //   .string()
  //   .nullable()
  //   // .required(ERROR_MESSAGES.required("Email"))
  //   // .matches(EMAIL_REGEX, ERROR_MESSAGES.invalidEmail)
  //   // .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces("Email"))
  //   .max(64)
  //   .trim(),
  email: yup
    .string()
    .nullable()
    .notRequired()
    .trim()
    .max(64, ERROR_MESSAGES.maxLength('Email', 64))
    .test('email-validation', ERROR_MESSAGES.invalidEmail, function (value) {
      const { path, createError } = this
      if (!value || value.trim() === '') return true
      if (!EMAIL_REGEX.test(value)) {
        return createError({ path, message: ERROR_MESSAGES.invalidEmail })
      }
      if (!NO_BLANK_SPACES.test(value)) {
        return createError({
          path,
          message: ERROR_MESSAGES.noBlankSpaces('Email')
        })
      }
      return true
    }),
  website: yup
    .string()
    .nullable()
    .notRequired()
    .test('website', ERROR_MESSAGES.invalidFormat('Website', 'Enter a valid URL'), value => {
      if (!value) {
        return true
      }
      return WEBSITE_REGEX.test(value)
    })
})

export const bankDetailsSchema = yup.object().shape({
  accountName: yup
    .string()
    .required(ERROR_MESSAGES.required('Account Name'))
    .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('Account Name'))
    .matches(ALPHA_REGEX, ERROR_MESSAGES.onlyLetters('Account Name')),

  accountNumber: yup
    .string()
    .required(ERROR_MESSAGES.required('Account Number'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Account Number'))
    .matches(ACCOUNT_NUMBER_REGEX, ERROR_MESSAGES.invalidFormat('Account Number', '9-18 digits')),

  bankName: yup
    .string()
    .required(ERROR_MESSAGES.required('Bank Name'))
    .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('Bank Name'))
    .matches(ALPHA_REGEX, ERROR_MESSAGES.onlyLetters('Bank Name')),

  ifscCode: yup
    .string()
    .required(ERROR_MESSAGES.required('IFSC Code'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('IFSC Code'))
    .matches(IFSC_REGEX, ERROR_MESSAGES.invalidFormat('IFSC Code', 'e.g., HDFC0123456')),

  swiftCode: yup
    .string()
    .required(ERROR_MESSAGES.required('SWIFT Code'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('SWIFT Code'))
    .matches(SWIFT_REGEX, ERROR_MESSAGES.invalidFormat('SWIFT Code', 'e.g., HDFCINBBXXX')),

  micrCode: yup
    .string()
    .required(ERROR_MESSAGES.required('MICR Code'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('MICR Code'))
    .matches(MICR_REGEX, ERROR_MESSAGES.invalidFormat('MICR Code', 'exactly 9 digits')),

  branch: yup
    .string()
    .required(ERROR_MESSAGES.required('Branch'))
    .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('Branch'))
    .matches(ALPHA_REGEX, ERROR_MESSAGES.onlyLetters('Branch'))
})

export const organizationBranchSchema = yup.object().shape({
  branch_name: yup
    .string()
    .required(ERROR_MESSAGES.required('Branch Name'))
    .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('Branch Name'))
    .matches(ALPHA_REGEX, ERROR_MESSAGES.onlyLetters('Branch Name'))
    .min(3, ERROR_MESSAGES.minLength('Branch Name', 3))
    .max(100, ERROR_MESSAGES.maxLength('Branch Name', 100)),

  email: yup
    .string()
    .required(ERROR_MESSAGES.required('Email'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Email'))
    .matches(EMAIL_REGEX, ERROR_MESSAGES.invalidEmail)
    .max(64),
  phone_number: yup
    .string()
    .required(ERROR_MESSAGES.required('Phone Number'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Phone Number'))
    .matches(PHONE_REGEX, ERROR_MESSAGES.phoneNumberFormat),

  whatsapp: yup
    .string()
    .nullable()
    .notRequired()
    .matches(PHONE_REGEX, `WhatsApp Number must be exactly 10 digits`)
    .transform(value => (value === '' ? null : value)),

  website: yup
    .string()
    .required(ERROR_MESSAGES.required('Website'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Website'))
    .matches(WEBSITE_REGEX, 'Enter a valid URL'),

  pan_number: yup
    .string()
    .nullable()
    .notRequired()
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('PAN Number'))
    .matches(PAN_REGEX, 'Invalid PAN format (e.g., ABCDE1234F)')
    .transform(value => (value === '' ? null : value)),

  msme_number: yup
    .string()
    .nullable()
    .notRequired()
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('MSME Number'))
    .matches(MSME_REGEX, ERROR_MESSAGES.invalidFormat('MSME Number', 'e.g., UANIN123456789012'))
    .transform(value => (value === '' ? null : value)),

  gst_registration_type: yup.string().test('required-if-gst_id', 'GST Registration Type is required', function (value) {
    const gst_id = this.parent.gst_id?.trim()
    if (gst_id && !value?.trim()) {
      return this.createError({
        message: 'GST Registration Type is required'
      })
    }
    return true
  }),

  gst_id: yup
    .string()
    .nullable()
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('GST Number'))
    .transform(value => (value?.trim() === '' ? null : value))
    .test('required-if-gst_registration_type', 'GST Number is required', function (value) {
      const gst_type = this.parent.gst_registration_type?.trim()
      if (gst_type && !value?.trim()) {
        return this.createError({ message: 'GST Number is required' })
      }
      return true
    })
    .test('gst-length', 'GST Number must be exactly 15 characters', function (value) {
      if (!value) {
        return true
      }
      return value.length === 15
    })
    .test('gst-format', 'Invalid GST Number format (e.g., 27AAAAA0000A1Z1)', function (value) {
      if (!value) {
        return true
      }
      return GST_REGEX.test(value)
    }),

  language_id: yup.string().required(ERROR_MESSAGES.required('Language')),

  currency_code_id: yup.string().required(ERROR_MESSAGES.required('Currency')),

  address_details: yup.object().shape({
    addresses: yup
      .array()
      .of(
        yup.object().shape({
          address_line_1: yup
            .string()
            .required(ERROR_MESSAGES.required('House No / Flat / Building Name'))
            .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('House No / Flat / Building Name'))
            .min(3, ERROR_MESSAGES.minLength('House No / Flat / Building Name', 3))
            .max(50, ERROR_MESSAGES.maxLength('House No / Flat / Building Name', 50))
            .matches(ADDRESS_REGEX, ERROR_MESSAGES.invalidAddress('House No / Flat / Building Name'))
            .test('not-only-numbers', 'House No / Flat / Building Name cannot be only numbers', value => {
              if (!value) {
                return true
              } // In case field is empty, required() will handle it
              return !/^\d+$/.test(value) // ❌ Fail if it's only digits
            }),

          address_line_2: yup
            .string()
            .required(ERROR_MESSAGES.required('Area / Sector / Locality'))
            .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('Area / Sector / Locality'))
            .min(3, ERROR_MESSAGES.minLength('Area / Sector / Locality', 3))
            .max(50, ERROR_MESSAGES.maxLength('Area / Sector / Locality', 50))
            .matches(ADDRESS_REGEX, ERROR_MESSAGES.invalidAddress('Area / Sector / Locality'))
            .test('not-only-numbers', 'Area / Sector / Locality cannot be only numbers', value => {
              if (!value) {
                return true
              } // In case field is empty, required() will handle it
              return !/^\d+$/.test(value) // ❌ Fail if it's only digits
            }),

          country: yup.string().required(ERROR_MESSAGES.required('Country')),

          city: yup.string().required(ERROR_MESSAGES.required('City')),

          state: yup.string().required(ERROR_MESSAGES.required('State')),

          pincode: yup
            .string()
            .required(ERROR_MESSAGES.required('Pincode'))
            .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('Pincode'))
            .matches(PINCODE_REGEX, ERROR_MESSAGES.invalidFormat('Pincode', '5-7 digits'))
        })
      )
      // .min(1, ERROR_MESSAGES.minLength("Address", 1))
      .required(ERROR_MESSAGES.required('Address details'))
  })
})

export const leadValidationSchema = yup.object().shape({
  contact_details: yup.object().required(ERROR_MESSAGES.required('Contact Details')),
  budget: yup
    .string()
    .nullable()
    .notRequired()
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Budget'))
    .matches(/^\d+$/, 'Only whole numbers are allowed')
    .transform(value => (value === '' ? null : value)), // Allows only digits (no decimals)
  lead_receive_date: yup.string().nullable().notRequired(),
  status_id: yup
    .mixed()
    .transform(value => {
      if (value && typeof value === 'object' && value.value) {
        return value.value
      }
      return value
    })
    .test('is-string', ERROR_MESSAGES.required('Status'), value => {
      return typeof value === 'string' && value.trim().length > 0
    }),
  source_platform_id: yup
    .mixed()
    .transform(value => {
      if (value && typeof value === 'object' && value.value) {
        return value.value
      }
      return value
    })
    .test('is-string', ERROR_MESSAGES.required('Source'), value => {
      return typeof value === 'string' && value.trim().length > 0
    }),
  last_contact_date: yup
    .string()
    .nullable()
    .notRequired()
    .test('last-contact-after-receive', 'Last Contact Date cannot be before Received Date', function (value) {
      const { lead_receive_date } = this.parent
      if (!lead_receive_date || !value) {
        return true
      } // Skip validation if either is not set
      return new Date(value) >= new Date(lead_receive_date)
    }),
  // first_name: yup
  //   .string()
  //   .required(ERROR_MESSAGES.required("First Name"))
  //   .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces("First Name"))
  //   .min(2, ERROR_MESSAGES.minLength("First Name", 2))
  //   .max(50, ERROR_MESSAGES.maxLength("First Name", 50))
  //   .matches(NAME_REGEX, ERROR_MESSAGES.onlyLetters("First Name")),

  // last_name: yup
  //   .string()
  //   .required(ERROR_MESSAGES.required("Last Name"))
  //   .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces("Last Name"))
  //   .min(2, ERROR_MESSAGES.minLength("Last Name", 2))
  //   .max(50, ERROR_MESSAGES.maxLength("Last Name", 50))
  //   .matches(NAME_REGEX, ERROR_MESSAGES.onlyLetters("Last Name")),

  // email: yup
  //   .string()
  //   .required(ERROR_MESSAGES.required("Email"))
  //   .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces("Email"))
  //   .matches(EMAIL_REGEX, ERROR_MESSAGES.invalidEmail)
  //   .max(64, ERROR_MESSAGES.maxLength("Email", 64)),

  // phone_number: yup
  //   .string()
  //   .required(ERROR_MESSAGES.required("Phone Number"))
  //   .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces("Phone Number"))
  //   .matches(PHONE_REGEX, ERROR_MESSAGES.phoneNumberFormat),

  // company_name: yup.string().when("is_individual_lead", {
  //   is: false,
  //   then: (schema) =>
  //     schema
  //       .required(ERROR_MESSAGES.required("Company Name"))
  //       .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces("Company Name"))
  //       .matches(
  //         ORGANIZATION_NAME_REGEX,
  //         ERROR_MESSAGES.nameFormate("Company Name")
  //       )
  //       .min(3, ERROR_MESSAGES.minLength("Company Name", 3))
  //       .max(50, ERROR_MESSAGES.maxLength("Company Name", 50)),
  //   otherwise: (schema) => schema.notRequired(),
  // }),

  // gst_number: yup
  //   .string()
  //   .nullable()
  //   .notRequired()
  //   .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces("GST Number"))
  //   .matches(GST_REGEX, ERROR_MESSAGES.invalidGSTNO)
  //   .length(15, ERROR_MESSAGES.gstLength)
  //   .transform((value) => (value === "" ? null : value)),
  // website: yup
  //   .string()
  //   .nullable()
  //   .notRequired()
  //   .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces("Website"))
  //   .matches(WEBSITE_REGEX, "Enter a valid URL")
  //   .transform((value) => (value === "" ? null : value)),
  // address_line_1: yup
  //   .string()
  //   .nullable()
  //   .transform((value) => (value === "" ? null : value))
  //   .notRequired()
  //   .matches(
  //     NO_LEADING_TRAILING_SPACES,
  //     ERROR_MESSAGES.noBlankSpaces("House No / Flat / Building Name")
  //   )
  //   .min(3, ERROR_MESSAGES.minLength("House No / Flat / Building Name", 3))
  //   .max(50, ERROR_MESSAGES.maxLength("House No / Flat / Building Name", 50))
  //   .matches(
  //     ADDRESS_REGEX,
  //     ERROR_MESSAGES.invalidAddress("House No / Flat / Building Name")
  //   )
  //   .test(
  //     "not-only-numbers",
  //     "House No / Flat / Building Name cannot be only numbers",
  //     (value) => {
  //       if (!value) {
  //         return true;
  //       } // In case field is empty, required() will handle it
  //       return !/^\d+$/.test(value); // ❌ Fail if it's only digits
  //     }
  //   ),

  lead_details: yup.array().of(
    yup.object().shape({
      is_delete: yup.boolean(),
      product_service_id: yup.mixed().nullable().notRequired(),
      variant_id: yup
        .mixed()
        .nullable()
        .test('is-required', ERROR_MESSAGES.required('Variant'), function (value) {
          const { is_delete, product_service_id, description, uom_id } = this.parent
          if (is_delete) return true

          // Check if any of the three key fields are filled
          const hasAnyKeyField = [product_service_id, description, uom_id].some(
            field => field !== null && field !== undefined && field !== '' && field !== 0
          )

          // If any key field is filled, all fields become required
          if (hasAnyKeyField) {
            return !!value
          }
          return true // Optional if no key fields are filled
        }),
      description: yup
        .string()
        .test('is-required', ERROR_MESSAGES.required('Description'), function (value) {
          const { is_delete, product_service_id, uom_id } = this.parent
          if (is_delete) return true

          // Check if any of the three key fields are filled
          const hasAnyKeyField = [product_service_id, value, uom_id].some(
            field => field !== null && field !== undefined && field !== '' && field !== 0
          )

          // If any key field is filled, all fields become required
          if (hasAnyKeyField) {
            return !!value && value.length >= 2 && value.length <= 255
          }
          return true // Optional if no key fields are filled
        })
        .test('min-length', ERROR_MESSAGES.minLength('Description', 2), function (value) {
          const { is_delete, product_service_id, uom_id } = this.parent
          if (is_delete) return true

          const hasAnyKeyField = [product_service_id, value, uom_id].some(
            field => field !== null && field !== undefined && field !== '' && field !== 0
          )

          if (hasAnyKeyField && value) {
            return value.length >= 2
          }
          return true
        })
        .test('max-length', ERROR_MESSAGES.maxLength('Description', 255), function (value) {
          const { is_delete, product_service_id, uom_id } = this.parent
          if (is_delete) return true

          const hasAnyKeyField = [product_service_id, value, uom_id].some(
            field => field !== null && field !== undefined && field !== '' && field !== 0
          )

          if (hasAnyKeyField && value) {
            return value.length <= 255
          }
          return true
        })
        .nullable()
        .notRequired(),
      uom_id: yup
        .mixed()
        .nullable()
        .test('is-required', ERROR_MESSAGES.required('UOM'), function (value) {
          const { is_delete, product_service_id, description } = this.parent
          if (is_delete) return true

          // Check if any of the three key fields are filled
          const hasAnyKeyField = [product_service_id, description, value].some(
            field => field !== null && field !== undefined && field !== '' && field !== 0
          )

          // If any key field is filled, all fields become required
          if (hasAnyKeyField) {
            return !!value
          }
          return true // Optional if no key fields are filled
        }),
      quantity: yup
        .mixed()
        .nullable()
        .test('is-required', ERROR_MESSAGES.required('Quantity'), function (value) {
          const { is_delete, product_service_id, description, uom_id } = this.parent
          if (is_delete) return true

          const hasAnyKeyField = [product_service_id, description, uom_id].some(
            field => field !== null && field !== undefined && field !== '' && field !== 0
          )

          if (hasAnyKeyField) {
            return !!value
          }
          return true
        }),
      rate: yup
        .mixed()
        .nullable()
        .test('is-required', ERROR_MESSAGES.required('Rate'), function (value) {
          const { is_delete, product_service_id, description, uom_id } = this.parent
          if (is_delete) return true

          const hasAnyKeyField = [product_service_id, description, uom_id].some(
            field => field !== null && field !== undefined && field !== '' && field !== 0
          )

          if (hasAnyKeyField) {
            return !!value
          }
          return true
        })
    })
  )
})

export const taskSchema = yup.object().shape({
  task_public_id: yup.string().required(ERROR_MESSAGES.required('Task Number')),
  task_title: yup
    .string()
    .required(ERROR_MESSAGES.required('Task Title'))
    .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('Task Title'))
    .min(3, ERROR_MESSAGES.minLength('Task Title', 3))
    .max(50, ERROR_MESSAGES.maxLength('Task Title', 50)),
  start_date: yup
    .string()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  due_date: yup
    .string()
    .nullable()
    .test('is-after-start', 'End Date must be after Start Date', function (value) {
      if (!value || !this.parent.start_date) return true
      const startDate = new Date(this.parent.start_date)
      const endDate = new Date(value)
      return endDate >= startDate
    }),
  // department: yup.string().required(ERROR_MESSAGES.required("Department")),
  // category: yup.string().required(ERROR_MESSAGES.required("Task Type")),
  status_id: yup
    .mixed()
    .transform(value => {
      if (value && typeof value === 'object' && value.value) {
        return value.value
      }
      return value
    })
    .test('is-string', ERROR_MESSAGES.required('Status'), value => {
      return typeof value === 'string' && value.trim().length > 0
    }),
  // priority: yup.string().required(ERROR_MESSAGES.required("Priority")),
  // tag_ids: yup
  //   .array()
  //   .of(
  //     yup
  //       .string()
  //       .matches(ALPHA_NUMERIC_REGEX, "Tags must be alphanumeric")
  //       .min(1, ERROR_MESSAGES.minLength("Tag", 1))
  //       .max(15, ERROR_MESSAGES.maxLength("Tag", 15))
  //       .required()
  //   )
  //   .nullable()
  //   .transform((value) => (value === undefined ? [] : value))
  //   .test("tag-validation", "Tags must be alphanumeric", (value) => {
  //     if (!value || value.length === 0) {
  //       return true;
  //     } // Optional if empty
  //     return value.every((tag) => ALPHA_NUMERIC_REGEX.test(tag));
  //   }),
  // assigned_to: yup.string().required("Assigned To is required"),
  source_type: yup
    .string()
    .nullable()
    .test('source-type-validation', function (value) {
      const sourceId = this.parent.source_id

      if (value && (!sourceId || !sourceId.trim())) {
        if (value) {
          return this.createError({
            message: `${capitalizeWords(value)} is required`,
            path: 'source_id'
          })
        }
        return this.createError({
          message: 'Source is required',
          path: 'source_id'
        })
      }
      return true
    }),

  source_id: yup
    .mixed()
    .transform(value => {
      if (value && typeof value === 'object' && value.value) {
        return value.value
      }
      return value
    })
    .test('is-string', ERROR_MESSAGES.required('Source'), value => {
      return typeof value === 'string' && value.trim().length > 0
    })
    .when('source_type', {
      is: (val: string) => !!val?.trim(),
      then: schema => schema.required(),
      otherwise: schema => schema.notRequired()
    })
})

export const leadReminderValidationSchema = yup.object().shape({
  reminder_title: yup
    .string()
    .required(ERROR_MESSAGES.required('Title'))
    .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('Title'))
    .matches(NAME_REGEX, ERROR_MESSAGES.onlyLetters('Title'))
    .min(3, ERROR_MESSAGES.minLength('Title', 3))
    .max(50, ERROR_MESSAGES.maxLength('Title', 50)),
  reminder_mode: yup
    .array()
    .of(yup.string())
    .required(ERROR_MESSAGES.required('Reminder Mode'))
    .min(1, ERROR_MESSAGES.required('Reminder Mode')),
  start_date: yup
    .string()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .required(ERROR_MESSAGES.required('Start Date')),

  time: yup
    .string()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .required(ERROR_MESSAGES.required('Time')),

  end_date: yup
    .string()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .when('is_recurring', {
      is: true,
      then: schema =>
        schema
          .required(ERROR_MESSAGES.required('End Date'))
          .test('is-after-start', 'End Date must be after Start Date', function (value) {
            if (!value || !this.parent.start_date) return true
            const startDate = new Date(this.parent.start_date)
            const endDate = new Date(value)
            return endDate >= startDate
          })
    }),

  frequency: yup.string().when('is_recurring', {
    is: true,
    then: schema => schema.required(ERROR_MESSAGES.required('Frequency'))
  })
})

export const leadFollowUpValidationSchema = yup.object().shape({
  note_description: yup
    .string()
    .required(ERROR_MESSAGES.required('Note Description'))
    .test('note-required', ERROR_MESSAGES.noBlankSpaces('Note Description'), value => cleanHTML(value || ''))
})

export const commentSchema = yup.object({
  comment: yup.string().test('not-empty', ERROR_MESSAGES.noBlankSpaces('Comment'), value => {
    if (value === '<p><br></p>') return true
    return cleanHTML(value || '')
  })
})

export const statusSchema = yup.object({
  name: yup
    .string()
    .required(ERROR_MESSAGES.required('Status Name'))
    .matches(NAME_REGEX, ERROR_MESSAGES.onlyLetters('Status Name'))
    .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('Status Name'))
    .min(2, ERROR_MESSAGES.minLength('Status Name', 2))
    .max(50, ERROR_MESSAGES.maxLength('Status Name', 50)),

  sequence: yup
    .string()
    .required(ERROR_MESSAGES.required('Order'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Order'))
    .matches(/^\d+$/, 'Order must be a valid number')
})

export const sourcePlatformSchema = yup.object({
  name: yup
    .string()
    .required(ERROR_MESSAGES.required('Source Platform Name'))
    .matches(NAME_REGEX, ERROR_MESSAGES.onlyLetters('Source Platform Name'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Source Platform Name'))
    .min(2, ERROR_MESSAGES.minLength('Source Platform Name', 2))
    .max(50, ERROR_MESSAGES.maxLength('Source Platform Name', 50))
})

export const contactValidationSchema = yup.object().shape({
  first_name: yup
    .string()
    .required(ERROR_MESSAGES.required('First Name'))
    .min(2, ERROR_MESSAGES.minLength('First Name', 2))
    .max(50, ERROR_MESSAGES.maxLength('First Name', 50))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('First Name'))
    .matches(NAME_REGEX, ERROR_MESSAGES.onlyLetters('First Name')),
  last_name: yup
    .string()
    .required(ERROR_MESSAGES.required('Last Name'))
    .min(2, ERROR_MESSAGES.minLength('Last Name', 2))
    .max(50, ERROR_MESSAGES.maxLength('Last Name', 50))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Last Name'))
    .matches(NAME_REGEX, ERROR_MESSAGES.onlyLetters('Last Name')),
  company_name: yup
    .string()
    .nullable()
    .notRequired()
    .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('Company Name'))
    .matches(PROJECT_NAME_REGEX, ERROR_MESSAGES.nameFormate('Company Name'))
    .min(3, ERROR_MESSAGES.minLength('Company Name', 3))
    .max(50, ERROR_MESSAGES.maxLength('Company Name', 50))
    .transform(value => (value === '' ? null : value)),
  email: yup
    .array()
    .of(
      yup.object().shape({
        email: yup
          .string()
          .optional()
          .test('no-blank-spaces', ERROR_MESSAGES.noBlankSpaces('Email'), value => {
            if (!value) return true // allow empty/undefined
            return NO_BLANK_SPACES.test(value) // fail if starts/ends with spaces
          })
          .test('valid-email-format', ERROR_MESSAGES.invalidEmail, value => {
            if (!value) return true // allow empty/undefined
            return EMAIL_REGEX.test(value) // validate email format
          })
          .max(64),
        email_label: yup.string().oneOf(['work', 'personal', 'other']).required()
        // is_primary_email: yup.boolean().required(),
      })
    )
    .min(1, 'At least one email is required'),

  phone_number: yup
    .array()
    .of(
      yup.object().shape({
        phone_number: yup
          .string()
          // .required(ERROR_MESSAGES.required("Phone Number"))
          .test('no-blank-spaces', ERROR_MESSAGES.noBlankSpaces('Phone Number'), value => {
            if (!value) return true // allow empty or optional
            return NO_BLANK_SPACES.test(value) // fail if starts/ends with whitespace
          })
          .test('valid-phone-format', ERROR_MESSAGES.phoneNumberFormat, value => {
            if (!value) return true // allow empty or optional
            return PHONE_REGEX.test(value) // test custom phone regex
          }),

        phone_label: yup.string().oneOf(['work', 'home', 'mobile']).required('Phone label is required')

        // is_primary_phone: yup.boolean().required(),
      })
    )
    .min(1, ERROR_MESSAGES.minLength('Phone Number', 1))
    .notRequired()
    .nullable(),

  address_line_1: yup
    .string()
    .nullable()
    .notRequired()
    .trim()
    .test('optional-or-valid', 'Invalid House No / Flat / Building Name', function (value) {
      if (!value) return true // Skip if empty (optional)

      // Apply all checks only if user types something
      const errors = []

      if (value.length < 3) {
        errors.push(ERROR_MESSAGES.minLength('House No / Flat / Building Name', 3))
      }

      if (value.length > 50) {
        errors.push(ERROR_MESSAGES.maxLength('House No / Flat / Building Name', 50))
      }

      if (!ADDRESS_REGEX.test(value)) {
        errors.push(ERROR_MESSAGES.invalidAddress('House No / Flat / Building Name'))
      }

      if (/^\d+$/.test(value)) {
        errors.push('House No / Flat / Building Name cannot be only numbers')
      }

      return errors.length === 0 || this.createError({ message: errors[0] })
    }),

  // address_line_1: yup.string().nullable().notRequired(), // Makes the field optional
  // .when("address_line_1", (value, schema) => {
  //   // Only apply validation if a value is entered
  //   if (value) {
  //     console.log("isEntered", value);
  //     return schema
  //       .matches(
  //         NO_LEADING_TRAILING_SPACES,
  //         ERROR_MESSAGES.noBlankSpaces("House No / Flat / Building Name")
  //       )
  //       .min(3, ERROR_MESSAGES.minLength("House No / Flat / Building Name", 3))
  //       .max(50, ERROR_MESSAGES.maxLength("House No / Flat / Building Name", 50))
  //       .matches(
  //         ADDRESS_REGEX,
  //         ERROR_MESSAGES.invalidAddress("House No / Flat / Building Name")
  //       )
  //       .test(
  //         "not-only-numbers",
  //         "House No / Flat / Building Name cannot be only numbers",
  //         (value) => !value || !/^\d+$/.test(value) // Skip validation if empty
  //       );
  //   }
  //   return schema; // Return unchanged schema if no value entered
  // }),
  address_line_2: yup.string().when('address_line_1', {
    is: (value: string) => !!value?.trim(),
    then: () =>
      yup
        .string()
        .required(ERROR_MESSAGES.required('Area / Sector / Locality'))
        .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('Area / Sector / Locality'))
        .min(3, ERROR_MESSAGES.minLength('Area / Sector / Locality', 3))
        .max(50, ERROR_MESSAGES.maxLength('Area / Sector / Locality', 50))
        .matches(ADDRESS_REGEX, ERROR_MESSAGES.invalidAddress('Area / Sector / Locality'))
        .test('not-only-numbers', 'Area / Sector / Locality cannot be only numbers', value => {
          if (!value) {
            return true
          } // In case field is empty, required() will handle it
          return !/^\d+$/.test(value) // ❌ Fail if it's only digits
        }),
    otherwise: () => yup.string().notRequired()
  }),
  state_id: yup.string().when('address_line_1', {
    is: (value: string) => !!value?.trim(),
    then: () => yup.string().required(ERROR_MESSAGES.required('State')),
    otherwise: () => yup.string().notRequired()
  }),
  city_id: yup.string().when('address_line_1', {
    is: (value: string) => !!value?.trim(),
    then: () => yup.string().required(ERROR_MESSAGES.required('City')),
    otherwise: () => yup.string().notRequired()
  }),
  country_id: yup.string().when('address_line_1', {
    is: (value: string) => !!value?.trim(),
    then: () => yup.string().required(ERROR_MESSAGES.required('Country')),
    otherwise: () => yup.string().notRequired()
  }),
  pincode: yup.string().when('address_line_1', {
    is: (value: string) => !!value?.trim(),
    then: () =>
      yup
        .string()
        .required(ERROR_MESSAGES.required('Pincode'))
        .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Pincode'))
        .matches(PINCODE_REGEX, ERROR_MESSAGES.invalidFormat('Pincode', '5-7 digits')),
    otherwise: () => yup.string().notRequired()
  }),
  social_media: yup.object().shape({
    facebook: yup
      .string()
      .nullable()
      .test('is-valid-facebook-url', ERROR_MESSAGES.invalidSocialMedia('Facebook'), value => {
        if (!value) return true
        return FACEBOOK.test(value)
      }),
    linkedin: yup
      .string()
      .nullable()
      .test('is-valid-linkedin-url', ERROR_MESSAGES.invalidSocialMedia('LinkedIn'), value => {
        if (!value) return true
        return LINKEDIN.test(value)
      }),
    whatsapp: yup
      .string()
      .nullable()
      .test('is-valid-whatsapp-url', ERROR_MESSAGES.invalidSocialMedia('WhatsApp'), value => {
        if (!value) return true
        return WHATSAPP.test(value)
      }),
    instagram: yup
      .string()
      .nullable()
      .test('is-valid-instagram-url', ERROR_MESSAGES.invalidSocialMedia('Instagram'), value => {
        if (!value) return true
        return INSTAGRAM.test(value)
      }),
    twitter: yup
      .string()
      .nullable()
      .test('is-valid-twitter-url', ERROR_MESSAGES.invalidSocialMedia('Twitter'), value => {
        if (!value) return true
        return TWITTER.test(value)
      }),
    skype: yup
      .string()
      .nullable()
      .test('is-valid-skype-url', ERROR_MESSAGES.invalidSocialMedia('Skype'), value => {
        if (!value) return true
        return SKYPE.test(value)
      })
  })

  // currency: yup.string().required(ERROR_MESSAGES.required("Currency")),

  // industry: yup.string().trim().nullable(),
  // facebook: yup.string().url("Invalid URL").nullable(),
  // instagram: yup.string().url("Invalid URL").nullable(),
  // linkedin: yup.string().url("Invalid URL").nullable(),
  // skype: yup.string().trim().nullable(),
  // twitter: yup.string().url("Invalid URL").nullable(),
  // whatsapp: yup.string().trim().nullable(),

  // tag_ids: yup.array().of(yup.string()).nullable(),
})

export const userValidationSchema = yup.object().shape({
  organization_id: yup.string().required(ERROR_MESSAGES.required('Organization')),
  branch_id: yup.string().required(ERROR_MESSAGES.required('Branch')),
  employees: yup.array().of(
    yup.object().shape({
      first_name: yup
        .string()
        .required(ERROR_MESSAGES.required('First Name'))
        .min(2, ERROR_MESSAGES.minLength('First Name', 2))
        .max(50, ERROR_MESSAGES.maxLength('First Name', 50))
        .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('First Name'))
        .matches(NAME_REGEX, ERROR_MESSAGES.onlyLetters('First Name')),
      last_name: yup
        .string()
        .required(ERROR_MESSAGES.required('Last Name'))
        .min(2, ERROR_MESSAGES.minLength('Last Name', 2))
        .max(50, ERROR_MESSAGES.maxLength('Last Name', 50))
        .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Last Name'))
        .matches(NAME_REGEX, ERROR_MESSAGES.onlyLetters('Last Name')),
      email: yup
        .string()
        .required(ERROR_MESSAGES.required('Email'))
        .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Email'))
        .matches(EMAIL_REGEX, ERROR_MESSAGES.invalidEmail)
        .max(64),
      contact_number: yup
        .string()
        .required(ERROR_MESSAGES.required('Phone Number'))
        .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Phone Number'))
        .matches(PHONE_REGEX, ERROR_MESSAGES.phoneNumberFormat),
      // position: yup.string().required("Position is required"),
      designation: yup
        .string()
        .required(ERROR_MESSAGES.required('Position'))
        .min(2, ERROR_MESSAGES.minLength('Position', 2))
        .max(50, ERROR_MESSAGES.maxLength('Position', 50))
        .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('Position'))
        // .matches(NAME_REGEX, ERROR_MESSAGES.onlyLetters("Position")),
        .matches(POSITION_REGEX, 'Position can only contain alphanumeric, spaces, and symbols like . , & / -'),
      department: yup.string().required(ERROR_MESSAGES.required('Department')),
      role_id: yup.string().required(ERROR_MESSAGES.required('Role'))
    })
  )
})

export const companyValidationSchema = yup.object().shape({
  company_name: yup
    .string()
    .required(ERROR_MESSAGES.required('Company Name'))
    .min(3, ERROR_MESSAGES.minLength('Company Name', 3))
    .max(50, ERROR_MESSAGES.maxLength('Company Name', 50))
    .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('Company Name'))
    .matches(ORGANIZATION_NAME_REGEX, ERROR_MESSAGES.nameFormate('Company Name')),
  website: yup
    .string()
    .transform(value => (value?.trim() === '' ? null : value)) // convert whitespace-only to null
    .nullable()
    .notRequired()
    .matches(WEBSITE_REGEX, 'Enter a valid URL'),
  gst_number: yup
    .string()
    .transform(value => (value?.trim() === '' ? null : value)) // convert whitespace-only to null
    .nullable()
    .notRequired()
    .test('gst-length', 'GST Number must be exactly 15 characters', value => !value || value.length === 15)
    .matches(GST_REGEX, {
      excludeEmptyString: true,
      message: 'Invalid GST Number format (e.g., 27AAAAA0000A1Z1)'
    }),
  /**
   * Validates the House No / Flat / Building Name field ensuring:
   * - It is a non-empty string.
   * - It does not contain any blank spaces.
   * - It is required with a specific error message for missing input.
   */
  address_line_1: yup
    .string()
    .required(ERROR_MESSAGES.required('House No / Flat / Building Name'))
    .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('House No / Flat / Building Name'))
    .min(3, ERROR_MESSAGES.minLength('House No / Flat / Building Name', 3))
    .max(50, ERROR_MESSAGES.maxLength('House No / Flat / Building Name', 50))
    .matches(ADDRESS_REGEX, ERROR_MESSAGES.invalidAddress('House No / Flat / Building Name'))
    .test('not-only-numbers', 'House No / Flat / Building Name cannot be only numbers', value => {
      if (!value) {
        return true
      } // In case field is empty, required() will handle it
      return !/^\d+$/.test(value) // ❌ Fail if it's only digits
    }),
  address_line_2: yup
    .string()
    .required(ERROR_MESSAGES.required('Area / Sector / Locality'))
    .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('Area / Sector / Locality'))
    .min(3, ERROR_MESSAGES.minLength('Area / Sector / Locality', 3))
    .max(50, ERROR_MESSAGES.maxLength('Area / Sector / Locality', 50))
    .matches(ADDRESS_REGEX, ERROR_MESSAGES.invalidAddress('Area / Sector / Locality'))
    .test('not-only-numbers', 'Area / Sector / Locality cannot be only numbers', value => {
      if (!value) {
        return true
      } // In case field is empty, required() will handle it
      return !/^\d+$/.test(value) // ❌ Fail if it's only digits
    }),
  country_id: yup.string().required(ERROR_MESSAGES.required('Country')),
  state_id: yup.string().required(ERROR_MESSAGES.required('State')),
  city_id: yup.string().required(ERROR_MESSAGES.required('City')),
  pincode: yup
    .string()
    .required(ERROR_MESSAGES.required('Pincode'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Pincode'))
    .matches(PINCODE_REGEX, ERROR_MESSAGES.invalidFormat('Pincode', '5-7 digits')),
  contacts: yup.array().of(
    yup.object().shape({
      first_name: yup
        .string()
        .required(ERROR_MESSAGES.required('First Name'))
        .min(2, ERROR_MESSAGES.minLength('First Name', 2))
        .max(50, ERROR_MESSAGES.maxLength('First Name', 50))
        .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('First Name'))
        .matches(NAME_REGEX, ERROR_MESSAGES.onlyLetters('First Name')),
      last_name: yup
        .string()
        .required(ERROR_MESSAGES.required('Last Name'))
        .min(2, ERROR_MESSAGES.minLength('Last Name', 2))
        .max(50, ERROR_MESSAGES.maxLength('Last Name', 50))
        .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Last Name'))
        .matches(NAME_REGEX, ERROR_MESSAGES.onlyLetters('Last Name')),
      email: yup
        .string()
        .required(ERROR_MESSAGES.required('Email'))
        .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Email'))
        .matches(EMAIL_REGEX, ERROR_MESSAGES.invalidEmail)
        .max(64),
      phone_number: yup
        .string()
        .required(ERROR_MESSAGES.required('Phone Number'))
        .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Phone Number'))
        .matches(PHONE_REGEX, ERROR_MESSAGES.phoneNumberFormat),
      position: yup
        .string()
        .nullable()
        .notRequired()
        .test(
          'validate-when-value-exists',
          'Position must be between 2 to 50 characters and contain alphanumeric, spaces, and symbols like . , & / -',
          function (value) {
            if (!value) {
              return true
            }
            const lengthValid = value.length >= 2 && value.length <= 50
            const regexValid = POSITION_REGEX.test(value)
            return lengthValid && regexValid
          }
        )
    })
  )
})

export const contactsValidationSchema = yup.object().shape({
  first_name: yup
    .string()
    .required(ERROR_MESSAGES.required('First Name'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('First Name'))
    .min(2, ERROR_MESSAGES.minLength('First Name', 2))
    .max(50, ERROR_MESSAGES.maxLength('First Name', 50))
    .matches(NAME_REGEX, ERROR_MESSAGES.onlyLetters('First Name')),

  last_name: yup
    .string()
    .required(ERROR_MESSAGES.required('Last Name'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Last Name'))
    .min(2, ERROR_MESSAGES.minLength('Last Name', 2))
    .max(50, ERROR_MESSAGES.maxLength('Last Name', 50))
    .matches(NAME_REGEX, ERROR_MESSAGES.onlyLetters('Last Name')),

  email: yup
    .string()
    .required(ERROR_MESSAGES.required('Email'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Email'))
    .matches(EMAIL_REGEX, ERROR_MESSAGES.invalidEmail)
    .max(64, ERROR_MESSAGES.maxLength('Email', 64)),

  phone_number: yup
    .string()
    .required(ERROR_MESSAGES.required('Phone Number'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Phone Number'))
    .matches(PHONE_REGEX, ERROR_MESSAGES.phoneNumberFormat)
})

export const projectValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required(ERROR_MESSAGES.required('Project Name'))
    .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('Project Name'))
    .matches(PROJECT_NAME_REGEX, ERROR_MESSAGES.nameFormate('Project Name'))
    .min(2, ERROR_MESSAGES.minLength('Project Name', 2))
    .max(50, ERROR_MESSAGES.maxLength('Project Name', 50)),
  sr_number: yup
    .string()
    .required(ERROR_MESSAGES.required('Project Number'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Project Number'))
    .min(2, ERROR_MESSAGES.minLength('Project Number', 2))
    .max(50, ERROR_MESSAGES.maxLength('Project Number', 50)),
  total_rate: yup
    .mixed() // use mixed to customize handling
    .test('is-valid-number', ERROR_MESSAGES.invalidNumber('Total rate'), (value: any) => {
      if (value === undefined || value === null || value === '') return true
      return !isNaN(Number(value)) && !isNaN(parseFloat(value))
    })
    .transform((value: any) => {
      if (value === '' || value === null || value === undefined) return undefined
      return Number(value)
    })
    .test(
      'is-non-negative',
      ERROR_MESSAGES.nonNegative('Total rate'),
      (value: any) => value === undefined || value >= 0
    )
    .typeError(ERROR_MESSAGES.invalidNumber('Total rate'))
    .test(
      'is-integer',
      ERROR_MESSAGES.wholeNumber('Total rate'),
      value => value === undefined || Number.isInteger(value)
    ),

  start_date: yup
    .string()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),

  end_date: yup
    .string()
    .nullable()
    .test('is-after-start', 'End Date must be after Start Date', function (value) {
      if (!value || !this.parent.start_date) return true
      const startDate = new Date(this.parent.start_date)
      const endDate = new Date(value)
      return endDate >= startDate
    }),
  contract_start_date: yup
    .string()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),

  contract_end_date: yup
    .string()
    .nullable()
    .test('is-after-start', 'Contract End Date must be after Start Date', function (value) {
      if (!value || !this.parent.contract_start_date) return true
      const startDate = new Date(this.parent.contract_start_date)
      const endDate = new Date(value)
      return endDate >= startDate
    }),
  referral_person_name: yup
    .string()
    .nullable()
    .transform((value: any) => (value === '' ? null : value))
    .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('Referral Person Name'))
    .matches(NAME_REGEX, ERROR_MESSAGES.onlyLetters('Referral Person Name'))
    .min(2, ERROR_MESSAGES.minLength('Referral Person Name', 2))
    .max(50, ERROR_MESSAGES.maxLength('Referral Person Name', 50)),

  referral_amount: yup
    .number()
    .nullable()
    .transform((value: any) => (value === '' ? null : value))
    .min(0, 'Referral amount must be 0 or greater')
    .test('is-integer', 'Referral amount must be a whole number', value => value === null || Number.isInteger(value))
})

export const changePasswordSchema = yup.object().shape({
  current_password: yup
    .string()
    .required(ERROR_MESSAGES.required('Current Password'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Current Password')),
  new_password: yup
    .string()
    .required(ERROR_MESSAGES.required('New Password'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('New Password'))
    .min(8, ERROR_MESSAGES.minLength('New Password', 8))
    .matches(PASSWORD_REGEX, ERROR_MESSAGES.passwordFormat),
  confirm_password: yup
    .string()
    .required(ERROR_MESSAGES.required('Confirm New Password'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Confirm New Password'))
    .oneOf([yup.ref('new_password')], ERROR_MESSAGES.passwordsMustMatch)
})

export const editProfileSchema = yup.object().shape({
  first_name: yup
    .string()
    .required(ERROR_MESSAGES.required('First Name'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('First Name'))
    .min(2, ERROR_MESSAGES.minLength('First Name', 2))
    .max(50, ERROR_MESSAGES.maxLength('First Name', 50))
    .matches(NAME_REGEX, ERROR_MESSAGES.onlyLetters('First Name')),

  last_name: yup
    .string()
    .required(ERROR_MESSAGES.required('Last Name'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Last Name'))
    .min(2, ERROR_MESSAGES.minLength('Last Name', 2))
    .max(50, ERROR_MESSAGES.maxLength('Last Name', 50))
    .matches(NAME_REGEX, ERROR_MESSAGES.onlyLetters('Last Name')),

  email: yup
    .string()
    .required(ERROR_MESSAGES.required('Email'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Email'))
    .matches(EMAIL_REGEX, ERROR_MESSAGES.invalidEmail)
    .max(64, ERROR_MESSAGES.maxLength('Email', 64)),
  contact_no: yup
    .string()
    .required(ERROR_MESSAGES.required('Phone Number'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Phone Number'))
    .matches(PHONE_REGEX, ERROR_MESSAGES.phoneNumberFormat)
})

export const addEditCategoryMasterSchema = yup.object().shape({
  category_name: yup
    .string()
    .required(ERROR_MESSAGES.required('Category name'))
    .min(2, ERROR_MESSAGES.minLength('Category name', 2))
    .max(50, ERROR_MESSAGES.maxLength('Category name', 50))
    .trim(ERROR_MESSAGES.noBlankSpaces('Category name'))
    .matches(
      LETTER_NUMBER_SPACE_HYPHEN_UNDERSCORE_REGEX,
      ERROR_MESSAGES.invalidFormat('Category name', ERROR_MESSAGES.letterNumberSpaceHyphenUnderscore())
    ),
  parent_id: yup.object().nullable(),
  description: yup
    .string()
    .required(ERROR_MESSAGES.required('Description'))
    .min(2, ERROR_MESSAGES.minLength('Description', 2))
    .max(255, ERROR_MESSAGES.maxLength('Description', 255))
})

export const addEditProductTypeSchema = yup.object().shape({
  product_type: yup
    .string()
    .required(ERROR_MESSAGES.required('Product Type name'))
    .min(2, ERROR_MESSAGES.minLength('Product Type name', 2))
    .max(50, ERROR_MESSAGES.maxLength('Product Type name', 50))
    .trim(ERROR_MESSAGES.noBlankSpaces('Product Type name'))
    .matches(
      LETTER_NUMBER_SPACE_HYPHEN_UNDERSCORE_REGEX,
      ERROR_MESSAGES.invalidFormat('Product Type name', 'letters, numbers, spaces, hyphens, and underscores')
    ),
  details: yup
    .string()
    .required(ERROR_MESSAGES.required('Description'))
    .min(2, ERROR_MESSAGES.minLength('Description', 2))
    .max(255, ERROR_MESSAGES.maxLength('Description', 255))
})

export const warehouseMasterSchema = yup.object().shape({
  code: yup.string().required(ERROR_MESSAGES.required('Warehouse code')),
  name: yup.string().required(ERROR_MESSAGES.required('Warehouse name')),
  parent_warehouse_id: yup.object().nullable().optional(),
  address_line_1: yup
    .string()
    .required(ERROR_MESSAGES.required('House No / Flat / Building Name'))
    .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('House No / Flat / Building Name')),
  address_line_2: yup
    .string()
    .required(ERROR_MESSAGES.required('Area / Sector / Locality'))
    .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('Area / Sector / Locality')),
  country_id: yup.string().required(ERROR_MESSAGES.required('Country')),
  state_id: yup.string().required(ERROR_MESSAGES.required('State')),
  city_id: yup.string().required(ERROR_MESSAGES.required('City')),
  pincode: yup
    .string()
    .required(ERROR_MESSAGES.required('Pincode'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Pincode'))
    .matches(PINCODE_REGEX, ERROR_MESSAGES.invalidFormat('Pincode', '5-7 digits')),
  is_active: yup.string().required(ERROR_MESSAGES.required('Status'))
})

export const uomMasterSchema = yup.object().shape({
  name: yup
    .string()
    .required(ERROR_MESSAGES.required('Name'))
    .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('Name')),
  abbreviation: yup
    .string()
    .required(ERROR_MESSAGES.required('Abbreviation'))
    .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('Abbreviation')),
  variant_id: yup.object().required(ERROR_MESSAGES.required('Product variant')),
  description: yup.string().optional().nullable(),
  base_unit: yup.boolean(),
  standard_unit_id: yup.object().nullable().optional(),
  uom_family: yup.string().required(ERROR_MESSAGES.required('UOM family')),
  is_active: yup.boolean().required(ERROR_MESSAGES.required('Status')),
  conversion_factor: yup.number().optional(),
  is_base: yup.boolean().required(ERROR_MESSAGES.required('Base unit'))
})

export const addEditPriceMasterSchema = yup.object({
  currency_code: yup
    .string()
    .nullable()
    .when('price_type', {
      is: (val: any) => !!val,
      then: schema =>
        schema.typeError(ERROR_MESSAGES.required('Currency')).required(ERROR_MESSAGES.required('Currency')),
      otherwise: schema => schema.optional()
    }),
  rate: yup.number().when('price_type', {
    is: (val: any) => !!val,
    then: schema => schema.typeError(ERROR_MESSAGES.required('Rate')).required(ERROR_MESSAGES.required('Rate')),
    otherwise: schema => schema.optional()
  }),
  effective_from: yup.string().when('price_type', {
    is: (val: any) => !!val,
    then: schema => schema.required(ERROR_MESSAGES.required('Effective from date')),
    otherwise: schema => schema.optional()
  }),
  effective_to: yup.string().optional(),
  variant_id: yup
    .mixed()
    .test('variant_id-type-check', ERROR_MESSAGES.required('Product variant'), value => {
      if (!value) return false
      if (typeof value === 'string' || typeof value === 'number') return true
      if (typeof value === 'object' && value !== null && 'value' in value && value.value) {
        return true
      }
      return false
    })
    .required(ERROR_MESSAGES.required('Product variant')),
  price_type: yup.string().required('Price type is required')
})

export const discountMasterSchema = yup.object().shape({
  offer_name: yup
    .string()
    .required(ERROR_MESSAGES.required('Offer name'))
    .min(2, ERROR_MESSAGES.minLength('Offer name', 2))
    .max(100, ERROR_MESSAGES.maxLength('Offer name', 100))
    .matches(
      LETTER_NUMBER_SPACE_HYPHEN_UNDERSCORE_REGEX,
      ERROR_MESSAGES.invalidFormat('Offer name', ERROR_MESSAGES.letterNumberSpaceHyphenUnderscore())
    ),
  offer_code: yup
    .string()
    .required(ERROR_MESSAGES.required('Offer code'))
    .min(3, ERROR_MESSAGES.minLength('Offer code', 3))
    .max(15, ERROR_MESSAGES.maxLength('Offer code', 15))
    .matches(
      /^[A-Z0-9_-]+$/,
      ERROR_MESSAGES.invalidFormat('Offer code', 'Uppercase letters, numbers, hyphens, and underscores')
    ),
  discount_type: yup
    .string()
    .required(ERROR_MESSAGES.required('Discount type'))
    .oneOf(
      ['percentage', 'buyxgety', 'flat', 'tiered', 'bogo', 'bundle'],
      ERROR_MESSAGES.invalidFormat('Discount type', 'Percentage, Flat, Buy X Get Y, Tiered, BOGO, Bundle')
    ),
  discount_value: yup
    .number()
    .typeError(ERROR_MESSAGES.required('Discount value'))
    .required(ERROR_MESSAGES.required('Discount value'))
    .min(0, ERROR_MESSAGES.minValue('Discount value', 0))
    .when('discount_type', (value: any, schema: any) => {
      if (value[0] === 'percentage') {
        return schema.max(100, ERROR_MESSAGES.maxValue('Percentage', 100))
      }
      return schema
    }),
  buy_quantity: yup
    .number()
    .nullable()
    .when('discount_type', {
      is: 'buyxgety',
      then: schema =>
        schema
          .required(ERROR_MESSAGES.required('Buy quantity'))
          .min(1, ERROR_MESSAGES.minValue('Buy quantity', 1))
          .integer(ERROR_MESSAGES.integer('Buy quantity')),
      otherwise: schema => schema.notRequired().nullable()
    }),

  get_quantity: yup
    .number()
    .nullable()
    .when('discount_type', {
      is: 'buyxgety',
      then: schema =>
        schema
          .required(ERROR_MESSAGES.required('Get quantity'))
          .min(0, ERROR_MESSAGES.minValue('Get quantity', 0))
          .integer(ERROR_MESSAGES.integer('Get quantity')),
      otherwise: schema => schema.notRequired().nullable()
    }),
  applicable_on: yup
    .string()
    .required(ERROR_MESSAGES.required('Applicable on'))
    .oneOf(
      ['all', 'product', 'product_variant', 'category'],
      ERROR_MESSAGES.invalidFormat('Applicable on', 'All, Product, Product Variant, Category')
    ),
  applicable_entity_ids: yup.array().of(yup.string()).optional(),
  min_order_amount: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .required(ERROR_MESSAGES.required('Minimum order amount'))
    .min(0, ERROR_MESSAGES.minValue('Minimum order amount', 0)),
  max_discount_amount: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .nullable()
    .optional()
    .min(0, ERROR_MESSAGES.minValue('Maximum discount amount', 0)),
  currency_id: yup.string().required(ERROR_MESSAGES.required('Currency')),
  start_date: yup
    .mixed()
    .nullable()
    .required(ERROR_MESSAGES.required('Start date'))
    .test(
      'start-date',
      ERROR_MESSAGES.invalidFormat('Start date', 'Start date cannot be in the past'),
      function (value) {
        if (!value) return false
        const selectedDate = new Date(value as any)
        const today = datePickerMinDate()
        return selectedDate >= today
      }
    ),
  end_date: yup
    .mixed()
    .nullable()
    .optional()
    .test('end-date', ERROR_MESSAGES.invalidFormat('End date', 'End date must be after start date'), function (value) {
      const startDate = this.parent.start_date
      if (!value) return true
      if (!startDate) return true
      const endDateValue = new Date(value as any)
      const startDateValue = new Date(startDate as any)
      return endDateValue > startDateValue
    }),

  usage_limit_per_customer: yup
    .number()
    .required(ERROR_MESSAGES.required('Usage limit per customer'))
    .min(1, ERROR_MESSAGES.minValue('Usage limit per customer', 1))
    .integer(ERROR_MESSAGES.integer('Usage limit per customer')),
  total_usage_limit: yup
    .number()
    .required(ERROR_MESSAGES.required('Total usage limit'))
    .min(1, ERROR_MESSAGES.minValue('Total usage limit', 1))
    .integer(ERROR_MESSAGES.integer('Total usage limit')),
  auto_apply: yup.boolean().required(ERROR_MESSAGES.required('Auto apply')),
  is_active: yup.boolean().required(ERROR_MESSAGES.required('Active status')),
  is_stackable: yup.boolean().required(ERROR_MESSAGES.required('Stackable status'))
})

export const addEditServiceSchema = yup.object().shape({
  name: yup
    .string()
    .required(ERROR_MESSAGES.required('Service name'))
    .min(2, ERROR_MESSAGES.minLength('Service name', 2))
    .matches(
      LETTER_NUMBER_SPACE_HYPHEN_UNDERSCORE_REGEX,
      ERROR_MESSAGES.invalidFormat('Service name', ERROR_MESSAGES.letterNumberSpaceHyphenUnderscore())
    ),
  code: yup
    .string()
    .required(ERROR_MESSAGES.required('Service code'))
    .min(2, ERROR_MESSAGES.minLength('Service code', 2))
})

export const addEditProductServiceSchema = yup.object().shape({
  name: yup
    .string()
    .required(ERROR_MESSAGES.required('Product name'))
    .min(2, ERROR_MESSAGES.minLength('Product name', 2))
    .matches(
      LETTER_NUMBER_SPACE_HYPHEN_UNDERSCORE_REGEX,
      ERROR_MESSAGES.invalidFormat('Product name', ERROR_MESSAGES.letterNumberSpaceHyphenUnderscore())
    ),
  code: yup
    .string()
    .required(ERROR_MESSAGES.required('Product code'))
    .min(2, ERROR_MESSAGES.minLength('Product code', 2)),
  product_sku: yup
    .string()
    .required(ERROR_MESSAGES.required('Product SKU'))
    .min(2, ERROR_MESSAGES.minLength('Product SKU', 2))
})

export const customerSchema = yup.object().shape({
  account_name: yup
    .string()
    .required(ERROR_MESSAGES.required('Company name'))
    .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('Company name')),
  first_name: yup
    .string()
    .required(ERROR_MESSAGES.required('First name'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('First name')),
  last_name: yup
    .string()
    .required(ERROR_MESSAGES.required('Last name'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Last name')),
  email: yup
    .array()
    .of(
      yup.object().shape({
        email: yup
          .string()
          .nullable()
          .notRequired()
          .test('email', ERROR_MESSAGES.invalidFormat('Email', 'Enter a valid email'), value => {
            if (!value) return true
            return EMAIL_REGEX.test(value)
          })
      })
    )
    .notRequired(),
  phone_number: yup
    .array()
    .of(
      yup.object().shape({
        phone_number: yup
          .string()
          .nullable()
          .notRequired()
          .test(
            'phone_number_format',
            ERROR_MESSAGES.invalidFormat('Phone number', 'Enter a valid phone number'),
            value => {
              if (!value) return true
              return PHONE_REGEX.test(value)
            }
          )
      })
    )
    .notRequired()
})

export const customerTaxationSchema = yup.object().shape({
  gst_number: yup
    .string()
    .transform(value => (value?.trim() === '' ? null : value)) // convert whitespace-only to null
    .nullable()
    .required(ERROR_MESSAGES.required('GST Number'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('GST Number'))
    .test('gst-length', 'GST Number must be exactly 15 characters', value => !value || value.length === 15)
    .matches(GST_REGEX, {
      excludeEmptyString: true,
      message: 'Invalid GST Number format (e.g., 27AAAAA0000A1Z1)'
    }),
  gst_reg_type: yup.string().required(ERROR_MESSAGES.required('GST Type')),
  pan_number: yup
    .string()
    .nullable()
    .notRequired()
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('PAN Number'))
    .matches(PAN_REGEX, ERROR_MESSAGES.invalidFormat('PAN', 'e.g., ABCDE1234F')),
  tan_number: yup
    .string()
    .required(ERROR_MESSAGES.required('TAN Number'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('TAN Number'))
    .matches(TAN_REGEX, ERROR_MESSAGES.invalidFormat('TAN', 'e.g., ABCD12345E')),
  organization_type_id: yup.string().required(ERROR_MESSAGES.required('Organization Type'))
})

export const customerBillingShippingSchema = yup.object().shape({
  billingAddressLine1: yup
    .string()
    .required(ERROR_MESSAGES.required('House No / Flat / Building Name'))
    .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('House No / Flat / Building Name')),
  billingAddressLine2: yup
    .string()
    .required(ERROR_MESSAGES.required('Area / Sector / Locality'))
    .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('Area / Sector / Locality')),
  billingCountry: yup.string().required(ERROR_MESSAGES.required('Country')),
  billingState: yup.string().required(ERROR_MESSAGES.required('State')),
  billingCity: yup.string().required(ERROR_MESSAGES.required('City')),
  billingPincode: yup
    .string()
    .required(ERROR_MESSAGES.required('Pincode'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Pincode'))
    .matches(PINCODE_REGEX, ERROR_MESSAGES.invalidFormat('Pincode', 'Pincode')),
  shippingAddressLine1: yup
    .string()
    .required(ERROR_MESSAGES.required('House No / Flat / Building Name'))
    .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('House No / Flat / Building Name')),
  shippingAddressLine2: yup
    .string()
    .required(ERROR_MESSAGES.required('Area / Sector / Locality'))
    .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('Area / Sector / Locality')),
  shippingCountry: yup.string().required(ERROR_MESSAGES.required('Country')),
  shippingState: yup.string().required(ERROR_MESSAGES.required('State')),
  shippingCity: yup.string().required(ERROR_MESSAGES.required('City')),
  shippingPincode: yup
    .string()
    .required(ERROR_MESSAGES.required('Pincode'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Pincode'))
    .matches(PINCODE_REGEX, ERROR_MESSAGES.invalidFormat('Pincode', 'Pincode'))
})

export const customerBankDetailsSchema = yup.object().shape({
  bank_name: yup
    .string()
    .required(ERROR_MESSAGES.required('Bank name'))
    .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('Bank name')),
  account_name: yup
    .string()
    .required(ERROR_MESSAGES.required('Account name'))
    .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('Account name')),
  account_number: yup
    .string()
    .required(ERROR_MESSAGES.required('Account number'))
    .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Account number'))
    .matches(ACCOUNT_NUMBER_REGEX, ERROR_MESSAGES.invalidFormat('Account number', 'Account number')),
  currency_code_id: yup.string().required(ERROR_MESSAGES.required('Currency')).nullable()
})

export const proposalFormSchema = yup.object().shape({
  order_number: yup
    .string()
    .required(ERROR_MESSAGES.required('Order number'))
    .min(2, ERROR_MESSAGES.minLength('Order number', 2)),
  source_type: yup
    .string()
    .required(ERROR_MESSAGES.required('Source type'))
    .test('source-type-validation', function (value) {
      const sourceId = this.parent.source_id

      if (value && (!sourceId || !sourceId.trim())) {
        if (value) {
          return this.createError({
            message: `${capitalizeWords(value)} is required`,
            path: 'source_id'
          })
        }
        return this.createError({
          message: 'Source is required',
          path: 'source_id'
        })
      }
      return true
    }),
  source_id: yup
    .mixed()
    .transform(value => {
      if (value && typeof value === 'object' && value.value) {
        return value.value
      }
      return value
    })
    .test('is-string', ERROR_MESSAGES.required('Source'), value => {
      return typeof value === 'string' && value.trim().length > 0
    })
    .when('source_type', {
      is: (val: string) => !!val?.trim(),
      then: schema => schema.required(),
      otherwise: schema => schema.notRequired()
    }),
  contact_id: yup
    .mixed()
    .transform(value => {
      if (value && typeof value === 'object' && value.value) {
        return value.value
      }
      return value
    })
    .test('is-required', ERROR_MESSAGES.required('Contact'), function (value) {
      return !!value // Ensure "value" exists inside the object
    })
    .nullable(),
  order_details: yup.array().of(
    yup.object().shape({
      is_delete: yup.boolean(),
      product_service_id: yup
        .mixed()
        .test('is-required', ERROR_MESSAGES.required('Product Service'), function (value) {
          const { is_delete } = this.parent
          return is_delete ? true : !!value
        })
        .nullable(),
      variant_id: yup
        .mixed()
        .test('is-required', ERROR_MESSAGES.required('Variant'), function (value) {
          const { is_delete } = this.parent
          return is_delete ? true : !!value
        })
        .nullable(),
      description: yup.string().when('is_delete', {
        is: true,
        then: schema => schema.notRequired(),
        otherwise: schema =>
          schema
            .required(ERROR_MESSAGES.required('Description'))
            .min(2, ERROR_MESSAGES.minLength('Description', 2))
            .max(255, ERROR_MESSAGES.maxLength('Description', 255))
      }),
      uom_id: yup
        .mixed()
        .test('is-required', ERROR_MESSAGES.required('UOM'), function (value) {
          const { is_delete } = this.parent
          return is_delete ? true : !!value
        })
        .nullable()
    })
  )
})

export const estimateFormSchema = yup.object().shape({
  order_number: yup
    .string()
    .required(ERROR_MESSAGES.required('Order number'))
    .min(2, ERROR_MESSAGES.minLength('Order number', 2)),
  source_type: yup
    .string()
    .required(ERROR_MESSAGES.required('Source type'))
    .test('source-type-validation', function (value) {
      const sourceId = this.parent.source_id

      if (value && (!sourceId || !sourceId.trim())) {
        if (value) {
          return this.createError({
            message: `${capitalizeWords(value)} is required`,
            path: 'source_id'
          })
        }
        return this.createError({
          message: 'Source is required',
          path: 'source_id'
        })
      }
      return true
    }),
  source_id: yup
    .mixed()
    .transform(value => {
      if (value && typeof value === 'object' && value.value) {
        return value.value
      }
      return value
    })
    .test('is-string', ERROR_MESSAGES.required('Source'), value => {
      return typeof value === 'string' && value.trim().length > 0
    })
    .when('source_type', {
      is: (val: string) => !!val?.trim(),
      then: schema => schema.required(),
      otherwise: schema => schema.notRequired()
    }),
  contact_id: yup
    .mixed()
    .transform(value => {
      if (value && typeof value === 'object' && value.value) {
        return value.value
      }
      return value
    })
    .test('is-required', ERROR_MESSAGES.required('Contact'), function (value) {
      return !!value // Ensure "value" exists inside the object
    })
    .nullable(),
  billing_address: yup.object().shape({
    address_line_1: yup
      .string()
      .required(ERROR_MESSAGES.required('House No / Flat / Building Name'))
      .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('House No / Flat / Building Name'))
      .min(3, ERROR_MESSAGES.minLength('House No / Flat / Building Name', 3))
      .max(50, ERROR_MESSAGES.maxLength('House No / Flat / Building Name', 50))
      .matches(ADDRESS_REGEX, ERROR_MESSAGES.invalidAddress('House No / Flat / Building Name'))
      .test('not-only-numbers', 'House No / Flat / Building Name cannot be only numbers', value => {
        if (!value) return true // required() will catch empty values
        return !/^\d+$/.test(value)
      }),

    address_line_2: yup
      .string()
      .required(ERROR_MESSAGES.required('Area / Sector / Locality'))
      .matches(NO_LEADING_TRAILING_SPACES, ERROR_MESSAGES.noBlankSpaces('Area / Sector / Locality'))
      .min(3, ERROR_MESSAGES.minLength('Area / Sector / Locality', 3))
      .max(50, ERROR_MESSAGES.maxLength('Area / Sector / Locality', 50))
      .matches(ADDRESS_REGEX, ERROR_MESSAGES.invalidAddress('Area / Sector / Locality'))
      .test('not-only-numbers', 'Area / Sector / Locality cannot be only numbers', value => {
        if (!value) return true
        return !/^\d+$/.test(value)
      }),

    city_id: yup.string().required(ERROR_MESSAGES.required('City')),

    state_id: yup.string().required(ERROR_MESSAGES.required('State')),

    country_id: yup.string().required(ERROR_MESSAGES.required('Country')),

    pincode: yup
      .string()
      .required(ERROR_MESSAGES.required('Pincode'))
      .matches(NO_BLANK_SPACES, ERROR_MESSAGES.noBlankSpaces('Pincode'))
      .matches(PINCODE_REGEX, ERROR_MESSAGES.invalidFormat('Pincode', '5-7 digits'))
  }),

  order_details: yup.array().of(
    yup.object().shape({
      is_delete: yup.boolean(),
      product_service_id: yup
        .mixed()
        .test('is-required', ERROR_MESSAGES.required('Product Service'), function (value) {
          const { is_delete } = this.parent
          return is_delete ? true : !!value
        })
        .nullable(),
      variant_id: yup
        .mixed()
        .test('is-required', ERROR_MESSAGES.required('Variant'), function (value) {
          const { is_delete } = this.parent
          return is_delete ? true : !!value
        })
        .nullable(),
      description: yup.string().when('is_delete', {
        is: true,
        then: schema => schema.notRequired(),
        otherwise: schema =>
          schema
            .required(ERROR_MESSAGES.required('Description'))
            .min(2, ERROR_MESSAGES.minLength('Description', 2))
            .max(255, ERROR_MESSAGES.maxLength('Description', 255))
      }),
      uom_id: yup
        .mixed()
        .test('is-required', ERROR_MESSAGES.required('UOM'), function (value) {
          const { is_delete } = this.parent
          return is_delete ? true : !!value
        })
        .nullable()
    })
  ),
  status: yup
    .mixed()
    .transform(value => {
      if (value && typeof value === 'object' && value.value) {
        return value.value
      }
      return value
    })
    .test('is-string', ERROR_MESSAGES.required('Status'), value => {
      return typeof value === 'string' && value.trim().length > 0
    })
    .oneOf(
      ['draft', 'pending', 'in_progress', 'completed', 'cancelled'],
      'Status must be one of: draft, pending, in_progress, completed, cancelled'
    )
    .nullable(),
  assigned_to: yup
    .mixed()
    .transform(value => {
      if (Array.isArray(value)) {
        return value.map(item => (typeof item === 'object' && item.value ? item.value : item))
      }
      return value
    })
    .test('is-array-of-uuids', 'Each value in assigned_to must be a UUID', value => {
      if (!Array.isArray(value)) return true // Allow empty or non-array
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      return value.every(item => typeof item === 'string' && uuidRegex.test(item))
    })
    .nullable()
})
