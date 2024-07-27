<template>
  <div class="task-list">
    <h3>Popis zadataka i nagrada za kampanju</h3>
    <ul>
      <li v-for="zadatak in zadaciCijene" :key="zadatak.id">
        <span class="task-name">{{ zadatak.zadatak }}</span>
        <span class="task-price">{{ zadatak.cijena }} kn</span>
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
};
</script>

<style scoped>
.task-list {
  padding: 1rem;
  background: #f0f8f1;
  border: 1px solid #d7d7d7;
  border-radius: 4px;
  margin-top: 1rem;
}

.task-list h3 {
  color: #ff7b00;
  font-weight: bold;
  padding-bottom: 1rem;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #d7d7d7;
}

.task-name {
  font-weight: normal;
}

.task-price {
  font-weight: bold;
  color: #7eb584;
}
</style>
