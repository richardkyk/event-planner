<template>
  <v-dialog persistent v-model="dialog" max-width="300px">
    <v-card>
      <v-text-field class="mx-3" ref="text" v-model="value" v-on:keyup.enter="submit"></v-text-field>
      <v-layout row justify-space-between>
        <v-card-actions>
          <v-btn flat color="primary" @click.stop="dialog = false">Close</v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-btn flat color="primary" @click="submit">Submit</v-btn>
        </v-card-actions>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
// import db from "@/fb";

export default {
  data() {
    return { dialog: false, value: "", type: null, data: null };
  },
  methods: {
    open(data) {
      this.data = data;
      if ("desc" in data) {
        this.type = "table";
        this.value = data.desc;
      } else {
        this.type = "guest";
        this.value = data.name;
      }
      this.dialog = true;
      this.$nextTick(this.$refs.text.focus);
    },
    submit() {
      switch (this.type) {
        case "table": {
          const payload = { id: this.data.id, desc: this.value };
          this.$store.dispatch("tables/patch", payload);
          break;
        }
        case "guest": {
          const payload = { id: this.data.id, name: this.value };
          this.$store.dispatch("guests/patch", payload);
          break;
        }
        default: {
          break;
        }
      }
      this.dialog = false;
    }
  }
};
</script>
