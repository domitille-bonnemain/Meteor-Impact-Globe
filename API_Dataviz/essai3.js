// Créer une carte Leaflet centrée sur [0, 0] avec un niveau de zoom initial de 2
const map = L.map('map').setView([0, 0], 2);

// Ajouter une couche de tuiles OpenStreetMap à la carte avec attribution
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Tableaux pour stocker les marqueurs et cercles afin de pouvoir les supprimer plus tard
const markers = [];
const circles = [];

// Fonction asynchrone pour filtrer et afficher les météorites en fonction des critères saisis
async function filterMeteorites() {
    try {
        // Récupérer les valeurs des filtres depuis les éléments HTML
        const nameInput = document.getElementById('nameInput').value.toLowerCase();
        const yearInput = document.getElementById('yearInput').value.toLowerCase();
        const massInput = document.getElementById('massInput').value.toLowerCase();
        const longitudeInput = document.getElementById('longitudeInput').value.toLowerCase();
        const latitudeInput = document.getElementById('latitudeInput').value.toLowerCase();

        // Appeler l'API de la NASA pour obtenir les données des météorites
        const response = await fetch('https://data.nasa.gov/resource/y77d-th95.json');
        const data = await response.json();

        // Supprimer les marqueurs et cercles existants sur la carte
        markers.forEach(marker => marker.removeFrom(map));
        circles.forEach(circle => circle.removeFrom(map));

        console.log("DATA1 : ", data)

        // Parcourir les données des météorites et afficher celles qui correspondent aux filtres
        data.forEach(meteorite => {
            const { name, year, mass, reclong, reclat } = meteorite;

            console.log("DATA2 : ", data)


            if (
                (!nameInput || (name && name.toLowerCase().includes(nameInput))) &&
                (!yearInput || (year && year.toLowerCase().includes(yearInput))) &&
                (!massInput || (mass && mass.toLowerCase().includes(massInput))) &&
                (!longitudeInput || (reclong && reclong.toLowerCase().includes(longitudeInput))) &&
                (!latitudeInput || (reclat && reclat.toLowerCase().includes(latitudeInput)))
            ) {
                // Extraire les coordonnées et créer le contenu du popup
                const [latitude, longitude] = [parseFloat(reclat), parseFloat(reclong)];
                const popupContent =
                    `<b>Nom:</b> ${name}<br>` +
                    `<b>Année:</b> ${year}<br>` +
                    `<b>Masse:</b> ${mass}<br>` +
                    `<b>Longitude:</b> ${longitude}<br>` +
                    `<b>Latitude:</b> ${latitude}<br>`;

                // Créer le marqueur personnalisé avec un symbole et l'ajouter à la carte
                const markerIcon = L.divIcon({
                    className: 'custom-marker',
                    html: '<div class="marker-symbol">●</div>',
                    iconSize: [30, 30],
                });
                const marker = L.marker([latitude, longitude], {
                    icon: markerIcon,
                }).addTo(map);

                // Créer le cercle pour représenter la taille de l'impact et l'ajouter à la carte
                const circle = L.circle([latitude, longitude], {
                    radius: Math.sqrt(parseFloat(mass)) * 1000,
                    color: getColorForMass(mass),
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
        // Gérer les erreurs d'appel API en affichant un message dans la console
        console.error('Erreur lors de l\'appel de l\'API :', error);
    }
}

// Appel initial pour afficher toutes les météorites au chargement de la page
filterMeteorites();

// Fonction pour obtenir la couleur en fonction de la masse
function getColorForMass(mass) {
    // Logique pour attribuer une couleur en fonction de la masse
    // Ici, on utilise une échelle de couleurs du rouge clair au rouge foncé
    const scaledMass = parseFloat(mass);
    const minMass = 1; // Masse minimale
    const maxMass = 1000; // Masse maximale
    const normalizedMass = (scaledMass - minMass) / (maxMass - minMass);
    const red = Math.round(255 - normalizedMass * 255);
    return `rgb(${red}, 0, 0)`;
}
