const Hotel = require('../models/Hotels.model');
const mongoose = require('mongoose');
const NodeCache = require('node-cache');

exports.createRoomListings = async (req, res) => {
    try {
        const {
            RoomImages,
            PlaceOfRoom,
            TypeOfRoom,
            PriceOfRoom,
            RatingValue,
            AvailableFacility,
            Host,
            AboutThePlace,
            WhatPlaceOffers,
            HotelCategory,
            MapLocation
        } = req.body;

        const emptyFields = Object.entries(req.body)
            .filter(([key, value]) => value === undefined || value === '')
            .map(([key]) => key);

        if (emptyFields.length > 0) {
            return res.status(400).json({
                success: false,
                fields: emptyFields,
                msg: 'One or more fields are empty.'
            });
        }
        
        // All fields are non-empty, continue with the rest of your logic

        // Example: Creating a new room listing
        const newRoomListing = new Hotel({
            RoomImages,
            PlaceOfRoom,
            TypeOfRoom,
            PriceOfRoom,
            RatingValue,
            AvailableFacility: AvailableFacility.map(facility => ({
                TagOfFacility: facility.TagOfFacility,
                ParaOfFacility: facility.ParaOfFacility
            })),
            Host,
            AboutThePlace,
            WhatPlaceOffers,
            HotelCategory,
            MapLocation
        });

        const savedRoomListing = await newRoomListing.save();
        cache.del('allRooms');
        res.status(201).json({
            success: true,
            msg: 'Room listing created successfully',
            data: savedRoomListing
        });

    } catch (error) {
        console.error('Error creating room listing:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
};
exports.updateHotelDetails = async (req, res) => {
    try {
        const RoomId = req.params.RoomId;
        const objectId = new mongoose.Types.ObjectId(RoomId);
        const checkRoomEntryAvailable = await Hotel.findById(objectId);

        if (!checkRoomEntryAvailable) {
            return res.status(404).json({
                success: false,
                msg: 'Room entry not found',
            });
        }

        const updateFields = req.body;

        // Check for any fields to be updated and then update them in the database
        for (const [key, value] of Object.entries(updateFields)) {
            // Make sure the key is a valid field in your Hotel model
            if (checkRoomEntryAvailable[key] !== undefined) {
                checkRoomEntryAvailable[key] = value;
            }
        }

        // Save the updated document in the database
        const updatedRoomEntry = await checkRoomEntryAvailable.save();

        return res.status(200).json({
            success: true,
            msg: 'Room entry updated successfully',
            data: updatedRoomEntry,
        });

    } catch (error) {
        console.error('Error updating room entry:', error);
        return res.status(500).json({
            success: false,
            msg: 'Internal server error',
        });
    }
};
exports.sortRoomsByDiffrentMethod = async (req, res) => {
    try {
        const method = req.params.method;
        console.log(method)
        let sortQuery;
        switch (method) {
            case 'price':
                sortCriteria = { PriceOfRoom: 1 };
                break;
            case 'date':
                sortCriteria = { createdAt: -1 };
                break;
            case 'rating':
                sortCriteria = { RatingValue: -1 };
                break;
            default:
                return res.status(400).json({
                    success: false,
                    msg: 'Invalid sorting method specified',
                });
        }
        const sortedRooms = await Hotel.find().sort(sortCriteria);

        return res.status(200).json({
            success: true,
            msg: 'Rooms sorted successfully',
            data: sortedRooms,
        });

    } catch (error) {

    }
}

exports.deleteHotelListing = async (req, res) => {
    try {
        const RoomId = req.params.RoomId;
        const objectId = new mongoose.Types.ObjectId(RoomId);
        const checkRoomEntryAvailable = await Hotel.findByIdAndDelete(objectId);

        if (!checkRoomEntryAvailable) {
            return res.status(404).json({
                success: false,
                msg: 'Room entry not found',
            });
        }

        return res.status(200).json({
            success: true,
            msg: 'Room entry deleted successfully',
            data: checkRoomEntryAvailable,
        });

    } catch (error) {
        console.error('Error Deleting room entry:', error);
        return res.status(500).json({
            success: false,
            msg: 'Internal server error',
        });
    }
};
const cache = new NodeCache({ stdTTL: 60*60 });

exports.AllRoomsListing = async (req, res) => {
    try {
        // Check if the data is already in the cache
        const cachedData = cache.get('allRooms');

        if (cachedData) {
            console.log('Data retrieved from cache');
            return res.status(200).json({
                success: true,
                data: cachedData,
                msg: 'Fetch successful (from cache)',
            });
        }

        // If not in cache, fetch all rooms from the database
        const allRooms = await Hotel.find();

        // Clone the array before storing it in the cache
        const clonedAllRooms = JSON.parse(JSON.stringify(allRooms));

        // Store the fetched data in the cache
        cache.set('allRooms', clonedAllRooms);

        return res.status(200).json({
            success: true,
            data: clonedAllRooms,
            msg: 'Fetch successful',
        });

    } catch (error) {
        console.error('Error fetching all rooms:', error);
        return res.status(500).json({
            success: false,
            msg: 'Internal server error',
        });
    }
};
exports.getSingleRoomEntry = async (req, res) => {
    try {
        const id = req.params.id; // Adjust the parameter based on your route setup


        const objectId = new mongoose.Types.ObjectId(id);
        const checkRoomEntryAvailable = await Hotel.findById(objectId);

        if (!checkRoomEntryAvailable) {
            return res.status(404).json({
                success: false,
                msg: 'Room entry not found',
            });
        }


        return res.status(200).json({
            success: true,
            data: checkRoomEntryAvailable,
            msg: 'Fetch successful',
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            msg: 'Internal server error',
        });
    }
};

    