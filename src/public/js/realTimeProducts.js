const socketClient = io();


socketClient.on("serverProducts", (products) => {
    console.log("Estos son los products que legan a js",products);
    updateProducts(products);
});
function updateProducts(products) {
    let productsUl = document.getElementById("productsUl");
    let allProducts = "";

    products.forEach((product) => {
        allProducts += `
            <li><strong>Title:</strong> ${product.title}<br>
            <strong>Description:</strong> ${product.description}<br>
            <strong>Category:</strong> ${product.category}<br>
            <strong>Price:</strong> ${product.price}<br>
            <strong>Thumbnail:</strong> ${product.thumbnail}<br>
            <strong>Code:</strong> ${product.code}<br>
            <strong>Stock:</strong> ${product.stock}</li>
            `;
    });
    
    productsUl.innerHTML = allProducts;
}

const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    errorMessage.innerHTML = "";

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const code = document.getElementById("code").value;
    const price = document.getElementById("price").value;
    const stock = document.getElementById("stock").value;
    const thumbnail = document.getElementById("thumbnail").value;



    socketClient.emit("client:AddProduct", { title, description, category, code, price, stock, thumbnail });

    form.title.value = "";
    form.description.value = "";
    form.category.value = "";
    form.code.value = "";
    form.price.value = "";
    form.stock.value = "";
    form.thumbnail.value = "";

    form.title.focus();
});

const deleteForm = document.getElementById("deleteForm");
deleteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Submit delete product");
    socketClient.on("server:ProductDeletedMessage", (deleteResult) => {
        errorMessageDelete.innerHTML = deleteResult.message;
    })
    function changeErrorMessage(deleteResult) {
            errorMessageDelete.innerHTML = deleteResult.message;
    }
    submitDelete.addEventListener("click", changeErrorMessage);
    const id = document.getElementById("id").value;
    socketClient.emit("client:DeleteProduct", id);
    deleteForm.id.value = "";
});

socketClient.on("server:ProductDeleted", (deleteResult) => {
    let allProducts = "";
    deleteResult.forEach((product) => {
        allProducts += `
            <li><strong>Title:</strong> ${product.title}<br>
            <strong>Description:</strong> ${product.description}<br>
            <strong>Category:</strong> ${product.category}<br>
            <strong>Price:</strong> ${product.price}<br>
            <strong>Thumbnail:</strong> ${product.thumbnail}<br>
            <strong>Code:</strong> ${product.code}<br>
            <strong>Stock:</strong> ${product.stock}</li>
            `;
    });

    productsUl.innerHTML = allProducts;
});