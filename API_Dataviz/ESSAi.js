const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

const nameInput = document.getElementById('nameInput').value.toLowerCase();
const yearInput = document.getElementById('yearInput').value.toLowerCase();
const massInput = document.getElementById('massInput').value.toLowerCase();
const longitudeInput = document.getElementById('longitudeInput').value.toLowerCase();
const latitudeInput = document.getElementById('latitudeInput').value.toLowerCase();
// const countryInput = document.getElementById('countryInput').value.toLowerCase();

const markers = [];
const circles = [];


function createObj(data) {
    let obj = {
        coordinates: [data.reclat, data.reclong],
        name: data.name,
        type: data.recclass,
        year: data.year,
        mass: parseInt(data.mass),
    }
    return obj;
}


// const générale avec toutes les data de l'API modifié en JSON, puis en Obj, puis trié pour enlever les NaN
const mapPoints = [];
const mapPointsClear = []

const fetch1 = async () => {

    // markers.forEach(marker => marker.removeFrom(map));
    // circles.forEach(circle => circle.removeFrom(map));


    const request = await fetch("https://data.nasa.gov/resource/gh4g-9sfh.json");
    const data = await request.json();

    // Create new objects and add each one to the mapPoints array
    data.forEach((item) => mapPoints.push(createObj(item)));


    // Supprime toutes les data ne répondant pas au format de coordoné désiré. 
    for (let i = 0; i < mapPoints.length; i++) {
        if (!isNaN(parseFloat(mapPoints[i].coordinates[0])) || !isNaN(parseFloat(mapPoints[i].coordinates[1]))) {
            mapPointsClear.push(mapPoints[i])
        }
    }
    // CONTROLE : 
    // console.log("coordonée du 686ème point :2", mapPointsClear[686].coordinates[0] + " " + mapPointsClear[686].name)
    // console.log("coordonée du 687ème point :2", mapPointsClear[687].coordinates[0] + " " + mapPointsClear[687].name + " " + parseFloat(mapPointsClear[687].coordinates[0]))
    // console.log("coordonée du 688ème point :2", mapPointsClear[688].coordinates[0] + " " + mapPointsClear[688].name)


    mapPointsClear.forEach(meteorite => {

        let coo = meteorite.coordinates;
        let lat = parseFloat(coo[0])
        let lng = parseFloat(coo[1])
        const [latitude, longitude] = [parseFloat(coo[0]), parseFloat(coo[1])];

        let dateComet = new Date(meteorite.year)
        let yearComet = dateComet.getFullYear()

        const popupContent =
            `<b>Nom:</b> ${meteorite.name}<br>` +
            `<b>Année:</b> ${yearComet}<br>` +
            `<b>Masse:</b> ${meteorite.mass}<br>` +
            `<b>Latitude:</b> ${lat}<br>` +
            `<b>Longitude:</b> ${lng}<br>`;

        // Créer le marqueur personnalisé
        const markerIcon = L.divIcon({
            className: 'custom-marker',
            html: '<div class="marker-symbol">●</div>',
            iconSize: [40, 40],
        })

        // Dessiner le markeur sur la carte
        const circle = L.circle([latitude, longitude], {
            icon: markerIcon,
            color: '#e74c3c',  // Couleur du cercle
            fillOpacity: 0.2,
        }).addTo(map);

        circle.bindPopup(popupContent, { className: 'custom-popup' });

        circles.push(circle);

    });
}

//lancer la fonction pour affichage de toutes les météorites. 
fetch1();



const filterMeteorite = () => {

    mapPointsClear.forEach(meteorite => {

        let coo = meteorite.coordinates;
        let lat = parseFloat(coo[0])
        let lng = parseFloat(coo[1])
        const [latitude, longitude] = [parseFloat(coo[0]), parseFloat(coo[1])];

        if (
            (!nameInput || (meteorite.name && meteorite.name.toLowerCase().includes(nameInput))) &&
            (!yearInput || (meteorite.year && meteorite.year.toLowerCase().includes(yearInput))) &&
            (!massInput || (meteorite.mass && meteorite.mass.toLowerCase().includes(massInput))) &&
            (!longitudeInput || (lng && lng.toLowerCase().includes(longitudeInput))) &&
            (!latitudeInput || (lat && lat.toLowerCase().includes(latitudeInput)))

        ) {

            // Supprimer les marqueurs et cercles existants
            markers.forEach(marker => marker.removeFrom(map));
            circles.forEach(circle => circle.removeFrom(map));

            let dateComet = new Date(meteorite.year)
            let yearComet = dateComet.getFullYear()

            const popupContent =
                `<b>Nom:</b> ${meteorite.name}<br>` +
                `<b>Année:</b> ${yearComet}<br>` +
                `<b>Masse:</b> ${meteorite.mass}<br>` +
                `<b>Latitude:</b> ${lat}<br>` +
                `<b>Longitude:</b> ${lng}<br>`;

            // Créer le marqueur personnalisé
            const markerIcon = L.divIcon({
                className: 'custom-marker',
                html: '<div class="marker-symbol">●</div>',
                iconSize: [30, 30],
            });

            const marker = L.marker([latitude, longitude], {
                icon: markerIcon,
            }).addTo(map);

            // Créer le cercle pour représenter la masse.
            // const circle = L.circle([latitude, longitude], {
            //     // radius: Math.sqrt(parseFloat(mass)) * 1000,  // Ajuster la taille du cercle en fonction de la masse
            //     color: '#e74c3c',  // Couleur du cercle
            //     fillOpacity: 0.2,
            // }).addTo(map);

            // Ajouter le popup au marqueur
            marker.bindPopup(popupContent, { className: 'custom-popup' });

            // Stocker les marqueurs et cercles pour pouvoir les supprimer plus tard
            markers.push(marker);
            // circles.push(circle);


            // // Créer le marqueur personnalisé
            // const markerIcon = L.divIcon({
            //     className: 'custom-marker',
            //     html: '<div class="marker-symbol">●</div>',
            //     iconSize: [40, 40],
            // })

            // // Dessiner le markeur sur la carte
            // const circle = L.circle([latitude, longitude], {
            //     icon: markerIcon,
            //     color: '#e74c3c',  // Couleur du cercle
            //     fillOpacity: 0.2,
            // }).addTo(map);

            // circle.bindPopup(popupContent, { className: 'custom-popup' });

            // circles.push(circle);



        }
    })
}

