function glitchRandomLetter() {
  function getTextNodes(node) {
    let textNodes = [];
    if (node.nodeType === Node.TEXT_NODE) {
      textNodes.push(node);
    } else {
      let child = node.firstChild;
      while (child) {
        textNodes = textNodes.concat(getTextNodes(child));
        child = child.nextSibling;
      }
    }
    return textNodes;
  }

  const textNodes = getTextNodes(document.body).filter(
    node => node.textContent.trim().length > 0
  );

  let letters = [];
  textNodes.forEach(node => {
    [...node.textContent].forEach((char, index) => {
      if (/\S/.test(char)) {
        letters.push({ node, index });
      }
    });
  });

  if (letters.length === 0) return;

  const { node, index } = letters[Math.floor(Math.random() * letters.length)];
  const text = node.textContent;
  const parent = node.parentNode;

  // Split original text
  const before = document.createTextNode(text.slice(0, index));
  const span = document.createElement("span");
  span.className = "glitch-letter";
  span.textContent = text[index];
  const after = document.createTextNode(text.slice(index + 1));

  // Replace original node
  parent.replaceChild(after, node);
  parent.insertBefore(span, after);
  parent.insertBefore(before, span);

  // Restore after glitch
  setTimeout(() => {
    const original = document.createTextNode(text);
    parent.replaceChild(original, before);
    parent.removeChild(span);
    parent.removeChild(after);
  }, 300); // match animation
}

setInterval(() => {
  if(Math.random() >= 0.2) {
    glitchRandomLetter();
  };
}, 1000)

particlesJS('particles-js',
  
  {
    "particles": {
      "number": {
        "value": 160,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#24f2e1"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 1,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 1,
          "opacity_min": 0,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 4,
          "size_min": 0.3,
          "sync": false
        }
      },
      "line_linked": {
        "enable": false,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 1,
        "direction": "none",
        "random": true,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 600
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": false,
          "mode": "bubble"
        },
        "onclick": {
          "enable": false,
          "mode": "repulse"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 400,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 250,
          "size": 0,
          "duration": 2,
          "opacity": 0,
          "speed": 3
        },
        "repulse": {
          "distance": 400,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  }

);