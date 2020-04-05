<template>
    <div  class="mx-4" style="flex: 0 0 auto;">
        <v-card
            class="mx-auto my-12"
            max-width="374"
        >
            <v-img
            height="250"
            :src="`/data/products/images/${product.foodType}/${product.imageUrl}`"
            ></v-img>

            <v-card-title class="flex flex-column">
                <v-col md="12">
                  {{ product.name }}
                </v-col>
                <v-col md="12">
                  $ <span style="color: green;">{{ product.price }}</span>
                </v-col>
              
              
              <!-- {{ product.name }} <v-spacer></v-spacer>
            <p style="color: green;">$ <span>{{ product.price }}</span></p> -->
            </v-card-title>

            <v-card-text>
                <div v-text="product.description"></div>
            </v-card-text>

            <v-divider class="mx-4"></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
            <v-btn
                color="primary"
                text
                @click="addToCart(product)"
            >
                Add to Cart <v-icon>add_shopping_cart</v-icon>
            </v-btn>
            </v-card-actions>
        </v-card>

        <!-- Product added notification -->
        <v-snackbar
          v-model="snackbar.visible"
          :timeout="snackbar.timeout"
        >
          {{ snackbar.text }}
          <v-btn
            color="blue"
            text
            @click="snackbar.visible = false"
          >
            Close
          </v-btn>
        </v-snackbar>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import { EventBus } from "@/utils/event-bus.js";

export default {
  data() {
    return {
      textSnackBar: '',
      snackbar: {
        visible: false,
        timeout: 2500,
        text: ''
      }
    };
  },
  props: ['product'],
  components: {
    
  },
  computed: {
    ...mapState("orders", {
        order: "item"
    })
  },
  methods: {
    addToCart (product) {
      EventBus.$emit('NEW_MESSAGE', {message: `add ${product.name} to cart`});
      EventBus.$emit('ADD_TO_CART', {product});
      EventBus.$emit('SCROLL_TO_ELEMENT', {elementSelector: '#menu-card', offset: -220});
      this.snackbar.text = `${product.name} added to cart!`;
      this.snackbar.visible = true;
  }
  },
  mounted() {
    // this.$store.dispatch('orders/getAll');
  }
};
</script>