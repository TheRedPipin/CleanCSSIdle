let producerCosts = [
    5,         // Lemonade Stand
    50,        // Car Wash
    500,       // Pizza Shop
    5000,      // Coffee House
    50000,     // Book Store
    500000,    // Bakery
    5000000,   // Restaurant
    50000000,  // Supermarket
    500000000, // Tech Startup
    5000000000 // Bank
];
const incomeMultipliers = [
    1.05, // Lemonade Stand (very slow scaling)
    1.10, // Car Wash
    1.13, // Pizza Shop
    1.16, // Coffee House
    1.19, // Book Store
    1.22, // Bakery
    1.25, // Restaurant
    1.28, // Supermarket
    1.32, // Tech Startup
    1.36  // Bank (fastest scaling)
];
const costMultipliers = [
    1.5,  // Lemonade Stand
    1.6,  // Car Wash
    1.7,  // Pizza Shop
    1.8,  // Coffee House
    1.9,  // Book Store
    2.0,  // Bakery
    2.1,  // Restaurant
    2.2,  // Supermarket
    2.3,  // Tech Startup
    2.5   // Bank
];
let producerAmount = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let producerIncome = [1, 10, 50, 200, 1000, 5000, 20000, 100000, 500000, 2000000];
let producerInterval = [null, null, null, null, null, null, null, null, null, null];
let producerIntervalTime = [1000, 2000, 4000, 8000, 16000, 32000, 64000, 128000, 256000, 512000];
let money = 0;
const producerData = [
    { name: "Lemonade Stand" },
    { name: "Car Wash" },
    { name: "Pizza Shop" },
    { name: "Coffee House" },
    { name: "Book Store" },
    { name: "Bakery" },
    { name: "Restaurant" },
    { name: "Supermarket" },
    { name: "Tech Startup" },
    { name: "Bank" }
];

document.addEventListener('DOMContentLoaded', () => {
    let moneyDisplay = document.getElementById('moneyDisplay');
    const container = document.querySelector('.container');
    container.innerHTML = "";

    producerData.forEach((producer, i) => {
        const box = document.createElement('div');
        box.className = 'producerBox' + (i === 0 ? '' : ' hidden');
        box.innerHTML = `
            <div class="producerMenu">
                <h2><span class="producerAmountBox">[${producerAmount[i]}]</span> ${producer.name}</h2>
                <button id="buyButton">£???</button>
                <button id="produceButton">Produce</button>
                <div class="boostIndicatorBox">
                    <span class="boostIndicator">⚡</span>
                </div>
            </div>
            <div class="outerContainer">
                <div class="progressBarContainer">
                    <div class="progressBar"></div>
                </div>
                <div class="amountBox">+${producerIncome[i]}</div>
            </div>
        `;
        container.appendChild(box);
    });

    const producerBoxes = Array.from(document.querySelectorAll('.producerBox'));

    setInterval(() => {
        moneyDisplay.textContent = `£${money}`;
        producerBoxes.forEach((box, i) => {
            if (money >= producerCosts[i]) {
                box.classList.remove('hidden');
            }
        });
    }, 10);

    producerBoxes.forEach((box, i) => {
        const buyButton = box.querySelector('button#buyButton');
        const produceButton = box.querySelector('button#produceButton');
        const progressBar = box.querySelector('.progressBar');
        const upgradeButton = box.querySelector('button#upgradeButton');
        const boostIndicatorBox = box.querySelector('.boostIndicatorBox');
        const boostIndicator = box.querySelector('.boostIndicator');
        const amountBox = box.querySelector('.amountBox');
        let isProducing = false;

        function updateAmountBox() {
            if (amountBox) {
                amountBox.textContent = `+${producerIncome[i] * producerAmount[i]}`;
            }
        }

        function updateBoostIndicator() {
            if (!boostIndicator || !boostIndicatorBox) return;
            const boosts = Math.floor(producerAmount[i] / 10);
            if (boosts > 0) {
                const percent = boosts * 40;
                boostIndicator.textContent = `+${percent}%⚡`;
                boostIndicatorBox.classList.add('active');
            } else {
                boostIndicatorBox.classList.remove('active');
            }
        }

        const producerAmountBox = box.querySelector('.producerAmountBox');
        function updateProducerAmountBox() {
            if (producerAmountBox) {
                producerAmountBox.textContent = `[${producerAmount[i]}]`;
            }
        }

        if (buyButton) {
            buyButton.textContent = `£${producerCosts[i]}`;
            buyButton.addEventListener('click', () => {
                if (money >= producerCosts[i]) {
                    money -= producerCosts[i];
                    producerAmount[i] += 1;
                    const baseCost = [
                        5, 50, 500, 5000, 50000, 500000, 5000000, 50000000, 500000000, 5000000000
                    ][i];
                    producerCosts[i] = Math.ceil(baseCost * Math.pow(costMultipliers[i], producerAmount[i]));

                    buyButton.textContent = `£${producerCosts[i]}`;

                    producerIncome[i] = Math.ceil(producerIncome[i] * incomeMultipliers[i]);

                    if (producerAmount[i] % 10 === 0) {
                        producerIntervalTime[i] = Math.ceil(producerIntervalTime[i] * 0.6);
                    }
                    updateBoostIndicator();
                    updateProducerAmountBox();
                    updateAmountBox();
                }
                if (produceButton) {
                    produceButton.disabled = producerAmount[i] === 0;
                    produceButton.style.backgroundColor = producerAmount[i] === 0 ? "#aaa" : "";
                    produceButton.style.cursor = producerAmount[i] === 0 ? "not-allowed" : "pointer";
                }
            });
        }
        updateProducerAmountBox();
        updateAmountBox();
        updateBoostIndicator();

        if (produceButton) {
            produceButton.disabled = producerAmount[i] === 0;
            produceButton.style.backgroundColor = producerAmount[i] === 0 ? "#aaa" : "";
            produceButton.style.cursor = producerAmount[i] === 0 ? "not-allowed" : "pointer";
        }

        if (upgradeButton) {
            upgradeButton.textContent = `£${producerCosts[i]}`;
        }

        if (produceButton && progressBar) {
            produceButton.addEventListener('click', () => {
                if (isProducing || producerAmount[i] === 0) return;
                isProducing = true;
                progressBar.style.transition = 'none';
                progressBar.style.width = '0%';
                void progressBar.offsetWidth;
                let duration = producerIntervalTime[i];
                progressBar.style.transition = `width ${duration}ms linear`;
                progressBar.style.width = '100%';

                setTimeout(() => {
                    money += producerIncome[i] * producerAmount[i];
                    progressBar.style.transition = 'none';
                    progressBar.style.width = '0%';
                    isProducing = false;
                    updateAmountBox && updateAmountBox();
                }, duration);
            });
        }
        
    });
});