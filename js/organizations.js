import {ttkey} from './common.js';
import { getAllOrganizations } from "./class/organization.js";
var markersOnTheMap = {};
var eventListenersAdded = false;
const options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0,
    showAccuracyCircle:false
  };

function getCurrentLocation() {
return new Promise((resolve, reject) => {
    function success(pos) {
    const crd = pos.coords;
    
    resolve({ lat: crd.latitude, lng: crd.longitude });
    }

    function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    reject(err);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
});
}

const geolocateControl = new tt.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: false,
    },
  });

getCurrentLocation().then((result) => {
   map.flyTo({center: result, zoom: 12});
   
}).catch(err => {
    console.log(err);
});

var map = tt.map({
    key: ttkey,
    container: 'exploremap',
    center:  [-123.1353996, 49.3930454],
    zoom: 10,
    dragPan: !isMobileOrTablet(),
    style: `https://api.tomtom.com/style/2/custom/style/dG9tdG9tQEBAZ2R4MTZLWHhubUxCQUV1Nzs4OGY2ZDFjNC03YjVmLTQyYTctYTViYS1mYWY1NDVmODNmMzE=.json?key=${ttkey}`
});
map.addControl(new tt.FullscreenControl());
map.addControl(new tt.NavigationControl());
map.addControl(geolocateControl);


var points = [];

function loadData(map){

    points = [];
    let maplist = document.getElementById('maplist');
    
    // getAllReports()
    getAllOrganizations().then((arr) => {
        arr.forEach(doc=>{
            let data = doc.data();
            let card = document.createElement("article");
            card.setAttribute("class", "report-card");
           

            points.push({
                coordinates: [data.location.lng, data.location.lat],
                properties: {
                    id: doc.id,
                    name: doc.id
                }
            })

            card.innerHTML = `<h6><b>${data.name}</b></h6><br>
            Address: ${data.address}<br>
            UID: ${data.uid}<br>`
            maplist.append(card);
            //create a promise
            geoJson = {
                type: 'FeatureCollection',
                features: points.map(function(point) {
                    return {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: point.coordinates
                        },
                        properties: point.properties
                    };
                })
            };
            map.getSource('point-source').setData(geoJson);
        })
        //     //createMarker('accident.colors-white.svg', [data.location.lng, data.location.lat], '#5327c3', 'SVG icon');
        // });
        
    });
}


var geoJson = {
    type: 'FeatureCollection',
    features: points.map(function(point) {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: point.coordinates
            },
            properties: point.properties
        };
    })
};

function refreshMarkers() {
    Object.keys(markersOnTheMap).forEach(function(id) {
        markersOnTheMap[id].remove();
        delete markersOnTheMap[id];
    });

    map.querySourceFeatures('point-source').forEach(function(feature) {
        if (feature.properties && !feature.properties.cluster) {
            var id = parseInt(feature.properties.id, 10);
            if (!markersOnTheMap[id]) {
                var newMarker = new tt.Marker().setLngLat(feature.geometry.coordinates);
                newMarker.addTo(map);
                newMarker.setPopup(new tt.Popup({offset: 30}).setText(feature.properties.name));
                markersOnTheMap[id] = newMarker;
            }
        }
    });
}

map.on('load', function() {
    map.addSource('point-source', {
        type: 'geojson',
        data: geoJson,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
    });

    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'point-source',
        filter: ['has', 'point_count'],
        paint: {
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#EC619F',
                4,
                '#008D8D',
                7,
                '#004B7F'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                15,
                4,
                20,
                7,
                25
            ],
            'circle-stroke-width': 1,
            'circle-stroke-color': 'white',
            'circle-stroke-opacity': 1
        }
    });

    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'point-source',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-size': 16
        },
        paint: {
            'text-color': 'white'
        }
    });

    map.on('data', function(e) {
        if (e.sourceId !== 'point-source' || !map.getSource('point-source').loaded()) {
            return;
        }

        refreshMarkers(map);

        if (!eventListenersAdded) {
            map.on('move', refreshMarkers);
            map.on('moveend', refreshMarkers);
            eventListenersAdded = true;
        }
    });

    map.on('click', 'clusters', function(e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        var clusterId = features[0].properties.cluster_id;
        map.getSource('point-source').getClusterExpansionZoom(clusterId, function(err, zoom) {
            if (err) {
                return;
            }

            map.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom + 0.5
            });
        });
    });

    map.on('mouseenter', 'clusters', function() {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'clusters', function() {
        map.getCanvas().style.cursor = '';
    }); 

    loadData(map); //make a timer
});
