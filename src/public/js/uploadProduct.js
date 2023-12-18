document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("uploadProductForm");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const userId = form.dataset.userId;

        try {
            const response = await fetch(`/api/users/${userId}/product`, {
                method: 'POST',
                body: formData,  // No es necesario especificar el tipo de contenido
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Product uploaded successfully',
                    showConfirmButton: false,
                });
                console.log("Product submitted successfully.");
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong, product upload failed',
                });
                console.error("Error sending product:", response.statusText);
            }
        } catch (error) {
            console.error("Error: ", error);
        }
    });
});
