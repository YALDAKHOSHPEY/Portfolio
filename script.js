document.addEventListener('DOMContentLoaded', function() {
  const scene = document.getElementById('scene');
  const room = document.getElementById('room');
  const aboutDoor = document.getElementById('aboutDoor');
  const doorPassage = document.getElementById('doorPassage');
  const mysteriousLight = document.getElementById('mysteriousLight');
  const fogEffect = document.getElementById('fogEffect');
  const transitionScreen = document.getElementById('transitionScreen');
  const zoomInBtn = document.getElementById('zoomIn');
  const zoomOutBtn = document.getElementById('zoomOut');
  const resetViewBtn = document.getElementById('resetView');
  const certificateModal = document.getElementById('certificateModal');
  const modalImage = document.getElementById('modalImage');
  const closeModal = document.getElementById('closeModal');
  const modalContent = document.getElementById('modalContent');
  const imageUpload = document.getElementById('imageUpload');
  const doorSound = document.getElementById('doorSound');
  
  let isTransitioning = false;
  let currentZoom = 0;
  let maxZoom = 2000;
  let minZoom = 0;
  let selectedImage = null;

  // Door interaction
  aboutDoor.addEventListener('click', function() {
      if (isTransitioning) return;
      isTransitioning = true;

      // Play door opening sound
      doorSound.play();

      // Open the door with 3D rotation
      aboutDoor.classList.add('open');

      // Show the passage behind the door
      setTimeout(() => {
          doorPassage.classList.add('open');
      }, 800);

      // Show ambient effects
      mysteriousLight.style.opacity = '1';
      fogEffect.style.opacity = '1';

      // Zoom in toward the door
      setTimeout(() => {
          scene.style.transform = 'translateZ(800px)';
          room.style.transform = 'translate3d(-50%, -50%, -500px) rotateX(0deg)';
      }, 1000);

      // Fade out room and show transition screen
      setTimeout(() => {
          room.style.opacity = '0.3';
          transitionScreen.style.opacity = '1';
      }, 1800);

      // Redirect to about.html
      setTimeout(() => {
          window.location.href = 'about.html';
      }, 2800);
  });

  // Certificate frame click event
  const certificateFrames = document.querySelectorAll('.certificate-frame');
  certificateFrames.forEach(frame => {
      frame.addEventListener('click', function() {
          if (selectedImage) {
              const img = this.querySelector('.certificate-image');
              img.src = selectedImage;
          }
          
          const img = this.querySelector('.certificate-image');
          modalImage.src = img.src;
          certificateModal.style.display = 'flex';
          setTimeout(() => {
              certificateModal.style.opacity = '1';
              modalContent.style.transform = 'scale(1)';
          }, 10);
      });
  });

  // Close modal
  closeModal.addEventListener('click', function() {
      certificateModal.style.opacity = '0';
      modalContent.style.transform = 'scale(0.9)';
      setTimeout(() => {
          certificateModal.style.display = 'none';
      }, 500);
  });

  // Zoom controls
  zoomInBtn.addEventListener('click', function() {
      if (currentZoom < maxZoom) {
          currentZoom += 200;
          scene.style.transform = `translateZ(${currentZoom}px)`;
      }
  });

  zoomOutBtn.addEventListener('click', function() {
      if (currentZoom > minZoom) {
          currentZoom -= 200;
          scene.style.transform = `translateZ(${currentZoom}px)`;
      }
  });

  resetViewBtn.addEventListener('click', function() {
      currentZoom = 0;
      scene.style.transform = 'translateZ(0px)';
      room.style.transform = 'translate3d(-50%, -50%, -500px) rotateX(5deg)';
  });

  // Image upload handling
  imageUpload.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function(event) {
              selectedImage = event.target.result;
              alert('Image selected! Now click on any certificate frame to apply the image.');
          };
          reader.readAsDataURL(file);
      }
  });

  // Keyboard controls
  document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
          if (certificateModal.style.display === 'flex') {
              closeModal.click();
          }
      }
      
      if (e.key === '+' || e.key === '=') {
          zoomInBtn.click();
      } else if (e.key === '-' || e.key === '_') {
          zoomOutBtn.click();
      } else if (e.key === '0') {
          resetViewBtn.click();
      }
  });

  // Add subtle room movement on mouse move
  document.addEventListener('mousemove', function(e) {
      if (isTransitioning) return;
      
      const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
      
      room.style.transform = `translate3d(-50%, -50%, -500px) rotateX(${5 + yAxis}deg) rotateY(${xAxis}deg)`;
  });
});