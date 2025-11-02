import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Link } from "react-router-dom";

export default function ReFrostHero() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.4, 2.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1.3);
    light.position.set(2, 3, 2);
    scene.add(light);

    const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
    const cubeMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.2,
      transmission: 0.9,
      thickness: 1.2,
    });
    const cube = new THREE.Mesh(cubeGeo, cubeMat);
    scene.add(cube);

    const coreGeo = new THREE.SphereGeometry(0.28, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x94e6ff });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    const particleCount = 140;
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 1.7;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1.7 + 0.35;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.7;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.026,
      color: 0x94e6ff,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.y += 0.004;
      cube.rotation.x += 0.002;
      core.rotation.y -= 0.003;
      particles.rotation.y += 0.0009;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      mount.removeChild(renderer.domElement);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section className="w-full min-h-screen flex items-center bg-gradient-to-b from-[#F7FBFF] to-[#E8F4FF] font-inter">
      <div className="max-w-6xl w-full mx-auto px-6 lg:px-10 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT CONTENT — minimal enterprise */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 ">
              <img src="/image.png" className="w-9 h-9 rounded" />
              <h2 className="text-2xl font-bold text-[#0A6FB7]">ReFrost</h2>
            </div>

            <span className="text-xs tracking-widest text-slate-500 uppercase">
              Cold-Chain AI Platform
            </span>

            <h1 className="text-5xl font-semibold text-slate-900 leading-tight">
              Precision cooling.
              <br />
              Confidence in every shipment.
            </h1>

            <p className="text-lg text-slate-600 max-w-md leading-relaxed">
              End-to-end temperature security for critical shipments, powered by
              intelligent sensors and real-time alerts.
            </p>

            <div className="flex gap-4 pt-2">
              <Link to="/dashboard">
                <button className="px-6 py-3 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition">
                  Launch Dashboard
                </button>
              </Link>

              <a className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition">
                Request Access
              </a>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-4 max-w-sm">
              {[
                { label: "Accuracy", value: "±0.3°C" },
                { label: "Uptime", value: "99.98%" },
                { label: "Alerts", value: "Instant" },
              ].map((s, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="text-xs text-slate-500 uppercase tracking-wide">
                    {s.label}
                  </span>
                  <span className="text-lg font-semibold text-slate-900">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — 3D */}
          <div className="relative w-full h-[600px] flex items-center justify-center">
            <div ref={mountRef} className="absolute inset-0 w-full h-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
