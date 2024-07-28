<template>
  <div class="profile-card">
    <img :src="imageSrc" alt="Profile Image" class="profile-image" />
    <hr />
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "InProfileCard",
  props: {
    imageSrc: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.profile-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  width: 300px;
  margin: 0 auto;
}

.profile-image {
  width: 100%;
  height: auto;
}
</style>
