<template>
    <v-app>
        <v-app-bar
            app
            color="primary"
            dark
        >
            <div class="d-flex align-center">
                <!-- <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        /> -->

                <template v-if="employee.fname != undefined">
                    Choheng OT System : {{ `${employee.fname}  ${employee.lname}  `}}
                    <div v-if="employee.level==2"> - [ หัวหน้ากะ ]</div>
                    <div v-if="employee.level==3"> - [ ผู้ตรวจสอบ ]</div>
                    <div v-if="employee.level==4"> - [ ผู้อนุมัติ ]</div>
                </template>

                <template v-else>
                    Choheng OT System
                </template>
            </div>

            <v-spacer></v-spacer>

            <v-btn
                text
                @click="logout"
            >
                <span class="mr-2">Logout</span>
                <v-icon>mdi-lock</v-icon>
            </v-btn>
        </v-app-bar>

        <v-content>
            <confirm ref="confirm"></confirm>
            <router-view></router-view>
        </v-content>
    </v-app>
</template>

<script>
/* eslint-disable no-unused-vars */
import Confirm from '@/components/Confirm.vue'
import { mapActions, mapState } from 'vuex'
import axios from "axios";

export default {


    name: 'App',
    components: {
        Confirm
    },

    data: () => ({

    }),
    computed: {
        ...mapState({
            employee: 'employee',
        })
    },
    created() {
        axios.defaults.baseURL = "https://tmr.choheng.com";

        // console.log("app creeated")
        this.$liff
            // .init({ liffId: "1653793901-jN5Z5MYZ" }) // LineDev => OTAdmin
            .init({ liffId: "1653837445-0yQDQKKO" }) // Choheng OT
            .then(() => {
                if (!this.$liff.isLoggedIn()) {
                    this.$liff.login();
                } else {
                    axios.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${this.$liff.getAccessToken()}`;

                    // console.log("liff init settoken")
                    this.setLineToken(this.$liff.getAccessToken());

                    this.getOt();


                    // Get OT

                    // this.$router.push("/list");
                }
            })
            .catch(err => {
                // this.$route.push("/error");
                // console.log(err);
            });


    },
    mouted() {
        this.$root.$confirm = this.$refs.confirm.open
    },
    methods: {
        ...mapActions({
            setLineToken: "setLineToken",
            clearState: "clearState",
            getOt: "getOt"
        }),
        logout() {
            this.clearState();
            this.$liff.logout();
            window.location.reload();
        }
    }

};
</script>
