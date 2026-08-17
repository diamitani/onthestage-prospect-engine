/* ==========================================================================
   Smooth Scrolling and Interaction Helper for OnTheStage GTM Engine
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
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
