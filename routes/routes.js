const express = require('express');
const { signin, Login, logOutUser } = require('../controllers/usercontrollers');
const { createRoomListings, getSingleRoomEntry,updateHotelDetails,deleteHotelListing,sortRoomsByDiffrentMethod,AllRoomsListing } = require('../controllers/Hotelscontroller');
const Router = express.Router();

Router.post('/SignIn', signin);
Router.post('/SignUp', Login);
Router.get('/Logout',logOutUser)



Router.post('/add-listing',createRoomListings)
Router.get('/get-single-room/:id',getSingleRoomEntry)
Router.get('/get-All-rooms',AllRoomsListing)

Router.patch('/update-room-listing/:RoomId',updateHotelDetails)
Router.post('/delete-room-listing/:RoomId',deleteHotelListing)
Router.post('/Sort/:method',sortRoomsByDiffrentMethod)






module.exports = Router;
