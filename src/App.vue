<template>
  <div class='container'>
    <div class='header'>
          <h1 class='title'>Time:stamp</h1>
          <div class='recorder-container'>
            <button @click='handleRecButton'>⏺</button>
            <audio controls ref="audio"></audio>
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
      mediaRecorder: Object,
      chunks: [],
      recTimeIntervals: [],
      recStarted: Boolean
    }
  },
  created() {
    // this.notes= [
    //   {id: "1", text: "a"},
    //   {id: "2",text: "b"}, {id: "3",text: "c"},{id: "4",text: "d"},{id: "5",text: "e"}
    // ];
    this.mode = false;
    this.initRecorder();
    this.recStarted = false;
  },
  methods: {
    addnote(timestamp, content) {
      // t is unused for now
      // this.notes.push({id: this.notes.length+1, text: content})
      console.log(timestamp - this.recTimeIntervals[0]);
      var id = 0;
      if(this.mediaRecorder.state === 'recording') {
        id = (timestamp - this.recTimeIntervals[this.recTimeIntervals.length - 1]);
      } else {
        if(this.recTimeIntervals.length === 0) {
          id = 0;
        } else {
          id = this.$refs.audio.duration;
        }
      }
      this.notes.push({ id:  id, text: content });
    },
    handleRecButton(e) {
      const btn = e.target;
      if (this.mediaRecorder.state != 'recording') {
        if (!this.recStarted) {
          this.recStarted = true;
          this.mediaRecorder.start();
        } else {
          this.mediaRecorder.resume();
        }
        btn.textContent = '⏸';
        // console.log(this.mediaRecorder.state); // debug
      } else {
        // assert(this.startTime >= 0); // debug
        this.mediaRecorder.pause();
        btn.textContent = '⏺';
        // console.log(this.mediaRecorder.state);  // debug
      }
    },
    handleSaveButton() {
      this.mediaRecorder.stop();
    },
    initRecorder() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ audio: true, })
          // Success callback
          .then((stream) => {
            // Handle events from the recorder 
            this.mediaRecorder = new MediaRecorder(stream);
            this.mediaRecorder.onstart = () => {
               const timeRecStarted = new Date();
               this.recTimeIntervals.push(timeRecStarted);
               console.log(timeRecStarted); // debug
            };
            this.mediaRecorder.onresume = () => {
              const timeRecResumed = new Date();
              this.recTimeIntervals.push(timeRecResumed);
              console.log(timeRecResumed); // debug
              this.mediaRecorder.requestData();
            };
            this.mediaRecorder.ondataavailable = (e) => {
              this.chunks.push(e.data);
            };
            this.mediaRecorder.onpause = () => {
              const timeRecPaused = new Date();
              this.recTimeIntervals.push(timeRecPaused);
              console.log(timeRecPaused); // debug
            };
            this.mediaRecorder.onstop = () => {
              //this.recStarted = false;
              const timeRecStopped = new Date();
              this.recTimeIntervals.push(timeRecStopped);
              console.log(timeRecStopped); // debug
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
