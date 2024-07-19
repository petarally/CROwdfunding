<template>
  <div class="add-campaign-container">
    <div class="content">
      <div class="right-side">
        <p>Right side content goes here</p>
      </div>
      <div class="left-side">
        <AddCampaignComponent />
      </div>
    </div>
    <FooterComponent />
  </div>
</template>

<script>
import AddCampaignComponent from "@/components/AddCampaignComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";

export default {
  components: {
    AddCampaignComponent,
    FooterComponent,
  },
};
</script>

<style>
.add-campaign-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f0f8f1;
}

.content {
  flex: 1;
  display: flex;
}

.left-side,
.right-side {
  flex: 1;
}

@media (max-width: 768px) {
  .content {
    flex-direction: column;
  }
  .left-side {
    order: -1;
  }
}
</style>
