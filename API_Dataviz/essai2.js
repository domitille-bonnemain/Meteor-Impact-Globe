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

        const response = await fetch('https://data.nasa.gov/resource/y77d-th95.json');
        const data = await response.json();

        console.log(data)

        // Supprimer les marqueurs et cercles existants
        markers.forEach(marker => marker.removeFrom(map));
        circles.forEach(circle => circle.removeFrom(map));

        data.forEach(meteorite => {
            const { name, year, mass, reclong, reclat } = meteorite;
 
            let dateComet = new Date(data[1].year)
            let yearComet = dateComet.getFullYear()

            if (
                (!nameInput || (name && name.toLowerCase().includes(nameInput))) &&
                (!yearInput || (year && year.toLowerCase().includes(yearInput))) &&
                (!massInput || (mass && mass.toLowerCase().includes(massInput))) &&
                (!longitudeInput || (reclong && reclong.toLowerCase().includes(longitudeInput))) &&
                (!latitudeInput || (reclat && reclat.toLowerCase().includes(latitudeInput)))
            ) {
                const [latitude, longitude] = [parseFloat(reclat), parseFloat(reclong)];
                const popupContent =
                    `<b>Nom:</b> ${name}<br>` +
                    `<b>Année:</b> ${yearComet}<br>` +
                    `<b>Masse:</b> ${mass}<br>` +
                    `<b>Longitude:</b> ${longitude}<br>` +
                    `<b>Latitude:</b> ${latitude}<br>`;

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
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'appel de l\'API :', error);
    }
}

// Appel initial pour afficher toutes les météorites au chargement de la page
filterMeteorites();
