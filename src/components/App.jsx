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
    largeImgURL: '',
    page: 1,
  };

  componentDidUpdate(prevProps, prevState) {
    const { query, page } = this.state;
    apiService.query = query;
    if (prevState.query !== query) {
      this.onFetchImage();
    }

    if (prevState.page !== page) {
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
      largeImgURL: this.state.imageArr.find(
        img => img.webformatURL === event.target.src
      ).largeImgURL,
    });
  };

  onFetchImage = async () => {
    this.setState({ isLoading: true });

    try {
      const imageArr = await apiService.fetchImage();
      this.setState({
        imageArr: imageArr.map(({ id, webformatURL }) => ({
          id,
          webformatURL,
        })),
      });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  onLoadImage = async () => {
    // this.setState({ isLoading: true });

    try {
      const imageArr = await apiService.fetchImage();
      this.setState(prevState => ({
        imageArr: [
          ...prevState.imageArr,
          ...imageArr.map(({ id, webformatURL }) => ({
            id,
            webformatURL,
          })),
        ],
      }));
    } catch (error) {
      this.setState({ error });
    }
  };

  onLoadMore = () => {
    this.setState(prevState => ({ page: (prevState.page += 1) }));
  };

  render() {
    const { isLoading, imageArr, showModal, largeImgURL } = this.state;
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
          <Modal onToggleModal={this.onToggleModal} img={largeImgURL} />
        )}
        {isLoading && <Loader />}
        {imageArr.length >= 12 && !isLoading && (
          <Button onLoadMore={this.onLoadMore} />
        )}
      </>
    );
  }
}
