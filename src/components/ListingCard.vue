<template>
  <div :class="['card', { 'campaign-over': daysLeft === 0 }]">
    <img :src="campaignImage" alt="Campaign Image" class="campaign-image" />
    <div class="content">
      <h2 class="campaign-name" @click="viewCampaignDetails">
        {{ truncatedCampaignName }}
      </h2>
      <p class="campaign-details" @click="toggleDetails">
        {{ truncatedCampaignDetails }}
      </p>
      <hr />
      <div class="funding-info">
        <p>
          Traženi iznos: <strong>{{ moneyNeeded }} kn</strong>
        </p>
        <p>Preostalo dana: {{ daysLeft }}</p>
      </div>
      <button @click="viewCampaignDetails" :disabled="daysLeft === 0">
        Sudjeluj
      </button>
    </div>
  </div>
</template>

<script>
import { calculateDaysLeft } from "@/functions";

export default {
  name: "ListingCard",
  props: {
    campaignImage: String,
    campaignName: String,
    campaignDetails: String,
    moneyNeeded: Number,
    startDate: String,
    endDate: String,
    campaignId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showFullCampaignName: false,
      showFullCampaignDetails: false,
    };
  },
  computed: {
    daysLeft() {
      console.log(`Start Date: ${this.startDate}, End Date: ${this.endDate}`);
      const daysLeft = calculateDaysLeft(this.startDate, this.endDate);
      console.log(`Days Left: ${daysLeft}`);
      return daysLeft;
    },
    truncatedCampaignName() {
      if (this.showFullCampaignName || this.campaignName.length < 50) {
        return this.campaignName;
      }
      return this.campaignName.substring(0, 47) + "...";
    },
    truncatedCampaignDetails() {
      if (this.showFullCampaignDetails || this.campaignDetails.length < 100) {
        return this.campaignDetails;
      }
      return this.campaignDetails.substring(0, 97) + "...";
    },
  },
  methods: {
    toggleDetails() {
      this.showFullCampaignDetails = !this.showFullCampaignDetails;
    },
    viewCampaignDetails() {
      console.log(this.campaignId);
      if (this.campaignId && this.daysLeft > 0) {
        this.$router.push({
          name: "CampaignView",
          params: { id: this.campaignId },
        });
      } else {
        console.error("Campaign ID is missing or campaign is over.");
      }
    },
  },
};
</script>

<style scoped lang="scss">
.card {
  text-align: left;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  width: 300px;
  height: auto;
  margin: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-bottom: 4px solid #7caa7c;
  display: flex;
  flex-direction: column;

  &.campaign-over {
    filter: grayscale(100%);
    pointer-events: none;
  }

  .campaign-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .content {
    display: flex;
    flex-direction: column;
    padding: 15px;
    flex: 1;

    h2 {
      margin-top: 0;
      cursor: pointer;
    }

    hr {
      margin: 20px 0;
    }

    .funding-info {
      p {
        margin: 5px 0;
      }
    }

    button {
      display: block;
      width: 100%;
      padding: 10px;
      border: none;
      background-color: #d2e892;
      color: #8caa34;
      font-weight: bold;
      cursor: pointer;
      border-radius: 4px;
      margin-top: auto;

      &:hover {
        background-color: darken(#8caa34, 5%);
        color: #d2e892;
      }
    }
  }

  .campaign-name,
  .campaign-details {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
