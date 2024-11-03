// Inventory Management Module
class InventoryManager {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('inventoryItems')) || [];
        this.categories = ['Spices', 'Grains', 'Oils', 'Pulses', 'Others'];
        this.init();
    }

    init() {
        this.renderInventory();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Add Item Button
        document.getElementById('addItemBtn').addEventListener('click', () => {
            this.showAddItemModal();
        });

        // Search functionality
        document.getElementById('inventorySearch').addEventListener('input', (e) => {
            this.filterItems(e.target.value);
        });

        // Category filter
        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.filterItems(document.getElementById('inventorySearch').value, e.target.value);
        });
    }

    showAddItemModal() {
        const modal = document.getElementById('addItemModal');
        modal.style.display = 'block';
        
        // Reset form
        document.getElementById('itemForm').reset();
    }

    hideAddItemModal() {
        document.getElementById('addItemModal').style.display = 'none';
    }

    addItem(item) {
        this.items.push({ ...item, id: Date.now() });
        this.saveItems();
        this.renderInventory();
    }

    updateItem(id, updatedItem) {
        this.items = this.items.map(item => 
            item.id === id ? { ...item, ...updatedItem } : item
        );
        this.saveItems();
        this.renderInventory();
    }

    deleteItem(id) {
        if (confirm('Are you sure you want to delete this item?')) {
            this.items = this.items.filter(item => item.id !== id);
            this.saveItems();
            this.renderInventory();
        }
    }

    saveItems() {
        localStorage.setItem('inventoryItems', JSON.stringify(this.items));
    }

    filterItems(searchTerm = '', category = 'all') {
        const filteredItems = this.items.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = category === 'all' || item.category === category;
            return matchesSearch && matchesCategory;
        });

        this.renderInventoryGrid(filteredItems);
    }

    renderInventoryGrid(items = this.items) {
        const grid = document.getElementById('inventoryGrid');
        grid.innerHTML = '';

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'inventory-card';
            card.innerHTML = `
                <div class="inventory-card-header">
                    <h3>${item.name}</h3>
                    <div class="inventory-card-actions">
                        <button onclick="inventoryManager.showEditModal(${item.id})" class="btn-icon">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="inventoryManager.deleteItem(${item.id})" class="btn-icon">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="inventory-card-body">
                    <p><i class="fas fa-tag"></i> ${item.category}</p>
                    <p><i class="fas fa-box"></i> Stock: ${item.stock} ${item.unit}</p>
                    <p><i class="fas fa-rupee-sign"></i> Price: ${item.price}/${item.unit}</p>
                    <p><i class="fas fa-exclamation-circle"></i> Min Stock: ${item.minStock} ${item.unit}</p>
                </div>
                ${item.stock <= item.minStock ? '<div class="low-stock-warning">Low Stock</div>' : ''}
            `;
            grid.appendChild(card);
        });
    }

    showEditModal(id) {
        const item = this.items.find(item => item.id === id);
        if (!item) return;

        const modal = document.getElementById('addItemModal');
        modal.style.display = 'block';

        // Fill form with item data
        const form = document.getElementById('itemForm');
        form.elements['itemName'].value = item.name;
        form.elements['category'].value = item.category;
        form.elements['stock'].value = item.stock;
        form.elements['unit'].value = item.unit;
        form.elements['price'].value = item.price;
        form.elements['minStock'].value = item.minStock;

        // Update form submission handler
        form.onsubmit = (e) => {
            e.preventDefault();
            this.updateItem(id, {
                name: form.elements['itemName'].value,
                category: form.elements['category'].value,
                stock: parseFloat(form.elements['stock'].value),
                unit: form.elements['unit'].value,
                price: parseFloat(form.elements['price'].value),
                minStock: parseFloat(form.elements['minStock'].value)
            });
            this.hideAddItemModal();
        };
    }

    renderInventory() {
        this.renderInventoryGrid();
        this.updateInventoryStats();
    }

    updateInventoryStats() {
        const stats = {
            totalItems: this.items.length,
            lowStock: this.items.filter(item => item.stock <= item.minStock).length,
            totalValue: this.items.reduce((sum, item) => sum + (item.stock * item.price), 0)
        };

        document.getElementById('totalItems').textContent = stats.totalItems;
        document.getElementById('lowStockItems').textContent = stats.lowStock;
        document.getElementById('inventoryValue').textContent = `Rs. ${stats.totalValue.toFixed(2)}`;
    }
}

// Initialize inventory manager
let inventoryManager;
document.addEventListener('DOMContentLoaded', () => {
    inventoryManager = new InventoryManager();
});