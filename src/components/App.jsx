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
  };

  componentDidUpdate(prevProps, prevState) {
    const { query } = this.state;
    apiService.query = query;

    if (prevState.query !== query) {
      this.onFetchImage();
    }
  }

  onSearch = newQuery => {
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
      ).largeImageURL,
    });
  };

  onFetchImage = async () => {
    this.setState({ isLoading: true });

    try {
      const imageArr = await apiService.fetchImage();
      this.setState({ imageArr });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  onLoadMore = async () => {
    this.setState({ isLoading: true });

    try {
      const imageArr = await apiService.fetchImage();
      this.setState(prevState => ({
        imageArr: [...prevState.imageArr, ...imageArr],
      }));
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { isLoading, imageArr, showModal, largeImgURL } = this.state;
    return (
      <>
        <Searchbar onSubmit={this.onSearch} />

        {
          <ImageGallery
            onClickImg={this.onClickImg}
            images={imageArr}
            onToggleModal={this.onToggleModal}
          />
        }
        {showModal && (
          <Modal onToggleModal={this.onToggleModal} img={largeImgURL} />
        )}
        {isLoading && <Loader />}
        {imageArr.length >= 12 && (
          <Button onLoadMore={this.onLoadMore} loading={isLoading} />
        )}
      </>
    );
  }
}
