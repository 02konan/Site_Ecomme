document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("heroCarousel")) {
        initBanner();
    }
});

function initBanner() {
    const containerBanner = document.getElementById('heroCarousel')
    if (!containerBanner) {
        console.log('containerBanner n\'existe pas');
        return ''
    }

    showBannerSkeletons(3);

    fetch("/banner/list")
    .then(res => res.json())
    .then(response => {
        if (response.data && response.data.length > 0) afficheBanner(response.data);
    })
    .catch(err => {
        console.error("Erreur produits:", err);
    });
}

function showBannerSkeletons(count = 3) {
    const container = document.getElementById('heroCarousel');
    if (!container) return;

    const indicatorsContainer = container.querySelector('.carousel-indicators');
    const innerContainer = container.querySelector('.carousel-inner');
    if (!indicatorsContainer || !innerContainer) return;

    indicatorsContainer.innerHTML = '';
    innerContainer.innerHTML = '';
    container.classList.add('loading');

    for (let i = 0; i < count; i += 1) {
        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.setAttribute('aria-label', `Slide ${i + 1}`);
        if (i === 0) {
            indicator.classList.add('active');
            indicator.setAttribute('aria-current', 'true');
        }
        indicatorsContainer.appendChild(indicator);

        const slide = document.createElement('div');
        slide.classList.add('carousel-item');
        if (i === 0) slide.classList.add('active');

        slide.innerHTML = `
            <div class="carousel-hero-skeleton skeleton">
                <div class="hero-skeleton-content">
                    <div class="skeleton skeleton-line hero-skeleton-title"></div>
                    <div class="skeleton skeleton-line hero-skeleton-subtitle"></div>
                    <div class="skeleton skeleton-button hero-skeleton-button"></div>
                </div>
            </div>`;

        innerContainer.appendChild(slide);
    }
}

function afficheBanner(banners) {
    const container = document.getElementById("heroCarousel");
    if (!container) return;

    const indicatorsContainer = container.querySelector('.carousel-indicators');
    const innerContainer = container.querySelector('.carousel-inner');
    const prevButton = container.querySelector('.carousel-control-prev');
    const nextButton = container.querySelector('.carousel-control-next');

    if (!indicatorsContainer || !innerContainer) return;

    indicatorsContainer.innerHTML = '';
    innerContainer.innerHTML = '';
    container.classList.remove('loading');

    banners.forEach((banner, index) => {
        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.setAttribute('data-bs-target', '#heroCarousel');
        indicator.setAttribute('data-bs-slide-to', index);
        if (index === 0) {
            indicator.classList.add('active');
            indicator.setAttribute('aria-current', 'true');
        }
        indicator.setAttribute('aria-label', `Slide ${index + 1}`);
        indicatorsContainer.appendChild(indicator);

        const slide = document.createElement('div');
        slide.classList.add('carousel-item');
        if (index === 0) slide.classList.add('active');

        const title = banner.titre || 'Découvrez nos offres';
        const description = banner.description  || 'Profitez de nos meilleures offres du moment';
        const buttonText = banner.bouton_texte || 'Achetez maintenant';
        const buttonLink = banner.bouton_lien || banner.button_link || '#';
        const backgroundImage = banner.img
                ? (/^https?:\/\//i.test(banner.img) ? banner.img : `${window.urlBanniereImage}${banner.img}`)
                : '/static/img/default_1.png';

        // console.log('backgroundImage:', backgroundImage);
        // console.log('banner.img:', banner.img);
        // console.log('url complète:', `${window.urlBanniereImage}${banner.img}`);

        slide.innerHTML = `
            <div class="content">
                <h1 class="w-100 title text-center">${escapeHtml(title)}</h1>
                <p class="w-100 desc text-center">${escapeHtml(description)}</p>
                <div class="w-100 d-flex justify-content-center">
                    <a href="${escapeHtml(buttonLink)}" class="btn btn-sm btn-primary-custom rounded-pill px-4 py-2">${escapeHtml(buttonText)}</a>
                </div>
            </div>
            <div class="carousel-background" style="background: url('${escapeHtml(backgroundImage)}') no-repeat center/cover;"></div>
        `;

        innerContainer.appendChild(slide);
    });

    if (prevButton && nextButton) {
        if (!container.contains(prevButton)) container.appendChild(prevButton);
        if (!container.contains(nextButton)) container.appendChild(nextButton);
    }

    // Réinitialiser le carrousel Bootstrap
    if (typeof bootstrap !== 'undefined' && bootstrap.Carousel) {
        new bootstrap.Carousel(container, {
            interval: 5000,
            ride: 'carousel',
            wrap: true
        });
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}