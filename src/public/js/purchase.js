const buyButton = document.getElementById("buyButton");

buyButton.addEventListener("click", async () => {
    try {
        evt.preventDefault();
        const response = await fetch('/api/carts/:cid/purchase', {
            method: 'GET',
        });

        if (response.status === 200) {
            Swal.fire({
                icon: 'Purchase success',
                title: response.statusText,
                showConfirmButton: false,
            });

            setTimeout(function () {
                window.location.reload(); 
            }, 1300);
        } 
        if (response.status === 400) {
            Swal.fire({
                icon: 'error',
                title: response.statusText,
                showConfirmButton: false,
            });

            setTimeout(function () {
                window.location.reload(); 
            }, 1300);
        } 
    } catch (error) {
        console.error(error);
    }
});
