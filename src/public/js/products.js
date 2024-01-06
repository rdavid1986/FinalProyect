
const addButtons = document.querySelectorAll('.addButton');

document.addEventListener('DOMContentLoaded', function () {
    addButtons.forEach(addButton => {
        addButton.addEventListener('click', async function (event) {
            event.preventDefault();
            const cid = addButton.getAttribute('data-cid');
            const pid = addButton.getAttribute('data-pid');

            console.log("Datos del botón - CID:", cid);
            console.log("Datos del botón - PID:", pid);

            fetch(`/api/carts/${cid}/product/${pid}`, {
                method: 'POST'
            }).then(async (response) => {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    if (response.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: data.message,
                            showConfirmButton: false,
                        })
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error adding product to cart',
                            text: data.message,
                        });
                    }
                } else {
                    console.error('La respuesta no es JSON');
                    Swal.fire({
                        icon: 'error',
                        title: 'Error adding product to cart',
                        text: "You are not allowed to access this",
                    });
                }
            });
        });
    });
});
