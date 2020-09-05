<template>
  <div>
    <el-select
      icon="el-icon-search"
      id="search"
      v-model="value"
      multiple
      filterable
      remote
      reserve-keyword
      placeholder="搜索本站"
      clearable
      :remote-method="remoteMethod"
      @change="remoteMethod"
      :loading="loading"
    >
      <!-- <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
      </el-option>-->
    </el-select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [],
      value: [],
      list: [],
      loading: false,
      user: Object,
      states: [
        "Alabama",
        "Alaska",
        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "Florida",
        "Georgia",
        "Hawaii",
        "Idaho",
        "Illinois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",
        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New Hampshire",
        "New Jersey",
        "New Mexico",
        "New York",
        "North Carolina",
        "North Dakota",
        "Ohio",
        "Oklahoma",
        "Oregon",
        "Pennsylvania",
        "Rhode Island",
        "South Carolina",
        "South Dakota",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",
        "Virginia",
        "Washington",
        "West Virginia",
        "Wisconsin",
        "Wyoming",
      ],
    };
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("localUser"));
    this.list = this.states.map((item) => {
      return { value: `value:${item}`, label: `label:${item}` };
    });
  },
  methods: {
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        console.log(1111111111111111111111111111111111111111111,this.user.userId)
        this.$router.push({
          path: "/search",
          query: {
            userId: this.user.userId ? this.user.userId : null,
            keywords: query,
          },
        });

        setTimeout(() => {
          this.loading = false;
          this.options = this.list.filter((item) => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = [];
      }
    },
  },
};
</script>

<style>
.el-select {
  /* position: absolute;
  right: 20px;
  top: 10px; */
  justify-content: center;
}
@media screen and (max-width: 500px) {
  .el-select {
    display: none;
  }
}
</style>