// ==========================================
// MODEL (Datos, Estado y Reglas de Negocio)
// ==========================================
const Model = {
    state: {
        lives: 3,
        level: 1,
        maxLevel: 10,
        item: null,
        mapTree: [],
        currentNodeId: '0-0',
        triviaTimeLeft: 15
    },

    TRIVIA_QUESTIONS: [],

    NODE_TYPES: {
        TRIVIA: { id: 'trivia', icon: '❓', chance: 0.6 },
        ITEM: { id: 'item', icon: '📦', chance: 0.2 },
        REFUGE: { id: 'refuge', icon: '🛡️', chance: 0.2 }
    },

    initGame() {
        this.state.lives = 3;
        this.state.level = 1;
        this.state.item = null;
        this.state.currentNodeId = '0-0';
    },

    generateMapTree() {
        this.state.mapTree = [];
        for (let i = 0; i < this.state.maxLevel; i++) {
            let rowNodesCount = (i === 0 || i === this.state.maxLevel - 1) ? 1 : Math.floor(Math.random() * 2) + 2;
            let row = [];

            for (let j = 0; j < rowNodesCount; j++) {
                let type = this.getRandomNodeType();
                if (i === 0 || i === this.state.maxLevel - 1) type = this.NODE_TYPES.TRIVIA;

                row.push({
                    id: `${i}-${j}`,
                    row: i,
                    col: j,
                    type: type,
                    connections: []
                });
            }
            this.state.mapTree.push(row);
        }

        // Generar conexiones
        for (let i = 0; i < this.state.maxLevel - 1; i++) {
            const currentRow = this.state.mapTree[i];
            const nextRow = this.state.mapTree[i + 1];

            // Paso 1: Conectar hacia adelante
            currentRow.forEach((node, idx) => {
                let targetIdx = Math.min(idx, nextRow.length - 1);
                node.connections.push(nextRow[targetIdx].id);

                if (nextRow.length > 1 && Math.random() > 0.5) {
                    let altIdx = (targetIdx + 1) % nextRow.length;
                    if (!node.connections.includes(nextRow[altIdx].id)) {
                        node.connections.push(nextRow[altIdx].id);
                    }
                }
            });

            // Paso 2: Asegurar que todo nodo siguiente tenga conexión entrante
            nextRow.forEach(nextNode => {
                const hasIncoming = currentRow.some(n => n.connections.includes(nextNode.id));
                if (!hasIncoming) {
                    const randCurrNode = currentRow[Math.floor(Math.random() * currentRow.length)];
                    randCurrNode.connections.push(nextNode.id);
                }
            });
        }
    },

    getRandomNodeType() {
        const rand = Math.random();
        let cumulative = 0;
        for (let key in this.NODE_TYPES) {
            cumulative += this.NODE_TYPES[key].chance;
            if (rand <= cumulative) return this.NODE_TYPES[key];
        }
        return this.NODE_TYPES.TRIVIA;
    },

    getRandomTrivia() {
        return this.TRIVIA_QUESTIONS[Math.floor(Math.random() * this.TRIVIA_QUESTIONS.length)];
    },

    applyDamage() {
        if (this.state.item === "Parche Seguridad") {
            this.state.item = null;
            return false; // No damage taken because item was used
        } else {
            this.state.lives--;
            return true; // Damage taken
        }
    }
};

