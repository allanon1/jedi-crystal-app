// crystal.js
// Renders a 3D crystal if THREE is available; otherwise falls back to a 2D canvas crystal.
// Exposes: CrystalRenderer.updateAlignment(value), .pulseDamage(), .pulseHeal()

const CrystalRenderer = (()=>{
  let useThree = typeof THREE !== 'undefined';
  const mount = document.getElementById('threejs-mount');
  const canvas2d = document.getElementById('crystalCanvas');
  let state = { alignment: 0 }; // 0 light -> 100 dark

  // ---------- Helpers
  function hslToHex(h,s,l){
    h/=360; s/=100; l/=100;
    let r, g, b;
    if(s===0){ r=g=b=l; } else {
      const hue2rgb=(p,q,t)=>{ if(t<0)t+=1; if(t>1)t-=1; if(t<1/6)return p+(q-p)*6*t; if(t<1/2)return q; if(t<2/3) return p+(q-p)*(2/3 - t)*6; return p; };
      const q=l<0.5?l*(1+s):l+s-l*s;
      const p=2*l-q;
      r=hue2rgb(p,q,h+1/3); g=hue2rgb(p,q,h); b=hue2rgb(p,q,h-1/3);
    }
    const toHex=x=>('0'+Math.round(x*255).toString(16)).slice(-2);
    return '#'+toHex(r)+toHex(g)+toHex(b);
  }

  function colorForAlignment(a){
    // Smooth gradient: Light (200° blue) -> 260° violet -> 0° red
    const h = a<50 ? (200 - a*1.2) : (260 - (a-50)*5.2);
    return hslToHex(Math.max(0,Math.min(260,h)), 100, 55);
  }

  // ---------- THREE renderer
  if(useThree){
    const scene = new THREE.Scene();
    const w = mount.clientWidth || 304, h = mount.clientHeight || 304;
    const camera = new THREE.PerspectiveCamera(45, w/h, 0.1, 100);
    camera.position.z = 4;
    const renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
    renderer.setSize(w,h);
    mount.appendChild(renderer.domElement);

    // Lights
    const key = new THREE.PointLight(0xffffff, 1.2); key.position.set(3,3,3); scene.add(key);
    const rim = new THREE.PointLight(0x66ccff, 0.8); rim.position.set(-3,-2,2); scene.add(rim);
    scene.add(new THREE.AmbientLight(0x335577,0.4));

    // Geometry (crystal variants)
    const materials = new THREE.MeshPhysicalMaterial({
      color: colorForAlignment(state.alignment),
      emissive: colorForAlignment(state.alignment),
      emissiveIntensity: 0.35,
      roughness: 0.15,
      metalness: 0.0,
      transmission: 0.35,
      thickness: 0.8,
      transparent: true
    });

    const geoOcta = new THREE.OctahedronGeometry(1.0, 0);
    const crystal = new THREE.Mesh(geoOcta, materials);
    scene.add(crystal);

    // Crack lines (simple line segments layered on top)
    const crackMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent:true, opacity:0 });
    const crackGeom = new THREE.BufferGeometry();
    const crackVerts = new Float32Array([
      // few random segments
      -0.4,0.2,0.1,  0.1,0.6,0.1,
      0.2,-0.1,0.2, -0.2,-0.5,0.0,
      0.4,0.0,-0.1, 0.0,-0.3,-0.2
    ]);
    crackGeom.setAttribute('position', new THREE.BufferAttribute(crackVerts,3));
    const cracks = new THREE.LineSegments(crackGeom, crackMaterial);
    scene.add(cracks);

    // Float / spin
    let t=0;
    function animate(){
      requestAnimationFrame(animate);
      t += 0.015;
      crystal.rotation.y += 0.01;
      crystal.rotation.x = Math.sin(t*0.5)*0.08;
      crystal.position.y = Math.sin(t)*0.25;
      cracks.rotation.copy(crystal.rotation);
      cracks.position.copy(crystal.position);
      renderer.render(scene,camera);
    }
    animate();

    // Public methods
    function updateAlignment(a){
      state.alignment = a;
      const hex = colorForAlignment(a);
      materials.color.set(hex);
      materials.emissive.set(hex);
      // cracks opacity based on threshold (>=70)
      const target = a>=70 ? 0.9 : 0.0;
      if(typeof gsap!=='undefined'){
        gsap.to(crackMaterial, { opacity: target, duration: 0.4, ease: "power2.out" });
      } else {
        crackMaterial.opacity = target;
      }
    }

    function pulseDamage(){
      // quick shudder & red flash
      if(typeof gsap!=='undefined'){
        gsap.to(crystal.scale,{x:1.06,y:1.06,z:1.06,duration:0.08,yoyo:true,repeat:1});
        gsap.to(materials.emissive,{r:1,g:0.1,b:0.1,duration:0.15,yoyo:true,repeat:1});
      } else {
        // fallback tiny tweak
        crystal.scale.set(1.04,1.04,1.04);
        setTimeout(()=>crystal.scale.set(1,1,1),120);
      }
    }

    function pulseHeal(){
      if(typeof gsap!=='undefined'){
        gsap.to(crystal.scale,{x:1.04,y:1.04,z:1.04,duration:0.12,yoyo:true,repeat:1});
        gsap.to(materials.emissive,{r:0.8,g:1.0,b:1.0,duration:0.2,yoyo:true,repeat:1});
      } else {
        crystal.scale.set(1.03,1.03,1.03);
        setTimeout(()=>crystal.scale.set(1,1,1),160);
      }
    }

    // expose
    return { updateAlignment, pulseDamage, pulseHeal, isThree:true };
  }

  // ---------- 2D fallback (no THREE)
  const ctx = canvas2d.getContext('2d');
  canvas2d.style.display = 'block';
  let angle = 0, bob = 0, bobDir=1, crackOpacity=0;
  function draw(){
    const w = canvas2d.width, h = canvas2d.height;
    ctx.clearRect(0,0,w,h);
    const color = colorForAlignment(state.alignment);
    ctx.save();
    ctx.translate(w/2, h/2 + bob);
    ctx.rotate(angle);

    // simple faceted crystal
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0,-90);
    ctx.lineTo(40,-20);
    ctx.lineTo(70,0);
    ctx.lineTo(40,20);
    ctx.lineTo(0,90);
    ctx.lineTo(-40,20);
    ctx.lineTo(-70,0);
    ctx.lineTo(-40,-20);
    ctx.closePath();
    ctx.fill();

    // cracks
    if(crackOpacity>0){
      ctx.globalAlpha = crackOpacity;
      ctx.strokeStyle = "#fff";
      ctx.beginPath();
      ctx.moveTo(-20,-10); ctx.lineTo(10,-40);
      ctx.moveTo(15,10); ctx.lineTo(-25,50);
      ctx.moveTo(30,-5); ctx.lineTo(0,30);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    ctx.restore();
    angle += 0.01;
    bob += bobDir*0.25; if(Math.abs(bob)>6) bobDir *= -1;
    crackOpacity = state.alignment>=70 ? Math.min(1, crackOpacity+0.02) : Math.max(0, crackOpacity-0.02);
    requestAnimationFrame(draw);
  }
  draw();

  function updateAlignment(a){ state.alignment=a; }
  function pulseDamage(){ /* minor wobble */ }
  function pulseHeal(){ /* minor glow */ }

  return { updateAlignment, pulseDamage, pulseHeal, isThree:false };
})();
