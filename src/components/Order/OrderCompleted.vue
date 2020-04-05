<template>
  <div class="mb-10 row" id="order-success" style="height: 100vh;">
    <v-col v-if="dialog">
      <v-card max-width="344">
        <v-card-text class="pb-3">
          <div>Pizza Bot - Invoice</div>
          <v-divider class="pb-2"></v-divider>
          <p class="display-1" color="deep-purple accent-4" dark>
            #{{ trackOrder.id }}
          </p>
          <!-- <p>adjective</p> -->
          <div class="text--primary">
            Thanks for choosing Pizza Bot. We will deliver your order hot &amp; fresh as soon as possible.
            <p class="mb-0 mt-3"><b class="title" style="color: gray;">Order details</b></p>
            <v-divider></v-divider>
            <v-row>
              <v-col>
                Order Id:
              </v-col>
              <v-col>
                <b><span style="color: royalblue;">#{{ trackOrder.id }}</span></b>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                Amount:
              </v-col>
              <v-col>
                <b><span style="color: green;">${{ trackOrder.totalPrice }}</span></b>
              </v-col>
            </v-row>
            <!-- <p class="subtitle-1 mb-0">Amount: <b><span style="color: green;">${{ trackOrder.totalPrice }}1212</span></b></p>
            <p class="subtitle-1">Order ID: <b><span style="color: royalblue;">#{{ trackOrder.id }}PX123</span></b></p> -->
            
          </div>
           You can track the status by clicking the button or using order id later.
        </v-card-text>
       <v-divider></v-divider>
        <v-card-actions>
          <v-btn @click="openTrackOrder" text color="deep-purple accent-4">
            Track Order
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="reOrder" color="primary">
            New Order
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { EventBus } from "@/utils/event-bus.js";

export default {
  data() {
    return {
      message: "",
      dialog: false,
      trackOrder: {}
    };
  },
  computed: {
    ...mapState("orders", {
      order: "item"
    })
  },
  methods: {
    openTrackOrder() {
      EventBus.$emit("SHOW_TRACK_ORDER", {
        isVisible: true,
        orderId: this.order.id
      });
    },
    reOrder () {
      this.dialog = false;
      EventBus.$emit('GET_STARTED');
    }
  },
  mounted() {
    EventBus.$on("ORDER_COMPLETE", ({ isVisible }) => {
      this.trackOrder = this.order;
      this.message = `Thanks for choosing Pizza Bot. We will deliver your order hot & fresh as soon as possible. Order details - Amount: $${this.trackOrder.totalPrice} | Order no. ${this.trackOrder.id} | Track your order by clicking the button`;
      EventBus.$emit("NEW_MESSAGE", { message: this.message });
      this.dialog = isVisible;
    });
  }
};
</script>