// ==========================================
// VIEW (DOM, Interfaz, Animaciones)
// ==========================================
const View = {
    elements: {},

    init() {
        this.elements = {
            screens: {
                start: document.getElementById('screen-start'),
                map: document.getElementById('screen-map'),
                trivia: document.getElementById('screen-trivia'),
                item: document.getElementById('screen-item'),
                refuge: document.getElementById('screen-refuge'),
                end: document.getElementById('screen-end')
            },
            hud: {
                container: document.getElementById('hud'),
                lives: document.getElementById('hud-lives'),
                level: document.getElementById('hud-level'),
                items: document.getElementById('hud-items')
            },
            mapContainer: document.getElementById('map-container')
        };
    },

    showScreen(screenId) {
        Object.values(this.elements.screens).forEach(s => {
            if (s) {
                s.classList.remove('active');
                s.classList.add('hidden');
            }
        });
        if (this.elements.screens[screenId]) {
            this.elements.screens[screenId].classList.remove('hidden');
            this.elements.screens[screenId].classList.add('active');
        }
    },

    updateHUD(state) {
        this.elements.hud.lives.textContent = state.lives;
        this.elements.hud.level.textContent = state.level;
        this.elements.hud.items.textContent = state.item ? state.item : 'Ninguno';
        this.elements.hud.items.className = state.item ? 'hud-value highlight' : 'hud-value';
        this.elements.hud.container.classList.remove('hidden');
    },

    hideHUD() {
        this.elements.hud.container.classList.add('hidden');
    },

    showGameOver(isWin) {
        this.hideHUD();
        const title = document.getElementById('end-title');
        const msg = document.getElementById('end-message');

        if (isWin) {
            title.textContent = "ACCESO CONCEDIDO";
            title.className = "end-title text-success";
            msg.textContent = "Has hackeado el Mainframe con éxito.";
        } else {
            title.textContent = "CONEXIÓN PERDIDA";
            title.className = "end-title text-danger";
            msg.textContent = "Tus datos han sido corrompidos por el Firewall.";
        }
        this.showScreen('end');
    },

    renderMap(mapTree, clickHandler) {
        this.elements.mapContainer.innerHTML = '';

        // Renderizado inverso (nivel 10 primero en el DOM, nivel 1 al final)
        // Esto permite un scroll bottom-up con CSS column sin recortes en la parte superior.
        for (let i = mapTree.length - 1; i >= 0; i--) {
            const row = mapTree[i];
            const rowEl = document.createElement('div');
            rowEl.className = 'map-row';
            rowEl.dataset.row = i;

            row.forEach(node => {
                const nodeEl = document.createElement('div');
                nodeEl.className = 'map-node';
                nodeEl.id = `node-${node.id}`;
                nodeEl.textContent = node.type.icon;
                nodeEl.onclick = () => clickHandler(node);
                rowEl.appendChild(nodeEl);
            });
            this.elements.mapContainer.appendChild(rowEl);
        }
    },

    drawMapLines(mapTree, maxLevel) {
        document.querySelectorAll('.map-line').forEach(el => el.remove());

        for (let i = 0; i < maxLevel - 1; i++) {
            mapTree[i].forEach(node => {
                const startEl = document.getElementById(`node-${node.id}`);
                node.connections.forEach(targetId => {
                    const targetEl = document.getElementById(`node-${targetId}`);
                    if (startEl && targetEl) {
                        const line = document.createElement('div');
                        line.className = `map-line line-from-${node.id} line-to-${targetId}`;

                        const x1 = startEl.offsetLeft + startEl.offsetWidth / 2;
                        const y1 = startEl.parentElement.offsetTop + startEl.offsetHeight / 2;
                        const x2 = targetEl.offsetLeft + targetEl.offsetWidth / 2;
                        const y2 = targetEl.parentElement.offsetTop + targetEl.offsetHeight / 2;

                        const length = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
                        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

                        line.style.width = `${length}px`;
                        line.style.height = `4px`;
                        line.style.left = `${x1}px`;
                        line.style.top = `${y1}px`;
                        line.style.transform = `rotate(${angle}deg)`;

                        this.elements.mapContainer.appendChild(line);
                    }
                });
            });
        }
    },

    updateMapUI(mapTree, currentNodeId, maxLevel) {
        document.querySelectorAll('.map-node').forEach(el => el.className = 'map-node');
        document.querySelectorAll('.map-line').forEach(el => el.classList.remove('active'));

        const [cRow, cCol] = currentNodeId.split('-').map(Number);
        const currentNode = mapTree[cRow][cCol];

        for (let r = 0; r < cRow; r++) {
            mapTree[r].forEach(n => {
                document.getElementById(`node-${n.id}`).classList.add('completed');
            });
        }
        document.getElementById(`node-${currentNode.id}`).classList.add('completed');

        if (cRow < maxLevel - 1) {
            currentNode.connections.forEach(targetId => {
                const targetEl = document.getElementById(`node-${targetId}`);
                if (targetEl) targetEl.classList.add('selectable');

                const lines = document.querySelectorAll(`.line-from-${currentNode.id}.line-to-${targetId}`);
                lines.forEach(l => l.classList.add('active'));
            });
        }

        // Scroll suave manual al nodo activo para evitar que el navegador desplace el `body` (bug clásico de scrollIntoView)
        const currentEl = document.getElementById(`node-${currentNodeId}`);
        const container = this.elements.mapContainer;
        if (currentEl && container) {
            // Calculamos la posición Y del nodo relativo al contenedor
            const nodeY = currentEl.parentElement.offsetTop + (currentEl.offsetHeight / 2);
            const targetY = nodeY - (container.offsetHeight / 2);
            container.scrollTo({ top: targetY, behavior: 'smooth' });
        }
    },

    renderTrivia(qData, answerHandler) {
        document.getElementById('trivia-question').textContent = qData.q;
        const optionsContainer = document.getElementById('trivia-options');
        optionsContainer.innerHTML = '';

        qData.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.onclick = () => answerHandler(btn, idx, qData.correct);
            optionsContainer.appendChild(btn);
        });
    },

    updateTriviaTimer(pct) {
        const timerFill = document.getElementById('trivia-timer');
        timerFill.style.transform = `scaleX(${pct})`;
        if (pct < 0.3) timerFill.style.backgroundColor = 'var(--danger)';
        else if (pct < 0.6) timerFill.style.backgroundColor = 'var(--warning)';
        else timerFill.style.backgroundColor = 'var(--success)';
    },

    showTriviaResult(btn, isCorrect, correctIdx) {
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(b => b.onclick = null); // Desactivar clicks
        if (isCorrect) {
            btn.classList.add('correct');
        } else {
            if (btn) btn.classList.add('wrong');
            if (buttons[correctIdx]) buttons[correctIdx].classList.add('correct');
        }
    },

    setTriviaTimeoutMsg() {
        document.getElementById('trivia-question').textContent = "¡Tiempo agotado!";
    }
};

