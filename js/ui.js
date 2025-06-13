import { vehicles } from './data.js';

const elements = {
    garageScreen: document.getElementById('garage-screen'),
    mapScreen: document.getElementById('map-screen'),
    currentVehicleDisplay: document.getElementById('current-vehicle-display'),
    statsScreen: document.getElementById('stats-screen'),
    storeScreen: document.getElementById('store-screen'),
    storeItemsGrid: document.getElementById('store-items-grid'),
    garageActions: document.getElementById('garage-actions'),
    vehicleName: document.getElementById('vehicle-name'),
    vehicleRarity: document.getElementById('vehicle-rarity'),
    vehicleEarning: document.getElementById('vehicle-earning'),
    vehicleImageContainer: document.getElementById('vehicle-image-container'),
    efficiencyBar: document.getElementById('efficiency-bar'),
    durabilityBar: document.getElementById('durability-bar'),
    luckBar: document.getElementById('luck-bar'),
    comfortBar: document.getElementById('comfort-bar'),
    mapSpeed: document.getElementById('map-speed'),
    mapDistance: document.getElementById('map-distance'),
    mapEarnings: document.getElementById('map-earnings'),
    destinationModal: document.getElementById('destination-modal'),
    modalLoader: document.getElementById('modal-loader'),
    autocompleteResults: document.getElementById('autocomplete-results'),
    modalGoBtn: document.getElementById('modal-go-btn'),
    navItems: {
        garage: document.getElementById('nav-garage'),
        store: document.getElementById('nav-store'),
        stats: document.getElementById('nav-stats'),
        map: document.getElementById('nav-map')
    },
    // Элементы для статистики
    statsTotalDistance: document.getElementById('stats-total-distance'),
    statsTotalRides: document.getElementById('stats-total-rides'),
    statsTotalEarned: document.getElementById('stats-total-earned'),
    statsLongestRide: document.getElementById('stats-longest-ride'),
    // НОВОЕ: Секция информации о стейкинге
    stakingInfoSection: document.getElementById('staking-info-section'), // <--- ДОБАВЬТЕ ЭТУ СТРОКУ
};
    


// ОБНОВЛЕННАЯ ФУНКЦИЯ SHOWSCREEN >>>
export function showScreen(screenId, mapInstance = null) {
    elements.garageScreen.classList.add('hidden');
    elements.mapScreen.classList.add('hidden');
    elements.storeScreen.classList.add('hidden');
    elements.statsScreen.classList.add('hidden');

    const screenToShow = document.getElementById(screenId);
    if (screenToShow) screenToShow.classList.remove('hidden');

    // Логика для обновления активной вкладки в навигации
    const screenMap = {
        'map-screen': 'map',
        'garage-screen': 'garage',
        'store-screen': 'store',
        'stats-screen': 'stats'
    };
    
    if (screenMap[screenId]) {
        updateActiveNav(screenMap[screenId]);
    }

    // Обновляем размер карты, если переключаемся на нее
    if (screenId === 'map-screen' && mapInstance) {
        setTimeout(() => mapInstance.invalidateSize(), 100);
    }
}


