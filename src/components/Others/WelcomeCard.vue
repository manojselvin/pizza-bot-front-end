<template>
    <div>
        <v-card
            max-width="600"
            class="mx-auto"
        >
            <v-list-item>
                <v-list-item-avatar color="red"><v-icon color="yellow">local_pizza</v-icon></v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title class="headline">Pizza Bot</v-list-item-title>
                    <v-list-item-subtitle>by Manoj Selvin</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>

            <v-img
            src="/images/welcome.jpg"
            height="194"
            ></v-img>

            <v-card-text>
                Welcome to pizza bot, To start ordering click on get started
            </v-card-text>

            <v-card-actions>
                <v-btn
                    @click="showTrackOrder"
                    text
                    color="primary accent-4" dark
                >
                    <i class="fa fa-map-marker"></i> Track Order
                </v-btn>
                <v-btn
                    @click="showMenu"
                    color="primary accent-4" dark
                >
                    Get Started
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
import { EventBus } from "@/utils/event-bus.js";
export default {
    methods: {
        showMenu () {
            EventBus.$emit('TOGGLE_MENU_CARD', {isVisible: true});
            EventBus.$emit('NEW_MESSAGE', {message: 'Get started'});
            EventBus.$emit('SCROLL_TO_ELEMENT', {elementSelector: '#menu-card'});
        },
        showTrackOrder () {
            EventBus.$emit('SHOW_TRACK_ORDER', {isVisible: true});
            EventBus.$emit('NEW_MESSAGE', {message: 'Track my order'});
        }
    },
    mounted () {
        EventBus.$on('GET_STARTED', () => {
            this.showMenu();
        });
    }
}
</script>

<style>

</style>