
// Selecciona todos los elementos con la clase .addButton
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
                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Product added succefully',
                        showConfirmButton: false,
                    })
                }
              });
        });
    });
});


