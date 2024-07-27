<template>
  <NavbarComponent />
  <div class="campaign-container">
    <div class="campaign-info">
      <h2 v-if="campaign">{{ campaign.campaignName }}</h2>
      <p v-if="campaign">{{ campaign.campaignDetails }}</p>
      <div class="task-list" v-if="campaign">
        <h3>Popis zadataka i nagrada</h3>
        <TaskList :zadaciCijene="campaign.zadaciCijene" />
      </div>
      <p v-else>Loading campaign data...</p>
    </div>
    <div class="campaign-image">
      <div class="image-container">
        <img
          v-if="campaign"
          :src="campaign.campaignImage"
          alt="Campaign Image"
        />
        <div class="overlay"></div>
      </div>
    </div>
  </div>
  <FooterComponent />
</template>

<script>
import TaskList from "@/components/TaskListComponent.vue";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseApp } from "@/firebase.js";
import FooterComponent from "@/components/FooterComponent.vue";
import NavbarComponent from "@/components/NavbarComponent.vue";

export default {
  name: "CampaignView",
  components: {
    TaskList,
    FooterComponent,
    NavbarComponent,
  },
  data() {
    return {
      campaign: null,
    };
  },
  async created() {
    try {
      const id = this.$route.params.id;
      if (!id) {
        console.error("Campaign ID is missing from route parameters.");
        return;
      }

      const db = getFirestore(firebaseApp);
      const campaignDoc = doc(db, "campaigns", id);
      const docSnapshot = await getDoc(campaignDoc);

      if (docSnapshot.exists()) {
        this.campaign = docSnapshot.data();
      } else {
        console.error("No such document!");
      }
    } catch (error) {
      console.error("Error fetching campaign data:", error);
    }
  },
};
</script>

<style scoped>
.campaign-container {
  display: flex;
  height: 100vh;
  background: #f0f8f1;
}

.campaign-info {
  flex: 3;
  padding: 1rem 5rem;
  overflow-y: auto;
}

.campaign-image {
  flex: 1;
  height: 100vh;
  position: relative;
}

.image-container {
  position: relative;
  height: 100%;
}

.campaign-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(128, 128, 128, 0.3);
  pointer-events: none;
}

.task-list {
  margin-top: 1rem;
}
</style>
