
import config from '../config.js';
import cacheManager from './cacheManager.js';

function analyzeImageAndSetTextColor(imageUrl, authorName) {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const textAreas = [
            { x: 0, y: 0, width: canvas.width, height: 100 },
            { x: 0, y: canvas.height - 100, width: canvas.width, height: 100 }
        ];

        let totalBrightness = 0;
        let pixelCount = 0;

        textAreas.forEach(area => {
            const imageData = ctx.getImageData(area.x, area.y, area.width, area.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
                totalBrightness += brightness;
                pixelCount++;
            }
        });

        const avgBrightness = totalBrightness / pixelCount;
        const isLight = avgBrightness > 128;
        document.body.classList.remove('light-text', 'dark-text');
        document.body.classList.add(isLight ? 'dark-text' : 'light-text');

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const optimizedUrl = `${imageUrl}&auto=format&fit=crop&w=${screenWidth}&h=${screenHeight}&q=90`;
        document.querySelector('.background-container').style.backgroundImage = `url(${optimizedUrl})`;
        document.getElementById("author").textContent = `By: ${authorName}`;
    };

    img.onerror = () => {
        document.querySelector('.background-container').style.backgroundImage = `url(https://images.unsplash.com/photo-1560008511-11c63416e52d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMTEwMjl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjI4NDIxMTc&ixlib=rb-1.2.1&q=80&w=1080)`;
        document.getElementById("author").textContent = `By: Dodi Achmad`;
        document.body.classList.add('light-text');
    };
}

async function fetchMultipleImages(category, count = 10) {
    const images = [];
    const promises = [];

    for (let i = 0; i < count; i++) {
        promises.push(
            fetch(`https://api.unsplash.com/photos/random?query=${category}&orientation=landscape&client_id=${config.UNSPLASH_API_KEY}`)
                .then(res => res.json())
                .then(data => ({
                    url: data.urls.regular,
                    author: data.user.name
                }))
                .catch(() => null)
        );
    }

    const results = await Promise.allSettled(promises);
    results.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
            images.push(result.value);
        }
    });

    return images;
}

export async function loadBackgroundImage() {
    const backgroundLoader = document.createElement('div');
    backgroundLoader.className = 'background-loading';
    backgroundLoader.innerHTML = '<div class="loading"></div> Loading background...';
    document.body.appendChild(backgroundLoader);

    const category = localStorage.getItem('backgroundImageCategory') || 'nature';

    try {
        // Check if we have cached images for current category
        const cachedImages = cacheManager.getCachedImages();
        
        if (cachedImages && cachedImages.length > 0) {
            // Use cached image rotation
            const nextImage = cacheManager.getNextImage();
            if (nextImage) {
                analyzeImageAndSetTextColor(nextImage.url, nextImage.author);
                backgroundLoader.remove();
                return;
            }
        }

        // If no cache or new session, fetch new images
        if (cacheManager.isNewSession() || !cachedImages) {
            console.log('Fetching fresh background images...');
            const images = await fetchMultipleImages(category, 10);
            
            if (images.length > 0) {
                cacheManager.setCachedImages(images, category);
                // Use first image
                analyzeImageAndSetTextColor(images[0].url, images[0].author);
            } else {
                throw new Error('No images fetched');
            }
        }
    } catch (err) {
        console.error('Background loading error:', err);
        document.querySelector('.background-container').style.backgroundImage = `url(https://images.unsplash.com/photo-1560008511-11c63416e52d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMTEwMjl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjI4NDIxMTc&ixlib=rb-1.2.1&q=80&w=1080)`;
        document.getElementById("author").textContent = `By: Dodi Achmad`;
        document.body.classList.add('light-text');
    } finally {
        backgroundLoader.remove();
    }
}

export function refreshBackgroundCache() {
    const category = localStorage.getItem('backgroundImageCategory') || 'nature';
    cacheManager.clearImageCache();
    console.log('Background cache cleared, will refresh on next load');
}
