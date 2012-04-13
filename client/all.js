Template.auctions.items = function() {
	var items = Auctions.find({});
	return (items.count()>0) ? Auctions.find({},{sort:{created:-1}}) : false; 
};

Template.auctions.events = {
    'click #createAuction': function() {
		$("#createAuction").button('loading');
		
		// Validate?
		var auctionDetails = {
			title:$("#create_auction_title").val(),
			current_bid:$("#create_auction_reserve").val(),
			details:$("#create_auction_details").val(),
			created:(new Date())
		}
		var errors=0;
		if (!auctionDetails.title) {
			errors++;
			$("#create_auction_title_control").addClass('error');
			$("#createAuction").button('complete');
		} else {
			$("#create_auction_title_control").removeClass('error');
		}
		if (!Number(auctionDetails.current_bid)) {
			errors++;
			$("#create_auction_reserve_control").addClass('error');
			$("#createAuction").button('complete');
		} else {
			$("#create_auction_reserve_control").removeClass('error');
		}
		if (!auctionDetails.details) {
			errors++;
			$("#create_auction_details_control").addClass('error');
			$("#createAuction").button('complete');	
		} else {
			$("#create_auction_details_control").removeClass('error');
		}
		
		if (errors==0) {
			
			auctionDetails.history = [{
				message:'Auction created',
				date:(new Date()).toString()
			}]
			$("#create_auction_title,#create_auction_reserve,#create_auction_details").val('');
			Auctions.insert(auctionDetails);
			$("#createAuction").button('complete');
			$("#createModal").modal('hide');
		}
	},
	'click #closeCreateAuction':function() {
		$("#createModal").modal('hide');
		
	},
	'click .enterNewBid': function(e) {
		e.preventDefault();
		var _id = $(e.srcElement).attr('data-auctionid');
		var bidAmount = parseInt($("input[data-auctionid='"+_id+"']").val());
		var currentBid = Auctions.findOne(_id);
		
		
		if (!Number(bidAmount)) {
			$("input[data-auctionid='"+_id+"']").parent().parent().parent().addClass('error');
			return;
		} 
		else if (bidAmount<currentBid.current_bid) {
			$("input[data-auctionid='"+_id+"']").parent().parent().parent().addClass('error');
			return;
		}
		else {
			var history = currentBid.history;
			history.unshift({
				message:"Bidder bid $"+bidAmount+".00",
				date:(new Date()).toString()
			});
			Auctions.update(_id,{$set:{current_bid:bidAmount,history:history}});		
			$("input[data-auctionid='"+_id+"']").parent().parent().parent().addClass('success');
			setTimeout(function() {
				$("input[data-auctionid='"+_id+"']").parent().parent().parent().removeClass('success');
			},2000);
		}
	}
};

Meteor.startup(function() {
	$(".bid_warning_popover").popover({
		title:"Warning",
		content:"By clicking 'Bid' you agree to be bound to the result of this auction."
	});
	$('#title-input').typeahead()
});