<template>
  <div class="add-campaign">
    <div class="content-add-campaign">
      <h2>Nova kampanja</h2>
      <h3>Stvorite novu kampanju</h3>
      <hr />
      <form @submit.prevent="submitCampaign">
        <div class="naziv-kategorija">
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
            <select id="campaignCategory" v-model="campaign.category" required>
              <option disabled value="">Unesite kategoriju</option>
              <option value="health">Health</option>
              <option value="education">Education</option>
              <option value="environment">Environment</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <textarea
            placeholder="Unesite kratki opis kampanje"
            id="campaignDetails"
            v-model="campaign.campaignDetails"
            required
          ></textarea>
        </div>
        <div class="form-group image-upload-container">
          <label for="campaignImage" class="image-upload-label">
            <i class="fas fa-upload"></i> Dodajte naslovnu fotografiju
          </label>
          <input
            type="file"
            id="campaignImage"
            @change="handleImageUpload"
            hidden
          />
          <progress
            v-if="isUploading"
            :value="uploadProgress"
            max="100"
          ></progress>
          <div v-if="campaign.campaignImage">
            <img :src="campaign.campaignImage" alt="Campaign Image" />
          </div>
        </div>
        <div class="tasks">
          <h3>Popis zadataka i nagrada za kampanju</h3>
          <div class="zadatak-cijena">
            <div
              v-for="zadatak in zadaciCijene"
              :key="zadatak.id"
              class="zadatak-cijena-item"
            >
              <input
                v-model="zadatak.zadatak"
                type="text"
                placeholder="Zadatak"
              />
              <input
                v-model="zadatak.cijena"
                type="text"
                placeholder="Cijena zadatka"
              />
            </div>
          </div>
          <div class="btn-new-task">
            <button
              class="add-new-task"
              @click="addNewZadatakCijena"
              type="button"
            >
              <i class="fas fa-plus"></i>
            </button>
          </div>
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
            placeholder="Trajanje kampanje (u danima)"
            type="text"
            id="daysLeft"
            v-model.number="campaign.daysLeft"
            required
          />
        </div>
        <hr />
        <div class="form-group">
          <input
            placeholder="Početni ulog"
            type="text"
            id="starterMoney"
            v-model.number="campaign.starterMoney"
            required
          />
        </div>
        <button type="submit">Objavi</button>
      </form>
    </div>
  </div>
</template>
<script>
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

export default {
  name: "AddCampaignComponent",
  data() {
    return {
      campaign: {
        campaignImage: null,
        campaignName: "",
        campaignDetails: "",
        moneyNeeded: "",
        daysLeft: "",
        category: "",
        starterMoney: "",
        userID: null,
        zadaciCijene: [],
      },
      zadaciCijene: [],
      uploadProgress: 0,
      isUploading: false,
    };
  },
  methods: {
    async handleImageUpload(e) {
      const file = e.target.files[0];
      if (!file) {
        console.error("No file selected.");
        return;
      }
      this.isUploading = true;
      const storage = getStorage();
      const storageRef = ref(storage, `campaignImages/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.uploadProgress = progress;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Upload failed", error);
          this.isUploading = false;
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            this.campaign.campaignImage = downloadURL;
            console.log("File available at", downloadURL);
            this.isUploading = false;
          } catch (error) {
            console.error("Failed to get download URL", error);
            this.isUploading = false;
          }
        }
      );
    },
    addNewZadatakCijena() {
      const newId = Date.now();
      this.zadaciCijene.push({
        id: newId,
        zadatak: "",
        cijena: "",
      });
    },
    async submitCampaign() {
      if (this.isUploading) {
        console.error("Wait for the image to finish uploading.");
        return;
      }
      const auth = getAuth();
      const user = auth.currentUser;
      if (user !== null) {
        this.campaign.userUID = user.uid;
      } else {
        console.error("No authenticated user found.");
        return;
      }
      this.campaign.zadaciCijene = this.zadaciCijene;
      try {
        const docRef = await addDoc(collection(db, "campaigns"), this.campaign);
        console.log("Document written with ID: ", docRef.id);
        this.resetForm();
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },
    resetForm() {
      this.campaign = {
        campaignImage: null,
        campaignName: "",
        campaignDetails: "",
        moneyNeeded: "",
        daysLeft: "",
        category: "",
        starterMoney: "",
        userID: null,
        zadaciCijene: [],
      };
      this.zadaciCijene = [];
      this.uploadProgress = 0;
      this.isUploading = false;
    },
  },
};
</script>

<style scoped>
.add-campaign {
  max-width: 80%;
  margin: 4rem auto;
  padding: 20px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: white;
}

.content-add-campaign {
  max-width: 90%;
  margin: auto;
  padding: 2rem 0;
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

.naziv-kategorija {
  display: flex;
  justify-content: space-between;
}

.form-group {
  flex: 1;
  margin: 0 10px;
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

#campaignCategory {
  height: 44px;
}

input,
textarea,
select {
  background: #fbfdff;
}

input::placeholder,
textarea::placeholder,
select {
  color: #7eb584;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1.6px solid #d7d7d7;
  border-radius: 4px;
}

.image-upload-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: #fbfdff;
  border: 1.6px solid #d7d7d7;
  border-radius: 4px;
  padding: 20px;
  color: #7eb584;
}

.image-upload-label i {
  margin-right: 10px;
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

.tasks {
  padding: 1rem 0;
  background: #f0f8f1;
  margin: 1rem 0;
}

.tasks h3 {
  padding-left: 1rem;
  color: #ff7b00;
  font-weight: bold;
  padding-bottom: 1rem;
}

.zadatak-cijena {
  margin: auto;
  display: flex;
  flex-direction: column;
}

.zadatak-cijena-item {
  display: flex;
  width: 90%;
  margin: auto;
  margin-bottom: 10px;
}

@media (max-width: 600px) {
  .zadatak-cijena-item {
    flex-direction: column;
  }
}

.zadatak-cijena-item input {
  flex: 1;
  padding: 5px;
  border: 1.6px solid #d7d7d7;
  border-radius: 4px;
  margin-right: 10px;
}

.btn-new-task {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem;
}

.add-new-task {
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  color: #ff7b00;
  border: 1px solid #ff7b00;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.add-new-task i {
  margin: 0;
}

.add-new-task:hover {
  background: #ff7b00;
  color: #f0f8f1;
}
</style>
