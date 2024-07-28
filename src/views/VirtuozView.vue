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
      />
      <button @click="emitUpdateAmount">Dodaj kune</button>
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
        <InProfileCard></InProfileCard>
      </div>
      <div class="ad">
        <h3>Virtuozno naprijed</h3>
        <InProfileCard :imageSrc="require('@/assets/rocket.png')">
          <p>Uspješne kampanje:</p>
        </InProfileCard>
      </div>
    </div>
  </div>
</template>

<script>
import InProfileCard from "@/components/InProfileCard.vue";
import { db } from "@/firebase"; // Adjust the import according to your file structure
import { doc, updateDoc } from "firebase/firestore"; // Firestore import

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
  methods: {
    async emitUpdateAmount() {
      // Parse the new amount as a number
      const parsedAmount = parseFloat(this.newAmount);
      if (isNaN(parsedAmount)) {
        alert("Please enter a valid number");
        return;
      }

      this.user.amount += parsedAmount;

      try {
        const userRef = doc(db, "users", this.user.id); // Adjust according to your Firestore structure
        await updateDoc(userRef, {
          amount: this.user.amount,
        });
      } catch (error) {
        console.error("Failed to update user amount:", error);
        // Optionally, revert the change or show an error message to the user
        this.user.amount -= parsedAmount; // Revert the amount update if there is an error
      }
    },
    async riseStatus() {
      alert("Status has been updated");
      this.user.userStatus = 2;

      try {
        const userRef = doc(db, "users", this.user.id); // Adjust according to your Firestore structure
        await updateDoc(userRef, {
          userStatus: this.user.userStatus,
        });
      } catch (error) {
        console.error("Failed to update user status:", error);
        // Optionally, revert the change or show an error message to the user
        this.user.userStatus = 1; // Assuming 1 is the original status
      }
    },
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

#iznos {
  color: #ff7b00;
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
</style>
