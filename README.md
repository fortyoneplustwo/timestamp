# timestamp

## Features
- Hitting <Return> for a new line clears the text in the editor and adds the new note to the page together with its timestamp.
- Click on a timestamp to seek to that section of the recording.
- Ability to pause the recording and resume at any time.
- Double click a note on the page to edit.
  
## Design
  - Implemented using the Options API.
  - Typewriter-like UI deemed suitable for live note-taking. Allows for separation of logic between the page of notes and the editor.
  - The page is implemented as a list rendering of note components.
  - A red left margin (implemented in CSS) visually separates the timestamp from the text inside a note component. The margin makes the page look like a real notebook page.
  - No use of third party libraries - only vanilla CSS.
  
## Audio recording
The application makes use of the MediaStream Recording API that comes with the browser to record audio. Since the API does not track the length of recorded audio, the following algorithm was implemented to compute a note's timestamp:
  - Mark the date (including time) when the audio recorder was last active and when it was last inactive.
  - Compute and adjust the recording duration whenever the recorder is inactive.
  - Mark the date when the editor goes from being empty to being not empty.
  - If the note is saved, compute its timestamp using the above information.
  
 Complexity: O(n)
  
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


