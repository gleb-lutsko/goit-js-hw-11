import axios from 'axios';
import { currentPage } from './index.js';
export async function getPictures(searchQuery) {
  const response = await axios.get('https://pixabay.com/api/', {
    params: {
      key: '38892087-d1d89b1b60ef8a6743d5e6f43',
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: currentPage,
      per_page: 40,
    },
  });
  return response;
}
