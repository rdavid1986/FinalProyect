const deleteCart = document.getElementById('delete_cart');
const delete_product_cart = document.getElementsByClassName('delete_product_cart');
const cid = deleteCart.getAttribute('data-cid');

deleteCart.addEventListener('click', async (evt) => {
    evt.preventDefault();
    try {
        const response = await fetch(`/api/carts/${cid}`, {
            method: 'DELETE',
        });
        console.log(response)
        if (response.status === 200) {
            Swal.fire({
                icon: 'success',
                title: 'Cart is empty now',
                showConfirmButton: false,
            })
            setTimeout(function () {
                window.location.reload();
            }, 1300);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'error to delete cart',
            })
            setTimeout(function () {
                window.location.replace('/');
            }, 1300);
            
            const responseData = await response.json();
            console.error(responseData.error);
        }
    } catch (error) {
        console.error(error);
    }
});
for (const button of delete_product_cart) {
    button.addEventListener('click', async (evt) => {
        evt.preventDefault();
        const pid = button.getAttribute('data-pid');
        try {
            const response = await fetch(`/api/carts/${cid}/products/${pid}`, {
                method: 'DELETE',
            });
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Product delete from cart',
                    showConfirmButton: false,
                })
                setTimeout(function () {
                    window.location.reload();
                }, 1300);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error deleting cart',
                })
                setTimeout(function () {
                    window.location.replace('/');
                }, 1300);
                
                const responseData = await response.json();
                console.error(responseData.error);
            }
        } catch (error) {
            console.error(error);
        }
    });
}
