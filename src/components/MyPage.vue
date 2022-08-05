<template>
  <!-- <li id="saved-note" :key="note.id" v-for="note in notes">
    <MyNote :note="note" v-bind:mode="mode"/>
  </li> -->
  <ul class="list" style="list-style-type: none; margin: 0; padding: 0;">
    <li id="saved-note" v-for="note in notes" :key="note.id">
      <MyNote :note="note" v-bind:mode="mode"/>
		</li>
  </ul>
</template>


<script> 
import MyNote from './MyNote.vue'


export default {
  name: 'MyPage',
  components: {
    MyNote
  },
  props: {
    notes: Array,
    mode: Boolean
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#saved-note {
  display: flex;
  flex-direction: row;
  margin: 0.2%;
  height: fit-content;
  border-left: none;
  border-right: none;
}
</style>
