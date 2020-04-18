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
      <template v-slot:item.created_at="{ item }">
        {{
          getMomentDateFormat(item.created_at, "YYYY-MM-DD HH:mm:ss").format(
            "DD-MM-YYYY HH:mm"
          )
        }}
      </template>

      <template v-slot:item.name="{ item }">
        {{ item.pname + item.fname + " " + item.lname }}
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip v-if="item.status == 1" color="orange" text-color="white"
          >เปิด</v-chip
        >
        <v-chip v-if="item.status == 2" color="primary" text-color="white"
          >ปิด (รอการตรวจสอบ)</v-chip
        >
        <v-chip v-if="item.status == 3" color="green" text-color="white"
          >ตรวจสอบแล้ว (รอการอนุมัติ)</v-chip
        >

        <v-chip v-if="item.status == 4" color="green" text-color="white"
          >อนุมัติเรียบร้อย</v-chip
        >
      </template>

      <template v-slot:item.shift="{ item }">
        <v-row v-if="item.shift == 0">
          <v-col>
            <v-combobox
              v-model="select"
              :items="shift"
              item-text="name"
              label="กรุณาเลือกกะ"
            ></v-combobox>
          </v-col>
          <v-col>
            <v-btn
              color="success"
              fab
              small
              dark
              @click="updateShift(item, select)"
            >
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-chip v-if="item.shift == 1" color="orange" text-color="white"
          >08:00</v-chip
        >
        <v-chip v-if="item.shift == 2" color="primary" text-color="white"
          >17:00</v-chip
        >
        <v-chip v-if="item.shift == 3" color="green" text-color="white"
          >24:00</v-chip
        >
      </template>

      <template v-slot:item.action="{ item }">
        <router-link :to="{ path: 'ot-detail/' + item.id }">
          <v-btn v-if="item" rounded color="blue-grey" class="ma-2 white--text"
            >รายละเอียดพนักงาน</v-btn
          >
        </router-link>

        <!-- commander -->
        <template v-if="ot_employee.level >= 2">
          <router-link :to="{ path: 'signpad/close/' + item.id }">
            <v-btn v-if="item.status == 1" rounded color="primary" class="ma-2"
              >ปิด OT</v-btn
            >
          </router-link>
        </template>

        <!-- Waiting for approve 1 -->
        <template v-if="ot_employee.level >= 3">
          <router-link :to="{ path: 'signpad/approve/' + item.id }">
            <v-btn v-if="item.status == 2" rounded color="primary" class="ma-2">
              ยืนยันตรวจสอบข้อมูล
            </v-btn>
          </router-link>
        </template>

        <!-- Waiting Final Confirm  -->
        <template v-if="ot_employee.level >= 4">
          <router-link :to="{ path: 'signpad/confirm/' + item.id }">
            <v-btn v-if="item.status == 3" rounded color="primary" class="ma-2"
              >อนุมัติ</v-btn
            >
          </router-link>
        </template>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination
        v-model="page"
        :length="pageCount"
        :total-visible="10"
      ></v-pagination>
    </div>

    <v-snackbar v-model="snackbar" :timeout="timeout" :color="color" top="true">
      {{ text }}
      <v-btn color="white" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import moment from "moment";
import {mapActions,mapGetters} from 'vuex'

export default {
  created() {

  },
  mounted() {
    console.log("action get ot")
    this.getOt();

    console.log(this.ot)


  },

  data() {
    return {
      snackbar: false,
      text: "",
      color: "success",
      timeout: 5000,
      page: 1,
      pageCount: 0,
      itemsPerPage: 15,
      headers: [
        {
          text: "วันที่",
          align: "start",
          sortable: false,
          value: "created_at"
        },
        { text: "รอบกะ", value: "shift" },
        { text: "หัวหน้ากะ", value: "name" },
        { text: "สถานะ", value: "status" },
        { text: "เมนู", value: "action" }
      ],
      // ot_data: [],
      shift: [
        { id: 0, name: "กรุณาเลือกกะทำงาน" },
        { id: 1, name: "08:00" },
        { id: 2, name: "17:00" },
        { id: 3, name: "24:00" }
      ]
    };
  },
  computed: {
    ...mapGetters({
       ot_data:      'Ot',
       ot_employee:      'Profile',

      // ot_detail: 'getOtDetail'
    })
    // ot_data : function(){
    //   return this.$store.state.Ot
    // }
  },
  methods: {
    ...mapActions({
      getOt: 'getOt',
      // setName: 'Person/setName'
    }),
    // getOt() {
    //   axios
    //     .post("/api/line/ot")
    //     .then(res => {
    //       console.log(res);
    //       this.ot_data = res.data.ot;
    //       this.ot_employee = res.data.employee;
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
    getMomentDateFormat(mdate, format) {
      var dtm = moment(mdate, format);
      return dtm;
    },
    updateShift(item, shift) {
      console.log(item.id);
      console.log(shift.id);

      axios
        .post("/api/line/ot/shift", {
          ot: item.id,
          shift: shift.id
        })
        .then(res => {
          item.shift = shift.id;
          this.showSnack("บันทึกสำเร็จ", "success");
          // Show modal
          console.log(res);
        })
        .catch(err => {
          console.log(err);
          this.showSnack("บันทึกไม่สำเร็จ", "error");
        });
    },
    showSnack(txt, color) {
      this.text = txt;
      this.color = color;
      this.snackbar = true;
    }
  }
};
</script>
