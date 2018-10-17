
<template>
<div class="chat-emotion-panel" v-bind:style="{bottom: bottomData,left: leftData}">
  <table class= "chat-table-emotion" v-html="emotionTable" @click="returnEmotionValue">
  </table>
</div>
</template>
<script>
import emotionparse from "../assets/js/emotionparse";
export default {
  name: "EmotionPanel",
  props: ["emotionEle"],
  data() {
    return {
      emotionTable: "",
      bottomData: "0",
      leftData: "0"
    };
  },
  methods: {
    returnEmotionValue(e) {
      console.log(e.target);
      if (e.target.nodeName.toLowerCase() === "td") {
        this.doSomething(e.target.innerHTML);
        return;
      }
      // if (e.target.nodeName.toLowerCase() === "td") {
      //   this.doSomething(e.target.innerHTML);
      //   return;
      // }
    },
    doSomething(imgDocument) {
      let str = emotionparse.resolveEmotionToText(imgDocument);
      //传递给父组件data
      this.$emit("ee", str);
    }
  },
  mounted() {
    //插入表情块
    let path = "/static/chatTool/arclist/";
    let strFace, labFace;
    strFace = "<tr>";
    for (let i = 0; i <= 49; i++) {
      strFace += '<td><img src="' + path + i + '.gif"/></td>';
      if (i % 10 === 9) strFace += "</tr><tr>";
    }
    strFace += "</tr>";
    this.emotionTable = strFace;
    let ele = document.getElementsByClassName(this.emotionEle)[0];

    this.bottomData =
      window.innerHeight - ele.getBoundingClientRect().top + "px";
    this.leftData = ele.getBoundingClientRect().left + "px";
  }
};
</script>
<style lang="scss">
.chat-emotion-panel {
  display: inline-block;
  background-color: #fff;
  border-radius: 5px;
  border: 1px solid $theme-color;
  position: fixed;
  table {
    width: 480px;
    td {
      cursor: pointer;
      &:hover{
        background: $theme-color;
      }
    }
  }
}
</style>



