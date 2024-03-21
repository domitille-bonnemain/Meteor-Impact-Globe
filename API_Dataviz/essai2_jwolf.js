const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);


const markers = [];
const circles = [];

async function filterMeteorites() {
    try {
        const nameInput = document.getElementById('nameInput').value.toLowerCase();
        const yearInput = document.getElementById('yearInput').value.toLowerCase();
        const massInput = document.getElementById('massInput').value.toLowerCase();
        const longitudeInput = document.getElementById('longitudeInput').value.toLowerCase();
        const latitudeInput = document.getElementById('latitudeInput').value.toLowerCase();
        const countryInput = document.getElementById('countryInput').value.toLowerCase();


        const response1 = await fetch('https://data.nasa.gov/resource/y77d-th95.json');
        const dataLeaflet = await response1.json();

        console.log("dataLeaflet :", dataLeaflet);

        const response2 = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${countryInput}&key=66a73429848e4481a17f6ce607232fef`);
        const dataGeo = await response2.json();

        // Supprimer les marqueurs et cercles existants
        markers.forEach(marker => marker.removeFrom(map));
        circles.forEach(circle => circle.removeFrom(map));


        //Traitement geoBounds
        let geoBounds = dataGeo.results[0].bounds;
        console.log("geoBounds", geoBounds);
        let NE_X = geoBounds.northeast.lat;
        let NE_Y = geoBounds.northeast.lng;
        let SW_X = geoBounds.southwest.lat;
        let SW_Y = geoBounds.southwest.lng;

        console.log(NE_X)
        console.log(NE_Y)
        console.log(SW_X)
        console.log(SW_Y)


        dataLeaflet.forEach(meteorite => {
            const { name, year, mass, reclong, reclat } = meteorite;
            
            if (
                (!nameInput || (name && name.toLowerCase().includes(nameInput))) &&
                (!yearInput || (year && year.toLowerCase().includes(yearInput))) &&
                (!massInput || (mass && mass.toLowerCase().includes(massInput))) &&
                (!longitudeInput || (reclong && reclong.toLowerCase().includes(longitudeInput))) &&
                (!latitudeInput || (reclat && reclat.toLowerCase().includes(latitudeInput)))
                // (!countryInput)

            ) {

                let dateComet = new Date(meteorite.year)
                let yearComet = dateComet.getFullYear()

                const [latitude, longitude] = [parseFloat(reclat), parseFloat(reclong)];
                const popupContent =
                    `<b>Nom:</b> ${name}<br>` +
                    `<b>Année:</b> ${yearComet}<br>` +
                    `<b>Masse:</b> ${mass}<br>` +
                    `<b>Latitude:</b> ${latitude}<br>` +
                    `<b>Longitude:</b> ${longitude}<br>`;


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
                const circle = L.circle([latitude, longitude], {
                    radius: Math.sqrt(parseFloat(mass)) * 1000,  // Ajuster la taille du cercle en fonction de la masse
                    color: '#e74c3c',  // Couleur du cercle
                    fillOpacity: 0.2,
                }).addTo(map);

                // Ajouter le popup au marqueur
                marker.bindPopup(popupContent, { className: 'custom-popup' });

                // Stocker les marqueurs et cercles pour pouvoir les supprimer plus tard
                markers.push(marker);
                circles.push(circle);

                console.log("latitude : ", latitude)
                console.log("longitude :", longitude)

                if (NE_X > latitude &&
                    NE_Y > longitude &&
                    SW_X < latitude &&
                    SW_Y < latitude) {
                    markers.forEach(marker => marker.removeFrom(map));
                    circles.forEach(circle => circle.removeFrom(map));

                    const marker = L.marker([latitude, longitude], {
                        icon: markerIcon,
                    }).addTo(map);

                    console.log(`${meteorite} is in ${countryInput}`)
                } else { }

            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'appel de l\'API :', error);
    }
}


// async function geoLoc () {
//     try {

//      
//             }


//     } catch (error) {
//         console.error('Erreur lors de l\'appel de l\'API :', error);    } 
// }





// Appel initial pour afficher toutes les météorites au chargement de la page
filterMeteorites();
