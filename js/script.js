const fields = {
    cash: document.getElementById('cash'),
    tradingGoods: document.getElementById('trading_goods'),
    debts: document.getElementById('debts'),
    liabilities: document.getElementById('liabilities'),
    goldPrice: document.getElementById('gold_price'),
    totalMoney: document.getElementById('total_zakat'),
    nisab: document.getElementById('nisab'),
    zakatAmount: document.getElementById('zakat_amount'),
    hijri: document.getElementById('hijri'),
    miladi: document.getElementById('miladi'),
};


let zakatPercentage = 2.5; // Default percentage for Hijri

function calculateTotalMoney() {
const cash = parseFloat(removeCommas(fields.cash.value)) || 0;
const tradingGoods = parseFloat(removeCommas(fields.tradingGoods.value)) || 0;
const debts = parseFloat(removeCommas(fields.debts.value)) || 0;
const liabilities = parseFloat(removeCommas(fields.liabilities.value)) || 0;

if (fields.cash.value || fields.tradingGoods.value || fields.debts.value || fields.liabilities.value) {
    return (cash + tradingGoods + debts - liabilities).toFixed(2);
} else {
    return '';
}
}

function calculateNisab() {
const goldPrice = parseFloat(removeCommas(fields.goldPrice.value)) || 0;

if (fields.goldPrice.value) {
    return (goldPrice * 85).toFixed(2);
} else {
    return '';
}
}

function calculateZakat(totalMoney, nisab) {
if (totalMoney && nisab) {
    if (parseFloat(totalMoney) >= parseFloat(nisab)) {
        return (parseFloat(totalMoney) * zakatPercentage / 100).toFixed(2);
    } else {
        return 'لا زكاة';
    }
}
return '';
}

function updateValues() 
{
const totalMoney = calculateTotalMoney();
const nisab = calculateNisab();

// Format with commas before displaying
fields.totalMoney.value = totalMoney ? formatNumberWithCommas({ value: totalMoney }) : '';
fields.nisab.value = nisab ? formatNumberWithCommas({ value: nisab }) : '';

const zakatAmount = calculateZakat(totalMoney, nisab);
fields.zakatAmount.value = zakatAmount;
}


fields.hijri.addEventListener('change', function () 
{
if (fields.hijri.checked) {
    zakatPercentage = 2.5;
    updateValues();
}
});

fields.miladi.addEventListener('change', function () {
if (fields.miladi.checked) {
    zakatPercentage = 2.577;
    updateValues();
}
});

function validateInput(field) {
field.value = field.value
.replace(/[^0-9.]/g, '') // Allow only numbers and '.'
.replace(/(\\..*?)\\..*/g, '$1') // Allow only one '.'
.replace(/^0+(?!\\.|$)/, ''); // Remove leading zeros

const parts = field.value.split('.');
if (parts.length === 2 && parts[1].length > 2) {
parts[1] = parts[1].slice(0, 2); // Limit to 2 decimals
}
field.value = parts.join('.'); // Combine integer and decimal parts
}


function formatNumberWithCommas(fieldOrValue) {
// If input is a field object, extract its value
let value = typeof fieldOrValue === 'object' ? fieldOrValue.value : fieldOrValue;

// Remove non-numeric characters (except '.')
value = value.replace(/[^0-9.]/g, '');

// Split integer and decimal parts and format
const parts = value.split('.');
parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
return parts.join('.');
}


function removeCommas(value) {
return value.replace(/,/g, ''); // Remove all commas
}


Object.values(fields).forEach(field => {
field.addEventListener('input', function () {
validateInput(field);
formatNumberWithCommas(field); // Apply formatting
updateValues(); // Recalculate values dynamically
});
});