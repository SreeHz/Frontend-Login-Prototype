const API_BASE_URL = "https://blockchain-login-prototype.onrender.com"; // Replace with your actual backend URL

/**
 * Generate a new wallet by calling the backend API
 * @returns {Promise<{publicKey: string, keyId: string, privateKey: string}>}
 */
async function generateWallet() {
    try {
        const response = await fetch(`${API_BASE_URL}/generate-wallet`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) throw new Error("Failed to generate wallet");

        return await response.json();
    } catch (error) {
        console.error("Error generating wallet:", error);
        return null;
    }
}

/**
 * Sign a message using the backend's stored private key
 * @param {string} keyId - The unique key identifier for the user
 * @param {string} message - The message to sign
 * @returns {Promise<{signedMessage: string}>}
 */
async function signMessage(keyId, message) {
    try {
        const response = await fetch(`${API_BASE_URL}/sign-message`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keyId, message })
        });

        if (!response.ok) throw new Error("Failed to sign message");

        return await response.json();
    } catch (error) {
        console.error("Error signing message:", error);
        return null;
    }
}

/**
 * Log in by verifying the signed message with the backend
 * @param {string} publicKey - The user's public key
 * @param {string} signedMessage - The signed message
 * @returns {Promise<{success: boolean, message: string, ip: string, deviceInfo: string}>}
 */
async function loginUser(publicKey, signedMessage) {
    try {
        // ✅ Fix: Ensure proper formatting of public key before sending
        const formattedPublicKey = publicKey.replace(/\n/g, "\\n");

        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ publicKey: formattedPublicKey, signedMessage })
        });

        if (!response.ok) throw new Error("Login failed");

        return await response.json();
    } catch (error) {
        console.error("Error logging in:", error);
        return null;
    }
}

