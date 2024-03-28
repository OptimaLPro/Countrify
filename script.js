const requestCountries = async () => {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();

        const countriesGrid = document.querySelector('.countries-grid');

        data.forEach(country => {
            const countryLink = document.createElement('a');
            countryLink.href = `details.html?name=${encodeURIComponent(country.name.common)}`; // Include country name as query parameter
            countryLink.classList.add('country', 'scale-effect');
            countryLink.dataset.countryName = country.name.common;
            countryLink.dataset.region = country.region.toLowerCase(); // Store region data for filtering

            const countryFlag = document.createElement('div');
            countryFlag.classList.add('country-flag');
            const flagImg = document.createElement('img');
            flagImg.src = country.flags.svg;
            flagImg.alt = `${country.name.common} Flag`;
            countryFlag.appendChild(flagImg);

            const countryInfo = document.createElement('div');
            countryInfo.classList.add('country-info');
            const countryTitle = document.createElement('h2');
            countryTitle.classList.add('country-title');
            countryTitle.textContent = country.name.common;
            const countryBrief = document.createElement('ul');
            countryBrief.classList.add('country-brief');
            const populationLi = document.createElement('li');
            populationLi.innerHTML = `<strong>population:</strong> ${country.population}`;
            const regionLi = document.createElement('li');
            regionLi.innerHTML = `<strong>Region:</strong> ${country.region}`;
            const capitalLi = document.createElement('li');
            capitalLi.innerHTML = `<strong>capital:</strong> ${country.capital}`;
            countryBrief.appendChild(populationLi);
            countryBrief.appendChild(regionLi);
            countryBrief.appendChild(capitalLi);
            countryInfo.appendChild(countryTitle);
            countryInfo.appendChild(countryBrief);

            countryLink.appendChild(countryFlag);
            countryLink.appendChild(countryInfo);

            countriesGrid.appendChild(countryLink);
        });
    } catch (error) {
        console.error(error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const themeText = document.querySelector('.theme-text');
    themeText.textContent = localStorage.getItem('darkTheme') === 'true' ? 'Light Mode' : 'Dark Mode';

    const searchInput = document.querySelector('.search-input');
    const dropdownHeader = document.querySelector('.dropdown-header');
    const dropdownBody = document.querySelector('.dropdown-body');
    const regionFilters = document.querySelectorAll('.dropdown-body li');

    const closeDropdownAndDisplayRegion = (selectedRegion) => {
        dropdownBody.classList.remove('visible');
        dropdownHeader.textContent = `Filter by Region: ${selectedRegion}`;

        const countries = document.querySelectorAll('.country');
        countries.forEach(country => {
            const countryRegion = country.dataset.region;
            const shouldDisplay = selectedRegion === 'all' || countryRegion === selectedRegion;
            country.style.display = shouldDisplay ? 'block' : 'none';
        });
    };

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const countries = document.querySelectorAll('.country');

        countries.forEach(country => {
            const countryName = country.dataset.countryName.toLowerCase();
            const shouldDisplay = countryName.includes(searchTerm);
            country.style.display = shouldDisplay ? 'block' : 'none';
        });
    });

    dropdownHeader.addEventListener('click', () => {
        dropdownBody.classList.toggle('visible');
    });

    regionFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            const selectedRegion = filter.dataset.region;
            searchInput.value = '';
            closeDropdownAndDisplayRegion(selectedRegion);
        });
    });

    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
    if (isDarkTheme) {
        body.classList.add('dark-theme');
    }

    const toggleDarkTheme = () => {
        body.classList.toggle('dark-theme');
        const themeText = document.querySelector('.theme-text');
        themeText.textContent = body.classList.contains('dark-theme') ? 'Light Mode' : 'Dark Mode';

        localStorage.setItem('darkTheme', body.classList.contains('dark-theme'));
    };

    themeToggle.addEventListener('click', toggleDarkTheme);

    requestCountries();
});
