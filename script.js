// Function to fetch and display countries
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

// Initial request to fetch and display countries
requestCountries();

// Event listener for input events on the search input
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.trim().toLowerCase(); // Trim and convert to lowercase
        const countries = document.querySelectorAll('.country');

        countries.forEach(country => {
            const countryName = country.dataset.countryName.toLowerCase();
            const shouldDisplay = countryName.includes(searchTerm);
            country.style.display = shouldDisplay ? 'block' : 'none';
        });
    });

    const dropdownHeader = document.querySelector('.dropdown-header');
    const dropdownBody = document.querySelector('.dropdown-body');

    dropdownHeader.addEventListener('click', () => {
        dropdownBody.classList.toggle('visible');
    });

    // Event listener for click events on the region filters
    const regionFilters = document.querySelectorAll('.dropdown-body li');
    regionFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            const selectedRegion = filter.dataset.region;
            const countries = document.querySelectorAll('.country');

            countries.forEach(country => {
                const countryRegion = country.dataset.region;
                const shouldDisplay = selectedRegion === 'all' || countryRegion === selectedRegion;
                country.style.display = shouldDisplay ? 'block' : 'none';
            });
        });
    });

    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    // Check if the theme preference is stored in local storage
    const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
    if (isDarkTheme) {
        body.classList.add('dark-theme');
    }

    // Function to toggle the dark theme and update local storage
    const toggleDarkTheme = () => {
        body.classList.toggle('dark-theme');
        const themeText = document.querySelector('.theme-text');
        themeText.textContent = body.classList.contains('dark-theme') ? 'Light Mode' : 'Dark Mode';

        // Update theme preference in local storage
        localStorage.setItem('darkTheme', body.classList.contains('dark-theme'));
    };

    themeToggle.addEventListener('click', toggleDarkTheme);

});
