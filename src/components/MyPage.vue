<template>
  <ul class="list" style="list-style-type: none; margin: 0; padding: 0;">
    <li class="saved-note" v-for="note in notes" :key="note.id">
      <MyNote @seek-to-timestamp="seekToTimestamp" :note="note" v-bind:mode="mode"/>
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
  },
  methods: {
    seekToTimestamp(t) {
      this.$emit('seek-to-timestamp', t);
    }
  }
}
</script>

<style scoped>
.saved-note {
  display: flex;
  flex-direction: row;
  margin: 0.2%;
  height: fit-content;
  border-left: none;
  border-right: none;
}
</style>
