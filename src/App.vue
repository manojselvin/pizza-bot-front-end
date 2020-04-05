<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-icon size="32" color="orange">local_pizza</v-icon>&nbsp;
        <h3>Pizza Bot</h3>
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <ChatBox></ChatBox>
    </v-content>
  </v-app>
</template>

<script>
import ChatBox from '@/components/ChatBox';

export default {
  name: 'App',

  components: {
    ChatBox
  },

  data: () => ({
    //
  }),
};
</script>
