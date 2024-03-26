document.addEventListener('DOMContentLoaded', () => {
    const countryDetailsContainer = document.querySelector('.main-info');
    const loader = document.querySelector('.loader');

    // Retrieve country name from query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const countryName = urlParams.get('name');

    getLanguages = (languages) => {
        const values = Object.values(languages);
        return values.join(", ");
    }

    getBorderCountries = (borderCountries) => {
        const values = Object.values(borderCountries);
        return values.join(", ");
    }

    // Fetch country data based on the name
    fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Country not found');
            }
            return response.json();
        })
        .then(data => {
            const country = data[0]; // Assuming the API returns data in an array

            const nativeNames = country.name.nativeName;
            const firstLanguage = Object.values(nativeNames)[0];

            const currecy = country.currencies;
            const firstCurrency = Object.values(currecy)[0];

            // Populate country details on the page
            countryDetailsContainer.innerHTML = `
                <img src="${country.flags.svg}" alt="${country.name.common} Flag" style="width: 50px; height: 30px; />
                <h1>${country.name.common}</h1>
                <div>Population: ${country.population}</div>
                <div>Region: ${country.region}</div>
                <div>Capital: ${country.capital}</div>
                <!-- Add more details as needed -->
            `;

            countryDetailsContainer.innerHTML = `
                <div class="parent">
                <div class="div1"><img src="${country.flags.svg}" alt="${country.name.common} Flag"/> </div>
                <div class="div2">
                    <h1>${country.name.common}</h1>
                </div>
                <div class="div3">
                    <div class="div-span-info"><span class="span-info">Native Name: </span>${firstLanguage.official}</div>
                    <div class="div-span-info"><span class="span-info">Population: </span>${country.population}</div>
                    <div class="div-span-info"><span class="span-info">Region: </span>${country.region}</div>
                    <div class="div-span-info"><span class="span-info">Sub Region: </span>${country.subregion}</div>
                    <div class="div-span-info"><span class="span-info">Capital: </span>${country.capital}</div>
                </div>
                <div class="div4">
                    <div class="div-span-info"><span class="span-info">Top Level Domain: </span>${country.tld}</div>
                    <div class="div-span-info"><span class="span-info">Currencies: </span>${firstCurrency.name}</div>
                    <div class="div-span-info"><span class="span-info">Languages: </span>${getLanguages(country.languages)}</div>
                </div>
                <div class="div5">
                    <div class="border-div"><span class="span-info">Border countries: </span></div>
                </div>
                </div>
            `;
        })
        .catch(error => {
            console.error(error);
            countryDetailsContainer.innerHTML = '<p>Error loading country details</p>';
        })
        .finally(() => {
            // Hide the loader after data is loaded or an error occurs
            loader.style.display = 'none';
        });
});
