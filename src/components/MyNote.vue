<template>
    <li contenteditable class="line" @change="handleNoteEdit">
      <button contenteditable="false"
              :value="timestampMillisecs"
              @click="$emit('seek-to-timestamp', note.timestamp)"
              class="timestamp-btn">
              {{ timestampMinSec }}
      </button>
      <span class="noteContent">{{ note.text }}</span>
    </li>
</template>

<script>
export default {
  name: 'MyNote',
  props: {
    note: Object,
    index: Number
	},
  computed: {
    timestampMinSec() {
      let min = Math.floor(this.note.timestamp / 60);
      let sec = this.note.timestamp - Math.floor(this.note.timestamp / 60) * 60;
      let zeroPaddedMin = min < 10 ? '0' + min.toString() : min.toString();
      let zeroPaddedSec = sec < 10 ? '0' + sec.toString() : sec.toString();
      return zeroPaddedMin + ':' + zeroPaddedSec;
		},
    timestampMillisecs() {
      return this.note.timestamp.toString();
    }
	}
}
</script>

<style scoped>

  .line {
    font-family: Lucida Sans Typewriter,Lucida Console,monaco,Bitstream Vera Sans Mono,monospace;
    font-size: 13px;
    padding-left: 1%;
    padding-right: 1%;
		position: relative;
		display: flex;
	height: 15px; /* this is a temp soln. check if editor is saving empty lines correctly */
  }

  .line .timestamp-btn {
    font-family: Lucida Sans Typewriter, Lucida Console, monaco, Bitstream Vera Sans Mono, monospace;
    font-size: 12px;
    outline: none;
    box-shadow: none;
    color: blue;
    background: transparent;
    margin-right: 0.5%;
    margin-left: 1px;
    padding-left: 0;
		position: absolute;
    user-select: none;
    border: none;
  }

	.line .noteContent {
		padding-left: 50px;
	}
</style>
