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

/*
function toggleButton(data) {
    data.target.toggleClass(btn_acceso);
}

document.querySelector("button").onclick = toggleButton;
*/

//-------TIMER

// Set the date we're counting down to
var TT = 31;
var timerDuration = TT;
var secTimer = timerDuration;
// Update the count down every 1 second

function resetTimer() {
    timerDuration = TT;
    secTimer = timerDuration;
}

function startTimer() {

var x = setInterval(function() {

  secTimer = secTimer - 1;

  // Display the result in the element myTimer
  document.getElementById("myTimer").innerHTML = secTimer;

  // Alla fine
  if (secTimer < 0) {
    clearInterval(x);
    document.getElementById("myTimer").innerHTML = "Expired";
  }
}, 1000);

}
var start = document.getElementById("startButton");
var reset = document.getElementById("resetButton");

start.onclick = startTimer;
reset.onclick = resetTimer;
