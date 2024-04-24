document.addEventListener("DOMContentLoaded", async function() {
    const productsContainer = document.getElementById('products-container');
    const cartButton = document.getElementById('cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalContainer = document.getElementById('total');

    let cart = [];

    // Obtener datos de productos usando Fetch
    async function getProducts() {
        try {
            const response = await fetch('products.json');
            if (!response.ok) {
                throw new Error('Error al obtener los productos');
            }
            return await response.json();
        } catch (error) {
            throw new Error('Error de red');
        }
    }

    // Mostrar productos en la interfaz
    function displayProducts(products) {
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product');
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Precio: $${product.price}</p>
                <button class="add-to-cart" data-id="${product.id}">Agregar al carrito</button>
            `;
            productsContainer.appendChild(productCard);
        });
    }

    // Mostrar productos en el carrito
    function displayCartItems() {
        cartItemsContainer.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('carritoCompras')
            cartItem.innerHTML = `
                <p>${item.name} - $${item.price}</p>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        calculateTotal();
    }

    // Calcular el total a pagar
    function calculateTotal() {
        const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);
        totalContainer.textContent = `Total a pagar: $${totalPrice}`;
    }

    // Mostrar notificación de producto agregado al carrito
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.classList.add('notification', 'notification-blue');
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Manejar clic en el botón de carrito
    cartButton.addEventListener('click', function() {
        displayCartItems();
    });

    // Manejar clic en botón "Agregar al carrito"
    productsContainer.addEventListener('click', async function(event) {
        if (event.target.classList.contains('add-to-cart')) {
            const productId = parseInt(event.target.getAttribute('data-id'));
            const product = await getProductById(productId);
            if (product) {
                cart.push(product);
                showNotification('Producto agregado al carrito');
            }
        }
    });

    // Obtener producto por ID
    async function getProductById(productId) {
        try {
            const products = await getProducts();
            return products.find(product => product.id === productId);
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    // Iniciar la aplicación
    try {
        const products = await getProducts();
        displayProducts(products);
    } catch (error) {
        console.error(error.message);
    }
});
