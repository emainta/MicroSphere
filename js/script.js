/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement;

var fs = false;

document.getElementById('fs_btn').onclick = fullScreen;

/* View in fullscreen */
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
  fs = !fs;
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
  fs = !fs;
}


function fullScreen() {
  if (!fs) {
     openFullscreen()
   }

  else closeFullscreen();
}

function toggleButton(data) {
    data.target.toggleClass(btn_on);
}

document.querySelector("button").onclick = toggleButton;