export function renderGarage(vehicleIndex, vehicles) {
    if (!elements.garageScreen || !vehicles || vehicles.length === 0 || !vehicles[vehicleIndex]) {
        if (elements.garageActions) elements.garageActions.innerHTML = '<p class="text-center text-gray-400">В вашем гараже пока нет велосипедов.</p>';
        // НОВОЕ: Очищаем секцию стейкинга, если нет велосипедов
        if (elements.stakingInfoSection) elements.stakingInfoSection.innerHTML = '';
        return;
    }
    const vehicle = vehicles[vehicleIndex];

    // --- Ваш существующий код для рендеринга имени, картинки, характеристик ---
    elements.vehicleName.textContent = vehicle.name;
    elements.vehicleRarity.textContent = vehicle.rarity;
    elements.vehicleEarning.innerHTML = `<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" /><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" /></svg><p class="text-base font-semibold">${vehicle.earningRate} <span class="font-medium text-gray-400">$RIDE / км</span></p>`;
    elements.vehicleImageContainer.innerHTML = vehicle.image;
    
    elements.efficiencyBar.style.width = vehicle.stats.efficiency + '%';
    elements.durabilityBar.style.width = vehicle.stats.durability + '%';
    elements.luckBar.style.width = vehicle.stats.luck + '%';
    elements.comfortBar.style.width = vehicle.stats.comfort + '%';
    // --- Конец существующего кода ---

    // НОВОЕ: Логика для динамического рендеринга информации о стейкинге и кнопок
    if (!elements.garageActions || !elements.stakingInfoSection) return;

    let buttonsHtml = '';
    let stakingInfoHtml = '';

    if (vehicle.isStaked) {
        // --- Интерфейс для байка В АРЕНДЕ ---
        const rewards = parseFloat(vehicle.stakedRewards).toFixed(4); // Округляем для отображения

        stakingInfoHtml = `
            <div class="glass-panel p-3 rounded-lg text-center">
                <p class="text-xs text-gray-400">НАКОПЛЕНО РЕНТЫ</p>
                <p class="text-2xl font-bold text-cyan-400">${rewards} $RIDE</p>
            </div>
        `;

        buttonsHtml = `
            <button data-action="claim" data-token-id="${vehicle.tokenId}" 
                    class="w-full py-3 bg-green-600 text-white font-bold rounded-xl transition-transform active:scale-95">
                Забрать ренту
            </button>
            <button data-action="unstake" data-token-id="${vehicle.tokenId}" 
                    class="w-full py-3 bg-red-600 text-white font-bold rounded-xl transition-transform active:scale-95">
                Забрать из аренды
            </button>
        `;
    } else {
        // --- Интерфейс для байка В ГАРАЖЕ (не в аренде) ---
        stakingInfoHtml = `
            <div class="glass-panel p-3 rounded-lg text-center text-gray-400">
                <p class="text-sm">Этот велосипед не в аренде.</p>
                <p class="text-xs mt-1">Вы можете его сдать или начать поездку.</p>
            </div>
        `;

        buttonsHtml = `
            <button data-action="stake" data-token-id="${vehicle.tokenId}" 
                    class="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl transition-transform active:scale-95">
                Сдать в аренду
            </button>
            <button id="start-ride-btn" 
                    class="w-full py-4 bg-cyan-500 text-white font-bold text-lg rounded-xl btn-glow transition-transform active:scale-95">
                Начать поездку
            </button>
        `;
    }

    elements.stakingInfoSection.innerHTML = stakingInfoHtml;
    elements.garageActions.innerHTML = buttonsHtml;
}

function updateActiveNav(activeId) {
    Object.values(elements.navItems).forEach(item => {
        item.classList.remove('nav-item-active');
        item.classList.add('text-gray-400', 'border-transparent');
    });
    if (elements.navItems[activeId]) {
        elements.navItems[activeId].classList.add('nav-item-active');
        elements.navItems[activeId].classList.remove('text-gray-400', 'border-transparent');
    }
}

export function updateMapDashboard(data) {
    elements.mapSpeed.textContent = data.speed;
    elements.mapDistance.textContent = data.distance;
    elements.mapEarnings.textContent = data.earnings;
}

export function showDestinationModal() { elements.destinationModal.classList.remove('hidden'); }
export function hideDestinationModal() { elements.destinationModal.classList.add('hidden'); }
export function showModalLoader() { elements.modalLoader.classList.remove('hidden'); }
export function hideModalLoader() { elements.modalLoader.classList.add('hidden'); }

export function renderAutocomplete(results, onSelect) {
    elements.autocompleteResults.innerHTML = '';
    if (!results || results.length === 0) return;

    results.forEach(result => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.textContent = result.name;
        item.onclick = () => onSelect(result);
        elements.autocompleteResults.appendChild(item);
    });
}

export function clearAutocomplete() {
    elements.autocompleteResults.innerHTML = '';
}

export function disableGoButton() { elements.modalGoBtn.disabled = true; }
export function enableGoButton() { elements.modalGoBtn.disabled = false; }

