/* ==========================================================================
   Interactive Navigation & Mobile Drawer Helper for OnTheStage GTM Engine
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const mobileDrawer = document.getElementById("mobile-nav-drawer");

  if (hamburgerBtn && mobileDrawer) {
    // Toggle mobile menu
    hamburgerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      hamburgerBtn.classList.toggle("open");
      mobileDrawer.classList.toggle("active");
    });

    // Close mobile menu on clicking any link inside
    document.querySelectorAll(".mobile-nav-link, .mobile-nav-drawer a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburgerBtn.classList.remove("open");
        mobileDrawer.classList.remove("active");
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!hamburgerBtn.contains(e.target) && !mobileDrawer.contains(e.target)) {
        hamburgerBtn.classList.remove("open");
        mobileDrawer.classList.remove("active");
      }
    });
  }

  // Smooth scroll for anchor navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId && targetId !== "#") {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }
    });
  });
});
