$(document).ready(function () {
  $("#loginForm").on("submit", function (e) {
    e.preventDefault();
    const username = $("#username").val();
    const password = $("#password").val();

    $.ajax({
      url: "/login",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ username, password }),
      success: function (res) {
        localStorage.setItem("access_token", res.access_token);
        window.location.href = "/";
      },
      error: function (err) {
        alert("Nom d'utilisateur ou mot de passe incorrect.");
      },
    });
  });
});
