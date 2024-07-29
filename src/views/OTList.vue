<template>
    <div>

        <v-row>
            <v-col
                cols="6"
                sm="2"
                md="2"
            >
                <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                        <v-text-field
                            v-model="date"
                            label="เลือกวันที่"
                            readonly
                            v-on="on"
                            dense
                            outlined
                        ></v-text-field>
                    </template>
                    <v-date-picker
                        v-model="date"
                        @input="menu2 = false"
                    ></v-date-picker>
                </v-menu>
            </v-col>

            <v-col
                class="d-flex"
                cols="6"
                sm="2"
            >
                <v-select
                    :items="ot_type"
                    label="สถานะ OT"
                    dense
                    outlined
                    v-model="ot_status"
                ></v-select>
            </v-col>
            <v-col>
                <v-btn
                    rounded
                    color="primary"
                    dark
                    @click="searchOt()"
                >ค้นหา</v-btn>
                <v-btn
                    rounded
                    color="primary"
                    dark
                    @click="allOt()"
                >ทั้งหมด</v-btn>
            </v-col>
        </v-row>

        <v-data-table
            :headers="headers"
            :items="ot_item"
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
                <v-chip
                    v-if="item.status == 1"
                    color="orange"
                    text-color="white"
                >เปิด</v-chip>
                <v-chip
                    v-if="item.status == 2"
                    color="primary"
                    text-color="white"
                >ปิด (รอการตรวจสอบ)</v-chip>
                <v-chip
                    v-if="item.status == 3"
                    color="green"
                    text-color="white"
                >ตรวจสอบแล้ว (รอการอนุมัติ)</v-chip>

                <v-chip
                    v-if="item.status == 4"
                    color="green"
                    text-color="white"
                >อนุมัติเรียบร้อย</v-chip>

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

                <v-chip
                    v-if="item.shift == 1"
                    color="orange"
                    text-color="white"
                >08:00</v-chip>
                <v-chip
                    v-if="item.shift == 2"
                    color="primary"
                    text-color="white"
                >17:00</v-chip>
                <v-chip
                    v-if="item.shift == 3"
                    color="green"
                    text-color="white"
                >24:00</v-chip>
            </template>

            <template v-slot:item.action="{ item }">

                <v-chip
                    color="green"
                    text-color="white"
                    @click="downloadPDF(item.id)"
                >PDF</v-chip>

                <v-chip
                    color="green"
                    text-color="white"
                    @click="downloadPDFSign(item.id)"
                >ลายเซ็นต์</v-chip>

                <router-link :to="{ path: 'ot-detail/' + item.id }">
                    <v-btn
                        v-if="item"
                        rounded
                        color="blue-grey"
                        class="ma-2 white--text"
                    >รายละเอียดพนักงาน</v-btn>
                </router-link>

                <!-- commander -->
                <template v-if="employee.level >= 2">
                    <router-link :to="{ path: 'signpad/close/' + item.id }">
                        <v-btn
                            v-if="item.status == 1"
                            rounded
                            color="primary"
                            class="ma-2"
                        >ปิด OT</v-btn>
                    </router-link>
                </template>

                <!-- Waiting for approve 1 -->
                <template v-if="employee.level >= 3">
                    <router-link :to="{ path: 'signpad/approve/' + item.id }">
                        <v-btn
                            v-if="item.status == 2"
                            rounded
                            color="primary"
                            class="ma-2"
                        >
                            ยืนยันตรวจสอบข้อมูล
                        </v-btn>
                    </router-link>
                </template>

                <!-- Waiting Final Confirm  -->
                <template v-if="employee.level >= 4">
                    <router-link :to="{ path: 'signpad/confirm/' + item.id }">
                        <v-btn
                            v-if="item.status == 3"
                            rounded
                            color="primary"
                            class="ma-2"
                        >อนุมัติ</v-btn>
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

        <v-snackbar
            v-model="snackbar"
            :timeout="timeout"
            :color="color"
            :top="true"
        >
            {{ text }}
            <v-btn
                color="white"
                text
                @click="snackbar = false"
            >
                Close
            </v-btn>
        </v-snackbar>
    </div>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars */
import axios from "axios";
import moment from "moment";
import { mapActions, mapState } from "vuex";

