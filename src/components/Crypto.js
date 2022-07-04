import CryptoJS from "crypto-js";

const secretKey = "ajudalcomhagooman~!@#$%^&*()_+12" // 32자리
const key = CryptoJS.enc.Utf8.parse(secretKey);

const iv = CryptoJS.enc.Utf8.parse("ajudalcomhagooma"); // 16자리

// 암호화
export const encode = (value) => {
    const encrypted = CryptoJS.AES.encrypt(value, key, { iv: iv }).toString();

    return encrypted;
}

// 복호화
export const decode = (value) => {
    const bytes = CryptoJS.AES.decrypt(value, key, { iv: iv });
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    return decrypted;
}