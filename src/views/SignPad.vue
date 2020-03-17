<template>
  <div id="app">

    <v-card-actions class="justify-center">
    <v-chip
      class="ma-2"
      color="teal"
      text-color="white"
      v-if="act=='close'"
    >
      ปิด OT

    </v-chip>

    <v-chip
      class="ma-2"
      color="teal"
      text-color="white"
      v-if="act=='approve'"
    >
      ยืนยันความถูกต้อง OT

    </v-chip>

    </v-card-actions>

    <v-card-actions class="justify-center">
    <VueSignaturePad
      width="600px"
      height="400px"
      ref="signaturePad"
    />
    </v-card-actions>
    <v-card-actions class="justify-center">

        <v-btn @click="save" color="primary">บันทึก</v-btn>
        <v-btn @click="undo" color="primary">Undo</v-btn>
        <v-btn @click="cancel" color="red" class="white--text">ยกเลิก</v-btn>

    </v-card-actions>

  </div>
</template>
<script>

import Vue from 'vue';
import VueSignaturePad from 'vue-signature-pad';
import axios from 'axios'
 
Vue.use(VueSignaturePad);

  export default {
    name: 'MySignaturePad',
    data() {
      return {
        act: "",
        id: 0,

      }
    },
    created(){
      this.act = this.$route.params.action
      this.id = this.$route.params.id

    },
    methods: {
      undo() {
        this.$refs.signaturePad.undoSignature();
      },
      save() {
        const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
        console.log(isEmpty);
        console.log(data);

        // this.closeOT()
        // this.$router.push({ path: '/ot'})
        if (this.act == "close"){
          this.closeOt(data)
        }else{
          this.approveOt(data)
        }
      },
      cancel(){
        this.$router.push({ path: '/ot'})
      },

      closeOt(sign) {
        axios.post('/api/line/ot/close',{ id: this.id , sign : sign }).then((res)=>{
          console.log(res)
          this.$router.push({ path: '/ot'})

        })
      },
      approveOt(sign) {
        axios.post('/api/line/ot/approve' , { id: this.id , sign: sign}).then((res)=>{
          console.log(res)
          this.$router.push({ path: '/ot'})
        })

      }
    }
  }
</script>
