<template>
  <div class="avatar">
    <div class="container">
      <canvas id="myCanvas" width="200" height="100"></canvas>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: String || ''
  },
  data() {
    return {
    //   name: "萌汉曜",
    };
  },
  mounted() {
    this.drawName();
  },
  updated() {
      this.drawName();
  },
  methods: {
    // 生成一个随机数
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    // 生成一个随机的颜色
    randomColor(min, max) {
      let r = this.randomNum(min, max);
      let g = this.randomNum(min, max);
      let b = this.randomNum(min, max);
      return "rgb(" + r + "," + g + "," + b + ")";
    },
    drawName() {
      console.log(11111111111111111,this.name)
      this.name = this.name.slice(-2);
      let canvas = document.getElementById("myCanvas");
      let ctx = canvas.getContext("2d");
      ctx.textBaseline = "bottom";
      // 绘制背景
      ctx.fillStyle = this.randomColor(0, 255);
      //   ctx.fillRect(0, 0, 200, 200);

      ctx.beginPath();
      ctx.arc(46, 50, 30, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fillStyle = this.randomColor(0, 255);
      ctx.font = "16px Arial";
      ctx.fillText(this.name, 30, 60);
    },
  },
};
</script>

<style scoped>
.avatar {
    display: inline-block;
}
</style>