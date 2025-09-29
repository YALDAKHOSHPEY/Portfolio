(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }

  document.addEventListener('DOMContentLoaded', function () {
    const scene = $('scene');
    const room = $('room');
    const aboutDoor = $('aboutDoor');
    const doorPassage = $('doorPassage');
    const mysteriousLight = $('mysteriousLight');
    const fogEffect = $('fogEffect');
    const transitionScreen = $('transitionScreen');
    const zoomInBtn = $('zoomIn');
    const zoomOutBtn = $('zoomOut');
    const resetViewBtn = $('resetView');
    const certificateModal = $('certificateModal');
    const modalImage = $('modalImage');
    const closeModal = $('closeModal');
    const modalContent = $('modalContent');
    const imageUpload = $('imageUpload');
    const doorSound = $('doorSound');

    let isTransitioning = false;
    let currentZoom = 0;
    const maxZoom = 2000;
    const minZoom = 0;
    let selectedImage = null;
    const isMobile = window.matchMedia('(max-width: 500px)').matches;

    function safePlayAudio(audioEl) {
      if (!audioEl) return;
      try {
        const p = audioEl.play();
        if (p && p.catch) p.catch(() => {});
      } catch (e) {}
    }

    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

    function setSceneTranslate(z) {
      if (scene) scene.style.transform = `translateZ(${z}px)`;
    }

    function resetRoomTransform() {
      if (!room) return;
      room.style.transform = isMobile
        ? 'none'
        : 'translate3d(-50%, -50%, -500px) rotateX(5deg)';
    }

    function openCertificateModal(src) {
      if (!certificateModal || !modalContent) return;
      if (modalImage && src) modalImage.src = src;
      certificateModal.style.display = 'flex';
      requestAnimationFrame(() => {
        certificateModal.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
      });
    }

    function closeCertificateModal() {
      if (!certificateModal || !modalContent) return;
      certificateModal.style.opacity = '0';
      modalContent.style.transform = 'scale(0.9)';
      setTimeout(() => {
        certificateModal.style.display = 'none';
      }, 400);
    }

    // === اضافه کردن باز شدن در با کلیک و Enter ===
    function triggerDoor() {
      if (!aboutDoor || isTransitioning) return;
      isTransitioning = true;

      safePlayAudio(doorSound);
      aboutDoor.classList.add('open');

      if (doorPassage) {
        if (!isMobile) {
          setTimeout(() => doorPassage.classList.add('open'), 450);
        } else {
          doorPassage.classList.add('open');
        }
      }

      if (mysteriousLight) mysteriousLight.style.opacity = '1';
      if (fogEffect) fogEffect.style.opacity = '1';

      if (!isMobile) {
        setTimeout(() => {
          setSceneTranslate(800);
          if (room) room.style.transform = 'translate3d(-50%, -50%, -500px) rotateX(0deg)';
        }, 700);
      }

      setTimeout(() => {
        if (room) room.style.opacity = '0.3';
        if (transitionScreen) transitionScreen.style.opacity = '1';
      }, isMobile ? 400 : 1100);

      setTimeout(() => {
        try { window.location.href = 'about.html'; }
        catch (err) { isTransitioning = false; }
      }, isMobile ? 900 : 1800);

      setTimeout(() => { isTransitioning = false; }, 3000);
    }

    if (aboutDoor) {
      aboutDoor.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        triggerDoor();
      }, { passive: false });
    }

    // اضافه کردن کلید Enter برای باز کردن در
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        triggerDoor();
      }
    });

    // === بقیه کد شما بدون تغییر ===
    const certificateFrames = document.querySelectorAll('.certificate-frame');
    if (certificateFrames && certificateFrames.length) {
      certificateFrames.forEach(frame => {
        frame.addEventListener('click', function () {
          const img = this.querySelector('.certificate-image');
          if (selectedImage && img) {
            img.src = selectedImage;
          }
          if (img && modalImage && certificateModal) {
            openCertificateModal(img.src);
          }
        });
      });
    }

    if (closeModal) {
      closeModal.addEventListener('click', function () {
        closeCertificateModal();
      });
    }

    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', function () {
        currentZoom = clamp(currentZoom + 200, minZoom, maxZoom);
        setSceneTranslate(currentZoom);
      }, { passive: true });
    }

    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', function () {
        currentZoom = clamp(currentZoom - 200, minZoom, maxZoom);
        setSceneTranslate(currentZoom);
      }, { passive: true });
    }

    if (resetViewBtn) {
      resetViewBtn.addEventListener('click', function () {
        currentZoom = 0;
        setSceneTranslate(0);
        resetRoomTransform();
        if (transitionScreen) transitionScreen.style.opacity = '0';
        if (room) room.style.opacity = '';
      }, { passive: true });
    }

    if (imageUpload) {
      imageUpload.addEventListener('change', function (e) {
        const file = (e.target && e.target.files) ? e.target.files[0] : null;
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (ev) {
          selectedImage = ev.target.result;
          try { alert('Image selected! Now click on any certificate frame to apply the image.'); }
          catch (e) {}
        };
        reader.readAsDataURL(file);
      });
    }

    document.addEventListener('keydown', function (e) {
      const key = e.key;
      if ((key === 'Escape' || key === 'Esc') && certificateModal && certificateModal.style.display === 'flex') {
        closeCertificateModal();
      } else if ((key === '+' || key === '=') && zoomInBtn) {
        zoomInBtn.click();
      } else if ((key === '-' || key === '_') && zoomOutBtn) {
        zoomOutBtn.click();
      } else if (key === '0' && resetViewBtn) {
        resetViewBtn.click();
      }
    });

    if (!isMobile) {
      let lastFrame = 0;
      function onMouseMove(e) {
        if (isTransitioning) return;
        const now = performance.now();
        if (now - lastFrame < 16) return;
        lastFrame = now;
        const xAxis = (window.innerWidth / 2 - e.clientX) / 50;
        const yAxis = (window.innerHeight / 2 - e.clientY) / 50;
        if (room) {
          room.style.transform = `translate3d(-50%, -50%, -500px) rotateX(${5 + yAxis}deg) rotateY(${xAxis}deg)`;
        }
      }
      document.addEventListener('mousemove', onMouseMove, { passive: true });
    }

    if (certificateModal) {
      certificateModal.addEventListener('click', function (ev) {
        if (ev.target === certificateModal) closeCertificateModal();
      });
    }

    resetRoomTransform();
    setSceneTranslate(0);

    window.addEventListener('resize', function () {
      const mobileNow = window.matchMedia('(max-width: 500px)').matches;
      if (mobileNow !== isMobile) {
        resetRoomTransform();
        setSceneTranslate(0);
      }
    });
  });
})();
