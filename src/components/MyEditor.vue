<template>
  <div class="editorContainer">
    <button ref="editBtn" 
            value="write" 
            @click='handleMarkButton'
            class='mode-button'
            disabled="true" >
            <i v-if="writeMode === 'list'" class="fa fa-list"></i>
    </button>
    <input type="text"
            placeholder="Hit <return> for a new line" 
            @input="handleLogDateOnTextInput" 
            ref="textarea" class="textarea" 
            :onkeydown="handleKeyboardShortcuts" >
    <button @click='saveNote' class='return'><span>⮐</span> </button>
  </div>
</template>

<script>
export default {
  name: 'MyEditor',
  props: {
    mode: Boolean,
    /* We need the following 3 variables to compute a note's timestamp. */
    recDuration: Number,
    dateWhenRecLastActive: Date,
    dateWhenRecLastInactive: Date,
  },
  data() {
    return {
      /* dateOfInput for the most recent non-empty input. */
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
     * Save note together with its timestamp.
     * (Empty note's timestamp = rec duration at time of save.)
     */
    saveNote() {
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
      this.wasEmptyBeforeInput = true;
    },
    handleKeyboardShortcuts(e) {
      if(e.keyCode === 13) {
        this.saveNote();
      } else if (e.key === 'l' && e.shiftKey && e.metaKey) {
        // Implement this for bullet points
        console.log('list mode');
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
    handleMarkButton() {
    },
     /* Log the date whenever input is detected on a previously empty textarea. */
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
  width: 100%;
  padding: 2%;
  word-wrap: break-word;
  /*font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;*/
  font-size: medium;
  overflow-x: auto;
  background-color: white;
  color: black;
  border-color: blue;
}

.mode-button {
  background-color: transparent;
  border: none;
  /*prevent cursor event on hover*/
  cursor: initial;
  outline: none;
  min-width: 10%;
  margin-left: 0;
  color: black;
  margin-right: 1%;
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
  color: black;
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