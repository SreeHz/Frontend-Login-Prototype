document.addEventListener("DOMContentLoaded", function () {
    const generateWalletBtn = document.getElementById("generate-wallet-btn");
    const signInBtn = document.getElementById("sign-in-btn");

    const publicKeyDisplay = document.getElementById("public-key");
    const pubKeyInput = document.getElementById("pubKeyInput"); // Login Input
    const loginStatus = document.getElementById("login-status");

    let keyId = null;

    // 🚀 Generate Wallet
    generateWalletBtn.addEventListener("click", async () => {
        const response = await fetch("http://localhost:5000/generate-wallet", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        const wallet = await response.json();
        if (wallet.success) {
            publicKeyDisplay.textContent = wallet.publicKey;
            keyId = wallet.keyId;
            pubKeyInput.value = wallet.publicKey;
            pubKeyInput.style.backgroundColor = "#f0f0f0";
            signInBtn.disabled = false;
            alert("Wallet created! You can now log in.");
        } else {
            alert(wallet.error || "Failed to generate wallet.");
        }
    });

    // 🚀 Sign Message & Login
    signInBtn.addEventListener("click", async () => {
        let publicKey = pubKeyInput.value.trim();
        const message = "Login to our app";

        if (!publicKey || !keyId) {
            alert("Please generate a wallet before logging in.");
            return;
        }

        // Sign the message
        const signResponse = await fetch("http://localhost:5000/sign-message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keyId, message })
        });

        const signedData = await signResponse.json();
        if (!signedData.success) {
            alert("Failed to sign the message.");
            return;
        }

        // Send login request
        const loginResponse = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ publicKey, signedMessage: signedData.signedMessage })
        });

        const loginResult = await loginResponse.json();
        if (loginResult.success) {
            loginStatus.style.color = "green";
            loginStatus.textContent = `✅ Login successful! IP: ${loginResult.ip}, Device: ${loginResult.deviceInfo}`;
        } else {
            loginStatus.style.color = "red";
            loginStatus.textContent = "❌ Login failed!";
        }
    });
});
