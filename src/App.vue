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

        <template v-if="ot_employee.fname != undefined">
          Choheng OT System : {{ `${ot_employee.fname}  ${ot_employee.lname}  `}}
          <div v-if="ot_employee.level==2"> - [ หัวหน้ากะ ]</div>
          <div v-if="ot_employee.level==3"> - [ ผู้ตรวจสอบ ]</div>
          <div v-if="ot_employee.level==4"> - [ ผู้อนุมัติ ]</div>
        </template>

        <template v-else>
          Choheng OT System
        </template>
      </div>

      <!-- <v-spacer></v-spacer> -->

      <!-- <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn> -->
    </v-app-bar>

    <v-content>
      <confirm ref="confirm"></confirm>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>

import Confirm from '@/components/Confirm.vue'
import {mapGetters} from 'vuex'

export default  {


  name: 'App',
  components: {
    Confirm
  },

  data: () => ({

  }),
  computed :{
    ...mapGetters({
       ot_data:      'Ot',
       ot_employee:      'Profile',

      // ot_detail: 'getOtDetail'
    })
  },
  created(){

    
  },
  mouted(){
    this.$root.$confirm = this.$refs.confirm.open
  }
  
};
</script>
