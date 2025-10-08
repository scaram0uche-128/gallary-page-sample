import { galleryImages } from './data.js';

const categoryNav = document.querySelectorAll('.category-nav li');
const yearNav = document.getElementById('yearNav');
const galleryContainer = document.getElementById('galleryContainer');


const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const modalCaption = document.getElementById("modalCaption");
const closeModal = document.getElementById("closeModal");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");



let currentCategory = 'astrophotography';
let currentYear = null;
let currentIndex = -1;

function populateYears(category) {
  const years = [...new Set(galleryImages.filter(img => img.category === category).map(img => img.year))];
  yearNav.innerHTML = '';
  if (years.length > 0) {
    years.forEach(year => {
      const li = document.createElement('li');
      li.textContent = year;
      li.dataset.year = year;
      if (year === currentYear) li.classList.add('active');
      yearNav.appendChild(li);
    });

    yearNav.style.display = 'flex';
    yearNav.querySelectorAll('li').forEach((li, i) => {
      li.style.opacity = 0;
      li.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        li.style.transition = 'all 0.3s ease';
        li.style.opacity = 1;
        li.style.transform = 'translateY(0)';
      }, i * 50);
    });
  } 
  else {
    yearNav.style.display = 'none';
    currentYear = null;
  }
}




function renderGallery() {
  let images = galleryImages.filter(img => img.category === currentCategory);
  if (currentYear) images = images.filter(img => img.year === currentYear);

  galleryContainer.innerHTML = images.map((img, index) => `
    <div class="images-card" data-index="${index}">
      <img src="${img.src}" alt="${img.title}" loading="lazy">
      <div class="image-hover-caption">
        <span class="title">${img.title}</span>
        <span class="description">${img.description}</span>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.images-card img').forEach((imgEl, i) => {
    imgEl.addEventListener('click', () => openModal(i, images));
  });
}


categoryNav.forEach(li => {
  li.addEventListener('click', () => {
    categoryNav.forEach(el => el.classList.remove('active'));
    li.classList.add('active');
    currentCategory = li.dataset.category;
    currentYear = null;
    populateYears(currentCategory);
    renderGallery();

    categoryNav.forEach((btn, i) => {
      btn.style.opacity = 0;
      btn.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        btn.style.transition = 'all 0.3s ease';
        btn.style.opacity = 1;
        btn.style.transform = 'translateY(0)';
      }, i * 50);
    });
  });
});



yearNav.addEventListener('click', e => {
  const li = e.target.closest('li');
  if (!li) return;
  currentYear = parseInt(li.dataset.year);
  yearNav.querySelectorAll('li').forEach(el => el.classList.remove('active'));
  li.classList.add('active');
  renderGallery();
});

let currentImages = [];

function openModal(index, images) {
  currentIndex = index;
  const imgData = images[index];
  modal.classList.add('show');
  modal.style.display = 'flex';
  modalImg.src = imgData.src;
  modalCaption.textContent = imgData.title + " — " + imgData.description;
  currentImages = images;
}

function closeModalFn() {
  modal.classList.remove('show');
  setTimeout(() => { modal.style.display = "none"; }, 400);
  currentIndex = -1;
}


function showPrev() {
  if (currentIndex > 0) openModal(currentIndex - 1, currentImages);
  else openModal(currentImages.length - 1, currentImages);
}

function showNext() {
  if (currentIndex < currentImages.length - 1) openModal(currentIndex + 1, currentImages);
  else openModal(0, currentImages);
}




closeModal.addEventListener('click', closeModalFn);
prevBtn.addEventListener('click', showPrev);
nextBtn.addEventListener('click', showNext);
modal.addEventListener('click', e => { if (e.target === modal) closeModalFn(); });
document.addEventListener('keydown', e => {
  if (!modal.classList.contains('show')) return;
  if (e.key === "Escape") closeModalFn();
  if (e.key === "ArrowLeft") showPrev();
  if (e.key === "ArrowRight") showNext();
});

populateYears(currentCategory);
renderGallery();
