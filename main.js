let locationButton = document.getElementById("get-location");
const locationDiv = document.getElementById("location-details");

locationButton.addEventListener("click", () => {
    //Geolocation APU is used to get geographical position of a user and is available inside the navigator object
    if (navigator.geolocation) {
        //returns position(latitude and longitude) or error
        navigator.geolocation.getCurrentPosition(showLocation, checkError);
    } else {
        //For old browser i.e IE
        locationDiv.innerText = "The browser does not support geolocation";
    }
});

// The getLocation function returns a new Promise that wraps the geolocation retrieval logic.
// The promise constructor takes two callback functions as arguments: resolve and reject.
const getLocation = () => {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        } else {
            reject(new Error("Geolocation is not available in this browser."));
        }
    });
};

// Takes latitude and longitude as input parameters and returns a Promise
const getAddressFromCoordinates = (latitude, longitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            return `${data.address.city}, ${data.address.country}`;
        });
};

const getLocationBtn = document.getElementById("get-location");

getLocationBtn.addEventListener("click", () => {
    getLocation()
        .then((position) => {
            return getAddressFromCoordinates(
                position.coords.latitude,
                position.coords.longitude
            );
        })
        .then((address) => {
            // Instead of updating the locationDiv, show an alert
            locationDiv.innerText = `Your location: ${address}`;
        })
        .catch((error) => {
            // Handle errors here
            checkError(error);
        });
});