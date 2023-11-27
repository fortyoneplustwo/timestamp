# timestamp

## Notestamp: an improved version of Timestamp with a real rich text editor
https://notestamp.com

## Demo
https://timestamp-82e51.web.app
Warning: This project is not mobile-friendly. 

## Description
A single page application that allows you to synchronize an audio recording to your notes using timestamps.

## Motivation
To build a free web application that facilitates note taking during lectures, presentations and interviews.

## Features
- Click on a timestamp `t` to play the recorded audio at `time = t`.
- Download notes as a .txt file
  
## UI choices and implementation
As an alternative to building my own text editor I decided to experiment with an html list element. The page is implemented as a content-editable unordered list. Each list item is a Vue component that holds a button, a margin and some text content.
The final result works exactly like a regular text editor except that pasting multiple lines has undefined behaviour, therefore pasting has been disabled.

## Audio recording
The application makes use of the [MediaStream Recording API](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API) native to the browser. The API does not track the duration of recorded audio, so I implemented a dynamic programming algorithm to compute a note's timestamp. More below.

## Timestamp algorithm
  - Keep track of 2 variables `dateWhenRecLastActive` and `dateWhenRecLastInactive`. Update them whenever the audio recorder is active (started/resumed) & inactive (paused/stopped).
  - Adjust the audio recording's duration, `recDuration`, each time the recorder goes inactive.
  - Mark the date, `dateNoteTaken`, whenever the user starts typing a note in the editor. Its timestamp can be computed using the following computation

  ```
   if dateWhenRecLastActive > dateWhenRecLastInactive then
    timestamp = recDuration + (dateNoteTaken - dateWhenRecLastInactive)
   else 
    timestamp = recDuration
   ```
  
 **Complexity**: O(1)
 
 **Comments**: Let `n` represent the number of times the recording has been started + paused + resumed + stopped.
  Adjusting the properties `dateWhenRecLastActive`, `dateWhenRecLastInactive` and `recDuration` are constant time operations which can happen at most `n` times.

 
## Project setup
```
npm install
vue serve
```
