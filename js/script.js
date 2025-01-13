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

// List of fields that will update totalMoney
const fieldsToUpdateTotalMoney = [
    fields.cash,
    fields.tradingGoods,
    fields.debts,
    fields.liabilities
];

// List of fields that will update nisab
const fieldsToUpdateNisab = [fields.goldPrice];

function calculateTotalMoney() {

   if(fields.cash.value != '' || fields.tradingGoods.value != '' || fields.debts.value != '' || fields.liabilities.value != '' )
   {
    const cash = parseFloat(removeCommas(fields.cash.value)) || 0;
    const tradingGoods = parseFloat(removeCommas(fields.tradingGoods.value)) || 0;
    const debts = parseFloat(removeCommas(fields.debts.value)) || 0;
    const liabilities = parseFloat(removeCommas(fields.liabilities.value)) || 0;

    const total = cash + tradingGoods + debts - liabilities;

    return total.toFixed(2);
   }
   else
   {
    return '';
   }
}

function calculateNisab() {
    const goldPrice = parseFloat(removeCommas(fields.goldPrice.value)) || 0;

    if (fields.goldPrice.value != '') {
        return (goldPrice * 85).toFixed(2); // Nisab calculation
    } else {
        return '';
    }
}

function calculateZakat(totalMoney, nisab) {
    if (fields.totalMoney.value != '' && fields.nisab.value != '') {
        const totalMoneyNum = parseFloat(totalMoney);
        const nisabNum = parseFloat(nisab);

        if (totalMoneyNum >= nisabNum) {
            return (totalMoneyNum * zakatPercentage / 100).toFixed(2);
        } else {
            return "لا زكاة - وعاء الزكاة لم يبلغ النصاب"; // No Zakat message
        }
    }
    return '';
}

// Update totalMoney only when the relevant fields are updated
fieldsToUpdateTotalMoney.forEach(field => {
    field.addEventListener('input', function () {
        validateInput(field);
        formatNumberWithCommas(field); // Format the input value with commas
        const totalMoney = calculateTotalMoney();
        const nisab = calculateNisab();
        
        // Update totalMoney field if the value changes
        const formattedTotalMoney = totalMoney !== '' ? formatNumberWithCommas(totalMoney) : '';
        if (fields.totalMoney.value !== formattedTotalMoney) {
            fields.totalMoney.value = formattedTotalMoney;
            fields.totalMoney.classList.add('readonly-updated');
            setTimeout(() => fields.totalMoney.classList.remove('readonly-updated'), 1000);
        }

        // Recalculate zakatAmount only if both totalMoney and nisab are not empty
        if (fields.totalMoney.value != '' && fields.nisab.value != '') {
            const zakatAmount = calculateZakat(totalMoney, nisab);
            if (zakatAmount >= 0) {
                fields.zakatAmount.value = formatNumberWithCommas(zakatAmount);
            } else {
                fields.zakatAmount.value = zakatAmount;
            }
        }
    });
});

// Update nisab only when the goldPrice field is updated
fieldsToUpdateNisab.forEach(field => {
    field.addEventListener('input', function () {
        validateInput(field);
        formatNumberWithCommas(field); // Format the input value with commas
        const nisab = calculateNisab();

        // Update nisab field if the value changes
        const formattedNisab = nisab !== '' ? formatNumberWithCommas(nisab) : '';
        if (fields.nisab.value !== formattedNisab) {
            fields.nisab.value = formattedNisab;
            fields.nisab.classList.add('readonly-updated');
            setTimeout(() => fields.nisab.classList.remove('readonly-updated'), 1000);
        }

        // Recalculate zakatAmount only if both totalMoney and nisab are not empty
        const totalMoney = calculateTotalMoney();
        if (fields.totalMoney.value != '' && fields.nisab.value != '') {
            const zakatAmount = calculateZakat(totalMoney, nisab);
            if (zakatAmount >= 0) {
                fields.zakatAmount.value = formatNumberWithCommas(zakatAmount);
            } else {
                fields.zakatAmount.value = zakatAmount;
            }
        }
    });
});

// Update zakatAmount when zakatPercentage (from radio buttons) changes
fields.hijri.addEventListener('change', function () {
    if (fields.hijri.checked) {
        zakatPercentage = 2.5; // Hijri percentage
        const totalMoney = calculateTotalMoney();
        const nisab = calculateNisab();
        
        // Recalculate zakatAmount only if both totalMoney and nisab are not empty
        if (totalMoney && nisab) {
            const zakatAmount = calculateZakat(totalMoney, nisab);
            if (zakatAmount >= 0) {
                fields.zakatAmount.value = formatNumberWithCommas(zakatAmount);
            } else {
                fields.zakatAmount.value = zakatAmount;
            }
        }
    }
});

fields.miladi.addEventListener('change', function () {
    if (fields.miladi.checked) {
        zakatPercentage = 2.577; // Miladi percentage
        const totalMoney = calculateTotalMoney();
        const nisab = calculateNisab();
        
        // Recalculate zakatAmount only if both totalMoney and nisab are not empty
        if (totalMoney && nisab) {
            const zakatAmount = calculateZakat(totalMoney, nisab);
            if (zakatAmount >= 0) {
                fields.zakatAmount.value = formatNumberWithCommas(zakatAmount);
            } else {
                fields.zakatAmount.value = zakatAmount;
            }
        }
    }
});

// Formatting functions
function formatNumberWithCommas(fieldOrValue) {
    let value = typeof fieldOrValue === 'object' ? fieldOrValue.value : fieldOrValue;
    const isNegative = value.startsWith('-');
    value = value.replace(/[^0-9.]/g, ''); // Remove non-numeric characters (except '.')
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to integer part
    const formattedValue = (isNegative ? '-' : '') + parts.join('.');

    if (typeof fieldOrValue === 'object') {
        fieldOrValue.value = formattedValue;
    }
    return formattedValue;
}

function removeCommas(value) {
    return value.replace(/,/g, ''); // Remove all commas
}

function validateInput(field) {
    let value = field.value;
    const arabicToWesternMap = {
        '٠': '0',
        '١': '1',
        '٢': '2',
        '٣': '3',
        '٤': '4',
        '٥': '5',
        '٦': '6',
        '٧': '7',
        '٨': '8',
        '٩': '9'
    };

    // Replace Eastern Arabic numerals with Western numerals
    value = value.replace(/[٠-٩]/g, char => arabicToWesternMap[char]);
    value = value.replace(/[^0-9.]/g, ''); // Remove non-numeric characters except for the dot
    const parts = value.split('.');

    if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
    }

    if (field !== fields.goldPrice) {
        if (parts.length > 1 && parts[1].length > 2) {
            value = parts[0] + '.' + parts[1].slice(0, 2);
        }
    } else {
        if (parts.length > 1 && parts[1].length > 5) {
            value = parts[0] + '.' + parts[1].slice(0, 5);
        }
    }

    field.value = value;
}
