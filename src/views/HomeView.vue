<template>
  <div class="home">
    <div class="title">
      <h1><span>CRO</span>WDFUNDING</h1>
      <a href="login">Prijava</a>
    </div>
    <img alt="home" src="../assets/home.png" />
    <div class="home-text">
      <p>
        Najnovija <span>Cro</span>wdfunding Platforma - Okupite se i ostvarite
        svoje snove! <br />
        Snažna zajednica koja podržava inovacije, umjetnost i poduzetništvo.
        Pridružite nam se i budite dio pokreta koji mijenja svijet. <br />
        Registrirajte se sada i započnite svoje putovanje prema ostvarenju
        ciljeva uz podršku ljudi koji vjeruju u vas!
      </p>
    </div>
    <button @click="redirectToSignup">Registracija</button>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  methods: {
    redirectToSignup() {
      this.$router.push("/signup");
    },
  },
};
</script>

<style scoped>
.home {
  height: 100vh;
  padding: 0 8rem;
}

.title {
  display: flex;
  justify-content: space-around;
  margin: 4rem 0;
}

.title span {
  color: #ff7b00;
}

.title h1 {
  font-family: "Popins", sans-serif;
  font-weight: bold;
  font-size: 2.5rem;
}

.title a {
  font-family: "Popins", sans-serif;
  font-size: 1.3rem;
  font-weight: bold;
  color: black;
  text-decoration: none;
}

.home-text p {
  font-family: "Popins", sans-serif;
  font-size: 1.3rem;
  font-weight: bold;
  padding: 2rem;
}

.home-text p span {
  color: #ff7b00;
}

button {
  width: 50%;
  padding: 20px;
  border: none;
  border-radius: 5px;
  background-color: #7eb584;
  color: white;
  cursor: pointer;
  margin-bottom: 5rem;
  font-size: 1.3rem;
  font-weight: bold;
}

button:hover {
  background-color: #49704e;
}

@media (max-width: 768px) {
  .home {
    padding: 0 2rem;
  }

  .home img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }

  .title {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .title h1 {
    font-size: 2rem;
  }

  .title a {
    margin-top: 1rem;
    font-size: 1rem;
  }

  .home-text p {
    font-size: 1rem;
    padding: 1rem;
  }

  button {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
  }
}
</style>
