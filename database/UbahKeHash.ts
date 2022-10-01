import crypto from 'crypto';

const rahasiaKue = process.env.SECRETKUE!;

const algorithm = 'aes-128-gcm';
const key = Buffer.from(rahasiaKue, 'utf-8');
const iv = crypto.randomBytes(16);

export const encrypt = (text: any) => {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), IniDataRahasia: encrypted.toString('hex') };
}

export const decrypt = (text: {iv: string, IniDataRahasia: string}) => {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.IniDataRahasia, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    // decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

// const promise_kunci = crypto.subtle.generateKey(
//     {
//         name: "AES-GCM",
//         length: 256
//     },
//     true,
//     ["encrypt", "decrypt"]
// );

// export const encrypt = async (text: string) => {
//     const encoded = textEncoder.encode(text);
//     const iv = crypto.getRandomValues(new Uint8Array(12));
//     const Kunci = await promise_kunci;
//     const hasilEncrypt = await crypto.subtle.encrypt(
//         { name: 'AES-GCM', iv: iv },
//         Kunci,
//         encoded
//     )
//     console.log(hasilEncrypt);

//     return hasilEncrypt;
// }

// export const decrypt = async (iv: BufferSource, text: any) => {
    //     const Kunci = await promise_kunci;
//     return await crypto.subtle.decrypt(
//         { name: "AES-GCM", iv},
//         Kunci,
//         text
//     )
// }

//unsur: https://stackoverflow.com/questions/18279141/javascript-string-encryption-and-decryption
// const textToChars = (garam: string) => garam.split("").map((c) => c.charCodeAt(0));

// export const encrypt = (text: string) => {
//     const byteHex = (n: any) => ("0" + Number(n).toString(16)).substr(-2);
//     const applySaltToChar = (code: any) => textToChars(rahasiaKue).reduce((a, b) => a ^ b, code);
  
//     return text
//         .split("")
//         .map(textToChars)
//         .map(applySaltToChar)
//         .map(byteHex)
//         .join("");
// };
  
// export const decrypt = (encoded: string) => {
//     const applySaltToChar = (code: any) => textToChars(rahasiaKue).reduce((a, b) => a ^ b, code);
//     return encoded
//         .match(/.{1,2}/g)!
//         .map((hex) => parseInt(hex, 16))
//         .map(applySaltToChar)
//         .map((charCode) => String.fromCharCode(charCode))
//         .join("");
// };