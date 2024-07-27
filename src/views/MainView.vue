<template>
  <div class="main-view">
    <Navbar />
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
        v-for="campaign in campaigns"
        :key="campaign.campaignId"
        :campaignImage="campaign.campaignImage"
        :campaignName="campaign.campaignName"
        :campaignDetails="campaign.campaignDetails"
        :moneyNeeded="campaign.moneyNeeded"
        :daysLeft="campaign.daysLeft"
        :campaignId="campaign.campaignId"
      />
    </div>
    <FooterComponent />
  </div>
</template>

<script>
import ListingCard from "@/components/ListingCard.vue";
import Navbar from "@/components/NavbarComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseApp } from "@/firebase.js";

export default {
  data() {
    return {
      campaigns: [],
    };
  },
  methods: {
    goToAddCampaign() {
      this.$router.push({ name: "AddCampaign" });
    },
    async fetchCampaigns() {
      const db = getFirestore(firebaseApp);
      const campaignsCol = collection(db, "campaigns");
      const campaignSnapshot = await getDocs(campaignsCol);
      const campaignList = campaignSnapshot.docs.map((doc) => ({
        campaignId: doc.id,
        ...doc.data(),
      }));
      this.campaigns = campaignList;
    },
  },
  components: {
    ListingCard,
    FooterComponent,
    Navbar,
  },
  mounted() {
    this.fetchCampaigns();
  },
};
</script>

<style scoped>
.main-view {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-height: 100vh;
  background: #f0f8f1;
}

.listing-card {
  transform: scale(0.9);
}

.button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 2rem 5rem;
  background-color: #f0f8f1;
  border-bottom: 1px solid #7eb584;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.dobrodoslica {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  color: #314f35;
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
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  padding: 2rem 5rem;
}

@media (max-width: 1200px) {
  .listings-container {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 992px) {
  .listings-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .listings-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .listings-container {
    grid-template-columns: 1fr;
  }
}
</style>
