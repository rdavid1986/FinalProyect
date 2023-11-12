const deleteCart = document.getElementById('delete_cart');
/* const buyButton = document.getElementById('buyButton'); */
const cid = deleteCart.getAttribute('data-cid');
console.log("cid",cid)

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
/* buyButton.addEventListener('click', async (evt)=> {
   evt.preventDefault()
   window.location.reload();
}) */