document.addEventListener("DOMContentLoaded", () => {

    /* ========================
       VARIABLES
    ======================== */
    const searchContainer   = document.getElementById('searchContainer');
    const searchInput       = document.getElementById('searchInput');
    const searchClear       = document.getElementById('searchClear');
    const searchBtn         = document.getElementById('searchBtn');
    const searchSuggestions = document.getElementById('searchSuggestions');
    const suggestionsList   = document.querySelector('.suggestions-list');
    const clearAllBtn       = document.querySelector('.clear-all');

    /* ========================
       RECHERCHE PRINCIPALE
    ======================== */
    function performSearch() {
        const input = document.getElementById('searchInput');
        const query = input ? input.value.trim() : '';

        if (!query) return;

        saveToHistory(query);

        if (!window.location.pathname.startsWith('/produits')) {
            window.location.href = `/produits?query=${encodeURIComponent(query)}`;
            return;
        }

        hideSuggestions();

        const container = document.getElementById("NosProduits");
        if (container) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <div class="spinner-border text-muted" role="status"></div>
                    <p class="text-muted mt-2">Recherche en cours...</p>
                </div>
            `;
        }

        fetch(`/api/search?query=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(json => {
                if (json.data && json.data.length > 0) {
                    afficheNosProduits(json.data);
                } else {
                    container.innerHTML = `
                        <div class="text-center py-5 nothing">
                            <i class="bi bi-inbox fs-1 text-muted"></i>
                            <p class="text-muted mt-2 mb-0">Aucun résultat pour "<strong>${escapeHtml(query)}</strong>"</p>
                        </div>
                    `;
                }
            })
            .catch(err => {
                console.error("Erreur recherche:", err);
                container.innerHTML = `
                    <div class="text-center py-5">
                        <i class="bi bi-wifi-off fs-1 text-muted"></i>
                        <p class="text-danger mt-2">Erreur de connexion.</p>
                    </div>
                `;
            });
    }

    /* ========================
       SUGGESTIONS & HISTORIQUE
    ======================== */
    function toggleClearButton() {
        if (searchInput && searchClear) {
            searchClear.style.display = searchInput.value.length > 0 ? 'flex' : 'none';
        }
    }

    function clearSearch() {
        if (searchInput) {
            searchInput.value = '';
            toggleClearButton();
            searchInput.focus();
            hideSuggestions();
        }
    }

    function showSuggestions() {
        if (!searchSuggestions || !searchInput) return;
        if (searchInput.value.length >= 2) {
            searchSuggestions.style.display = 'block';
            loadSuggestions(searchInput.value);
        } else if (searchInput.value.length === 0) {
            loadHistory();
            searchSuggestions.style.display = 'block';
        } else {
            hideSuggestions();
        }
    }

    function hideSuggestions() {
        if (searchSuggestions) searchSuggestions.style.display = 'none';
    }

    function loadSuggestions(query) {
        if (!suggestionsList) return;

        const mockSuggestions = [
            { text: `${query} appareil photo`,      count: 45 },
            { text: `${query} drone professionnel`, count: 23 },
            { text: `${query} casque audio`,        count: 67 },
            { text: `${query} macbook pro`,         count: 12 },
            { text: `${query} sony camera`,         count: 34 }
        ];

        suggestionsList.innerHTML = '';
        mockSuggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.innerHTML = `
                <i class="bi bi-search"></i>
                <span class="suggestion-text">${suggestion.text}</span>
                <span class="suggestion-count">${suggestion.count} produits</span>
            `;
            item.addEventListener('click', () => {
                searchInput.value = suggestion.text;
                performSearch();
            });
            suggestionsList.appendChild(item);
        });
    }

    function saveToHistory(query) {
        let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        history = [query, ...history.filter(item => item !== query)];
        if (history.length > 10) history.pop();
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }

    function loadHistory() {
        if (!suggestionsList) return;

        const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        suggestionsList.innerHTML = '';

        history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'suggestion-item';
            historyItem.innerHTML = `
                <i class="bi bi-clock-history"></i>
                <span class="suggestion-text">${item}</span>
            `;
            historyItem.addEventListener('click', () => {
                searchInput.value = item;
                performSearch();
            });
            suggestionsList.appendChild(historyItem);
        });
    }

    function clearHistory() {
        localStorage.removeItem('searchHistory');
        hideSuggestions();
    }

    /* ========================
       EVENEMENTS
    ======================== */
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            toggleClearButton();
            showSuggestions();
        });

        searchInput.addEventListener('focus', () => {
            showSuggestions();
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                performSearch();  // ← gère tout, pas besoin de window.location ici
            }
        });
    }

    if (searchClear)  searchClear.addEventListener('click', clearSearch);
    if (searchBtn)    searchBtn.addEventListener('click', performSearch);
    if (clearAllBtn)  clearAllBtn.addEventListener('click', clearHistory);

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-wrapper')) hideSuggestions();
    });

    toggleClearButton();

    // ← Lancement auto si query dans l'URL (arrivée depuis une autre page)
    const params = new URLSearchParams(window.location.search);
    const query  = params.get('query');
    if (query && searchInput) {
        searchInput.value = query;
        performSearch();
    }

});