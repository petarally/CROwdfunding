<template>
  <div class="add-campaign-container">
    <div class="content">
      <div class="right-side">
        <div class="campaigns-container">
          <ListingCard
            v-for="campaign in campaigns"
            :key="campaign.id"
            :campaign="campaign"
          />
        </div>
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
import { db, auth } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import ListingCard from "@/components/ListingCard.vue";

export default {
  components: {
    AddCampaignComponent,
    FooterComponent,
    ListingCard,
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
      const campaignsCollection = collection(db, "campaigns");
      const q = query(
        campaignsCollection,
        where("userId", "==", this.currentUserId)
      );
      const querySnapshot = await getDocs(q);
      this.campaigns = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    },
  },
  mounted() {
    if (auth.currentUser) {
      this.currentUserId = auth.currentUser.uid;
      console.log("Current User ID:", this.currentUserId); // Debugging line
      this.fetchCampaigns();
    } else {
      console.error("No user is currently logged in.");
    }
  },

  async fetchCampaigns() {
    if (!this.currentUserId) {
      console.error("currentUserId is undefined");
      return;
    }
    const campaignsCollection = collection(db, "campaigns");
    const q = query(
      campaignsCollection,
      where("userId", "==", this.currentUserId)
    );
    const querySnapshot = await getDocs(q);
    this.campaigns = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Fetched campaigns:", this.campaigns); // Debugging line
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
