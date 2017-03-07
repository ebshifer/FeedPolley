import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  var stream = require('getstream');
  // Instantiate a new client (server side)
  client = stream.connect('c2b9pjp2s3a6', 'xwcqn29t4fdwh7q4dap9dk2tgk6p7hkr947zd456j6xfgpxrxxb9txz6vmwb5d3x', '21450');

  Lists = new Meteor.Collection('lists');
  Meteor.publish('lists', function(){
    var currentUser = this.userId;
    return Lists.find({ createdBy: currentUser });
  });
});
