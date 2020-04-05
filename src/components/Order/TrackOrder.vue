<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">Track My Order</v-card-title>
                <v-card-text>
                    <p>Enter order id PX123 to track the status</p>
                    <v-col cols="12">
                        <v-text-field label="Order ID" v-model="orderId" hint="eg: PX123"></v-text-field>
                    </v-col>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="dialog = false">Cancel</v-btn>
                <v-btn color="green darken-1" :disabled="!orderId || orderId.length <= 0" text @click="trackOrder">Track</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>
<script>
import { mapState } from "vuex";
import { EventBus } from "@/utils/event-bus.js";

export default {
    data () {
        return {
            dialog: false,
            orderId: 'PX12'
        }
    },
    computed: {
        ...mapState('orders', {
            order: "item",
            orders: "items"
        })
    },
    methods: {
        trackOrder () {
            if (this.orderId) {
                console.log(this.$store.state.orders);
                this.$store.dispatch('orders/getAll', {query: `id=${this.orderId}`}).then(() => {
                    let orders = this.$store.state.orders.items;
                    console.log("orders kleng", orders)
                    if (orders.length > 0) {   
                        let item = orders[0];
                        console.log('if order', item);
                        item.isTrack = true;
                        this.$store.commit('orders/setItem', { item });
                        // setTimeout(() => {
                            console.log("m");
                        EventBus.$emit('SHOW_TRACK_ORDER', {isVisible: false});
                        EventBus.$emit('SHOW_ORDER_SUMMARY', {isVisible: true});
                        EventBus.$emit('NEW_MESSAGE', {message: `Track order with id ${this.orderId}`});
                        // }, 3000);
                            
                    }
                    
                });
            }
        }
    },
    mounted() {
        EventBus.$on('SHOW_TRACK_ORDER', ({isVisible, orderId}) => {
            this.dialog = isVisible;
            this.orderId = orderId;
        });
    }
}
</script>
