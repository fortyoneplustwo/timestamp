<template>
  <div class='note-container' @dblclick="handleDoubleClick">
    <button @click="$emit('seek-to-timestamp', this.timestamp)" class='timestamp'>
      {{ timestampToString() }}
    </button>
    <hr class="separator">
    <span ref="textarea" class="textarea" contenteditable="false" @blur="handleLoseFocus"> {{ text }} </span>
    <!-- <button class='copy' v-if="mode" @click='copy'><i class="fa fa-copy"></i></button> -->
    <input ref="checkbox" type="checkbox" v-if="mode"/>
  </div>
</template>

<script>
export default {
  name: 'MyNote',
  props: {
    note: Object,
    mode: Boolean
  },
  data() {
    return {
      text: this.note.text,
      id: this.note.id,
      timestamp: this.note.timestamp,
      timestampMin: Math.floor(this.note.timestamp / 60),
      timestampSec: this.note.timestamp - Math.floor(this.note.timestamp / 60) * 60
    }
  },
  methods: {
    timestampToString() {
      let secString = this.timestampSec.toString();
      if(secString.length < 2) secString = '0' + secString;
      return this.timestampMin.toString() + ':' + secString;
    },
    handleDoubleClick() {
      this.$refs.textarea.contentEditable = true;
      this.$refs.textarea.focus();
    },
    handleLoseFocus() {
      this.$refs.textarea.contentEditable = false;
      // emit note-edited(this.$refs.textarea.textContent, note.id);
    },
    copy() {
      navigator.clipboard.writeText(this.text);
    }
  }
}
</script>

<style scoped>
.note-container {
  display: flex;
  flex-direction: row;
  height:  auto;
  width: 100%;
  padding: 1% 2% 1% 2%;
  outline: none;
  border-style: dotted;
  border-inline-end-style: hidden;
  border-inline-start-style: hidden;
  border-top: none; 
  border-color: rgb(30, 108, 253);
  box-sizing: border-box;
  white-space: pre-wrap;
  background-color: transparent;
  /* height: fit-content; */
  word-break: break-all;
}

.timestamp {
  min-width: 100px;
  text-align: center;
  display: inline-block;
  cursor: pointer;
  padding: 5px 16px;
  font-size: 14px;
  font-weight: 500;
  vertical-align: middle;
  border: 1px solid;
  border-radius: 5%;
  background-color: transparent;
  border-color: #1b1f2326;
  border-radius: 20%;
  border: none;
  color: darkred;
  margin-right: 2%;
}

.checkbox {
  display: flex;
  cursor: pointer;
  border: none;
  margin-left: auto;
  /* margin-right: 0; */
}

.separator{
  margin-left: 0;
  margin-right: 2%;
  margin-top: -2%;
  margin-bottom: -10%;
  border-color: red;
  z-index: 1;
}

.textarea {
  margin-right: 1%;
  font-family:Georgia, 'Times New Roman', Times, serif;
  width: 100%;
}

.highlight {
  background-color: #ff0;
}
</style>
