Module.register('MMM-MyNotes', {

  defaults: {
    maxNotes: 10,
    dateFormat: 'MMM D',
    pollFrequency: 5 * 60 * 1000, //5 minutes;
    showDatePosted: true,
  },

  start: function() {
    this.loaded = false;
    this.notesData = [];

    this.sendSocketNotification("MMM-MYNOTES-GET", this.config);
    var self = this;
    setTimeout(function() {
      self.sendSocketNotification("MMM-MYNOTES-GET", self.config);
    }, this.config.pollFrequency);
  },

  getStyles: function () {
    return ["MMM-MyNotes.css"];
  },

  getScripts: function() {
    return ["moment.js"];
  },

  socketNotificationReceived: function(notification, payload) {
    //only update if a data set is returned.  Otherwise leave stale data on the screen.
    if ( notification === 'MMM-MYNOTES-RESPONSE') {
      this.notesData = payload.data;
      if (this.loaded) {
        this.updateDom();      
      } else {
        this.loaded = true;
        this.updateDom(2000);      
      }
    }

  },

  formatDate: function(dateString) {
    var d = moment(Number(dateString));
    var today = moment();

    if (d.isSame(today, 'day')) {
      return "Today";
    } else if (d.isSame(today.subtract(1, 'days'), 'day')) {
      return "Yesterday";
    } else {
      return d.format(this.config.dateFormat);
    }
  },

  getDom: function() {

    var self = this;

    var wrapper = document.createElement("div");
    wrapper.classList.add("wrapper");

    if (!this.loaded) {
      wrapper.innerHTML = this.translate('LOADING');
      wrapper.className = "dimmed light small";
      return wrapper;
    }

    this.notesData.forEach(function(noteObj) {
      var noteContainer = document.createElement("div");
      noteContainer.classList.add("note-container");

      var noteBody = document.createElement("span");
      noteBody.classList.add("note-body", "bright");
      noteBody.innerHTML = noteObj.noteText
      noteContainer.appendChild(noteBody);

      if (self.config.showDatePosted) {      
        var noteDateStamp = document.createElement("span");
        noteDateStamp.classList.add("note-date-stamp");
        noteDateStamp.innerHTML = self.formatDate(noteObj.dateStamp);
        noteContainer.appendChild(noteDateStamp);
      }

      wrapper.appendChild(noteContainer);
    });

    return wrapper;

  }

});