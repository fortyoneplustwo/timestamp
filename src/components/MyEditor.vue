<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <button @click="toggleEditMode"  class="write-mode" value="write" id='mode-button'>Edit</button>
  <!-- <span contenteditable ref='textarea' id="textarea" :onkeydown="dblenter" v-if="!mode"></span> -->
  <textarea ref='textarea' id="textarea" :onkeydown="dblenter" v-if="!mode"> </textarea>
  <button v-if="mode" class="edit-options" ><i class="fa fa-copy"></i></button>
  <button v-if="mode" class="edit-options" ><i class="fa fa-trash"></i></button>
  <button v-if="mode" class="edit-options" ><i class="fa fa-undo"></i></button>
  <button @click='addnote' id='return'><span>&#8617;</span> </button>
</template>


<script>
export default {
  name: 'MyEditor',
  props: {
    id: Number,
    mode: Boolean
  },
  data() {
    return {
      text: "",
      waiting_for_press2: false
    }
  },
  methods: {
    /* 
     * Save a new note to our dataset
     */
    addnote() {
      console.log('success')
      const textarea = this.$refs.textarea;
      const note = textarea.value;
      textarea.value = '';
      this.$emit('add-note', this.id, note);
      this.waiting_for_press2 = false;
    },
    /* 
     * Handle 'Enter+Enter' shortcut to submit note.
     * Return false to prevent the event propagation. 
     */
    dblenter(event) {
      const key_code = event.keyCode 
      if(key_code === 13) { 
        if(this.waiting_for_press2) {
            this.addnote();
            return false; 
        } else {
          this.waiting_for_press2 = true
          return;
        }
      } else {
        this.waiting_for_press2 = false
      }
    },
    /* Switch between Write and Edit mode.
     * TODO: Make this a toggle swtich.
     */
    toggleEditMode() {
      const button = document.getElementById('mode-button')
      if (button.value === 'write') {
        button.innerHTML = 'Write'
        button.value = 'edit'
        this.$emit('toggle-mode', true)

      } else {
        button.value = 'write'
        button.innerHTML = 'Edit'
        this.$emit('toggle-mode', false)
      }
    }
  }
}
</script>

<style scoped>
#textarea {
  height: auto;
  width: 100%;
  padding: 1%;
  border-style: solid;
  border-color: coral;
  border-radius: 10px;
  background-color: white;
  box-sizing: border-box;
  white-space: pre-wrap;
  overflow: scroll;
}

#mode-button {
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

#return {
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  min-width: 10%;
}

</style>