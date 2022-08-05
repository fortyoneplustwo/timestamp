<template>
  <!-- <button id='timestamp'>t={{ id }}</button> -->
  <div id='line' ref='textarea' >
    <button id='timestamp'>t={{ id }}</button>
    <hr id="separator">
    <span id="textarea"> {{ text }} </span>
    <input class='checkbox' type="checkbox" v-if="mode">
  </div>  
  <!-- <button id='copy' v-if="mode" @click='copy'><i class="fa fa-copy"></i></button> -->
  

</template>


<script>
export default {
  name: 'MyNote',
  props: {
    note: Object,
    mode: Boolean
  },
  data() {
    return {
      text: this.note.text,
      id: this.note.id
    }
  },
  methods: {
    copy() {
      /* Need to append text to document body for copying to clipboard. Rewrite this using API */
      let text = this.$refs.textarea.innerText
      let elem = document.createElement("textarea")
      document.body.appendChild(elem)
      elem.value = text
      elem.select()
      document.execCommand("copy")
      document.body.removeChild(elem)
    }
  }
}
</script>

<style scoped>
  #line {
  display: flex;
  height:  auto;
  width: 100%;
  padding: 1% 2% 1% 2%;
  outline: none;
  border-style: dotted;
  border-inline-end-style: hidden;
  border-inline-start-style: hidden;
  border-top: none; 
  /* border-color: #efe6d5; */
  border-color: rgb(30, 108, 253);
  box-sizing: border-box;
  white-space: pre-wrap;
  background-color: transparent;
  /* height: fit-content; */
  word-break: break-all;
}


#timestamp {
  width: 70px;
  text-align: center;
  display: inline-block;
  cursor: pointer;
  padding: 5px 16px;
  font-size: 14px;
  font-weight: 500;
  vertical-align: middle;
  border: 1px solid;
  border-radius: 5%;
  background-color: transparent;
  border-color: #1b1f2326;
  border-radius: 20%;
  border: none;
  color: darkred;
  margin-right: 2%;
}

.checkbox {
  cursor: pointer;
  border: none;
  margin-left: auto;
}

#separator{
  margin-left: 0;
  margin-right: 2%;
  margin-top: -2%;
  margin-bottom: -5%;
  border-color: red;
  /* align-self: stretch; */
}

#textarea {
  margin-right: auto;
}
</style>

