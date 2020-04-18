<template>
<div></div>
    
</template>


<script>
import axios from "axios";

export default {
    data(){
        return {


        }
    },
    created(){
        axios.defaults.baseURL = "https://ot.iotplus.cloud";
    
        this.$liff
        // .init({ liffId: "1653793901-jN5Z5MYZ" }) // LineDev => OTAdmin
        .init({ liffId: "1653837445-0yQDQKKO" })  // Choheng OT
        .then(() => {
            console.log("Init success");
            if (!this.$liff.isLoggedIn()) {
            // set `redirectUri` to redirect the user to a URL other than the front page of your LIFF app.
            this.$liff.login();
            } else {
            console.log(this.$liff.getAccessToken());

            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${this.$liff.getAccessToken()}`;

            console.log("Access Token " + this.$liff.getAccessToken());

            // this.$liff
            //   .getProfile()
            //   .then(profile => {
            //     console.log(profile);
            //   })
            //   .catch(err => console.error(err));

            // this.getOt();

            this.$router.push('/ot');

            }
        })
        .catch(err => {
            console.log(err);
        });
    }


}



</script>