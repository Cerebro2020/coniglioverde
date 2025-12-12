document.getElementById("contact-form").addEventListener("submit", function(e) {
  e.preventDefault();
  
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  const mailtoLink =
    `mailto:vinofelice@gmail.com?subject=Messaggio da ${encodeURIComponent(name)}&body=` +
    encodeURIComponent(`Da: ${name} (${email})\n\n${message}`);

  window.location.href = mailtoLink;

  document.getElementById("form-status").innerText = "Email pronta per l’invio!";
});