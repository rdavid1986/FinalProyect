const getUserForm = document.getElementById('getUserForm');
getUserForm.addEventListener('submit', async (evt) => {
    evt.preventDefault(); 
    const userEmail = document.getElementById('userEmail').value;
    console.log(userEmail);
    try {
        const response = await fetch('/api/users/getuser', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userEmail: userEmail }),
        });
        if (response.ok) {
            const data = await response.json();
            const userInfoContainer = document.getElementById('userInfoContainer');
            userInfoContainer.innerHTML = ''; 
            
            const firstNameElement = document.createElement('p');
            firstNameElement.textContent = `First Name: ${data.first_name}`;
            userInfoContainer.appendChild(firstNameElement);
            
            const lastNameElement = document.createElement('p');
            lastNameElement.textContent = `Last Name: ${data.last_name}`;
            userInfoContainer.appendChild(lastNameElement);
            
            const emailDisplayElement = document.createElement('p');
            emailDisplayElement.textContent = `Email: ${data.email}`;
            userInfoContainer.appendChild(emailDisplayElement);
            
            const roleElement = document.createElement('p');
            roleElement.textContent = `Role: ${data.role}`;
            userInfoContainer.appendChild(roleElement);
            
        } else {
            const error = document.createElement('p');
            error.textContent = `error: The user doesnt exist`;
            userInfoContainer.innerHTML = ''; 
            userInfoContainer.appendChild(error);
            console.error('Server error:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error during fetch:', error);
    }
});
const changeRoleForm = document.getElementById('changeRoleForm');
changeRoleForm.addEventListener('submit', async (evt) => {
    evt.preventDefault(); 
    const userEmailRole = document.getElementById('userEmailRole').value;
    try {
        const response = await fetch('/api/users/changeRole', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify( { userEmailRole: userEmailRole } ),
        });

        if (response.ok) {
            const data = await response.json(); 
            Swal.fire({
                icon: 'success',
                title: data.message,
                showConfirmButton: false,
            });
        } else {
            console.error('Server error:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error during fetch:', error);
    }
});
const deleteUserForm = document.getElementById('deleteUserForm');

deleteUserForm.addEventListener('submit', async (evt) => {
    evt.preventDefault(); 
    const deleteUserEmail = document.getElementById('deleteUserEmail').value;

    try {
        const response = await fetch('/api/users/deleteuser', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify( { deleteUserEmail: deleteUserEmail } ),
        });

        if (response.ok) {
            const data = await response.json();
            Swal.fire({
                icon: 'success',
                title: data.message,
                showConfirmButton: false,
            });
        } else {
            console.error('Server error:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error during fetch:', error);
    }
});
