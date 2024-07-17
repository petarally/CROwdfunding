<template>
  <div class="footer">
    <h4>Crowdfunding {{ currentYear }}</h4>
  </div>
</template>

<script>
export default {
  name: "FooterComponent",
  data() {
    return {
      currentYear: new Date().getFullYear(),
    };
  },
};
</script>

<style scoped lang="scss">
.footer {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #7eb584;
  color: white;
}
</style>
