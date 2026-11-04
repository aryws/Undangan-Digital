
document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // KONFIGURASI
  // ==========================================

  const WEDDING_DATE = new Date("2027-06-20T10:00:00+08:00");

  // Ganti dengan nomor WhatsApp penerima RSVP
  const WHATSAPP_NUMBER = "6281234567890";

  // ==========================================
  // ELEMENT WEBSITE
  // ==========================================

  const opening = document.getElementById("opening");
  const openInvitation = document.getElementById("openInvitation");

  const audio =
    document.getElementById("bgMusic") ||
    document.getElementById("backgroundMusic");

  const musicToggle = document.getElementById("musicToggle");
  const musicIcon = document.getElementById("musicIcon");

  // ==========================================
  // 1. MUSIK DAN TOMBOL FAB
  // ==========================================

  function updateMusicIcon() {
    if (!audio || !musicIcon || !musicToggle) return;

    if (audio.paused) {
      musicIcon.textContent = "♫";
      musicToggle.setAttribute("aria-label", "Putar musik");
      musicToggle.setAttribute("title", "Putar musik");
      musicToggle.classList.remove("playing");
    } else {
      musicIcon.textContent = "Ⅱ";
      musicToggle.setAttribute("aria-label", "Jeda musik");
      musicToggle.setAttribute("title", "Jeda musik");
      musicToggle.classList.add("playing");
    }
  }

  async function playMusic() {
    if (!audio) return;

    try {
      await audio.play();
      updateMusicIcon();
    } catch (error) {
      console.warn("Musik belum dapat diputar:", error);
      updateMusicIcon();
    }
  }

  function pauseMusic() {
    if (!audio) return;

    audio.pause();
    updateMusicIcon();
  }

  // Tombol buka undangan
 // ==========================================
// ANIMASI BUKA UNDANGAN
// ==========================================

const hero = document.getElementById("hero");

let invitationOpened = false;

if (openInvitation) {
  openInvitation.addEventListener("click", async () => {
    if (invitationOpened) return;

    invitationOpened = true;

    // Mulai musik ketika pengguna menekan tombol
    playMusic();

    // Hilangkan cover secara perlahan
    if (opening) {
      opening.classList.add("closing");
    }

    // Tampilkan hero secara perlahan
    if (hero) {
      hero.classList.add("show-hero");
    }

    // Kunci scroll sebentar selama transisi
    document.body.style.overflow = "hidden";

    // Kembalikan scroll setelah animasi selesai
    setTimeout(() => {
      document.body.style.overflow = "";
    }, 1300);
  });
}

  // Tombol FAB musik
  if (musicToggle) {
    musicToggle.addEventListener("click", async () => {
      if (!audio) {
        console.warn("Elemen audio tidak ditemukan.");
        return;
      }

      if (audio.paused) {
        await playMusic();
      } else {
        pauseMusic();
      }
    });
  }

  // Update ikon ketika kondisi audio berubah
  if (audio) {
    audio.addEventListener("play", updateMusicIcon);
    audio.addEventListener("pause", updateMusicIcon);
    audio.addEventListener("ended", updateMusicIcon);

    // Jangan memutar otomatis sebelum pengguna membuka undangan
    audio.pause();
    updateMusicIcon();
  }

  // ==========================================
  // 2. COUNTDOWN PERNIKAHAN
  // ==========================================

  const daysElement = document.getElementById("days");
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");

  function updateCountdown() {
    const now = new Date();
    const distance = WEDDING_DATE.getTime() - now.getTime();

    if (distance <= 0) {
      if (daysElement) daysElement.textContent = "00";
      if (hoursElement) hoursElement.textContent = "00";
      if (minutesElement) minutesElement.textContent = "00";
      if (secondsElement) secondsElement.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (distance % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor(
      (distance % (1000 * 60)) / 1000
    );

    if (daysElement) daysElement.textContent = String(days).padStart(2, "0");
    if (hoursElement) hoursElement.textContent = String(hours).padStart(2, "0");
    if (minutesElement) minutesElement.textContent = String(minutes).padStart(2, "0");
    if (secondsElement) secondsElement.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

 // ==========================================
// 3. GALERI 6 FOTO SLIDESHOW
// ==========================================

const galleryTrack = document.getElementById("galleryTrack");
const galleryPrev = document.getElementById("galleryPrev");
const galleryNext = document.getElementById("galleryNext");
const galleryDots = document.getElementById("galleryDots");
const galleryCounter = document.getElementById("galleryCounter");

const gallerySlides = galleryTrack
  ? Array.from(galleryTrack.querySelectorAll(".gallery-slide"))
  : [];

let currentSlide = 0;
const totalSlides = gallerySlides.length;

function updateGallery() {
  if (!galleryTrack || totalSlides === 0) return;

  galleryTrack.style.transform =
    `translateX(-${currentSlide * 100}%)`;

  if (galleryCounter) {
    galleryCounter.textContent =
      `${String(currentSlide + 1).padStart(2, "0")} / ${String(totalSlides).padStart(2, "0")}`;
  }

  if (galleryDots) {
    galleryDots.querySelectorAll(".gallery-dot").forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSlide);
    });
  }
}

function goToSlide(index) {
  if (totalSlides === 0) return;

  currentSlide = (index + totalSlides) % totalSlides;
  updateGallery();
}

if (galleryDots) {
  gallerySlides.forEach((slide, index) => {
    const dot = document.createElement("button");

    dot.className = "gallery-dot";
    dot.setAttribute("aria-label", `Lihat foto ${index + 1}`);

    dot.addEventListener("click", () => {
      goToSlide(index);
    });

    galleryDots.appendChild(dot);
  });
}

