import React, { Component } from 'react'
import './MainBody.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Recommender from '../Recommender/Recommender';
import Search from '../Search/Search';
import axios from 'axios'
export default class MainBody extends Component {

    //Store the state of the song selected by the user and the
    //  features returned by that song Id
    state = {
        targetSongFeatures: [],
        reccomenderPlaylist: []
    }

    //This function stores the id of the song selected by the user in state
    //Pass this method down to search componenet
    runFunctionsToUpdateRecommenderPlaylist = async (newSongId) => {
        await this.useSongIdToGetFeatures(newSongId)
        console.log("ACTIVATED!!", this.state.targetSongFeatures)
        let tracklistSize = 20;
        console.log("2ACTIVATED!!")

        await this.getRecommendedTracks(this.state.targetSongFeatures, tracklistSize)
        //place the tensor method here so that it runs as soon as as the
        //  features have been grabbed and uploaded to state

    }

//req.body.targetTrackFeatures, req.body.playlist_features, req.body.playlist_labels, req.body.tracklistSize
    //TODO: PARSE DATAGBASE AND GET PLAYLIST FEATUREs, PLAYLIST LABELS, AND TRACK INFO
    getRecommendedTracks = (targetTrackFeatures, tracklistSize) => {
      console.log("3ACTIVATED!!")

      let res =  axios.post('http://192.168.1.84:3001/api/tracks/getRecommendedTracks',
      { targetTrackFeatures: targetTrackFeatures,
       tracklistSize: tracklistSize, }).then((body) => {
        this.setState({reccomenderPlaylist: body.data})
      }).catch(err => console.log('Error: ', err));
    }



    //Use the songId to create a list of features
    useSongIdToGetFeatures = async (songId) => {
      let body =  await axios.post('http://192.168.1.84:3001/api/tracks/getTargetTrackFeatures', { trackid: songId })
      this.setState({targetSongFeatures: body.data})
      console.log("targetSongFeatures", this.state.targetSongFeatures, "BODY", body.data)
     }

    render() {

        //Create components that will needs props below this line
        //If the component doesnt need props, then create as usual
        //Example let RecommenderComponent = () => <Recommender songId={this.state.songId}/>
        //Then use the render method to have the component show
        let SearchComponent = () => <Search
            songId={this.state.songId}
            sendSongToGetFeatures={this.runFunctionsToUpdateRecommenderPlaylist}
            token={this.props.token} />

        let RecommenderComponent = () => <Recommender
            playlist={this.state.reccomenderPlaylist}
            token={this.props.token}
        />

        return (
            <Router >
                <div id="mainbody">
                    <Switch>
                        <Route exact path='/callback' render={SearchComponent} />
                        <Route path='/recommender' render={RecommenderComponent} />
                    </Switch>
                </div>
            </Router>
        )
    }
}
