const buyButton = document.getElementById("buyButton");
buyButton.addEventListener("click", async () => {
    try {
        const response = await fetch('/api/carts/:cid/purchase', {
            method: 'GET',
        });
        if (response.status === 200) {
            Swal.fire({
                icon: 'success',
                title: 'Purchase Completed',
                showConfirmButton: false,
            })
            setTimeout(function () {
                window.location.reload();
            }, 1300);
        } 
    } catch (error) {
        console.error(error);
    }
})