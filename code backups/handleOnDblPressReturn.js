/* 
     * Double press 'Return' key  to submit note.
     * Returns false to prevent the event propagation. 
     * Unused for now
     * NOTE: If this function is uncommented, 
     * add waiting_for_press2: false to data()
     */
    // dblEnter(e) {
    //   const key_code = e.keyCode;
    //   if(key_code === 13) { 
    //     if(this.waiting_for_press2) {
    //         this.addNote();
    //         return false;
    //     } else {
    //       this.waiting_for_press2 = true;
    //     }
    //   } else {
    //     this.waiting_for_press2 = false;
    //   }
    // },