const breedInput = document.getElementById("breedInput");
const breedList = document.getElementById("breedList");
const showImagesBtn = document.getElementById("showImages");
const randomBreedBtn = document.getElementById("randomBreed");
const message = document.getElementById("message");
const loading = document.getElementById("loading");
const imageContainer = document.getElementById("imageContainer");
const darkModeToggle = document.getElementById("darkModeToggle");

let breeds = [];
let intervalId;

// Fetch all breeds for autocomplete
async function loadBreeds() {
    try {
        const response = await fetch("https://dog.ceo/api/breeds/list/all");
        const data = await response.json();
        breeds = Object.keys(data.message);
        breeds.forEach(breed => {
            const option = document.createElement("option");
            option.value = breed;
            breedList.appendChild(option);
        });
    } catch (error) {
        message.textContent = "Error loading breeds.";
    }
}

// Fetch & show images
function showBreedImages(breed) {
    if (!breeds.includes(breed)) {
        message.textContent = "No such breed";
        imageContainer.innerHTML = "";
        clearInterval(intervalId);
        return;
    }

    message.textContent = "";
    imageContainer.innerHTML = "";
    loading.style.display = "block"; // Show spinner

    function fetchImages() {
        fetch(`https://dog.ceo/api/breed/${breed}/images/random/4`) // Fetch 4 images
            .then(response => response.json())
            .then(data => {
                imageContainer.innerHTML = ""; // Clear previous images
                data.message.forEach(imgSrc => {
                    const img = document.createElement("img");
                    img.src = imgSrc;
                    img.alt = breed;
                    img.loading = "lazy"; // Lazy loading for performance
                    imageContainer.appendChild(img);
                });
                loading.style.display = "none"; // Hide spinner
            })
            .catch(() => {
                message.textContent = "Error fetching images.";
                loading.style.display = "none";
            });
    }

    // Fetch images immediately, then every 5 seconds
    fetchImages();
    clearInterval(intervalId);
    intervalId = setInterval(fetchImages, 5000);
}

// Event Listeners
showImagesBtn.addEventListener("click", () => {
    const breed = breedInput.value.trim().toLowerCase();
    showBreedImages(breed);
});

randomBreedBtn.addEventListener("click", () => {
    const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];
    breedInput.value = randomBreed;
    showBreedImages(randomBreed);
});

// Dark Mode Toggle
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    darkModeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️ Light Mode" : "🌙 Dark Mode";
});

window.onload = loadBreeds;