const path = window.location.pathname;
const tagsDisponibili = ["Tecnico", "HR", "Cultura", "Manager", "Stage"];

if (path.includes("index.html") || path === "/" || path.endsWith("/")) {
  // Pagina di login
  const input = document.getElementById("nome");
  const bottone = document.getElementById("accedi");

  bottone.addEventListener("click", () => {
    const nome = input.value.trim();
    if (!nome) {
      alert("Inserisci il tuo nome");
      return;
    }
    localStorage.setItem("nomeUtente", nome);
    window.location.href = "dashboard.html";
  });
}

if (path.includes("dashboard.html")) {
  // Pagina dashboard
  const nomeUtente = localStorage.getItem("nomeUtente");
  const welcome = document.getElementById("welcome");
  const lista = document.getElementById("lista-candidati");
  const logout = document.getElementById("logout");

  if (!nomeUtente) {
    window.location.href = "index.html";
  } else {
    welcome.innerText = `Bentornato/a ${nomeUtente}`;
  }

  logout.addEventListener("click", () => {
    localStorage.removeItem("nomeUtente");
    window.location.href = "index.html";
  });

  fetch("https://wa.volantinopiu.info/candidature/mock.php/api/candidates", {
    headers: {
      Authorization: "Basic " + btoa("candidato:candidata"),
    },
  })
    .then((res) => res.json())
    .then((data) => {
      data.forEach((candidato) => {
        const card = document.createElement("div");
        card.className = "col";

        card.innerHTML = `
          <div class="card candidato-card h-100 shadow-sm">
            <div class="card-body d-flex flex-column justify-content-between">
              <div>
                <h5 class="card-title">${candidato.sender}</h5>
                <p class="card-text mb-1"><strong>UUID:</strong> ${candidato.uuid}</p>
                <p class="card-text"><strong>Destinatario:</strong> ${candidato.receiver}</p>
              </div>
              <span class="badge ${
                candidato["phase-1"]?.pass === true
                  ? "bg-success"
                  : "bg-warning text-dark"
              } badge-status">
                ${candidato["phase-1"]?.pass === true ? "Valutato ✅" : "In attesa ⏳"}
              </span>
            </div>
            <div class="card-footer bg-transparent border-top-0">
              <button class="btn btn-sm btn-primary me-2">Visualizza</button>
              <button class="btn btn-sm btn-outline-danger">Rifiuta</button>
            </div>
          </div>
        `;

        lista.appendChild(card);
      });
    })
    .catch((err) => {
      lista.innerHTML = `<li class="list-group-item text-danger">Errore nel caricare i candidati</li>`;
      console.error(err);
    });
}
