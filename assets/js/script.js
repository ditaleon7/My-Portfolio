(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Back to top button ---------- */
  var backToTop = document.getElementById("backToTop");
  if (backToTop) {
    var toggleBackToTop = function () {
      var show = window.scrollY > window.innerHeight * 0.6;
      backToTop.classList.toggle("opacity-0", !show);
      backToTop.classList.toggle("pointer-events-none", !show);
      backToTop.classList.toggle("translate-y-4", !show);
      backToTop.classList.toggle("opacity-100", show);
      backToTop.classList.toggle("translate-y-0", show);
    };
    window.addEventListener("scroll", toggleBackToTop, { passive: true });
    toggleBackToTop();
  }

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById("menuBtn");
  var mobileMenu = document.getElementById("mobileMenu");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
      mobileMenu.classList.toggle("flex");
    });
  }
  document.querySelectorAll("[data-nav-link]").forEach(function (link) {
    link.addEventListener("click", function () {
      if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.add("hidden");
        mobileMenu.classList.remove("flex");
      }
    });
  });

  /* ---------- Active section highlight + sliding nav pill ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var navIndicator = document.getElementById("navIndicator");
  var navList = document.getElementById("navList");

  function moveIndicatorTo(link) {
    if (!navIndicator || !navList || !link) return;
    var listRect = navList.getBoundingClientRect();
    var linkRect = link.getBoundingClientRect();
    navIndicator.style.opacity = "1";
    navIndicator.style.width = linkRect.width + "px";
    navIndicator.style.transform = "translateX(" + (linkRect.left - listRect.left) + "px)";
  }

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navLinks.forEach(function (link) {
              var isActive = link.getAttribute("href") === "#" + entry.target.id;
              link.classList.toggle("text-neon-red", isActive);
              link.classList.toggle("text-muted", !isActive);
              if (isActive) moveIndicatorTo(link);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (section) { navObserver.observe(section); });
    window.addEventListener("resize", function () {
      var activeLink = navLinks.filter(function (l) { return l.classList.contains("text-neon-red"); })[0];
      if (activeLink) moveIndicatorTo(activeLink);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal, .reveal-drop"));
  if (revealEls.length) {
    if ("IntersectionObserver" in window && !prefersReducedMotion) {
      document.documentElement.classList.add("js-ready");
      var revealObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      revealEls.forEach(function (el) { revealObserver.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    }
  }

  /* ---------- Role typewriter ---------- */
  var roleTyper = document.getElementById("roleTyper");
  var roles = ["UI/UX Designer", "Web Developer", "Administrator"];
  if (roleTyper) {
    if (prefersReducedMotion) {
      roleTyper.textContent = roles.join(" · ");
    } else {
      (function typewriterLoop() {
        var roleIndex = 0;
        var charIndex = 0;
        var deleting = false;

        function tick() {
          var current = roles[roleIndex];
          if (!deleting) {
            charIndex++;
            roleTyper.textContent = current.slice(0, charIndex) + "_";
            if (charIndex === current.length) {
              deleting = true;
              setTimeout(tick, 1400);
              return;
            }
          } else {
            charIndex--;
            roleTyper.textContent = current.slice(0, charIndex) + "_";
            if (charIndex === 0) {
              deleting = false;
              roleIndex = (roleIndex + 1) % roles.length;
            }
          }
          setTimeout(tick, deleting ? 45 : 90);
        }
        tick();
      })();
    }
  }

  /* ---------- Hero photo hand-off animation ---------- */
  var heroPhoto = document.getElementById("heroPhoto");
  var homeSection = document.getElementById("home");
  if (heroPhoto && homeSection && "IntersectionObserver" in window && !prefersReducedMotion) {
    var heroPhotoObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          heroPhoto.classList.toggle("photo-gone", entry.intersectionRatio < 0.35 && entry.boundingClientRect.top < 0);
        });
      },
      { threshold: [0, 0.35, 1] }
    );
    heroPhotoObserver.observe(homeSection);
  }

  /* ---------- Hero photo parallax tilt ---------- */
  var heroFloatEl = document.querySelector("#home .animate-float");
  var heroParallaxWrap = heroFloatEl ? heroFloatEl.parentElement : null;
  if (heroParallaxWrap && !prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    heroParallaxWrap.style.transition = "transform 0.25s ease-out";
    var heroSection = document.getElementById("home");
    heroSection.addEventListener("mousemove", function (e) {
      var rect = heroSection.getBoundingClientRect();
      var relX = (e.clientX - rect.left) / rect.width - 0.5;
      var relY = (e.clientY - rect.top) / rect.height - 0.5;
      heroParallaxWrap.style.transform = "rotate(" + (relX * 6) + "deg) translate(" + (relX * 10) + "px, " + (relY * 10) + "px)";
    });
    heroSection.addEventListener("mouseleave", function () {
      heroParallaxWrap.style.transform = "";
    });
  }

  /* ---------- Auto-scrolling skill cards ---------- */
  var SKILLS = [
    { name: "HTML5", icon: "html-5.svg", tint: "#ff6b1a" },
    { name: "CSS3", icon: "css.svg" },
    { name: "JavaScript", icon: "javascript.svg" },
    { name: "Vue.js", icon: "vue.svg" },
    { name: "PHP", icon: "php.svg" },
    { name: "Laravel", icon: "laravel.svg" },
    { name: "Python", icon: "python.svg" },
    { name: "MySQL", icon: "mysql.svg" },
    { name: "Node.js", icon: "nodejs-icon.svg" },
    { name: "Bootstrap", icon: "bootstrap.svg" },
    { name: "Tailwind CSS", icon: "tailwind-icon.svg" },
    { name: "Excel", icon: "excel.svg" },
    { name: "PowerPoint", icon: "powerpoint.svg" },
    { name: "Word", icon: "word.svg" },
    { name: "Canva", icon: "canva-icon.svg" },
    { name: "Claude", icon: "claude-icon.svg" },
    { name: "Vercel", icon: "vercel.svg", tint: "#ffffff", scale: 1.6 },
    { name: "Vite", icon: "vite.svg" },
    { name: "Google Gemini", icon: "google-gemini.svg", scale: 1.6 },
    { name: "Adobe XD", icon: "logos--adobe-xd.svg" },
    { name: "Visio", icon: "visio.svg", scale: 1.6 },
    { name: "OpenAI", icon: "openai-icon.svg", tint: "#ffffff" }
  ];

  var skillTrack = document.getElementById("skillTrack");
  if (skillTrack) {
    function buildCard(skill) {
      var card = document.createElement("div");
      card.className = "skill-card glass glass-hover clip-corner-sm p-5 flex flex-col items-center justify-center gap-3 text-center";
      var iconPath = "./assets/icons/" + skill.icon;
      var scaleStyle = skill.scale ? "transform:scale(" + skill.scale + ");" : "";
      var iconHtml;
      if (skill.tint) {
        iconHtml =
          '<span class="w-10 h-10 icon-mask" style="background-color:' + skill.tint + ';' + scaleStyle +
          "-webkit-mask-image:url(" + iconPath + ');mask-image:url(' + iconPath + ');"></span>';
      } else {
        iconHtml = '<img src="' + iconPath + '" alt="" class="w-10 h-10 object-contain" style="' + scaleStyle + '" loading="lazy" onerror="this.style.opacity=0.15">';
      }
      card.innerHTML = iconHtml + '<span class="font-mono text-xs text-ink">' + skill.name + "</span>";
      return card;
    }
    // Render the list twice back-to-back so the marquee can loop seamlessly.
    SKILLS.forEach(function (skill) { skillTrack.appendChild(buildCard(skill)); });
    if (!prefersReducedMotion) {
      SKILLS.forEach(function (skill) { skillTrack.appendChild(buildCard(skill)); });
    }
  }

  /* ---------- Carousels ---------- */
  function initCarousel(root) {
    var track = root.querySelector("[data-track]");
    var slides = Array.prototype.slice.call(track.children);
    var prevBtn = root.querySelector("[data-prev]");
    var nextBtn = root.querySelector("[data-next]");
    var dotsWrap = root.querySelector("[data-dots]");
    var autoplayDelay = parseInt(root.getAttribute("data-autoplay"), 10) || 5000;
    var index = 0;
    var timer = null;
    var isDragging = false;
    var dragStartX = 0;
    var dragCurrentX = 0;
    var trackWidth = 0;

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.className = "w-2 h-2 rounded-full bg-line";
      dot.setAttribute("aria-label", "Slide " + (i + 1));
      dot.addEventListener("click", function () { goTo(i); resetAutoplay(); });
      dotsWrap.appendChild(dot);
    });

    function updateDots() {
      Array.prototype.forEach.call(dotsWrap.children, function (dot, i) {
        dot.classList.toggle("bg-neon-red", i === index);
        dot.classList.toggle("bg-line", i !== index);
      });
    }

    function measure() {
      trackWidth = root.querySelector(".carousel-viewport").getBoundingClientRect().width;
    }

    function render(withTransition) {
      track.style.transition = withTransition === false ? "none" : "transform 0.5s ease";
      track.style.transform = "translateX(" + (-index * trackWidth) + "px)";
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      render(true);
      updateDots();
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function startAutoplay() {
      if (prefersReducedMotion) return;
      stopAutoplay();
      timer = setInterval(next, autoplayDelay);
    }
    function stopAutoplay() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    function resetAutoplay() { stopAutoplay(); startAutoplay(); }

    nextBtn.addEventListener("click", function () { next(); resetAutoplay(); });
    prevBtn.addEventListener("click", function () { prev(); resetAutoplay(); });

    root.addEventListener("mouseenter", stopAutoplay);
    root.addEventListener("mouseleave", startAutoplay);

    track.addEventListener("pointerdown", function (e) {
      isDragging = true;
      dragStartX = e.clientX;
      dragCurrentX = 0;
      stopAutoplay();
      track.setPointerCapture(e.pointerId);
      track.style.cursor = "grabbing";
    });
    track.addEventListener("pointermove", function (e) {
      if (!isDragging) return;
      dragCurrentX = e.clientX - dragStartX;
      track.style.transition = "none";
      track.style.transform = "translateX(" + (-index * trackWidth + dragCurrentX) + "px)";
    });
    function endDrag() {
      if (!isDragging) return;
      isDragging = false;
      track.style.cursor = "";
      if (Math.abs(dragCurrentX) > trackWidth * 0.15) {
        dragCurrentX < 0 ? next() : prev();
      } else {
        render(true);
      }
      resetAutoplay();
    }
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointerleave", function () { if (isDragging) endDrag(); });

    window.addEventListener("resize", function () {
      measure();
      render(false);
    });

    measure();
    render(false);
    updateDots();
    startAutoplay();
  }

  document.querySelectorAll("[data-carousel]").forEach(initCarousel);

  /* ---------- Contact form -> sends directly via FormSubmit ---------- */
  var contactForm = document.getElementById("contactForm");
  var statusEl = document.getElementById("cf-status");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = contactForm.name.value.trim();
      var email = contactForm.email.value.trim();
      var subject = contactForm.subject.value.trim();
      var message = contactForm.message.value.trim();

      if (!name || !email || !subject || !message) {
        statusEl.classList.add("text-neon-red");
        statusEl.textContent = "Please fill in all fields.";
        return;
      }

      var to = "rizkyanditaleon7@gmail.com";
      var submitBtn = contactForm.querySelector('button[type="submit"]');

      statusEl.classList.remove("text-neon-red");
      statusEl.textContent = "Sending...";
      if (submitBtn) submitBtn.disabled = true;

      fetch("https://formsubmit.co/ajax/" + to, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          name: name,
          email: email,
          _subject: "Portfolio contact: " + subject,
          message: message
        })
      })
        .then(function (res) { return res.json(); })
        .then(function () {
          statusEl.classList.remove("text-neon-red");
          statusEl.textContent = "Message sent! I'll get back to you soon.";
          contactForm.reset();
        })
        .catch(function () {
          statusEl.classList.add("text-neon-red");
          statusEl.textContent = "Something went wrong. Please email me directly instead.";
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }
})();