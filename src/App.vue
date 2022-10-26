<template>
  <div class='container'>
    <div class='header'>
          <h1 style="text-align: center; color: black;">Timestamp</h1>
          <div class='recorder-container'>
            <button class="rec-controls" 
                    ref="recBtn" 
                    @click='handleRecButton'>
                    <i ref='recIcon' class="icon-circle-o" style="color: red;"></i>
            </button>
            <button class="rec-controls" 
                    ref="stopBtn" 
                    disabled="true" 
                    @click="handleStopButton">
                    <i class="icon-square-o" style="color: blue;"></i>
            </button>
            <audio hidden controls ref="audio"></audio>
            <button class="rec-controls"
                    hidden="true"
                    ref="deleteBtn"
                    style="color: black;">
                    <i class="icon-trash"></i>
            </button>
            <button class='rec-controls'
                    ref='copyBtn'
                    hidden
                    @click="copySelectedNotes">
              <i class="icon-clipboard" style="color: black;"></i>
            </button>
            <button class="rec-controls" 
                    ref="saveBtn" 
                    hidden="true" 
                    @click="handleSaveButton">
                    <i class="icon-download" style="color: black;"></i>
            </button>
          </div>
    </div>
    <div class='page-container'>
      <div v-if="notes.length > 0" class='page'>
        <ul class="list" style="list-style-type: none; margin: 0; padding: 0;">
          <li class="saved-note" v-for="note in notes" :key="note.id">
            <MyNote @seek-to-timestamp="seekTo" 
                    :note="note"
                    @note-edited="replaceNote" 
                    :mode="mode"
                    @toggle-selection="toggleNoteSelection"/>
           </li>
        </ul>
      </div>
    </div> 
    <div class="editor-container">
        <MyEditor class="editor" 
                  :mode="mode" 
                  :recDuration="recDuration" 
                  :dateWhenRecLastActive="dateWhenRecLastActive"
                  :dateWhenRecLastInactive="dateWhenRecLastInactive" 
                  @add-note="addNote" 
                  @toggle-mode="toggleMode"
                  @copy-selected-notes="copySelectedNotes"/>
    </div>
  </div>
</template>


<script>
import MyEditor from './components/MyEditor.vue'
import MyNote from './components/MyNote.vue'

