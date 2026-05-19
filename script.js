// View switching logic for the bottom navigation
const switchView = (viewId, navElement) => {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
    // Force reflow to restart CSS animation
    void screen.offsetWidth;
  });
  
  // Show target screen
  document.getElementById(viewId).classList.add('active');
  
  // Update nav UI
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  if (navElement) {
    navElement.classList.add('active');
  }
};

// Filter Tabs Logic for Discover Screen
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.filter-tabs .tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Here you would typically filter the list below
      // For demo purposes, we just animate the click
    });
  });
});
