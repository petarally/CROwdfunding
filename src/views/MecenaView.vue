<template>
  <div>
    <div class="stanje">
      <p><strong>Trenutno stanje</strong></p>
      <p id="iznos">{{ user.amount }} KN</p>
    </div>
    <div class="update-amount">
      <input
        :value="newAmount"
        @input="$emit('update:newAmount', parseFloat($event.target.value))"
        type="number"
        placeholder="Enter new amount"
        class="amount-input"
      />
      <button @click="emitUpdateAmount" class="add-amount-button">
        Dodaj kune
      </button>
    </div>
    <div class="cards">
      <div class="support">
        <h3>Trenutni status kampanja</h3>
        <InProfileCard>
          <BarChart :chart-data="barChartData" />
        </InProfileCard>
      </div>
    </div>
    <div class="campaigns-table">
      <table>
        <thead>
          <tr>
            <th>Naziv Kampanje</th>
            <th>Traženi Iznos</th>
            <th>Završeno</th>
            <th>Datum Završetka</th>
            <th>Trenutni Iznos</th>
            <th>Uspješno Završena kampanja</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="campaign in campaigns" :key="campaign.id">
            <td>{{ campaign.campaignName }}</td>
            <td>{{ campaign.moneyNeeded }} KN</td>
            <td>
              {{ isCampaignEnded(campaign.endDate) ? "DA" : "NE" }}
            </td>
            <td>{{ formatDate(campaign.endDate) }}</td>
            <td>{{ campaign.raised }} KN</td>
            <td>
              {{ campaign.campaignCompleted ? "DA" : "NE" }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import InProfileCard from "@/components/InProfileCard.vue";
import BarChart from "@/components/BarChart.vue";
import { db } from "@/firebase";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export default {
  name: "MecenaView",
  components: {
    InProfileCard,
    BarChart,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
    newAmount: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      campaigns: [],
      barChartData: {
        labels: [],
        datasets: [
          {
            label: "Prikupljeno novca",
            backgroundColor: "#7eb584",
            data: [],
          },
        ],
      },
    };
  },
  methods: {
    async emitUpdateAmount() {
      const parsedAmount = parseFloat(this.newAmount);
      if (isNaN(parsedAmount)) {
        alert("Please enter a valid number");
        return;
      }

      this.user.amount += parsedAmount;

      try {
        const userRef = doc(db, "users", this.user.id);
        await updateDoc(userRef, {
          amount: this.user.amount,
        });
      } catch (error) {
        console.error("Failed to update user amount:", error);
        this.user.amount -= parsedAmount;
      }
    },
    async fetchUserCampaigns() {
      try {
        console.log("Fetching user campaigns...");
        const campaignsCol = collection(db, "campaigns");
        const q = query(campaignsCol, where("userUID", "==", this.user.id));
        const campaignSnapshot = await getDocs(q);

        console.log("Campaign snapshot:", campaignSnapshot);

        this.campaigns = campaignSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Campaigns:", this.campaigns);

        this.processCampaignData();
      } catch (error) {
        console.error("Failed to fetch user campaigns:", error);
        this.barChartData.labels = [];
        this.barChartData.datasets[0].data = [];
      }
    },
    processCampaignData() {
      const monthlyData = Array(12).fill(0);
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      this.campaigns.forEach((campaign) => {
        const endDate = new Date(campaign.endDate);
        const monthIndex = endDate.getMonth();
        monthlyData[monthIndex] += campaign.raised;
      });

      console.log("Monthly Data:", monthlyData);

      this.barChartData.labels = monthNames;
      this.barChartData.datasets[0].data = monthlyData;

      console.log("Bar Chart Data:", this.barChartData);
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}.${month}.${year}.`;
    },
    isCampaignEnded(endDate) {
      const currentDate = new Date();
      const campaignEndDate = new Date(endDate);
      return campaignEndDate <= currentDate;
    },
  },
  async mounted() {
    console.log("Component mounted");
    await this.fetchUserCampaigns();
  },
};
</script>

<style scoped>
.stanje {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 2rem 5rem;
}

.stanje p {
  font-weight: bold;
  margin: 0;
}

#iznos {
  color: #ff7b00;
  font-size: 1.5rem;
}

.update-amount {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 5rem;
  margin-bottom: 1rem;
}

.amount-input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 1rem;
  width: 200px;
  font-size: 1rem;
}

.add-amount-button {
  background-color: #ff7b00;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.add-amount-button:hover {
  background-color: #e66a00;
}

.cards {
  display: flex;
  justify-content: space-around;
  padding: 1rem 5rem;
}

.cards > div {
  flex: 1;
  margin: 0 1rem;
}

.cards h3 {
  margin-bottom: 1rem;
}

.statusBtn {
  background-color: #ff7b00;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}

.statusBtn:hover {
  background-color: #e66a00;
}

.campaigns-table {
  margin: 2rem 5rem;
}

.campaigns-table table {
  width: 100%;
  border-collapse: collapse;
}

.campaigns-table th,
.campaigns-table td {
  border: 1px solid #ccc;
  padding: 0.5rem;
  text-align: left;
}

.campaigns-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

@media (max-width: 992px) {
  .cards {
    flex-direction: column;
    align-items: center;
  }

  .cards > div {
    margin-bottom: 1rem;
  }
}
</style>
