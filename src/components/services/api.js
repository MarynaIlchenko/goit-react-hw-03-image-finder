import axios from 'axios';
const API_KEY = '25774072-c5897649f594e9daa0e2ccc0a';
const URL = 'https://pixabay.com/api/?q=';

export class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImage() {
    const response = await axios.get(
      `${URL}${this.searchQuery}&page=${this.page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
    );
    this.incrementPage();
    return response.data.hits;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page += 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
