<template>
  <div class='container'>
    <div class='header'>
          <h1 class='title'>Time:stamp</h1>
          <div class='recorder-container'>
            <button ref="recBtn" @click='handleRecButton'>⏺</button>
            <button ref="stopBtn" disabled="true" @click="handleStopButton">⏹</button>
            <audio controls ref="audio"></audio>
            <button ref="saveBtn" disabled="true" @click="handleSaveButton">⬇️</button>
          </div>
    </div>
    <div class='canvas'>
      <div class='page'>
        <MyPage :notes="notes" :mode="mode" />
      </div>
    </div> 
    <div class="editor">
        <MyEditor :mode="mode" @add-note="addnote"/>
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
      recStarted: Boolean,
      recStopped: Boolean
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
    /*
     * Given actual date  on which note was taken,
     * compute the timestamp relative to the date when the recording first started.
     */
    computeTimestamp(dateNoteTaken) {
      // TODO replace this algorithm with one that uses an accumulator
      // so as toavois O(n) cost each time a note is added.
      // But keep recTimeIntervals log just in case we need it later.
      var timestamp = 0;
      if(this.mediaRecorder.state === 'recording') {
        // Can assume recTimeIntervals. length is odd and the last log is a record log
        for(var i = 0; i < this.recTimeIntervals.length - 2; i+=2) {
          const timeRecPaused = this.recTimeIntervals[i+1];
          const timeRecResumed = this.recTimeIntervals[i];
          timestamp += timeRecPaused - timeRecResumed;
        }
        timestamp += dateNoteTaken - this.recTimeIntervals[this.recTimeIntervals.length - 1];
      } else {
        if(this.recTimeIntervals.length === 0) {
          timestamp = 0;
        } else {
          // Can assume recTimeIntervals.length is even and the last log is a pause log
          for(var i = 0; i < this.recTimeIntervals.length - 1; i+=2) {
            const timeRecPaused = this.recTimeIntervals[i+1];
            const timeRecResumed = this.recTimeIntervals[i];
            timestamp += timeRecPaused - timeRecResumed;
          }
        }
      }
      return Math.floor(timestamp/1000);
    },
    addnote(dateNoteTaken, content) {
      // this.notes.push({id: this.notes.length+1, text: content})
      // console.log(dateNoteTaken - this.recTimeIntervals[0]);
      const timestamp = this.computeTimestamp(dateNoteTaken);
      const id = this.notes.length;
      this.notes.push({ id: id, timestamp: timestamp, text: content });
      for(var i = 0; i < this.recTimeIntervals.length; i++) { console.log('intervals: %s', this.recTimeIntervals[i]); }
      console.log('---------');
      console.log('date note taken: %s', dateNoteTaken);
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
    handleStopButton() {
      // If somehow the recording has stopped without being paused
      //  for e.g. disconnected microphone
      //  then append current date to our recTimeIntervals array.
      // This ensures the length of our array is always even when not recording.
      if(this.recTimeIntervals.length / 2 != 0) {
        const timeRecStopped = new Date();
        this.recTimeIntervals.push(timeRecStopped);
      }
      this.mediaRecorder.stop();
      this.$refs.recBtn.textContent = '⏺';
      this.$refs.recBtn.disabled = true;
    },
    handleRecStartEvent() {
      this.mediaRecorder.onstart = () => {
        const timeRecStarted = new Date();
        this.recTimeIntervals.push(timeRecStarted);
        this.$refs.stopBtn.disabled = false;
      };
    },
    handleRecResumeEvent() {
      this.mediaRecorder.onresume = () => {
        const timeRecResumed = new Date();
        this.recTimeIntervals.push(timeRecResumed);
        this.mediaRecorder.requestData();
      };
    },
    handleRecDataAvailableEvent() {
      this.mediaRecorder.ondataavailable = (e) => {
        this.chunks.push(e.data);
      };
    },
    handleRecPauseEvent() {
      this.mediaRecorder.onpause = () => {
        const timeRecPaused = new Date();
        this.recTimeIntervals.push(timeRecPaused);
      };
    },
    handleRecStopEvent() {
      this.mediaRecorder.onstop = () => {
        //this.recStarted = false;
        this.timeRecStopped = new Date();
        this.recTimeIntervals.push(this.timeRecStopped);
        this.$refs.stopBtn.disabled = true;
        this.$refs.saveBtn.disabled = false;
        const blob = new Blob(this.chunks, { type: "audio/ogg; codecs=opus" });
        const audioURL = window.URL.createObjectURL(blob);
        this.$refs.audio.src = audioURL;
      };
    },
    initRecorder() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ audio: true, })
          // Success callback
          .then((stream) => {
            this.mediaRecorder = new MediaRecorder(stream);
            this.handleRecStartEvent();
            this.handleRecStopEvent();
            this.handleRecResumeEvent();
            this.handleRecPauseEvent();
            this.handleRecDataAvailableEvent();
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
