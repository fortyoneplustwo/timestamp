<template>
  <div class="editorContainer">
    <button ref="editBtn" 
            value="write" 
            class='mode-button'>
            <i v-if="writeMode === 'list'" class="fa fa-list"></i>
    </button>
    <input type="text"
            placeholder="Hit <return> for a new line" 
            @input="handleLogDateOnTextInput" 
            ref="textarea" class="textarea" 
            :onkeydown="handleKeyboardShortcuts" 
            v-if="!mode">
    <!-- Note: textarea used to be a contenteditable <p> tag -->
    <button @click='addNote' class='return'><span>⮐</span> </button>
  </div>
</template>

<script>
export default {
  name: 'MyEditor',
  props: {
    mode: Boolean,
    /*
     * We need the following 3 variables to compute a note's timestamp.
     */
    recDuration: Number,
    dateWhenRecLastActive: Date,
    dateWhenRecLastInactive: Date,
  },
  data() {
    return {
      /*
       * dateOfInput for the most recent non-empty input.
       */
      dateOfInput: 0,
      wasEmptyBeforeInput: true,
      writeMode: 'none'
    }
  },
  methods: {
    /*
     * Given dateOfInput, compute the timestamp.
     * Must convert milliseconds -> seconds.
     */
    computeTimestamp(dateOfInput) {
      let timestamp = 0;
      if(this.dateWhenRecLastActive > this.dateWhenRecLastInactive) {
        timestamp = this.recDuration 
                  + (dateOfInput - this.dateWhenRecLastActive);
      } else {
        timestamp = this.recDuration;
      }
      timestamp = Math.floor(timestamp / 1000);
      return timestamp;
    },
    /* 
     * Emit note together with its timestamp.
     * Empty note's timestamp = audio duration at time of save.
     */
    addNote() {
      const textarea = this.$refs.textarea;
      const content = textarea.value;
      textarea.value = '';
      let timestamp = 0;
      if(content.length === 0) {
        timestamp = this.computeTimestamp(new Date());
      } else {
        timestamp = this.computeTimestamp(this.dateOfInput);
      }
      this.$emit('add-note', timestamp, content);
      // this.waiting_for_press2 = false;
      this.wasEmptyBeforeInput = true;
    },
    handleKeyboardShortcuts(e) {
      if(e.keyCode === 13) {
        this.addNote();
      } else if (e.key === 'l' && e.shiftKey && e.metaKey) {
        this.writeMode = 'list';
        this.$refs.editBtn.classList.add('list-mode');
      } else if(e.key === 'Escape')  {
        this.writeMode = 'none';
        this.$refs.editBtn.classList.remove('list-mode');
      } else if(e.keyCode === 9) { // Tab
        let input = e.target;
        const text = input.value;
        const pos = input.selectionStart;
        input.value = text.slice(0, input.selectionStart)
                    + '\t'
                    + text.slice(input.selectionStart, text.length);
        input.setSelectionRange(pos + 1, pos + 1);
        return false;
      }
    },
    /*
     * Log the date whenever input is detected on a previously empty textarea.
     */
    handleLogDateOnTextInput() {
      const currDate = new Date();
      if(this.$refs.textarea.value.length === 0) { 
        this.wasEmptyBeforeInput = true;
      } else if(this.wasEmptyBeforeInput) {
        this.dateOfInput = currDate;
        this.wasEmptyBeforeInput = false;
      }
    }
  }
}
</script>

<style scoped>
.textarea {
  /*height: 100%;*/
  width: 100%;
  padding: 2%;
  /*border-style: solid;*/
  /*border-color: coral;*/
  border-style: none;
  border-radius: 10px;

  word-wrap: break-word;
  font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  /*white-space: pre-line;*/
  font-size: medium;
  overflow-x: auto;
}

.mode-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  min-width: 10%;
  margin-left: 0;
}

.edit-options {
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  min-width: 10%;
}

.return {
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  min-width: 10%;
}

.editorContainer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items:  center;
  height: fit-content;
}

</style>