// ==========================================
// CONTROLLER (Lógica y Eventos)
// ==========================================
const Controller = {
    triviaTimerInterval: null,

    async init() {
        try {
            const response = await fetch('trivia.json');
            if (response.ok) {
                Model.TRIVIA_QUESTIONS = await response.json();
            } else {
                console.warn('Error fetching trivia.json:', response.status);
            }
        } catch (error) {
            console.error('Error cargando trivia.json:', error);
            // Fallback in case of CORS error when opening index.html from file://
            Model.TRIVIA_QUESTIONS = [
                { q: "Error de CORS: Por favor, abre el juego usando un servidor local (ej. Live Server).", options: ["OK", "Entendido", "Ayuda", "Salir"], correct: 0 }
            ];
        }
        
        View.init();
        this.bindEvents();
    },

    bindEvents() {
        document.getElementById('btn-start').addEventListener('click', () => this.startGame());
        document.getElementById('btn-restart').addEventListener('click', () => this.startGame());

        document.getElementById('btn-item-continue').addEventListener('click', () => this.returnToMap());
        document.getElementById('btn-refuge-continue').addEventListener('click', () => this.returnToMap());
    },

    startGame() {
        Model.initGame();
        View.updateHUD(Model.state);
        Model.generateMapTree();

        View.renderMap(Model.state.mapTree, (node) => this.onNodeClick(node));
        setTimeout(() => View.drawMapLines(Model.state.mapTree, Model.state.maxLevel), 100);

        View.updateMapUI(Model.state.mapTree, Model.state.currentNodeId, Model.state.maxLevel);
        View.showScreen('map');
    },

    onNodeClick(node) {
        const el = document.getElementById(`node-${node.id}`);
        if (!el.classList.contains('selectable')) return;

        Model.state.currentNodeId = node.id;
        Model.state.level = node.row + 1;
        View.updateHUD(Model.state);

        switch (node.type.id) {
            case 'trivia': this.startTrivia(); break;
            case 'item': this.startItem(); break;
            case 'refuge': this.startRefuge(); break;
        }
    },

    returnToMap() {
        if (Model.state.lives <= 0) {
            View.showGameOver(false);
        } else if (Model.state.level >= Model.state.maxLevel) {
            View.showGameOver(true);
        } else {
            View.updateMapUI(Model.state.mapTree, Model.state.currentNodeId, Model.state.maxLevel);
            View.showScreen('map');
        }
    },

    // --- Trivia Logic ---
    startTrivia() {
        View.showScreen('trivia');
        const qData = Model.getRandomTrivia();
        View.renderTrivia(qData, (btn, idx, correctIdx) => this.handleTriviaAnswer(btn, idx, correctIdx));

        Model.state.triviaTimeLeft = 15;
        View.updateTriviaTimer(1);

        clearInterval(this.triviaTimerInterval);
        this.triviaTimerInterval = setInterval(() => {
            Model.state.triviaTimeLeft -= 0.1;
            View.updateTriviaTimer(Model.state.triviaTimeLeft / 15);

            if (Model.state.triviaTimeLeft <= 0) {
                clearInterval(this.triviaTimerInterval);
                this.handleTriviaTimeout(qData.correct);
            }
        }, 100);
    },

    handleTriviaAnswer(btn, selectedIdx, correctIdx) {
        clearInterval(this.triviaTimerInterval);
        const isCorrect = (selectedIdx === correctIdx);

        View.showTriviaResult(btn, isCorrect, correctIdx);

        if (!isCorrect) this.processDamage();

        setTimeout(() => this.returnToMap(), isCorrect ? 1500 : 2000);
    },

    handleTriviaTimeout(correctIdx) {
        View.showTriviaResult(null, false, correctIdx);
        View.setTriviaTimeoutMsg();
        this.processDamage();
        setTimeout(() => this.returnToMap(), 2000);
    },

    processDamage() {
        const damageTaken = Model.applyDamage();
        View.updateHUD(Model.state);
        if (!damageTaken) alert("¡Tu Parche de Seguridad te ha salvado de perder una oportunidad!");
        if (Model.state.lives <= 0) View.showGameOver(false);
    },

    // --- Items & Refuge ---
    startItem() {
        View.showScreen('item');
        Model.state.item = "Parche Seguridad";
        View.updateHUD(Model.state);
    },

    startRefuge() {
        View.showScreen('refuge');
        Model.state.lives++;
        View.updateHUD(Model.state);
    }
};

// Iniciar aplicación al cargar
window.onload = () => Controller.init();
