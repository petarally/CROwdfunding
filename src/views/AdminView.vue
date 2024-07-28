<template>
  <div>
    <h2>Admin Dashboard</h2>
    <div class="admin-actions">
      <button @click="manageUsers">Manage Users</button>
      <button @click="accessData">Access All Data</button>
      <button @click="prioritySupport">Priority Support</button>
    </div>
    <div class="update-amount">
      <input
        :value="newAmount"
        @input="$emit('update:newAmount', $event.target.value)"
        type="number"
        placeholder="Enter new amount"
      />
      <button @click="emitUpdateAmount">Update Amount</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminView",
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
    manageUsers() {
      // Logic to manage users
      console.log("Managing users...");
    },
    accessData() {
      // Logic to access all data
      console.log("Accessing all data...");
    },
    prioritySupport() {
      // Logic to provide priority support
      console.log("Providing priority support...");
    },
  },
};
</script>

<style scoped>
.admin-actions {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
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
