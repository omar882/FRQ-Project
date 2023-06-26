<script setup>
    import { RouterLink, RouterView } from 'vue-router';
</script>

<script>
    import { dataModel } from './dataModel.js'

    export default {
        data() {
            return {
                dataModel
            }
        },
        computed: {
            // a computed getter
            /*
            isLoggedIn() {
                // `this` points to the component instance
                return (dataModel.currentUser == null) ? false : true
            },
            currentView() {
                if (this.isLoggedIn()) {
                    this.$router.push({ path: '/home' })
                } else
                    this.$router.push({ path: '/login' })
            }
            */
        },
        beforeCreate: function () {
            //alert('lll ' + (dataModel.currentUser == null));
            if (dataModel.currentUser == null)
                this.$router.push({ path: '/login' })
            else
                this.$router.push({ path: '/home' })

            //this.computed.test();
            //this.computed.currentView() // Calls the method before page loads
        },
        /*
        mounted: function () {
            //alert(this.computed.isLoggedIn());
            this.currentView() // Calls the method before page loads
        },
        beforeCreate: function () {
            alert(this.isLoggedIn());
            this.currentView(); // Calls the method before page loads
        }
        */
    }

    //    <Login v-if="!isLoggedIn" />
</script>

<template>
    <router-view></router-view>
</template>

