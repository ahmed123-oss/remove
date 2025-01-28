// التحقق من حالة تسجيل الدخول عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function() {
    // التحقق من حالة تسجيل الدخول
    if (localStorage.getItem("isLoggedIn")) {
        // إذا كان المستخدم مسجلاً الدخول، نخفي روابط التسجيل وتسجيل الدخول
        document.querySelector(".nav-links .btn").style.display = "none";  // إخفاء "Log in"
        document.querySelector(".nav-links .primary").style.display = "none";  // إخفاء "Sign up"
        
        // إضافة رابط لتسجيل الخروج
        document.querySelector(".nav-links").innerHTML += '<li><a href="#" onclick="logout()">Log out</a></li>';
    }
});

// دالة لتسجيل الخروج
function logout() {
    localStorage.removeItem("isLoggedIn"); // إزالة حالة تسجيل الدخول
    window.location.reload(); // إعادة تحميل الصفحة لتحديث الحالة
}

// الكود الخاص بتحميل الصورة وإزالة الخلفية
const uploadButton = document.querySelector(".upload-btn");
const apiKey = "dSt9SMUUJBhJre2qh9EzN5iF";

uploadButton.addEventListener("click", async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image_file", file);

        try {
            const response = await fetch("https://api.remove.bg/v1.0/removebg", {
                method: "POST",
                headers: {
                    "X-Api-Key": apiKey
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const blob = await response.blob();
            const processedImageUrl = URL.createObjectURL(blob);

            const originalImageUrl = URL.createObjectURL(file);

            // Display the result
            const imageContainer = document.querySelector(".image");
            imageContainer.innerHTML = `
                <div class="image-wrapper">
                    <div class="original-image">
                        <h3>Original Image</h3>
                        <img src="${originalImageUrl}" alt="Original Image" />
                    </div>
                    <div class="processed-image">
                        <h3>Processed Image</h3>
                        <img src="${processedImageUrl}" alt="Processed Image" />
                        <div class="buttons">
                            <button class="download-btn">Download</button>
                            <button class="close-btn">Close</button>
                        </div>
                    </div>
                </div>
            `;

            // Add functionality to buttons
            document.querySelector(".download-btn").addEventListener("click", () => {
                const a = document.createElement("a");
                a.href = processedImageUrl;
                a.download = "processed-image.png";
                a.click();
            });

            document.querySelector(".close-btn").addEventListener("click", () => {
                imageContainer.innerHTML = "";
            });
        } catch (error) {
            console.error(error);
            alert(`Failed: ${error.message}`);
        }
    });

    fileInput.click();
});
