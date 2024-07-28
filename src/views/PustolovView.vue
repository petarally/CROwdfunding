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
    <div class="benefits">
      <h3>Pustolov Benefits</h3>
      <ul>
        <li>Access to exclusive content</li>
        <li>Monthly newsletter</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "PustolovView",
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

.benefits {
  margin-top: 20px;
}
</style>
