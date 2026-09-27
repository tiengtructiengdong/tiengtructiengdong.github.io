/**
 * contact.ts
 * Central place for contact details shown on the landing / role pages.
 *
 * Edit these values to update the phone + email rendered across the site.
 */

export interface ContactInfo {
  /** E.164 phone number used for the `tel:` link. */
  phone: string;
  /** Human-readable phone number shown to the user. */
  phoneDisplay: string;
  /** Email address used for the `mailto:` link. */
  email: string;
}

export const contact: ContactInfo = {
  phone: "+84889838077",
  phoneDisplay: "+84 889 838 077",
  email: "tiengtructiengdong@gmail.com",
};
