<template>
  <div class="login-container">
    <div class="left-side" :style="backgroundImageStyle">
    </div>
    <div class="right-side">
      <form class="login-form">
        <h2>Prijava</h2>
        <h3>Dobrodošli natrag</h3>
        <div class="form-group">
          <label for="username">Korisničko ime</label>
          <input type="text" id="username" name="username" required>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
          <label for="password">Lozinka</label>
          <input type="password" id="password" name="password" required>
        </div>
        <button type="submit">Prijava</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignUpView',
  computed: {
    backgroundImageStyle() {
      return {
        backgroundImage: `url(${require('../assets/login.png')})`
      };
    }
  }
}
</script>

<style scoped>


@media (max-width: 768px) { 
  .login-container {
    flex-direction: column;
  }

  .left-side, .right-side {
    flex: none; 
    width: 100%;
  }

  .left-side {
    order: -1;
    background-size: cover;
  }
}


.login-container {
  display: flex;
  height: 100vh;
}

.left-side, .right-side {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.left-side {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.login-form {
  max-width: 300px;
  width: 100%;
  margin: 2rem 0;
}

.login-form h2, h3 {
  display: flex;
  justify-content: start;
  font-family: 'Poppins', sans-serif;
}

.login-form h2 {
  color: #FF7B00;
  font-weight: bold;
  font-size: 2rem;
}

.login-form h3 {
  color: #B4B4B4;
  font-weight: light;
  font-size: 1rem;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  display: flex;
  justify-content: start;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #7EB584;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #49704e;
}
</style>