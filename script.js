const songList = [
    {
        name: "[1 hour] Lofi hip hop",
        artist: "Lofi",
        src: "assets/1.mp3",
        cover: "assets/1.jpg"
    },
    {
        name: "[1 hour] Kimi no Nawa piano",
        artist: "Anime Chill",
        src: "assets/2.mp3",
        cover: "assets/2.jpg"
    },
    {
        name: " [1 hour] Synthwave Retro",
        artist: "Synthwave",
        src: "assets/3.mp3",
        cover: "assets/3.jpg"
    },
    {
        name: " [1 hour] Gustixa 2021 Playlist",
        artist: "Gustixa",
        src: "assets/4.mp3",
        cover: "assets/4.jpg"
    },
];

const artistName = document.querySelector('.artist-name');
const musicName = document.querySelector('.song-name');
const fillBar = document.querySelector('.fill-bar');
const time = document.querySelector('.time');
const cover = document.getElementById('cover');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const prog = document.querySelector('.progress-bar');

let song = new Audio();
let currentSong = 0;
let playing = false;

document.addEventListener('DOMContentLoaded', () =>{
    loadSong(currentSong);
    song.addEventListener('timeupdate', updateProgress);
    song.addEventListener('ended', nextSong);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    playBtn.addEventListener('click', togglePlayPause);
    prog.addEventListener('click', seek);

    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(`${currentTheme}-mode`);
    themeToggle.innerText = currentTheme === 'dark' ? '🌙' : '☀️';

    themeToggle.addEventListener('click', () => {
        const isDarkMode = document.body.classList.contains('dark-mode');
        if (isDarkMode) {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
            themeToggle.innerText = '☀️';
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            themeToggle.innerText = '🌙';
            localStorage.setItem('theme', 'dark');
        }
    });
});

function loadSong(index){
    const { name, artist, src, cover: thumb } = songList [index];
    artistName.innerText = artist;
    musicName.innerText = name;
    song.src = src;
    cover.style.backgroundImage = `url(${thumb})`;
    // // Extract dominant color and change body background color
    // const img = new Image();
    // img.src = thumb;
    // img.crossOrigin = "Anonymous"; // Important for cross-origin images

    // img.onload = function () {
    //     const color = getDominantColor(img);
    //     const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    //     document.body.style.backgroundColor = rgbColor;
    // };
}

function getDominantColor(image) {
    // Create a canvas element
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas width and height to image dimensions
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw the image on canvas
    ctx.drawImage(image, 0, 0, image.width, image.height);

    // Get pixel data from the image
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let r = 0, g = 0, b = 0, totalPixels = data.length / 4;

    // Loop through each pixel to sum up the RGB values
    for (let i = 0; i < data.length; i += 4) {
        r += data[i];     // Red
        g += data[i + 1]; // Green
        b += data[i + 2]; // Blue
    }

    // Get average color
    r = Math.floor(r / totalPixels);
    g = Math.floor(g / totalPixels);
    b = Math.floor(b / totalPixels);

    return [r, g, b];
}

function updateProgress(){
    if(song.duration){
        const pos = (song.currentTime / song.duration) * 100;
        fillBar.style.width = `${pos}%`;
        const duration = formatTime(song.duration);
        const currentTime = formatTime(song.currentTime);
        time.innerText = `${currentTime} - ${duration}`;
    }
}


function formatTime(seconds){
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function togglePlayPause(){
    if(playing){
        song.pause();
    }else{
        song.play();
    }
    playing = !playing;
    playBtn.classList.toggle('fa-pause', playing);
    playBtn.classList.toggle('fa-play', !playing);
    cover.classList.toggle('active', playing);
}

function nextSong() {
    currentSong = (currentSong + 1) % songList.length;
    playMusic();
}

function prevSong() {
    currentSong = (currentSong - 1 + songList.length) % songList.length;
    playMusic();
}

function playMusic(){
    loadSong(currentSong);
    song.play();
    playing = true;
    playBtn.classList.add('fa-pause');
    playBtn.classList.remove('fa-play');
    cover.classList.add('active');
}

function seek(e){
    const pos = (e.offsetX / prog.clientWidth) * song.duration;
    song.currentTime = pos;
}