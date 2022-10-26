<template>
  <div class='note-container' @dblclick="handleDoubleClick">
    <button @click="$emit('seek-to-timestamp', this.timestamp)" 
            class='timestamp'>
            {{ timestampToString() }}
    </button>
    <hr class="separator">
    <span ref="textarea"
          class="textarea"
          @blur="handleLoseFocus">
          {{ text }}
    </span>
    <!-- <button class='copy' v-if="mode" @click='copy'><i class="fa fa-copy"></i></button> -->
    <input @click="handleSelectNote" ref="checkbox" type="checkbox" id="checkbox" v-if="mode"/>
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
      isSelected: this.note.isChecked,
      timestamp: this.note.timestamp,
      timestampMin: Math.floor(this.note.timestamp / 60),
      timestampSec: this.note.timestamp - Math.floor(this.note.timestamp / 60) * 60
    }
  },
  computed: {
    noteContent: {
      get() {
        return this.text
      }
    }
  },
  methods: {
    timestampToString() {
      let secString = this.timestampSec.toString();
      if(secString.length < 2) secString = '0' + secString;
      return this.timestampMin.toString() + ':' + secString;
    },
    handleSelectNote() {
      this.$emit('toggle-selection', this.id, this.$refs.checkbox.checked);
    },
    handleDoubleClick() {
      this.$refs.textarea.contentEditable = true;
      this.$refs.textarea.focus();
    },
    /*
     * Because we cannot v-model a span's textContent
     * we wait for focus to be lost to grab the new text and update our data.
     */
    handleLoseFocus(e) {
      this.$refs.textarea.contentEditable = false;
      this.$emit('note-edited', this.id, e.target.textContent);
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
  padding: 0% 3% 0% 3%;
  outline: none;
  border-style: dotted;
  border-inline-end-style: hidden;
  border-inline-start-style: hidden;
  border: none;
  /*border-top: none;*/
  /*border-color: rgb(30, 108, 253);*/
  box-sizing: border-box;
  white-space: pre-wrap;
  background-color: transparent;
  /* height: fit-content; */
  word-break: break-all;
}

.timestamp {
  /*min-width: 100px;*/
  width: 80px;
  text-align: center;
  display: inline-block;
  cursor: pointer;
  /*padding: 5px 16px;*/
  padding-left: 0;
  padding-right: 0;
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
  font-family: monospace;
}

.checkbox {
  display: flex;
  cursor: pointer;
  border: none;
  margin-left: auto;
 margin-right: 0; 
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
  width: 100%;
  /*font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;*/
  outline: none;
  color: black;
}
</style>
