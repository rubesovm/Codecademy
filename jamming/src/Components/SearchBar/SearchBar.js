import React from 'react';
import './Searchbar.css';

export class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.search = this.search.bind(this);
  }

  handleTermChange(e) {
    this.search(e);
  }

  search(term) {
    this.props.onSearch = term;
  }

  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} />
        <button className="SearchButton">SEARCH</button>
      </div>
    )
  }
}