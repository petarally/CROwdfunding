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
    <div v-if="hasCampaigns" class="search-container">
      <form @submit.prevent="submitSearch" class="search-form">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Pretraži kampanje"
          class="search-bar"
        />
      </form>
    </div>
    <div class="listings-container">
      <ListingCard
        v-for="campaign in filteredCampaigns"
        :key="campaign.campaignId"
        :campaignImage="campaign.campaignImage"
        :campaignName="campaign.campaignName"
        :campaignDetails="campaign.campaignDetails"
        :moneyNeeded="campaign.moneyNeeded"
        :daysLeft="campaign.daysLeft"
        :campaignId="campaign.campaignId"
        :startDate="campaign.startDate"
        :endDate="campaign.endDate"
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
      searchQuery: "",
      searchFilter: "",
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
    submitSearch() {
      this.searchFilter = this.searchQuery;
    },
  },
  computed: {
    filteredCampaigns() {
      const query = this.searchFilter.toLowerCase();
      return this.campaigns.filter(
        (campaign) =>
          campaign.campaignName.toLowerCase().includes(query) ||
          campaign.campaignDetails.toLowerCase().includes(query)
      );
    },
    hasCampaigns() {
      return this.campaigns.length > 0;
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

  background: #f0f8f1;
}

.listing-card {
  transform: scale(0.9);
}

.search-bar {
  padding: 10px;
  border: 1px solid #7eb584;
  border-radius: 5px;
  width: 300px;
  margin-right: 20px;
}

.search-container {
  display: flex;
  justify-content: center;
  padding: 1rem 5rem;
  background: #7eb584;
  width: 100%;
}

.search-form {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 1rem 5rem;
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
  min-height: 80vh;
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
  .button-container {
    flex-direction: column;
    align-items: center;
  }
  .dobrodoslica {
    align-items: center;
  }
  .dobrodoslica h2 {
    font-size: 1.5rem;
  }
  .dobrodoslica h3 {
    font-size: 1rem;
  }
  .new-campaign-button {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
    padding: 0.5rem 5rem;
  }
  .listings-container {
    grid-template-columns: 1fr;
  }
}
</style>
