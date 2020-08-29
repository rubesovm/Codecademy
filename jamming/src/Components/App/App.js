import React from 'react';
import './App.css';
import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults.js';
import {Playlist} from '../Playlist/Playlist';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {SearchResults:  [SearchResults.name, SearchResults.artist, SearchResults.album, SearchResults.id]}
  }

  render() {
    return (
    <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
        <SearchBar/>
      <div className="App-playlist">
        <SearchResults searchResults={this.state.SearchResults}/>
        <Playlist/>
    </div>
      </div>
    </div>
  );
  }
}

export default App;
