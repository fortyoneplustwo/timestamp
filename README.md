# timestamp
## Hosting URL
https://timestamp-82e51.web.app

## Description
A VueJS app that allows you to synchronize an audio recording to your notes using timestamps.

## Motivation
To build a free, cross-platform application that facilitates note taking during lectures, presentations and interviews.

## Features
- Press the `<Return>` key to save a note.
- Click on a timestamp `t` to play the recorded audio at `time = t`.
- Pause the recording and resume at any time.
- Double click a note to edit it.
- Click the copy button to copy the entire page of notes to the clipboard.
  
## Design choices and implementation
  - Implemented using the Vue Options API.
  - Typewriter-inspired UI has the page growing from top to bottom as more notes are added. Such a design allows for implementation of the page and the editor as separate components.
  - The page is implemented as a list rendering of note components.
  - A left margin separates the timestamps from the text and makes the page look like a notebook page.
  - Designed in vanilla CSS
## Audio recording
The application makes use of the [MediaStream Recording API](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API) native to the browser. The API does not track the duration of recorded audio, so we have to keep track of it ourselves in order to calculate a note's timestamp.

## Timestamp algorithm
  - Keep track of the date when the audio recorder was last active (started/resumed) & inactive (paused/stopped). Call these properties `dateWhenRecLastActive` and `dateWhenRecLastInactive` respectively.
  - Adjust the recording's duration, `recDuration`, each time the recorder becomes inactive.
  - Mark the date, `dateNoteTaken`, whenever the user takes a new note. Its timestamp can be computed using the following computation.

  ```
   if dateWhenRecLastActive > dateWhenRecLastInactive then
    timestamp = recDuration + (dateNoteTaken - dateWhenRecLastInactive)
   else 
    timestamp = recDuration
   ```
  
 **Complexity**: O(1)
 
 **Comments**: Let `n` represent the number of times the recording has been started + paused + resumed + stopped.
  Adjusting the properties `dateWhenRecLastActive`, `dateWhenRecLastInactive` and `recDuration` is a constant time operation which can happen at most `n` times.
   
  
## Issues
  Only the Mozilla Firefox browser allows for highlighting of multiple notes across the page.
  
  **Possible solution**: The copy button solves this problem if you want to copy **all** notes.
  
## Credits
[Handdrawn CSS](https://fxaeberhard.github.io/handdrawn.css/) by Francois-Xavier Aeberhard.
 
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


