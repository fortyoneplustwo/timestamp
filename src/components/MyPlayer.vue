<template>
  <div class="toolbar">
    <audio controls ref="audio"></audio>
    <button ref="deleteBtn"
            class="toolbar-btn"
            @click="handleResetButton">
      reset
    </button>
    <button ref="saveBtn"
            class="toolbar-btn"
            @click="handleSaveButton">
      download
    </button>
  </div>
</template>

<script>
export default {
  name: 'MyToolbar',
  props: {
    audioURL: String,
    timestamp: Number
  },
  mounted() {
    this.$refs.audio.src = this.audioURL;
    this.$refs.audio.currentTime = 0;
  },
  watch: {
    timestamp: function (newTimestamp) {
        this.seekTo(newTimestamp);
      }
  },
  methods: {
    seekTo(timestamp) {
      const audio = this.$refs.audio;
      // Quick play-pause required otherwise the audio won't seek to timestamp.
      //  Seems to be a bug in the API
      audio.play(); audio.pause();
      audio.currentTime = timestamp;
      audio.play();
    },
    handleSaveButton() {
      this.$emit('save-notes');
    },
    handleResetButton() {
      this.$emit('reset');
    }
  }
}
</script>

<style>
  .toolbar {
    display: flex;
    justify-content: center;
  }

  .toolbar-btn {
    font-size: small;
    background-color: transparent;
    border-style: none;
  }

  .toolbar-btn:hover {
    text-decoration: underline;
  }
</style>
