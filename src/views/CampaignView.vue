<template>
  <div>
    <NavbarComponent />
    <div class="campaign-container">
      <div class="campaign-info">
        <div class="raised-amount">
          <h3>Prikupljeno: {{ totalRaisedAmount }} KN</h3>
        </div>
        <h2 v-if="campaign">{{ campaign.campaignName }}</h2>
        <p v-if="campaign">{{ campaign.campaignDetails }}</p>
        <div class="donation-section">
          <h3>Sviđa Vam se ideja?</h3>
          <div class="donation-form">
            <input type="number" v-model="donationAmount" min="0" />
            <button
              @click="handleDonation"
              :disabled="!donationAmount || donationAmount <= 0"
            >
              Donate
            </button>
          </div>
        </div>
        <div class="task-list" v-if="campaign && user">
          <TaskList
            :zadaciCijene="campaign.zadaciCijene"
            :userStatus="user.userStatus"
            @apply-to-task="handleApplyToTask"
          />
        </div>
        <p v-else>Učitavanje...</p>
      </div>
      <div class="campaign-image">
        <div class="image-container">
          <img
            v-if="campaign"
            :src="campaign.campaignImage"
            alt="Campaign Image"
          />
          <div class="overlay"></div>
        </div>
      </div>
    </div>
    <FooterComponent />
  </div>
</template>

<script>
import TaskList from "@/components/TaskListComponent.vue";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseApp } from "@/firebase.js";
import FooterComponent from "@/components/FooterComponent.vue";
import NavbarComponent from "@/components/NavbarComponent.vue";

