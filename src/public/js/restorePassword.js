const form = document.getElementById("recoverPasswordForm");

form.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    const newPassword = document.getElementById("password").value;
    const passwordRepeat = document.getElementById("passwordRepeat").value;
    const url = window.location.href;
    const urlParts = url.split("/");
    const recoverToken = urlParts[urlParts.length - 1];
    console.log("URL completa:", window.location.href);
    console.log("URl token :", recoverToken);

    const obj = {
        newPassword: newPassword,
        passwordRepeat: passwordRepeat,
    };

    try {
        const response = await fetch(`/api/restorePassword/${recoverToken}`, {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                "content-type": "application/json",
            },
        });

        console.log(response);
        if (response.status === 200){
            Swal.fire({
                icon: "success",
                title: "Password recovery successful",
                showConfirmButton: false,
            });
            setTimeout(function() {
                window.location.replace('http://localhost:8080');
            }, 1500);
        } else if (response.status === 400) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'The password must be different from the previous one',
            });
        } else if (response.status === 401) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'New passwords dont match',
            });
        } else if (response.status === 409) {
            console.log("respuest mensaje", response.message);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'TokenExpiredError: Token has expired',
            });
            setTimeout(function() {
                window.location.replace('http://localhost:8080/mailToRecoverPassword');
            }, 1500);
        }
    } catch (error) {
        console.log(error);
    }
});
