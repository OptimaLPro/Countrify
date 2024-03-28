document.addEventListener('DOMContentLoaded', () => {
    const themeText = document.querySelector('.theme-text');
    themeText.textContent = localStorage.getItem('darkTheme') === 'true' ? 'Light Mode' : 'Dark Mode';


    const countryDetailsContainer = document.querySelector('.main-info');
    const loader = document.querySelector('.loader');

    const urlParams = new URLSearchParams(window.location.search);
    const countryName = urlParams.get('name');

    getLanguages = (languages) => {
        const values = Object.values(languages);
        return values.join(", ");
    }

    getBorderCountries = async (borderCodes) => {
        const borderNames = [];

        if (borderCodes.length === 0) {
            return 'No border countries - This is an island!';
        }

        for (const code of borderCodes) {
            try {
                const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch data for ${code}`);
                }
                const data = await response.json();
                borderNames.push(data[0].name.common);
            } catch (error) {
                console.error(error);
                borderNames.push(`Error fetching data for ${code}`);
            }
        }

        if (borderNames.length === 0) {
            return 'No border countries - This is an island!';
        }
        return borderNames.join(", ");
    }

    fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Country not found');
            }
            return response.json();
        })
        .then(async data => {
            const country = data[0];

            const nativeNames = country.name.nativeName;
            const firstLanguage = Object.values(nativeNames)[0];

            const currency = country.currencies;
            const firstCurrency = Object.values(currency)[0];

            let borderCountries = '';
            if (country.borders && country.borders.length > 0) {
                borderCountries = await getBorderCountries(country.borders);
            } else {
                borderCountries = 'No border countries - This is an island!';
            }

            countryDetailsContainer.innerHTML = `
                <div class="parent">
                <div class="div1"><img src="${country.flags.svg}" alt="${country.name.common} Flag"/> </div>
                <div class="div2">
                    <h1>${country.name.common}</h1>
                </div>
                <div class="div3">
                    <div class="div-span-info"><span class="span-info">Native Name: </span>${firstLanguage.official}</div>
                    <div class="div-span-info"><span class="span-info">Population: </span>${country.population.toLocaleString()}</div>
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
                    <div class="border-div"><span class="span-info">Border countries: </span>${borderCountries}</div>
                </div>
                </div>
            `;
        })
        .catch(error => {
            console.error(error);
            countryDetailsContainer.innerHTML = '<p>Error loading country details</p>';
        })
        .finally(() => {
            loader.style.display = 'none';
        });

    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
    if (isDarkTheme) {
        body.classList.add('dark-theme');
    }

    const toggleDarkTheme = () => {
        body.classList.toggle('dark-theme');
        themeText.textContent = localStorage.getItem('darkTheme') === 'true' ? 'Light Mode' : 'Dark Mode';

        localStorage.setItem('darkTheme', body.classList.contains('dark-theme'));
    };

    themeToggle.addEventListener('click', toggleDarkTheme);

});
