<template>
<div id="container">
    <button @click='toggle_record'>record</button>
    <button @click='toggle_play'>play</button>
    <input type="range" id="seek-slider">
</div>
</template>

<style>
#container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 1%;
}
</style>