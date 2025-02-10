// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function () {
    const generateWalletBtn = document.getElementById("generate-wallet-btn");
    const signInBtn = document.getElementById("sign-in-btn");

    const publicKeyDisplay = document.getElementById("public-key");
    const privateKeyDisplay = document.getElementById("private-key");
    const pubKeyInput = document.getElementById("pubKeyInput");
    const loginStatus = document.getElementById("login-status");

    let keyId = null; // Store keyId after wallet generation

    // 🚀 Generate Wallet Function
    generateWalletBtn.addEventListener("click", async () => {
        const wallet = await generateWallet();
        if (wallet) {
            publicKeyDisplay.textContent = wallet.publicKey;
            privateKeyDisplay.textContent = wallet.privateKey;
            keyId = wallet.keyId; // Store keyId for signing

            alert("Wallet created! Save your private key securely.");
        } else {
            alert("Failed to generate wallet. Try again.");
        }
    });

    // 🚀 Login Function
    signInBtn.addEventListener("click", async () => {
        const publicKey = pubKeyInput.value.trim();
        const message = "Login to our app";

        if (!publicKey || !keyId) {
            alert("Please enter your public key and generate a wallet first.");
            return;
        }

        // Step 1: Sign the message using the private key (on the backend)
        const signed = await signMessage(keyId, message);
        if (!signed) {
            alert("Failed to sign the message.");
            return;
        }

        // Step 2: Send signed message to backend for login verification
        const loginResponse = await loginUser(publicKey, signed.signedMessage);
        if (loginResponse && loginResponse.success) {
            loginStatus.style.color = "green";
            loginStatus.textContent = `✅ Login successful! IP: ${loginResponse.ip}, Device: ${loginResponse.deviceInfo}`;
        } else {
            loginStatus.style.color = "red";
            loginStatus.textContent = "❌ Login failed! Check your credentials.";
        }
    });
});
