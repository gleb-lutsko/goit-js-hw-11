import { createMarkup } from './create-markup.js';
import { getPictures } from './request.js';

import Notiflix from 'notiflix';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
export let currentPage = 1;
let currentRequest = '';
loadMoreBtn.hidden = true;

form.addEventListener('submit', sumbitForm);
loadMoreBtn.addEventListener('click', loadMore);

function sumbitForm(evt) {
  evt.preventDefault();
  currentRequest = evt.target.searchQuery.value;
  currentPage = 1;
  getPictures(currentRequest).then(({ data }) => {
    if (!data.hits.length) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      gallery.innerHTML = createMarkup(data.hits);
      loadMoreBtn.hidden = false;
      Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
      evt.target.searchQuery.value = '';
    }
  });
}

function loadMore() {
  loadMoreBtn.hidden = true;
  currentPage += 1;
  getPictures(currentRequest).then(({ data }) => {
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
