import { Component } from 'react';
import style from './Searchbar.module.css';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';

export class Searchbar extends Component {
  state = {
    value: '',
  };

  handleNameChange = event => {
    this.setState({ value: event.currentTarget.value.toLowerCase() });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.onSubmit(this.state.value);
    this.onReset(event);
  };

  onReset = event => {
    this.state({ value: '' });
    event.target.reset();
  };

  render() {
    return (
      <header className={style.Searchbar}>
        <form onSubmit={this.handleSubmit} className={style.SearchForm}>
          <button type="submit" className={style.SearchFormButton}>
            <span className={style.SearchFormButton}>Search</span>
          </button>

          <input
            className={style.SearchFormInput}
            value={this.state.value}
            onChange={this.handleNameChange}
            type="text"
            autocomplete="off"
            autofocus
            placeholder="Search images and photos"
          />
        </form>
      </header>
    );
  }
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
