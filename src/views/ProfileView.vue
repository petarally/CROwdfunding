<template>
  <NavbarComponent />
  <div class="profile-content">
    <div class="profile" v-if="user">
      <div v-if="user.userStatus === 0">
        <!-- Admin View -->
        <AdminView
          :user="user"
          :newAmount="newAmount"
          @update:newAmount="newAmount = $event"
          @updateAmount="updateAmount"
        />
      </div>
      <div v-else-if="user.userStatus === 1">
        <!-- Virtuoz View -->
        <VirtuozView
          :user="user"
          :newAmount="newAmount"
          @update:newAmount="newAmount = $event"
          @updateAmount="updateAmount"
        />
      </div>
      <div v-else-if="user.userStatus === 2">
        <!-- Mecena View -->
        <MecenaView
          :user="user"
          :newAmount="newAmount"
          @update:newAmount="newAmount = $event"
          @updateAmount="updateAmount"
        />
      </div>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
  <FooterComponent />
</template>

<script>
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { firebaseApp } from "@/firebase.js";
import NavbarComponent from "@/components/NavbarComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import AdminView from "@/views/AdminView.vue";
import VirtuozView from "@/views/VirtuozView.vue";
import MecenaView from "@/views/MecenaView.vue";

export default {
  name: "ProfileView",
  components: {
    NavbarComponent,
    FooterComponent,
    AdminView,
    VirtuozView,
    MecenaView,
  },
  data() {
    return {
      user: null,
      newAmount: 0,
      statuses: {
        0: {
          label: "Admin",
          benefits: ["Manage users", "Access to all data", "Priority support"],
        },
        1: {
          label: "Virtuoz",
          benefits: [
            "All benefits of Pustolov",
            "Early access to new features",
          ],
        },
        2: {
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
        this.user = { id: userDoc.id, ...userDoc.data() };
      } else {
        console.error("User not found");
      }
    },
    async updateAmount() {
      if (!this.user) return;

      const db = getFirestore(firebaseApp);
      const userRef = doc(db, "users", this.user.id);

      try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const currentAmount = userDoc.data().amount || 0;
          const updatedAmount = currentAmount + this.newAmount;

          await updateDoc(userRef, {
            amount: updatedAmount,
          });

          this.user.amount = updatedAmount;
          this.newAmount = 0;
          console.log("Amount updated successfully");
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error("Error updating amount: ", error);
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
  width: 100%;
}

.update-amount {
  margin-top: 20px;
}

.update-amount input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
}

.update-amount button {
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #7eb584;
  color: white;
  cursor: pointer;
}

.update-amount button:hover {
  background-color: #49704e;
}
</style>
