<template>
  <div class="profile-card">
    <div class="profile-content">
      <img
        v-if="imageSrc"
        :src="imageSrc"
        alt="Profile Image"
        class="profile-image"
      />
      <hr v-if="imageSrc" class="visible-hr" />
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "InProfileCard",
  props: {
    imageSrc: {
      type: String,
      required: false,
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
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.profile-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.profile-image {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: contain;
}

hr.visible-hr {
  margin: 16px 0;
  width: 100%;
}
</style>
