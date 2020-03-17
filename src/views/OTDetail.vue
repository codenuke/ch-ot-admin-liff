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

    <template v-slot:item.employee="{ item }">
      {{ item.pname + item.fname + " " + item.lname}}
    </template>
    
    <template v-slot:item.action="{ item }">
      <v-btn  color="red" class="white--text" @click="deleteOtDetail(item)">ลบ</v-btn>
    </template>
    
    </v-data-table>

    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount" :total-visible="10"></v-pagination>
    </div>

    <v-btn v-if="item" rounded color="blue-grey" class="ma-2 white--text">กลับ</v-btn>
    <!-- <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
      <v-text-field
        :value="itemsPerPage"
        label="Items per page"
        type="number"
        min="-1"
        max="15"
        @input="itemsPerPage = parseInt($event, 10)"
      ></v-text-field>
    </div> -->

    <v-card-actions class="justify-center">
        <v-btn @click="goBack()" color="primary">กลับ</v-btn>
    </v-card-actions>
  </div>
</template>


<script>

  import axios from 'axios'

  export default {
    created(){
      this.loadDetail();
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
          { text: 'พนักงาน', value: 'employee' },
          { text: 'เมนู', value: 'action' },
        ],
        ot_data : [
        ],
      }
    },
    methods : {
        loadDetail(){
          axios.post('/api/line/ot/detail', { id: this.$route.params.id}).then((res)=> {
            console.log(res) 
            this.ot_data = res.data
          }).catch((err)=>{
            console.log(err)
          });
        },
        goBack(){
          this.$router.go(-1)

        },
        deleteOtDetail(item){

          axios.post('/api/line/ot/detail/delete',{id : item.id}).then((res)=>
          {
            console.log(res)
            this.loadDetail()
          });

        },
    }
  }
</script>