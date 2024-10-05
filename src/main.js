import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '42580380-f7e9d56cf0d50abf8107b2707';
const API_URL = 'https://pixabay.com/api/';
const form = document.getElementById('search-form');
const gallery = document.getElementById('gallery');
const loader = document.getElementById('loader');
let lightbox;

form.addEventListener('submit', async e => {
  e.preventDefault();
  const query = document.getElementById('query').value.trim();

  if (query === '') return;

  clearGallery();
  toggleLoader(true);

  try {
    const response = await fetchImages(query);
    const images = response.hits;

    if (images.length === 0) {
      showErrorMessage(
        'Sorry, there are no images matching your search query. Please try again!'
      );
      return;
    }

    renderGallery(images);
    if (lightbox) lightbox.refresh();
    else lightbox = new SimpleLightbox('#gallery a');
  } catch (error) {
    handleFetchError(error);
  } finally {
    toggleLoader(false);
  }
});

async function fetchImages(query) {
  const url = `${API_URL}?key=${API_KEY}&q=${encodeURIComponent(
    query
  )}&image_type=photo&orientation=horizontal&safesearch=true`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}

function handleFetchError(error) {
  if (error.message === 'Network response was not ok') {
    showErrorMessage(
      'There was a problem with the network connection. Please try again later.'
    );
  } else {
    showErrorMessage('An unexpected error occurred. Please try again.');
  }
}

function showErrorMessage(message) {
  iziToast.error({
    title: 'Error',
    message: message,
  });
}

function renderGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <div class="gallery-item">
          <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" />
          </a>
          <div class="info">
            <p>Likes: ${likes}</p>
            <p>Views: ${views}</p>
            <p>Comments: ${comments}</p>
            <p>Downloads: ${downloads}</p>
          </div>
        </div>`;
      }
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

function clearGallery() {
  gallery.innerHTML = '';
}

function toggleLoader(visible) {
  loader.classList.toggle('hidden', !visible);
}
