<template>
    <div></div>
</template>

<script  lang="ts">
import axios from "axios";
import { mapActions } from "vuex";

export default {
    data() {
        return {};
    },
    created() {
        axios.defaults.baseURL = "https://tmr.choheng.com";

        // this.$liff
        //     // .init({ liffId: "1653793901-jN5Z5MYZ" }) // LineDev => OTAdmin
        //     .init({ liffId: "1653837445-0yQDQKKO" }) // Choheng OT
        //     .then(() => {
        //         if (!this.$liff.isLoggedIn()) {
        //             this.$liff.login();
        //         } else {
        //             axios.defaults.headers.common[
        //                 "Authorization"
        //             ] = `Bearer ${this.$liff.getAccessToken()}`;

        //             this.setLineToken(this.$liff.getAccessToken());

        //             this.$router.push("/list");
        //         }
        //     })
        //     .catch(err => {
        //         // this.$route.push("/error");
        //         console.log(err);
        //     });
    },
    methods: {
        ...mapActions({
            setLineToken: "setLineToken"
            // setName: 'Person/setName'
        })
    }
};
</script>
