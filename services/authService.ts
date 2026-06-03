import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";

const TOKEN_KEY = "auth_token";

const saveToken = async (token: string) => {
  if (Platform.OS === "web") {
    localStorage.setItem(TOKEN_KEY, token);
    return;
  }

  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const getToken = async () => {
  if (Platform.OS === "web") {
    return localStorage.getItem(TOKEN_KEY);
  }

  return await SecureStore.getItemAsync(TOKEN_KEY);
};

const deleteToken = async () => {
  if (Platform.OS === "web") {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(TOKEN_KEY);
};

export const loginWithFirebase = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const token = await userCredential.user.getIdToken();

  await saveToken(token);

  return {
    user: userCredential.user,
    token,
  };
};

export const logoutFirebase = async () => {
  await signOut(auth);
  await deleteToken();
};