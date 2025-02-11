// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function () {
    const generateWalletBtn = document.getElementById("generate-wallet-btn");
    const signInBtn = document.getElementById("sign-in-btn");

    const publicKeyDisplay = document.getElementById("public-key");
    const privateKeyDisplay = document.getElementById("private-key");
    const pubKeyInput = document.getElementById("pubKeyInput"); // Login Input Box
    const loginStatus = document.getElementById("login-status");

    let keyId = null; // Store keyId after wallet generation

    // 🚀 Generate Wallet Function (Auto-Paste Public Key in Login Box)
    // Inside the generateWallet function
    generateWalletBtn.addEventListener("click", async () => {
        const wallet = await generateWallet();
        if (wallet) {
            // ✅ Fix: Preserve new lines in the Public Key
            const formattedPublicKey = wallet.publicKey.replace(/\\n/g, "\n");
    
            publicKeyDisplay.textContent = formattedPublicKey;
            privateKeyDisplay.textContent = wallet.privateKey || "Private key not available";
            keyId = wallet.keyId;
    
            // ✅ Auto-fill Public Key into Login Input (with correct formatting)
            pubKeyInput.value = formattedPublicKey;
            pubKeyInput.style.backgroundColor = "#f0f0f0"; // Indicate readonly
    
            // ✅ Enable Login Button
            signInBtn.disabled = false;
    
            alert("Wallet created! You can now log in.");
        } else {
            alert("Failed to generate wallet. Try again.");
        }
    });
    

    // 🚀 Login Function
    signInBtn.addEventListener("click", async () => {
        let publicKey = pubKeyInput.value.trim();
        const message = "Login to our app";

        if (!publicKey || !keyId) {
            alert("Please generate a wallet before logging in.");
            return;
        }

        // ✅ Fix: Ensure public key format before sending
        publicKey = publicKey.replace(/\n/g, "\\n");

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
