<template>
  <div class="dashboardCard">
    <v-card class="mx-3 mb-5 pa-3">
      <v-card-title>
        <div class="font-weight-light headline">
          <slot name="title"></slot>
        </div>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <slot name="chart"></slot>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-text>
        <div class="font-weight-light">
          <slot name="text"></slot>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>