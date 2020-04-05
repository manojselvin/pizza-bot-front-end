<template>
  <div class="row" style="height: 115vh">
    <v-col>
      <div id="menu-card">
        <template v-if="isMenuCardVisible">
          <v-card class="mx-auto" max-width="600" tile>
            <p class="text-center subtitle-1">
              Please choose your food preference<br />
              <i class="fa fa-arrow-down"></i>
            </p>
            <v-list>
              <v-subheader v-if="title">{{ title }}</v-subheader>
              <v-list-item-group color="primary">
                <template>
                  <v-list-item
                    v-for="(item, i) in items"
                    :key="i"
                    @click="getProducts(item.value)"
                  >
                    <v-list-item-icon>
                      <v-icon :class="item.icon"></v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.text"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-list-item-group>
            </v-list>
          </v-card>
        </template>

        <template v-else-if="this.foodType">
          <p id="menu-list" class="text-center subtitle-1">
            Chosen {{ foodType.split("_").join(" ") }} food
          </p>

          <!-- Menu Item Card -->
          <MenuList>
            <MenuItem
              :product="product"
              v-for="product in products"
              :key="`menu-item-${product.name}`"
            ></MenuItem>
          </MenuList>
          <div id="menu-options" v-if="foodType">
            <v-btn class="my-3" @click="showMenu" block
              >Show menu <i class="fa fa-list"> </i
            ></v-btn>
            <v-btn
              class="my-3"
              color="primary"
              block
              v-if="order.items.length > 0"
              @click="showOrderSummary"
              >Checkout <i class="fa fa-arrow-right"></i
            ></v-btn>
          </div>
        </template>
      </div>
    </v-col>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { EventBus } from "@/utils/event-bus.js";
import MenuList from "@/components/Menu/MenuList";
import MenuItem from "@/components/Menu/MenuItem";
// import * as easings from 'vuetify/es5/services/goto/easing-patterns';

export default {
  data() {
    return {
      foodType: "",
      isMenuCardVisible: false
    };
  },
  components: {
    MenuList,
    MenuItem
  },
  props: ["title", "items", "show", "isMenuOptionDisabled"],
  computed: {
    /* Stores */
    ...mapState("products", {
      products: "items",
      pagination: "pagination",
      loading: "loading",
      mode: "mode",
      snackbar: "snackbar",
      notice: "notice"
    }),
    ...mapState("orders", {
      order: "item"
    })
  },
  methods: {
    getProducts(productType) {
      EventBus.$emit("NEW_MESSAGE", { message: `choose ${productType}` });
      this.foodType = productType;
      this.isMenuCardVisible = false;
      this.$store.dispatch("products/getAll", {
        query: `foodType=${productType}`
      });
      setTimeout(() => {
        EventBus.$emit("SCROLL_TO_ELEMENT", { elementSelector: "#menu-list" });
      }, 300);
    },
    showMenu() {
      EventBus.$emit("TOGGLE_MENU_CARD", { isVisible: true });
      EventBus.$emit("NEW_MESSAGE", { message: `Show menu` });
    },
    showOrderSummary() {
      EventBus.$emit("NEW_MESSAGE", { message: `Checkout` });
      EventBus.$emit("SHOW_ORDER_SUMMARY", { isVisible: true });
    }
  },
  mounted() {
    EventBus.$on("TOGGLE_MENU_CARD", ({ isVisible }) => {
      // console.log(data.isVisible);
      this.isMenuCardVisible = isVisible;
    });
  }
};
</script>
