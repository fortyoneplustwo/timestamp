<template>
<div class="recorder">
  <button class="rec-controls"
          ref="recBtn"
          @click="handleRecBtn">
    <i ref="recBtnIcon" class="gg-record"></i>
  </button>
  <button class="rec-controls"
          ref="stopBtn"
          disabled="true"
          @click="handleStopButton">
    <i class="gg-play-stop-r"></i>
  </button>
</div>
</template>

<script >
export default {
  name: 'MyRecorder',
  props: {
    recDuration: Number,
    dateWhenRecLastActive: Date,
    dateWhenRecLastInactive: Date,
    timestamp: Number,
    triggerReset: Boolean
  },
  data() {
    return {
      mediaRecorder: Object,
      /* Buffer for audio recording  */
      chunks: [],
      /*
       * Because the MediaRecorder API doesn't provide a currentTime attribute,
       * we need to keep track of the recording's duration
       * by updating the following 4 variables on start/pause/resume/stop.
       */
      recFinished: Boolean
    }
  },
  mounted() {
    this.initRecorder();
    this.recFinished = false;
  },
  watch: {
    triggerReset() {
      this.chunks = [];
    }
  },
  methods: {
    initRecorder() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ audio: true, })
          // Success callback: Register recorder event listeners
          .then((stream) => {
            this.mediaRecorder = new MediaRecorder(stream);
            // handle onstart event
            this.mediaRecorder.onstart = () => {
              this.chunks = [];
              this.$emit('recorder-started', new Date());
              this.$refs.stopBtn.disabled = false;
            };
            // handle ondataavailable event
            this.mediaRecorder.ondataavailable = (e) => {
              this.chunks.push(e.data);
            };
            // handle onresume event
            this.mediaRecorder.onresume = () => {
              this.$emit('recorder-resumed', new Date());
              this.mediaRecorder.requestData();
            };
            // handle onpause event
            this.mediaRecorder.onpause = () => {
              this.$emit('recorder-paused', new Date());
            };
            // handle onstop event
            this.mediaRecorder.onstop = () => {
              // Recording may have stopped without having been paused.
              if (this.dateWhenRecLastActive > this.dateWhenRecLastInactive) {
              this.$emit('recorder-stopped', new Date());
              }
              const blob = new Blob(this.chunks, {type: "audio/ogg; codecs=opus"});
              const audioURL = window.URL.createObjectURL(blob);
              this.$emit('attach-audio', audioURL);
            };
          })
          // Error callback
          .catch(function (err) {
            console.error(`The following getUserMedia error occurred: ${err}`);
          });
      } else {
        console.log("getUserMedia not supported on your browser!");
      }
    },
    /*
     * Record button can toggle between (start)resume/pause.
     * Stop is handled by a separate button.
     */
    handleRecBtn() {
      if (this.mediaRecorder.state != 'recording') {
        if (this.dateWhenRecLastActive === this.dateWhenRecLastInactive) {
          this.mediaRecorder.start();
        } else {
          this.mediaRecorder.resume();
        }
        this.$refs.recBtnIcon.classList.replace("gg-record", "gg-play-pause-r");
      } else {
        this.mediaRecorder.pause();
        this.$refs.recBtnIcon.classList.replace("gg-play-pause-r","gg-record");
      }
    },
    handleStopButton() {
      this.mediaRecorder.stop(); // see implementation in initRecorder()
      this.$refs.recBtn.hidden = true;
      this.$refs.stopBtn.hidden = true;
      this.recFinished = true;
    }
  }
}
</script>

<style scoped>
@import url('https://unpkg.com/css.gg@2.0.0/icons/css/record.css');
@import url('https://unpkg.com/css.gg@2.0.0/icons/css/play-pause-r.css');
@import url('https://unpkg.com/css.gg@2.0.0/icons/css/play-stop-r.css');


.recorder {
  display: flex;
  justify-content: center;
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
  font-size: 175%;
  pointer-events: visible;
  color: black;
}
</style>
