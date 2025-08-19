document.getElementById('orderForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  if(cart.length === 0){
    alert("Your cart is empty!");
    return;
  }

  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;

  // Save order to backend
  const response = await fetch("http://localhost:5000/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, address, date, time, cart, total })
  });
  const result = await response.json();

  if(result.success){
    alert("Order placed successfully!");
    document.getElementById('confirmation').style.display = "block";
    document.getElementById('custName').textContent = name;
    document.getElementById('deliveryDate').textContent = date;
    document.getElementById('deliveryTime').textContent = time;
    document.getElementById('orderForm').style.display = "none";
  }
});
