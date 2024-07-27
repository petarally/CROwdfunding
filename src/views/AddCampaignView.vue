<template>
  <div class="add-campaign-container">
    <Navbar />
    <div class="content">
      <div class="left-side">
        <h2 class="title-h2">Vaše kampanje</h2>
        <hr />
        <div class="listings-container">
          <ListingCard
            v-for="campaign in campaigns"
            :key="campaign.id"
            :campaignImage="campaign.campaignImage"
            :campaignName="campaign.campaignName"
            :campaignDetails="campaign.campaignDetails"
            :moneyNeeded="campaign.moneyNeeded"
            :daysLeft="campaign.daysLeft"
            class="listing-card"
          />
          <div v-if="campaigns.length === 0">No campaigns found.</div>
        </div>
      </div>
      <div class="right-side">
        <AddCampaignComponent />
      </div>
    </div>
    <FooterComponent />
  </div>
</template>

<script>
import AddCampaignComponent from "@/components/AddCampaignComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import { db, auth } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import ListingCard from "@/components/ListingCard.vue";
import Navbar from "@/components/NavbarComponent.vue";

export default {
  components: {
    AddCampaignComponent,
    FooterComponent,
    ListingCard,
    Navbar,
  },
  data() {
    return {
      campaigns: [],
      currentUserId: null,
    };
  },
  methods: {
    async fetchCampaigns() {
      if (!this.currentUserId) {
        console.error("currentUserId is undefined");
        return;
      }
      try {
        const campaignsCollection = collection(db, "campaigns");
        const q = query(
          campaignsCollection,
          where("userUID", "==", this.currentUserId)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.warn("No matching documents.");
        } else {
          console.log("Found campaigns:", querySnapshot.docs);
        }

        this.campaigns = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Mapped campaigns:", this.campaigns); // Debugging line
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    },
  },
  mounted() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.currentUserId = user.uid;
        console.log("Current User ID:", this.currentUserId); // Debugging line
        this.fetchCampaigns();
      } else {
        console.error("No user is currently logged in.");
      }
    });
  },
  watch: {
    campaigns(newCampaigns) {
      console.log("Campaigns data updated:", newCampaigns);
    },
  },
};
</script>

<style scoped>
.add-campaign-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f0f8f1;
}

.content {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
}

.left-side,
.right-side {
  flex: 1;
  padding: 1rem;
}

.title-h2 {
  display: flex;
  justify-content: start;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  padding: 1.5rem 4rem;
}

.listings-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 0rem 2rem;
}

.listing-card {
  transform: scale(0.9);
}

@media (max-width: 768px) {
  .content {
    flex-direction: column;
  }

  .left-side {
    order: 1;
  }

  .right-side {
    order: -1;
    width: 100%;
    margin: 0 auto;
  }

  .title-h2 {
    display: flex;
    justify-content: center;
  }

  .listings-container {
    grid-template-columns: 1fr;
    justify-items: center;
  }
}
</style>
