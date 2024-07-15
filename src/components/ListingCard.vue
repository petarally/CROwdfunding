<template>
  <div class="card">
    <img :src="campaignImage" alt="Campaign Image" class="campaign-image"/>
    <div class="content">
      <h2 class="campaign-name" @click="toggleName">{{ truncatedCampaignName }}</h2>
      <p class="campaign-details" @click="toggleDetails">{{ truncatedCampaignDetails }}</p>
      <hr/>
      <div class="funding-info">
        <p>Traženi iznos: <strong>{{ moneyNeeded }} kn</strong></p>
        <p>Preostalo dana: {{ daysLeft }}</p>
      </div>
      <button @click="openCampaignDetails">Sudjeluj</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListingCard',
  props: {
    campaignImage: String,
    campaignName: String,
    campaignDetails: String,
    moneyNeeded: Number,
    daysLeft: Number
  },
  data() {
    return {
      showFullCampaignName: false,
      showFullCampaignDetails: false,
    };
  },
  computed: {
    truncatedCampaignName() {
      if (this.showFullCampaignName || this.campaignName.length < 50) {
        return this.campaignName;
      }
      return this.campaignName.substring(0, 47) + '...';
    },
    truncatedCampaignDetails() {
      if (this.showFullCampaignDetails || this.campaignDetails.length < 100) {
        return this.campaignDetails;
      }
      return this.campaignDetails.substring(0, 97) + '...';
    }
  },
  methods: {
    toggleName() {
      this.showFullCampaignName = !this.showFullCampaignName;
    },
    toggleDetails() {
      this.showFullCampaignDetails = !this.showFullCampaignDetails;
    },
    openCampaignDetails() {
      alert('Opening campaign details...');
    }
  }
}
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-bottom: 4px solid #7CAA7C;
  display: flex;
  flex-direction: column;

  .campaign-image {  
    width: 100%; 
    height: 200px;
    object-fit: cover; 
  }

  .content {
    padding: 15px;
    flex: 1; 

    h2 {
      margin-top: 0;
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
      background-color: #D2E892;
      color: #8CAA34;
      font-weight: bold;
      cursor: pointer;
      border-radius: 4px;
      margin-top: auto; 

      &:hover {
        background-color: darken(#8CAA34, 5%);
        color: #D2E892;
      }
    }
  }

  .campaign-name, .campaign-details {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
