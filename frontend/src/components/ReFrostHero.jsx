import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

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

    const pmrem = new THREE.PMREMGenerator(renderer);
    new THREE.TextureLoader().load("/ice-env.png", (tex) => {
      const env = pmrem.fromEquirectangular(tex).texture;
      scene.environment = env;
      scene.background = null;
      tex.dispose();
      pmrem.dispose();
    });

    const light = new THREE.DirectionalLight(0xffffff, 1.4);
    light.position.set(2, 3, 2);
    scene.add(light);

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.18,
        transmission: 0.75,
        thickness: 2.2,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        attenuationColor: 0x93d8ff,
        attenuationDistance: 1.3,
      })
    );
    cube.position.y = 0.1;
    scene.add(cube);

    const count = 140;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 1.7;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1.7 + 0.35;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.7;
    }

    const particles = new THREE.Points(
      new THREE.BufferGeometry().setAttribute(
        "position",
        new THREE.BufferAttribute(pos, 3)
      ),
      new THREE.PointsMaterial({
        size: 0.026,
        color: 0x9ad7ff,
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
      })
    );

    scene.add(particles);

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.y += 0.004;
      cube.rotation.x += 0.002;
      particles.rotation.y += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    const resize = () => {
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", resize);

    return () => {
      mount.removeChild(renderer.domElement);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="w-full min-h-screen bg-[#07101c] text-white font-sans relative overflow-hidden">
      <Navbar isLoggedIn={false} />

      <div className="max-w-6xl w-full mx-auto px-6 lg:px-10 h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          <div className="flex flex-col gap-4">
            <span className="text-xs pt-6 tracking-widest text-blue-300 uppercase">
              Cold-Chain AI Platform
            </span>

            <h1 className="text-5xl font-semibold leading-tight text-white">
              Precision cooling.
              <br />
              Confidence in every shipment.
            </h1>

            <p className="text-lg text-blue-200 max-w-md leading-relaxed">
              Cold Chain Intelligence that sees every risk and predicts every
              threat.
            </p>

            <Link to="/dashboard">
              <button className="px-6 py-3 rounded-lg bg-[#7ac9f4] text-[#07101c] text-sm font-semibold hover:bg-[#68bde9] transition">
                Launch Dashboard
              </button>
            </Link>

            <div className="grid grid-cols-3 gap-6 pt-4 max-w-sm">
              {[
                { label: "Accuracy", value: "±0.3°C" },
                { label: "Uptime", value: "99.98%" },
                { label: "Alerts", value: "Instant" },
              ].map((s, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="text-xs text-blue-300 uppercase tracking-wide">
                    {s.label}
                  </span>
                  <span className="text-lg font-semibold text-white">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative w-full h-[600px] flex items-center justify-center">
            <div ref={mountRef} className="absolute inset-0 w-full h-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
