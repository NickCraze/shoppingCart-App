// Once the window object has finished loading the jsLoaded function will be executed

window.onload = jsLoaded();

function jsLoaded() {
  // Initialise variables and to use throughout the other functions
  // Use Array.from() to convert NodeList/HTML collection to an array to be able to use array methods such as forEach on it

  const basketContainer = document.querySelector(".basket-container");
  const summaryContainer = document.querySelector(".order-summary");
  const removeBtn = Array.from(document.getElementsByClassName("remove-btn"));
  const productQuantities = Array.from(
    document.getElementsByClassName("quantity")
  );
  const purchaseBtn = document.getElementById("purchase-btn");

  updateSummaryTotals();

  //   Listen for user click event on the remove button and execute function
  removeBtn.forEach((element) => {
    element.addEventListener("click", removeFromCart);
  });

  //   Listen for quantity value change event from user input and execute function
  productQuantities.forEach((product) => {
    product.addEventListener("change", cartQuantityUpdate);
  });

  purchaseBtn.addEventListener("click", purchaseClicked);

  // Because the body has a flex property justify-content and align-items center on it,
  // The removal of the two baskets will perfectly centre the appended div already in the body document.
  function purchaseClicked() {
    summaryContainer.remove();
    basketContainer.remove();
    const purchaseSuccessDiv = document.querySelector(".purchase-success");
    purchaseSuccessDiv.style.display = "block";
  }

  //   Quantity field changed and execute updateSummaryTotals function
  function cartQuantityUpdate(event) {
    let quantity = parseInt(event.target.value);
    updateSummaryTotals();
  }
  // User removed product item from cart, execute updateSummaryTotals function
  function removeFromCart(event) {
    let removeBtnClick = event.target;
    removeBtnClick.parentElement.parentElement.remove();
    updateSummaryTotals();
  }

  // If basket is empty create element and append it to the basket container
  // create styling for cart in css document

  function emptyBasket() {
    let emptyCartMsg = document.createElement("p");
    emptyCartMsg.innerHTML =
      "<h5 class=empty-basket> There are no products in your basket </h5>";
    basketContainer.append(emptyCartMsg);
    purchaseBtn.innerText = "There's nothing to buy";
    purchaseBtn.style.opacity = "0.7";
    purchaseBtn.style.fontSize = "16px";
  }

  // Initialise totals values and

  function updateSummaryTotals() {
    // initialise totals values in order summary table and assign an initial value of 0
    let total = (totalTax = totalShipping = totalSubTotal = 0);

    // grab product items rows
    // convert nodeList of product items to array.
    // Loop through for loop updating cart totals on each iteration
    // Used the dataset attribute to append the amount of Tax for each individual product to the total Tax

    // compare total price excluding tax to requirements to calculate shipping costs using conditional if statements
    // if total cost == 0 execute emptyBasket function
    // convert string type values to numbers using parseInt() or Number() methods
    // round numbers down to two decimal places using the toFixed() method

    let productItems = Array.from(
      document.getElementsByClassName("cart-items")
    );
    for (var i = 0; i < productItems.length; i++) {
      let productItem = productItems[i];
      let productPrice = Number(
        productItem.children[1].children[0].innerHTML.replace("£", "")
      ).toFixed(2);
      let productQuantity =
        productItem.children[0].querySelector(".quantity").value;
      let productTax =
        productItem.children[0].querySelector(".product-name").dataset.tax;
      let productTaxTotal = productQuantity * productPrice * productTax;
      total = total + productPrice * productQuantity;

      totalTax += Number(productTaxTotal);
    }

    // Conditional loop to calculate Shipping price based on requirements
    // if total == 0 execute emptyBasket function
    if (total > 150) {
      totalShipping = 0;
    } else if (total * 0.15 >= 15) {
      totalShipping = (total * 0.15).toFixed(2);
    } else if (total * 0.15 <= 15 && total !== 0) {
      totalShipping = 15;
    } else {
      emptyBasket();
    }

    totalSubTotal = Number(total + totalTax + Number(totalShipping)).toFixed(2);
    let roundedTotal = total.toFixed(2);
    let roundedTotalTax = totalTax.toFixed(2);

    // Append calculated totals to Dom Elements and display them in Order-summary totals
    document.querySelector(".total-items").innerText = "£" + roundedTotal;
    document.querySelector(".total-tax").innerText = "£" + roundedTotalTax;
    document.querySelector(".total-shipping").innerText = "£" + totalShipping;
    document.querySelector(".total-subTotal").innerText = "£" + totalSubTotal;
  }
}
