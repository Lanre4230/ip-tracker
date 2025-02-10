let selectors = () => {
  let appSelectors = {
    mapDisplay: "#mapDisplay",
    ipValue: "#ipValue",
    locationValue: "#locationValue",
    timezoneValue: "#timezoneValue",
    ispValue: "#ispValue",
    searchBar: "#searchBar",
    searchBtn: ".searchBtn",
  };

  return {
    appSelectors,
  };
};

let map;

let displayMap = (lat, long) => {
  var container = L.DomUtil.get("mapDisplay");
  if (container != null) {
    container._leaflet_id = null;
  }

  if (!map) {
    map = L.map("mapDisplay").setView([lat, long], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    map.on("moveend", () => {
      let center = map.getCenter();
      console.log("Map moved to:", center); // Log the new center coordinates
      getIpDetailsByCoordinates(center.lat, center.lng);
    });

    map.on("click", (e) => {
      let lat = e.latlng.lat;
      let lng = e.latlng.lng;
      console.log("Map clicked at:", lat, lng); // Log the click coordinates
      map.setView([lat, lng], 14);
      getIpDetailsByCoordinates(lat, lng);
    });
  } else {
    map.setView([lat, long], 14);
  }

  let myIcon = L.icon({
    iconUrl: "../assets/images/icon-location.svg",
    iconAnchor: [lat, long],
  });

  L.marker([lat, long]).addTo(map);
};

let getIpDetails = (ip) => {
  let key = "at_w9qaO4yliETQeCpcLgvsvlu9vdM1F"; // Replace with your IPify API key

  fetch(
    `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=${key}&ipAddress=${ip}`
  )
    .then((resp) => {
      if (!resp.ok) {
        throw new Error("Network response was not ok " + resp.statusText);
      }
      return resp.json();
    })
    .then((data) => {
      console.log(data); // Log the data to see what is returned
      if (data.location) {
        document.querySelector(selectors().appSelectors.ipValue).innerText =
          data.ip;
        document.querySelector(
          selectors().appSelectors.locationValue
        ).innerText = `${data.location.city}, ${data.location.country}`;
        document.querySelector(
          selectors().appSelectors.timezoneValue
        ).innerText = `UTC ${data.location.timezone}`;
        document.querySelector(selectors().appSelectors.ispValue).innerText =
          data.isp;
        displayMap(data.location.lat, data.location.lng);
      } else {
        console.error("No results found for the given IP address.");
      }
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
};

let getIpDetailsByCoordinates = (lat, long) => {
  let key = "at_w9qaO4yliETQeCpcLgvsvlu9vdM1F"; // Replace with your IPify API key

  fetch(
    `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=${key}&latitude=${lat}&longitude=${long}`
  )
    .then((resp) => {
      if (!resp.ok) {
        throw new Error("Network response was not ok " + resp.statusText);
      }
      return resp.json();
    })
    .then((data) => {
      console.log(data); // Log the data to see what is returned
      if (data.location) {
        document.querySelector(selectors().appSelectors.ipValue).innerText =
          data.ip;
        document.querySelector(
          selectors().appSelectors.locationValue
        ).innerText = `${data.location.city}, ${data.location.country}`;
        document.querySelector(
          selectors().appSelectors.timezoneValue
        ).innerText = `UTC ${data.location.timezone}`;
        document.querySelector(selectors().appSelectors.ispValue).innerText =
          data.isp;
      } else {
        console.error("No results found for the given coordinates.");
      }
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
};

let getUserIpAddress = (() => {
  fetch("https://api.ipify.org?format=json")
    .then((resp) => {
      if (!resp.ok) {
        throw new Error("Network response was not ok " + resp.statusText);
      }
      return resp.json();
    })
    .then((data) => {
      console.log(data); // Log the data to see what is returned
      getIpDetails(data.ip);
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
})();

let eventsHandlers = (() => {
  let ipInput = document.querySelector(selectors().appSelectors.searchBar);
  let searchBtn = document.querySelector(selectors().appSelectors.searchBtn);

  ipInput.addEventListener("change", () => {
    console.log("IP input changed:", ipInput.value); // Log the input value
    getIpDetails(ipInput.value);
  });

  searchBtn.addEventListener("click", () => {
    console.log("Search button clicked, IP:", ipInput.value); // Log the input value
    getIpDetails(ipInput.value);
  });
})();
