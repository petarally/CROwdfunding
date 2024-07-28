<template>
  <div class="login-container">
    <div class="left-side" :style="backgroundImageStyle"></div>
    <div class="right-side">
      <form class="login-form" @submit.prevent="login">
        <h2>Prijava</h2>
        <h3>Dobrodošli natrag</h3>
        <div class="form-group">
          <label for="username">Korisničko ime</label>
          <input
            type="text"
            v-model="username"
            id="username"
            name="username"
            required
          />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            v-model="email"
            id="email"
            name="email"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Lozinka</label>
          <input
            type="password"
            v-model="password"
            id="password"
            name="password"
            required
          />
        </div>
        <button type="submit">Prijava</button>
        <GoogleSignInButton @user-signed-in="username = $event" />
      </form>
    </div>
  </div>
</template>

<script>
import firebaseApp from "@/firebase.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import GoogleSignInButton from "@/components/GoogleSignInButton.vue";

export default {
  name: "LoginView",
  components: {
    GoogleSignInButton,
  },
  data() {
    return {
      username: "",
      email: "",
      password: "",
    };
  },
  computed: {
    backgroundImageStyle() {
      return {
        backgroundImage: `url(${require("../assets/login.png")})`,
      };
    },
  },
  methods: {
    async login() {
      const auth = getAuth(firebaseApp);
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const user = userCredential.user;

        const db = getFirestore(firebaseApp);
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
          this.username = userDoc.data().username;
        }

        console.log("User logged in successfully, redirecting to MainView...");
        this.$router.push({ name: "MainView" });
      } catch (error) {
        console.error("Login error:", error.message);
      }
    },
    async googleSignIn() {
      const auth = getAuth(firebaseApp);
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const db = getFirestore(firebaseApp);
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
          this.username = userDoc.data().username;
        } else {
          const email = user.email;
          const username = email.split("@")[0];
          await setDoc(doc(db, "users", user.uid), {
            username,
            email,
            userStatus: 0,
          });
          this.username = username;
        }

        console.log("Google sign-in successful, redirecting to MainView...");
        this.$router.push({ name: "MainView" });
      } catch (error) {
        console.error("Sign-in error", error.message);
      }
    },
  },
};
</script>

<style scoped>
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }

  .left-side,
  .right-side {
    flex: none;
    width: 100%;
  }

  .left-side {
    order: -1;
    background-size: cover;
  }
}

.login-container {
  display: flex;
  height: 100vh;
}

.left-side,
.right-side {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.left-side {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.login-form {
  max-width: 300px;
  width: 100%;
  margin: 2rem 0;
}

.login-form h2,
h3 {
  display: flex;
  justify-content: start;
  font-family: "Poppins", sans-serif;
}

.login-form h2 {
  color: #ff7b00;
  font-weight: bold;
  font-size: 2rem;
}

.login-form h3 {
  color: #b4b4b4;
  font-weight: light;
  font-size: 1rem;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  display: flex;
  justify-content: start;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #7eb584;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #49704e;
}

.google-prijava {
  background-color: white;
  color: black;
  margin-top: 1rem;
  border: 2px black solid;
  display: flex;
  justify-content: center;
  align-content: center;
}

.gsi-material-button-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: white;
  margin-right: 25px;
}

.google-prijava:hover {
  background: white;
  color: #49704e;
  font-weight: bold;
  border: 2px #49704e solid;
}
</style>
