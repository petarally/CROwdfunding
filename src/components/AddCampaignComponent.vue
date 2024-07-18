<template>
  <div class="add-campaign">
    <h2>Nova kampanja</h2>
    <h3>Stvorite novu kampanju</h3>
    <hr />
    <form @submit.prevent="submitCampaign">
      <div class="form-group">
        <input
          placeholder="Dodajte naslovnu fotografiju"
          type="text"
          id="campaignImage"
          v-model="campaign.campaignImage"
          required
        />
      </div>
      <div class="form-group">
        <input
          placeholder="Unesite naziv kampanje"
          type="text"
          id="campaignName"
          v-model="campaign.campaignName"
          required
        />
      </div>
      <div class="form-group">
        <textarea
          placeholder="Unesite kratki opis kampanje"
          id="campaignDetails"
          v-model="campaign.campaignDetails"
          required
        ></textarea>
      </div>
      <div class="form-group">
        <input
          placeholder="Potreban iznos"
          type="text"
          id="moneyNeeded"
          v-model.number="campaign.moneyNeeded"
          required
        />
      </div>
      <div class="form-group">
        <input
          placeholder="Trajanje kampanje u danima"
          type="text"
          id="daysLeft"
          v-model.number="campaign.daysLeft"
          required
        />
      </div>
      <button type="submit">Objavi</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "AddCampaignComponent",
  data() {
    return {
      campaign: {
        campaignImage: "",
        campaignName: "",
        campaignDetails: "",
        moneyNeeded: "",
        daysLeft: "",
      },
    };
  },
  methods: {
    submitCampaign() {
      console.log("Submitting campaign:", this.campaign);
      alert("Campaign added successfully!");
      this.resetForm();
    },
    resetForm() {
      this.campaign = {
        campaignImage: "",
        campaignName: "",
        campaignDetails: "",
        moneyNeeded: 0,
        daysLeft: 0,
      };
    },
  },
};
</script>

<style scoped>
.add-campaign {
  max-width: 500px;
  margin: auto;
  padding: 20px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: white;
}

.add-campaign h2,
h3 {
  display: flex;
  justify-content: start;
  font-family: "Poppins", sans-serif;
}

.add-campaign h2 {
  color: #ff7b00;
  font-weight: bold;
  font-size: 2rem;
}

.add-campaign h3 {
  color: #b4b4b4;
  font-weight: light;
  font-size: 1rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

input,
textarea {
  background: #fbfdff;
}

input::placeholder,
textarea::placeholder {
  color: #7eb584;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1.6px solid #d7d7d7;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #7eb584;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #49704e;
}
</style>
