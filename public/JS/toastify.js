function showToast(message, type = "success") {
    Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center`, or `right`
        style: {
            background: type === "success" ? "green" : "red",
        },
    }).showToast();
}

export { showToast };
