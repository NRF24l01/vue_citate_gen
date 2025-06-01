import { jwtDecode } from "jwt-decode";

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
  return noTokenIfExpired(localStorage.getItem("access_token")) !== null;
}