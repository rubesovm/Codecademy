import React from 'react';
import './Tracklist.css';
import {Track} from '../Track/Track'

export class TrackList extends React.Component {
  render() {
    return (
      
      <div className="TrackList">
        {this.props.tracks}.map(track => <Track track />
      )
      </div>
    )
  }
}