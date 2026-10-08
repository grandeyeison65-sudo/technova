/* ============================================
   TECHNOVA - LÓGICA PRINCIPAL v2
   Taller especializado en equipos
   ============================================ */

/* ============================================
   1. CONFIGURACIÓN GLOBAL
   ============================================ */
const CONFIG = {
  urlBase: 'https://tu-usuario.github.io/technova',
  whatsapp: '50375605466'
};

/* ============================================
   2. SISTEMA DE PESTAÑAS
   ============================================ */
function switchTab(tabId) {
  // Ocultar todas las pestañas
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  // Quitar active de todos los links
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
  });

  // Activar la pestaña solicitada
  const targetTab = document.getElementById(tabId);
  if (targetTab) targetTab.classList.add('active');

  // Activar el link correspondiente
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.dataset.tab === tabId) {
      link.classList.add('active');
    }
  });

  // Cerrar menú móvil si está abierto
  const navLinks = document.getElementById('navLinks');
  if (navLinks) navLinks.classList.remove('open');
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    const icon = hamburger.querySelector('i');
    if (icon) {
      icon.classList.add('fa-bars');
      icon.classList.remove('fa-xmark');
    }
  }

  // Scroll suave hacia arriba
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Reiniciar animaciones
  setTimeout(() => {
    iniciarContadores();
    iniciarReveal();
  }, 100);
}

/* ---------- DETECTAR CLICS EN [data-tab] ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-tab]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab(el.dataset.tab);
    });
  });
});

/* ============================================
   3. MENÚ HAMBURGUESA
   ============================================ */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const icon = hamburger.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-xmark');
  });
}

/* ============================================
   4. HEADER SOMBRA + BACK TO TOP
   ============================================ */
const nav = document.getElementById('header');
const backTop = document.getElementById('back-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    if (nav) nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
  } else {
    if (nav) nav.style.boxShadow = 'none';
  }

  if (window.scrollY > 400) {
    if (backTop) backTop.classList.add('visible');
  } else {
    if (backTop) backTop.classList.remove('visible');
  }
});

if (backTop) {
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================
   5. CARRUSEL HERO
   ============================================ */
(function inicializarCarruselHero() {
  const slides = document.querySelectorAll('#carrusel-hero .carrusel__slide');
  const dots = document.querySelectorAll('#dots-hero .dot');
  const btnPrev = document.getElementById('prev-hero');
  const btnNext = document.getElementById('next-hero');

  if (!slides.length) return;

  let actual = 0;
  let autoplay;

  function irA(indice) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    actual = (indice + slides.length) % slides.length;

    slides[actual].classList.add('active');
    if (dots[actual]) dots[actual].classList.add('active');
  }

  function siguiente() { irA(actual + 1); }
  function anterior() { irA(actual - 1); }

  function iniciarAutoplay() { autoplay = setInterval(siguiente, 5500); }
  function reiniciarAutoplay() { clearInterval(autoplay); iniciarAutoplay(); }

  if (btnNext) btnNext.addEventListener('click', () => { siguiente(); reiniciarAutoplay(); });
  if (btnPrev) btnPrev.addEventListener('click', () => { anterior(); reiniciarAutoplay(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { irA(i); reiniciarAutoplay(); });
  });

  // Swipe táctil
  let startX = 0;
  const carruselEl = document.getElementById('carrusel-hero');

  if (carruselEl) {
    carruselEl.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    carruselEl.addEventListener('touchend', (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) siguiente();
        else anterior();
        reiniciarAutoplay();
      }
    });
  }

  iniciarAutoplay();
})();

/* ============================================
   6. CONTADORES ANIMADOS
   ============================================ */
function iniciarContadores() {
  const contadores = document.querySelectorAll('.contador');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.dataset.animado) {
        animarContador(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  contadores.forEach(c => {
    if (!c.dataset.animado) observer.observe(c);
  });
}

function animarContador(elemento) {
  if (elemento.dataset.animado) return;
  elemento.dataset.animado = 'true';

  const objetivo = parseInt(elemento.dataset.target);
  const duracion = 1800;
  const paso = objetivo / (duracion / 16);
  let actual = 0;

  const actualizar = () => {
    actual += paso;
    if (actual < objetivo) {
      elemento.textContent = Math.floor(actual).toLocaleString();
      requestAnimationFrame(actualizar);
    } else {
      elemento.textContent = objetivo.toLocaleString();
    }
  };

  actualizar();
}

/* ============================================
   7. SCROLL REVEAL
   ============================================ */
function iniciarReveal() {
  const elementos = document.querySelectorAll(
    '.feature-card, .service-card, .tech-item, .garantia-card, .resena, .faq-item, .cta-band, .documento-wrapper'
  );

  elementos.forEach(el => {
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elementos.forEach(el => {
    if (!el.classList.contains('visible')) observer.observe(el);
  });
}

/* ============================================
   8. FAQ ACORDEÓN
   ============================================ */
(function inicializarFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const pregunta = item.querySelector('.faq-item__q');
    if (!pregunta) return;

    pregunta.addEventListener('click', () => {
      const estabaAbierto = item.classList.contains('abierto');

      items.forEach(i => i.classList.remove('abierto'));

      if (!estabaAbierto) item.classList.add('abierto');
    });
  });

  if (items[0]) items[0].classList.add('abierto');
})();

