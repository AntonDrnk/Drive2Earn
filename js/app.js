import { vehicles as defaultVehicles } from './data.js';
import * as ui from './ui.js';
import * as mapManager from './map.js';

document.addEventListener('DOMContentLoaded', () => {

    // --- Утилитарная функция, перенесена внутрь для чистоты ---
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // --- КОНСТАНТЫ ---
    const RIDE_TOKEN_ADDRESS = '0xe6ddDc6ce97079031D4e82798001Fe9567D32c17';
    const FAUCET_CONTRACT_ADDRESS = '0xd973B94826dAD8557Ea239326A60822eAEBAB6c0';
    const NFT_CONTRACT_ADDRESS = '0xFb2d50C838994C0C3FE0B33A255fEF6468daB4Bd';
    const STAKING_CONTRACT_ADDRESS = '0xb41105CC5b5be82198007D2ABADB2E0764c3D857';

    const RIDE_TOKEN_ABI = [
        "function balanceOf(address owner) view returns (uint256)",
        "function approve(address spender, uint256 amount) returns (bool)"
    ];

    
    const FAUCET_ABI = ["function claimReward(uint256 amount)"];
    // <<< ИСПРАВЛЕНИЕ: Полный ABI для NFT контракта, включая недостающую функцию 'approve' >>>
    const NFT_CONTRACT_ABI = [
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "initialOwner",
                  "type": "address"
              },
              {
                  "internalType": "address",
                  "name": "rideTokenAddress",
                  "type": "address"
              }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
      },
      {
          "anonymous": false,
          "inputs": [
              {
                  "indexed": true,
                  "internalType": "address",
                  "name": "previousOwner",
                  "type": "address"
              },
              {
                  "indexed": true,
                  "internalType": "address",
                  "name": "newOwner",
                  "type": "address"
              }
          ],
          "name": "OwnershipTransferred",
          "type": "event"
      },
      {
          "anonymous": false,
          "inputs": [
              {
                  "indexed": true,
                  "internalType": "address",
                  "name": "from",
                  "type": "address"
              },
              {
                  "indexed": true,
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
              },
              {
                  "indexed": true,
                  "internalType": "uint256",
                  "name": "tokenId",
                  "type": "uint256"
              }
          ],
          "name": "Transfer",
          "type": "event"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "spender",
                  "type": "address"
              },
              {
                  "internalType": "uint256",
                  "name": "tokenId",
                  "type": "uint256"
              }
          ],
          "name": "approve",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "uint256",
                  "name": "typeId",
                  "type": "uint256"
              },
              {
                  "internalType": "uint256",
                  "name": "price",
                  "type": "uint256"
              },
              {
                  "internalType": "string",
                  "name": "uri",
                  "type": "string"
              },
              {
                  "internalType": "uint8",
                  "name": "rarityIndex",
                  "type": "uint8"
              }
          ],
          "name": "addBikeType",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
              }
          ],
          "name": "balanceOf",
          "outputs": [
              {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
              }
          ],
          "name": "bikeTypes",
          "outputs": [
              {
                  "internalType": "uint256",
                  "name": "price",
                  "type": "uint256"
              },
              {
                  "internalType": "string",
                  "name": "uri",
                  "type": "string"
              },
              {
                  "internalType": "enum VehicleNft.Rarity",
                  "name": "rarity",
                  "type": "uint8"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "uint256",
                  "name": "tokenId",
                  "type": "uint256"
              }
          ],
          "name": "getRarity",
          "outputs": [
              {
                  "internalType": "enum VehicleNft.Rarity",
                  "name": "",
                  "type": "uint8"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "name",
          "outputs": [
              {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "uint256",
                  "name": "tokenId",
                  "type": "uint256"
              }
          ],
          "name": "ownerOf",
          "outputs": [
              {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "owner",
          "outputs": [
              {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "uint256",
                  "name": "typeId",
                  "type": "uint256"
              }
          ],
          "name": "purchase",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "rideToken",
          "outputs": [
              {
                  "internalType": "contract IERC20",
                  "name": "",
                  "type": "address"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
              },
              {
                  "internalType": "string",
                  "name": "uri",
                  "type": "string"
              },
              {
                  "internalType": "uint8",
                  "name": "rarityIndex",
                  "type": "uint8"
              }
          ],
          "name": "safeMint",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "symbol",
          "outputs": [
              {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
              },
              {
                  "internalType": "uint256",
                  "name": "index",
                  "type": "uint256"
              }
          ],
          "name": "tokenOfOwnerByIndex",
          "outputs": [
              {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "uint256",
                  "name": "tokenId",
                  "type": "uint256"
              }
          ],
          "name": "tokenURI",
          "outputs": [
              {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "getApproved", // <--- Убедитесь, что эта функция теперь есть в вашем ABI
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },

      
  ];

    const STAKING_CONTRACT_ABI = [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_nftAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_tokenAddress",
              "type": "address"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "RewardsClaimed",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            }
          ],
          "name": "Staked",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            }
          ],
          "name": "Unstaked",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "BASE_RATE_PER_SECOND",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "calculateRewards",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "claimRewards",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "fundRewardPool",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "owner",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "rideToken",
          "outputs": [
            {
              "internalType": "contract IERC20",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "stake",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "stakedNfts",
          "outputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "stakedTimestamp",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "lastClaimTimestamp",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "unstake",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "vehicleNft",
          "outputs": [
            {
              "internalType": "contract IVehicleNft",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },

        {
            "inputs": [
              {
                "internalType": "address",
                "name": "_owner",
                "type": "address"
              }
            ],
            "name": "getStakedTokenIdsByOwner",
            "outputs": [
              {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
      ];


    const STATS_STORAGE_KEY = 'rideVerseUserStats';

    // --- ПЕРЕМЕННЫЕ СОСТОЯНИЯ ПРИЛОЖЕНИЯ ---
    let userVehicles = [];
    let displayedVehicles = [...defaultVehicles];
    let currentVehicleIndex = 0;
    let selectedDestination = null;
    let currentUserPosition = null;
    let isRideActive = false;

    let userStats = {
        totalDistance: 0,
        totalRides: 0,
        totalEarned: 0,
        longestRide: 0
    };
    
    // Переменные для Web3, доступны во всем приложении
    let provider = null;
    let signer = null;
    let nftContract = null;
    let stakingContract = null;


    // КАТАЛОГ ТОВАРОВ
    const storeItems = [
        {
            id: 1,
            name: "Золотой Титан",
            rarity: "Редкий",
            price: 150,
            earningRate: 2.5,
            image: 'https://gist.githubusercontent.com/AntonDrnk/fb025e15f9830c19d831865cee8bbe1c/raw/762a976a742747cdf622555304b3ee098bbc2867/1.svg'
        },
        {
            id: 2,
            name: "Пламенный Дракон",
            rarity: "Эпический",
            price: 350,
            earningRate: 5.0,
            image: 'https://gist.githubusercontent.com/AntonDrnk/41021ec650e3a6435f2b99c29017fea1/raw/35eac2689345a335c195e2b8fcc00af12d986a30/2.svg'
        }
    ];

    // --- ЭЛЕМЕНТЫ DOM ---
    const mapInstance = mapManager.initializeMap();
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    // const startRideBtn = document.getElementById('start-ride-btn');
    const destinationInput = document.getElementById('destination-input');
    const modalGoBtn = document.getElementById('modal-go-btn');
    const modalRideFreelyBtn = document.getElementById('modal-ride-freely-btn');
    const endRideBtn = document.getElementById('end-ride-btn');
    const navGarage = document.getElementById('nav-garage');
    const navMap = document.getElementById('nav-map');
    const navStore = document.getElementById('nav-store');
    const connectWalletBtn = document.getElementById('connect-wallet-btn');
    const navStats = document.getElementById('nav-stats');

    // // Создаем экземпляры контрактов с "подписантом" для отправки транзакций
    // const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer);
    // const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_CONTRACT_ABI, signer);
    

    // --- УПРАВЛЕНИЕ КОНТРАКТАМИ ---
    function setupContracts() {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer);
        stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_CONTRACT_ABI, signer);
    }
    
    // --- ИНИЦИАЛИЗАЦИЯ UI ---
    loadUserStats(); // НОВОЕ: Загружаем статистику при старте
    ui.renderGarage(currentVehicleIndex, displayedVehicles); 
    ui.showVehicleOnMap(displayedVehicles[currentVehicleIndex].image);

    ui.disableGoButton();
    navigator.geolocation.getCurrentPosition(position => {
        currentUserPosition = L.latLng(position.coords.latitude, position.coords.longitude);
        // После получения позиции пользователя, проверяем, есть ли активная поездка
        checkForActiveRide();
    }, handleLocationError, { enableHighAccuracy: true });

    // --- НОВАЯ ЛОГИКА ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ---
    function initializeApp() {
        // Пробуем автоматически подключить кошелек, если пользователь уже делал это
        if (localStorage.getItem('isWalletConnected') === 'true') {
            connectWallet();
        }
    }






    
    // --- НОВОЕ: Функции для работы со статистикой ---
    function loadUserStats() {
        const savedStats = localStorage.getItem(STATS_STORAGE_KEY);
        if (savedStats) {
            userStats = JSON.parse(savedStats);
        }
        console.log("Статистика загружена:", userStats);
    }

    function saveUserStats() {
        localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(userStats));
        console.log("Статистика сохранена:", userStats);
    }

    function updateUserStats(distance, earned) {
        userStats.totalDistance += distance;
        userStats.totalEarned += earned;
        userStats.totalRides += 1;
        if (distance > userStats.longestRide) {
            userStats.longestRide = distance;
        }
        saveUserStats(); // Сохраняем обновленные данные
    }

    function checkForActiveRide() {
        const savedRide = localStorage.getItem('rideInProgress');
        if (savedRide) {
            const rideData = JSON.parse(savedRide);
            const userChoice = confirm("У вас есть незаконченная поездка. Хотите продолжить?");
            if (userChoice) {
                resumeRide(rideData);
            } else {
                localStorage.removeItem('rideInProgress');
            }
        }
    }

    initializeApp();

    // --- ОБРАБОТЧИКИ СОБЫТИЙ ---
    prevBtn.addEventListener('click', () => {
        currentVehicleIndex = (currentVehicleIndex - 1 + displayedVehicles.length) % displayedVehicles.length;
        ui.renderGarage(currentVehicleIndex, displayedVehicles);
        // ИСПРАВЛЕНИЕ: Вызываем новую функцию
        ui.showVehicleOnMap(displayedVehicles[currentVehicleIndex].image);
    });

    nextBtn.addEventListener('click', () => {
        currentVehicleIndex = (currentVehicleIndex + 1) % displayedVehicles.length;
        ui.renderGarage(currentVehicleIndex, displayedVehicles);
        // ИСПРАВЛЕНИЕ: Вызываем новую функцию
        ui.showVehicleOnMap(displayedVehicles[currentVehicleIndex].image);
    });

    // startRideBtn.addEventListener('click', () => {
    //     if (isRideActive) {
    //         ui.showScreen('map-screen', mapInstance, isRideActive);
    //     } else {
    //         ui.showDestinationModal();
    //     }
    // });

    // --- ФУНКЦИИ-ОБРАБОТЧИКИ ДЛЯ АРЕНДЫ ---
    // Функция для сдачи в аренду
    async function handleStake(tokenId) {
      if (!nftContract || !stakingContract || !signer) {
          return alert("Пожалуйста, сначала подключите кошелек.");
      }

      try {
          let owner;
          
          // --- ИЗМЕНЕНИЕ: Оборачиваем проверку владельца в try...catch ---
          try {
              console.log(`Проверяем владение NFT с tokenId: ${tokenId}...`);
              owner = await nftContract.ownerOf(tokenId);
          } catch (e) {
              console.error(`Не удалось получить владельца для tokenId: ${tokenId}. Вероятно, токен не существует.`, e);
              alert(`Ошибка: Не удалось проверить NFT с ID ${tokenId}. Возможно, этот токен не существует или в контракте есть ошибка.`);
              return; // Прерываем выполнение
          }
          // -----------------------------------------------------------------

          const currentUser = await signer.getAddress();
          if (owner.toLowerCase() !== currentUser.toLowerCase()) {
              alert(`Ошибка: Вы не являетесь владельцем этого NFT. Владелец: ${owner}`);
              return; 
          }

          console.log(`Владение подтверждено. Одобряем передачу NFT...`);
          alert("Сейчас потребуется две транзакции: 1. Одобрение, 2. Сдача в аренду.");
          

          // 1. Получаем адрес, которому уже дано одобрение для этого NFT
            const approvedAddress = await nftContract.getApproved(tokenId);

            // 2. Сравниваем его с адресом нашего стейкинг-контракта
            if (approvedAddress.toLowerCase() !== STAKING_CONTRACT_ADDRESS.toLowerCase()) {
                // Если одобрения нет или оно дано другому контракту, запрашиваем его
                console.log("Одобрение не найдено или неверно. Запрашиваем approve...");
                alert("Сейчас потребуется транзакция для одобрения передачи вашего NFT.");
                
                const approveTx = await nftContract.approve(STAKING_CONTRACT_ADDRESS, tokenId);
                await approveTx.wait(); // Ждем только если отправляли транзакцию
                
                console.log("Одобрение успешно получено.");
            } else {
                // Если одобрение уже есть, просто сообщаем об этом
                console.log("Одобрение уже предоставлено. Пропускаем шаг approve.");
            }
            
        // <<< КОНЕЦ ИЗМЕНЕНИЙ
          
          console.log("Одобрение успешно. Сдаем в аренду...");
          const stakeTx = await stakingContract.stake(tokenId);
          await stakeTx.wait();

          alert("Велосипед успешно сдан в аренду!");
          connectWallet();

      } catch (error) {
          console.error("Ошибка при сдаче в аренду:", error);
          alert("Произошла ошибка при сдаче в аренду. Подробности в консоли.");
      }
    }

    modalGoBtn.addEventListener('click', () => {
        if (!selectedDestination) return alert("Пожалуйста, выберите адрес из списка подсказок.");
        triggerRide(selectedDestination);
    });

    modalRideFreelyBtn.addEventListener('click', () => triggerRide());

    endRideBtn.addEventListener('click', async () => {
        const finalDistance = mapManager.stopRide();
        ui.hideVehicleOnMap();
        isRideActive = false;
        console.log(`Поездка завершена. Пройдено: ${finalDistance.toFixed(0)} метров.`);
    
        if (finalDistance > 100) {
            try {
                // ИСПРАВЛЕНИЕ: Проверяем, что signer существует
                if (!signer) {
                    alert("Ошибка: кошелек не подключен. Пожалуйста, подключитесь снова.");
                    return;
                }
                const earningRate = displayedVehicles[currentVehicleIndex].earningRate;
                const earnedAmount = (finalDistance / 1000) * earningRate;
    
                if (earnedAmount < 0.01) {
                    alert("Поездка была слишком короткой для начисления награды.");
                    ui.showScreen('garage-screen', null, isRideActive);
                    return;
                }
                // НОВОЕ: Обновляем статистику после поездки
                updateUserStats(finalDistance, earnedAmount);

                alert(`Вы заработали ${earnedAmount.toFixed(2)} $RIDE. Подпишите транзакцию в MetaMask, чтобы забрать награду из крана.`);
    
                // ИСПРАВЛЕНИЕ: Используем существующий signer
                const faucetContract = new ethers.Contract(ethers.utils.getAddress(FAUCET_CONTRACT_ADDRESS), FAUCET_ABI, signer);
                const amountInWei = ethers.utils.parseUnits(earnedAmount.toFixed(18), 18);
                const tx = await faucetContract.claimReward(amountInWei);
    
                console.log("Отправлена транзакция 'claimReward':", tx.hash);
                alert("Транзакция отправлена! Ожидаем подтверждения от блокчейна...");
                await tx.wait();
                console.log("Транзакция подтверждена!");
                alert("Награда успешно начислена на ваш кошелек!");
    
                await connectWallet(); 
    
            } catch (error) {
                console.error("Ошибка при запросе награды:", error);
                if (error.message.includes("cooldown period not over yet")) {
                    alert("Вы уже запрашивали награду недавно. Попробуйте позже (через 24 часа).");
                } else {
                    alert("Произошла ошибка при запросе награды. Подробности в консоли.");
                }
            }
        }
        ui.showScreen('garage-screen', null, isRideActive);
    });

    navGarage.addEventListener('click', (e) => {
        e.preventDefault();
        ui.showScreen('garage-screen', null, isRideActive);
    });

    navMap.addEventListener('click', (e) => {
        e.preventDefault();
        if (isRideActive) {
           ui.showScreen('map-screen', mapInstance, isRideActive);
        } else {
           // Сначала переключаем на гараж, потом показываем сообщение
           ui.showScreen('garage-screen', null, isRideActive);
           alert("Сначала начните поездку в гараже.");
        }
    });

    navStore.addEventListener('click', (e) => {
        e.preventDefault();
        ui.showScreen('store-screen');
        ui.renderStore(storeItems, handlePurchase);
    });
    
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', connectWallet);
    }

    // --- ОСНОВНЫЕ ФУНКЦИИ ПРИЛОЖЕНИЯ ---
    function triggerRide(destination = null) {
        if (!currentUserPosition) return alert("Определяем ваше местоположение, подождите...");
        const currentVehicle = displayedVehicles[currentVehicleIndex];
        if (!currentVehicle) return alert("Выберите транспортное средство.");
        isRideActive = true;
        ui.hideDestinationModal();
        // ui.resetMapDashboard();
        ui.showScreen('map-screen', mapInstance, isRideActive);
        const currentEarningRate = displayedVehicles[currentVehicleIndex].earningRate; 
        mapManager.startRide({
            userLatLng: currentUserPosition, 
            destinationLatLng: destination, 
            earningRate: currentVehicle.earningRate, 
            vehicleIndex: currentVehicleIndex, // Передаем индекс для сохранения
            errorCallback: handleLocationError
        });
    }

    // НОВАЯ функция для возобновления поездки
    function resumeRide(rideData) {
        const vehicle = displayedVehicles[rideData.vehicleIndex];
        if(!vehicle) {
            alert("Не удалось найти транспорт для продолжения поездки.");
            localStorage.removeItem('rideInProgress');
            return;
        }

        isRideActive = true;
        currentVehicleIndex = rideData.vehicleIndex; // Восстанавливаем выбранный велосипед
        ui.renderGarage(currentVehicleIndex, displayedVehicles); // Обновляем UI гаража на всякий случай

        ui.showScreen('map-screen', mapInstance, isRideActive);
        
        mapManager.startRide({
            userLatLng: currentUserPosition, // Текущая позиция
            destinationLatLng: rideData.destinationLatLng, // Сохраненная цель
            earningRate: rideData.earningRate,
            vehicleIndex: rideData.vehicleIndex,
            errorCallback: handleLocationError,
            restoreState: rideData // Передаем все сохраненные данные для восстановления
        });
    }

    function handleLocationError(error) {
        alert('Не удалось получить вашу геолокацию.');
        console.error(error);
    }

    async function connectWallet() {
        if (typeof window.ethereum === 'undefined') {
            if (isMobileDevice()) {
                const deepLink = `https://metamask.app.link/dapp/${window.location.href}`;
                const userChoice = confirm("Для работы приложения нужен кошелек MetaMask. Хотите открыть сайт в приложении MetaMask?");
                if (userChoice) {
                    window.location.href = deepLink;
                }
            } else {
                alert("Пожалуйста, установите расширение MetaMask в ваш браузер!");
            }
            return;
        }
        try {

             // ИСПОЛЬЗУЕМ ОБЩИЕ ПЕРЕМЕННЫЕ
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            const userAddress = await signer.getAddress();
            // --- ИЗМЕНЕНИЕ: Инициализируем контракты здесь, после получения signer ---
            nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer);
            stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_CONTRACT_ABI, signer);
            // ----------------------------------------------------------------------
            ui.showUserProfile(userAddress);

            // Сохраняем флаг, что кошелек подключен
            localStorage.setItem('isWalletConnected', 'true');

            const tokenContract = new ethers.Contract(RIDE_TOKEN_ADDRESS, RIDE_TOKEN_ABI, provider);
            const balanceBigNumber = await tokenContract.balanceOf(userAddress);
            const formattedBalance = ethers.utils.formatUnits(balanceBigNumber, 18);
            ui.updateBalance(formattedBalance);

            await loadAndDisplayNfts(userAddress);
        } catch (error) {
            console.error("Ошибка при подключении:", error);
            alert("Не удалось подключить кошелек.");
        }
    }

    async function loadAndDisplayNfts(userAddress) {
        console.log("--- Запускаю функцию загрузки NFT! ---");
    
        const readOnlyNftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, provider);
        const readOnlyStakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_CONTRACT_ABI, provider);
    
        userVehicles = [];
    
        // 1. Загружаем NFT, которые на балансе пользователя (не застейканы)
        const nftBalance = await readOnlyNftContract.balanceOf(userAddress);
        const balanceAsNumber = nftBalance.toNumber();
        console.log(`Найдено ${balanceAsNumber} NFT на балансе пользователя.`);
    
        if (balanceAsNumber > 0) {
            for (let i = 0; i < balanceAsNumber; i++) {
                try {
                    const tokenId = await readOnlyNftContract.tokenOfOwnerByIndex(userAddress, i);
                    const tokenUri = await readOnlyNftContract.tokenURI(tokenId);
                    const metadataResponse = await fetch(tokenUri);
                    const metadata = await metadataResponse.json();
        
                    const vehicleData = {
                        name: metadata.name,
                        rarity: metadata.attributes.find(attr => attr.trait_type === "Rarity")?.value || "N/A",
                        earningRate: metadata.attributes.find(attr => attr.trait_type === "Earning Rate ($RIDE/km)")?.value || 0,
                        image: `<img src="${metadata.image}" alt="${metadata.name}" style="width: 100%; height: 100%; object-fit: contain;">`,
                        stats: {
                            efficiency: metadata.attributes.find(attr => attr.trait_type === "Efficiency")?.value || 0,
                            durability: metadata.attributes.find(attr => attr.trait_type === "Durability")?.value || 0,
                            luck: metadata.attributes.find(attr => attr.trait_type === "Luck")?.value || 0,
                            comfort: metadata.attributes.find(attr => attr.trait_type === "Comfort")?.value || 0,
                        },
                        tokenId: tokenId.toNumber(),
                        isStaked: false,          // Эти NFT точно не застейканы
                        stakedRewards: "0.0"
                    };
                    userVehicles.push(vehicleData);
                } catch (e) {
                    console.error(`Не удалось загрузить метаданные для NFT с индексом ${i} (на балансе):`, e);
                }
            }
        }
    
        // 2. Загружаем NFT, которые застейканы пользователем, используя новую функцию
        try {
            const stakedTokenIds = await readOnlyStakingContract.getStakedTokenIdsByOwner(userAddress);
            console.log(`Найдено ${stakedTokenIds.length} застейканных NFT.`);
    
            for (const tokenId of stakedTokenIds) {
                try {
                    // Получаем метаданные из NFT контракта, даже если NFT находится у стейкинг-контракта
                    const tokenUri = await readOnlyNftContract.tokenURI(tokenId);
                    const metadataResponse = await fetch(tokenUri);
                    const metadata = await metadataResponse.json();
    
                    // Проверяем актуальные награды
                    const rewards = await readOnlyStakingContract.calculateRewards(tokenId);
    
                    const vehicleData = {
                        name: metadata.name,
                        rarity: metadata.attributes.find(attr => attr.trait_type === "Rarity")?.value || "N/A",
                        earningRate: metadata.attributes.find(attr => attr.trait_type === "Earning Rate ($RIDE/km)")?.value || 0,
                        image: `<img src="${metadata.image}" alt="${metadata.name}" style="width: 100%; height: 100%; object-fit: contain;">`,
                        stats: {
                            efficiency: metadata.attributes.find(attr => attr.trait_type === "Efficiency")?.value || 0,
                            durability: metadata.attributes.find(attr => attr.trait_type === "Durability")?.value || 0,
                            luck: metadata.attributes.find(attr => attr.trait_type === "Luck")?.value || 0,
                            comfort: metadata.attributes.find(attr => attr.trait_type === "Comfort")?.value || 0,
                        },
                        tokenId: tokenId.toNumber(),
                        isStaked: true, // Эти NFT точно застейканы
                        stakedRewards: ethers.utils.formatUnits(rewards, 18)
                    };
                    userVehicles.push(vehicleData);
                } catch (e) {
                    console.error(`Не удалось загрузить метаданные для застейканного NFT с tokenId ${tokenId}:`, e);
                }
            }
        } catch (e) {
            console.error("Ошибка при получении застейканных NFT:", e);
        }
        
        displayedVehicles = [...defaultVehicles, ...userVehicles];
        // Сортировка, если нужно, чтобы сначала шли незастейканные, потом застейканные, или по ID
        displayedVehicles.sort((a, b) => {
            if (a.isStaked === b.isStaked) {
                return a.tokenId - b.tokenId; // Сортировка по tokenId, если статус одинаковый
            }
            return a.isStaked ? 1 : -1; // Сначала не застейканные, потом застейканные
        });
    
        console.log("Массив ПОСЛЕ объединения и загрузки стейкинга:", displayedVehicles);
        
        currentVehicleIndex = 0;
        ui.renderGarage(currentVehicleIndex, displayedVehicles);
    }

    // Вставьте этот код в app.js, внутри DOMContentLoaded

    document.querySelector('body').addEventListener('click', async (event) => {
        const button = event.target.closest('button');
        if (!button) return; // Клик был не по кнопке, выходим

        // --- Обработка кнопок аренды по data-атрибутам ---
        const action = button.dataset.action;
        const tokenId = button.dataset.tokenId;

        if (action && tokenId) {
            const numericTokenId = parseInt(tokenId, 10);
            if (action === 'stake') {
                
                await handleStake(numericTokenId);
            } else if (action === 'unstake') {
                await handleUnstake(numericTokenId);
            } else if (action === 'claim') {
                await handleClaimRewards(numericTokenId);
            }
            return; // Завершаем, чтобы не обрабатывать дальше
        }

        // --- Обработка остальных кнопок по их ID ---
        switch (button.id) {
            case 'start-ride-btn':
                if (isRideActive) {
                    ui.showScreen('map-screen', mapInstance, isRideActive);
                } else {
                    ui.showDestinationModal();
                }
                break;
            case 'connect-wallet-btn':
                connectWallet();
                break;
            case 'end-ride-btn':
                // Перенесите сюда логику из вашего старого endRideBtn.addEventListener
                // Например:
                // const finalDistance = mapManager.stopRide();
                // ... и так далее
                break;
            case 'modal-go-btn':
                if (!selectedDestination) return alert("Пожалуйста, выберите адрес из списка подсказок.");
                triggerRide(selectedDestination);
                break;
            case 'modal-ride-freely-btn':
                triggerRide();
                break;
            // Добавьте сюда другие кнопки по их ID, если необходимо
        }
    });
    
    // --- ИСПРАВЛЕНИЕ: ФУНКЦИЯ ПЕРЕМЕЩЕНА ВНУТРЬ DOMContentLoaded ---
    async function handlePurchase(itemId) {
        if (!signer) {
            alert("Пожалуйста, сначала подключите кошелек.");
            return;
        }
        const item = storeItems.find(i => i.id == itemId);
        if (!item) {
            alert("Товар не найден!");
            return;
        }
        console.log(`Начинаем процесс покупки "${item.name}"...`);
        alert(`Сейчас вам нужно будет подтвердить ДВЕ транзакции:\n1. Одобрение списания $RIDE.\n2. Сама покупка.`);

        try {
            const rideTokenContract = new ethers.Contract(RIDE_TOKEN_ADDRESS, RIDE_TOKEN_ABI, signer);
            const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer);
            const priceInWei = ethers.utils.parseUnits(item.price.toString(), 18);

            console.log(`Шаг 1: Запрос разрешения на списание ${item.price} $RIDE...`);
            alert("Подпишите первую транзакцию в MetaMask, чтобы одобрить списание токенов.");
            
            const approveTx = await rideTokenContract.approve(NFT_CONTRACT_ADDRESS, priceInWei);
            console.log(`Транзакция одобрения отправлена: ${approveTx.hash}`);
            await approveTx.wait();
            
            console.log("Одобрение успешно подтверждено!");
            alert("Одобрение прошло успешно! Теперь подпишите вторую транзакцию для завершения покупки.");

            console.log(`Шаг 2: Вызов функции покупки для товара ID: ${itemId}...`);
            const purchaseTx = await nftContract.purchase(itemId);
            console.log(`Транзакция покупки отправлена: ${purchaseTx.hash}`);
            await purchaseTx.wait();
            
            console.log("Покупка успешно совершена!");
            alert(`Поздравляем! Вы купили "${item.name}"!`);

            await connectWallet();

        } catch (error) {
            console.error("Произошла ошибка во время покупки:", error);
            alert("Произошла ошибка. Проверьте консоль для получения дополнительной информации.");
        }
    }

    // --- Логика геокодера ---
    let geocodeTimer;
    const geocoder = L.Control.Geocoder.nominatim();
    destinationInput.addEventListener('keyup', (e) => {
        clearTimeout(geocodeTimer);
        const query = e.target.value;
        if (query.length < 3) return ui.clearAutocomplete();
        
        geocodeTimer = setTimeout(() => {
            geocoder.geocode(query, (results) => {
                ui.renderAutocomplete(results, (selectedResult) => {
                    destinationInput.value = selectedResult.name;
                    selectedDestination = selectedResult.center;
                    ui.clearAutocomplete();
                    ui.enableGoButton();
                });
            });
        }, 500);
    });
    destinationInput.addEventListener('input', () => {
        selectedDestination = null;
        ui.disableGoButton();
    });

    // НОВЫЙ ОБРАБОТЧИК ДЛЯ КНОПКИ СТАТИСТИКИ
    navStats.addEventListener('click', (e) => {
        e.preventDefault();
        ui.renderStats(userStats); // Передаем данные в UI перед показом экрана
        ui.showScreen('stats-screen');
    });

    // Функция для сдачи в аренду
    // Функция для сдачи в аренду
    // async function handleStake(tokenId) {
    //   // Проверяем, что контракты и signer существуют
    //   if (!nftContract || !stakingContract || !signer) {
    //       return alert("Пожалуйста, сначала подключите кошелек.");
    //   }

    //   try {
    //       console.log(`Проверяем владение NFT с tokenId: ${tokenId}...`);
          
    //       // --- НОВАЯ ПРОВЕРКА: Убедимся, что пользователь владеет этим NFT ---
    //       const owner = await nftContract.ownerOf(tokenId);
    //       const currentUser = await signer.getAddress();

    //       if (owner.toLowerCase() !== currentUser.toLowerCase()) {
    //           alert(`Ошибка: Вы не являетесь владельцем этого NFT. Владелец: ${owner}`);
    //           return; // Прерываем выполнение функции
    //       }
    //       // ------------------------------------------------------------------

    //       console.log(`Владение подтверждено. Одобряем передачу NFT (tokenId: ${tokenId}) стейкинг-контракту...`);
    //       alert("Сейчас потребуется две транзакции: 1. Одобрение, 2. Сдача в аренду.");
          
    //       // 1. Одобряем передачу NFT
    //       const approveTx = await nftContract.approve(STAKING_CONTRACT_ADDRESS, tokenId);
    //       await approveTx.wait();
          
    //       console.log("Одобрение успешно. Сдаем в аренду...");
    //       // 2. Сдаем в аренду
    //       const stakeTx = await stakingContract.stake(tokenId);
    //       await stakeTx.wait();

    //       alert("Велосипед успешно сдан в аренду!");
    //       // Обновляем информацию на странице
    //       connectWallet();
    //   } catch (error) {
    //       console.error("Ошибка при сдаче в аренду:", error);
    //       alert("Произошла ошибка при сдаче в аренду. Подробности в консоли.");
    //   }
    // }

    // Функция для сбора наград
    async function handleClaimRewards(tokenId) {
        try {
            console.log(`Забираем награды для tokenId: ${tokenId}...`);
            const claimTx = await stakingContract.claimRewards(tokenId);
            await claimTx.wait();
            alert("Награды успешно получены!");
            connectWallet();
        } catch (error) {
            console.error("Ошибка при сборе наград:", error);
            alert("Произошла ошибка.");
        }
    }

    // Функция для возврата из аренды
    async function handleUnstake(tokenId) {
        try {
            console.log(`Забираем из аренды tokenId: ${tokenId}...`);
            const unstakeTx = await stakingContract.unstake(tokenId);
            await unstakeTx.wait();
            alert("Велосипед успешно возвращен в гараж!");
            connectWallet();
        } catch (error) {
            console.error("Ошибка при возврате из аренды:", error);
            alert("Произошла ошибка.");
        }
    }


});

