import type { Address } from './types';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const COUNTRIES: { code: string; name: string; zip: RegExp; zipHint: string }[] = [
  { code: 'DE', name: 'Deutschland', zip: /^\d{5}$/, zipHint: '5 Ziffern, z. B. 10115' },
  { code: 'AT', name: 'Österreich', zip: /^\d{4}$/, zipHint: '4 Ziffern, z. B. 1010' },
  { code: 'CH', name: 'Schweiz', zip: /^\d{4}$/, zipHint: '4 Ziffern, z. B. 8001' },
  { code: 'FR', name: 'Frankreich', zip: /^\d{5}$/, zipHint: '5 Ziffern, z. B. 75001' },
  { code: 'BE', name: 'Belgien', zip: /^\d{4}$/, zipHint: '4 Ziffern, z. B. 1000' },
  { code: 'NL', name: 'Niederlande', zip: /^\d{4}\s?[A-Za-z]{2}$/, zipHint: 'z. B. 1012 AB' },
  { code: 'LU', name: 'Luxemburg', zip: /^(L-)?\d{4}$/, zipHint: '4 Ziffern, z. B. 1009' },
  { code: 'IT', name: 'Italien', zip: /^\d{5}$/, zipHint: '5 Ziffern, z. B. 00118' },
  { code: 'ES', name: 'Spanien', zip: /^\d{5}$/, zipHint: '5 Ziffern, z. B. 28001' },
];

export type Errors<T> = Partial<Record<keyof T, string>>;

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'Bitte gib eine E-Mail-Adresse ein';
  if (!EMAIL_RE.test(email.trim())) return 'Bitte gib eine gültige E-Mail-Adresse ein';
}

export function validateAddress(a: Address): Errors<Address> {
  const e: Errors<Address> = {};
  if (!a.firstName.trim()) e.firstName = 'Bitte gib deinen Vornamen ein';
  if (!a.lastName.trim()) e.lastName = 'Bitte gib deinen Nachnamen ein';
  if (a.address1.trim().length < 3) e.address1 = 'Bitte gib Straße und Hausnummer ein';
  if (!a.city.trim()) e.city = 'Bitte gib einen Ort ein';
  const country = COUNTRIES.find((c) => c.code === a.country);
  if (!country) e.country = 'Bitte wähle ein Land';
  else if (!country.zip.test(a.zip.trim())) e.zip = `Bitte gib eine gültige Postleitzahl ein (${country.zipHint})`;
  if (a.phone.trim() && !/^\+?[\d\s()/-]{6,20}$/.test(a.phone.trim())) e.phone = 'Bitte gib eine gültige Telefonnummer ein';
  return e;
}
