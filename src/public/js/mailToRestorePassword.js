const form = document.getElementById("recoverPasswordForm");

form.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    const email = document.getElementById("email").value;
    console.log(email);
    const obj = {
        email: email
    }
    console.log(obj);
    try {
        const response = await fetch("/api/mailToRestorePassword", {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                "content-type": "application/json",
            }
        })
        console.log(response);
        if(response.status === 200) {
            Swal.fire({
                icon: "success",
                title: "Mail send to recover password",
                showConfirmButton: false,
            })
            
        }
    } catch (error) {
        console.log(error);
    }
})