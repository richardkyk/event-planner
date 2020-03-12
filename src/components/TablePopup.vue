<template>
  <v-dialog persistent v-model="dialog" max-width="300px">
    <v-form ref="form">
      <v-card>
        <v-text-field class="mx-3" ref="text" v-model="value" v-on:keyup.enter="submit"></v-text-field>

        <v-text-field :rules="inputRules" class="mx-3" ref="tableNum" v-model="tableNum"></v-text-field>

        <v-switch class="mx-3" v-model="isBridalTable" :label="`Bridal Table?`"></v-switch>
        <v-card-actions>
          <v-btn color="error" @click="deleteTable">Delete</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="normal" @click.stop="dialog = false">Close</v-btn>
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
      tableNum: null,
      isBridalTable: null,
      inputRules: [
        v =>
          Number.isInteger(parseInt(v)) || "Please select a valid table number"
      ]
    };
  },
  methods: {
    deleteTable() {
      if (this.data.guests.length == 0) {
        if (confirm("Are you sure you want to delete this table?")) {
          this.$store.dispatch("tables/delete", this.data.id);
          this.dialog = false;
        }
      } else {
        confirm("Please remove all guests first");
      }
    },
    open(data) {
      this.data = data;
      this.value = data.desc;
      this.tableNum = data.tableNum;
      this.isBridalTable = data.isBridalTable;

      this.dialog = true;
      this.$nextTick(() => this.$refs.text.focus());
    },
    submit() {
      if (this.$refs.form.validate()) {
        const tablePayload = {
          id: this.data.id,
          desc: this.value,
          isBridalTable: this.isBridalTable
        };
        if (this.tableNum !== this.data.tableNum) {
          this.data.guests.forEach(guestId => {
            const payload = {
              id: guestId,
              tableNum: Math.abs(parseInt(this.tableNum))
            };
            this.$store.dispatch("guests/patch", payload);
          });

          tablePayload.tableNum = Math.abs(parseInt(this.tableNum));
        }

        this.$store.dispatch("tables/patch", tablePayload);
        console.log(tablePayload);

        this.dialog = false;
      }
    }
  }
};
</script>
