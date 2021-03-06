import { Component } from 'react';
import { Searchbar } from './Searchbar';
import { ApiService } from './services/api';
import { ImageGallery } from './ImageGallery';
import { Modal } from './Modal';
import { Button } from './Button';
import { Loader } from './Loader';

const apiService = new ApiService();

export class App extends Component {
  state = {
    imageArr: [],
    query: '',
    error: null,
    isLoading: false,
    showModal: false,
    largeImageURL: '',
    page: 1,
  };

  componentDidUpdate(prevProps, prevState) {
    const { query, page } = this.state;
    apiService.query = query;

    if (prevState.query !== query) {
      this.onFetchImage();
    } else if (prevState.page !== page) {
      this.onLoadImage();
    }
  }

  onSearch = newQuery => {
    apiService.resetPage();
    this.setState({
      query: newQuery,
    });
  };

  onToggleModal = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  };

  onClickImg = event => {
    this.setState({
      largeImageURL: this.state.imageArr.find(
        img => img.webformatURL === event.target.src
      ).largeImageURL,
    });
  };

  onFetchImage = async () => {
    this.setState({ isLoading: true });

    try {
      const imageArr = await apiService.fetchImage();
      this.setState({
        imageArr: imageArr.map(({ id, webformatURL, largeImageURL }) => ({
          id,
          webformatURL,
          largeImageURL,
        })),
      });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  onLoadImage = async () => {
    this.setState({ isLoading: true });

    try {
      const imageArr = await apiService.fetchImage();
      this.setState(prevState => ({
        imageArr: [
          ...prevState.imageArr,
          ...imageArr.map(({ id, webformatURL, largeImageURL }) => ({
            id,
            webformatURL,
            largeImageURL,
          })),
        ],
      }));
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  onLoadMore = () => {
    const nextPage = this.state.page + 1;
    return this.setState({ page: nextPage });
  };

  render() {
    const { isLoading, imageArr, showModal, largeImageURL } = this.state;
    return (
      <>
        <Searchbar onSubmit={this.onSearch} />

        {imageArr.length >= 12 && (
          <ImageGallery
            onClickImg={this.onClickImg}
            images={imageArr}
            onToggleModal={this.onToggleModal}
          />
        )}
        {showModal && (
          <Modal onToggleModal={this.onToggleModal} img={largeImageURL} />
        )}

        {isLoading && <Loader />}

        {imageArr.length >= 12 && !isLoading && (
          <Button onLoadMore={this.onLoadMore} />
        )}
      </>
    );
  }
}
