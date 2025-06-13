// Этот файл хранит все статические данные приложения.
// Ключевое слово 'export' делает переменную 'vehicles' доступной для других файлов.

export const vehicles = [
    {
        name: "Старый велосипед",
        rarity: "Обычный NFT",
        earningRate: 0.5,
        image: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><style>.bike-st0{fill:none;stroke:#9CA3AF;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}.bike-st1{fill:#4F46E5;stroke:#A5B4FC;stroke-width:0.5;}.bike-st2{fill:#60A5FA;opacity:0.6;}</style><g transform="translate(5, 5) scale(0.9)"><path class="bike-st0" d="M26.2,69.5c-9.7,0-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5"/><path class="bike-st0" d="M73.8,69.5c9.7,0,17.5-7.8,17.5-17.5S83.5,34.5,73.8,34.5"/><path class="bike-st0" d="M26.2,69.5L50,23.3l23.8,46.2"/><path class="bike-st0" d="M50,23.3L38.4,52"/><path class="bike-st0" d="M32.8,31.7h34.4"/><path class="bike-st0" d="M26.2,34.5L50,69.5"/></g><circle class="bike-st1" cx="26.2" cy="52" r="17.5"/><circle class="bike-st1" cx="73.8" cy="52" r="17.5"/><path class="bike-st2" d="M26.2 69.5 A 17.5 17.5 0 0 1 26.2 34.5 Z"/><path class="bike-st2" d="M73.8 69.5 A 17.5 17.5 0 0 1 73.8 34.5 Z"/></svg>`,
        stats: { efficiency: 45, durability: 75, luck: 20, comfort: 60 }
    },
    {
        name: "Шоссейный велосипед",
        rarity: "Редкий NFT",
        earningRate: 1.2,
        image: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><style>.road-st0{fill:none;stroke:#00D0FF;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}.road-st1{fill:#3A7BFD;stroke:#A5B4FC;stroke-width:0.5;}</style><g transform="translate(5, 5) scale(0.9)"><path class="road-st0" d="M73.8,69.5c9.7,0,17.5-7.8,17.5-17.5S83.5,34.5,73.8,34.5"/><path class="road-st0" d="M26.2,69.5c-9.7,0-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5"/><path class="road-st0" d="M26.2,69.5L55.4,31.7l18.4,37.8"/><path class="road-st0" d="M46.7,69.5L34,44.2"/><path class="road-st0" d="M32.8,42.8h42.2"/></g><circle class="road-st1" cx="26.2" cy="52" r="17.5"/><circle class="road-st1" cx="73.8" cy="52" r="17.5"/></svg>`,
        stats: { efficiency: 70, durability: 60, luck: 35, comfort: 40 }
    }
];