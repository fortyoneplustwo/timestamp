<template>
  <div class="editorContainer">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <button ref="editBtn" @click="toggleEditMode" value="write" class='mode-button'>Edit</button>
    <p contenteditable="true" @input="handleNewTimestampOnTextInsert" ref="textarea" class="textarea" :onkeydown="dblEnter" v-if="!mode"></p>
    <button v-if="mode" class="edit-options" ><i class="fa fa-copy"></i></button>
    <button v-if="mode" class="edit-options" ><i class="fa fa-trash"></i></button>
    <button v-if="mode" class="edit-options" ><i class="fa fa-undo"></i></button>
    <button @click='addNote' class='return'><span>&#8617;</span> </button>
  </div>
</template>

<script>
export default {
  name: 'MyEditor',
  props: {
    mode: Boolean
  },
  data() {
    return {
      waiting_for_press2: false,
      dateNoteTaken: 0,
      isEmpty: true
    }
  },
  methods: {
    /* 
     * Save a new note to our dataset
     */
    addNote() {
      const textarea = this.$refs.textarea;
      const note = textarea.innerText.slice(0, -1);
      textarea.innerHTML = '';
      this.$emit('add-note', this.dateNoteTaken, note);
      this.waiting_for_press2 = false;
      this.isEmpty = true;
    },
    /* 
     * Handle double press 'Return' shortcut to submit note.
     * Return false to prevent the event propagation. 
     */
    dblEnter(e) {
      const key_code = e.keyCode;
      if(key_code === 13) { 
        if(this.waiting_for_press2) {
            this.addNote();
            return false;
        } else {
          this.waiting_for_press2 = true;
        }
      } else {
        this.waiting_for_press2 = false;
      }
    },
    /* 
     * Switch between Write and Edit mode.
     * TODO: Make this a toggle swtich.
     */
    toggleEditMode() {
      const button = this.$refs.editBtn;
      if (button.value === 'write') {
        button.innerHTML = 'Write';
        button.value = 'edit';
        this.$emit('toggle-mode', true);
      } else {
        button.value = 'write';
        button.innerHTML = 'Edit';
        this.$emit('toggle-mode', false);
      }
    },
    /*
     * Mark the date whenever input is detected on a previously empty editor.
     */
    handleNewTimestampOnTextInsert() {
      const currDate = new Date();
      if(this.$refs.textarea.textContent.length === 0) this.isEmpty = true;
      if(this.isEmpty && this.$refs.textarea.textContent.length > 0) {
        this.dateNoteTaken = currDate;
        this.isEmpty = false;
      }
    }
  }
}
</script>

<style scoped>
.textarea {
  height: fit-content;
  overflow-y: scroll;
  max-height: 60%;
  width: 100%;
  padding: 1%;
  border-style: solid;
  border-color: coral;
  border-radius: 10px;
  background-color: white;
  word-wrap: break-word;
  font-family: 'Times New Roman', Times, serif;
  white-space: pre-line;
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
}
</style>