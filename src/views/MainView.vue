<template>
  <div class="main-view">
    <div class="button-container">
      <div class="dobrodoslica">
        <h2>Dobrodošli!</h2>
        <h3>Postavite ili pregledajte kampanje ovdje</h3>
      </div>
      <button class="new-campaign-button" @click="goToAddCampaign">
        + Nova kampanja
      </button>
    </div>
    <div class="listings-container">
      <ListingCard
        :campaignImage="require('@/assets/listing_img_test_1.jpg')"
        :campaignName="'Naziv kampanje'"
        :campaignDetails="'Opis kampanje'"
        :moneyNeeded="700"
        :daysLeft="184"
      />
      <ListingCard
        :campaignImage="require('@/assets/listing_img_test_2.jpg')"
        :campaignName="'Naziv kampanje'"
        :campaignDetails="'Opis kampanje'"
        :moneyNeeded="700"
        :daysLeft="184"
      />
      <ListingCard
        :campaignImage="require('@/assets/listing_img_test_3.jpg')"
        :campaignName="'Naziv kampanje'"
        :campaignDetails="'Opis kampanje'"
        :moneyNeeded="700"
        :daysLeft="184"
      />
    </div>
    <FooterComponent />
  </div>
</template>

<script>
import ListingCard from "@/components/ListingCard.vue";
import FooterComponent from "@/components/FooterComponent.vue";

export default {
  methods: {
    goToAddCampaign() {
      this.$router.push({ name: "AddCampaign" });
    },
  },
  components: {
    ListingCard,
    FooterComponent,
  },
};
</script>

<style>
.main-view {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-height: 100vh;
  background: #f0f8f1;
}

.button-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 20px;
}

.dobrodoslica {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.left-side-text {
  align-self: flex-start;
}

.new-campaign-button {
  padding: 10px 20px;
  background-color: #7eb584;
  color: #f0f8f1;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  align-self: flex-end;
}

.new-campaign-button:hover {
  background-color: #314f35;
}

.listings-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  flex-grow: 1;
}
</style>
