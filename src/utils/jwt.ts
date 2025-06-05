import { jwtDecode } from "jwt-decode";
import axios from "axios";

export interface DecodedJwt {
  access?: string;
  exp?: number;
  [key: string]: any;
}

export function decodeJwt(token: string): DecodedJwt | null {
  try {
    return jwtDecode<DecodedJwt>(token);
  } catch (error) {
    console.error("Invalid JWT", error);
    return null;
  }
}

export function getCustomClaims(token: string | null): DecodedJwt | null {
  if (!token) {
    return null;
  }
  return decodeJwt(token);
}

export function isTokenExpired(token: string): boolean {
  const decodedToken = decodeJwt(token);
  if (!decodedToken || !decodedToken.exp) {
    return true;
  }
  
  // exp is in seconds, Date.now() is in milliseconds
  return Date.now() >= decodedToken.exp * 1000;
}

export function noTokenIfExpired(token: string | null): string | null {
  if (!token) {
    return null;
  }
  if (isTokenExpired(token)) {
    localStorage.removeItem("access_token");
    token = null;
  }
  return token;
}

export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}

export function isModerator(): boolean {
  const token = getAccessToken();
  if (!token) {
    return false;
  }
  const decodedToken = decodeJwt(token);
  if (!decodedToken || !decodedToken.role) {
    return false;
  }
  return decodedToken.role === "moderator";
}

export function requestAccessToken(): string | null {
  try {
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh`, {}, {
      withCredentials: true
    }).then(response => {
      if (response.data && response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        return response.data.access_token;
      }
      return null;
    }).catch(error => {
      console.error("Failed to refresh token:", error);
      localStorage.removeItem("access_token");
      return null;
    });
  } catch (error) {
    console.error("Error requesting access token:", error);
    return null;
  }
  return localStorage.getItem("access_token");
}

export function getAccessToken(): string | null {
  var token = localStorage.getItem("access_token");
  token = noTokenIfExpired(token);
  if (token === null) {
    localStorage.removeItem("access_token");
    token = requestAccessToken();
    if (token === null) {
      return null;
    }
  }
  return token;
}