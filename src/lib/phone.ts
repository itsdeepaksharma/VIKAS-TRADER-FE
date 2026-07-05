const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

export const PHONE_VALIDATION_MESSAGE = 'Enter a valid 10-digit mobile number starting with 6–9.';

export function sanitizePhoneInput(value: string): string {
  return value.replace(/\D/g, '').slice(0, 10);
}

export function normalizeIndianPhone(value: string): string {
  let digits = value.replace(/\D/g, '');

  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  return digits;
}

export function isValidIndianPhone(value: string): boolean {
  return INDIAN_MOBILE_REGEX.test(normalizeIndianPhone(value));
}
