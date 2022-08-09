<template>
  <div class='container'>
    <div class='header'>
          <h1 class='title'>Time:stamp</h1>
          <div class='recorder-container'>
            <button @click='handleRecButton'>⏺</button>
            <button @click='handlePlayButton'>▶️</button>
            <input type="range" id="seek-slider">
            <button @click="handleSaveButton">⬇️</button>
          </div>
    </div>
    <div class='canvas'>
      <div class='page'>
        <MyPage :notes="notes" :mode="mode" />
      </div>
    </div> 
    <div class="editor">
        <MyEditor :mode="mode" @add-note="addnote" @toggle-mode="toggle_mode" :time="0"/>
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
      isRecording: Boolean,
      isPlaying: Boolean,
      mediaRecorder: Object,
      chunks: [],
      audio: Object
    }
  },
  created() {
    this.notes= [
      {id: "1", text: "a"},
      {id: "2",text: "b"}, {id: "3",text: "c"},{id: "4",text: "d"},{id: "5",text: "e"}
    ];
    this.mode = false;
    this.initRecorder();
    this.isRecording = false;
    this.isPlaying = false;
    this.audio = document.createElement("audio");
  },
  methods: {
    addnote(t, content) {
      // t is unused for now
      this.notes.push({id: this.notes.length+1, text: content})
    },
    handleRecButton(e) {
      const btn = e.target;
      if (!this.isRecording) {
        this.mediaRecorder.start();
        btn.textContent = '⏹';
        this.isRecording = true;
        console.log(this.mediaRecorder.state); // debug
      } else {
        this.mediaRecorder.stop();
        btn.textContent = '⏺';
        this.isRecording = false;
        console.log(this.mediaRecorder.state);  // debug
      }
    },
    handlePlayButton(e) {
      const btn = e.target;
      if (!this.isPlaying) {
        btn.textContent = '⏸';
        this.isPlaying = true;
        this.audio.play();
      } else {
        btn.textContent = '▶️';
        this.isPlaying = false;
        this.audio.pause();
      }
    },
    handleSaveButton() {},
    toggle_mode(value) {
      this.mode = value;
    },
    initRecorder() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log("getUserMedia supported.");
        navigator.mediaDevices
          .getUserMedia({ audio: true, })
          // Success callback
          .then((stream) => {
            // Register listeners for 'record' and 'save' 
            // only if initialization is successful.
            this.mediaRecorder = new MediaRecorder(stream);
            this.mediaRecorder.ondataavailable = (e) => {
              this.chunks.push(e.data);
            }
            this.mediaRecorder.onstop = () => {
              // set audio source to chunks[]
              const blob = new Blob(this.chunks, { type: "audio/ogg; codecs=opus" });
              const audioURL = window.URL.createObjectURL(blob);
              this.audio.src = audioURL;
            }
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
  flex-direction: row;
  justify-content: space-between;
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
