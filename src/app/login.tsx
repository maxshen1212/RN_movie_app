import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Account, Client, ID, Models } from "react-native-appwrite";
import { SafeAreaView } from "react-native-safe-area-context";

let client: Client;
let account: Account;

client = new Client();
client
  .setEndpoint("https://NYC.cloud.appwrite.io/v1")
  .setProject("689c23ef00380046ebad") // Your Project ID
  .setPlatform("com.RN.rn_movie_app"); // Your package name / bundle identifier
account = new Account(client);

export default function Login() {
  const [loggedInUser, setLoggedInUser] =
    useState<Models.User<Models.Preferences> | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  async function login(email: string, password: string) {
    try {
      await account.createEmailPasswordSession(email, password);
      setLoggedInUser(await account.get());
      console.log("login successful");
    } catch (error) {
      console.error(error);
    }
  }

  async function register(email: string, password: string, name: string) {
    try {
      await account.create(ID.unique(), email, password, name);
      await login(email, password);
      setLoggedInUser(await account.get());
      console.log("register successful");
    } catch (error) {
      console.error(error);
    }
  }
  async function logout() {
    try {
      await account.deleteSession("current");
      setLoggedInUser(null);
      console.log("logout successful");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <SafeAreaView>
      <View style={styles.root}>
        <Text>
          {loggedInUser ? `Logged in as ${loggedInUser.name}` : "Not logged in"}
        </Text>
        <View>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={(text) => setName(text)}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => login(email, password)}
          >
            <Text>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => register(email, password, name)}
          >
            <Text>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => logout()}>
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    marginTop: 40,
    marginBottom: 40,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "gray",
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
});
