<template>
  <div v-if="notes.length > 0" class='page' @input=handleAllNotesDeleted>
    <ul contenteditable="true" ref="ul" class="parent">
          <MyNote v-for="(note, index) in notes"
                  :key="note.id"
                  :index="index"
                  :note="note"
                  class="item"
                  @seek-to-timestamp="$emit('seek-to-timestamp', note.timestamp)"/>
    </ul>
</div>
</template>

<script>
import MyNote from './MyNote.vue'

export default {
  name: 'MyPage',
  components: {
    MyNote
  },
  props: {
    newNote: Object,
    triggerSaveNotes: Boolean,
    triggerReset: Boolean
	},
  data() {
    return {
      notes: []
    }
  },
  watch: {
    newNote(newVal) {
      this.notes.push(newVal);
    },
    triggerSaveNotes() {
      let savedNotes = [];
      const ul = document.querySelector("ul");
      const liElements = ul.querySelectorAll("li");
      liElements.forEach((li) => {
        const index = Array.from(ul.children).indexOf(li);
        const timestampBtn = li.querySelector("button");
        const timestamp = timestampBtn === null ? 0 : timestampBtn.value;
        let text = li.querySelector("span").innerText;
        if (text === '\n') { text = ''; }
        savedNotes.push({id: index, timestamp: timestamp, text: text});
      });
      // extract text from notes Array and save to Blob
      const notesString = savedNotes.map(x => x.text).join("\n");
      var myblob = new Blob([notesString], {
        type: 'text/plain'
      });
      // when user accounts are created, we will want to
      //  save this to the database
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(myblob);
      downloadLink.download = "notes.txt";
      downloadLink.click();
      URL.revokeObjectURL(downloadLink.href);
    },
    triggerReset() {
      this.notes.length = 0;
    }
  },
  methods: {
    /* Make the page disappear when all notes have been deleted */
    handleAllNotesDeleted(event) {
      if (event.target.innerHTML.trim() === '') {
        this.notes.length = 0;
      }
    }
  }
}
</script>

<style scoped>

  .parent {
    font-family: "Times New Roman", Times, serif;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .parent:focus {
    outline: none;
  }


  .item:nth-child(even) { background: #e2fee2; }

  .page {
  display: flex;
  flex-direction: column-reverse;
  margin-left: 15%;
  margin-right: 15%;
  overflow-y: scroll;
  align-self: center;
  border:solid 5px hsla(0, 95%, 35%, 1);
  border-color: lightgray;
  border-bottom: none;
  border-width: thin;
  padding: 0.5%;
  height: fit-content;
  background-color: white;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.354);
  width: 90%;
  border-radius: 7px;
}
</style>
