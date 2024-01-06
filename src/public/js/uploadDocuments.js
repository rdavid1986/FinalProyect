document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("documentsForm");
    const submitButton = document.getElementById("documentation_submit");

    submitButton.addEventListener("click", async function() {
        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: formData
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Load documents successfull',
                    showConfirmButton: false,
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Somthing wrong, uploading documents failed',
                })
                console.error("Error al enviar documentos:", response.statusText);
            }
        } catch (error) {
            console.error("Error de red:", error);
        }
    });
});
