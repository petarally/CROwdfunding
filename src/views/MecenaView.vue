<template>
  <div>
    <div class="stanje">
      <p>Trenutno stanje</p>
      <p id="iznos">{{ user.amount }} KN</p>
    </div>
    <div class="update-amount">
      <input
        :value="newAmount"
        @input="$emit('update:newAmount', $event.target.value)"
        type="number"
        placeholder="Enter new amount"
      />
      <button @click="emitUpdateAmount">Dodaj kune</button>
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
    emitUpdateAmount() {
      this.$emit("updateAmount");
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
</style>
