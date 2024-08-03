<template>
  <div class="task-list">
    <h3>Popis zadataka i nagrada</h3>
    <ul>
      <li
        v-for="zadatak in zadaciCijene"
        :key="zadatak.id"
        :class="{
          'task-completed': zadatak.completed && userStatus !== 2,
          'task-status-2': userStatus === 2,
        }"
      >
        <div class="tasks-details">
          <span class="task-name">{{ zadatak.zadatak }}</span>
          <span class="task-price">
            <strong>Cijena zadataka: </strong> {{ zadatak.cijena }} kn
          </span>
        </div>
        <button
          v-if="userStatus !== 2"
          @click="applyToTask(zadatak.id, zadatak.cijena)"
          class="prijavaBtn"
          :disabled="zadatak.completed"
        >
          Prijava
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "TaskList",
  props: {
    zadaciCijene: {
      type: Array,
      required: true,
    },
    userStatus: {
      type: Number,
      required: true,
    },
  },
  methods: {
    applyToTask(taskId, taskPrice) {
      this.$emit("apply-to-task", { taskId, taskPrice });
    },
  },
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border: #7eb584 2px solid;
  margin-bottom: 1rem;
  transition: filter 0.3s ease;
}

.task-completed {
  filter: blur(2px);
  background-color: #e0e0e0; /* Light gray background for completed tasks */
}

.task-status-2 {
  background-color: #d0d0d0; /* Different background color for status 2 tasks */
}

.tasks-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.task-name {
  font-weight: normal;
}

.task-price {
  font-weight: bold;
  color: #0f0f0f;
}

.task-list h3 {
  display: flex;
  justify-self: start;
  color: #0f0f0f;
  font-family: "Poppins", sans-serif;
  font-weight: bold;
  font-size: 1rem;
  padding: 1rem 0;
}

.prijavaBtn {
  background-color: #7eb584;
  color: white;
  border: none;
  padding: 0.5rem 2rem;
  cursor: pointer;
  font-size: 1rem;
  font-family: "Poppins", sans-serif;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.prijavaBtn:disabled {
  background-color: #bcbcbc; /* Gray background for disabled button */
  cursor: not-allowed;
}
</style>
