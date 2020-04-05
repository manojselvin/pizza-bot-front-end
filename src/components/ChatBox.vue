<template>
    <div class="pa-2" id="chat-container">
      
        <v-row>
            <v-col color offset-lg="4" lg="4" scrollable style="height: 100vh;">
              <v-card flat outlined class="px-6">
                <!-- Welcome Card -->
                <WelcomeCard class="my-4"></WelcomeCard>
                <br>

                <!-- Menu Card -->
                <MenuCard title="Menu - Pizza Bot" :items="menuList"></MenuCard>
                <br>

                <!-- User Details Form -->
                <UserDetailsForm></UserDetailsForm>

                <!-- Order Summary -->
                <OrderDetails></OrderDetails>

                <!-- Track Order -->
                <TrackOrder></TrackOrder>
        
                <!-- Order Complete -->
                <OrderCompleted></OrderCompleted>
              </v-card>
            </v-col>
        </v-row>
    </div>
</template>
<script>
import MenuCard from "@/components/Menu/MenuCard";
import UserDetailsForm from "@/components/Others/UserDetailsForm";
import OrderDetails from "@/components/Order//OrderDetails";
import WelcomeCard from "@/components/Others/WelcomeCard";
import TrackOrder from "@/components/Order/TrackOrder";
import OrderCompleted from "@/components/Order/OrderCompleted";

import { mapState } from "vuex";
import { EventBus } from '@/utils/event-bus.js';
import { Message } from '@/models/Message.js';

export default {
  
  data() {
    return {
      menuList: [
        {text: "Veg Pizza", value: 'veg', icon: 'fa fa-carrot'},
        {text: "Non-Veg Pizza", value: 'non_veg', icon: 'fa fa-drumstick-bite'},
      ],
      isMenuVisible: false,
      isUserFormVisible: false,
      messages: []
    };
  },
  components: {
    // MenuList,
    MenuCard,
    // MenuItem,
    WelcomeCard,
    OrderDetails,
    UserDetailsForm,
    TrackOrder,
    OrderCompleted
  },
  computed: {
    /* Stores */
    ...mapState("users", {
      user: "item",
      loading: "loading",
      mode: "mode",
      snackbar: "snackbar",
      notice: "notice"
    }),
    ...mapState("orders", {
      orders: "items",
      order: "item"
    }),
    ...mapState("products", {
      products: "items"
    })
  },
  methods: {

    
  },
  mounted() {
    EventBus.$on('ADD_TO_CART', ({product}) => {
      let existingProduct = false;
      this.order.items.map(item => {
          if (item._id == product._id) {
              item.quantity += 1;
              existingProduct = true;
          }
          return true;
      });
      if (!existingProduct) {
          product.quantity = 1;
          this.order.items.push(product);
      }
      let totalPrice = 0;

      this.order.items.map(item => {
          let price = item.quantity? item.quantity*item.price : item.price;
          totalPrice += Number(price);
      });

      totalPrice += 5;
      this.$set(this.order, 'totalPrice', totalPrice);

    });
    
    EventBus.$on('NEW_MESSAGE', ({message}) => {
      console.log("Event NEW_MESSAGE", message);
      this.messages.push(message);
    });

    EventBus.$on('ORDER_COMPLETE', ({isVisible}) => {
      console.log(isVisible);

      this.messages = this.messages.map((message) => {
        let msg = new Message();
        msg.text = message;
        msg.by = this.user._id;

        return msg;
      });

      this.$store.dispatch('messages/saveAll', this.messages);
    })

    EventBus.$on('SCROLL_TO_ELEMENT', ({elementSelector, offset = 0}) => {
      this.$vuetify.goTo(elementSelector, {offset});
    })
    EventBus.$emit('SCROLL_TO_ELEMENT', {elementSelector: '#chat-container'});
    // this.$store.dispatch('users/getById', '5e80b7266f50872adffc395a').then(() => {
    //   this.$store.dispatch('orders/getAll', {query: `orderedBy=${this.user._id}`})
    // });
  }
};
</script>

<style scoped>
.scrolling-wrapper {
  /* display: flex;
  flex-wrap: nowrap; */
  overflow-x: auto;

  
}
</style>