document.getElementById('addToCartBtn').addEventListener('click', function() {
            const quantity = document.getElementById('quantity').value;
            fetch('/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    product_id: '{{ product.id }}',
                    quantity: parseInt(quantity)
                })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
            })
            .catch(error => console.error('Erreur:', error));
        });

        document.getElementById('increaseBtn').addEventListener('click', function() {
            const qty = document.getElementById('quantity');
            qty.value = parseInt(qty.value) + 1;
        });

        document.getElementById('decreaseBtn').addEventListener('click', function() {
            const qty = document.getElementById('quantity');
            if (parseInt(qty.value) > 1) {
                qty.value = parseInt(qty.value) - 1;
            }
        });