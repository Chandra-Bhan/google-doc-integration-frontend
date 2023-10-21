// Authentication.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function Authentication() {
  const location = useLocation();

  useEffect(() => {
    // Extract the authorization code from the query string
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");

    // Do something with the authorization code
    if (code) {
      // The "code" variable now contains the authorization code
      handleAuthCallback(code);
      console.log("Authorization code:", code);

      // You can send this code to your server for further processing
      // For example, make a POST request to exchange it for access and refresh tokens
    } else {
      // Handle the case where no authorization code is present
      console.log("No authorization code found in the query string.");
    }
  }, [location.search]);

  const handleAuthCallback = async (code) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/auth/google/callback?code=${code}`
      );
      console.log("responded", response.data);
    } catch (err) {
      console.log("Error Found", err.message);
    }
  };

  const handleAuthentication = async () => {
    try {
      // Make a GET request to your server's /auth/google endpoint
      const response = await axios.get("http://localhost:5000/auth/google");
      console.log("responded");

      if (response.status === 200) {
        // Redirect the user to the Google authentication page
        // window.location.href = response.data.authUrl;
        const googleOAuth2URL = response.data.authUrl;

        const width = 600; // Width of the popup window
        const height = 550; // Height of the popup window
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        window.location.href = googleOAuth2URL;

        // Open the URL in a popup window
        // const popupWindow = window.open(
        //   googleOAuth2URL,
        //   "Google OAuth2 Authentication",
        //   `width=${width},height=${height},left=${left},top=${top}`
        // );
        // console.log(popupWindow);
        // // Check if the window has closed after authentication
        // const checkPopupClosed = setInterval(() => {
        //   if (popupWindow.closed) {
        //     clearInterval(checkPopupClosed);
        //     // You can perform any necessary actions here after the popup window is closed.
        //     console.log("Popup window closed.");
        //   }
        // }, 1000); // Check every 1 second (adjust as needed)
        console.log("Authentication initiated on the server.");
      } else {
        console.error("Failed to initiate authentication.");
      }
    } catch (error) {
      console.error("Error initiating authentication:", error);
    }
  };

  return (
    <div>
      <h1>OAuth2 Authentication</h1>
      <button className="btn btn-info" onClick={handleAuthentication}>
        Authenticate with Google
      </button>
    </div>
  );
}

export default Authentication;
