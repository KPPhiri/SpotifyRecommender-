const express = require('express')


const LargePlaylistAPI = require('../models/LargePlaylist.js')
const SpotifyTensorAPI = require('../models/Spotify_TensorScripts.js')


const LargePlayListRouter = express.Router()

//Returns the entire playlist from the database
LargePlayListRouter.get('/', (req, res) => {
  LargePlaylistAPI.getAllTracks()
    .then((tracks) => {
      console.log(tracks)
      res.send(tracks)
    })
    .catch(err => console.log(err))
})

//Creates a new playlist object
LargePlayListRouter.post('/', (req, res) => {
  console.log("STARTED")
  LargePlaylistAPI.createLargeSpotifyPlaylist(req.body)
    .then((tracks) => res.send(tracks))
    .catch(err => console.log(err))
})

//Get songs from a spotify playlist using Spotify's API and load tracks into MongoDB
LargePlayListRouter.get('/loadTracksToDatabase', (req, res) => {
  SpotifyTensorAPI.asyncgetPlaylistTrackIDsDriver('https://api.spotify.com/v1/playlists/7htu5ftbLBRFAwiuHVcUAg')
    .then((arrays) => LargePlaylistAPI.createLargeSpotifyPlaylist({features: arrays[0], labels: arrays[1], track_information: arrays[2]})).then((data) => console.log("Result: ", data)).catch(err => console.log("Error", err))
})

LargePlayListRouter.post('/getTargetTrackFeatures', (req, res) => {
  SpotifyTensorAPI.getTargetTrackFeatures(req.body.trackid)
      .then((features) => res.send(features)).catch(err => console.log("Error", err))
})

LargePlayListRouter.post('/getRecommendedTracks', (req, res) => {
  console.log("ROUTER RECEIVED:", req.body)
  //target_features, playlist_features, playlist_labels, k
  SpotifyTensorAPI.runTensor(req.body.targetTrackFeatures, req.body.playlist_features, req.body.playlist_labels, req.body.tracklistSize)
      .then((recommendedTracks) => res.send(recommendedTracks)).catch(err => console.log("Error", err))
})
//delete all the playlist items
LargePlayListRouter.delete('/:largePlayListId',(req, res) => {
  LargePlaylistAPI.deleteAllItems(req.params.largePlayListId)
    .then(() => res.send('delete was successful'))
    .catch(err => console.log(err))
})

//Update a specific playlist by its playlist ID
LargePlayListRouter.put('/:largePlayListId', (req,res) => {
  LargePlaylistAPI.updateLargeSpotifyPlaylist(req.params.largePlayListId,req.body)
    .then(() => res.send('Update was successful'))
    .catch(err => console.log(err))
})

module.exports = {
  LargePlayListRouter
}
