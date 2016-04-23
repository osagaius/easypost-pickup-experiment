var apiKey = 'YOUR_TEST_KEY';
var easypost = require('node-easypost')(apiKey);
var moment = require('moment');

// set addresses
var toAddress = {
    name: "Dr. Steve Brule",
    street1: "179 N Harbor Dr",
    city: "Redondo Beach",
    state: "CA",
    zip: "90277",
    country: "US",
    phone: "310-808-5243"
};
var fromAddress = {
    name: "EasyPost",
    street1: "118 2nd Street",
    street2: "4th Floor",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    phone: "415-123-4567"
};

var pickupAddress = {
    name: "Osa",
    street1: "207 SEQUOIA PT",
    city: "Carrollton",
    state: "Georgia",
    zip: "30117",
    phone: "404-981-0115"
};

// verify address
easypost.Address.create(pickupAddress, function(err, pickupAddress) {
    pickupAddress.verify(function(err, response) {
        if (err) {
            console.log('Address is invalid.');
        } else if (response.message !== undefined && response.message !== null) {
            console.log('Address is valid but has an issue: ', response.message);
            var verifiedAddress = response.address;
        } else {
            // console.log('Created address successfully: ', response);
            var verifiedAddress = response;
        }
    });
});

var parcel = {
    length: 17,
    width: 13,
    height: 11,
    weight: 352.7
};
//
// // create customs_info form for intl shipping
// var customsItem = {
//     description: "EasyPost t-shirts",
//     hs_tariff_number: 123456,
//     origin_country: "US",
//     quantity: 2,
//     value: 96.27,
//     weight: 21.1
// };
//
// var customsInfo = {
//     customs_certify: 1,
//     customs_signer: "Hector Hammerfall",
//     contents_type: "gift",
//     contents_explanation: "",
//     eel_pfc: "NOEEI 30.37(a)",
//     non_delivery_option: "return",
//     restriction_type: "none",
//     restriction_comments: "",
//     customs_items: [customsItem]
// };
//
easypost.Shipment.create({
    to_address: toAddress,
    from_address: pickupAddress,
    parcel: parcel
}, function(err, shipment) {
    // buy postage label with one of the rate objects
    shipment.buy({rate: shipment.lowestRate(['ups']), insurance: 100.00}, function(err, shipment) {
        if (err) {
            console.log('Something went wrong: ', err);
          }
        else {
            console.log('Bought shipment successfully!!!');
            // console.log('TRACKING CODE: ', shipment.tracking_code);
            // console.log('POSTAGE LABEL URL: ', shipment.postage_label.label_url);
            var pickup = {
              address: pickupAddress,
              shipment: shipment,
              reference: "my-first-pickup",
              min_datetime: moment().add(12, 'h').format(),
              max_datetime: moment().add(13, 'h').format(),
              is_account_address: false,
              instructions: "Special pickup instructions : 0000 Test"
            };
            handlePickup(pickup);
        }
    });
});

function handlePickup(pickup) {
  console.log('PICKUP OBJECT: ', pickup);
  easypost.Pickup.create(pickup, function(err, response) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('PICKUP RESPONSE: ', response);
    }
  });
}
