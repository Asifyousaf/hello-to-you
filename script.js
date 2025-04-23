
// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  
  // Scroll effect for header
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
      header.classList.remove('not-scrolled');
    } else {
      header.classList.remove('scrolled');
      header.classList.add('not-scrolled');
    }
  };

  // Initialize header state
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Set initial state

  // Mobile menu toggle (you can expand this functionality)
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  mobileMenuButton.addEventListener('click', () => {
    alert('Mobile menu functionality would go here');
    // In a real implementation, you'd toggle a mobile menu here
  });

  // Make feature cards interactive
  const featureCards = document.querySelectorAll('.bg-emerald-400, .bg-blue-400, .bg-purple-400');
  featureCards.forEach(card => {
    card.addEventListener('click', () => {
      // Add a subtle animation when clicked
      card.style.transform = 'scale(0.98)';
      setTimeout(() => {
        card.style.transform = '';
      }, 200);
    });
  });

  // Make the dashboard widgets interactive (for demo purposes)
  const widgets = document.querySelectorAll('.rounded-lg.shadow-md');
  widgets.forEach(widget => {
    widget.addEventListener('click', function() {
      // Simple highlight effect
      const originalBackground = this.style.backgroundColor;
      this.style.backgroundColor = '#f0f9ff'; // Light blue highlight
      setTimeout(() => {
        this.style.backgroundColor = originalBackground;
      }, 300);
    });
  });

  // Chat button functionality
  const chatButton = document.querySelector('.fixed.bottom-6.right-6 button');
  chatButton.addEventListener('click', () => {
    alert('Chat support would open here');
    // In a real implementation, you'd open a chat window/widget
  });
});
