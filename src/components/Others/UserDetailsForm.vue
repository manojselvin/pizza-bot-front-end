<template>
  <div>
    <v-dialog class="hidden" v-model="isOpen" persistent max-width="600px" scrollable>
      <v-form v-model="isFormValid">
      <v-card>
        <v-card-title>
          <span class="headline">User Profile</span>
          
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" class="py-0">
                <v-text-field v-model="user.name" label="Full Name*" :rules="[rules.required, rules.alpha]"></v-text-field>
              </v-col>
              <v-col cols="12" class="py-0">
                <v-text-field v-model="user.phone" label="Phone*" counter="10" :rules="[rules.required, rules.number, rules.phone]" type="text"></v-text-field>
              </v-col>
              <v-col cols="12" class="py-0">
                <v-text-field v-model="user.email" label="Email*" :rules="[rules.required, rules.email]"></v-text-field>
              </v-col>
              <v-col cols="12" class="py-0">
                <v-textarea
                    counter="150"
                    v-model="user.address"
                    :rules="[rules.required, (value) => value && value.length >= 25 || 'Address has to be minimum 25 chars' ]"
                    outlined
                    label="Address"
                ></v-textarea>
              </v-col>
            </v-row>
            <small>*indicates required field</small>
          </v-container>
          
        </v-card-text>
        <v-card-actions>
            <v-col class="text-right">
                <v-btn color="primary" block class="ma-2" :disabled="!isFormValid" @click="saveDetails">Place Order</v-btn>
                <v-btn color="primary" block class="ma-2" text @click="isOpen = false">Cancel</v-btn>
            </v-col>
        </v-card-actions>
      </v-card>
        </v-form>
    </v-dialog>
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
import { mapState } from "vuex";
import { EventBus } from "@/utils/event-bus.js";
export default {
    data () {
        return {
                snackbar: {
                  visible: false,
                  timeout: 3000,
                  text: ''
                },
                isFormValid: false,
                isOpen: false,
                rules: {
                required: value => !!value || 'Required.',
                phone: value => value && value.length == 10 || 'Max 10 digits',
                alpha: value => {
                    const pattern = /^[a-zA-Z]*$/;
                    return pattern.test(value) || 'Field can contain [a-z] '
                },
                number: value => {
                    const pattern = /^[0-9]*$/;
                    return pattern.test(value) || 'Phone number can contain [0-9] '
                },
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Invalid e-mail.'
                },
            }
        }
    },
    computed: {
      ...mapState("users", {
        user: "item"
      }),
      ...mapState("orders", {
        order: "item"
      })
    },
    methods: {
        saveDetails () {
            EventBus.$emit('NEW_MESSAGE', {message: `save user details`});
            this.isOpen = false;
            if (!this.user._id) {
              this.$store.dispatch('users/save', this.user).then(() => {
                
                setTimeout(() => {
                  this.saveOrder();
                }, 2000);
              });
            } else {
              console.log("else");
              this.saveOrder();
            }
        },
        saveOrder() {
          console.log("order user item", this.user);
          EventBus.$emit('NEW_MESSAGE', {message: `place order`});
          this.order.orderedBy = this.user;
          let $this = this;
          this.$store.dispatch('orders/save', this.order).then(() => {
            setTimeout(() => {
              EventBus.$emit('NEW_MESSAGE', {message: `Order placed`});
              EventBus.$emit('ORDER_COMPLETE', {isVisible: true});
              EventBus.$emit('SCROLL_TO_ELEMENT', {elementSelector: '#order-success'});
              $this.snackbar.text = "Order placed successfully!";
              $this.snackbar.visible = true;
            }, 2000);
            
          });
        }
    },
    mounted () {
      EventBus.$on('SHOW_USER_FORM', ({isVisible}) => {
        this.isOpen = isVisible;
      });
    }
}
</script>

<style>

</style>