/* CONTINÚA EN PARTE 2 */
/* ============================================
   9. SISTEMA DE RESEÑAS
   ============================================ */
const CLAVE_RESENAS = 'technova_resenas_v2';
let resenas = JSON.parse(localStorage.getItem(CLAVE_RESENAS)) || [];

const formResena = document.getElementById('form-resena');
const listaResenas = document.getElementById('resenas-lista');
const promedioNumero = document.getElementById('promedio-numero');
const promedioEstrellas = document.getElementById('promedio-estrellas');
const promedioTotal = document.getElementById('promedio-total');
const barrasEstrellas = document.getElementById('barras-estrellas');
const estrellasInput = document.getElementById('estrellas-input');
const inputPuntuacion = document.getElementById('puntuacion');

/* ---------- 9.1 INPUT DE ESTRELLAS ---------- */
let puntuacionSeleccionada = 0;

if (estrellasInput) {
  estrellasInput.querySelectorAll('i').forEach(estrella => {
    estrella.addEventListener('mouseenter', () => {
      pintarEstrellasInput(parseInt(estrella.dataset.valor));
    });

    estrella.addEventListener('click', () => {
      puntuacionSeleccionada = parseInt(estrella.dataset.valor);
      inputPuntuacion.value = puntuacionSeleccionada;
      pintarEstrellasInput(puntuacionSeleccionada);
    });
  });

  estrellasInput.addEventListener('mouseleave', () => {
    pintarEstrellasInput(puntuacionSeleccionada);
  });
}

function pintarEstrellasInput(valor) {
  if (!estrellasInput) return;
  estrellasInput.querySelectorAll('i').forEach((el, i) => {
    if (i < valor) {
      el.classList.remove('fa-regular');
      el.classList.add('fa-solid');
    } else {
      el.classList.remove('fa-solid');
      el.classList.add('fa-regular');
    }
  });
}

/* ---------- 9.2 GUARDAR RESEÑA ---------- */
if (formResena) {
  formResena.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const comentario = document.getElementById('comentario').value.trim();
    const puntuacion = parseInt(inputPuntuacion.value);

    if (!nombre) {
      mostrarToast('Por favor escribe tu nombre', 'error');
      return;
    }
    if (puntuacion < 1 || puntuacion > 5) {
      mostrarToast('Selecciona una puntuación de 1 a 5 estrellas', 'error');
      return;
    }
    if (comentario.length < 5) {
      mostrarToast('El comentario debe tener al menos 5 caracteres', 'error');
      return;
    }

    const nuevaResena = {
      id: Date.now(),
      nombre: nombre,
      puntuacion: puntuacion,
      comentario: comentario,
      fecha: new Date().toLocaleDateString('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric'
      })
    };

    resenas.unshift(nuevaResena);
    localStorage.setItem(CLAVE_RESENAS, JSON.stringify(resenas));

    formResena.reset();
    puntuacionSeleccionada = 0;
    inputPuntuacion.value = 0;
    pintarEstrellasInput(0);

    renderizarResenas();
    calcularPromedio();

    mostrarToast('¡Gracias por tu reseña!', 'ok');
  });
}

/* ---------- 9.3 MOSTRAR RESEÑAS ---------- */
function renderizarResenas() {
  if (!listaResenas) return;

  listaResenas.innerHTML = '';

  if (resenas.length === 0) {
    listaResenas.innerHTML = '<p class="resenas-vacio"><i class="fa-regular fa-comment-dots"></i><br>Aún no hay reseñas. ¡Sé el primero en opinar!</p>';
    return;
  }

  resenas.forEach(resena => {
    const inicial = resena.nombre.charAt(0).toUpperCase();
    const estrellasHTML = generarEstrellasHTML(resena.puntuacion);

    const div = document.createElement('div');
    div.className = 'resena reveal visible';
    div.innerHTML = '<div class="resena__head"><div class="resena__avatar">' + inicial + '</div><div class="resena__info"><h5>' + escapeHTML(resena.nombre) + '</h5><div class="estrellas">' + estrellasHTML + '</div></div></div><p class="resena__texto">' + escapeHTML(resena.comentario) + '</p><span class="resena__fecha">' + resena.fecha + '</span>';
    listaResenas.appendChild(div);
  });
}

