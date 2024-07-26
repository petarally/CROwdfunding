<template>
  <div class="signup-container">
    <div class="left-side" :style="backgroundImageStyle"></div>
    <div class="right-side">
      <form class="signup-form" @submit.prevent="signup">
        <h2>Novi račun</h2>
        <h3>Započnite svoju priču s nama</h3>
        <div class="form-group">
          <label for="username">Korisničko ime</label>
          <input
            type="text"
            id="username"
            name="username"
            v-model="username"
            required
          />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            v-model="email"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Lozinka</label>
          <input
            type="password"
            id="password"
            name="password"
            v-model="password"
            required
          />
        </div>
        <button type="button" @click="signup">Izradi račun</button>
        <button @click="googleSignIn" class="google-prijava">
          <div class="gsi-material-button-icon">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              style="display: block"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              ></path>
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              ></path>
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              ></path>
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              ></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
          </div>
          Google Prijava
        </button>
      </form>
      <p id="prijava">Već imate račun? <a href="login">Prijava</a></p>
    </div>
  </div>
</template>

<script>
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { firebaseApp, auth } from "@/firebase.js";
import { getFirestore, doc, setDoc } from "firebase/firestore";

export default {
  name: "SignUpView",
  computed: {
    backgroundImageStyle() {
      return {
        backgroundImage: `url(${require("../assets/login.png")})`,
      };
    },
  },
  data() {
    return {
      email: "",
      password: "",
      username: "",
    };
  },
  methods: {
    async googleSignIn() {
      const auth = getAuth(firebaseApp);
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        this.$router.push("/main");
      } catch (error) {
        console.error("Google sign-in error:", error);
      }
    },
    async signup() {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const user = userCredential.user;
        const db = getFirestore(firebaseApp);

        await setDoc(doc(db, "users", user.uid), {
          username: this.username,
          email: this.email,
          password: this.password,
        });
        console.log("User created:", userCredential.user);
        alert(`User "${this.username}" is successfully registered.`);
        this.$router.push({ name: "MainView" });
      } catch (error) {
        console.error("Signup error:", error.message);
      }
    },
  },
};
</script>

<style scoped>
@media (max-width: 768px) {
  .signup-container {
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

.signup-container {
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

#prijava {
  margin-top: 1rem;
  font-size: 1rem;
  color: #b4b4b4;
}

#prijava a {
  color: black;
  text-decoration: none;
  font-weight: bold;
}

.right-side {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.signup-form {
  max-width: 300px;
  width: 100%;
  margin: 2rem 0;
}

.signup-form h2,
h3 {
  display: flex;
  justify-content: start;
  font-family: "Poppins", sans-serif;
}

.signup-form h2 {
  color: #ff7b00;
  font-weight: bold;
  font-size: 2rem;
}

.signup-form h3 {
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
