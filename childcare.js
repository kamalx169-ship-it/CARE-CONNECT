/* ============================================================
   childcare.js
   CareConnect - Child Care Page

   FEATURES:
   1.  Navbar shadow on scroll
   2.  Hamburger menu open / close (animates to X)
   3.  Close mobile menu when a link is clicked
   4.  Scroll reveal  (IntersectionObserver)
   5.  Toast notification  (showMsg)
   6.  Min date on date picker
   7.  Billing tab switcher  (setBilling)
   8.  Enroll form: duration select updates plan prices
   9.  Enroll form: validation and submit
   10. Re-focus clears error border on inputs
   ============================================================ */

/* ------------------------------------------------------------
   1. NAVBAR SHADOW ON SCROLL
   Adds Tailwind shadow-lg class when page is scrolled > 30px.
   ------------------------------------------------------------ */
window.addEventListener("scroll", function () {
  document
    .getElementById("topnav")
    .classList.toggle("shadow-lg", window.scrollY > 30);
});

/* ------------------------------------------------------------
   2. HAMBURGER MENU OPEN / CLOSE
   Toggles mobile nav. Animates 3 bars into an X shape.
   ------------------------------------------------------------ */
var menuOpen = false;

document.getElementById("menu-btn").addEventListener("click", function () {
  menuOpen = !menuOpen;
  var box = document.getElementById("menu-box");
  box.classList.toggle("hidden", !menuOpen);
  box.classList.toggle("flex", menuOpen);
  document.getElementById("b1").style.transform = menuOpen
    ? "translateY(8px) rotate(45deg)"
    : "";
  document.getElementById("b2").style.opacity = menuOpen ? "0" : "1";
  document.getElementById("b3").style.transform = menuOpen
    ? "translateY(-8px) rotate(-45deg)"
    : "";
});

/* ------------------------------------------------------------
   3. CLOSE MOBILE MENU WHEN A LINK IS CLICKED
   ------------------------------------------------------------ */
document
  .getElementById("menu-box")
  .querySelectorAll("a")
  .forEach(function (a) {
    a.addEventListener("click", function () {
      menuOpen = false;
      document.getElementById("menu-box").classList.add("hidden");
      document.getElementById("menu-box").classList.remove("flex");
      document.getElementById("b1").style.transform = "";
      document.getElementById("b2").style.opacity = "1";
      document.getElementById("b3").style.transform = "";
    });
  });

/* ------------------------------------------------------------
   4. SCROLL REVEAL
   Watches every .show-up element using IntersectionObserver.
   When the element enters the viewport, adds .visible which
   triggers the CSS fade-in + slide-up transition.
   ------------------------------------------------------------ */
