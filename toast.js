document.addEventListener("DOMContentLoaded", function () {
    const toast = document.querySelector(".toast"),
          closeIcon = document.querySelector(".toast .close"),
          progress = document.querySelector(".toast .progress"),
          toastTitle = document.querySelector(".toast .text-1"),
          toastMessage = document.querySelector(".toast .text-2");

    if (!toast) {
        console.error("🚨 Toast element not found in DOM! Make sure it exists in login-signup.html.");
        return;
    }

    let timer1, timer2;

    // ✅ Ensure showToast is globally available
    window.showToast = function (message, type = "success") {
        if (!toast) {
            console.error("🚨 Toast element missing!");
            return;
        }

        // Set title and message
        toastMessage.textContent = message;

        if (type === "success") {
            toastTitle.textContent = "Success";
            toast.classList.add("success");
        } else if (type === "error") {
            toastTitle.textContent = "Error";
            toast.classList.add("error");
        }

        // Show toast
        toast.classList.add("active");
        progress.classList.add("active");

        // Auto-hide toast after 5 seconds
        timer1 = setTimeout(() => {
            toast.classList.remove("active");
        }, 5000);

        timer2 = setTimeout(() => {
            progress.classList.remove("active");
        }, 5300);
    };

    // Close button event
    closeIcon.addEventListener("click", () => {
        toast.classList.remove("active");
        clearTimeout(timer1);
        clearTimeout(timer2);
    });

    console.log("✅ Toast system initialized successfully.");
});
