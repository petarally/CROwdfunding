<template>
  <div>
    <div class="stanje">
      <p>Trenutno stanje</p>
      <p id="iznos">{{ user.amount }} KN</p>
    </div>
    <div class="update-amount">
      <input
        :value="newAmount"
        @input="$emit('update:newAmount', parseFloat($event.target.value))"
        type="number"
        placeholder="Enter new amount"
        class="amount-input"
      />
      <button @click="emitUpdateAmount" class="add-amount-button">
        Dodaj kune
      </button>
    </div>
    <div class="cards">
      <div class="upgrade-status">
        <h3>Postanite mecena status</h3>
        <InProfileCard :imageSrc="require('@/assets/rich.png')">
          <button class="statusBtn" @click="riseStatus">Povisi status</button>
        </InProfileCard>
      </div>
      <div class="campaign-status">
        <h3>Trenutni status kampanja</h3>
        <InProfileCard>
          <p>Successful campaigns: {{ successfulCampaigns }}</p>
        </InProfileCard>
      </div>
      <div class="ad">
        <h3>Virtuozno naprijed</h3>
        <InProfileCard :imageSrc="require('@/assets/rocket.png')">
          <p>
            Uspješne kampanje:
            <span id="uspjesne-kampanje">{{ successfulCampaigns }}</span>
          </p>
        </InProfileCard>
      </div>
    </div>
  </div>
</template>

<script>
import InProfileCard from "@/components/InProfileCard.vue";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firebaseApp } from "@/firebase";

export default {
  name: "VirtuozView",
  components: {
    InProfileCard,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
    newAmount: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      successfulCampaigns: 0,
    };
  },
  methods: {
    async fetchSuccessfulCampaigns() {
      try {
        const db = getFirestore(firebaseApp);
        const campaignsCol = collection(db, "campaigns");
        const q = query(
          campaignsCol,
          where("userUID", "==", this.user.id),
          where("campaignCompleted", "==", true)
        );
        const campaignSnapshot = await getDocs(q);

        console.log("Campaign Snapshot:", campaignSnapshot);
        console.log("Number of successful campaigns:", campaignSnapshot.size);

        this.successfulCampaigns = campaignSnapshot.size;
      } catch (error) {
        console.error("Failed to fetch successful campaigns:", error);
      }
    },
    async emitUpdateAmount() {
      const parsedAmount = parseFloat(this.newAmount);
      if (isNaN(parsedAmount)) {
        alert("Please enter a valid number");
        return;
      }

      this.user.amount += parsedAmount;

      try {
        const userRef = doc(getFirestore(firebaseApp), "users", this.user.id);
        await updateDoc(userRef, {
          amount: this.user.amount,
        });
      } catch (error) {
        console.error("Failed to update user amount:", error);
        this.user.amount -= parsedAmount;
      }
    },
    async riseStatus() {
      alert("Status has been updated");
      this.user.userStatus = 2;

      try {
        const userRef = doc(getFirestore(firebaseApp), "users", this.user.id);
        await updateDoc(userRef, {
          userStatus: this.user.userStatus,
        });
      } catch (error) {
        console.error("Failed to update user status:", error);
        this.user.userStatus = 1;
      }
    },
  },
  async mounted() {
    await this.fetchSuccessfulCampaigns();
  },
};
</script>

<style scoped>
.stanje {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 1rem 5rem;
}

.stanje p {
  font-weight: bold;
}

#iznos,
#uspjesne-kampanje {
  color: #ff7b00;
  font-weight: bold;
}

.cards {
  display: flex;
  justify-content: center;
  padding: 1rem 5rem;
}

.statusBtn {
  background-color: #ff7b00;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}

.update-amount {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 5rem;
  margin-bottom: 1rem;
}

.amount-input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 1rem;
  width: 200px;
  font-size: 1rem;
}

.add-amount-button {
  background-color: #ff7b00;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.add-amount-button:hover {
  background-color: #e66a00;
}
</style>
