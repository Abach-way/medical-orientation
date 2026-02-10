/**
 * 3D Organ Models — оптимизированная загрузка GLB-моделей.
 *
 * Оптимизации производительности:
 *  • Карточки рендерятся только когда видны на экране (IntersectionObserver)
 *  • Карточки: без теней, без антиалиаса, 2 источника света, 30 fps
 *  • Модальное окно: полное качество (тени, антиалиас, 60 fps)
 *  • Pixel ratio ограничен (1.0 для карточек, 1.5 для модального)
 */

const Organs3DEngine = (() => {

    const entries  = {};
    let THREE_OK   = false;
    let GLTF_OK    = false;
    let observer   = null;       // IntersectionObserver

    const ORGAN_CFG = {
        heart:   { file: 'heart.glb',            color: 0xc0392b, camZ: 5,   scale: 1.0 },
        brain:   { file: 'brain.glb',            color: 0xe8b4d8, camZ: 5,   scale: 1.0 },
        lungs:   { file: 'lungs.glb',            color: 0xf5b7b1, camZ: 5.5, scale: 1.0 },
        liver:   { file: 'liver.glb',            color: 0x8b4513, camZ: 5,   scale: 1.0 },
        kidneys: { file: 'kidney.glb',           color: 0xc0392b, camZ: 5,   scale: 1.0 },
        stomach: { file: 'stomach_-_organ.glb',  color: 0xf5b7b1, camZ: 5,   scale: 1.0 }
    };

    /* ── helpers ──────────────────────────────────────────────── */

    function normalizeModel(obj) {
        var box    = new THREE.Box3().setFromObject(obj);
        var center = box.getCenter(new THREE.Vector3());
        var size   = box.getSize(new THREE.Vector3());
        var s      = 3 / Math.max(size.x, size.y, size.z);
        obj.position.sub(center);
        obj.scale.multiplyScalar(s);
    }

    function showPlaceholder(container, organKey) {
        var cfg = ORGAN_CFG[organKey] || {};
        container.innerHTML =
            '<div style="display:flex;flex-direction:column;align-items:center;' +
            'justify-content:center;height:100%;color:#aaa;font-size:13px;' +
            'text-align:center;padding:12px;gap:6px;user-select:none">' +
            '<i class="fas fa-cube" style="font-size:32px;opacity:.35"></i>' +
            '<span>Поместите <b>' + (cfg.file || '') + '</b><br>в <code>/models/</code></span></div>';
    }

    function showLoader(container) {
        container.innerHTML =
            '<div style="display:flex;align-items:center;justify-content:center;' +
            'height:100%;color:#666;gap:8px;font-size:13px">' +
            '<i class="fas fa-spinner fa-spin"></i> Загрузка…</div>';
    }

    /* ── Создание сцены ──────────────────────────────────────── */

    function createScene(container, organKey, isModal) {
        var w   = container.clientWidth  || 260;
        var h   = container.clientHeight || 260;
        var cfg = ORGAN_CFG[organKey];

        var scene  = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
        camera.position.set(0, 0, isModal ? cfg.camZ * 1.1 : cfg.camZ);

        /* ── Рендерер: карточки = лёгкий, модаль = качественный ── */
        var renderer = new THREE.WebGLRenderer({
            antialias: isModal,          // антиалиас только в модальном
            alpha: true,
            powerPreference: 'low-power' // экономим GPU
        });
        renderer.setSize(w, h);
        renderer.setPixelRatio(isModal ? Math.min(window.devicePixelRatio, 1.5) : 1);
        renderer.setClearColor(0x000000, 0);
        renderer.outputEncoding = THREE.sRGBEncoding;

        if (isModal) {
            /* Только модальное окно получает тени и тонмаппинг */
            renderer.shadowMap.enabled     = true;
            renderer.shadowMap.type        = THREE.PCFShadowMap; // быстрее чем PCFSoft
            renderer.toneMapping           = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure   = 1.3;
        }

        container.innerHTML = '';
        container.appendChild(renderer.domElement);

        /* ── Освещение ── */
        scene.add(new THREE.AmbientLight(0xffffff, isModal ? 0.6 : 0.7));

        var keyLight = new THREE.DirectionalLight(0xffffff, isModal ? 1.4 : 1.2);
        keyLight.position.set(4, 5, 6);
        if (isModal) keyLight.castShadow = true;
        scene.add(keyLight);

        if (isModal) {
            /* Доп. свет только в модальном */
            var fill = new THREE.DirectionalLight(0x8899cc, 0.4);
            fill.position.set(-4, 2, 4);
            scene.add(fill);

            var rim = new THREE.DirectionalLight(0xffc0a0, 0.3);
            rim.position.set(0, -3, -5);
            scene.add(rim);
        }

        /* ── OrbitControls (только модальное или если есть) ── */
        var controls = null;
        if (isModal && typeof THREE.OrbitControls !== 'undefined') {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping   = true;
            controls.dampingFactor   = 0.08;
            controls.enablePan       = false;
            controls.minDistance     = 2;
            controls.maxDistance     = 12;
            controls.autoRotate     = true;
            controls.autoRotateSpeed = 1.5;
        }

        return {
            scene: scene,
            camera: camera,
            renderer: renderer,
            controls: controls,
            organObj: null,
            animId: null,
            visible: true,       // IntersectionObserver будет менять
            isModal: isModal,
            lastFrame: 0         // для троттлинга карточек
        };
    }

    /* ── Загрузка GLB ────────────────────────────────────────── */

    function loadModel(entry, container, organKey) {
        var cfg    = ORGAN_CFG[organKey];
        var loader = new THREE.GLTFLoader();

        showLoader(container);

        loader.load(
            'models/' + cfg.file,
            function (gltf) {
                var model = gltf.scene;
                normalizeModel(model);
                model.scale.multiplyScalar(cfg.scale);

                model.traverse(function (child) {
                    if (!child.isMesh) return;
                    if (entry.isModal) {
                        child.castShadow    = true;
                        child.receiveShadow = true;
                    }
                    if (child.material) {
                        child.material.side = THREE.DoubleSide;
                        if (child.material.map)
                            child.material.map.encoding = THREE.sRGBEncoding;
                    }
                });

                entry.organObj = model;
                entry.scene.add(model);

                container.innerHTML = '';
                container.appendChild(entry.renderer.domElement);

                startAnimation(entry, organKey);
            },
            undefined,
            function () { showPlaceholder(container, organKey); }
        );
    }

    /* ── Анимация ────────────────────────────────────────────── */

    var CARD_INTERVAL = 1000 / 45;   // 45 fps для карточек

    function startAnimation(entry, organKey) {
        var t = 0;
        var baseScale = entry.organObj
            ? entry.organObj.scale.clone()
            : new THREE.Vector3(1, 1, 1);

        function loop(now) {
            entry.animId = requestAnimationFrame(loop);

            /* ── Пропуск: невидимые карточки не рендерим ── */
            if (!entry.visible) return;

            /* ── Троттлинг карточек до 30 fps ── */
            if (!entry.isModal) {
                if (now - entry.lastFrame < CARD_INTERVAL) return;
                entry.lastFrame = now;
            }

            t += entry.isModal ? 0.008 : 0.012;

            if (entry.organObj) {
                if (!entry.controls) {
                    entry.organObj.rotation.y = t * 0.5;
                }
                entry.organObj.position.y = Math.sin(t * 1.5) * 0.06;

                if (organKey === 'heart') {
                    var pulse = 1 + 0.03 * Math.sin(t * 6);
                    entry.organObj.scale.set(
                        baseScale.x * pulse,
                        baseScale.y * pulse,
                        baseScale.z * pulse);
                }
                if (organKey === 'lungs') {
                    var br = 1 + 0.025 * Math.sin(t * 2);
                    entry.organObj.scale.set(
                        baseScale.x * br,
                        baseScale.y,
                        baseScale.z * br);
                }
            }

            if (entry.controls) entry.controls.update();
            entry.renderer.render(entry.scene, entry.camera);
        }
        loop(0);
    }

    /* ── Drag-вращение (для карточек без OrbitControls) ───────── */

    function enableDrag(container, entry) {
        if (entry.controls) return;

        var dragging = false, px = 0, py = 0;
        var onStart = function (x, y) { dragging = true; px = x; py = y; };
        var onMove  = function (x, y) {
            if (!dragging || !entry.organObj) return;
            entry.organObj.rotation.y += (x - px) * 0.01;
            entry.organObj.rotation.x += (y - py) * 0.01;
            px = x; py = y;
        };
        var onEnd = function () { dragging = false; };

        container.addEventListener('mousedown',  function (e) { onStart(e.clientX, e.clientY); });
        container.addEventListener('mousemove',  function (e) { onMove(e.clientX, e.clientY); });
        container.addEventListener('mouseup',    onEnd);
        container.addEventListener('mouseleave', onEnd);
        container.addEventListener('touchstart', function (e) {
            onStart(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });
        container.addEventListener('touchmove', function (e) {
            onMove(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });
        container.addEventListener('touchend', onEnd, { passive: true });
    }

    /* ── IntersectionObserver —  рендерим только видимые ──────── */

    function setupVisibility() {
        if (typeof IntersectionObserver === 'undefined') return;

        observer = new IntersectionObserver(function (items) {
            items.forEach(function (item) {
                var key = item.target.dataset.organKey;
                if (key && entries[key]) {
                    entries[key].visible = item.isIntersecting;
                }
            });
        }, { threshold: 0.05 });
    }

    /* ── Публичный API ───────────────────────────────────────── */

    function initCards() {
        if (typeof THREE === 'undefined') {
            console.warn('[Organs3D] Three.js не загружен');
            return;
        }
        THREE_OK = true;
        GLTF_OK  = typeof THREE.GLTFLoader !== 'undefined';

        setupVisibility();

        var organs = ['heart', 'brain', 'lungs', 'liver', 'kidneys', 'stomach'];

        organs.forEach(function (key) {
            var el = document.getElementById('organ-canvas-' + key);
            if (!el) return;

            if (entries[key]) {
                cancelAnimationFrame(entries[key].animId);
                entries[key].renderer.dispose();
            }

            el.dataset.organKey = key;

            var entry = createScene(el, key, false);
            entries[key] = entry;

            if (GLTF_OK) {
                loadModel(entry, el, key);
            } else {
                showPlaceholder(el, key);
            }
            enableDrag(el, entry);

            if (observer) observer.observe(el);
        });
    }

    function initModal(organKey) {
        if (!THREE_OK) return;

        var el = document.getElementById('organ-detail-3d');
        if (!el) return;

        if (entries['modal']) {
            cancelAnimationFrame(entries['modal'].animId);
            entries['modal'].renderer.dispose();
        }

        var entry = createScene(el, organKey, true);
        entries['modal'] = entry;

        if (GLTF_OK) {
            loadModel(entry, el, organKey);
        } else {
            showPlaceholder(el, organKey);
        }
        enableDrag(el, entry);
    }

    function onResize() {
        Object.keys(entries).forEach(function (k) {
            var e = entries[k];
            var parent = e.renderer.domElement.parentElement;
            if (!parent) return;
            var w = parent.clientWidth;
            var h = parent.clientHeight;
            e.renderer.setSize(w, h);
            e.camera.aspect = w / h;
            e.camera.updateProjectionMatrix();
        });
    }

    function dispose() {
        if (observer) { observer.disconnect(); observer = null; }
        Object.keys(entries).forEach(function (k) {
            cancelAnimationFrame(entries[k].animId);
            entries[k].renderer.dispose();
            delete entries[k];
        });
    }

    window.addEventListener('resize', function () {
        clearTimeout(window._organs3dResize);
        window._organs3dResize = setTimeout(onResize, 250);
    });

    return { initCards: initCards, initModal: initModal, dispose: dispose, onResize: onResize };
})();
