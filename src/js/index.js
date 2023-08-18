import axios from 'axios';
import Notiflix from 'notiflix';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let currentPage = 10;
loadMoreBtn.hidden = true;

form.addEventListener('submit', sumbitForm);
loadMoreBtn.addEventListener('click', loadMore);

async function getPictures(searchQuery) {
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
  currentPage += 1;
  return response;
}

function sumbitForm(evt) {
  evt.preventDefault();
  const searchQuery = evt.target.searchQuery.value;

  getPictures(searchQuery).then(({ data }) => {
    if (!data.hits.length) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
      loadMoreBtn.hidden = false;
      Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
      evt.target.searchQuery.value = '';
    }
  });
}

function createMarkup(arr) {
  return arr
    .map(
      ({ webformatURL, tags, likes, views, comments, downloads }) =>
        `<div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" width="450" height="300"/>
    <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`
    )
    .join('');
}

function loadMore() {
  const searchQuery = form.elements.searchQuery.value;
  loadMoreBtn.hidden = true;
  getPictures(searchQuery).then(({ data }) => {
    if (currentPage >= data.totalHits / 40) {
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    } else if (!data.hits.length) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
      loadMoreBtn.hidden = false;
    }
  });
}
