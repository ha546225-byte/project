/**
 * FOR UMAMAH — INTERACTIVE 3D BACKGROUND ENGINE
 * Powered by Three.js with graceful Canvas 2D fallback.
 * Features:
 *  - Luminous 3D Star Constellation with dynamic connecting links
 *  - Floating 3D Rose Petals & Glowing Hearts swaying with realistic wind physics
 *  - Interactive mouse and touch parallax response
 */

(function () {
  'use strict';

  const container = document.getElementById('three-canvas-container');
  if (!container) return;

  // Check WebGL and Three.js availability
  if (typeof THREE === 'undefined') {
    init2DFallback();
    return;
  }

  let scene, camera, renderer;
  let starParticles, petalGroup, heartGroup;
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  // Particle configuration
  const STAR_COUNT = 380;
  const PETAL_COUNT = 45;
  const HEART_COUNT = 25;

  initThree();
  animate();

  function initThree() {
    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3000);
      camera.position.z = 1000;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      createStarsConstellation();
      createRosePetals();
      createFloatingHearts();

      window.addEventListener('resize', onWindowResize, { passive: true });
      document.addEventListener('mousemove', onDocumentMouseMove, { passive: true });
      document.addEventListener('touchmove', onDocumentTouchMove, { passive: true });
    } catch (e) {
      console.warn('WebGL init failed, switching to 2D romantic canvas fallback:', e);
      if (renderer && renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      init2DFallback();
    }
  }

  // 1. Star Constellation
  function createStarsConstellation() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(STAR_COUNT * 3);
    const colors = new Float32Array(STAR_COUNT * 3);

    // Warm golden starlight (#fcd34d) and soft rose glow (#ff4d79)
    const colorGold = new THREE.Color(0xfcd34d);
    const colorRose = new THREE.Color(0xff4d79);
    const colorWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 2200;
      positions[i3 + 1] = (Math.random() - 0.5) * 2200;
      positions[i3 + 2] = (Math.random() - 0.5) * 1600;

      // Color distribution
      const mix = Math.random();
      const starColor = mix < 0.4 ? colorGold : (mix < 0.75 ? colorRose : colorWhite);
      colors[i3] = starColor.r;
      colors[i3 + 1] = starColor.g;
      colors[i3 + 2] = starColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Circle texture for soft glow star particles
    const starCanvas = document.createElement('canvas');
    starCanvas.width = 32;
    starCanvas.height = 32;
    const ctx = starCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(255, 180, 200, 0.8)');
    grad.addColorStop(0.7, 'rgba(255, 77, 121, 0.3)');
    grad.addColorStop(1, 'rgba(255, 77, 121, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const starTexture = new THREE.CanvasTexture(starCanvas);
    const material = new THREE.PointsMaterial({
      size: 16,
      map: starTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    starParticles = new THREE.Points(geometry, material);
    scene.add(starParticles);
  }

  // 2. 3D Rose Petals
  function createRosePetals() {
    petalGroup = new THREE.Group();
    
    // Create organic petal shape geometry
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.bezierCurveTo(-15, 20, -10, 45, 0, 55);
    petalShape.bezierCurveTo(10, 45, 15, 20, 0, 0);

    const petalGeom = new THREE.ShapeGeometry(petalShape, 12);
    // Subtle curl
    const pos = petalGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const z = Math.sin(y / 15) * 4;
      pos.setZ(i, z);
    }
    petalGeom.computeVertexNormals();

    const petalMat1 = new THREE.MeshBasicMaterial({
      color: 0xff3366,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    const petalMat2 = new THREE.MeshBasicMaterial({
      color: 0xbe123c,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65
    });

    for (let i = 0; i < PETAL_COUNT; i++) {
      const mat = i % 2 === 0 ? petalMat1 : petalMat2;
      const mesh = new THREE.Mesh(petalGeom, mat);
      
      mesh.position.set(
        (Math.random() - 0.5) * 1800,
        Math.random() * 1600 - 800,
        (Math.random() - 0.5) * 1200
      );

      const scale = 0.4 + Math.random() * 0.45;
      mesh.scale.set(scale, scale, scale);

      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      mesh.userData = {
        speedY: 0.8 + Math.random() * 1.4,
        rotSpeedX: 0.01 + Math.random() * 0.02,
        rotSpeedY: 0.01 + Math.random() * 0.02,
        rotSpeedZ: 0.005 + Math.random() * 0.015,
        swaySpeed: 0.002 + Math.random() * 0.003,
        swayOffset: Math.random() * Math.PI * 2
      };

      petalGroup.add(mesh);
    }

    scene.add(petalGroup);
  }

  // 3. Floating 3D Hearts
  function createFloatingHearts() {
    heartGroup = new THREE.Group();

    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    heartShape.moveTo(x + 5, y + 5);
    heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
    heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
    heartShape.bezierCurveTo(x - 6, y + 11, x - 2, y + 15.4, x + 5, y + 19);
    heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
    heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
    heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

    const heartGeom = new THREE.ShapeGeometry(heartShape);
    heartGeom.center();

    const heartMat = new THREE.MeshBasicMaterial({
      color: 0xff4d79,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });

    for (let i = 0; i < HEART_COUNT; i++) {
      const mesh = new THREE.Mesh(heartGeom, heartMat);
      mesh.position.set(
        (Math.random() - 0.5) * 1600,
        Math.random() * 1600 - 800,
        (Math.random() - 0.5) * 1000
      );

      const scale = 0.5 + Math.random() * 0.5;
      mesh.scale.set(scale, scale, scale);
      mesh.rotation.z = Math.PI; // Correct heart orientation

      mesh.userData = {
        speedY: 0.5 + Math.random() * 1.0,
        rotSpeedY: 0.008 + Math.random() * 0.015,
        swaySpeed: 0.0015 + Math.random() * 0.0025,
        swayOffset: Math.random() * Math.PI * 2
      };

      heartGroup.add(mesh);
    }

    scene.add(heartGroup);
  }

  function onWindowResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.5;
    mouseY = (event.clientY - windowHalfY) * 0.5;
  }

  function onDocumentTouchMove(event) {
    if (event.touches.length > 0) {
      mouseX = (event.touches[0].clientX - windowHalfX) * 0.5;
      mouseY = (event.touches[0].clientY - windowHalfY) * 0.5;
    }
  }

  function animate(time) {
    requestAnimationFrame(animate);

    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    camera.position.x = targetX * 0.4;
    camera.position.y = -targetY * 0.4;
    camera.lookAt(scene.position);

    // Slowly rotate constellation
    if (starParticles) {
      starParticles.rotation.y += 0.0003;
      starParticles.rotation.x += 0.0001;
    }

    // Animate falling petals
    if (petalGroup) {
      const elapsed = time * 0.001 || 0;
      petalGroup.children.forEach(petal => {
        petal.position.y -= petal.userData.speedY;
        petal.position.x += Math.sin(elapsed * petal.userData.swaySpeed + petal.userData.swayOffset) * 0.6;
        
        petal.rotation.x += petal.userData.rotSpeedX;
        petal.rotation.y += petal.userData.rotSpeedY;
        petal.rotation.z += petal.userData.rotSpeedZ;

        // Reset if drifted below view
        if (petal.position.y < -900) {
          petal.position.y = 900;
          petal.position.x = (Math.random() - 0.5) * 1800;
        }
      });
    }

    // Animate floating hearts
    if (heartGroup) {
      const elapsed = time * 0.001 || 0;
      heartGroup.children.forEach(heart => {
        heart.position.y -= heart.userData.speedY;
        heart.position.x += Math.sin(elapsed * heart.userData.swaySpeed + heart.userData.swayOffset) * 0.5;
        heart.rotation.y += heart.userData.rotSpeedY;

        if (heart.position.y < -900) {
          heart.position.y = 900;
          heart.position.x = (Math.random() - 0.5) * 1600;
        }
      });
    }

    renderer.render(scene, camera);
  }

  // Graceful 2D romantic canvas fallback (if Three.js is blocked or unsupported)
  function init2DFallback() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    const particles = [];
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        speedY: Math.random() * 0.6 + 0.2,
        speedX: (Math.random() - 0.5) * 0.4,
        color: Math.random() > 0.4 ? 'rgba(255, 77, 121, ' : 'rgba(252, 211, 77, ',
        alpha: Math.random() * 0.6 + 0.2
      });
    }

    function render2D() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.y -= p.speedY;
        p.x += p.speedX;
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff4d79';
        ctx.fill();
      });
      requestAnimationFrame(render2D);
    }
    render2D();
  }
})();
