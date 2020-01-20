<template>
  <svg>
    <circle @mousedown="mouseDown" :cx="x" :cy="y" r="75" fill="#3f51b5" />
    <text
      class="svgText"
      :x="x"
      :y="y-30"
      font-size="30px"
      text-anchor="middle"
      fill="white"
    >{{table.tableNum}}</text>
    <text
      class="svgText"
      :x="x"
      :y="y"
      font-size="15px"
      text-anchor="middle"
      fill="white"
    >{{table.desc}}</text>
    <text
      class="svgText"
      :x="x"
      :y="y+30"
      font-size="15px"
      text-anchor="middle"
      fill="white"
    >Guests: {{table.guests.length}}</text>
  </svg>
</template>

<script>
export default {
  props: ["table"],
  data() {
    return {
      id: this.table.id,
      tableNum: this.table.tableNum,
      x: this.table.coords.x,
      y: this.table.coords.y,
      coords: {
        x: 0,
        y: 0
      }
    };
  },
  methods: {
    mouseDown(e) {
      // We take note of where we clicked on the page
      this.coords = { x: e.clientX, y: e.clientY };

      // Then we add listeners to track the movement
      document.addEventListener("mousemove", this.mouseMove);
      document.addEventListener("mouseup", this.mouseUp);
    },
    mouseMove(e) {
      // We calculate the relative difference
      // so that it doesn't matter where on the circle you click
      const xDiff = this.coords.x - e.clientX;
      const yDiff = this.coords.y - e.clientY;

      // The coords is essentially the top left hand corner reference
      // Since the canvas is effectively infinite, we are panning and then subtracting
      this.coords.x = e.clientX;
      this.coords.y = e.clientY;
      this.x = this.x - xDiff;
      this.y = this.y - yDiff;
    },
    mouseUp() {
      const payload = {
        id: this.id,
        coords: { x: this.x, y: this.y }
      };
      this.$store.dispatch("tables/patch", payload);
      // Then we remove the event listeners
      document.removeEventListener("mousemove", this.mouseMove);
      document.removeEventListener("mouseup", this.mouseUp);
    }
  }
};
</script>


<style>
.svgText {
  pointer-events: none;
}
</style>