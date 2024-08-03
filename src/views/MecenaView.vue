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
      <div class="exclusive-benefit">
        <h3>Exclusive Mecena Benefit</h3>
        <InProfileCard :imageSrc="require('@/assets/rich.png')">
          <p>Access to exclusive events and content.</p>
        </InProfileCard>
      </div>
      <div class="support">
        <h3>Direct Support Contact</h3>
        <InProfileCard>
          <p>Contact our support team directly for priority assistance.</p>
        </InProfileCard>
      </div>
      <div class="recognition">
        <h3>Special Recognition</h3>
        <InProfileCard :imageSrc="require('@/assets/rocket.png')">
          <p>Receive special recognition for your support.</p>
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
  name: "MecenaView",
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
  margin: 0;
}

#iznos {
  color: #ff7b00;
  font-size: 1.5rem;
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

.cards {
  display: flex;
  justify-content: space-around;
  padding: 1rem 5rem;
}

.cards > div {
  flex: 1;
  margin: 0 1rem;
}

.cards h3 {
  margin-bottom: 1rem;
}

.statusBtn {
  background-color: #ff7b00;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}

.statusBtn:hover {
  background-color: #e66a00;
}

@media (max-width: 992px) {
  .cards {
    flex-direction: column;
    align-items: center;
  }

  .cards > div {
    margin-bottom: 1rem;
  }
}
</style>
