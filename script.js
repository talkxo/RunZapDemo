// RunZap Premium Codebase Orchestration

// Route GPS Coordinates Definitions
const routePaths = {
  sgnp: [
    [19.2303, 72.8608],
    [19.2314, 72.8627],
    [19.2331, 72.8646],
    [19.2348, 72.8662],
    [19.2362, 72.8688],
    [19.2371, 72.8711],
    [19.2363, 72.8734],
    [19.2341, 72.8749],
    [19.2299, 72.8722],
    [19.2288, 72.8697],
    [19.2291, 72.8669],
    [19.2303, 72.8608]
  ],
  nariman: [
    [18.9220, 72.8200],
    [18.9248, 72.8205],
    [18.9262, 72.8201],
    [18.9284, 72.8197],
    [18.9305, 72.8194],
    [18.9327, 72.8197],
    [18.9341, 72.8203],
    [18.9327, 72.8208],
    [18.9305, 72.8204],
    [18.9284, 72.8209],
    [18.9220, 72.8200]
  ],
  sealink: [
    [19.0435, 72.8175],
    [19.0375, 72.8125],
    [19.0321, 72.8115],
    [19.0265, 72.8121],
    [19.0205, 72.8138],
    [19.0142, 72.8178],
    [19.0115, 72.8198],
    [19.0142, 72.8178],
    [19.0205, 72.8138],
    [19.0265, 72.8121],
    [19.0321, 72.8115],
    [19.0375, 72.8125],
    [19.0435, 72.8175]
  ]
};

// Activity Databases
const activities = [
  {
    id: "sgnp-1",
    title: "SGNP lower loop",
    subtitle: "Recorded this morning • Sanjay Gandhi National Park, Mumbai",
    surface: "Trail",
    startTime: "6:12 AM start",
    distance: 6.4,
    duration: "00:39:18",
    pace: "06:08 /km",
    elevation: 142,
    note: "Steady climb up to the ridge, negative-split pace on the rocky return.",
    routeKey: "sgnp",
    splits: [
      { km: 1, pace: "06:18 /km", variance: "+0:08", effort: 80, isLead: false },
      { km: 2, pace: "06:04 /km", variance: "-0:06", effort: 60, isLead: true },
      { km: 3, pace: "06:12 /km", variance: "+0:02", effort: 72, isLead: false },
      { km: 4, pace: "05:58 /km", variance: "-0:12", effort: 50, isLead: true }
    ]
  }
];

const challengeJournal = [
  {
    day: 1,
    title: "Soft launch",
    note: "Easy opening loop along coastal highway. Kept the effort light and settled into a steady cadence."
  },
  {
    day: 2,
    title: "Cadence click",
    note: "Heart rate remained low while stride turnover felt significantly sharper. Clean negative-split finish."
  },
  {
    day: 3,
    title: "Bridge rise",
    note: "Steady climb up to the ridge. Muscles felt fully activated, paving splits looking stable."
  }
];

// Active State Variables
let currentWeeklyDistance = 25.4;
let activeJournalIndex = challengeJournal.length - 1;
let currentShoeMileage = 348.4;
let isGarminConnected = true;
let isStravaConnected = true;
let mainMapInstance = null;
let mainMapPolyline = null;
let mainMapStartMarker = null;
let mainMapEndMarker = null;

// Track initialized maps in the feed to avoid reloading error
const initializedFeedMaps = {};

