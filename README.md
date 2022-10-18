# timestamp
## Description
A VueJS app that allows you to synchronize an audio recording to your notes using timestamps.

## Motivation
To build a free, cross-platform application that facilitates note taking during lectures, presentations and interviews.

## Features
- Hitting the `<Return>` key for a new line clears the text in the editor and adds the new note to the page together with its timestamp.
- Clicking on a timestamp `t` will seek to `time = t` of the recording.
- Ability to pause the recording and resume at any time.
- Double click a note on the page to edit.
  
## Design choices
  - Implemented using the Vue Options API.
  - Typewriter-like UI deemed suitable for live note-taking. Allows for implementation of the page and the editor as separate components.
  - The page is implemented as a list rendering of note components.
  - A left margin separates the timestamps from the text and makes the page look like a notebook page.
  - No use of third party libraries - only vanilla CSS.
  
## Audio recording
The application makes use of the [MediaStream Recording API](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API) equiped within the browser. Because the API does not track the duration of recorded audio, the following algorithm was implemented to compute a note's timestamp:
  - Keep track of the date when the audio recorder was last active (started/resumed) & inactive (paused/stopped).
  - Compute the audio duration each time the recorder is inactive.
  - Mark the date whenever the editor goes from being empty to being not empty.
  - If a note is saved, its timestamp can be computed using the above properties i.e. `dateWhenRecLastActive`, `dateWhenRecLastInactive`, `audioDuration` and `dateNoteTaken`.
  
 **Complexity**: O(1).
 
  Let `n` represent the amount of times the recording has been started, paused, resumed and stopped.
  Adjusting the `audioDuration` property every time the recorder becomes inactive acts as an accumulator and ensures that computing a timestamp does not depend on `n`.
  
## Issues
  Only the Mozilla Firefox browser allows for highlighting of multiple notes on the page.
  
## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


