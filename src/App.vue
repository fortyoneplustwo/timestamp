<template>
  <div class='container'>
    <div class='header'>
          <h1 class='title'>Time:stamp</h1>
          <div class='recorder-container'>
            <button ref="recBtn" @click='handleRecButton'>⏺</button>
            <button ref="stopBtn" disabled="true" @click="handleStopButton">⏹</button>
            <audio hidden controls ref="audio"></audio>
            <button ref="saveBtn" disabled="true" @click="handleSaveButton">⬇️</button>
          </div>
    </div>
    <div class='canvas'>
      <div class='page'>
        <MyPage @seek-to-timestamp="seekToTimestamp" :notes="notes" :mode="mode" />
      </div>
    </div> 
    <div class="editor">
        <MyEditor :mode="mode" @add-note="addNote" @toggle-mode="toggleMode"/>
    </div>
  </div>
</template>

<script>
import MyPage from './components/MyPage.vue'
import MyEditor from './components/MyEditor.vue'

export default {
  name: 'App',
  components: {
    MyPage,
    MyEditor
  },
  data() {
    return {
      notes: [],
      mode: Boolean,
      mediaRecorder: Object,
      chunks: [],
      recDuration: Number,
      dateWhenRecLastActive: Number,
      dateWhenRecLastInactive: Number
    }
  },
  created() {
    this.mode = false;
    this.initRecorder();
    /*
     * Because the MediaRecorder API doesn't provide a currentTime attribute,
     * we implement our own algorithm to calculate a note's timestamp.
     * This requires that we keep updating the following variables:
     */
    this.dateWhenRecLastActive = 0;
    this.dateWhenRecLastInactive = 0;
    this.recDuration = 0;
  },
  methods: {
    addNote(dateNoteTaken, content) {
      const id = this.notes.length;
      // Given dateNoteTaken, compute a note's timestamp.
      let timestamp = 0;
      if(this.dateWhenRecLastActive > this.dateWhenRecLastInactive) {
        timestamp = this.recDuration + (dateNoteTaken - this.dateWhenRecLastActive);
      } else {
        timestamp = this.recDuration;
      }
      // Milliseconds -> Seconds
      timestamp = Math.floor(timestamp / 1000);
      this.notes.push(
        { 
          id: id, 
          timestamp: timestamp, 
          text: content
        }
      );
    },
    seekToTimestamp(t) {
      this.$refs.audio.currentTime = t;
      this.$refs.audio.play();
    },
    toggleMode() {
      this.mode = !this.mode;
    },
    /*
     * Called whenever the recording has paused/stopped.
     */
    adjustRecDuration() {
      this.recDuration += this.dateWhenRecLastInactive - this.dateWhenRecLastActive;
    },
    handleRecButton(e) {
      const btn = e.target;
      if (this.mediaRecorder.state != 'recording') {
        if (this.dateWhenRecLastActive === 0) {
          this.mediaRecorder.start();
        } else {
          this.mediaRecorder.resume();
        }
        btn.textContent = '⏸';
      } else {
        this.mediaRecorder.pause();
        btn.textContent = '⏺';
      }
    },
    handleStopButton() {
      this.mediaRecorder.stop();
      this.$refs.recBtn.textContent = '⏺';
      this.$refs.recBtn.disabled = true;
      this.$refs.audio.hidden = false;
    },
    initRecorder() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ audio: true, })
          // Success callback
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
              this.$refs.stopBtn.disabled = true;
              this.$refs.saveBtn.disabled = false;
              const blob = new Blob(this.chunks, { type: "audio/ogg; codecs=opus" });
              const audioURL = window.URL.createObjectURL(blob);
              this.$refs.audio.src = audioURL;
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
.app{
  font-family: Avenir, Helvetica, Arial, sans-serif;
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
  border-style: ridge;
  border-color: lightcoral;
  border-radius: 10px;
  padding: 0.5%;
  min-height: 20%;
  background-color: #f2eecb;
}

.canvas {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex:  2;
  min-height: 40%;
}

.editor {
  display: flex;
  background-color: lightsalmon;
  padding: 1%;
  margin-top: 5%;
  min-height: 10%;
  border-style: ridge;
  border-color: coral;
  border-radius: 10px;
}

.recorder-container {
  margin-bottom: 5%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1%;
}
</style>
