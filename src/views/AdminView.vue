<template>
  <div class="admin-actions">
    <div class="data-section">
      <h3>Korisnici</h3>
      <div v-if="users.length">
        <table class="responsive-table">
          <thead>
            <tr>
              <th>Korisničko ime</th>
              <th>Email</th>
              <th>Status</th>
              <th>Iznos</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.userStatus }}</td>
              <td>{{ user.amount }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <p>No users found</p>
      </div>

      <h3>Kampanje</h3>
      <div v-if="campaigns.length">
        <table class="responsive-table">
          <thead>
            <tr>
              <th>Naziv kampanje</th>
              <th>Opis</th>
              <th>Kategorija</th>
              <th>Trajanje</th>
              <th>Potreban iznos</th>
              <th>Početni iznos</th>
              <th>Vlasnik kampanje</th>
              <th>Naslovna slika</th>
              <th>Zadaci</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="campaign in campaigns" :key="campaign.campaignId">
              <td>{{ campaign.campaignName }}</td>
              <td>{{ campaign.campaignDetails }}</td>
              <td>{{ campaign.category }}</td>
              <td>{{ campaign.daysLeft }}</td>
              <td>{{ campaign.moneyNeeded }}</td>
              <td>{{ campaign.starterMoney }}</td>
              <td>{{ userMapping[campaign.userUID] }}</td>
              <td>
                <img
                  :src="campaign.campaignImage"
                  alt="Campaign Image"
                  class="campaign-image"
                />
              </td>
              <td>
                <div
                  v-if="campaign.zadaciCijene && campaign.zadaciCijene.length"
                >
                  <div
                    v-for="task in campaign.zadaciCijene"
                    :key="task.id"
                    class="task-item"
                  >
                    <p><strong>Task:</strong> {{ task.zadatak }}</p>
                    <p><strong>Price:</strong> {{ task.cijena }}</p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <p>No campaigns found</p>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

export default {
  name: "AdminView",
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
      users: [],
      campaigns: [],
      userMapping: {},
    };
  },
  methods: {
    async fetchUsers() {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        this.users = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        this.userMapping = this.users.reduce((acc, user) => {
          acc[user.id] = user.username;
          return acc;
        }, {});
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    async fetchCampaigns() {
      try {
        const querySnapshot = await getDocs(collection(db, "campaigns"));
        this.campaigns = querySnapshot.docs.map((doc) => ({
          campaignId: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    },
  },
  created() {
    this.fetchUsers();
    this.fetchCampaigns();
  },
};
</script>

<style scoped>
.admin-actions {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.data-section {
  margin-top: 20px;
}

.data-section h3 {
  font-weight: bold;
  display: flex;
  justify-self: flex-start;
}

.responsive-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  overflow-x: auto;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

.campaign-image {
  max-width: 100px;
  height: auto;
  border-radius: 5px;
}

.task-item {
  background: #e9ecef;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
}

@media screen and (max-width: 768px) {
  .responsive-table {
    display: block;
    overflow-x: auto;
  }
  th,
  td {
    white-space: nowrap;
  }
}
</style>
