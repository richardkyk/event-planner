<template>
  <v-dialog persistent v-model="dialog" max-width="300px">
    <v-form>
      <v-card>
        <v-text-field
          class="mx-3"
          ref="text"
          v-model="value"
          v-on:keyup.enter="submit"
        ></v-text-field>

        <v-card-actions>
          <v-btn color="normal" @click.stop="dialog = false">Close</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="submit">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      value: "",
      data: null,
    };
  },
  methods: {
    open(data) {
      this.data = data;

      this.value = data.name;

      this.dialog = true;
      this.$nextTick(() => this.$refs.text.focus());
    },
    submit() {
      const payload = { id: this.data.id, name: this.value.trim() };
      this.$store.dispatch("guests/patch", payload);
      this.dialog = false;
    },
  },
};
</script>
