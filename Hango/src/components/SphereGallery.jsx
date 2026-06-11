import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { galleryProjects } from "../constants/galleryProjects";

const hasLink = (project) => project.link && project.link !== "#";

/* ------------------------------------------------------------------ */
/*  Hango brand colors                                                 */
/* ------------------------------------------------------------------ */
const COLORS = {
  bg: "#f5f5f7",
  card: "#ffffff",
  border: "#d2d2d7",
  text: "#1d1d1f",
  muted: "#86868b",
  accent: "#2997FF",
};

/* ------------------------------------------------------------------ */
/*  Sphere layout                                                      */
/* ------------------------------------------------------------------ */
const RADIUS = 10;
const COLS = 8; // cards per ring
const ROW_OFFSETS = [-32, 0, 32]; // degrees from equator
const PHI_LEN = THREE.MathUtils.degToRad(40); // card width
const THETA_LEN = THREE.MathUtils.degToRad(26); // card height
const COL_STEP = (Math.PI * 2) / COLS;

// browser window: 88px toolbar + 1024x576 (16:9) viewport
const TEX_W = 1024;
const TEX_H = 664;
const BAR_H = 88;

/* ------------------------------------------------------------------ */
/*  Card texture — drawn on a canvas in Hango's light style            */
/* ------------------------------------------------------------------ */
function drawCard(ctx, project, img, hover = false) {
  const W = TEX_W;
  const H = TEX_H;
  const R = 26; // window corner radius

  const mono = (px, weight = 500) =>
    `${weight} ${px}px "SF Mono", "Roboto Mono", Menlo, monospace`;

  ctx.clearRect(0, 0, W, H);

  // ---- browser window shape (rounded, transparent corners) ----
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, W, H, R);
  ctx.clip();

  // toolbar
  ctx.fillStyle = hover ? "#ffffff" : COLORS.bg;
  ctx.fillRect(0, 0, W, BAR_H);

  // traffic lights
  const lights = ["#ff5f57", "#febc2e", "#28c840"];
  lights.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(46 + i * 38, BAR_H / 2, 11, 0, Math.PI * 2);
    ctx.fill();
  });

  // URL pill
  ctx.font = mono(26, 600);
  const url = project.domain.toLowerCase();
  const tw = ctx.measureText(url).width;
  const pillW = tw + 96;
  const pillH = 54;
  const pillX = (W - pillW) / 2;
  const pillY = (BAR_H - pillH) / 2;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, pillH / 2);
  ctx.fill();
  ctx.strokeStyle = hover ? COLORS.accent : COLORS.border;
  ctx.lineWidth = hover ? 3 : 2;
  ctx.stroke();

  // little padlock
  const lx = pillX + 34;
  const ly = BAR_H / 2;
  ctx.strokeStyle = hover ? COLORS.accent : COLORS.muted;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(lx, ly - 5, 6, Math.PI, 0);
  ctx.stroke();
  ctx.fillStyle = hover ? COLORS.accent : COLORS.muted;
  ctx.beginPath();
  ctx.roundRect(lx - 9, ly - 5, 18, 14, 3);
  ctx.fill();

  // URL text
  ctx.fillStyle = hover ? COLORS.accent : COLORS.text;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(url, lx + 18, ly + 2);

  // year, right side of toolbar
  ctx.fillStyle = COLORS.muted;
  ctx.font = mono(24, 600);
  ctx.textAlign = "right";
  ctx.fillText(project.year, W - 36, ly + 2);

  // hairline under toolbar
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, BAR_H);
  ctx.lineTo(W, BAR_H);
  ctx.stroke();

  // ---- viewport: screenshot fills the window (16:9) ----
  const vy = BAR_H;
  const vh = H - BAR_H;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, vy, W, vh);
  if (img && img.complete && img.naturalWidth > 0) {
    if (project.fit === "contain") {
      const s = Math.min(W / img.naturalWidth, vh / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      ctx.drawImage(img, (W - dw) / 2, vy + (vh - dh) / 2, dw, dh);
    } else {
      const s = Math.max(W / img.naturalWidth, vh / img.naturalHeight);
      const sw = W / s;
      const sh = vh / s;
      const sx = (img.naturalWidth - sw) / 2;
      const sy = (img.naturalHeight - sh) / 2;
      ctx.drawImage(img, sx, sy, sw, sh, 0, vy, W, vh);
    }
  }
  ctx.restore();

  // outer window border
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(1.5, 1.5, W - 3, H - 3, R);
  ctx.stroke();
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
const SphereGallery = () => {
  const mountRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    /* ----- renderer / scene / camera ----- */
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(COLORS.bg);

    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 0);
    camera.rotation.order = "YXZ";

    const group = new THREE.Group();
    scene.add(group);

    /* ----- build cards ----- */
    const meshes = [];
    const disposables = [];

    ROW_OFFSETS.forEach((rowDeg, row) => {
      const thetaCenter = Math.PI / 2 + THREE.MathUtils.degToRad(rowDeg);
      const thetaStart = thetaCenter - THETA_LEN / 2;
      const geometry = new THREE.SphereGeometry(
        RADIUS,
        24,
        16,
        Math.PI / 2 - PHI_LEN / 2,
        PHI_LEN,
        thetaStart,
        THETA_LEN
      );
      disposables.push(geometry);

      for (let col = 0; col < COLS; col++) {
        const project = galleryProjects[(row * COLS + col) % galleryProjects.length];

        const canvas = document.createElement("canvas");
        canvas.width = TEX_W;
        canvas.height = TEX_H;
        const ctx = canvas.getContext("2d");
        drawCard(ctx, project, null);

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        // viewed from inside the sphere → un-mirror horizontally
        texture.wrapS = THREE.RepeatWrapping;
        texture.repeat.x = -1;
        disposables.push(texture);

        const img = new Image();
        img.src = project.image;
        img.onload = () => {
          drawCard(ctx, project, img);
          texture.needsUpdate = true;
        };

        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.BackSide,
          toneMapped: false,
          transparent: true, // rounded window corners
        });
        disposables.push(material);

        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.y = col * COL_STEP + (row % 2 ? COL_STEP / 2 : 0);
        mesh.userData = { project, ctx, img, texture, hover: false };
        group.add(mesh);
        meshes.push(mesh);
      }
    });

    /* ----- lenis-style eased rotation state ----- */
    const rot = { yaw: 0, pitch: 0, tYaw: 0, tPitch: 0 };
    const EASE = 0.07;
    const PITCH_MAX = 0.5;

    let dragging = false;
    let moved = 0;
    let lastX = 0;
    let lastY = 0;
    let velX = 0;
    let velY = 0;
    let transitioning = false;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const setPointer = (e) => {
      const r = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    };

    const pick = (e) => {
      setPointer(e);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(meshes, false);
      return hits.length ? hits[0].object : null;
    };

    const setHover = (mesh) => {
      meshes.forEach((m) => {
        const want = m === mesh;
        if (m.userData.hover !== want) {
          m.userData.hover = want;
          drawCard(m.userData.ctx, m.userData.project, m.userData.img, want);
          m.userData.texture.needsUpdate = true;
          gsap.to(m.scale, {
            x: want ? 0.96 : 1,
            y: want ? 0.96 : 1,
            z: want ? 0.96 : 1,
            duration: 0.5,
            ease: "power3.out",
          });
        }
      });
      mount.style.cursor =
        mesh && hasLink(mesh.userData.project)
          ? "pointer"
          : dragging
            ? "grabbing"
            : "grab";
    };

    /* ----- pointer handlers ----- */
    const onDown = (e) => {
      if (transitioning) return;
      dragging = true;
      moved = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      velX = 0;
      velY = 0;
      mount.style.cursor = "grabbing";
      mount.setPointerCapture?.(e.pointerId);
    };

    const onMove = (e) => {
      if (transitioning) return;
      if (dragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        moved += Math.abs(dx) + Math.abs(dy);
        rot.tYaw += dx * 0.0035;
        rot.tPitch = THREE.MathUtils.clamp(
          rot.tPitch + dy * 0.0028,
          -PITCH_MAX,
          PITCH_MAX
        );
        velX = dx;
        velY = dy;
      } else {
        setHover(pick(e));
      }
    };

    const openProject = (mesh) => {
      transitioning = true;
      const { project } = mesh.userData;
      gsap.to(mesh.scale, {
        x: 0.8,
        y: 0.8,
        z: 0.8,
        duration: 0.7,
        ease: "power3.inOut",
      });
      gsap.to(camera, {
        fov: 38,
        duration: 0.7,
        ease: "power3.inOut",
        onUpdate: () => camera.updateProjectionMatrix(),
      });
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.6,
        delay: 0.15,
        ease: "power2.in",
        // open live site after the zoom/fade animation
        onComplete: () => {
          window.location.href = project.link;
        },
      });
    };

    const onUp = (e) => {
      if (transitioning) return;
      dragging = false;
      mount.style.cursor = "grab";
      if (moved < 6) {
        const mesh = pick(e);
        // only cards with a live link are clickable
        if (mesh && hasLink(mesh.userData.project)) openProject(mesh);
      } else {
        // inertia → glide out with easing
        rot.tYaw += velX * 0.045;
        rot.tPitch = THREE.MathUtils.clamp(
          rot.tPitch + velY * 0.03,
          -PITCH_MAX,
          PITCH_MAX
        );
      }
    };

    const onWheel = (e) => {
      if (transitioning) return;
      e.preventDefault();
      rot.tYaw += e.deltaY * 0.0009 + e.deltaX * 0.0012;
    };

    mount.addEventListener("pointerdown", onDown);
    mount.addEventListener("pointermove", onMove);
    mount.addEventListener("pointerup", onUp);
    mount.addEventListener("pointerleave", onUp);
    mount.addEventListener("wheel", onWheel, { passive: false });
    mount.style.cursor = "grab";

    /* ----- intro zoom ----- */
    camera.fov = 92;
    camera.updateProjectionMatrix();
    gsap.to(camera, {
      fov: 60,
      duration: 1.4,
      ease: "power3.out",
      onUpdate: () => camera.updateProjectionMatrix(),
    });
    gsap.fromTo(
      overlayRef.current,
      { opacity: 1 },
      { opacity: 0, duration: 0.8, ease: "power2.out" }
    );
    rot.tYaw = 0.35; // gentle drift-in

    /* ----- resize ----- */
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    /* ----- loop ----- */
    let raf;
    const tick = () => {
      rot.yaw += (rot.tYaw - rot.yaw) * EASE;
      rot.pitch += (rot.tPitch - rot.pitch) * EASE;
      camera.rotation.y = rot.yaw;
      camera.rotation.x = rot.pitch;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    /* ----- cleanup ----- */
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("pointerdown", onDown);
      mount.removeEventListener("pointermove", onMove);
      mount.removeEventListener("pointerup", onUp);
      mount.removeEventListener("pointerleave", onUp);
      mount.removeEventListener("wheel", onWheel);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-40 bg-[#f5f5f7]">
      {/* three.js canvas */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* soft vignette in brand background color */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(245,245,247,0) 55%, rgba(245,245,247,0.85) 100%)",
        }}
      />

      {/* white transition overlay */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 bg-white"
        style={{ opacity: 0 }}
      />
    </div>
  );
};

export default SphereGallery;
