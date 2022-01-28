
let map;
let markers = [];
let infoWindow;

const storesList = document.querySelector('.stores-list-container');

function initMap() {
    const losAngeles = {
        lat: 34.063380,
        lng: -118.358080
    };

    map = new google.maps.Map(document.getElementById('map'), {
        center: losAngeles,
        zoom: 13,
        mapTypeId: 'roadmap',
        streetViewControl: false,
        zoomControl: false,
        mapTypeControl: false,
        fullscreenControl: false
    });

    google.maps.event.addListenerOnce(map, 'tilesloaded', () => {
        document.getElementById('loading').style.display = 'none';
    });
    
    infoWindow = new google.maps.InfoWindow();
    OptionButton();
    searchStores();
}

function searchStores(){
    let foundStores = [];
    const inputText = document.getElementById('zip-code-input').value.toLowerCase();
    if(inputText.length != 0){
        storesList.style.display = 'block';
        for(let store of stores){
            let address = store['addressLines'];
            let FullAddress = address[0]+address[1];
            if(FullAddress.toLowerCase().indexOf(inputText) != -1){
                foundStores.push(store);
            }
        }
    }else {
        storesList.style.display = 'none';
        foundStores = stores;
    }
    clearLocations();
    displayStores(foundStores);
    showStoresMarkers(foundStores);
    setOnClickListener();
}

function clearLocations(){
    infoWindow.close();
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0;
}

function setOnClickListener(){
    const storeElements = document.querySelectorAll('.store-container');
    storeElements.forEach(function(element, index){
        element.addEventListener('click', function(){
            new google.maps.event.trigger(markers[index], 'click');
            storesList.style.display = 'none';
        })
    });
}

function displayStores(stores){
    let storesHtml = '';
    if(stores.length != 0){
        for(let [index, store] of stores.entries()){
            let address = store['addressLines'];
            let phone = store['phoneNumber'];
            storesHtml += `
                <div class="store-container">
                    <div class="store-container-background">
                        <div class="store-info-container">
                            <div class="store-address">
                                <span class="address">${address[0]}</span>
                                <span class="address">${address[1]}</span>
                            </div>
                            <div class="store-phone-number">${phone}</div>
                        </div>
                        <div class="store-number-container">
                            <div class="store-number">
                                ${index+1}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.querySelector('.stores-list').innerHTML = storesHtml;
        }
    }else {
        storesHtml += `
            <div class="error-message-container">
                <div class="error-message">
                    STORE NOT FOUND
                </div>
            </div>
        `;
        document.querySelector('.stores-list').innerHTML = storesHtml;
    }
}


function showStoresMarkers(stores){
    // let bounds = new google.maps.LatLngBounds();
    for(let [index, store] of stores.entries()){
        let latlng = new google.maps.LatLng(
            store["coordinates"]["latitude"],
            store["coordinates"]["longitude"]);
        let name = store["name"];
        let address1 = store["addressLines"][0];
        let address2 = store["addressLines"][1];
        let openStatusText = store["openStatusText"];
        let phone = store['phoneNumber'];
        
        // bounds.extend(latlng);
        createMarker(latlng, name, address1, address2, phone, openStatusText, index+1);
    }
    // map.fitBounds(bounds);
}

function createMarker(latlng, name, address1, address2, phone, openStatusText, index){
    let html = `
        <div class="store-information-container"> 
            <div class="store-information"> 
                <span class="store-name"> ${name} </span>
                <span class="store-time"> ${openStatusText} </span>
            </div>
            <div class="contact-information">
                <div class="store-contact">
                    <div class="logo">  
                    <i class="fas fa-location-arrow"> </i> 
                    </div>
                    <div class="contact">
                        <a href="https://www.google.com/maps/dir/?api=1&origin=Los+Angeles+CA,+USA&destination=${address1}+${address2}&travelmode=walking" target="_blank"> ${address1} </a> 
                    </div>
                </div>
                <div class="store-contact">
                    <div class="logo"> 
                        <i class="fas fa-phone-alt"></i>
                    </div>
                    <div class="contact">
                        ${phone} 
                    </div>
                </div>
            </div>
        </div>
    `;

    const image = {
        url: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue.png',
        scaledSize: new google.maps.Size(50, 50),
        origin: new google.maps.Point(-1,-10), 
        anchor: new google.maps.Point(0,0)
    }
    
    let marker = new google.maps.Marker({
        map: map,
        position: latlng,
        label: index.toString(),
        icon: image
    });

    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
    markers.push(marker);      
}

function OptionButton(){
    const losAngeles = {
        lat: 34.063380,
        lng: -118.358080
    };
    const night = nightMode;
    const button = document.querySelector('.button-check');
    button.addEventListener('change', function(e){
        if(button.checked){
            document.querySelector('.title').style.color = '#7575ff';
            document.querySelector('.stores-list-container').style.border = '3px solid #00f';
            map = new google.maps.Map(document.getElementById('map'), {
                center: losAngeles,
                zoom: 13,
                mapTypeId: 'roadmap',
                styles: night,
                streetViewControl: false,
                zoomControl: false,
                mapTypeControl: false,
                fullscreenControl: false
            });
            searchStores();
        }else {
            document.querySelector('.title').style.color = '#000';
            document.querySelector('.stores-list-container').style.border = '3px solid #000';
            map = new google.maps.Map(document.getElementById('map'), {
                center: losAngeles,
                zoom: 13,
                mapTypeId: 'roadmap',
                streetViewControl: false,
                zoomControl: false,
                mapTypeControl: false,
                fullscreenControl: false
            });
            searchStores();
        }
    });
}


let nightMode = [
    {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
    {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
    {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}]
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}]
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{color: '#263c3f'}]
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{color: '#6b9a76'}]
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{color: '#38414e'}]
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{color: '#212a37'}]
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{color: '#9ca5b3'}]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{color: '#746855'}]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{color: '#1f2835'}]
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{color: '#f3d19c'}]
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{color: '#2f3948'}]
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{color: '#17263c'}]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{color: '#515c6d'}]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{color: '#17263c'}]
    }
]
