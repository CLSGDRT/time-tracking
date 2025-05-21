$(document).ready(function () {
  fetchSessions();

  const token = localStorage.getItem("access_token");

  if (!token) {
    window.location.href = "/login";
    return;
  }

  $("#logout").on("click", function () {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  });

  $.ajax({
    url: "/api/me",
    method: "GET",
    headers: { Authorization: "Bearer " + token },
    success: function (res) {
      $("#username").text(res.username);
    },
  });

  $("#sessionForm").on("submit", function (e) {
    e.preventDefault();
    const activity = $("#activity").val();
    const duration = $("#duration").val();

    $.ajax({
      url: "/api/sessions", // 👈 Le endpoint de votre API pour ajouter une session
      method: "POST",
      contentType: "application/json",
      headers: { Authorization: "Bearer " + token },
      // 👇 L'élément data contient le payload qui sera envoyé à votre API.
      // Vous pouvez le modifier selon les besoins de votre API. Gardez bien le "JSON.stringify(...)" qui va convertir l'objet JavaScript en chaîne JSON.
      // Les propriété dispos sont activity (le nom de l'activité), duration (la durée) et vous pouvez laisser la date (ou la gérer côté back, comme vous voulez).
      data: JSON.stringify({
        activity,
        duration,
        date: new Date().toISOString(),
      }),
      success: function (res) {
        alert(res.message);
        fetchSessions();
        $("#sessionForm")[0].reset();
      },
      error: function (err) {
        if (err.status === 401) {
          window.location.href = "/login";
        }
      },
    });
  });

  function fetchSessions() {
    $.get("/api/sessions", function (data) {
      $("#sessionList").empty();
      data.forEach((session) => {
        $("#sessionList").append(
          `<li class="list-group-item">${session.activity} - ${
            session.duration
          } min le ${new Date(session.date).toLocaleString()}</li>`
        );
      });
    });
  }
});
