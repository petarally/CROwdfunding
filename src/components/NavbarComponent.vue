<template>
  <div class="navbar">
    <div class="title" @click="getToMain">
      <h1><span>CRO</span>WDFUNDING</h1>
    </div>
    <div class="user-info" v-if="user">
      <router-link :to="{ name: 'ProfileView', params: { userId: user.uid } }">
        <span class="username">{{ username }}</span>
      </router-link>
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseApp } from "@/firebase.js";

export default {
  name: "Navbar",
  data() {
    return {
      user: null,
      username: "",
    };
  },
  async created() {
    const auth = getAuth(firebaseApp);
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        this.user = user;
        await this.fetchUsername(user.uid);
      } else {
        this.user = null;
      }
    });
  },
  methods: {
    getToMain() {
      this.$router.push({ name: "MainView" });
    },
    async fetchUsername(uid) {
      const db = getFirestore(firebaseApp);
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        this.username = userDoc.data().username;
      }
    },
    async logout() {
      const auth = getAuth(firebaseApp);
      try {
        await signOut(auth);
        this.user = null;
        this.username = "";
        this.$router.push({ name: "HomeView" });
      } catch (error) {
        console.error("Logout error:", error);
      }
    },
  },
};
</script>

<style scoped>
.navbar {
  width: 100%;
  background: white;
  padding: 0 5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  display: flex;
  justify-content: space-around;
  margin: 1rem 0;
  cursor: pointer;
}

.title span {
  color: #ff7b00;
}

.title h1 {
  font-family: "Poppins", sans-serif;
  font-weight: bold;
  font-size: 2.5rem;
}

.user-info {
  display: flex;
  align-items: center;
}

.username {
  color: black;
  font-weight: bold;
}

.user-info span {
  margin-right: 1rem;
  font-weight: bold;
}

.user-info button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  background-color: #ff7b00;
  color: white;
  cursor: pointer;
}

.user-info button:hover {
  background-color: #cc6500;
}

@media (max-width: 768px) {
  .user-info {
    margin: 0 auto;
    padding: 1rem 0;
  }
}
</style>
