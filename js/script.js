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

    // Replace Eastern Arabic numerals with Western Arabic numerals
    value = value.replace(/[٠-٩]/g, (char) => arabicToWesternMap[char]);

    // Remove non-numeric characters except the dot
    value = value.replace(/[^0-9.]/g, '');
    
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
    const maxAllowedValue = 999999999999999.99;
    if (parseFloat(value) > maxAllowedValue) {
        // Do not allow further input if value exceeds max
        value = value.slice(0, -1); // Remove the last entered character
    }
    
    field.value = value;
}

function clearAll() {
    Object.values(fields).forEach(field => {
        if (field.tagName === 'INPUT' && field.type === 'text') {
            field.value = '';
        }
    });
    fields.hijri.checked = true; // Reset to default method
    zakatPercentage = 2.5;
}

// Open the modal with the respective tip content
function openModal(tipId) {
    var modal = document.getElementById("tipModal");
    var modalText = document.getElementById("modalText");
  
    // Define the content for each tip
    var tips = {
      "tip1": {
        title: "ركز في نيتك عند إخراج الأموال\nوفَرِّق بين النذر والصدقة والزكاة",
        content: "1- النذر: ما نذرته لله وكفارته ككفارة اليمين.\n2- الصدقة: في أي وقت لأي شخص غني أو فقير.\n3- الزكاة: عند بلوغ المال النصاب ومرور الحول ولها مصارفها ولا تسقط بالتقادم بل تعود لحسابها ولو بشكل تقديري قدر المستطاع وتخرجها حسب المتاح معك من سيولة خلال العام."
      },
      "tip2": {
        title: "مصارف الزكاة", 
        content: "1- الفقراء: من لا يجد شيء.\n2- المساكين: الذي يجد بعض ما يكفيه.\n3- العاملين عليها: المكلف بجبايتها وتوزيعها.\n4- المؤلفة قلوبهم: من دخل في الإسلام وكان في حاجة إلى تأليف قلبه.\n5- الرقاب: عتق المسلم عبدًا كان أو أمة، و فك الأسرى ومساعدة المكاتبين.\n6- الغارمين: من استدان في غير معصية وليس عنده سداد دينه، ومن غرم في صلحٍ مشروع.\n7- في سبيل الله: المجاهدين والمرابطين في سبيل الله.\n8- ابن السبيل: مسافر أنقطعت به الأسباب عن بلده وماله فيعان على الرجوع لبلده بما يحتاج."
      }
    };
  
    // Set the modal text based on the selected tip
    modalTitle.textContent = tips[tipId].title;
    modalText.textContent = tips[tipId].content;  
    // Show the modal
    modal.style.display = "block";
  }
  
  // Close the modal
  function closeModal() {
    var modal = document.getElementById("tipModal");
    modal.style.display = "none";
  }
  
// Scroll Up function
function scrollUp() {
    window.scrollBy({
      top: -window.innerHeight, // Scroll up one screen height
      left: 0,
      behavior: 'smooth' // Smooth scroll
    });
    updateScrollButtons();
  }
  
  // Scroll Down function
  function scrollDown() {
    window.scrollBy({
      top: window.innerHeight, // Scroll down one screen height
      left: 0,
      behavior: 'smooth' // Smooth scroll
    });
    updateScrollButtons();
  }
  function updateScrollButtons() {
    // Get the scroll buttons
    var scrollUpBtn = document.getElementById("scrollUpBtn");
    var scrollDownBtn = document.getElementById("scrollDownBtn");

    const scrollableHeight = document.body.scrollHeight - window.innerHeight;

    // Check if we are at the top of the page
    if (window.scrollY === 0) {
        scrollUpBtn.classList.add("hidden"); // Hide the up button if at the top
    } else {
        scrollUpBtn.classList.remove("hidden"); // Show the up button if not at the top
    }

    // Check if we are at the bottom of the page
    if (Math.ceil(window.scrollY) >= scrollableHeight) {
        scrollDownBtn.classList.add("hidden"); // Hide the down button if at the bottom
    } else {
        scrollDownBtn.classList.remove("hidden"); // Show the down button if not at the bottom
    }
}
  
  // Run the update function on page load and when scrolling
  window.onload = updateScrollButtons;
  window.onscroll = updateScrollButtons;