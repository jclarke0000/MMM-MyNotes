var NodeHelper = require("node_helper");
var fs = require("fs");
var google = require("googleapis");
var googleAuth = require("google-auth-library");
const base64url = require("base64url");

var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + "/.credentials/";
var TOKEN_PATH = TOKEN_DIR + "MMM-MyNotes.json";

var oauth2Client = null;
var isAuthorized = false;
var notesLabelId = null;

var moduleInstance = null;
var config = null;


module.exports = NodeHelper.create({

  start: function() {
    moduleInstance = this;
  },

  authorize: function(callback) {

    // Load client secrets from a local file.
    fs.readFile(this.path + "/client_secret.json", function processClientSecrets(err, content) {
      if (err) {
        console.log("[MMM-MyNotes] Error loading client secret file: " + err);
        return;
      }

      var credentials = JSON.parse(content);

      // get auth token.
      fs.readFile(TOKEN_PATH, function(err, token) {
        if (err) {
          console.log("[MMM-MyNotes] No Authorization token.  Please run \"node authorise.js\" in the MMM-MyNotes directory " + err);
        } else {

          var clientSecret = credentials.installed.client_secret;
          var clientId = credentials.installed.client_id;
          var redirectUrl = credentials.installed.redirect_uris[0];
          
          var auth = new googleAuth();
          oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
          oauth2Client.credentials = JSON.parse(token);
          

          //get notes label
          var gmail = google.gmail("v1");
          gmail.users.labels.list({
            auth: oauth2Client,
            userId: "me",
          }, function(err, response) {
            if (err) {
              console.log("[MMM-MyNotes] GMail API returned an error while trying to get Notes label: " + err);
              return;
            }

            for (var i = 0; i < response.labels.length; i++) {
              if (response.labels[i].name == "Notes") {
                notesLabelId = response.labels[i].id;
                break;
              }
            }

            isAuthorized = true;
            callback();

          });


        }
      });

    });


  },

  getNotes: function() {
    console.log("[MMM-MyNotes] Getting notes");

    if (isAuthorized) {

      var gmail = google.gmail("v1");
      gmail.users.messages.list({
        auth: oauth2Client,
        labelIds: notesLabelId,
        maxResults: config.maxNotes,
        userId: "me",
      }, function(err, response) {
        if (err) {
          console.log("[MMM-MyNotes] GMail API returned an error while trying to retrieve notes: " + err);
          return;
        }

        if (response.messages) {

          var notes = new Array();
          var messagesRetrieved = 0;

          var messageList = response.messages;
          messageList.forEach(function(message, index) {

            gmail.users.messages.get({
              auth: oauth2Client,
              id: message.id,
              userId: "me",
            }, function(err, msgResponse) {
              if (err) {
                console.log("[MMM-MyNotes] Error retrieving message id " + message.id);
              } else {

                var noteObj = {
                  dateStamp: msgResponse.internalDate,
                  noteText: base64url.decode(msgResponse.payload.body.data)
                };

                notes[index] = noteObj;
              }

              messagesRetrieved++;

              if (messagesRetrieved == messageList.length) {
                //done.  Send this shit back to the front end
                moduleInstance.sendSocketNotification("MMM-MYNOTES-RESPONSE", {data: notes});
              }

            });


          });
          
        } else { //no notes. return an empty array
          moduleInstance.sendSocketNotification("MMM-MYNOTES-RESPONSE", {data: []});
        }


      });

    }
  },

  socketNotificationReceived: function(notification, payload){
    if (notification === "MMM-MYNOTES-GET") {
      if (config == null) {      
        config = payload;
      }

      if (this.isAuthorized) {
        this.getNotes();
      } else {
        this.authorize(this.getNotes);
      }
    }
  },


});