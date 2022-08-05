<template>
  <div class='container'>
    <div id='header'>
          <h1 id='title'>Time:stamp</h1>
          <div id='controls'>
            <button @click='toggle_record'>record</button>
            <button>rewind</button>
            <button @click='toggle_play'>play</button>
            <button>forward</button>
          </div>
    </div>
    <div id='canvas'>
      <div id='page'>
        <MyPage :notes="notes" :mode="mode" />
      </div>
    </div> 
    <div id="editor">
        <MyEditor :mode="mode" @add-note="addnote" @toggle-mode="toggle_mode" :id="set_new_id"/>
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
      mode: Boolean
      }
  },
  created() {
    this.notes= [
      {id: "1", text: "a"},
      {id: "2",text: "b"}, {id: "3",text: "c"},{id: "4",text: "d"},{id: "5",text: "e"}
    ];
    this.mode = false;
  },
  methods: {
    addnote(t, content) {
      // t is unused for now
      this.notes.push({id: this.notes.length+1, text: content})
    },
    toggle_record(el) {
      const elem = el.target
      if (elem.textContent == 'record') {
        elem.textContent = 'pause'
      } else {
        elem.textContent = 'record'
      }
    },
    toggle_play(el) {
      const elem = el.target
      if (elem.textContent == 'play') {
        elem.textContent = 'pause'
      } else {
        elem.textContent = 'play'
      }
    },
    toggle_mode(value) {
      this.mode = value;
    }

  }
}
</script>

<style>
#app{
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
  /* background-color: palegoldenrod; */
  /* color: white; */
}

#controls {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  gap: 1%;
}

#title {
  text-align: center;
}

#recorder {
  text-align: center;
}

#page {
  display: flex;
  flex-direction: column-reverse;
  margin-left: 15%;
  margin-right: 15%;
  overflow: scroll;
  border-style: ridge;
  border-color: lightcoral;
  border-radius: 10px;
  padding: 0.5%;
  min-height: fit-content;
  /* background-color: lightgoldenrodyellow; */
  background-color: #f2eecb;
}

#canvas {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex:  2;
  min-height: 40%;

}

#editor {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: lightsalmon;
  padding: 1%;
  margin-top: 2%;
  min-height: 10%;
  border-style: ridge;
  border-color: coral;
  border-radius: 10px;
}

#controls {
  margin-bottom: 2%;
}
</style>
