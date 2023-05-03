<template>
  <div class='container'>
    <div class='header'>
        <div class="banner">
          <!-- <button  ref="loginBtn"
                  @click="handleLoginButton">
            <u>log in</u>
          </button> -->
          <h1 style="text-align: center; color: black;">Timestamp</h1>
          <!-- <button ref="settingsBtn">
            <u>preferences</u>
          </button> -->
        </div>
        <div class='recorder-container'>
          <MyRecorder v-if="!recFinished"
                      :recDuration="recDuration"
                      :dateWhenRecLastActive="dateWhenRecLastActive"
                      :dateWhenRecLastInactive="dateWhenRecLastInactive"
                      :triggerReset="triggerReset"
                      @recorder-started="setDateWhenRecLastActive"
                      @recorder-paused="setDateWhenRecLastInactive"
                      @recorder-resumed="setDateWhenRecLastActive"
                      @recorder-stopped="setDateWhenRecLastInactive"
                      @attach-audio="initializePlayer"/>
          <MyPlayer v-if="recFinished"
                    @save-notes="handleSaveNotes"
                    @reset="handleReset"
                    :audioURL="audioURL"
                    :timestamp="timestamp"/>
        </div>
    </div>
    <div class='page-container'>
        <MyPage :newNote="newNote"
                @seek-to-timestamp="seekTo"
                :triggerReset="triggerReset"
                :triggerSaveNotes="triggerSaveNotes"/>
    </div>
    <div class="editor-container">
        <MyEditor :recDuration="recDuration"
                  :dateWhenRecLastActive="dateWhenRecLastActive"
                  :dateWhenRecLastInactive="dateWhenRecLastInactive"
                  :triggerReset="triggerReset"
                  @add-note="addNote"/>
    </div>
  </div>
</template>


<script>
import MyEditor from './components/MyEditor.vue'
import MyPage from './components/MyPage.vue'
import MyRecorder from './components/MyRecorder.vue'
import MyPlayer from './components/MyPlayer.vue'


export default {
  name: 'App',
  components: {
    MyEditor,
    MyPage,
    MyRecorder,
    MyPlayer
  },
  data() {
    return {
      /* Whenever the user saves a new note, it is stored in here */
      newNote: Object,
      noteIdCounter: Number,
      /* Keep track of write/edit mode. May not need this feature after all. */
      mode: Boolean,
      /* Seek to a particular timestamp (in seconds) */
      timestamp: Number,
      audioURL: String,
      recFinished: Boolean,
      triggerSaveNotes: Boolean,
      triggerReset: Boolean,
      /* We need the following 3 variables to compute a note's timestamp. */
      recDuration: Number,
      dateWhenRecLastActive: Date,
      dateWhenRecLastInactive: Date,
    }
  },
  created() {
    this.mode = false;
    this.apiCall('/api'); // test call TODO delete
    this.timestamp = 0;
    this.dateWhenRecLastActive = this.dateWhenRecLastInactive = new Date();
    this.recDuration = 0;
    this.noteIdCounter = 0;
    this.recFinished = false;
    this.newNote = null;
    this.triggerSaveNotes = false;
    this.triggerReset = false;
  },
  methods: {
    setDateWhenRecLastActive(date) { this.dateWhenRecLastActive = date; },
    setDateWhenRecLastInactive(date) {
      this.dateWhenRecLastInactive = date;
      this.recDuration += this.dateWhenRecLastInactive
                        - this.dateWhenRecLastActive;
    },
    async apiCall(target) {
      const response = await fetch(target);
      const body = await response.text();
      console.log(body);
    },
    /*
     * Given dateNoteTaken, compute the timestamp.
     * Must convert milliseconds -> seconds.
     */
    computeTimestamp(dateNoteTaken) {
      let timestamp = 0;
      if(this.dateWhenRecLastActive > this.dateWhenRecLastInactive) {
        timestamp = this.recDuration
                  + (dateNoteTaken - this.dateWhenRecLastActive);
      } else {
        timestamp = this.recDuration;
      }
      timestamp = Math.floor(timestamp / 1000);
      return timestamp;
    },
    addNote(dateNoteTaken, content) {
      // May have started writing before hitting 'record'
      if (dateNoteTaken < this.dateWhenRecLastActive) {
        dateNoteTaken = this.dateWhenRecLastActive;
      }
      const id = this.noteIdCounter++;
      this.newNote = {
        id: id,
        timestamp: this.computeTimestamp(dateNoteTaken),
        text: content
      }
    },
    seekTo(timestamp) {
      console.log(timestamp);
      this.timestamp = timestamp;
    },
    initializePlayer(url) {
      this.recFinished = true;
      this.audioURL = url;
    },
    /* Called whenever the recording is inactive i.e. on pause/stop. */
    // handleLoginButton() {
    //   const user = prompt("Email");
    //   if (user !== null) {
    //     const pw = prompt("Password");
    //     if (pw !== null) {
    //       this.apiCall('/api/login');
    //     }
    //   }
    // },
    handleSaveNotes() { this.triggerSaveNotes = !this.triggerSaveNotes; },
    handleReset() {
      this.triggerReset = !this.triggerReset;
      this.dateWhenRecLastActive = this.dateWhenRecLastInactive = new Date();
      this.recDuration = 0;
      this.recFinished = false;
      this.noteIdCounter = 0;
    }
  }
}
</script>


<style scoped>
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
/*  background-image: url("../public/upfeathers.png");*/
  background-color: lightgreen;
  font-family: Lucida Sans Typewriter;
}

.header {
  width: 70%;
  align-self: center;
}

.banner {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.page-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  flex:  2;
  min-height: 50%;
  padding-top: 2%;
  width: 75%;
  align-self: center;
}

.editor-container {
  display: flex;
  justify-content: center;
  padding: 1%;
  margin-top: 5px;
  border:none;
  border-color: white;
  border-width: thin;
  height: 30px;
  width: 100%;
  align-self: center;
  margin-bottom: 1%;
}

u {
  font-size: 12px;
}

button {
  border-style: none;
  background-color: transparent;
}
</style>
