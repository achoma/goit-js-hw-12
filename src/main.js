import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '42580380-f7e9d56cf0d50abf8107b2707';
const API_URL = 'https://pixabay.com/api/';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('search-form');
  const gallery = document.getElementById('gallery');
  const loader = document.getElementById('loader');
  const loadMoreButton = document.getElementById('load-more');

  if (!form || !gallery || !loader || !loadMoreButton) {
    console.error('One or more elements are missing in the DOM.');
    return;
  }

  let lightbox;
  let currentPage = 1;
  let currentQuery = '';
  let totalHits = 0;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    currentQuery = document.getElementById('query').value.trim();

    if (currentQuery === '') return;

    clearGallery();
    toggleLoader(true);
    loadMoreButton.classList.add('hidden');
    currentPage = 1;

    try {
      const response = await fetchImages(currentQuery, currentPage);
      const images = response.hits;
      totalHits = response.totalHits;

      if (images.length === 0) {
        showErrorMessage(
          'Sorry, there are no images matching your search query. Please try again!'
        );
        return;
      }

      renderGallery(images);
      lightbox = new SimpleLightbox('#gallery a');

      if (images.length < totalHits) {
        loadMoreButton.classList.remove('hidden');
      }
    } catch (error) {
      handleFetchError(error);
    } finally {
      toggleLoader(false);
    }
  });

  loadMoreButton.addEventListener('click', async () => {
    currentPage += 1;
    toggleLoader(true);

    try {
      const response = await fetchImages(currentQuery, currentPage);
      const images = response.hits;

      renderGallery(images);
      lightbox.refresh();

      smoothScroll();

      if (currentPage * 20 >= totalHits) {
        loadMoreButton.classList.add('hidden');
        showErrorMessage(
          "We're sorry, but you've reached the end of search results."
        );
      }
    } catch (error) {
      handleFetchError(error);
    } finally {
      toggleLoader(false);
    }
  });

  async function fetchImages(query, page) {
    const url = `${API_URL}?key=${API_KEY}&q=${encodeURIComponent(
      query
    )}&image_type=photo&orientation=horizontal&safesearch=true&per_page=20&page=${page}`;
    const response = await axios.get(url);
    return response.data;
  }

  function handleFetchError(error) {
    if (error.response && error.response.status !== 200) {
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
    if (loader) {
      loader.classList.toggle('hidden', !visible);
    }
  }

  function smoothScroll() {
    const { height: cardHeight } = document
      .querySelector('.gallery-item')
      .getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
});
