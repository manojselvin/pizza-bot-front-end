<template>
  <div>
    <v-dialog v-model="dialog" persistent scrollable>
      <v-card>
        <v-card-title class="justify-center">
          <span class="headline">Order Details</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-list>
                <v-list-item class="mx-auto">
                    <v-list-item-content>
                        <v-alert v-if="order.created_at && isPastTime(order.created_at)" type="success" icon="mdi-check-circle">
                            Your Order delivered!
                        </v-alert>
                        <v-alert type="info" icon="mdi-clock" v-else-if="order.id">
                            Your Order will be delivered in <b>{{ diffTime(order.created_at) }} minutes</b>
                        </v-alert>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item v-for="item in order.items" :key="`order-item-${item._id}`">
                    <v-list-item-content>
                        <v-row>
                            <v-col>
                                {{ item.name }}
                            </v-col>
                            <v-col class="text-right">
                                x{{ item.quantity }}
                            </v-col>
                            <v-col class="text-right">
                                ${{item.quantity*item.price}}
                            </v-col>
                        </v-row>
                    </v-list-item-content>
                </v-list-item>
                <!-- <v-list-item>
                    <v-list-item-content>
                        <v-row>
                            <v-col>
                                Double Cheese Margherita 
                            </v-col>
                            <v-col class="text-right">
                                x1
                            </v-col>
                            <v-col class="text-right">
                                $15.00
                            </v-col>
                        </v-row>
                    </v-list-item-content>
                </v-list-item> -->
                <v-divider></v-divider>
                <v-list-item>
                    <v-list-item-content>
                        <v-row>
                            <v-col>
                                Sub-total
                            </v-col>
                            <v-col>
                                
                            </v-col>
                            <v-col class="text-right">
                                ${{ order.totalPrice - 5 }}
                            </v-col>
                        </v-row>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        <v-row>
                            <v-col>
                                Tax (0.00%)
                            </v-col>
                            <v-col>
                                
                            </v-col>
                            <v-col class="text-right">
                                $0.00
                            </v-col>
                        </v-row>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        <v-row>
                            <v-col>
                                Delivery Fee
                            </v-col>
                            <v-col>
                                
                            </v-col>
                            <v-col class="text-right">
                                $5.00
                            </v-col>
                        </v-row>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item class="font-weight-bold">
                    <v-list-item-content>
                        <v-row>
                            <v-col>
                                Total
                            </v-col>
                            <v-col>
                                
                            </v-col>
                            <v-col class="text-right">
                                ${{ order.totalPrice }}
                            </v-col>
                        </v-row>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
          </v-container>
        </v-card-text>
        <v-card-actions>
            <v-col class="text-right">
                <v-btn color="primary" class="mx-2" text @click="closeDialog">Cancel</v-btn>
                <v-btn color="primary" class="mx-2" v-if="!order.isTrack" @click="showUserForm">Continue</v-btn>
            </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EventBus } from '@/utils/event-bus.js';

import { Order } from '@/models/Order.js';

export default {
    data () {
        return {
            dialog: false
        }
    },
    computed: {
        ...mapState("orders", {
            order: "item"
        }),
    },
    methods: {
        showUserForm () {
            EventBus.$emit('SHOW_ORDER_SUMMARY', {isVisible: false});
            EventBus.$emit('SHOW_USER_FORM', {isVisible: true});
            EventBus.$emit('NEW_MESSAGE', {message: `fill user details`});
        },
        closeDialog () {
            this.dialog = false;
            if (this.order.isTrack) {
                let item = new Order();
                this.$store.commit('orders/setItem', {item});
            }
        },
        formatTimeTo30mins(orderedDate) {
            orderedDate = new Date(orderedDate);
            return orderedDate.setTime(orderedDate.getTime() + (30 * 60 * 1000));
        }, 
        isPastTime (orderedDate) {
            orderedDate = this.formatTimeTo30mins(orderedDate);
            return orderedDate - new Date() <= 0;
        }, 
        diffTime (orderedDate) {
            orderedDate = this.formatTimeTo30mins(orderedDate)
            let diff = Math.abs(orderedDate - new Date());
            return Math.floor((diff/1000)/60);
        }
    },
    mounted() {
        EventBus.$on('SHOW_ORDER_SUMMARY', ({isVisible}) => {
            this.dialog = isVisible;
        });
        EventBus.$emit('NEW_MESSAGE', {message: `Show order details`});
        EventBus.$emit('SHOW_TRACK_ORDER', {isVisible: false, orderId: null});
    }
};
</script>

<style></style>
