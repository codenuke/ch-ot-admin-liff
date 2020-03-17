<template>

<div>
    <v-data-table
      :headers="headers"
      :items="ot_data"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      class="elevation-1"
      @page-count="pageCount = $event"
    >
    
    <template v-slot:item.name="{ item }">
      {{ item.pname +  item.fname + " " + item.lname}}
    </template>

    <template v-slot:item.status="{ item }">
      <v-chip v-if="item.status==1" color="orange" text-color="white">เปิด</v-chip>
      <v-chip v-if="item.status==2" color="primary" text-color="white">ปิด</v-chip>
      <v-chip v-if="item.status==3" color="green"  text-color="white">ยืนยันข้อมูลเรียบร้อย</v-chip>
        
    </template>

    <template v-slot:item.shift="{ item }">
      <v-chip v-if="item.shift==1" color="orange" text-color="white">08:00</v-chip>
      <v-chip v-if="item.shift==2" color="primary" text-color="white">17:00</v-chip>
      <v-chip v-if="item.shift==3" color="green"  text-color="white">24:00</v-chip>
        
    </template>

    <template v-slot:item.action="{ item }">
      <router-link :to="{ path: 'ot-detail/' + item.id}">
        <v-btn v-if="item" rounded color="blue-grey" class="ma-2 white--text">รายละเอียดพนักงาน</v-btn>
      </router-link>

      <router-link :to="{ path: 'signpad/close/' + item.id}">
      <v-btn v-if="item.status == 1 " rounded color="primary" class="ma-2">ปิด OT</v-btn>
      </router-link>

      <router-link :to="{ path: 'signpad/approve/' + item.id}">
      <v-btn v-if="item.status == 2" rounded color="primary" class="ma-2">ยืนยันความถูกต้อง OT</v-btn>
      </router-link>
    </template>
    
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount" :total-visible="10"></v-pagination>
    </div>
  </div>
</template>


<script>
  import axios from 'axios'

  export default {
    created(){
      axios.post('/api/line/ot').then((res)=> {
        console.log(res) 
        this.ot_data = res.data
      }).catch((err)=>{
        console.log(err)
      });


    },
    data () {
      return {
        page: 1,
        pageCount: 0,
        itemsPerPage: 15,
        headers: [
          {
            text: 'วันที่',
            align: 'start',
            sortable: false,
            value: 'created_at',
          },
          { text: 'รอบกะ', value: 'shift' },
          { text: 'หัวหน้ากะ', value: 'name' },
          { text: 'สถานะ', value: 'status' },
          { text: 'เมนู', value: 'action' },
        ],
        ot_data: [ ],
      }
    },
  }
</script>