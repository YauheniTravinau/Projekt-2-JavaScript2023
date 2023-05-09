const currencySelect = document.getElementById('currency');
const amountInput = document.getElementById('amount');
const convertBtn = document.getElementById('convertBtn');
const resultDiv = document.getElementById('result');
const errorDiv = document.createElement('div');
errorDiv.id = 'error';

const apiUrl = 'https://api.nbp.pl/api/exchangerates/rates/a/';

// funkcja do pobierania kursu waluty z API NBP
async function getExchangeRate(currencyCode) {
    const response = await fetch(apiUrl + currencyCode);
    if (!response.ok) {
        throw new Error('Nie udało się pobrać kursu waluty.');
    }
    const data = await response.json();
    return data.rates[0].mid;
}

// funkcja do przeliczania kwoty z wybranej waluty na złotówki
async function convertCurrency() {
    const currencyCode = currencySelect.value;
    const amount = amountInput.value;

    // wyświetlenie loadera
    resultDiv.innerHTML = '<div class="loader"></div>';

    try {
        const exchangeRate = await getExchangeRate(currencyCode);
        const result = amount * exchangeRate;
        resultDiv.textContent = `${amount} ${currencyCode} = ${result.toFixed(2)} PLN`;
    } catch (error) {
        // wyświetlenie komunikatu o błędzie
        errorDiv.textContent = error.message;
        resultDiv.innerHTML = '';
        resultDiv.appendChild(errorDiv);
    }
}

// nasłuchiwanie na kliknięcie przycisku "Przelicz"
convertBtn.addEventListener('click', convertCurrency);

// aby po załadowaniu strony była wybrana domyślnie waluta euro
window.addEventListener('load', function () {
    currencySelect.value = 'EUR';
});

// aby po wciśnięciu klawisza "Enter" również przeliczało walutę
document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        convertCurrency();
    }
});
