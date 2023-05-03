<template>
  <div class="editorContainer">
    <!--div style="width: 15%;"></div-->
    <input type="text"
            placeholder="Hit <return> to timestamp a note"
            @input="handleLogDateOnTextInput"
            ref="textarea" class="textarea"
            :onkeydown="handleKeyboardShortcuts" >
    <!--div style="width: 15%;"></div-->
  </div>

</template>

<script>
export default {
  name: 'MyEditor',
  props: {
    /* We need the following 3 variables to compute a note's timestamp. */
    recDuration: Number,
    dateWhenRecLastActive: Date,
    dateWhenRecLastInactive: Date,
    triggerReset: Boolean
  },
  data() {
    return {
      /* dateNoteTaken for the most recent non-empty input. */
      dateNoteTaken: 0,
      wasEmptyBeforeInput: true
    }
  },
  watch: {
    triggerReset() {
      this.$refs.textarea.value = "";
    }
  },
  methods: {
    /*
     * Stamp note with dateNoteTaken.
     */
    stampNote() {
      const textarea = this.$refs.textarea;
      const content = textarea.value;
      textarea.value = '';
      if(content.length === 0) {
        this.$emit('add-note', new Date(), '');
      } else {
        this.$emit('add-note', this.dateNoteTaken, content);
      }
      this.wasEmptyBeforeInput = true;
    },
    handleKeyboardShortcuts(e) {
      if(e.keyCode === 13) {
        this.stampNote();
      } else if(e.keyCode === 9) {
        // Have to insert tab character manually
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
     /* Log the date whenever input is detected on a previously empty textarea. */
    handleLogDateOnTextInput() {
      const currDate = new Date();
      if(this.$refs.textarea.value.length === 0) {
        this.wasEmptyBeforeInput = true;
      } else if(this.wasEmptyBeforeInput) {
        this.wasEmptyBeforeInput = false;
        this.dateNoteTaken = currDate;
      }
    }
  }
}
</script>

<style scoped>
.textarea {
  width: 75%;
  padding: 1%;
  word-wrap: break-word;
  font-family: Lucida Sans Typewriter, Lucida Console, monaco, Bitstream Vera Sans Mono, monospace;
  overflow-x: auto;
  font-size: 13px;
  background-color: white;
  color: black;
  border-radius: 7px;
  border-color: whitesmoke;
}

.mode-button {
  background-color: transparent;
  border: none;
  /*silence cursor event on hover*/
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
  margin-right: 0;
}

.editorContainer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
}
</style>
