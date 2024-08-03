<template>
  <div class="task-list">
    <h3>Popis zadataka i nagrada</h3>
    <ul>
      <li v-for="zadatak in zadaciCijene" :key="zadatak.id">
        <div class="tasks-details">
          <span class="task-name">{{ zadatak.zadatak }}</span>
          <span class="task-price">
            <strong>Cijena zadataka: </strong> {{ zadatak.cijena }} kn
          </span>
        </div>
        <button
          @click="applyToTask(zadatak.id, zadatak.cijena)"
          class="prijavaBtn"
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
  font-family: "Popins", sans-serif;
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
  font-family: "Popins", sans-serif;
  font-weight: bold;
}
</style>
