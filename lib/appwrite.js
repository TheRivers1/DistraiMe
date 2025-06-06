import { Client, Account, Avatars } from "react-native-appwrite";

export const client = new Client()
  .setProject("6841d512000f7e8ce2b2")
  .setPlatform("dev.mdtr.distraime");

export const account = new Account(client);
export const avatars = new Avatars(client);