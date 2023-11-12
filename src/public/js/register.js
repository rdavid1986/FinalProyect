const form = document.getElementById('registerForm');

form.addEventListener('submit' , async evt => {
    evt.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    const result = await fetch('api/session/register', {
        method:'POST',
        body:JSON.stringify(obj),
        headers: {
            'content-type':'application/json'
        }

    });
    if (result.status === 200) {
        Swal.fire({
            icon: 'success',
            title: 'Register successfull',
            showConfirmButton: false,
        })
        setTimeout(function() {
            window.location.replace('/');
          }, 1300);
    } else if (result.status === 401) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'You must complete all fields',
          })
          const resultData = await result.json();
          console.error(resultData.error);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Email already exist',
              })
            
    }
    console.log(result, "result");
})

