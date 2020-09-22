import React from 'react';
import './Searchbar.css';

export class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state= {term: ''}
    this.handleTermChange = this.handleTermChange.bind(this);
    this.search = this.search.bind(this);
  }

  handleTermChange(e) {
    this.setState({term: e.target.value});
  }

  search() {
    this.props.onSearch(this.state.term);
  }

  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} />
        <button onClick={this.search} className="SearchButton">SEARCH</button>
      </div>
    )
  }
}