/* ---------- 9.4 ESTRELLAS HTML ---------- */
function generarEstrellasHTML(puntuacion) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= puntuacion) html += '<i class="fa-solid fa-star"></i>';
    else html += '<i class="fa-regular fa-star"></i>';
  }
  return html;
}

/* ---------- 9.5 PROMEDIO PONDERADO ---------- */
function calcularPromedio() {
  if (!promedioNumero) return;

  const total = resenas.length;

  if (total === 0) {
    promedioNumero.textContent = '0.0';
    promedioTotal.textContent = 'Basado en 0 reseñas';
    promedioEstrellas.innerHTML = generarEstrellasHTML(0);
    barrasEstrellas.innerHTML = '';
    for (let i = 5; i >= 1; i--) {
      barrasEstrellas.appendChild(crearBarra(i, 0));
    }
    return;
  }

  const suma = resenas.reduce((acc, r) => acc + r.puntuacion, 0);
  const promedio = suma / total;
  const promedioRedondeado = promedio.toFixed(1);

  promedioNumero.textContent = promedioRedondeado;
  promedioTotal.textContent = 'Basado en ' + total + ' reseña' + (total !== 1 ? 's' : '');
  promedioEstrellas.innerHTML = generarEstrellasHTML(Math.round(promedio));

  const conteo = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  resenas.forEach(r => conteo[r.puntuacion]++);

  barrasEstrellas.innerHTML = '';
  for (let i = 5; i >= 1; i--) {
    const cantidad = conteo[i];
    const porcentaje = (cantidad / total) * 100;
    barrasEstrellas.appendChild(crearBarra(i, porcentaje, cantidad));
  }
}

/* ---------- 9.6 BARRA PORCENTAJE ---------- */
function crearBarra(estrellas, porcentaje, cantidad = 0) {
  const div = document.createElement('div');
  div.className = 'barra';
  div.innerHTML = '<span>' + estrellas + ' <i class="fa-solid fa-star" style="color:#facc15;font-size:0.75rem"></i></span><div class="barra__track"><div class="barra__fill" style="width: 0%"></div></div><span>' + Math.round(porcentaje) + '%</span>';

  setTimeout(() => {
    const fill = div.querySelector('.barra__fill');
    if (fill) fill.style.width = porcentaje + '%';
  }, 60);

  return div;
}

/* ---------- 9.7 SEGURIDAD ---------- */
function escapeHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

/* ============================================
   10. RESEÑAS DE EJEMPLO
   ============================================ */
(function cargarResenasEjemplo() {
  const yaCargado = localStorage.getItem('technova_ejemplo_v2');

  if (!yaCargado && resenas.length === 0) {
    const ejemplos = [
      { id: 1, nombre: 'María Fernández', puntuacion: 5, comentario: 'Excelente servicio. Me recuperaron todos los archivos de mi laptop y quedó funcionando como nueva.', fecha: '15 oct 2025' },
      { id: 2, nombre: 'Roberto Castillo', puntuacion: 5, comentario: 'Le instalaron Windows y Office en el mismo día. Muy profesionales y el documento de responsabilidad da confianza.', fecha: '12 oct 2025' },
      { id: 3, nombre: 'Estudio Creativo SV', puntuacion: 4, comentario: 'Buen trabajo con el cambio a SSD. La PC arranca en 10 segundos. Solo tardaron un día más de lo previsto.', fecha: '10 oct 2025' },
      { id: 4, nombre: 'Carlos Mendoza', puntuacion: 5, comentario: 'Me dejaron la laptop impecable, sin virus y mucho más rápida. Recomendados.', fecha: '08 oct 2025' },
      { id: 5, nombre: 'Lucía Ramírez', puntuacion: 4, comentario: 'Muy profesionales. La garantía de 2 semanas me dio tranquilidad, aunque no la necesité.', fecha: '05 oct 2025' }
    ];

    resenas = ejemplos;
    localStorage.setItem(CLAVE_RESENAS, JSON.stringify(resenas));
    localStorage.setItem('technova_ejemplo_v2', 'true');
  }
})();

/* ============================================
   11. FORMULARIO DE TICKET
   ============================================ */
