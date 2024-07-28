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
      <div class="upgrade-status">
        <h3>Postanite mecena status</h3>
        <InProfileCard :imageSrc="require('@/assets/rich.png')">
          <button>Povisi status</button>
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
