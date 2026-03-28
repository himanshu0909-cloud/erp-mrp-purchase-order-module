const API = "http://127.0.0.1:8000";

let products = [];

// Load vendors and products
async function loadData() {
    try {
        // Load vendors
        let v = await fetch(`${API}/vendors`);
        let vendors = await v.json();

        let vendorSelect = document.getElementById("vendor");
        vendorSelect.innerHTML = `<option value="">Select Vendor</option>`;

        vendors.forEach(vendor => {
            vendorSelect.innerHTML += `
                <option value="${vendor.id}">${vendor.name}</option>
            `;
        });

        // Load products
        let p = await fetch(`${API}/products`);
        products = await p.json();

        console.log("Products:", products);

        // Add first row automatically
        document.querySelector("#itemsTable tbody").innerHTML = "";
        addRow();
    } catch (error) {
        console.error("Error loading data:", error);
        alert("Failed to load vendors/products. Make sure backend is running.");
    }
}

// Remove duplicate product names from dropdown
function getUniqueProducts() {
    const seen = new Set();

    return products.filter(product => {
        if (seen.has(product.name)) {
            return false;
        }
        seen.add(product.name);
        return true;
    });
}

// Add a new product row
function addRow() {
    const uniqueProducts = getUniqueProducts();

    let row = `
    <tr>
        <td>
            <select class="form-control product" onchange="updateTotal()">
                ${uniqueProducts.map(product => `
                    <option value="${product.id}" data-price="${product.price}">
                        ${product.name}
                    </option>
                `).join("")}
            </select>
        </td>
        <td>
            <input type="number" class="form-control qty" value="1" min="1" onchange="updateTotal()">
        </td>
        <td>
            <button class="btn btn-danger" onclick="removeRow(this)">X</button>
        </td>
    </tr>
    `;

    document.querySelector("#itemsTable tbody").innerHTML += row;
    updateTotal();
}

// Remove row
function removeRow(button) {
    button.closest("tr").remove();
    updateTotal();
}

// Update total price
function updateTotal() {
    let rows = document.querySelectorAll("#itemsTable tbody tr");
    let total = 0;

    rows.forEach(row => {
        let product = row.querySelector(".product");
        let qty = parseInt(row.querySelector(".qty").value) || 0;

        let price = parseFloat(product.options[product.selectedIndex].dataset.price) || 0;

        total += price * qty;
    });

    document.getElementById("total").innerText = total.toFixed(2);
}

// Submit order
async function submitOrder() {
    try {
        let vendor_id = document.getElementById("vendor").value;

        if (!vendor_id) {
            alert("Please select a vendor.");
            return;
        }

        let rows = document.querySelectorAll("#itemsTable tbody tr");

        if (rows.length === 0) {
            alert("Please add at least one product.");
            return;
        }

        let items = [];

        rows.forEach(row => {
            items.push({
                product_id: parseInt(row.querySelector(".product").value),
                quantity: parseInt(row.querySelector(".qty").value)
            });
        });

        let response = await fetch(`${API}/create-order`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                vendor_id: parseInt(vendor_id),
                items: items
            })
        });

        if (!response.ok) {
            throw new Error("Order creation failed");
        }

        alert("✅ Order Created Successfully!");

        // Reset form
        document.getElementById("vendor").value = "";
        document.querySelector("#itemsTable tbody").innerHTML = "";
        document.getElementById("total").innerText = "0.00";
        addRow();

    } catch (error) {
        console.error("Error submitting order:", error);
        alert("Failed to create order.");
    }
}

// Load data when page opens
loadData();