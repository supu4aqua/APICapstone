'use strict';

const geocode_apiKey = 'AIzaSyA_dsM-989v-ukkzPRkvC4wVUkqMyp2pb8'
const trail_apiKey = '200584708-6c2ed6bce77a3687c608095444a035bf'

const geocode_searchURL = 'https://maps.googleapis.com/maps/api/geocode/json'
const trail_searchURL = 'https://www.trailrunproject.com/data/get-trails'

let maxDistance = 30; // Max distance, in miles, from lat, lon. Default: 30. Max: 200.
let maxResults = 10; //Max number of trails to return. Default: 10. Max: 500.
let sort = 'quality'; //Values can be 'quality', 'distance'. Default: quality.
let minLength = 0; //minLength - Min trail length, in miles. Default: 0 (no minimum).
let minStars = 0; // Min star rating, 0-4. Default: 0.
let latitude = 0;
let longitude = 0;

function findCoord(addressEntered) {
    const locationParams = {
        address: addressEntered,
        key: geocode_apiKey,
    };
    //Create the parameters query for API call URL
    const queryItems = Object.keys(locationParams)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(locationParams[key])}`)
    const queryString = queryItems.join('&');
    const urlCoord = geocode_searchURL + '?' + queryString;

    fetch(urlCoord)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statueText);
        })
        .then(responseJson => {
            const coords = responseJson.results[0].geometry.location;
            //searchTrails(responseJson);
            searchTrails(coords);

        })
        // displayResults(responseJson, maxResults)
        //console.log(JSON.stringify(responseJson, null, 2));

    .catch(err => {
        $('#js-error-message').text(`Location not found: ${err.message}`);
    });
}

function searchTrails(coords) {
    // const coords = responseJson.results[0].geometry.location;
    //console.log(coords);
    latitude = coords.lat;
    longitude = coords.lng;
    /*const params = {
        lat: latitude,
        lon: longitude,
        key: trail_apiKey,
        maxDistance: maxDistance,
        maxResults: maxResults,
        sort: sort,
        minLength: minLength,
        minStars: minStars,
    };
    const queryParams = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    const trailString = queryParams.join('&');
    const url = trail_searchURL + '?' + trailString;
    console.log(url);
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statueText);
        })
        .then(responseJson => displayTrails(responseJson, maxResults))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });*/
    getResponse();

}

function getResponse() {
    const params = {
        lat: latitude,
        lon: longitude,
        key: trail_apiKey,
        maxDistance: maxDistance,
        maxResults: maxResults,
        sort: sort,
        minLength: minLength,
        minStars: minStars,
    };
    const queryParams = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    const trailString = queryParams.join('&');
    const url = trail_searchURL + '?' + trailString;

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statueText);
        })
        .then(responseJson => displayTrails(responseJson, maxResults))
        .catch(err => {
            $('#js-error-message').text(`Trail not found: ${err.message}`);

        });
}

function displayTrails(responseJson, maxResults) {
    // console.log("display");
    $('#results-list').empty();
    $('#js-error-message').empty();



    if (responseJson.trails.length == 0) {
        $('#js-error-message').text(`Trail not found!`);
    } else {
        // $('#filters').removeClass('hidden');
        $('#filters').removeClass('hidden');
        $('#filters').addClass('filters');
        /*  $('#filters').append(`<label for="sort">Sort By</label>
           <select id="sort" name="sort">
              <option value="quality">Quality</option>
              <option value="distance">Distance</option>
          </select>
          <label for="rating">Minimum Rating</label>
          <select id="rating" name="rating">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4/option>
          </select>
          <label for="distance">Maximum Distance(in miles)</label>
          <input type="number" id="distance" name="distance" min="30" max="200" placeholder="30">
          <label for="length">Minimum trail length(in miles)</label>
          <input type="number" id="length" name="length">
          <input type="button" class="apply" value="Apply">`)*/


        for (let i = 0; i < responseJson.trails.length & i < maxResults; i++) {
            $('#results-list').append(
                    `<div class="details"><h3>${responseJson.trails[i].name}</h3>
                 <p>${responseJson.trails[i].summary}</p>
                 <p>Rating: ${responseJson.trails[i].stars}</p>
                 <p>Location: ${responseJson.trails[i].location}</p>
                 <p>Trail Length: ${responseJson.trails[i].length} miles</p>
                 <h4><a href="${responseJson.trails[i].url}" target="_blank">View Details</a></h4>
                 </div>`
                )
                /*  $('#results-list').append(
                      `<h3>${responseJson.trails[i].name}</h3>
                     <p>${responseJson.trails[i].summary}</p>
                     <p>Rating: ${responseJson.trails[i].stars}</p>
                     <p>Location: ${responseJson.trails[i].location}</p>
                     <p>Trail Length: ${responseJson.trails[i].length} miles</p>
                     <h4><a href="${responseJson.trails[i].url}">View Details</a></h4>
                     `
                  )*/
        };
    }
    //display the results section
    // $('#results').removeClass('hidden');
}

function findTrails() {
     $('form').on('click', '#find', event => {
    //$('form').submit(event => {
        event.preventDefault();
        $('#results-list').empty();
        $('#js-error-message').empty();
        //$('#filters').empty();
        $('#filters').addClass('hidden');
        $('#filters').removeClass('filters');
        const addressEntered = $('#js-city').val();
        // $('html').css('background-image', 'none');
        $('#rating').val(1);
        $('#sort').val('quality');
      $('#length').val("");
        $('#distance').val(30);
        maxDistance = 30;
        maxResults = 10;
        sort = 'quality';
        minLength = 0;
        minStars = 0;
        findCoord(addressEntered);
    });
}

function filterTrails() {
  //  $('form').on('click', '.apply', event => {
        //('form').on('click', '#apply', event => {
        $('form').submit(event => {
         event.preventDefault();
        maxDistance = $('#distance').val();
        /*if (distance >= 30 && distance <= 200) {
            maxDistance = distance;
        }*/
        sort = $('#sort').val();
        minStars = $('#rating').val();
        minLength = $('#length').val();
        getResponse();

    });
}

$(findTrails);
$(filterTrails);
