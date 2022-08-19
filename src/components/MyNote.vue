<template>
  <div class='note-container' @dblclick="handleDoubleClick">
    <button @click="$emit('seek-to-timestamp', this.timestamp)" class='timestamp'>{{ Math.floor(timestamp/60).toString() + ':' + (timestamp-((Math.floor(timestamp/60))*60)).toString() }}</button>
    <hr class="separator">
    <span ref="textarea" class="textarea" contenteditable="false" @blur="handleLoseFocus"> {{ text }} </span>
    <button class='copy' v-if="mode" @click='copy'><i class="fa fa-copy"></i></button>
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
      timestamp: this.note.timestamp
    }
  },
  methods: {
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
  width: 70px;
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
  cursor: pointer;
  border: none;
  margin-left: auto;
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
}

.highlight {
  background-color: #ff0;
}
</style>
