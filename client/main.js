import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';


Meteor.subscribe('lists');

Router.configure({
    // Header and footer for each routes options go here
    layoutTemplate: 'main'
});

Router.route('/', {
  name: 'home',
  template: 'home'
});
Router.route('/login');
Router.route('/register');
Router.route('/list/:_id', {
    name: 'listPage',
    template: 'listPage',
    data: function(){
        var currentList = this.params._id;
        var currentUser = Meteor.userId();
        return Lists.findOne({ _id: currentList, createdBy: currentUser });
    },
    onBeforeAction: function(){
      var currentUser = Meteor.userId();
      if(currentUser){
          this.next();
      } else {
          this.render("login");
      }
    }
});

//create a Collection for Polls

Lists = new Meteor.Collection('lists');

Template.addList.events({
  'submit form': function(event){
    event.preventDefault();
    var listName = $('[name=listName]').val();
    var currentUser = Meteor.userId();
    Lists.insert({
        name: listName,
        createdBy: currentUser
    }, function(error, results){
        //console.log(results);
        //Router.go('listPage');
        Router.go('listPage', { _id: results });
    });
    $('[name=listName]').val('');
}
});

Template.lists.helpers({
    'list': function(){
        var currentUser = Meteor.userId();
        return Lists.find({createdBy: currentUser}, {sort: {name: 1}})
    }
});
//polls end


//event for registration
Template.register.events({
    'submit form': function(){
        // code goes here
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Accounts.createUser({
          email: email,
          password: password
        }, function(error){
          if(error){
            console.log(error.reason); // Output error if registration fails
          } else {
            Router.go("home"); // Redirect user if registration succeeds
          }
        });
    }
});

//event to logout
Template.navigation.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('login');
    }
});

//event to login
Template.login.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(email, password, function(error){
          if(error){
            console.log(error.reason);
          } else {
              var currentRoute = Router.current().route.getName();
              if(currentRoute == "login"){
                Router.go("home");
              }
          }
        });
    }
});
