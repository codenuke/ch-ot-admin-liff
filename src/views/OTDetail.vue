<template>
  <div v-if="ot_loaded == true">
    <v-data-table
      :headers="headers"
      :items="ot_detail"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      class="elevation-1"
      @page-count="pageCount = $event"
    >
      <template v-slot:item.employee="{ item }">
        {{ item.pname + item.fname + " " + item.lname }}
      </template>

      <template v-slot:item.created_at="{ item }">
          {{
          getMomentDateFormat(item.updated_at, "YYYY-MM-DD HH:mm:ss").format( "DD-MM-YYYY HH:mm")
          }}
      </template>


      <template v-slot:item.updated_at="{ item }">
        <template v-if="item.created_at == item.updated_at">-</template>
        <template v-else>
          {{ getMomentDateFormat(item.updated_at, "YYYY-MM-DD HH:mm:ss").format( "DD-MM-YYYY HH:mm") }}
        </template>
      </template>

      <template v-slot:item.hour="{ item }">
        <template v-if="item.ot_hour == 0 && item.flag != -1">
          -
        </template>
        <template v-if="item.ot_hour != 0 && item.flag != -1">
          {{ item.ot_hour }}
          <v-chip v-if="item.ot_cause == 1" class="ma-2" color="primary"
            >เหมา</v-chip
          >
          <v-chip v-if="item.ot_cause == 2" class="ma-2" color="primary"
            >เจรจาพิเศษ</v-chip
          >

          <v-chip v-if="item.off_day == 1" class="ma-2" color="error"
            >วันหยุด</v-chip
          >
        </template>

        <template v-if="item.flag == -1">
          <v-row>
            <v-col>
              <v-text-field
                label="แก้ไขชั่วโมงทำงาน"
                small
                dense
                outlined
                v-model="item.ot_hour"
                class="ma-2"
              ></v-text-field>
            </v-col>

            <v-col>
              <v-select
                v-model="item.ot_cause"
                :items="ot_cause"
                item-text="value"
                item-value="key"
                label="เหตุผลการแก้ไข"
                outlined
                dense
                class="ma-2"
              ></v-select>
            </v-col>

            <v-col>
              <v-btn
                fab
                small
                dark
                color="primary"
                class="ma-2"
                v-if="
                  item.ot_cause != 0 &&
                    item.ot_cause != null &&
                    item.ot_hour != 0
                "
                @click="changeWorkHour(item)"
              >
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </template>

      <template v-slot:item.action="{ item }">
        <v-row>
          <v-col v-if="ot_employee.level == 2">
            <v-btn
              v-if="ot.status == 1"
              color="primary"
              small
              class="white--text"
              @click="item.flag = -1"
            >
              แก้ไข
            </v-btn>
            <v-btn
              v-if="ot.status == 1"
              color="red"
              small
              class="white--text"
              @click="deleteOtDetail(item)"
            >
              ลบ
            </v-btn>
          </v-col>
          <v-col v-if="ot_employee.level >= 3 && ot.status < 4">
            <v-btn
              color="primary"
              small
              class="white--text"
              @click="item.flag = -1"
            >
              แก้ไข
            </v-btn>
            <v-btn
              color="red"
              small
              class="white--text"
              @click="deleteOtDetail(item)"
            >
              ลบ
            </v-btn>
          </v-col>
        </v-row>
      </template>
    </v-data-table>

    <div class="text-center pt-2">
      <v-pagination
        v-model="page"
        :length="pageCount"
        :total-visible="10"
      ></v-pagination>
    </div>

    <v-btn v-if="item" rounded color="blue-grey" class="ma-2 white--text"
      >กลับ</v-btn
    >
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
    <v-snackbar v-model="snackbar" :timeout="timeout" :color="color" top="true">
      {{ text }}
      <v-btn color="white" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>

    <v-dialog
      v-model="dialog"
      :max-width="options.width"
      :style="{ zIndex: options.zIndex }"
      @keydown.esc="cancel"
    >
      <v-card>
        <v-toolbar dark :color="options.color" dense flat>
          <v-toolbar-title class="white--text">{{ title }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text v-show="!!message" class="pa-4">{{ message }}</v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" text @click.native="agree"
            >ยืนยัน</v-btn
          >
          <v-btn color="grey" text @click.native="cancel">ยกเลิก</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <div v-else>
    กำลังโหลดข้อมูล...
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import axios from "axios";
import moment from "moment";
import {  mapState } from "vuex"

export default {
  created() {
     axios.defaults.baseURL = "https://tmr.choheng.com";
        axios.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${this.line_access_token}`
    this.loadDetail();
  },
  computed : {
    ...mapState({
            line_access_token: "line"
        })
  },
  data() {
    return {
      ot_loaded: false,
      snackbar: false,
      text: "",
      color: "success",
      timeout: 5000,
      page: 1,
      pageCount: 0,
      itemsPerPage: 15,
      headers: [
        { text: "ลำดับ", value: "id" , sortable :false },
        {
          text: "เข้างาน",
          align: "start",
          sortable: false,
          value: "created_at",
        },
        {
          text: "ออกงาน",
          align: "start",
          sortable: false,
          value: "updated_at",
        },
        { text: "ชั่วโมงทำงาน", value: "hour" , sortable :false },
        { text: "สถานที่", value: "department" , sortable :false },
        { text: "รหัสพนักงาน", value: "code" , sortable :false },
        { text: "พนักงาน", value: "employee" , sortable :false },
        { text: "เมนู", value: "action" , sortable :false },
      ],
      ot_cause: [
        { key: 1, value: "เหมา" },
        { key: 2, value: "เจรจาพิเศษ" },
      ],
      ot_detail: [],
      ot_employee: [],
      ot: [],
      dialog: false,
      resolve: null,
      reject: null,
      message: null,
      title: null,
      options: {
        color: "primary",
        width: 290,
        zIndex: 200,
      },
    };
  },
  methods: {
    loadDetail() {
      axios
        .post("/api/line/ot/detail", { id: this.$route.params.id })
        .then((res) => {
          // console.log(res);
          this.ot_employee = res.data.employee;
          this.ot = res.data.ot;
          this.ot_detail = res.data.detail;
          this.ot_loaded = true;

          let i = 1 
          this.ot_detail.map(n => {
            n['id'] = i
            i++
          })
        })
        .catch((err) => {
          // console.log(err);
        });
    },
    goBack() {
      this.$router.go(-1);
    },
    async deleteOtDetail(item) {
      if (
        await this.open(
          "ยืนยันการลบข้อมูลการทำงาน",
          item.code + " : " + item.pname + item.fname + " " + item.lname,
          {
            color: "red",
          }
        )
      ) {
        // console.log("confirm");
        axios
          .post("/api/line/ot/detail/delete", { id: item.id })
          .then((res) => {
            // console.log(res);
            this.showSnack("ลบการทำงานสำเร็จ", "success");
            this.ot_detail = this.arrayRemove(this.ot_detail, item);
            // this.ot_detail.
            // this.loadDetail();
          })
          .catch((err) => {
            this.showSnack("ลบการทำงานผิดพลาด", "error");
            // console.log(err);
          });
      } else {
        // console.log("cancel");
      }
    },
    getWorkHour(item) {
      // console.log(moment(item.created_at, "YYYY-MM-DD HH:mm:ss"));

      return moment(item.created_at);
    },
    changeWorkHour(item) {
      axios
        .post("/api/line/ot/detail/changehour", {
          id: item.id,
          hour: item.ot_hour,
          cause: item.ot_cause,
        })
        .then((res) => {
          // console.log(res);
          item.flag = 1;
          this.showSnack("เปลี่ยนชั่วโมงทำงานสำเร็จ", "success");
        })
        .catch((err) => {
          this.showSnack("เปลี่ยนชั่วโมงทำงานผิดพลาด", "error");
          // console.log(err);
        });
    },
    arrayRemove(arr, value) {
      return arr.filter(function(ele) {
        return ele != value;
      });
    },
    showSnack(txt, color) {
      this.text = txt;
      this.color = color;
      this.snackbar = true;
    },
    open(title, message, options) {
      this.dialog = true;
      this.title = title;
      this.message = message;
      this.options = Object.assign(this.options, options);
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    agree() {
      this.resolve(true);
      this.dialog = false;
    },
    cancel() {
      this.resolve(false);
      this.dialog = false;
    },
    getMomentDateFormat(mdate, format) {
            var dtm = moment(mdate, format);
            return dtm;
    },
  },
};
</script>