if (galleryPrev) {
  galleryPrev.addEventListener("click", () => {
    goToSlide(currentSlide - 1);
  });
}

if (galleryNext) {
  galleryNext.addEventListener("click", () => {
    goToSlide(currentSlide + 1);
  });
}

// Swipe untuk layar sentuh
const galleryWindow = document.querySelector(".gallery-window");

if (galleryWindow) {
  let touchStartX = 0;
  let touchEndX = 0;

  galleryWindow.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].screenX;
  }, { passive: true });

  galleryWindow.addEventListener("touchend", (event) => {
    touchEndX = event.changedTouches[0].screenX;

    const difference = touchStartX - touchEndX;

    if (Math.abs(difference) > 50) {
      if (difference > 0) {
        goToSlide(currentSlide + 1);
      } else {
        goToSlide(currentSlide - 1);
      }
    }
  }, { passive: true });
}

// Klik foto untuk memperbesar
gallerySlides.forEach((slide) => {
  const img = slide.querySelector("img");

  if (img) {
    img.addEventListener("click", () => {
      openGalleryLightbox(currentSlide);
    });
  }
});

// Lightbox
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeLightbox = document.getElementById("closeLightbox");
const prevImage = document.getElementById("prevImage");
const nextImage = document.getElementById("nextImage");

function openGalleryLightbox(index) {
  if (!lightbox || !lightboxImage) return;

  currentSlide = index;
  lightboxImage.src = gallerySlides[currentSlide].querySelector("img").src;

  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

function updateLightbox() {
  if (!lightboxImage || totalSlides === 0) return;

  lightboxImage.src =
    gallerySlides[currentSlide].querySelector("img").src;
}

function closeGalleryLightbox() {
  if (!lightbox) return;

  lightbox.classList.remove("active");
  document.body.style.overflow = "";
}

if (closeLightbox) {
  closeLightbox.addEventListener("click", closeGalleryLightbox);
}

if (prevImage) {
  prevImage.addEventListener("click", () => {
    goToSlide(currentSlide - 1);
    updateLightbox();
  });
}

if (nextImage) {
  nextImage.addEventListener("click", () => {
    goToSlide(currentSlide + 1);
    updateLightbox();
  });
}

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeGalleryLightbox();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (!lightbox || !lightbox.classList.contains("active")) return;

  if (event.key === "Escape") closeGalleryLightbox();

  if (event.key === "ArrowLeft") {
    goToSlide(currentSlide - 1);
    updateLightbox();
  }

  if (event.key === "ArrowRight") {
    goToSlide(currentSlide + 1);
    updateLightbox();
  }
});

updateGallery();
// ==========================================
// AUTO SLIDE SETIAP 2 DETIK
// ==========================================

let galleryAutoplay;

function startGalleryAutoplay() {
  stopGalleryAutoplay();

  galleryAutoplay = setInterval(() => {
    // Jangan berpindah otomatis ketika lightbox terbuka
    if (lightbox && lightbox.classList.contains("active")) return;

    goToSlide(currentSlide + 1);
  }, 2000);
}

function stopGalleryAutoplay() {
  if (galleryAutoplay) {
    clearInterval(galleryAutoplay);
  }
}

// Mulai otomatis
startGalleryAutoplay();

// Hentikan sementara ketika mouse berada di atas galeri
if (galleryWindow) {
  galleryWindow.addEventListener("mouseenter", stopGalleryAutoplay);
  galleryWindow.addEventListener("mouseleave", startGalleryAutoplay);
}

// Hentikan ketika lightbox dibuka
const originalOpenGalleryLightbox = openGalleryLightbox;

if (typeof originalOpenGalleryLightbox === "function") {
  // Autoplay akan tetap dijeda selama lightbox terbuka
}

  // ==========================================
  // 4. RSVP MELALUI WHATSAPP
  // ==========================================

  const rsvpForm = document.getElementById("rsvpForm");

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const guestName =
        document.getElementById("guestName")?.value.trim() || "";

      const attendance =
        document.getElementById("attendance")?.value || "";

      const guestCount =
        document.getElementById("guestCount")?.value || "1";

      const guestMessage =
        document.getElementById("guestMessage")?.value.trim() || "-";

      if (!guestName || !attendance) {
        alert("Mohon lengkapi nama dan konfirmasi kehadiran.");
        return;
      }

      const message = [
        "Halo Wira & Ayu!",
        "",
        "Saya ingin mengonfirmasi undangan pernikahan:",
        "",
        `Nama: ${guestName}`,
        `Kehadiran: ${attendance}`,
        `Jumlah tamu: ${guestCount}`,
        `Pesan: ${guestMessage}`,
        "",
        "Terima kasih."
      ].join("\n");

      const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      window.open(whatsappURL, "_blank", "noopener,noreferrer");
    });
  }

  // ==========================================
  // 5. TOMBOL SALIN REKENING / INFORMASI
  // ==========================================

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const textToCopy = button.getAttribute("data-copy");

      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);

        const originalText = button.textContent;
        button.textContent = "Berhasil disalin!";

        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      } catch (error) {
        alert("Tidak dapat menyalin teks pada perangkat ini.");
      }
    });
  });

  // ==========================================
  // 6. TAHUN OTOMATIS
  // ==========================================

  document.querySelectorAll(".current-year").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  // ==========================================
  // 7. INISIALISASI
  // ==========================================

  renderGallery();
  updateMusicIcon();

});
