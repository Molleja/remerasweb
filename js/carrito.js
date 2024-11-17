document.addEventListener('DOMContentLoaded', () => { 
    // Manejo del menú hamburguesa
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
  
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    function enviarCorreoDetallesCompra(carrito, total, cliente) {
        let productos = carrito.map(item => `${item.name} x${item.quantity} - $${item.price}`).join('\n');
        let mailOptions = {
            from: 'nicolasblasiakp@gmail.com',
            to: 'nicolasblasiakp@gmail.com', // Coloca aquí el correo destino
            subject: 'Detalles de la Compra',
            text: `Detalles del comprador:\nNombre: ${cliente.nombre}\nCorreo: ${cliente.email}\n\nProductos:\n${productos}\n\nTotal: $${total.toFixed(2)}`
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Correo enviado: ' + info.response);
            }
        });
    }


    // Funcionalidad del carrito
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    let cart = [];

    // Mostrar/ocultar el modal del carrito
    cartIcon.addEventListener('click', () => {
        cartModal.classList.toggle('active');
    });

    // Añadir productos al carrito
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));

            addToCart(id, name, price);
            updateCartUI();
        });
    });

    // Función para añadir productos al carrito
    function addToCart(id, name, price) {
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
    }

    // Actualizar la interfaz del carrito
    function updateCartUI() {
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <span>${item.name} x${item.quantity}</span>
                <span>$${itemTotal.toFixed(2)}</span>
            `;
            cartItems.appendChild(itemElement);
        });

        cartTotal.textContent = total.toFixed(2);
        document.querySelector('.cart-count').textContent = cart.length;
    }

    // Integración de PayPal
    paypal.Buttons({
        createOrder: function(data, actions) {
            // Aquí pasamos el total del carrito a PayPal
            let totalCarrito = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: totalCarrito.toFixed(2) // Total con 2 decimales
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            // Acción cuando la transacción es aprobada
            return actions.order.capture().then(function(details) {
                alert('Pago completado por ' + details.payer.name.given_name);
                cart = []; // Vaciamos el carrito después del pago
                updateCartUI(); // Actualizamos la interfaz del carrito
                cartModal.classList.remove('active');
                 
                // Enviar correo con los detalles de la compra
                enviarCorreoDetallesCompra(cart, total, cliente);
            });
        },
        onError: function(err) {
            console.error('Error en el pago de PayPal:', err);
            alert("Hubo un error con la trasnferencia, contacta a los dueños.")
        }
    }).render('#paypal-button-container'); // Renderizamos el botón de PayPal en el div
});
