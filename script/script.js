document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".contato-form");

  const nomeInput = document.getElementById("nome");
  const emailInput = document.getElementById("email");
  const mensagemInput = document.getElementById("mensagem");
  const mensagemSucesso = document.getElementById("mensagem-sucesso");

  const darkModeIcon = document.querySelector(".dark_mode_icon");
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  darkModeIcon.addEventListener("click", updateTheme);
  darkModeIcon.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      updateTheme();
    }
  });

  function updateTheme() {
    if (localStorage.getItem("theme") === "dark") {
      localStorage.setItem("theme", "light");
      document.documentElement.removeAttribute("data-theme");
    } else {
      localStorage.setItem("theme", "dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }

  const elementosReveal = document.querySelectorAll(
    ".quem-somos-container, .proposta-container, .gallery-item, .parceiro-logo, .objetivo-card, .contato-container",
  );
  if (elementosReveal.length > 0 && "IntersectionObserver" in window) {
    elementosReveal.forEach((el) => el.classList.add("reveal"));

    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          el.classList.add("is-visible");
          el.addEventListener(
            "animationend",
            function () {
              el.classList.remove("is-visible");
              el.classList.add("reveal-done");
            },
            { once: true },
          );
          observer.unobserve(el);
        });
      },
      { threshold: 0.2 },
    );

    elementosReveal.forEach((el) => revealObserver.observe(el));
  }

  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  if (menuToggle && navLinks) {
    const menuIcon = menuToggle.querySelector(".material-symbols-outlined");

    function fecharMenu() {
      navLinks.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
      if (menuIcon) menuIcon.textContent = "menu";
    }

    menuToggle.addEventListener("click", function () {
      const aberto = navLinks.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", String(aberto));
      menuToggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
      if (menuIcon) menuIcon.textContent = aberto ? "close" : "menu";
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", fecharMenu);
    });
  }

  const btnVoltarTopo = document.getElementById("btn-voltar-topo");
  if (btnVoltarTopo) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        btnVoltarTopo.classList.add("visivel");
      } else {
        btnVoltarTopo.classList.remove("visivel");
      }
    });

    btnVoltarTopo.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function validarNome(nome) {
    const partes = nome.trim().split(/\s+/);
    if (partes.length < 2) {
      return false;
    }
    return partes.every((parte) =>
      /^[a-záàâãéèêíïóôõöúçñA-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]{2,}$/.test(parte),
    );
  }

  function validarEmail(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  }

  function exibirUltimoContato() {
    const dadosSalvos = localStorage.getItem("foodbridgeContato");
    const containerUltimo = document.getElementById("ultimo-contato-container");

    if (dadosSalvos) {
      const dados = JSON.parse(dadosSalvos);
      document.getElementById("ultimo-nome").textContent = dados.nome;
      document.getElementById("ultimo-email").textContent = dados.email;
      document.getElementById("ultimo-mensagem").textContent = dados.mensagem;

      const data = new Date(dados.data);
      const dataFormatada =
        data.toLocaleDateString("pt-BR") +
        " às " +
        data.toLocaleTimeString("pt-BR");
      document.getElementById("ultimo-data").textContent = dataFormatada;

      containerUltimo.style.display = "block";
    }
  }

  function salvarDadosLocalStorage(nome, email, mensagem) {
    const dados = {
      nome: nome,
      email: email,
      mensagem: mensagem,
      data: new Date().toISOString(),
    };
    localStorage.setItem("foodbridgeContato", JSON.stringify(dados));
    exibirUltimoContato();
  }

  exibirUltimoContato();

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const nome = nomeInput.value.trim();
      const email = emailInput.value.trim();
      const mensagem = mensagemInput.value.trim();

      let erros = [];

      if (!validarNome(nome)) {
        erros.push(
          "\n- Nome deve conter nome e sobrenome, cada um com pelo menos 2 letras.",
        );
      }

      if (!validarEmail(email)) {
        erros.push("\n- Email inválido. Verifique o formato.");
      }

      if (erros.length > 0) {
        errorMessage = erros.reduce((acc, e) => {
          acc += e;
          return acc;
        }, "");
        alert("Erro:" + errorMessage);
      } else {
        salvarDadosLocalStorage(nome, email, mensagem);

        mensagemSucesso.style.display = "block";
        form.reset();

        setTimeout(function () {
          mensagemSucesso.style.display = "none";
        }, 3000);
      }
    });
  }
});
