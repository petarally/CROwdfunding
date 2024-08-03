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
            @focus="showPasswordRequirements = true"
            @blur="showPasswordRequirements = false"
            required
          />
          <div
            v-if="showPasswordRequirements"
            class="password-requirements alert-message"
          >
            Lozinka mora sadržavati najmanje 8 znakova, uključujući jedno veliko
            slovo, jedno malo slovo i jedan broj.
          </div>
        </div>
        <div class="form-group">
          <label for="confirmPassword">Potvrdite lozinku</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            v-model="confirmPassword"
            required
          />
        </div>
        <div v-if="passwordError" class="error-message">
          Lozinke se ne podudaraju.
        </div>
        <button type="button" @click="signup">Izradi račun</button>
        <GoogleSignInButton @user-signed-in="username = $event" />
      </form>
      <p id="prijava">Već imate račun? <a href="login">Prijava</a></p>
    </div>
  </div>
</template>

<script>
import GoogleSignInButton from "@/components/GoogleSignInButton.vue";
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
  components: {
    GoogleSignInButton,
  },
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
      confirmPassword: "",
      username: "",
      passwordError: false,
      showPasswordRequirements: false,
    };
  },
  methods: {
    async googleSignIn() {
      const auth = getAuth(firebaseApp);
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const db = getFirestore(firebaseApp);
        const email = user.email;
        const username = email.split("@")[0];
        await setDoc(doc(db, "users", user.uid), {
          username: username,
          email: email,
        });
        console.log("User signed in with Google:", user);
        this.$router.push("/main");
      } catch (error) {
        console.error("Google sign-in error:", error);
      }
    },
    async signup() {
      if (this.password !== this.confirmPassword) {
        this.passwordError = true;
        return;
      } else {
        this.passwordError = false;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const user = userCredential.user;
        const db = getFirestore(firebaseApp);
        const username = this.email.split("@")[0];
        await setDoc(doc(db, "users", user.uid), {
          username: this.username || username,
          email: this.email,
          password: this.password,
          userStatus: 1,
          amount: 0,
        });
        console.log("User created:", userCredential.user);
        alert(
          `User "${this.username || username}" is successfully registered.`
        );
        this.$router.push({ name: "MainView" });
      } catch (error) {
        console.error("Signup error:", error.message);
      }
    },
  },
};
</script>

<style scoped>
.alert-message {
  margin-top: 5px;
  padding: 10px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 5px;
}

.error-message {
  color: red;
  margin-top: 10px;
}
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