export default {
  name: 'App',
  components: {
    MyEditor,
    MyNote
  },
  data() {
    return {
       /* Our datalist of note objects: {id, timestamp, text, isChecked}. */
      notes: [],
      noteIdCounter: Number,
      /* Keep track of write/edit mode. May not need this feature after all. */
      mode: Boolean,
      mediaRecorder: Object,
       /* Where audio is stored while recording. */
      chunks: [],
      /*
       * Because the MediaRecorder API doesn't provide a currentTime attribute,
       * we need to keep track of the recording's duration 
       * by updating the following 3 variables on start/pause/resume/stop.
       */
      recDuration: Number,
      dateWhenRecLastActive: Date,
      dateWhenRecLastInactive: Date
    }
  },
  created() {
    this.mode = false;
    this.initRecorder();
    this.dateWhenRecLastActive = this.dateWhenRecLastInactive = new Date();
    this.recDuration = 0;
    this.noteIdCounter = 0;
  },
  methods: {
    /*
     * Add a note to our datalist: notes[].
     * Emitted by MyEditor component.
     */
    addNote(timestamp, content) {
      const id = this.noteIdCounter++;
      this.notes.push(
        { 
          id: id, 
          timestamp: timestamp, 
          text: content,
          isChecked: false
        }
      );
    },
    replaceNote(id, newText) {
      for(let i=0; i < this.notes.length; i++) {
        if(id === this.notes[i].id) {
          this.notes[i].text = newText;
        }
      }
    },
    seekTo(timestamp) {
      const audio = this.$refs.audio;
      // Quick play-pause required otherwise the audio won't seek to timestamp.
      audio.play(); audio.pause(); 
      audio.currentTime = timestamp;
      audio.play();
    },
    toggleMode() {
      this.mode = !this.mode;
      console.log(this.mode);
    },
    toggleNoteSelection(id, isSelected) {
      for(let i=0; i < this.notes.length; i++) {
        if (this.notes[i].id === id) {
          this.notes[i].isChecked = isSelected;
        }
      }
    },
    copySelectedNotes() {
      let selectedNotes = "";
      for(let i=0; i < this.notes.length; i++) {
          selectedNotes += this.notes[i].text + '\n'
      }
      console.log(selectedNotes);
      navigator.clipboard.writeText(selectedNotes);
      // deselect everything
    },
     /* Called whenever the recording is inactive i.e. on pause/stop. */
    adjustRecDuration() {
      this.recDuration += this.dateWhenRecLastInactive 
                        - this.dateWhenRecLastActive;
    },
    /*
     * Record button can toggle between (start)resume/pause.
     * Stop is handled by a separate button.
     */
    handleRecButton() {
      // const btn = e.target;
      let recIcon = this.$refs.recIcon;
      if (this.mediaRecorder.state != 'recording') {
        if (this.dateWhenRecLastActive === this.dateWhenRecLastInactive) {
          this.mediaRecorder.start();
        } else {
          this.mediaRecorder.resume();
        }
        recIcon.className = 'icon-pause';
      } else {
        this.mediaRecorder.pause();
        recIcon.className = 'icon-circle-o';
      }
    },
    handleStopButton() {
      this.mediaRecorder.stop();
    },
    handleSaveButton() {
      let wholePage = '';
      for(let i=0; i < this.notes.length; i++ ) {
        wholePage += this.notes[i].text + '\n'
      }
      let url = window.URL.createObjectURL(wholePage);
      document.open(url);
      
    },
    initRecorder() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ audio: true, })
          // Success callback: Register recorder event listeners
          .then((stream) => {
            this.mediaRecorder = new MediaRecorder(stream);
            // handle onstart event
            this.mediaRecorder.onstart = () => {
              this.dateWhenRecLastActive = new Date();
              this.$refs.stopBtn.disabled = false;
            };
            // handle ondataavailable event
            this.mediaRecorder.ondataavailable = (e) => {
              this.chunks.push(e.data);
            };
            // handle onresume event
            this.mediaRecorder.onresume = () => {
              this.dateWhenRecLastActive = new Date();
              this.mediaRecorder.requestData();
            };
            // handle onpause event
            this.mediaRecorder.onpause = () => {
              this.dateWhenRecLastInactive = new Date();
              this.adjustRecDuration();
            };
            // handle onstop event
            this.mediaRecorder.onstop = () => {
              // Recording may have stopped without having been paused.
              if (this.dateWhenRecLastActive > this.dateWhenRecLastInactive) {
                this.dateWhenRecLastInactive = new Date();
                this.adjustRecDuration();
              }
              this.$refs.recBtn.hidden = true;
              this.$refs.stopBtn.hidden = true;
              this.$refs.audio.hidden = false;
              this.$refs.saveBtn.hidden = false;
              this.$refs.deleteBtn.hidden = false;
              this.$refs.copyBtn.hidden = false;
              const blob = new Blob(this.chunks, {type: "audio/ogg; codecs=opus"});
              const audioURL = window.URL.createObjectURL(blob);
              this.$refs.audio.src = audioURL;
              this.$refs.audio.currentTime = 0;
            };
          })
          // Error callback
          .catch(function (err) {
            console.error(`The following getUserMedia error occurred: ${err}`);
          });
      } else {
        console.log("getUserMedia not supported on your browser!");
      }
    }
  }
}
</script>


<style>
.app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /*background-image: url("../public/upfeathers.png");*/
  /*background-repeat: repeat;*/
  background-color: white;
}

.recorder-container {
  margin-bottom: 1%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1%;
}

.rec-controls{
  background-color: transparent;
  border-style: none;
  font-size: 150%;
}

.page-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  flex:  2;
  min-height: 50%;
  padding-top: 2%;
  width: 70%;
  align-self: center;
}

.page {
  display: flex;
  flex-direction: column-reverse;
  margin-left: 15%;
  margin-right: 15%;
  overflow-y: scroll;
  align-self: center;
  border-radius: 255px 15px 225px 15px/10px 700px 0px 255px;
  border:solid 5px hsla(0, 95%, 35%, 1);
  border-color: black;
  border-bottom: none;
  border-width: medium;
  padding: 0.5%;
  height: fit-content;
  background-color: white;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.354);
  width: 90%;
}

.editor-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1%;
  margin-top: auto;
  height: 5%;
  border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
  border:solid 5px hsla(0, 95%, 35%, 1);
  border-color: black;
  border-width: medium;
  height: fit-content;
  width: 70%;
  align-self: center;
  margin-bottom: 1%;
  background-color: white;
}

.editor {
  max-width: 80%;
}
</style>
