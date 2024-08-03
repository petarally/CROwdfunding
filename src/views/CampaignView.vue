<template>
  <div>
    <NavbarComponent />
    <div class="campaign-container">
      <div class="campaign-info">
        <div class="raised-amount">
          <h3>Total Raised: {{ totalRaisedAmount }} kn</h3>
        </div>
        <h2 v-if="campaign">{{ campaign.campaignName }}</h2>
        <p v-if="campaign">{{ campaign.campaignDetails }}</p>
        <div class="task-list" v-if="campaign">
          <TaskList
            :zadaciCijene="campaign.zadaciCijene"
            @apply-to-task="handleApplyToTask"
          />
        </div>
        <p v-else>Loading campaign data...</p>
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

        console.log("User Document Reference:", userDoc);
        console.log("Campaign Document Reference:", campaignDoc);

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

        alert("Task applied successfully!");
      } catch (error) {
        console.error("Error applying to task:", error);
      }
    },
  },
};
</script>

<style scoped>
.campaign-container {
  display: flex;
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
  font-family: "Popins", sans-serif;
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
  font-family: "Popins", sans-serif;
  font-weight: bold;
  font-size: 2rem;
}

.campaign-info p {
  color: #b4b4b4;
  font-family: "Popins", sans-serif;
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

.campaign-image img {
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
  background-color: rgba(128, 128, 128, 0.3);
  pointer-events: none;
}

.task-list {
  padding-top: 0.5rem;
}
</style>