document.addEventListener("DOMContentLoaded", () => {
  // UI Element Selectors
  const splashScreen = document.getElementById("splash-screen");
  const screens = document.querySelectorAll(".screen");
  const navItems = document.querySelectorAll(".nav-item");
  const themeBtns = document.querySelectorAll(".theme-btn");
  const syncQuickBtn = document.getElementById("sync-quick-btn");
  const wearableSyncModal = document.getElementById("wearable-sync-modal");
  const closeSyncModalBtn = document.getElementById("close-sync-modal");
  const triggerSyncProcedureBtn = document.getElementById("trigger-sync-procedure");
  const syncProgressBarWrap = document.getElementById("sync-progress-bar");
  const syncProgressFill = document.getElementById("sync-progress-fill");
  const syncProgressPercent = document.getElementById("sync-progress-percent");
  const syncProgressStatus = document.getElementById("sync-progress-status");
  const providerCards = document.querySelectorAll(".sync-provider-card");
  
  const certificatePreviewModal = document.getElementById("certificate-preview");
  const closeCertModalBtn = document.getElementById("close-cert-modal");
  const exportCertPdfBtn = document.getElementById("export-cert-pdf");
  const badgeViewTriggerLeopard = document.getElementById("badge-view-trigger-leopard");
  const badgeCards = document.querySelectorAll(".badge-card");
  
  const exploreSubtabBtns = document.querySelectorAll(".explore-subtab-btn");
  const exploreSubscreens = document.querySelectorAll(".explore-subscreen-panel");
  
  // Dashboard Update Elements
  const recentRunTitle = document.getElementById("recent-run-title");
  const recentRunSubtitle = document.getElementById("recent-run-subtitle");
  const recentRunSurface = document.getElementById("recent-run-surface");
  const recentRunTime = document.getElementById("recent-run-time");
  const recentRunDistance = document.getElementById("recent-run-distance");
  const recentRunDuration = document.getElementById("recent-run-duration");
  const recentRunPace = document.getElementById("recent-run-pace");
  const recentRunElevation = document.getElementById("recent-run-elevation");
  const recentRunNote = document.getElementById("recent-run-note");
  const pacingSplitBody = document.getElementById("pacing-split-body");
  
  const shoeOdometerBar = document.getElementById("shoe-odometer-bar");
  const shoeOdometerMiles = document.getElementById("shoe-odometer-miles");
  const activeChallengeDistance = document.getElementById("active-challenge-distance");
  const completionRateText = document.getElementById("completion-rate");
  const weeklyRankText = document.getElementById("weekly-rank");
  const leaderUserDistance = document.getElementById("leader-user-distance");
  const leaderRowUser = document.getElementById("leader-row-user");
  const profileTotalDistance = document.getElementById("profile-total-distance");
  const profileStartsText = document.getElementById("profile-starts");
  
  const notesStoryList = document.getElementById("notes-story-list");
  const dayNoteTitle = document.getElementById("day-note-title");
  const dayNoteBody = document.getElementById("day-note-body");
  const dayNoteTag = document.getElementById("day-note-tag");
  const notesFocusTitle = document.getElementById("notes-focus-title");
  const notesFocusCopy = document.getElementById("notes-focus-copy");
  
  // Forms
  const activityUploaderForm = document.getElementById("activity-uploader-form");
  const groupCreatorForm = document.getElementById("group-creator-form");

  // Dismiss Splash Screen
  function dismissSplash() {
    if (splashScreen) {
      splashScreen.classList.add("is-hidden");
    }
  }

  // Toast Notification Trigger
  function showToast(title, message, isSecondary = false) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${isSecondary ? "secondary" : ""}`;
    toast.innerHTML = `
      <div class="toast-body">
        <strong>${title}</strong>
        <span>${message}</span>
      </div>
    `;

    container.appendChild(toast);

    // Fade out after 4 seconds
    setTimeout(() => {
      toast.classList.add("toast-exit");
      toast.addEventListener("animationend", () => {
        toast.remove();
      });
    }, 4000);
  }

  // Active Accent Theme Changer
  themeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      themeBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const theme = btn.dataset.theme;
      // Remove previous body themes
      document.body.className = "";
      
      if (theme !== "obsidian") {
        document.body.classList.add(`theme-${theme}`);
      }
      
      localStorage.setItem("runzap-theme", theme);
      showToast("Theme Updated", `Switched accent style to ${theme.toUpperCase()}`);
    });
  });

  // Load Saved Theme on Init
  const savedTheme = localStorage.getItem("runzap-theme") || "obsidian";
  const matchedThemeBtn = document.querySelector(`.theme-btn[data-theme="${savedTheme}"]`);
  if (matchedThemeBtn) {
    matchedThemeBtn.click();
  }

  // Global View Navigation
  function navigateToView(viewId) {
    screens.forEach(screen => {
      screen.classList.toggle("active", screen.id === viewId);
    });

    navItems.forEach(item => {
      item.classList.toggle("active", item.dataset.view === viewId);
    });

    // Lazy load Leaflet Maps in the Feed when navigating to Explore tab
    if (viewId === "view-explore") {
      setTimeout(initFeedMaps, 100);
    }
    
    // Auto scroll to top
    document.querySelector("main").scrollTop = 0;
  }

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      navigateToView(item.dataset.view);
    });
  });

  // Handle inner navigation targets
  document.querySelectorAll("[data-open-view]").forEach(btn => {
    btn.addEventListener("click", () => {
      navigateToView(btn.dataset.openView);
    });
  });

  document.querySelectorAll("[data-scroll-target]").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetEl = document.getElementById(btn.dataset.scrollTarget);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Explore sub-tabs management
  exploreSubtabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      exploreSubtabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const targetSub = btn.dataset.subtab;
      exploreSubscreens.forEach(sub => {
        sub.style.display = sub.id === targetSub ? "block" : "none";
      });

      if (targetSub === "view-sub-feed") {
        setTimeout(initFeedMaps, 100);
      }
    });
  });

  // Social Feed: Kudos Heart Interactivity
  function bindKudosEvents(element) {
    const kudosBtns = element ? element.querySelectorAll(".kudos-btn") : document.querySelectorAll(".kudos-btn");
    kudosBtns.forEach(btn => {
      // Prevent duplicates
      if (btn.dataset.bound === "true") return;
      btn.dataset.bound = "true";

      btn.addEventListener("click", () => {
        const isLiked = btn.classList.toggle("liked");
        const countSpan = btn.querySelector(".kudos-count");
        let count = parseInt(countSpan.textContent);
        
        if (isLiked) {
          count++;
          countSpan.textContent = count;
          const userStr = btn.closest(".feed-card").querySelector(".feed-user-info strong").textContent;
          showToast("Kudos Given", `You cheered on ${userStr}'s run! 👏`);
        } else {
          count--;
          countSpan.textContent = count;
        }
      });
    });
  }

  // Social Feed: Comments Drawer Interactivity
  function bindCommentDrawerEvents(element) {
    const triggers = element ? element.querySelectorAll(".comment-trigger") : document.querySelectorAll(".comment-trigger");
    triggers.forEach(trigger => {
      if (trigger.dataset.bound === "true") return;
      trigger.dataset.bound = "true";

      trigger.addEventListener("click", () => {
        const targetId = trigger.dataset.targetComments;
        const panel = document.getElementById(targetId);
        if (panel) {
          panel.classList.toggle("active");
        }
      });
    });

    const commentInputs = element ? element.querySelectorAll(".comment-input-wrap button") : document.querySelectorAll(".comment-input-wrap button");
    commentInputs.forEach(btn => {
      if (btn.dataset.bound === "true") return;
      btn.dataset.bound = "true";

      btn.addEventListener("click", () => {
        const inputWrap = btn.closest(".comment-input-wrap");
        const input = inputWrap.querySelector("input");
        const commentText = input.value.trim();
        
        if (commentText === "") return;
        
        const card = btn.closest(".feed-card");
        const commentsList = card.querySelector(".comments-list");
        
        // Append comment DOM element
        const commentDiv = document.createElement("div");
        commentDiv.className = "comment-item";
        commentDiv.innerHTML = `<strong>You (Rahul)</strong><span>${commentText}</span>`;
        commentsList.appendChild(commentDiv);
        
        // Clear input
        input.value = "";
        
        // Update badge count
        const countSpan = card.querySelector(".comments-count");
        let count = parseInt(countSpan.textContent);
        count++;
        countSpan.textContent = count;
        
        // Scroll comments down
        commentsList.scrollTop = commentsList.scrollHeight;
        showToast("Comment Published", "Your comment was posted successfully!");
      });
    });
  }

  // Initial bindings
  bindKudosEvents();
  bindCommentDrawerEvents();

  // Social Feed: Live dynamic Leaflet maps rendering
  function initFeedMaps() {
    // Mike Phelan Nariman map
    const mikeMapEl = document.getElementById("feed-map-mike");
    if (mikeMapEl && !initializedFeedMaps["mike"]) {
      initializedFeedMaps["mike"] = true;
      renderStaticFeedMap(mikeMapEl, routePaths.nariman, "#ea580c");
    }

    // Aisha Khan SGNP map
    const aishaMapEl = document.getElementById("feed-map-aisha");
    if (aishaMapEl && !initializedFeedMaps["aisha"]) {
      initializedFeedMaps["aisha"] = true;
      renderStaticFeedMap(aishaMapEl, routePaths.sgnp, "#a855f7");
    }
  }

  function renderStaticFeedMap(hostEl, coordinates, colorHex) {
    if (typeof window.L === "undefined") {
      hostEl.innerHTML = '<div class="map-fallback">Map loading deferred</div>';
      return;
    }

    const feedMap = window.L.map(hostEl, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      dragging: false,
      touchZoom: false
    });

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19
    }).addTo(feedMap);

    const polyline = window.L.polyline(coordinates, {
      color: colorHex,
      weight: 5,
      opacity: 0.9,
      lineCap: "round",
      lineJoin: "round"
    }).addTo(feedMap);

    // Start / End Circles
    window.L.circleMarker(coordinates[0], {
      radius: 4,
      color: "#fff",
      weight: 2,
      fillColor: "#10b981",
      fillOpacity: 1
    }).addTo(feedMap);

    window.L.circleMarker(coordinates[coordinates.length - 1], {
      radius: 5,
      color: "#fff",
      weight: 2,
      fillColor: "#ef4444",
      fillOpacity: 1
    }).addTo(feedMap);

    feedMap.fitBounds(polyline.getBounds(), { padding: [12, 12] });
  }

  // Dashboard Main Leaflet Map Initialization
  function initMainDashboardMap() {
    const mapHost = document.getElementById("recent-run-map");
    if (!mapHost) return;

    if (typeof window.L === "undefined") {
      mapHost.innerHTML = '<div class="map-fallback">Unable to load Leaflet Map. Verify network status.</div>';
      return;
    }

    const firstActivity = activities[0];
    const coords = routePaths[firstActivity.routeKey];

    // Initialize Map Instance
    mainMapInstance = window.L.map(mapHost, {
      zoomControl: true,
      attributionControl: false,
      scrollWheelZoom: false
    });

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19
    }).addTo(mainMapInstance);

    // Draw route path
    mainMapPolyline = window.L.polyline(coords, {
      color: "#ff5722",
      weight: 6,
      opacity: 0.95,
      lineCap: "round",
      lineJoin: "round"
    }).addTo(mainMapInstance);

    // Start point orange marker
    mainMapStartMarker = window.L.circleMarker(coords[0], {
      radius: 6,
      color: "#ffffff",
      weight: 2.5,
      fillColor: "#10b981",
      fillOpacity: 1
    }).addTo(mainMapInstance);

    // End point red marker
    mainMapEndMarker = window.L.circleMarker(coords[coords.length - 1], {
      radius: 8,
      color: "#ffffff",
      weight: 2.5,
      fillColor: "#ef4444",
      fillOpacity: 1
    }).addTo(mainMapInstance);

    mainMapInstance.fitBounds(mainMapPolyline.getBounds(), { padding: [24, 24] });
  }

  // Redraw Main Dashboard Map on Syncing or Logging
  function redrawMainDashboardMap(routeKey, colorHex = "#ff5722") {
    if (!mainMapInstance) return;
    
    const coords = routePaths[routeKey];
    if (!coords) return;

    // Remove old polylines and markers
    if (mainMapPolyline) mainMapInstance.removeLayer(mainMapPolyline);
    if (mainMapStartMarker) mainMapInstance.removeLayer(mainMapStartMarker);
    if (mainMapEndMarker) mainMapInstance.removeLayer(mainMapEndMarker);

    // Draw new
    mainMapPolyline = window.L.polyline(coords, {
      color: colorHex,
      weight: 6,
      opacity: 0.95,
      lineCap: "round",
      lineJoin: "round"
    }).addTo(mainMapInstance);

    mainMapStartMarker = window.L.circleMarker(coords[0], {
      radius: 6,
      color: "#ffffff",
      weight: 2.5,
      fillColor: "#10b981",
      fillOpacity: 1
    }).addTo(mainMapInstance);

    mainMapEndMarker = window.L.circleMarker(coords[coords.length - 1], {
      radius: 8,
      color: "#ffffff",
      weight: 2.5,
      fillColor: "#ef4444",
      fillOpacity: 1
    }).addTo(mainMapInstance);

    mainMapInstance.fitBounds(mainMapPolyline.getBounds(), { padding: [24, 24] });
  }

  // Render recent activity stats and pacing splits in dashboard
  function updateDashboardView(activity) {
    recentRunTitle.textContent = activity.title;
    recentRunSubtitle.textContent = activity.subtitle;
    recentRunSurface.textContent = activity.surface;
    recentRunTime.textContent = activity.startTime;
    recentRunDistance.textContent = `${activity.distance.toFixed(1)} km`;
    recentRunDuration.textContent = activity.duration;
    recentRunPace.textContent = activity.pace;
    recentRunElevation.textContent = `${activity.elevation} m`;
    recentRunNote.textContent = activity.note;

    // Update splits table
    pacingSplitBody.innerHTML = activity.splits.map(split => `
      <tr>
        <td><strong>${split.km}</strong></td>
        <td>${split.pace}</td>
        <td style="color: ${split.isLead ? "var(--secondary)" : "var(--primary)"};">${split.variance}</td>
        <td>
          <div class="split-bar-container">
            <div class="split-bar-fill" style="width: ${split.effort}%; background: ${split.isLead ? "var(--secondary)" : "var(--primary)"};"></div>
          </div>
        </td>
      </tr>
    `).join("");
  }

  // Activity Upload Form: client validation and warning
  activityUploaderForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("upload-title").value.trim();
    const distanceVal = parseFloat(document.getElementById("upload-distance").value);
    const durationStr = document.getElementById("upload-duration").value.trim();
    const surface = document.getElementById("upload-surface").value;
    const routeKey = document.getElementById("upload-route").value;

    // Duration formatting validator (HH:MM:SS)
    const durationParts = durationStr.split(":");
    if (durationParts.length !== 3 || durationParts.some(part => isNaN(part))) {
      showToast("Format Error", "Duration must be formatted as HH:MM:SS (e.g. 00:30:00)", true);
      return;
    }

    const hours = parseInt(durationParts[0]);
    const minutes = parseInt(durationParts[1]);
    const seconds = parseInt(durationParts[2]);
    const totalHours = hours + (minutes / 60) + (seconds / 3600);

    // Calculate Speed to check for anomalies
    const speedKmh = distanceVal / totalHours;

    // Strava-like pace validation: speed > 50km/h is superhuman/impossible (equivalent to 1:12 min/km pace)
    if (speedKmh > 50) {
      showToast(
        "Upload Intercepted", 
        `Anomaly Warning: Impossible speed of ${speedKmh.toFixed(1)} km/h. Please adjust duration/distance values! ⚠️`, 
        true
      );
      return;
    }

    // Success Logging
    const calculatedPaceMinPerKm = (totalHours * 60) / distanceVal;
    const paceMinutes = Math.floor(calculatedPaceMinPerKm);
    const paceSeconds = Math.round((calculatedPaceMinPerKm - paceMinutes) * 60);
    const paceStr = `${paceMinutes.toString().padStart(2, '0')}:${paceSeconds.toString().padStart(2, '0')} /km`;

    // Mock splits list generator
    const calculatedSplits = [];
    const splitCount = Math.ceil(distanceVal);
    for (let i = 1; i <= Math.min(splitCount, 6); i++) {
      const devSecs = Math.floor(Math.random() * 20) - 10; // -10 to +10 secs deviation
      const isLead = devSecs < 0;
      const devStr = isLead ? `-${Math.abs(devSecs)}s` : `+${devSecs}s`;
      const splitEffort = Math.floor(Math.random() * 30) + 55; // 55% - 85% effort bar
      calculatedSplits.push({
        km: i,
        pace: `${paceMinutes.toString().padStart(2, '0')}:${(Math.max(0, Math.min(59, paceSeconds + devSecs))).toString().padStart(2, '0')} /km`,
        variance: devStr,
        effort: splitEffort,
        isLead: isLead
      });
    }

    const newActivity = {
      id: `manual-${Date.now()}`,
      title: title,
      subtitle: `Recorded manually • Nariman Point Loop, Mumbai`,
      surface: surface,
      startTime: "5:45 PM start",
      distance: distanceVal,
      duration: durationStr,
      pace: paceStr,
      elevation: Math.floor(Math.random() * 80) + 15,
      note: "Manual activity upload successfully synced with RunZap verification metrics.",
      routeKey: routeKey,
      splits: calculatedSplits
    };

    // Update Dashboard & Map
    activities.unshift(newActivity);
    updateDashboardView(newActivity);
    redrawMainDashboardMap(routeKey, "#ff5722");

    // Add activity to social feed reactively!
    appendActivityToFeed(newActivity);

    // Update stats variables
    currentWeeklyDistance += distanceVal;
    currentShoeMileage += distanceVal;

    // Redraw UI Metric odometers
    shoeOdometerBar.style.width = `${(currentShoeMileage / 650 * 100).toFixed(1)}%`;
    shoeOdometerMiles.textContent = `${currentShoeMileage.toFixed(1)} km logged`;
    
    const combinedChallengeDistance = 19.0 + distanceVal;
    activeChallengeDistance.textContent = `${combinedChallengeDistance.toFixed(1)} / 100 km`;
    completionRateText.textContent = `${Math.round(combinedChallengeDistance)}%`;
    
    leaderUserDistance.textContent = `${currentWeeklyDistance.toFixed(1)} km this week`;
    profileTotalDistance.textContent = `${(1284 + distanceVal).toFixed(0)} km`;
    profileStartsText.textContent = "149";

    // Re-evaluate weekly rank standings
    if (currentWeeklyDistance > 38.2) {
      weeklyRankText.textContent = "2nd";
      leaderRowUser.querySelector(".leader-rank").textContent = "02";
      leaderRowUser.querySelector(".leader-gap").textContent = "Near";
    }

    // Reset Form and Navigate
    activityUploaderForm.reset();
    showToast("Activity Posted", "Manual run verified & added to community feed!");
    navigateToView("view-home");
  });

  // Dynamically append new uploaded run into social stream
  function appendActivityToFeed(activity) {
    const feedContainer = document.getElementById("social-feed-container");
    if (!feedContainer) return;

    const newCard = document.createElement("article");
    newCard.className = "glass-card feed-card";
    const uniqueMapId = `feed-map-${activity.id}`;

    newCard.innerHTML = `
      <div class="feed-card-header">
        <div class="feed-avatar">
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" alt="Avatar">
        </div>
        <div class="feed-user-info">
          <strong>Rahul Sharma</strong>
          <span>Just now • RunZap Verified Log</span>
        </div>
      </div>
      <div class="feed-card-body">
        <p class="feed-card-copy">${activity.note}</p>
        <div class="feed-run-grid">
          <div class="feed-run-map" id="${uniqueMapId}"></div>
          <div class="feed-run-stats-bar">
            <div class="feed-stat-box">
              <span>Distance</span>
              <strong>${activity.distance.toFixed(1)} km</strong>
            </div>
            <div class="feed-stat-box">
              <span>Avg Pace</span>
              <strong>${activity.pace}</strong>
            </div>
            <div class="feed-stat-box">
              <span>Moving Time</span>
              <strong>${activity.duration}</strong>
            </div>
          </div>
        </div>
      </div>
      <div class="feed-actions">
        <button class="kudos-btn" type="button" data-post-id="${activity.id}">
          <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          <span>Kudos (<span class="kudos-count">0</span>)</span>
        </button>
        <button class="comment-trigger" type="button" data-target-comments="comments-${activity.id}">
          <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm0 4h8v2H6v-2zm0-8h12v2H6V5z"/></svg>
          <span>Comments (<span class="comments-count">0</span>)</span>
        </button>
      </div>
      <div class="feed-comments-panel" id="comments-${activity.id}">
        <div class="comments-list"></div>
        <div class="comment-input-wrap">
          <input type="text" placeholder="Add a comment..." aria-label="Type comment">
          <button type="button">Post</button>
        </div>
      </div>
    `;

    // Insert at the beginning of the feed list
    feedContainer.insertBefore(newCard, feedContainer.firstChild);

    // Bind event handlers to new elements
    bindKudosEvents(newCard);
    bindCommentDrawerEvents(newCard);

    // Render Static Map for new activity
    setTimeout(() => {
      renderStaticFeedMap(document.getElementById(uniqueMapId), routePaths[activity.routeKey], "#ff5722");
    }, 100);
  }

  // Groups & Clubs: Dynamic Club creation
  groupCreatorForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const cName = document.getElementById("club-name").value.trim();
    const cLoc = document.getElementById("club-location").value.trim();
    const cStyle = document.getElementById("club-style").value;
    const cDesc = document.getElementById("club-desc").value.trim();

    const randomBanners = [
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
    ];
    const bannerUrl = randomBanners[Math.floor(Math.random() * randomBanners.length)];

    const clubContainer = document.getElementById("clubs-list-container");
    if (!clubContainer) return;

    const newClubCard = document.createElement("article");
    newClubCard.className = "club-card glass-card";
    newClubCard.innerHTML = `
      <div class="club-media" style="background-image: url('${bannerUrl}');"></div>
      <div class="club-body">
        <h3>${cName}</h3>
        <p class="club-meta-desc">${cLoc} • ${cStyle}<br>${cDesc}</p>
        <div class="club-footer-stats">
          <span class="club-member-count">1 Member</span>
          <button class="ghost-action join-club-btn" data-club="${Date.now()}" style="padding: 6px 12px; font-size: 0.8rem;" type="button">Join</button>
        </div>
      </div>
    `;

    clubContainer.appendChild(newClubCard);

    // Bind Join Listener to new club
    const joinBtn = newClubCard.querySelector(".join-club-btn");
    bindClubJoinToggle(joinBtn);

    groupCreatorForm.reset();
    showToast("Club Assembled", `"${cName}" has been added to your local groups list! 👥`);
  });

  // Dynamic join club toggle handler
  function bindClubJoinToggle(btn) {
    btn.addEventListener("click", () => {
      const isJoined = btn.classList.toggle("solid-action");
      btn.classList.toggle("ghost-action");
      
      const countEl = btn.closest(".club-footer-stats").querySelector(".club-member-count");
      let members = parseInt(countEl.textContent);

      if (isJoined) {
        btn.textContent = "Joined";
        members++;
        countEl.textContent = `${members} Members`;
        showToast("Club Joined", "You are now a verified member of this community!");
      } else {
        btn.textContent = "Join";
        members--;
        countEl.textContent = `${members} Members`;
      }
    });
  }

  document.querySelectorAll(".join-club-btn").forEach(btn => {
    bindClubJoinToggle(btn);
  });

  // Groups & Clubs: "Count Me In" Scheduled Group Runs Signup
  document.querySelectorAll(".join-group-run-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const isJoined = btn.classList.toggle("secondary");
      const runId = btn.dataset.runId;
      const countSpan = document.getElementById(`grouprun-count-${runId}`);
      let runnerCount = parseInt(countSpan.textContent);

      const avatarPile = btn.closest(".group-run-card").querySelector(".avatar-pile");

      if (isJoined) {
        btn.textContent = "You're In! 🎉";
        btn.style.background = "var(--secondary)";
        btn.style.borderColor = "var(--secondary)";
        btn.style.color = "#000";
        runnerCount++;
        countSpan.textContent = `${runnerCount} runners participating`;

        // Add my avatar to the pile
        const myAvatar = document.createElement("img");
        myAvatar.className = "avatar-pile-img user-joined-avatar";
        myAvatar.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";
        myAvatar.alt = "Your avatar";
        avatarPile.appendChild(myAvatar);
        
        showToast("Scheduled Meetup Joined", "Awesome! RunZap will remind you 30m before kickoff.");
      } else {
        btn.textContent = "Count Me In!";
        btn.style.background = "var(--primary)";
        btn.style.borderColor = "var(--primary)";
        btn.style.color = "#fff";
        runnerCount--;
        countSpan.textContent = `${runnerCount} runners participating`;

        // Remove my avatar
        const myAv = avatarPile.querySelector(".user-joined-avatar");
        if (myAv) myAv.remove();
      }
    });
  });

  // Wearable Sync Portal: Modal display trigger
  syncQuickBtn.addEventListener("click", () => {
    wearableSyncModal.classList.add("active");
    wearableSyncModal.setAttribute("aria-hidden", "false");
  });

  closeSyncModalBtn.addEventListener("click", () => {
    wearableSyncModal.classList.remove("active");
    wearableSyncModal.setAttribute("aria-hidden", "true");
    syncProgressBarWrap.classList.remove("active");
    syncProgressFill.style.width = "0%";
  });

  // Wearable Sync: Provider card connection toggles
  providerCards.forEach(card => {
    card.addEventListener("click", () => {
      const provider = card.dataset.provider;
      const statusText = document.getElementById(`status-text-${provider}`);
      
      const isConnected = card.classList.toggle("connected");
      
      if (isConnected) {
        statusText.textContent = "Connected";
        statusText.style.color = "var(--secondary)";
        showToast("Service Connected", `${provider.toUpperCase()} sync successfully authorized!`);
      } else {
        statusText.textContent = "Disconnected";
        statusText.style.color = "var(--text-muted)";
      }
    });
  });

  // Wearable Sync: Simulated Connection process and dynamic loading
  triggerSyncProcedureBtn.addEventListener("click", () => {
    const isGarminActive = document.getElementById("provider-garmin").classList.contains("connected");
    const isStravaActive = document.getElementById("provider-strava").classList.contains("connected");

    if (!isGarminActive && !isStravaActive) {
      showToast("Sync Error", "Please connect at least one wearable sync provider first!", true);
      return;
    }

    // Initialize progress animations
    syncProgressBarWrap.classList.add("active");
    triggerSyncProcedureBtn.disabled = true;

    let progress = 0;
    const syncStages = [
      { prg: 20, status: "Handshaking with Garmin OAuth..." },
      { prg: 45, status: "Reading active activity FIT files..." },
      { prg: 70, status: "Analyzing Sea Link Promenade Splits..." },
      { prg: 90, status: "Re-rendering visual route mapping..." },
      { prg: 100, status: "Sync successful! Ready." }
    ];

    const syncInterval = setInterval(() => {
      progress += 2;
      syncProgressFill.style.width = `${progress}%`;
      syncProgressPercent.textContent = `${progress}%`;

      const activeStage = syncStages.find(stage => progress <= stage.prg);
      if (activeStage) {
        syncProgressStatus.textContent = activeStage.status;
      }

      if (progress >= 100) {
        clearInterval(syncInterval);
        
        // Execute sync callback additions
        executeWearableImport();
      }
    }, 50);
  });

  function executeWearableImport() {
    // 1. Setup imported activity values
    const importedActivity = {
      id: "garmin-imported-1",
      title: "Bandra Sea Link sunset run",
      subtitle: "Imported from Garmin Connect • Bandra West, Mumbai",
      surface: "Road",
      startTime: "5:30 PM start",
      distance: 10.2,
      duration: "00:54:12",
      pace: "05:18 /km",
      elevation: 45,
      note: "Windy coastal run. Cadence locked in at 180bpm, final 2km negatives splits felt controlled.",
      routeKey: "sealink",
      splits: [
        { km: 1, pace: "05:28 /km", variance: "+0:10", effort: 75, isLead: false },
        { km: 2, pace: "05:12 /km", variance: "-0:06", effort: 58, isLead: true },
        { km: 3, pace: "05:18 /km", variance: "0:00", effort: 65, isLead: false },
        { km: 4, pace: "05:08 /km", variance: "-0:10", effort: 52, isLead: true },
        { km: 5, pace: "05:02 /km", variance: "-0:16", effort: 45, isLead: true }
      ]
    };

    // 2. Inject activity to database
    activities.unshift(importedActivity);
    updateDashboardView(importedActivity);
    redrawMainDashboardMap("sealink", "#00f2fe"); // Teal route for Garmin!

    // 3. Append to Social Feed
    appendActivityToFeed(importedActivity);

    // 4. Update Stats odometers
    currentWeeklyDistance += 10.2;
    currentShoeMileage += 10.2;

    shoeOdometerBar.style.width = `${(currentShoeMileage / 650 * 100).toFixed(1)}%`;
    shoeOdometerMiles.textContent = `${currentShoeMileage.toFixed(1)} km logged`;
    
    const combinedChallengeDistance = 19.0 + 10.2;
    activeChallengeDistance.textContent = `${combinedChallengeDistance.toFixed(1)} / 100 km`;
    completionRateText.textContent = `${Math.round(combinedChallengeDistance)}%`;
    
    leaderUserDistance.textContent = `${currentWeeklyDistance.toFixed(1)} km this week`;
    profileTotalDistance.textContent = `${(1284 + 10.2).toFixed(0)} km`;
    profileStartsText.textContent = "149";

    if (currentWeeklyDistance > 38.2) {
      weeklyRankText.textContent = "2nd";
      leaderRowUser.querySelector(".leader-rank").textContent = "02";
      leaderRowUser.querySelector(".leader-gap").textContent = "Near";
    }

    // 5. Close modal & reset progress elements
    setTimeout(() => {
      wearableSyncModal.classList.remove("active");
      wearableSyncModal.setAttribute("aria-hidden", "true");
      syncProgressBarWrap.classList.remove("active");
      syncProgressFill.style.width = "0%";
      triggerSyncProcedureBtn.disabled = false;

      showToast("Activity Synced", "Imported: Bandra Sea Link Sunset Run (10.2 km)! ⌚");
      navigateToView("view-home");
    }, 800);
  }

  // Certificate / Trophy Modals Management
  function triggerCertificateDisplay(title, desc) {
    document.getElementById("cert-challenge-title").textContent = title;
    document.getElementById("cert-challenge-desc").textContent = desc;
    certificatePreviewModal.classList.add("active");
    certificatePreviewModal.setAttribute("aria-hidden", "false");
  }

  badgeViewTriggerLeopard.addEventListener("click", () => {
    triggerCertificateDisplay(
      "Leopard Trail block",
      "For successfully logging 100km cumulative distance over trail pathways inside the Sanjay Gandhi National Park, Mumbai within the 14-day training timeline."
    );
  });

  closeCertModalBtn.addEventListener("click", () => {
    certificatePreviewModal.classList.remove("active");
    certificatePreviewModal.setAttribute("aria-hidden", "true");
  });

  // Simulated PDF Downloader trigger
  exportCertPdfBtn.addEventListener("click", () => {
    showToast("PDF Exporting", "Generating high-resolution SVG canvas document...");
    exportCertPdfBtn.disabled = true;
    exportCertPdfBtn.textContent = "Generating...";
    
    setTimeout(() => {
      showToast("Download Triggered", "RunZap_Completion_Award.pdf downloaded successfully! 🏆");
      exportCertPdfBtn.disabled = false;
      exportCertPdfBtn.textContent = "Download PDF";
      certificatePreviewModal.classList.remove("active");
    }, 1800);
  });

  // Trophies hovers and clicks
  badgeCards.forEach(badge => {
    badge.addEventListener("click", () => {
      const bTitle = badge.querySelector("strong").textContent;
      let bDesc = "";
      if (bTitle.includes("First Light")) bDesc = "Logged a running start prior to 6:00 AM three times in a single week.";
      if (bTitle.includes("Hill Steady")) bDesc = "Completed elevation segments totaling over 500 meters in vertical climb.";
      if (bTitle.includes("14d Lock-in")) bDesc = "Maintain active daily streaks for 14 consecutive training days.";

      triggerCertificateDisplay(bTitle, bDesc);
    });
  });

  // Chronological event journal timelining loading
  function buildNotesTimeline() {
    notesStoryList.innerHTML = challengeJournal
      .map((entry, index) => `
        <article class="story-note${index === activeJournalIndex ? " active" : ""}" data-story-index="${index}" style="padding: 14px 18px; border: 1px solid var(--border-glass); border-radius: var(--radius-md); background: var(--bg-surface-solid); margin-bottom: 12px; cursor: pointer; transition: all 0.2s;">
          <strong style="display: block; color: var(--text-main); font-size: 0.95rem;">Day ${entry.day}: ${entry.title}</strong>
          <span style="font-size: 0.85rem; color: var(--text-muted); display: block; margin-top: 4px;">${entry.note}</span>
        </article>
      `)
      .join("");
  }

  function renderNotes(index) {
    const entry = challengeJournal[index];
    if (!entry) return;

    dayNoteTitle.textContent = `Day ${entry.day} Note`;
    dayNoteBody.textContent = entry.note;
    dayNoteTag.textContent = entry.title;
    
    notesFocusTitle.textContent = entry.title;
    notesFocusCopy.textContent = entry.note;

    notesStoryList.querySelectorAll(".story-note").forEach((note, noteIndex) => {
      note.classList.toggle("active", noteIndex === index);
      // active item highlights
      if (noteIndex === index) {
        note.style.borderColor = "var(--primary)";
        note.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
      } else {
        note.style.borderColor = "var(--border-glass)";
        note.style.boxShadow = "none";
      }
    });
  }

  notesStoryList.addEventListener("click", (event) => {
    const note = event.target.closest("[data-story-index]");
    if (!note) return;

    activeJournalIndex = Number(note.dataset.storyIndex);
    renderNotes(activeJournalIndex);
  });

  // Initialization Pipelines
  buildNotesTimeline();
  renderNotes(activeJournalIndex);
  updateDashboardView(activities[0]);
  
  // Leaflet Map async init
  setTimeout(initMainDashboardMap, 600);
  
  // Dismiss loading logo screen
  setTimeout(dismissSplash, 1200);
});
