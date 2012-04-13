Auctions = new Meteor.Collection("auctions");

if (Meteor.is_client) {

}

if (Meteor.is_server) {
    Meteor.startup(function() {

	});
}