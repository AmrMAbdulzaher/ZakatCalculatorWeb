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

function updateValues() {
    const totalMoney = calculateTotalMoney();
    const nisab = calculateNisab();

    fields.totalMoney.value = totalMoney ? formatNumberWithCommas({ value: totalMoney }) : '';
    fields.nisab.value = nisab ? formatNumberWithCommas({ value: nisab }) : '';

    const zakatAmount = calculateZakat(totalMoney, nisab);
    fields.zakatAmount.value = zakatAmount;
}

fields.hijri.addEventListener('change', function () {
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
        .replace(/[^0-9.]/g, '')
        .replace(/(\\..*?)\\..*/g, '$1')
        .replace(/^0+(?!\\.|$)/, '');

    const parts = field.value.split('.');
    if (parts.length === 2 && parts[1].length > 2) {
        parts[1] = parts[1].slice(0, 2);
    }
    field.value = parts.join('.');
}

function formatNumberWithCommas(fieldOrValue) {
    let value = typeof fieldOrValue === 'object' ? fieldOrValue.value : fieldOrValue;
    value = value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
}

function removeCommas(value) {
    return value.replace(/,/g, '');
}

Object.values(fields).forEach(field => {
    field.addEventListener('input', function () {
        validateInput(field);
        formatNumberWithCommas(field);
        updateValues();
    });
});
