AFRAME.registerComponent('loadscene', {
  init: function () {
    // load all hotspots and popups so they are under the exit/magic carpet,
    // so they can't be accidentally clicked on before the user loads
    // the scene
    function browserReposition() {
      // hotspots
      var alprHot = document.querySelector('#alpr-hotspot');
      var alprMobileHot = document.querySelector('#alpr-mobile-hotspot');
      var biometricHot = document.querySelector('#biometric-hotspot');
      var bodycamHot = document.querySelector('#bodycam-hotspot');
      var camera1Hot = document.querySelector('#camera1-hotspot');
      var camera2Hot = document.querySelector('#camera2-hotspot');
      var droneHot = document.querySelector('#drone-hotspot');
      var birdHot = document.querySelector('#bird-hotspot');
      var lightHot = document.querySelector('#light-hotspot');
      var attribHot = document.querySelector('#attribution-hotspot');
      var exitHot = document.querySelector('#exit-sts');

      // popups
      var alprPop = document.querySelector('#alpr-popup');
      var alprMobilePop = document.querySelector('#alpr-mobile-popup');
      var biometricPop = document.querySelector('#biometric-popup');
      var bodycamPop = document.querySelector('#bodycam-popup');
      var camera1Pop = document.querySelector('#camera1-popup');
      var camera2Pop = document.querySelector('#camera2-popup');
      var dronePop = document.querySelector('#drone-popup');
      var birdPop = document.querySelector('#bird-popup');
      var lightPop = document.querySelector('#light-popup');
      // move hotspots to their correct positions
      //
      // these hotspots need to be positioned differently
      // for desktop/mobile, or they appear incorrectly positioned
      // for desktop/mobile
      if ( !AFRAME.utils.device.checkHeadsetConnected() ){
        alprHot.setAttribute('position', { x: 10.379, y: 26.918, z: -7.485 });
        alprMobileHot.setAttribute('position', { x: 3.622, y: 2.229, z: 12.881 });
        bodycamHot.setAttribute('position', { x: -9.716, y: -1.166, z: -16.629 });
        camera1Hot.setAttribute('position', { x: 23.244, y: 58.391, z: -35.322 });
        camera2Hot.setAttribute('position', { x: 67.041, y: 27.413, z: 18.717 });
        droneHot.setAttribute('position', { x: -3.999, y: 30.295, z: 28.948 });
        // hotspots positions for headsets/cardboard
      } else {
        alprHot.setAttribute('position', { x: 10.379, y: 26.918, z: -11.27 });
        alprMobileHot.setAttribute('position', { x: 3.622, y: 1.58, z: 8.019 });
        bodycamHot.setAttribute('position', { x: -8.563, y: -1.176, z: -18.202 });
        camera1Hot.setAttribute('position', { x: 23.244, y: 58.391, z: -39.778 });
        camera2Hot.setAttribute('position', { x: 68.682, y: 26.636, z: 15.660 });
        droneHot.setAttribute('position', { x: -3.999, y: 33.763, z: 28.948 });
      }
      // these hotspots have the same position regardless of device
      biometricHot.setAttribute('position', { x: -14.982, y: -9.975, z: -25.215 });
      birdHot.setAttribute('position', { x: 9.039, y: 40, z: 17.084 });
      lightHot.setAttribute('position', { x: -19.031, y: 9.249, z: -8.468 });
      attribHot.setAttribute('position', { x: 1.821, y: -12.750, z: -4.727 });
      exitHot.setAttribute('position', { x: 8.0, y: -40.524, z: 2.747 });

      // move popups to their correct positions from beneath the "magic carpet (exit)"
      alprPop.setAttribute('position', { x: 6.098, y: 3.491, z: -1.681 });
      alprMobilePop.setAttribute('position', { x: 4.076, y: 5.453, z: 6.580 });
      biometricPop.setAttribute('position', { x: -8.806, y: 0.992, z: -0.1 });
      bodycamPop.setAttribute('position', { x: -7.275, y: 0.992, z: -4.693 });
      camera1Pop.setAttribute('position', { x: 3.300, y: 2.988, z: -8.154 });
      camera2Pop.setAttribute('position', { x: 7.087, y: 1.287, z: 3.056 });
      dronePop.setAttribute('position', { x: -4.668, y: 3.694, z: 10.072 });
      birdPop.setAttribute('position', { x: 0.5, y: 6.8, z: 10 });
      lightPop.setAttribute('position', { x: -3.026, y: 4.122, z: -0.366 });
    }

    var containerEl = document.getElementById('sts-live');
    var sceneEl = document.querySelector('a-scene');
    var introAudioEl = document.getElementById('intro-audio');
    var ambienceAudio = document.getElementById('ambience');
    var getReady = document.getElementById('get-ready');
    var getStartedButton = document.getElementById('get-started');
    var easyButton = document.getElementById('easy-button');

    var enterVREl;
    var audioStarted = false;
    var userPressEvent = 'ontouchstart' in window ? 'touchend' : 'mousedown';

    function playAudio() {
      if (audioStarted) {
        return;
      }

      var playIntro = introAudioEl.play();
      var playAmbience = ambienceAudio.play();

      Promise.all([playIntro, playAmbience])
      .then(function () {
        audioStarted = true;
      })
      .catch(function (error) {
        console.error('Audio not playing', error);
      });
    }

    function onUserPressDown() {
      playAudio();

      if (enterVREl) {
        enterVREl.removeEventListener(userPressEvent, onUserPressDown);
      }
      sceneEl.removeEventListener(userPressEvent, onUserPressDown);
    }

    function onSceneLoaded() {
      enterVREl = sceneEl.components['vr-mode-ui'].enterVREl;
      getReady.style.display = 'none';
      introAudioEl.load();
      ambienceAudio.volume = ambienceAudio.getAttribute('volume');
      ambienceAudio.load();
      playAudio();
      // start audio after gesture on enter VR button.
      enterVREl.addEventListener(userPressEvent, onUserPressDown);
      sceneEl.removeEventListener('loaded', onSceneLoaded);
    }

    function onStartClick() {
      introAudioEl.pause();
      // container is only visible once get-started button is clicked.
      containerEl.setAttribute('visible', true);
      // remove button from targettable raycaster objects.
      getStartedButton.removeAttribute('data-clickable');
      getStartedButton.removeEventListener('click', onStartClick);
      browserReposition();
      easyButton.removeAttribute('data-clickable');
    }

    // start audio after user gesture on scene.
    sceneEl.addEventListener(userPressEvent, onUserPressDown);
    sceneEl.addEventListener('loaded', onSceneLoaded);
    getStartedButton.addEventListener('click', onStartClick);

    // NOTE: This works around an A-Frame bug (in 0.8.2/0.9.0) that incorrectly identifies Firefox Reality as a mobile
    // browser (since its `User-Agent` string contains 'Android' and 'Mobile VR'). Issue
    // https://github.com/aframevr/aframe/issues/4032 has since been fixed in `master`. Once a new A-Frame version is
    // released, this can be replaced with `AFRAME.utils.device.isMobile()`.
    var isMobileWithoutVR = (function () {
      // Detect browsers in standalone VR headsets.
      if (/(OculusBrowser)|(SamsungBrowser)|(Mobile VR)/i.test(navigator.userAgent)) {
        return false;
      }
      return AFRAME.utils.device.isMobile();
    })();

    if (isMobileWithoutVR) {
      containerEl.setAttribute('visible', true);
    }
  }
});
