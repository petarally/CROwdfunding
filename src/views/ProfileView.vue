<template>
  <NavbarComponent />
  <div class="profile-content">
    <div class="profile">
      <h2>User Profile</h2>
      <div v-if="user">
        <p><strong>Username:</strong> {{ user.username }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Status:</strong> {{ userStatusLabel }}</p>
        <ul>
          <li v-for="(benefit, index) in userBenefits" :key="index">
            {{ benefit }}
          </li>
        </ul>
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
  </div>
  <FooterComponent />
</template>

<script>
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseApp } from "@/firebase.js";
import NavbarComponent from "@/components/NavbarComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";

export default {
  name: "ProfileView",
  components: {
    NavbarComponent,
    FooterComponent,
  },
  data() {
    return {
      user: null,
      statuses: {
        0: {
          label: "Admin",
          benefits: ["Manage users", "Access to all data", "Priority support"],
        },
        1: {
          label: "Pustolov",
          benefits: ["Access to exclusive content", "Monthly newsletter"],
        },
        2: {
          label: "Virtuoz",
          benefits: [
            "All benefits of Pustolov",
            "Early access to new features",
          ],
        },
        3: {
          label: "Mecena",
          benefits: [
            "All benefits of Virtuoz",
            "Direct support contact",
            "Special recognition",
          ],
        },
      },
    };
  },
  computed: {
    userStatusLabel() {
      return this.user ? this.statuses[this.user.userStatus].label : "";
    },
    userBenefits() {
      return this.user ? this.statuses[this.user.userStatus].benefits : [];
    },
  },
  async created() {
    const userId = this.$route.params.userId;
    await this.fetchUser(userId);
  },
  methods: {
    async fetchUser(userId) {
      const db = getFirestore(firebaseApp);
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        this.user = userDoc.data();
      } else {
        console.error("User not found");
      }
    },
  },
};
</script>

<style scoped>
.profile-content {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background: #f0f8f1;
}

.profile {
  text-align: center;
  width: 100%; /* Ensure profile takes full width */
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 0.5rem 0;
}
</style>
