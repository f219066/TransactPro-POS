// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize sales chart if element exists
    const salesChartElement = document.getElementById('salesChart');
    if (salesChartElement) {
      const ctx = salesChartElement.getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Monthly Sales',
            data: [12000, 19000, 15000, 25000, 22000, 30000],
            borderColor: '#4CAF50',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Monthly Sales Overview'
            }
          }
        }
      });
    }
  
    // Initialize inventory manager if we're on the inventory page
    const inventorySection = document.getElementById('inventory');
    if (inventorySection) {
      window.inventoryManager = new InventoryManager();
    }
  
    // Initialize other interactive elements
    setupEventListeners();
  });
  
  function setupEventListeners() {
    // Navigation menu toggle
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
          sidebar.classList.toggle('active');
        }
      });
    }
  
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      });
    }
  
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
    }
  }
  
  // Export functionality
  function exportData(type) {
    const data = {
      inventory: window.inventoryManager ? window.inventoryManager.items : [],
      timestamp: new Date().toISOString(),
      type: type
    };
  
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export-${type}-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  // Utility functions
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount);
  }
  
  function formatDate(date) {
    return new Intl.DateTimeFormat('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }