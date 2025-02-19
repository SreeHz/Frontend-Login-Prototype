document.addEventListener("DOMContentLoaded", () => {
    const publicKeyInput = document.getElementById("publicKey");
    const signedMessageInput = document.getElementById("signedMessage");
    const loginButton = document.querySelector("button");  // Target the login button

    // Function to fetch keyId using the public key
    async function fetchKeyId(publicKey) {
        try {
            const response = await fetch("http://localhost:5000/authenticate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ publicKey })
            });

            const data = await response.json();
            if (!data.success) throw new Error(data.error);

            return data.keyId;  // Return keyId from backend
        } catch (error) {
            console.error("Error fetching keyId:", error);
            alert("Authentication failed! " + error.message);
            return null;
        }
    }

    // Function to sign the message (mock signing since we're using our own wallet)
    function signMessage(message, keyId) {
        return btoa(message + keyId);  // Base64 encoding as a simple signing method
    }

    // Function to detect real IP using WebRTC
    async function detectRealIP() {
        return new Promise((resolve) => {
            const pc = new RTCPeerConnection({ iceServers: [] });
            pc.createDataChannel("");
            pc.createOffer()
                .then(offer => pc.setLocalDescription(offer))
                .catch(() => resolve("Unknown"));

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    const ipRegex = /([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/;
                    const ipMatch = event.candidate.candidate.match(ipRegex);
                    if (ipMatch) resolve(ipMatch[1]);
                }
            };

            setTimeout(() => resolve("Unknown"), 1000); // Fallback if no response
        });
    }

    // Function to handle login
    async function login() {
        const publicKey = publicKeyInput.value.trim();
        const signedMessage = signedMessageInput.value.trim();

        if (!publicKey || !signedMessage) {
            alert("Please enter both Public Key and Signed Message!");
            return;
        }

        try {
            // Detect real IP (via WebRTC)
            const realIp = await detectRealIP();

            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ publicKey, signedMessage, realIp })
            });

            const data = await response.json();
            if (response.ok) {
                alert("✅ Login Successful!\n" + JSON.stringify(data, null, 2));
            } else {
                alert("❌ Login Failed: " + data.error);
            }
        } catch (error) {
            console.error("Error logging in:", error);
            alert("⚠️ Server error. Please try again.");
        }
    }

    // Event listener for login button
    loginButton.addEventListener("click", login);
});
