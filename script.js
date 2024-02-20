const canv = document.getElementById("canv");
const ctx = canv.getContext("2d");
let xBalle, yBalle, vitesseX, vitesseY;
let xBalle2, yBalle2, vitesseX2, vitesseY2;
const diamBalle = 20, 
rendBalle = 0.85;
let animationInterval = null;
let particles = [];

let offscreenCanvas = document.createElement('canvas');
offscreenCanvas.width = canv.width;
offscreenCanvas.height = canv.height;
let offscreenCtx = offscreenCanvas.getContext('2d');


document.getElementById('vitesseHorizontale').addEventListener('input', function(event) {
  vitesseX = parseFloat(event.target.value);
  vitesseX2 = parseFloat(event.target.value); 
});

document.getElementById('vitesseVerticale').addEventListener('input', function(event) {
  vitesseY = parseFloat(event.target.value);
  vitesseY2 = parseFloat(event.target.value);
});
function Particle(x, y) {
  this.x = x;
  this.y = y;
  this.vx = Math.random() * 2 - 1; // Vitesse X aléatoire
  this.vy = Math.random() * 2 - 1; // Vitesse Y aléatoire
  this.alpha = 3; // Opacité initiale

  // Mise à jour de la particule
  this.update = function() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 0.04; // Réduire l'opacité
  };
}
function triggerGlitterExplosion(x, y) {
  let numberOfParticles = 20; // Nombre de particules à générer
  for (let i = 0; i < numberOfParticles; i++) {
      particles.push(new Particle(x, y));
  }
}
function animateParticles() {
  for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.update();

      // Dessiner la particule
      ctx.fillStyle = "rgba(255, 215, 0, " + p.alpha + ")"; // Couleur dorée avec alpha pour l'opacité
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2, false); // Dessiner un cercle
      ctx.fill();

      // Retirer les particules une fois qu'elles sont transparentes
      if (p.alpha <= 0) {
          particles.splice(i, 1);
          i--;
      }
  }
}


function goBalle() {
  xBalle = Math.random() * (canv.width - 2 * diamBalle) + diamBalle;
  yBalle = Math.random() * (canv.height - 2 * diamBalle) + diamBalle;
  xBalle2 = Math.random() * (canv.width - 2 * diamBalle) + diamBalle;
  yBalle2 = Math.random() * (canv.height - 2 * diamBalle) + diamBalle;

  vitesseX = parseFloat(document.getElementById('vitesseHorizontale').value) || Math.random() * 10 - 5;
  vitesseY = parseFloat(document.getElementById('vitesseVerticale').value) || Math.random() * 10 - 5;
  vitesseX2 = parseFloat(document.getElementById('vitesseHorizontale').value) || Math.random() * 10 - 5;
  vitesseY2 = parseFloat(document.getElementById('vitesseVerticale').value) || Math.random() * 10 - 5;

  if(animationInterval === null) {
    animationInterval = window.setInterval(moveBalles, 20);
  }
}

function moveBalles() {
  [xBalle, yBalle, vitesseX, vitesseY] = moveBalle(xBalle, yBalle, vitesseX, vitesseY);
  [xBalle2, yBalle2, vitesseX2, vitesseY2] = moveBalle(xBalle2, yBalle2, vitesseX2, vitesseY2);
  checkCollision();
  render();
   animateParticles();
}

function moveBalle(x, y, vx, vy) {
  let nextX = x + vx;
  let nextY = y + vy;

  if (nextX + diamBalle > canv.width || nextX - diamBalle < 0) {
    vx = -vx * rendBalle;
  }

  if (nextY + diamBalle > canv.height || nextY - diamBalle < 0) {
    vy = -vy * rendBalle;
  }

  nextX = Math.max(diamBalle, Math.min(canv.width - diamBalle, nextX));
  nextY = Math.max(diamBalle, Math.min(canv.height - diamBalle, nextY));

  return [nextX, nextY, vx, vy];
}

function checkCollision() {
  let dx = xBalle2 - xBalle;
  let dy = yBalle2 - yBalle;
  let distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < diamBalle * 2) {
    // Le vecteur de collision
    let nx = dx / distance;
    let ny = dy / distance;
    // Quantité de mouvement (p) a trasnferer ( méthode maths)
    let p = 2 * (vitesseX * nx + vitesseY * ny - vitesseX2 * nx - vitesseY2 * ny) / (1 + 1); // 1 +1 car on suppose que les 2 balles ont la meme masse

    // Je change les vitesses en fonction de la masse a transferer
    vitesseX -= p * nx;
    vitesseY -= p * ny;
    vitesseX2 += p * nx;
    vitesseY2 += p * ny;

    let overlap = (diamBalle * 2 - distance) / 2;
    xBalle -= overlap * nx;
    yBalle -= overlap * ny;
    xBalle2 += overlap * nx;
    yBalle2 += overlap * ny;
    triggerGlitterExplosion((xBalle + xBalle2) / 2, (yBalle + yBalle2) / 2);
    }
}
  


     let impulse = 2 * vitesseX / (1 + 1); // j'ai essayé de faire un système de collision réaliste qui ralentit la première et accelère la deuxième 

    vitesseX -= impulse * collisionNormX;
    vitesseY -= impulse * collisionNormY;
    vitesseX2 += impulse * collisionNormX;
    vitesseY2 += impulse * collisionNormY;
  

function render() {
  offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
  
  offscreenCtx.fillStyle = "blue";
  offscreenCtx.beginPath();
  offscreenCtx.arc(xBalle, yBalle, diamBalle, 0, Math.PI * 2);
  offscreenCtx.fill();

  offscreenCtx.fillStyle = "red";
  offscreenCtx.beginPath();
  offscreenCtx.arc(xBalle2, yBalle2, diamBalle, 0, Math.PI * 2);
  offscreenCtx.fill();

  ctx.clearRect(0, 0, canv.width, canv.height);
  ctx.drawImage(offscreenCanvas, 0, 0);
}

