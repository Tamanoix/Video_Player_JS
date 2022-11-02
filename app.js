/* console.dir(video) pour avoir tous les attributs et méthodes (dans le Prototype) natifs liés aux vidéos */

const video = document.querySelector('.video');
const playToggler = document.querySelector('.play-toggler');
const togglerImg = document.querySelector('.play-toggler img');

video.addEventListener('click', togglePlay);
playToggler.addEventListener('click', togglePlay);

function togglePlay() {
    
    // Si la vidéo est en pause, on la joue, et inversement
    if (video.paused) {
        togglerImg.src = "ressources/pause.svg";
        video.play();
    }
    else {
        togglerImg.src = "ressources/play.svg";
        video.pause();
    }
}


const timersDisplay = document.querySelectorAll('.time-display');

// On utilise un double eventListener pour éviter qu'un chargement de page s'effectue trop vite par rapport à la vidéo et ne prenne pas en compte nos fonctions
video.addEventListener('loadeddata', fillDurationVariables);
window.addEventListener('load', fillDurationVariables);

let current;
let totalDuration;

function fillDurationVariables() {

    // S'il y a eu un échec lors de la récupération de la vidéo, pas besoin de lancer la suite de la fonction, on sort
    if (Number.isNaN(video.duration)) return;

    current = video.currentTime;
    // Renvoie une durée en secondes
    totalDuration = video.duration;

    formatValue(current, timersDisplay[0]);
    formatValue(totalDuration, timersDisplay[1]);

    // Si la vidéo a bien chargé, on n'a plus besoin de ces eventListeners (ils sont à but unique)
    video.removeEventListener('loadeddata', fillDurationVariables);
    window.removeEventListener('load', fillDurationVariables);
}

function formatValue(value, element) {

    let currentMin = Math.trunc(value / 60);
    // On utilise le modulo de la division par 60 pour les secondes
    let currentSec = Math.trunc(value % 60);

    // Si les secondes sont inférieures à 10, on affiche quand même 2 chiffres (avec un 0 devant)
    if (currentSec < 10) {
        currentSec = `0${currentSec}`;
    }

    // On le rajoute ensuite à notre élément (soit timersDisplay[0], soit timersDisplay[1], les 2 span qui indiquent la durée)
    element.textContent = `${currentMin}:${currentSec}`;
}


const progress = document.querySelector('.progress');

// à chaque actualisation de durée de la vidéo, on modifie l'affichage de là où on en est
video.addEventListener('timeupdate', handleTimeUpdate);

function handleTimeUpdate() {

    current = video.currentTime;

    formatValue(current, timersDisplay[0]);

    // On fait avancer la progressbar en fonction de l'avancement de la vidéo par rapport à la durée totale
    const progressPosition = current / totalDuration;
    progress.style.transform = `scaleX(${progressPosition})`;

    // Si la vidéo est finie, on remet le bouton play pour relancer
    if (video.ended) {
        togglerImg.src = "ressources/play.svg";
    }
}


const muteBtn = document.querySelector('.mute-btn');
const muteIcon = document.querySelector('.mute-btn img');

muteBtn.addEventListener('click', handleMute);

function handleMute() {

    // Si la vidéo est muted, on remet le son, et inversement
    if (video.muted) {
        video.muted = false;
        muteIcon.src = "ressources/unmute.svg";
    }
    else {
        video.muted = true;
        muteIcon.src = "ressources/mute.svg";
    }
}


const volumeSlider = document.querySelector('.volume-slider');

// addEventListener 'input' se lance même sans lâcher la barre, alors que 'change' se lance uniquement quand on lâche (si on maintient la barre de son)
volumeSlider.addEventListener('input', handleVolumeChange);

function handleVolumeChange() {

    video.volume = volumeSlider.value / 100;

    if (video.volume === 0) {
        muteIcon.src = "ressources/mute.svg";
    }
    else {
        muteIcon.src = "ressources/unmute.svg";
    }
}


const progressBar = document.querySelector('.progress-bar');

// Informations sur la position et dimensions de l'élément
let rect = progressBar.getBoundingClientRect();
// La taille totale de notre progressBar
let largeur = rect.width;

window.addEventListener('resize', handleResize);

// Lorsque l'on resize la fenêtre, on actualise la largeur totale
function handleResize() {
    rect = progressBar.getBoundingClientRect();
    largeur = rect.width;
}

progressBar.addEventListener('click', handleProgressNavigation);

function handleProgressNavigation(e) {

    /* 
    clientX = là où se trouve le click par rapport au bord gauche de la fenêtre de l'écran
    rect.left = là où commence mon lecteur vidéo par rapport au bord gauche de la fenêtre de l'écran
    Donc cela nous donne le point où le client a cliqué exactement sur le lecteur 
    */
    const x = e.clientX - rect.left;

    // On récupère le % que cela représente par rapport à la longueur totale
    const widthPercent = x / largeur;

    // Et on actualise le currentTime avec le pourcentage de là où le client a cliqué par rapport à la durée totale de la vidéo
    video.currentTime = video.duration * widthPercent;
}


const fullScreenToggler = document.querySelector('.fullscreen-toggler');
const videoContainer = document.querySelector('.video-container');

video.addEventListener('dblclick', toggleFullScreen);
fullScreenToggler.addEventListener('click', toggleFullScreen);

function toggleFullScreen() {

    // Si la vidéo est en plein écran, on la remet à taille normale, et inversement
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
    else {
        videoContainer.requestFullscreen();
    }
}