export default {
    created() {
        if (this.line_access_token != "") {
            this.getOt();
            this.allOt();
        }
    },
    mounted() {
        // console.log("mouted");
        // this.allOt();
    },

    data() {
        return {
            date: new Date().toISOString().substr(0, 10),
            menu: false,
            modal: false,
            menu2: false,
            select: "กรุณาเลือกกะทำงาน",
            ot_type: [
                "ทั้งหมด",
                "เปิด",
                "ปิด",
                "ตรวจสอบแล้ว",
                "อนุมัติเรียบร้อย"
            ],
            ot_status: "ทั้งหมด",
            ot_item: [],

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
                    sortable: true,
                    value: "created_at"
                },
                { text: "รอบกะ", value: "shift", sortable: false },
                { text: "หัวหน้ากะ", value: "name", sortable: false },
                { text: "สถานะ", value: "status", sortable: false },
                { text: "เมนู", value: "action", sortable: false }
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
        ...mapState({
            ot_data: "ot",
            employee: "employee",
            line_access_token: "line"
        })
    },
    watch: {
        ot_data() {
            //ot state change
            this.allOt();
        }
    },
    methods: {
        ...mapActions({
            getOt: "getOt"
        }),
        getMomentDateFormat(mdate, format) {
            var dtm = moment(mdate, format);
            return dtm;
        },
        downloadPDF(otid) {
            axios
                .post("/api/line/ot/pdf", {
                    id: otid,
                },{ responseType: 'blob' })
                .then(res => {
                    var fileURL = window.URL.createObjectURL(new Blob([res.data]));
                    var fileLink = document.createElement('a');
                
                    fileLink.href = fileURL;
                    fileLink.setAttribute('download', 'ot_'+ otid +'.pdf');
                    document.body.appendChild(fileLink);
                
                    fileLink.click();

                })
                .catch(err => {
                    // console.log(err);
                    this.showSnack("ไม่สามารถดาวน์โหลดข้อมูล PDF", "error");
                });
        },
        downloadPDFSign(otid) {
            axios
                .post("/api/line/ot/pdfsign", {
                    id: otid,
                },{ responseType: 'blob' })
                .then(res => {
                    var fileURL = window.URL.createObjectURL(new Blob([res.data]));
                    var fileLink = document.createElement('a');
                
                    fileLink.href = fileURL;
                    fileLink.setAttribute('download', 'otsign_'+ otid +'.pdf');
                    document.body.appendChild(fileLink);
                
                    fileLink.click();

                })
                .catch(err => {
                    // console.log(err);
                    this.showSnack("ไม่สามารถดาวน์โหลดข้อมูล PDF", "error");
                });
        },
        updateShift(item, shift) {
            // console.log(item.id);
            // console.log(shift.id);

            axios
                .post("/api/line/ot/shift", {
                    ot: item.id,
                    shift: shift.id
                })
                .then(res => {
                    item.shift = shift.id;
                    this.showSnack("บันทึกสำเร็จ", "success");
                    // Show modal
                    // console.log(res);
                })
                .catch(err => {
                    // console.log(err);
                    this.showSnack("บันทึกไม่สำเร็จ", "error");
                });
        },
        showSnack(txt, color) {
            this.text = txt;
            this.color = color;
            this.snackbar = true;
        },
        searchOt() {
            this.ot_item = this.ot_data.filter(r => {
                if (this.ot_status == "ทั้งหมด") {
                    return r.created_at.includes(this.date);
                }
                if (this.ot_status == "เปิด") {
                    return r.created_at.includes(this.date) && r.status == 1;
                }
                if (this.ot_status == "ปิด") {
                    return r.created_at.includes(this.date) && r.status == 2;
                }
                if (this.ot_status == "ตรวจสอบแล้ว") {
                    return r.created_at.includes(this.date) && r.status == 3;
                }
                if (this.ot_status == "อนุมัติเรียบร้อย") {
                    return r.created_at.includes(this.date) && r.status == 4;
                }
            });
        },
        allOt() {
            this.ot_item = this.ot_data.filter(r => {
                if (this.ot_status == "ทั้งหมด") {
                    return true;
                }
                if (this.ot_status == "เปิด") {
                    return r.status == 1;
                }
                if (this.ot_status == "ปิด") {
                    return r.status == 2;
                }
                if (this.ot_status == "ตรวจสอบแล้ว") {
                    return r.status == 3;
                }
                if (this.ot_status == "อนุมัติเรียบร้อย") {
                    return r.status == 4;
                }
            });
        }
    }
};
</script>
