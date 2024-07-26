<template>
  <div class="navbar">
    <div class="title">
      <h1><span>CRO</span>WDFUNDING</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "Navbar",
};
</script>

<style scoped>
.navbar {
  width: 100%;
  background: white;
  padding: 0 5rem;
}

.title {
  display: flex;
  justify-content: space-around;
  margin: 1rem 0;
}

.title span {
  color: #ff7b00;
}

.title h1 {
  font-family: "Popins", sans-serif;
  font-weight: bold;
  font-size: 2.5rem;
}
</style>
