const mongoose = require('mongoose');

const FacilitiesSchema = new mongoose.Schema({
    TagOfFacility: {
        type: String
    },
    ParaOfFacility: {
        type: String
    }
});

const AnyHostSchema = new mongoose.Schema({
    ProfilePic: {
        type: String
    },
    NameOfHost: {
        type: String
    },
    ReviveNumber: {
        type: Number
    },
    Star: {
        type: Number
    },
    HowManyYear: {
        type: Number
    },
    DetailsOfHost: {
        type: [String]
    }
});

const OffersSchema = new mongoose.Schema({
    Icons: {
        type: String
    },
    OfferText: {
        type: String
    }
});

const HotelSchema = new mongoose.Schema({
    RoomImages: {
        type: [String],
        default: [
          'https://source.unsplash.com/featured/?hotel',
          'https://source.unsplash.com/featured/?hotel',
          'https://source.unsplash.com/featured/?hotel',
          'https://source.unsplash.com/featured/?hotel',
        ],
      },
    PlaceOfRoom: {
        type: String,
        required: true
    },
    TypeOfRoom: {
        type: String,
        required: true
    },
    PriceOfRoom: {
        type: Number,
        required: true
    },
    RatingValue: {
        type: Number,
        required: true
    },
    AvailableFacility: {
        type: [FacilitiesSchema]
    },
    Host: {
        type: AnyHostSchema
    },
    AboutThePlace: {
        type: String,
        required: true
    },
    WhatPlaceOffers: {
        type: [OffersSchema]
    },
    HotelCategory: {
        type: String
    },
    MapLocation: {
        type: String
    }
}, { timestamps: true });

const Hotel = mongoose.model('Hotel', HotelSchema);

module.exports = Hotel;
