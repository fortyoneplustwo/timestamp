<template>
  <div class='container'>
    <div class='header'>
          <h1 style="font-family: cursive;" class='title'>Timestamp</h1>
          <div class='recorder-container'>
            <button class="rec-controls" 
                    ref="recBtn" 
                    @click='handleRecButton'>
                    🔴
            </button>
            <button class="rec-controls" 
                    ref="stopBtn" 
                    disabled="true" 
                    @click="handleStopButton">
                    ⏹
            </button>
            <audio hidden controls ref="audio"></audio>
            <button class="rec-controls" 
                    ref="saveBtn" 
                    disabled="true" 
                    @click="handleSaveButton">
                    💾
            </button>
          </div>
    </div>
    <div class='page-container'>
      <div v-if="notes.length > 0" class='page'>
        <ul class="list" style="list-style-type: none; margin: 0; padding: 0;">
          <li class="saved-note" v-for="note in notes" :key="note.id">
            <MyNote @seek-to-timestamp="seekTo" :note="note" v-bind:mode="mode"/>
           </li>
        </ul>
      </div>
    </div> 
    <div class="editor">
        <MyEditor class="editor2" 
                  :mode="mode" 
                  :recDuration="recDuration" 
                  :dateWhenRecLastActive="dateWhenRecLastActive"
                  :dateWhenRecLastInactive="dateWhenRecLastInactive" 
                  @add-note="addNote" 
                  @toggle-mode="toggleMode"/>
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
      /*
       * Our datalist of note objects: {id, timestamp, text}.
       */
      notes: [],
      noteIdCounter: Number,
      mode: Boolean,
      mediaRecorder: Object,
      /*
       * Where audio is stored while recording.
       */
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
    this.notes = [{id: 1, timestamp: 533339, text: 'test'}];
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
          text: content
        }
      );
      for(let i=0; i < this.notes.length; i++) {
        console.log(this.notes[i].text);
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
    },
    /*
     * Called whenever the recording is inactive i.e. on pause/stop.
     */
    adjustRecDuration() {
      this.recDuration += this.dateWhenRecLastInactive 
                        - this.dateWhenRecLastActive;
    },
    /*
     * Record button can toggle between (start)resume/pause.
     * Stop is handled by a separate button.
     */
    handleRecButton(e) {
      const btn = e.target;
      if (this.mediaRecorder.state != 'recording') {
        if (this.dateWhenRecLastActive === this.dateWhenRecLastInactive) {
          this.mediaRecorder.start();
        } else {
          this.mediaRecorder.resume();
        }
        btn.textContent = '⏸';
      } else {
        this.mediaRecorder.pause();
        btn.textContent = '🔴';
      }
    },
    handleStopButton() {
      this.mediaRecorder.stop();
      this.$refs.recBtn.textContent = '🔴';
      this.$refs.recBtn.disabled = true;
      this.$refs.audio.hidden = false;
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
              // Recording may have stopped without being paused.
              if (this.dateWhenRecLastActive > this.dateWhenRecLastInactive) {
                this.dateWhenRecLastInactive = new Date();
                this.adjustRecDuration();
              }
              this.$refs.recBtn.disabled = true;
              this.$refs.stopBtn.disabled = true;
              this.$refs.saveBtn.disabled = false;
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
  background-image: url("../public/upfeathers.png");
  background-repeat: repeat;
}

.controls {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  gap: 1%;
}

.title {
  text-align: center;
}

.recorder {
  text-align: center;
}

.page {
  display: flex;
  flex-direction: column-reverse;
  margin-left: 15%;
  margin-right: 15%;
  overflow: scroll;
  border-style: solid;
  border-color: #f2eecb;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom: none;
  padding: 0.5%;
  height: fit-content;
  background-color: #f2eecb;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.354);
}

.page-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  flex:  2;
  min-height: 40%;
  padding-top: 2%;

}

.editor {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #945100;
  padding: 1%;
  margin-top: auto;
  height: 5%;
  border-style: ridge;
  border-color: #945100;
  border-radius: 10px;
  border-width: thick;
  height: fit-content;
}

.recorder-container {
  margin-bottom: 1%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1%;
}

.editor2 {
  max-width: 80%;
}

.rec-controls{
  background-color: transparent;
  border-style: none;
  font-size: 150%;
}

</style>
