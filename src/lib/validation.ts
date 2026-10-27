import type { Address } from './types';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const COUNTRIES: { code: string; name: string; zip: RegExp; zipHint: string }[] = [
  { code: 'DE', name: 'Germany', zip: /^\d{5}$/, zipHint: '5 digits, e.g. 10115' },
  { code: 'AT', name: 'Austria', zip: /^\d{4}$/, zipHint: '4 digits, e.g. 1010' },
  { code: 'CH', name: 'Switzerland', zip: /^\d{4}$/, zipHint: '4 digits, e.g. 8001' },
  { code: 'FR', name: 'France', zip: /^\d{5}$/, zipHint: '5 digits, e.g. 75001' },
  { code: 'BE', name: 'Belgium', zip: /^\d{4}$/, zipHint: '4 digits, e.g. 1000' },
  { code: 'NL', name: 'Netherlands', zip: /^\d{4}\s?[A-Za-z]{2}$/, zipHint: 'e.g. 1012 AB' },
  { code: 'LU', name: 'Luxembourg', zip: /^(L-)?\d{4}$/, zipHint: '4 digits, e.g. 1009' },
  { code: 'IT', name: 'Italy', zip: /^\d{5}$/, zipHint: '5 digits, e.g. 00118' },
  { code: 'ES', name: 'Spain', zip: /^\d{5}$/, zipHint: '5 digits, e.g. 28001' },
];

export type Errors<T> = Partial<Record<keyof T, string>>;

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'Enter an email address';
  if (!EMAIL_RE.test(email.trim())) return 'Enter a valid email address';
}

export function validateAddress(a: Address): Errors<Address> {
  const e: Errors<Address> = {};
  if (!a.firstName.trim()) e.firstName = 'Enter a first name';
  if (!a.lastName.trim()) e.lastName = 'Enter a last name';
  if (a.address1.trim().length < 3) e.address1 = 'Enter an address';
  if (!a.city.trim()) e.city = 'Enter a city';
  const country = COUNTRIES.find((c) => c.code === a.country);
  if (!country) e.country = 'Select a country';
  else if (!country.zip.test(a.zip.trim())) e.zip = `Enter a valid postal code (${country.zipHint})`;
  if (a.phone.trim() && !/^\+?[\d\s()/-]{6,20}$/.test(a.phone.trim())) e.phone = 'Enter a valid phone number';
  return e;
}