(function inicializarTicket() {
  const form = document.getElementById('form-ticket');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('tkNombre').value.trim();
    const telefono = document.getElementById('tkTelefono').value.trim();
    const equipo = document.getElementById('tkEquipo').value;
    const marca = document.getElementById('tkMarca').value.trim();
    const servicio = document.getElementById('tkServicio').value;
    const urgencia = document.getElementById('tkUrgencia').value;
    const detalle = document.getElementById('tkDetalle').value.trim();
    const terminos = document.getElementById('tkTerminos').checked;

    if (!nombre || !telefono || !equipo || !servicio || !urgencia || !detalle) {
      mostrarToast('Completa todos los campos obligatorios', 'error');
      return;
    }

    if (!terminos) {
      mostrarToast('Debes aceptar los términos para continuar', 'error');
      return;
    }

    let msg = '*NUEVO TICKET - TechNova Taller* 🔧%0A%0A';
    msg += '👤 *Cliente:* ' + encodeURIComponent(nombre) + '%0A';
    msg += '📞 *Teléfono:* ' + encodeURIComponent(telefono) + '%0A';
    msg += '💻 *Equipo:* ' + encodeURIComponent(equipo) + '%0A';
    if (marca) msg += '🏷️ *Marca/Modelo:* ' + encodeURIComponent(marca) + '%0A';
    msg += '🛠️ *Servicio:* ' + encodeURIComponent(servicio) + '%0A';
    msg += '⚡ *Urgencia:* ' + encodeURIComponent(urgencia) + '%0A%0A';
    msg += '📝 *Detalle:*%0A' + encodeURIComponent(detalle) + '%0A%0A';
    msg += '✅ *Acepta términos y garantía de 2 semanas*%0A%0A';
    msg += '_Enviado desde la web de TechNova_';

    window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + msg, '_blank');
    mostrarToast('¡Ticket enviado! Te contactamos pronto', 'ok');

    setTimeout(() => form.reset(), 800);
  });
})();

/* ============================================
   12. TOAST DE NOTIFICACIÓN
   ============================================ */
function mostrarToast(mensaje, tipo = 'ok') {
  const colores = {
    ok: '#0066cc',
    error: '#ef4444',
    info: '#00d2ff'
  };

  const iconos = {
    ok: 'fa-circle-check',
    error: 'fa-circle-exclamation',
    info: 'fa-circle-info'
  };

  document.querySelectorAll('.technova-toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = 'technova-toast';
  toast.innerHTML = '<i class="fa-solid ' + iconos[tipo] + '"></i> <span>' + mensaje + '</span>';
  toast.style.cssText = 'position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%) translateY(20px); background: ' + colores[tipo] + '; color: #fff; padding: 14px 26px; border-radius: 4px; font-family: Montserrat, sans-serif; font-size: 0.9rem; font-weight: 600; box-shadow: 0 10px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(0, 210, 255, 0.3); z-index: 3000; opacity: 0; transition: opacity 0.3s ease, transform 0.3s ease; pointer-events: none; display: flex; align-items: center; gap: 10px; max-width: 90vw; text-align: center;';

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/* ============================================
   13. INICIALIZACIÓN
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  const inicioTab = document.getElementById('inicio');
  if (inicioTab && !inicioTab.classList.contains('active')) {
    inicioTab.classList.add('active');
    const inicioLink = document.querySelector('.nav-links a[data-tab="inicio"]');
    if (inicioLink) inicioLink.classList.add('active');
  }

  renderizarResenas();
  calcularPromedio();
  iniciarContadores();
  iniciarReveal();
});

/* ============================================
   14. ATAJOS DE TECLADO
   ============================================ */
document.addEventListener('keydown', (e) => {
  // Escape cierra menú
  if (e.key === 'Escape') {
    if (navLinks && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      if (hamburger) {
        const icon = hamburger.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      }
    }
  }

  // Ctrl + K abre WhatsApp
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    window.open('https://wa.me/' + CONFIG.whatsapp, '_blank');
    mostrarToast('Abriendo WhatsApp...', 'info');
  }

  // Ctrl + 1-5 cambia de pestaña
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
    const tabs = ['inicio', 'servicios', 'garantia', 'metricas', 'contacto'];
    const num = parseInt(e.key);
    if (num >= 1 && num <= 5) {
      e.preventDefault();
      switchTab(tabs[num - 1]);
      mostrarToast('Pestaña: ' + tabs[num - 1].toUpperCase(), 'info');
    }
  }
});

/* ============================================
   15. SCROLL SUAVE EN ANCLAS
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      if (link.dataset.tab) return;

      const destino = document.querySelector(href);
      if (destino) {
        e.preventDefault();
        const offset = 100;
        const top = destino.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
});

/* ============================================
   16. AÑO AUTOMÁTICO EN FOOTER
   ============================================ */
(function actualizarAnio() {
  const yearElements = document.querySelectorAll('.footer-bottom');
  const anioActual = new Date().getFullYear();
  yearElements.forEach(el => {
    el.innerHTML = el.innerHTML.replace('2026', anioActual);
  });
})();