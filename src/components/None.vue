<template>
  <div class="none">
    <div class="none-top"></div>
    <div class="none-main">
        <i class="el-icon-warning"></i>  
        {{ msg }}
    </div> 
  </div>
</template>

<script>
export default {
  props: {
    msg: String,
  },
};
</script>

<style scoped>
.none-main {
    margin-top: 20px;
    font-size: 20px;
}
.el-icon-warning {
    font-size: 20px;
}
</style>