document.querySelectorAll(".show-up").forEach(function (el) {
  new IntersectionObserver(
    function (items) {
      items.forEach(function (item) {
        if (item.isIntersecting) {
          item.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.08 },
  ).observe(el);
});

/* ------------------------------------------------------------
   5. TOAST NOTIFICATION
   Shows a small popup at bottom-right of the screen.
   - text  : message to display
   - isErr : true = red background, false = dark ink background
   Auto-hides after 3.5 seconds.
   ------------------------------------------------------------ */
function showMsg(text, isErr) {
  var box = document.getElementById("msg-box");
  box.textContent = text;
  box.className =
    "fixed bottom-6 right-6 text-white px-5 py-3 rounded-2xl text-sm font-medium shadow-2xl z-50 transition-all duration-300 opacity-100 translate-y-0 " +
    (isErr ? "bg-red-800" : "bg-ink");
  setTimeout(function () {
    box.className =
      "fixed bottom-6 right-6 bg-ink text-white px-5 py-3 rounded-2xl text-sm font-medium shadow-2xl opacity-0 translate-y-2 transition-all duration-300 z-50 pointer-events-none";
  }, 3500);
}

/* ------------------------------------------------------------
   6. MIN DATE ON DATE PICKER
   Prevents selecting a date in the past.
   ------------------------------------------------------------ */
var today = new Date();
document.getElementById("date").min =
  today.getFullYear() +
  "-" +
  String(today.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(today.getDate()).padStart(2, "0");

/* ------------------------------------------------------------
   7. BILLING TAB SWITCHER
   Three tabs: Monthly / 6 Months / Yearly.
   Clicking a tab:
     a) Updates the active style on all three tab buttons.
     b) Rewrites the price + note text inside each plan card.
   ------------------------------------------------------------ */
var BILLING = {
  monthly: {
    seedling: ["₹2,999", "/mo", "Billed ₹2,999 monthly"],
    blossom: ["₹5,499", "/mo", "Billed ₹5,499 monthly"],
    bloom: ["₹8,999", "/mo", "Billed ₹8,999 monthly"],
  },
  sixmonth: {
    seedling: ["₹2,699", "/mo", "Total ₹16,194 · 6-month plan"],
    blossom: ["₹4,949", "/mo", "Total ₹29,694 · 6-month plan"],
    bloom: ["₹8,099", "/mo", "Total ₹48,594 · 6-month plan"],
  },
  annual: {
    seedling: ["₹2,399", "/mo", "Total ₹28,788 · annual plan"],
    blossom: ["₹4,399", "/mo", "Total ₹52,788 · annual plan"],
    bloom: ["₹7,199", "/mo", "Total ₹86,388 · annual plan"],
  },
};

function setBilling(type) {
  /* update tab button active/inactive styles */
  ["monthly", "sixmonth", "annual"].forEach(function (t) {
    var btn = document.getElementById("tab-" + t);
    var isActive = t === type;
    btn.className =
      "px-5 py-2 rounded-full text-xs font-semibold border border-blue/20 transition-all duration-200 " +
      (isActive ? "bg-ink text-white" : "text-stone bg-white hover:bg-pale");
  });

  /* update price and note inside each plan card */
  ["seedling", "blossom", "bloom"].forEach(function (plan) {
    var d = BILLING[type][plan];
    document.getElementById("price-" + plan).innerHTML =
      '<span class="font-title text-4xl text-blue leading-none">' +
      d[0] +
      "</span>" +
      '<span class="text-sm text-stone mb-1">' +
      d[1] +
      "</span>";
    document.getElementById("note-" + plan).textContent = d[2];
  });
}

/* ------------------------------------------------------------
   8. ENROLL FORM: DURATION SELECT UPDATES PLAN PRICES
   When the user picks a billing duration in the enroll form,
   the plan dropdown options update to show the correct prices.
   It also fires setBilling() to sync the plan cards above.
   ------------------------------------------------------------ */
var FORM_PRICES = {
  "3month": {
    seedling: "Seedling - Rs.2,999/mo (3 months)",
    blossom: "Blossom - Rs.5,499/mo (3 months)",
    bloom: "Bloom - Rs.8,999/mo (3 months)",
  },
  "6month": {
    seedling: "Seedling - Rs.2,699/mo (6 months, save 10%)",
    blossom: "Blossom - Rs.4,949/mo (6 months, save 10%)",
    bloom: "Bloom - Rs.8,099/mo (6 months, save 10%)",
  },
  yearly: {
    seedling: "Seedling - Rs.2,399/mo (yearly, save 20%)",
    blossom: "Blossom - Rs.4,399/mo (yearly, save 20%)",
    bloom: "Bloom - Rs.7,199/mo (yearly, save 20%)",
  },
};

document.getElementById("duration").addEventListener("change", function () {
  var dur = this.value;
  var planSel = document.getElementById("plan");
  var currentVal = planSel.value;
  var prices = FORM_PRICES[dur];

  /* rewrite the three plan option labels */
  planSel.options[1].text = prices.seedling;
  planSel.options[2].text = prices.blossom;
  planSel.options[3].text = prices.bloom;

  /* keep the previously selected plan selected */
  if (currentVal) {
    planSel.value = currentVal;
  }

  /* show toast confirming price update */
  var durLabel = {
    "3month": "3 Months",
    "6month": "6 Months",
    yearly: "Yearly",
  };
  showMsg("Prices updated for " + durLabel[dur] + " plan.");

  /* sync the billing tabs on the plan section above */
  var tabMap = { "3month": "monthly", "6month": "sixmonth", yearly: "annual" };
  if (tabMap[dur]) {
    setBilling(tabMap[dur]);
  }
});

/* ------------------------------------------------------------
   9. ENROLL FORM: VALIDATION AND SUBMIT
   - Checks every [required] field is filled.
   - Highlights empty fields with a red border.
   - On success: button turns green, resets after 1.1s,
     and shows a toast confirmation.
   ------------------------------------------------------------ */
document.getElementById("enrollForm").addEventListener("submit", function (e) {
  e.preventDefault();
  var ok = true;

  /* clear previous error highlights */
  this.querySelectorAll("[required]").forEach(function (f) {
    f.style.borderBottomColor = "";
    if (!f.value.trim()) {
      ok = false;
      f.style.borderBottomColor = "#c44";
    }
  });

  if (!ok) {
    showMsg("Please fill in all fields.", true);
    return;
  }

  /* success state */
  var btn = document.getElementById("enroll-btn");
  btn.textContent = "Enrolment Secured!";
  btn.style.background = "#2a7a4a";

  var frm = this;
  setTimeout(function () {
    showMsg(
      "Request submitted! A coordinator will contact you within 24 hours.",
    );
    frm.reset();
    btn.innerHTML =
      'Secure Enrolment <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    btn.style.background = "";
  }, 1100);
});

/* ------------------------------------------------------------
   10. RE-FOCUS CLEARS ERROR BORDER
   When a user clicks back into a field that had a red border,
   the border colour resets to normal.
   ------------------------------------------------------------ */
document
  .getElementById("enrollForm")
  .querySelectorAll("input, select")
  .forEach(function (f) {
    f.addEventListener("focus", function () {
      this.style.borderBottomColor = "";
    });
  });
