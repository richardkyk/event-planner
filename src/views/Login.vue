<template>
  <v-app id="login" class="grey lighten-4">
    <v-container fluid fill-height>
      <v-row align-center justify-center>
        <v-col sm="12" md="6" lg="4" xl="3">
          <v-card class="elevation-5">
            <v-toolbar color="#3f51b5" dark flat>
              <v-toolbar-title class="font-weight-thin"
                >Guest App</v-toolbar-title
              >
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="email"
                  label="Email"
                  name="email"
                  prepend-icon="person"
                  type="text"
                ></v-text-field>

                <v-text-field
                  v-model="password"
                  id="password"
                  label="Password"
                  name="password"
                  prepend-icon="lock"
                  type="password"
                ></v-text-field>
              </v-form>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  @click="login"
                  :loading="loading"
                  color="#3f51b5"
                  class="text-none white--text font-weight-thin"
                  >Login</v-btn
                >
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { Firebase } from "@/firebase/";

export default {
  data() {
    return {
      email: "",
      password: "",
      loading: false
    };
  },
  methods: {
    login() {
      this.loading = true;
      Firebase.auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.$router.push("/");
        })
        .catch(err => {
          console.log(err.message);
          this.loading = false;
        });
    }
  }
};
</script>

<style scoped>
.v-card__actions {
  padding: 0px;
  padding-top: 10px;
}
</style>
