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

    fetch("/banner/list")
    .then(res => res.json())
    .then(response => {
        if (response.data && response.data.length > 0) afficheBanner(response.data);
    })
    .catch(err => {
        console.error("Erreur produits:", err);
    });
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
        const backgroundImage = banner.img  || '/static/back/back_banner.jpg';

        slide.innerHTML = `
            <div class="content">
                <h1 class="title">${escapeHtml(title)}</h1>
                <p class="desc">${escapeHtml(description)}</p>
                <div class="">
                    <a href="${escapeHtml(buttonLink)}" class="btn btn-sm btn-primary-custom rounded-pill px-4 py-2">${escapeHtml(buttonText)}</a>
                </div>
            </div>
            <div class="carousel-background" style="background: url(${escapeHtml(backgroundImage)}) no-repeat center/cover;"></div>
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