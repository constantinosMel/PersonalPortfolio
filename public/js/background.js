class ParticleBackground {
    constructor() {
        this.container = document.getElementById('bg-canvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        this.clock = new THREE.Clock();
        this.mouse = new THREE.Vector2(0, 0);
        this.targetMouse = new THREE.Vector2(0, 0);
        this.particles = null;
        this.particleSystem = null;
        this.connections = [];
        this.numParticles = 200;
        this.maxConnections = 150;
        this.connectionDistance = 100;

        // Setup camera first
        this.camera.position.z = 300;
        
        // Calculate initial bounds
        this.bounds = this.calculateBounds();
        
        // Initialize the scene
        this.init();
        
        // Force initial resize to ensure correct positioning
        this.onWindowResize();
        
        // Initial connection update
        this.updateConnections();
    }

    calculateBounds() {
        const fov = this.camera.fov * (Math.PI / 180);
        const height = 2 * Math.tan(fov / 2) * Math.abs(this.camera.position.z);
        const width = height * this.camera.aspect;
        return {
            x: width / 2,
            y: height / 2,
            z: 100
        };
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Create particles with initial spread based on bounds
        const particles = new Float32Array(this.numParticles * 3);
        const colors = new Float32Array(this.numParticles * 3);
        const sizes = new Float32Array(this.numParticles);
        const velocities = [];

        const spread = {
            x: this.bounds.x * 1.5,
            y: this.bounds.y * 1.5,
            z: this.bounds.z * 0.5
        };

        for (let i = 0; i < this.numParticles; i++) {
            const i3 = i * 3;
            // Position - ensure good initial spread
            particles[i3] = (Math.random() - 0.5) * spread.x;
            particles[i3 + 1] = (Math.random() - 0.5) * spread.y;
            particles[i3 + 2] = (Math.random() - 0.5) * spread.z;

            // Color - Cyan to purple gradient
            const hue = 0.5 + Math.random() * 0.2; // Cyan base
            const saturation = 0.7 + Math.random() * 0.3;
            const lightness = 0.6 + Math.random() * 0.2;
            const color = new THREE.Color().setHSL(hue, saturation, lightness);
            
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            // Size - Varied particle sizes
            sizes[i] = Math.random() * 3 + 2;

            // Velocity - Slower, more controlled movement
            velocities.push({
                x: (Math.random() - 0.5) * 0.2,
                y: (Math.random() - 0.5) * 0.2,
                z: (Math.random() - 0.5) * 0.1
            });
        }

        // Create geometry
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(particles, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Create material with improved particle rendering
        const material = new THREE.ShaderMaterial({
            vertexShader: `
                attribute float size;
                varying vec3 vColor;
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;
                    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        // Create particle system
        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);

        // Create line material for connections
        this.lineMaterial = new THREE.LineBasicMaterial({
            color: 0x64ffda,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        // Store particles and velocities
        this.particles = particles;
        this.velocities = velocities;

        // Event listeners
        window.addEventListener('resize', this.onWindowResize.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this), { passive: true });

        // Start animation
        this.animate();
    }

    updateParticles() {
        const positions = this.particleSystem.geometry.attributes.position.array;
        const mouseInfluenceRadius = 150;
        const mouseForce = 0.2;

        for (let i = 0; i < this.numParticles; i++) {
            const i3 = i * 3;
            
            // Update position based on velocity
            positions[i3] += this.velocities[i].x;
            positions[i3 + 1] += this.velocities[i].y;
            positions[i3 + 2] += this.velocities[i].z;

            // Mouse influence
            const dx = positions[i3] - this.mouse.x * this.bounds.x;
            const dy = positions[i3 + 1] - this.mouse.y * this.bounds.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouseInfluenceRadius) {
                const force = (mouseInfluenceRadius - dist) / mouseInfluenceRadius;
                this.velocities[i].x += (dx / dist) * force * mouseForce;
                this.velocities[i].y += (dy / dist) * force * mouseForce;
            }

            // Boundary check with smooth wrapping
            if (Math.abs(positions[i3]) > this.bounds.x) {
                positions[i3] = Math.sign(positions[i3]) * -this.bounds.x * 0.9;
            }
            if (Math.abs(positions[i3 + 1]) > this.bounds.y) {
                positions[i3 + 1] = Math.sign(positions[i3 + 1]) * -this.bounds.y * 0.9;
            }
            if (Math.abs(positions[i3 + 2]) > this.bounds.z) {
                positions[i3 + 2] = Math.sign(positions[i3 + 2]) * -this.bounds.z * 0.9;
            }

            // Apply friction
            this.velocities[i].x *= 0.99;
            this.velocities[i].y *= 0.99;
            this.velocities[i].z *= 0.99;
        }

        this.particleSystem.geometry.attributes.position.needsUpdate = true;
    }

    updateConnections() {
        // Remove old connections
        this.connections.forEach(line => this.scene.remove(line));
        this.connections = [];

        const positions = this.particleSystem.geometry.attributes.position.array;
        const connections = [];

        // Find close particles
        for (let i = 0; i < this.numParticles; i++) {
            const i3 = i * 3;
            const p1 = new THREE.Vector3(
                positions[i3],
                positions[i3 + 1],
                positions[i3 + 2]
            );

            for (let j = i + 1; j < this.numParticles; j++) {
                const j3 = j * 3;
                const p2 = new THREE.Vector3(
                    positions[j3],
                    positions[j3 + 1],
                    positions[j3 + 2]
                );

                const distance = p1.distanceTo(p2);

                if (distance < this.connectionDistance) {
                    const opacity = 1 - (distance / this.connectionDistance);
                    connections.push({
                        points: [p1, p2],
                        distance: distance,
                        opacity: opacity
                    });
                }
            }
        }

        // Sort connections by distance and keep only the closest ones
        connections
            .sort((a, b) => a.distance - b.distance)
            .slice(0, this.maxConnections)
            .forEach(connection => {
                const geometry = new THREE.BufferGeometry().setFromPoints(connection.points);
                const material = this.lineMaterial.clone();
                material.opacity = connection.opacity * 0.15;
                const line = new THREE.Line(geometry, material);
                this.scene.add(line);
                this.connections.push(line);
            });
    }

    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);

        // Update bounds
        this.bounds = this.calculateBounds();
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Update particles
        this.updateParticles();

        // Update connections every few frames for performance
        if (this.clock.getElapsedTime() % 3 < 0.1) {
            this.updateConnections();
        }

        // Gentle rotation
        this.particleSystem.rotation.y += 0.0002;
        this.particleSystem.rotation.x += 0.0001;

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize background
document.addEventListener('DOMContentLoaded', () => {
    new ParticleBackground();
}); 