export default {
  name: "CampaignView",
  components: {
    TaskList,
    FooterComponent,
    NavbarComponent,
  },
  data() {
    return {
      campaign: null,
      user: null,
      starterMoney: 0,
      raised: 0,
      successfulCampaigns: 0,
      donationAmount: 0,
    };
  },
  computed: {
    totalRaisedAmount() {
      return Number(this.starterMoney) + Number(this.raised);
    },
  },
  async created() {
    try {
      const id = this.$route.params.id;
      if (!id) {
        console.error("Campaign ID is missing from route parameters.");
        return;
      }

      const db = getFirestore(firebaseApp);
      const campaignDoc = doc(db, "campaigns", id);
      const docSnapshot = await getDoc(campaignDoc);

      if (docSnapshot.exists()) {
        const campaignData = docSnapshot.data();
        this.campaign = campaignData;
        this.starterMoney = Number(campaignData.starterMoney || 0);
        this.raised = Number(campaignData.raised || 0);

        // Update successfulCampaigns based on the criteria
        this.checkCampaignSuccess();
      } else {
        console.error("No such campaign document!");
      }

      const auth = getAuth(firebaseApp);
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userDoc = doc(db, "users", user.uid);
          const userSnapshot = await getDoc(userDoc);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            this.user = userData;
            this.user.uid = user.uid; // Ensure the user UID is set
            this.user.amount = Number(userData.amount || 0); // Convert to number
            this.user.appliedTasks = userData.appliedTasks || [];
          } else {
            console.error("No such user document!");
          }
        } else {
          console.error("User is not authenticated.");
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  methods: {
    async handleApplyToTask({ taskId, taskPrice }) {
      if (!this.user || !this.campaign) {
        console.error("User or campaign data is not loaded.");
        return;
      }

      const userBalance = Number(this.user.amount); // Ensure user balance is a number
      const taskCost = Number(taskPrice); // Ensure task cost is a number

      if (userBalance < taskCost) {
        alert("Insufficient balance.");
        return;
      }

      try {
        const db = getFirestore(firebaseApp);
        const userUID = this.user.uid; // Use correct user UID
        const campaignId = this.$route.params.id;

        if (!userUID || !campaignId) {
          throw new Error("User ID or Campaign ID is missing.");
        }

        const userDoc = doc(db, "users", userUID);
        const campaignDoc = doc(db, "campaigns", campaignId);

        // Update user's balance
        await updateDoc(userDoc, {
          amount: userBalance - taskCost,
        });

        // Mark the task as completed
        const updatedTasks = this.campaign.zadaciCijene.map((task) =>
          task.id === taskId ? { ...task, completed: true } : task
        );

        await updateDoc(campaignDoc, {
          raised: this.raised + taskCost,
          zadaciCijene: updatedTasks,
        });

        // Update user's applied tasks
        const updatedAppliedTasks = this.user.appliedTasks
          ? [...this.user.appliedTasks, taskId]
          : [taskId];
        await updateDoc(userDoc, {
          appliedTasks: updatedAppliedTasks,
        });

        // Update local state
        this.user.amount -= taskCost;
        this.raised += taskCost;
        this.user.appliedTasks = updatedAppliedTasks;
        this.campaign.zadaciCijene = updatedTasks;

        // Recheck campaign success status
        this.checkCampaignSuccess();

        alert("Task applied successfully!");
      } catch (error) {
        console.error("Error applying to task:", error);
      }
    },
    async handleDonation() {
      if (!this.user || !this.campaign) {
        console.error("User or campaign data is not loaded.");
        return;
      }

      const donation = Number(this.donationAmount); // Convert to number
      if (donation <= 0) {
        alert("Please enter a valid donation amount.");
        return;
      }

      try {
        const db = getFirestore(firebaseApp);
        const userUID = this.user.uid; // Use correct user UID
        const campaignId = this.$route.params.id;

        if (!userUID || !campaignId) {
          throw new Error("User ID or Campaign ID is missing.");
        }

        const userDoc = doc(db, "users", userUID);
        const campaignDoc = doc(db, "campaigns", campaignId);

        // Update user's balance
        await updateDoc(userDoc, {
          amount: this.user.amount - donation,
        });

        // Update campaign's raised amount
        await updateDoc(campaignDoc, {
          raised: this.raised + donation,
        });

        // Update local state
        this.user.amount -= donation;
        this.raised += donation;

        // Recheck campaign success status
        this.checkCampaignSuccess();

        alert("Donation made successfully!");
        this.donationAmount = 0; // Clear the input field
      } catch (error) {
        console.error("Error making donation:", error);
      }
    },
    async checkCampaignSuccess() {
      // Check if all tasks are completed
      const allTasksCompleted = this.campaign.zadaciCijene.every(
        (task) => task.completed
      );

      // Check if raised amount meets or exceeds money needed
      const moneyRequirementsMet = this.raised >= this.campaign.moneyNeeded;

      // Update campaign's completion status based on the criteria
      if (allTasksCompleted && moneyRequirementsMet) {
        const db = getFirestore(firebaseApp);
        const campaignDoc = doc(db, "campaigns", this.$route.params.id);

        await updateDoc(campaignDoc, {
          campaignCompleted: true,
        });

        // Update local state
        this.campaign.campaignCompleted = true;
      }
    },
  },
};
</script>

<style scoped>
.campaign-container {
  display: flex;
  flex-direction: row;
  height: 100vh;
  background: #f0f8f1;
}

.campaign-info {
  flex: 3;
  padding: 5rem;
  overflow-y: auto;
}

.raised-amount {
  margin-bottom: 1rem;
}

.raised-amount h3 {
  color: #ff7b00;
  font-family: "Poppins", sans-serif;
  font-weight: bold;
  font-size: 1.5rem;
}

.campaign-info h2,
p {
  display: flex;
  justify-self: start;
}

.campaign-info h2 {
  color: #ff7b00;
  font-family: "Poppins", sans-serif;
  font-weight: bold;
  font-size: 2rem;
}

.campaign-info p {
  color: #b4b4b4;
  font-family: "Poppins", sans-serif;
  font-weight: bold;
  font-size: 1rem;
}

.campaign-image {
  flex: 1;
  height: 100vh;
  position: relative;
}

.image-container {
  position: relative;
  height: 100%;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}

.donation-section {
  margin: 2rem 0;
}

.donation-section h3 {
  color: #ff7b00;
  font-family: "Poppins", sans-serif;
  font-weight: bold;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: start;
}

.donation-form {
  display: flex;
  align-items: center;
}

.donation-form input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  margin-right: 0.5rem;
  font-size: 1rem;
  width: 200px;
}

.donation-form button {
  padding: 0.5rem 1rem;
  background: #ff7b00;
  color: #fff;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
}

.donation-form button:disabled {
  background: #ddd;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .campaign-container {
    flex-direction: column;
    height: auto;
  }

  .campaign-info {
    padding: 2rem;
  }

  .raised-amount h3 {
    font-size: 1.25rem;
  }

  .campaign-info h2 {
    font-size: 1.5rem;
  }

  .campaign-info p {
    font-size: 0.875rem;
  }

  .donation-section h3 {
    font-size: 1rem;
  }

  .donation-form input {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .donation-form {
    flex-direction: column;
    align-items: stretch;
  }

  .campaign-image {
    height: auto;
  }

  .image-container {
    height: 300px;
  }

  .image-container img {
    height: 100%;
  }
}
</style>
