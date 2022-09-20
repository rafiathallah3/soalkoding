//unsur: https://stackoverflow.com/questions/18279141/javascript-string-encryption-and-decryption

const textToChars = (garam: string) => garam.split("").map((c) => c.charCodeAt(0));
const rahasiaKue = process.env.SECRETKUE!;

export const encrypt = (text: string) => {
    const byteHex = (n: any) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code: any) => textToChars(rahasiaKue).reduce((a, b) => a ^ b, code);
  
    return text
        .split("")
        .map(textToChars)
        .map(applySaltToChar)
        .map(byteHex)
        .join("");
};
  
export const decrypt = (encoded: string) => {
    const applySaltToChar = (code: any) => textToChars(rahasiaKue).reduce((a, b) => a ^ b, code);
    return encoded
        .match(/.{1,2}/g)!
        .map((hex) => parseInt(hex, 16))
        .map(applySaltToChar)
        .map((charCode) => String.fromCharCode(charCode))
        .join("");
};