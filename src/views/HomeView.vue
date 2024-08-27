<template>
  <div class="home">
    <div class="title">
      <h1><span>CRO</span>WDFUNDING</h1>
      <a @click="redirectToLogin" class="login-link">Prijava</a>
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
    <a @click="redirectToLogin" class="login-link-mobile">Prijava</a>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  methods: {
    redirectToLogin() {
      this.$router.push({ name: "LoginView" });
    },
    redirectToSignup() {
      this.$router.push({ name: "SignUpView" });
    },
  },
};
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 0 8rem;
  box-sizing: border-box;
}

.title {
  display: flex;
  justify-content: space-between;
  margin: 4rem 0;
}

.title span {
  color: #ff7b00;
}

.title h1 {
  font-family: "Poppins", sans-serif;
  font-weight: bold;
  font-size: 2.5rem;
}

.title a {
  font-family: "Poppins", sans-serif;
  font-size: 1.3rem;
  font-weight: bold;
  color: black;
  text-decoration: none;
  cursor: pointer;
}

img {
  flex-grow: 1;
  max-height: 50%;
  object-fit: contain;
}

.home-text {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.home-text p {
  font-family: "Poppins", sans-serif;
  font-size: 1.3rem;
  font-weight: bold;
  padding: 2rem;
}

.home-text p span {
  color: #ff7b00;
}

button {
  align-self: center;
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

.login-link-mobile {
  display: none;
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
    margin-bottom: 1rem;
  }

  .login-link {
    display: none;
  }

  .login-link-mobile {
    display: block;
    align-self: center;
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: #7eb584;
    color: white !important;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    margin-bottom: 2rem;
  }

  .login-link-mobile:hover {
    background-color: #49704e;
  }
}
</style>
