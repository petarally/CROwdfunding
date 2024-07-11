<template>
  <div class="signup-container">
    <div class="left-side" :style="backgroundImageStyle">
    </div>
    <div class="right-side">
      <form class="signup-form">
        <h2>Registracija</h2>
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" name="username" required>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignUpView',
  computed: {
    backgroundImageStyle() {
      // Using require to ensure webpack correctly processes the file path
      return {
        backgroundImage: `url(${require('../assets/login.png')})`
      };
    }
  }
}
</script>

<style scoped>
.signup-container {
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

.signup-form {
  max-width: 300px;
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
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
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>