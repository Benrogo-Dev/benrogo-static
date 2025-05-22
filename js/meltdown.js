function ominousText() {
  document.body.querySelectorAll("*:not(#meltdown)").forEach((e) => {
    e.remove();
  });

  // Create top text
  const ominousTextTop = document.createElement("h1");
  ominousTextTop.innerText = "Benrogo will return";
  Object.assign(ominousTextTop.style, {
    color: "#ffffff",
    textShadow: "0 0 5px #ffffff, 0 0 15px #E526CB",
    opacity: "0",
    transition: "opacity 3s ease-in",
    margin: "0.5em"
  });
  
  // Create bottom text
  const ominousTextBottom = document.createElement("h1");
  ominousTextBottom.innerText = "August 2025";
  Object.assign(ominousTextBottom.style, {
    color: "#ffffff",
    textShadow: "0 0 5px #ffffff, 0 0 15px #E526CB",
    opacity: "0",
    transition: "opacity 3s ease-in",
    margin: "0.5em"
  });
  
  // Style body
  Object.assign(document.body.style, {
    display: "flex",
    flexFlow: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // Ensures full viewport centering
    backgroundColor: "#000", // Optional: for contrast
    margin: "0"
  });
  
  document.body.appendChild(ominousTextTop);
  document.body.appendChild(ominousTextBottom);
  
  // Trigger fade-in
  setTimeout(() => {
    ominousTextTop.style.opacity = "1";
  }, 100);
  
  setTimeout(() => {
    ominousTextBottom.style.opacity = "1";
  }, 3100); // Delay second one a bit for drama
}

if (!localStorage.getItem("animationPlayed")) {
  const elements = document.body.querySelectorAll("*:not(#meltdown)");

  elements.forEach((element) => {
    for (let i = 0; i < 5; i++) {
      setInterval(() => {
        setInterval(() => {
          if (Math.random() > 0.2) {
            element.style.animation = `glitch ${300-(6*i)}ms ease-in-out`;
            setTimeout(() => {
              element.style.animation = "";
            }, 300-(6*i));
          }
        }, Math.floor(Math.random()*5000));
      }, i*1000);
    }
    setTimeout(() => {
      element.remove();
    }, Math.floor((Math.random() * 5000) + 5000));
  });
  
  const timer = setInterval(() => {
    if (document.body.querySelectorAll("*:not(#meltdown)").length) {
      console.log("Not done yet");
    } else {
      console.log("DONE");
      clearInterval(timer);
  
      ominousText();
      localStorage.setItem("animationPlayed", 1);
    }
  }, 500);
} else {
  ominousText();
}