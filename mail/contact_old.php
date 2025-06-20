$.ajax({
    url: "http://localhost:5000/api/contact", // ← เปลี่ยนตรงนี้
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({
        name: name,
        email: email,
        subject: subject,
        message: message
    }),
    success: function () {
        $('#success').html("<div class='alert alert-success'>...");
        $('#contactForm').trigger("reset");
    },
    error: function () {
        $('#success').html("<div class='alert alert-danger'>...");
        $('#contactForm').trigger("reset");
    },
    complete: function () {
        setTimeout(function () {
            $this.prop("disabled", false);
        }, 1000);
    }
});