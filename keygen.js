const crypto = require("crypto");
const fs = require("fs");

for (let i = 1; i <= 5; i++) {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" }
    });

    fs.writeFileSync(`public_key${i}.pem`, publicKey);
    fs.writeFileSync(`private_key${i}.pem`, privateKey);

    console.log(`Key pair ${i} generated.`);
}
