// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function () {
  // Get elements
  const hamburger = document.querySelector(".hamburger");
  const navLinksWrapper = document.querySelector(".nav-links-wrapper");
  const overlay = document.querySelector(".mobile-overlay");
  const navLinks = document.querySelectorAll(".nav-links");

  // Check if elements exist
  if (!hamburger || !navLinksWrapper || !overlay) {
    console.error("Required elements not found");
    return;
  }

  // Toggle menu function
  function toggleMenu() {
    const isActive = hamburger.classList.contains("active");

    if (isActive) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Open menu function
  function openMenu() {
    hamburger.classList.add("active");
    navLinksWrapper.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  // Close menu function
  function closeMenu() {
    hamburger.classList.remove("active");
    navLinksWrapper.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Event listeners
  hamburger.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleMenu();
  });

  overlay.addEventListener("click", closeMenu);

  // Close menu when clicking on nav links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Only close on mobile/tablet
      if (window.innerWidth <= 1024) {
        closeMenu();
      }
    });
  });

  // Close menu on window resize if screen becomes larger
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (
        window.innerWidth > 1024 &&
        navLinksWrapper.classList.contains("active")
      ) {
        closeMenu();
      }
    }, 250);
  });

  // Close menu on ESC key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navLinksWrapper.classList.contains("active")) {
      closeMenu();
    }
  });

  // Prevent body scroll when touching menu
  navLinksWrapper.addEventListener(
    "touchmove",
    function (e) {
      e.stopPropagation();
    },
    { passive: true }
  );
});

// Dual Infinite Slider System
class InfiniteSlider {
  constructor(wrapperSelector, direction = "left", speed = 0.5) {
    this.wrapper = document.querySelector(wrapperSelector);
    this.wrapperSelector = wrapperSelector;
    this.direction = direction;
    this.speed = speed;
    this.animationId = null;
    this.position = 0;
    this.isEnabled = true;
    this.originalCards = [];
    this.clonedCards = [];

    this.init();
  }

  init() {
    if (!this.wrapper) return;

    // Check if should be enabled based on screen size
    this.checkScreenSize();

    // Store original cards
    this.originalCards = Array.from(this.wrapper.children);

    // Always clone cards for seamless loop on all devices
    // Clone multiple times for better infinite effect
    this.clonedCards = [];
    for (let i = 0; i < 3; i++) {
      const clones = this.originalCards.map((card) => card.cloneNode(true));
      clones.forEach((clone) => {
        this.wrapper.appendChild(clone);
        this.clonedCards.push(clone);
      });
    }

    // Set wrapper styles for smooth scrolling
    this.wrapper.style.display = "flex";
    this.wrapper.style.width = "max-content";

    // Calculate total width of original cards
    this.cardWidth = this.originalCards.reduce((sum, card) => {
      const style = getComputedStyle(card);
      const marginRight = parseFloat(style.marginRight) || 0;
      const marginLeft = parseFloat(style.marginLeft) || 0;
      return sum + card.offsetWidth + marginRight + marginLeft;
    }, 0);

    // Start animation
    this.animate();

    // Handle window resize
    this.resizeHandler = () => this.handleResize();
    window.addEventListener("resize", this.resizeHandler);
  }

  removeClones() {
    // Remove cloned elements
    if (this.clonedCards.length > 0) {
      this.clonedCards.forEach((clone) => {
        if (clone.parentNode) {
          clone.parentNode.removeChild(clone);
        }
      });
      this.clonedCards = [];
    }
  }

  checkScreenSize() {
    // Enable slider on ALL screen sizes (including mobile/tablet)
    this.isEnabled = true;
  }

  handleResize() {
    // Recalculate card width on resize
    if (this.originalCards.length > 0) {
      this.cardWidth = this.originalCards.reduce((sum, card) => {
        const style = getComputedStyle(card);
        const marginRight = parseFloat(style.marginRight) || 0;
        const marginLeft = parseFloat(style.marginLeft) || 0;
        return sum + card.offsetWidth + marginRight + marginLeft;
      }, 0);
    }
  }

  animate() {
    if (!this.isEnabled) return;

    const move = () => {
      if (!this.isEnabled) return;

      if (this.direction === "left") {
        this.position -= this.speed;

        // Reset position BEFORE reaching the end for seamless loop
        if (Math.abs(this.position) >= this.cardWidth) {
          this.position = this.position + this.cardWidth;
        }
      } else {
        this.position += this.speed;

        // Reset position BEFORE reaching the start for seamless loop
        if (this.position >= 0) {
          this.position = this.position - this.cardWidth;
        }
      }

      if (this.wrapper) {
        this.wrapper.style.transform = `translateX(${this.position}px)`;
      }
      this.animationId = requestAnimationFrame(move);
    };

    this.animationId = requestAnimationFrame(move);
  }

  pause() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  resume() {
    if (!this.animationId && this.isEnabled) {
      this.animate();
    }
  }

  destroy() {
    this.pause();
    this.removeClones();
    if (this.wrapper) {
      this.wrapper.style.transform = "";
      this.wrapper.style.width = "";
      this.wrapper.style.display = "";
    }
    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);
    }
  }
}

// Global slider instances
let servicesSlider = null;
let benefitsSlider = null;
let solutionsRow1Slider = null;
let solutionsRow2Slider = null;

// Initialize sliders when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initializeSliders();

  // Handle window resize for slider behavior
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Sliders will handle their own enable/disable based on screen size
    }, 250);
  });
});

function initializeSliders() {
  // Services section - Right to Left
  servicesSlider = new InfiniteSlider(".service-card-wrapper", "left", 1.5);

  // Benefits section - Left to Right
  benefitsSlider = new InfiniteSlider(".benefits-card-wrapper", "right", 1.5);

  // Solutions section Row 1 - Right to Left
  solutionsRow1Slider = new InfiniteSlider(".solution-cards-row1", "left", 1.2);

  // Solutions section Row 2 - Left to Right
  solutionsRow2Slider = new InfiniteSlider(
    ".solution-cards-row2",
    "right",
    1.2
  );
}

function destroySliders() {
  if (servicesSlider) {
    servicesSlider.destroy();
    servicesSlider = null;
  }
  if (benefitsSlider) {
    benefitsSlider.destroy();
    benefitsSlider = null;
  }
  if (solutionsRow1Slider) {
    solutionsRow1Slider.destroy();
    solutionsRow1Slider = null;
  }
  if (solutionsRow2Slider) {
    solutionsRow2Slider.destroy();
    solutionsRow2Slider = null;
  }
}