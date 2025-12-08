/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import CryptoJS from "crypto-js";

const secret_key: string = process.env.NEXT_PUBLIC_SECRET_KEY || ""; // 🔐 Replace this with your actual secret key

export const encryptData = (data: unknown): string | undefined => {
  try {
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      secret_key,
    ).toString();

    return encryptedData;
  } catch (error) {
    console.error("Error encrypting data:", error);
  }
};

export const decryptData = <T = any>(data: string | null): T | null => {
  try {
    if (data) {
      const bytes = CryptoJS.AES.decrypt(data, secret_key);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

      return JSON.parse(decryptedData) as T;
    }
  } catch (error) {
    console.error("Error decrypting data:", error);
  }

  return null;
};
