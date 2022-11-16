# timestamp
## Description
A VueJS app that allows you to synchronize an audio recording to your notes using timestamps.

## Motivation
To build a free, cross-platform application that facilitates note taking during lectures, presentations and interviews.

## Features
- Press `<Return>` key to save a note.
- Click on a timestamp `t` to seek to `time = t` of the recording.
- Ability to pause the recording and resume at any time.
- Double click a note to edit it.
- Click the copy button to copy the full page of notes to the clipboard.
  
## Design choices
  - Implemented using the Vue Options API.
  - Typewriter-inspired UI has the page growing from top to bottom as more notes are added. Such a design allows for implementation of the page and the editor as separate components.
  - The page is implemented as a list rendering of note components.
  - A left margin separates the timestamps from the text and makes the page look like a notebook page.
  - No use of third party libraries - only vanilla CSS.
  
## Audio recording
The application makes use of the [MediaStream Recording API](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API) native to the browser. The API does not track the duration of recorded audio, so the following algorithm was implemented to compute a note's timestamp.

## Algorithm
  - Keep track of the date when the audio recorder was last active (started/resumed) & inactive (paused/stopped).
  - Compute the audio duration each time the recorder becomes inactive.
  - Mark the date whenever a user begins typing a new note.
  - If a note is saved, its timestamp can be computed using the above properties i.e. `dateWhenRecLastActive`, `dateWhenRecLastInactive`, `audioDuration` and `dateNoteTaken`.
  
 **Complexity**: O(1).
 
 **Justification**: Let `n` represent the amount of times the recording has been started, paused, resumed and stopped.
  Adjusting the `audioDuration` property every time the recorder becomes inactive ensures that the computation of a timestamp does not depend on `n`.
  
## Issues
  Only the Mozilla Firefox browser allows for highlighting of multiple notes across the page.
  
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


