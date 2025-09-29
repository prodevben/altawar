// Products data management and rendering

class ProductManager {
    constructor() {
        this.products = [];
        this.currentFilter = 'all';
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.renderProducts();
        this.initializeFiltering();
    }

    async loadProducts() {
        try {
            const response = await fetch('data/products.json');
            this.products = await response.json();
        } catch (error) {
            console.error('Error loading products:', error);
            // Fallback to empty array if data fails to load
            this.products = [];
        }
    }

    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        productsGrid.innerHTML = '';

        this.products.forEach((product, index) => {
            const productElement = this.createProductElement(product, index);
            productsGrid.appendChild(productElement);
        });

        // Reinitialize animations for new elements
        this.initializeAnimations();
    }

    createProductElement(product, index) {
        const productDiv = document.createElement('div');
        productDiv.className = 'col-lg-4 col-md-6 product-item';
        productDiv.setAttribute('data-category', product.category);
        
        const delay = (index % 3) * 100; // Stagger animations
        
        productDiv.innerHTML = `
            <div class="product-card animate-on-scroll" data-delay="${delay}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}" class="img-fluid">
                    <div class="product-overlay">
                        <button class="btn btn-light product-modal-btn" 
                                data-product-id="${product.id}">
                            View Details
                        </button>
                    </div>
                </div>
                <div class="product-content">
                    <h5>${product.title}</h5>
                    <p>${product.shortDescription}</p>
                    <div class="product-price">${product.price}</div>
                </div>
            </div>
        `;

        return productDiv;
    }

    initializeFiltering() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                this.filterProducts(category);
                
                // Update active button
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
        
        // Initialize modal functionality
        this.initializeModal();
    }
    
    initializeModal() {
        // Use event delegation to handle dynamically created buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('product-modal-btn')) {
                const productId = e.target.dataset.productId;
                const product = this.getProductById(productId);
                
                if (product) {
                    this.showProductModal(product);
                }
            }
        });
    }
    
    showProductModal(product) {
        // Update modal content
        document.getElementById('modalTitle').textContent = product.title;
        document.getElementById('modalImage').src = product.image;
        document.getElementById('modalImage').alt = product.title;
        document.getElementById('modalDescription').textContent = product.description;
        document.getElementById('modalSpecs').textContent = product.specs;
        document.getElementById('modalPrice').textContent = product.price;
        
        // Show the modal
        const modal = new bootstrap.Modal(document.getElementById('productModal'));
        modal.show();
    }

    filterProducts(category) {
        this.currentFilter = category;
        const productItems = document.querySelectorAll('.product-item');
        
        productItems.forEach(item => {
            const itemCategory = item.dataset.category;
            
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    initializeAnimations() {
        const animateElements = document.querySelectorAll('.animate-on-scroll:not(.animated)');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animateElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Method to get products by category (useful for other pages)
    getProductsByCategory(category) {
        if (category === 'all') return this.products;
        return this.products.filter(product => product.category === category);
    }

    // Method to get a single product by ID
    getProductById(id) {
        return this.products.find(product => product.id === id);
    }
}

// Initialize product manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('productsGrid')) {
        window.productManager = new ProductManager();
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductManager;
}