export function showUserProfile(address) {
    const walletConnector = document.getElementById('wallet-connector');
    // Форматируем адрес для удобного отображения (например, 0x1234...5678)
    const formattedAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    
    // Генерируем HTML-код для отображения профиля
    walletConnector.innerHTML = `
        <div class="w-10 h-10 bg-indigo-900 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        </div>
        <div>
            <p class="text-sm font-semibold text-white">Подключен</p>
            <p class="text-xs text-gray-400">${formattedAddress}</p>
        </div>
    `;
}

export function updateBalance(balance) {
    const balanceElement = document.getElementById('ride-balance');
    if (balanceElement) {
        // Округляем баланс до 2 знаков после запятой для красивого отображения
        const formattedBalance = parseFloat(balance).toFixed(2);
        balanceElement.innerHTML = `${formattedBalance} $RIDE`;
    }
}

export function renderStore(items, purchaseHandler) {
    // Очищаем предыдущие товары
    elements.storeItemsGrid.innerHTML = '';

    if (!items || items.length === 0) {
        elements.storeItemsGrid.innerHTML = '<p class="text-gray-400 col-span-full text-center">Товары скоро появятся...</p>';
        return;
    }

    items.forEach(item => {
        const itemHtml = `
            <div class="glass-panel p-4 rounded-xl flex flex-col items-center text-center transition-transform hover:scale-105">
                <div class="w-full h-32 mb-4 bg-gray-900/50 rounded-lg p-2">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-contain">
                </div>
                <h3 class="font-semibold text-white">${item.name}</h3>
                <p class="text-sm text-cyan-400 mb-1">${item.rarity} NFT</p>
                
                <div class="flex items-center justify-center gap-1.5 text-xs text-gray-300 mb-2">
                    <svg class="w-4 h-4 text-cyan-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" /><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" /></svg>
                    <span>${item.earningRate} $RIDE / км</span>
                </div>
                
                <p class="text-lg font-bold text-white mt-auto pt-2">${item.price} $RIDE</p>
                <button 
                    data-item-id="${item.id}"
                    class="store-buy-btn mt-2 w-full py-2 bg-cyan-500 text-white font-bold rounded-lg btn-glow transition-transform active:scale-95">
                    Купить
                </button>
            </div>
        `;
        elements.storeItemsGrid.insertAdjacentHTML('beforeend', itemHtml);
    });

    // Добавляем один обработчик событий на всю сетку
    elements.storeItemsGrid.onclick = function(event) {
        const button = event.target.closest('.store-buy-btn');
        if (button) {
            const itemId = button.dataset.itemId;
            purchaseHandler(itemId);
        }
    };
}

export function showVehicleOnMap(vehicleImageHtml) {
    if (!elements.currentVehicleDisplay) return;
    elements.currentVehicleDisplay.innerHTML = vehicleImageHtml;
    elements.currentVehicleDisplay.classList.remove('hidden');
}

export function hideVehicleOnMap() {
    if (!elements.currentVehicleDisplay) return;
    elements.currentVehicleDisplay.innerHTML = '';
    elements.currentVehicleDisplay.classList.add('hidden');
}

// --- НОВАЯ ФУНКЦИЯ ДЛЯ ОТОБРАЖЕНИЯ СТАТИСТИКИ ---
export function renderStats(stats) {
    if (!stats) return;

    elements.statsTotalDistance.textContent = (stats.totalDistance / 1000).toFixed(2);
    elements.statsTotalRides.textContent = stats.totalRides;
    elements.statsTotalEarned.textContent = stats.totalEarned.toFixed(2);
    elements.statsLongestRide.textContent = (stats.longestRide / 1000).toFixed(2);
}

// --- НОВАЯ ФУНКЦИЯ ДЛЯ СБРОСА ДАШБОРДА ---
export function resetMapDashboard() {
    elements.mapSpeed.textContent = '0';
    elements.mapDistance.textContent = '0.0';
    elements.mapEarnings.textContent = '0.00';
}