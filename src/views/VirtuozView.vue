<template>
  <div>
    <div class="stanje">
      <p>Trenutno stanje</p>
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
      <div class="upgrade-status">
        <h3>Postanite mecena status</h3>
        <InProfileCard :imageSrc="require('@/assets/rich.png')">
          <button class="statusBtn" @click="riseStatus">Povisi status</button>
        </InProfileCard>
      </div>
      <div class="campaign-status">
        <h3>Trenutni status kampanja</h3>
        <InProfileCard>
          <BarChart :chart-data="barChartData" />
        </InProfileCard>
      </div>
      <div class="ad">
        <h3>Virtuozno naprijed</h3>
        <InProfileCard :imageSrc="require('@/assets/rocket.png')">
          <p>
            Uspješne kampanje:
            <span id="uspjesne-kampanje">{{ successfulCampaigns }}</span>
          </p>
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
    <button @click="deleteUser" class="delete-user-button">
      Obriši profil
    </button>
  </div>
</template>

<script>
import InProfileCard from "@/components/InProfileCard.vue";
import BarChart from "@/components/BarChart.vue";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { firebaseApp } from "@/firebase";

export default {
  name: "VirtuozView",
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
      successfulCampaigns: 0,
      campaigns: [],
      barChartData: {
        labels: [],
        datasets: [
          {
            label: "Money Raised",
            backgroundColor: "#f87979",
            data: [],
          },
        ],
      },
    };
  },
  methods: {
    async fetchSuccessfulCampaigns() {
      try {
        const db = getFirestore(firebaseApp);
        const campaignsCol = collection(db, "campaigns");
        const q = query(
          campaignsCol,
          where("userUID", "==", this.user.id),
          where("campaignCompleted", "==", true)
        );
        const campaignSnapshot = await getDocs(q);

        console.log("Campaign Snapshot:", campaignSnapshot);
        console.log("Number of successful campaigns:", campaignSnapshot.size);

        this.successfulCampaigns = campaignSnapshot.size;
      } catch (error) {
        console.error("Failed to fetch successful campaigns:", error);
      }
    },
    async fetchUserCampaigns() {
      try {
        const db = getFirestore(firebaseApp);
        const campaignsCol = collection(db, "campaigns");
        const q = query(campaignsCol, where("userUID", "==", this.user.id));
        const campaignSnapshot = await getDocs(q);

        this.campaigns = campaignSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
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

      this.barChartData.labels = monthNames;
      this.barChartData.datasets[0].data = monthlyData;
    },

    async emitUpdateAmount() {
      const parsedAmount = parseFloat(this.newAmount);
      if (isNaN(parsedAmount)) {
        alert("Please enter a valid number");
        return;
      }

      this.user.amount += parsedAmount;

      try {
        const userRef = doc(getFirestore(firebaseApp), "users", this.user.id);
        await updateDoc(userRef, {
          amount: this.user.amount,
        });
      } catch (error) {
        console.error("Failed to update user amount:", error);
        this.user.amount -= parsedAmount;
      }
    },
    async riseStatus() {
      alert("Status je uspješno povišen na Mecena status!");
      this.user.userStatus = 2;

      try {
        const userRef = doc(getFirestore(firebaseApp), "users", this.user.id);
        await updateDoc(userRef, {
          userStatus: this.user.userStatus,
        });
      } catch (error) {
        console.error("Failed to update user status:", error);
        this.user.userStatus = 1;
      }
    },
    async deleteUser() {
      alert("Pokrenuto je brisanje profila...");
      if (confirm("Jeste li sigurni da ne želite biti više s nama?")) {
        try {
          const userRef = doc(getFirestore(firebaseApp), "users", this.user.id);
          await deleteDoc(userRef);
          alert("Brisanje je uspješno!");
          this.$router.push({ name: "HomeView" });
        } catch (error) {
          console.error("Pogreška:", error);
          alert("Korisnik nije izbrisan.");
        }
      }
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
    await this.fetchUserCampaigns();
    await this.fetchSuccessfulCampaigns();
  },
};
</script>

<style scoped>
.upgrade-status h3,
.campaign-status h3,
.ad h3 {
  font-size: 1.2rem;
  font-weight: bold;
  display: flex;
}

.stanje {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 1rem 5rem;
}

.stanje p {
  font-weight: bold;
}

#iznos,
#uspjesne-kampanje {
  color: #ff7b00;
  font-weight: bold;
}

.cards {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 20rem;
}

.statusBtn {
  background-color: #7eb584;
  color: white;
  border: none;
  padding: 0.5rem 5rem;
  border-radius: 5px;
  cursor: pointer;
}

.statusBtn:hover {
  background-color: #5d9e65;
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

.delete-user-button {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin: 2rem 0;
}

.delete-user-button:hover {
  background-color: #cc0000;
}

/* Media Queries for Mobile View */
@media (max-width: 768px) {
  .stanje {
    padding: 1rem;
    align-items: center;
  }

  .cards {
    flex-direction: column;
    padding: 1rem;
  }

  .update-amount {
    flex-direction: column;
    padding: 1rem;
  }

  .amount-input {
    margin-right: 0;
    margin-bottom: 1rem;
    width: 100%;
  }

  .statusBtn {
    padding: 0.5rem 2rem;
  }

  .campaigns-table {
    margin: 1rem;
    overflow-x: auto;
  }

  .campaigns-table table {
    width: 100%;
  }
}
</style>
