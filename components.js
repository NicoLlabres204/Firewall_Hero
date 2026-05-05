// ==========================================
// COMPONENTS (Funciones puras que devuelven HTML)
// ==========================================
const Components = {
    /**
     * Componente HUD: Muestra la información del jugador
     */
    HUDComponent: (state) => `
        <div class="hud-item"><span class="hud-label">VIDAS</span><span id="hud-lives" class="hud-value">${state.lives}</span></div>
        <div class="hud-item"><span class="hud-label">NIVEL</span><span class="hud-value"><span id="hud-level">${state.level}</span>/${state.maxLevel}</span></div>
        <div class="hud-item"><span class="hud-label">OBJETO</span><span id="hud-items" class="hud-value ${state.item ? 'highlight' : ''}">${state.item ? state.item : 'Ninguno'}</span></div>
    `,

    /**
     * Componente MapRow: Contenedor para una fila de nodos
     */
    MapRowComponent: (rowNodes, rowIndex) => `
        <div class="map-row" data-row="${rowIndex}">
            ${rowNodes.map(node => Components.MapNodeComponent(node)).join('')}
        </div>
    `,

    /**
     * Componente MapNode: Nodo individual interactivo
     */
    MapNodeComponent: (node) => `
        <div class="map-node" id="node-${node.id}" data-id="${node.id}" data-row="${node.row}" data-col="${node.col}">
            ${node.type.icon}
        </div>
    `,

    /**
     * Componente TriviaOptions: Botones de respuesta para el evento Trivia
     */
    TriviaOptionsComponent: (options) => `
        ${options.map((opt, idx) => `
            <button class="option-btn" data-idx="${idx}">${opt}</button>
        `).join('')}
    `,

    /**
     * Componente GameOver: Mensaje final de victoria o derrota
     */
    GameOverComponent: (isWin) => `
        <h1 id="end-title" class="end-title ${isWin ? 'text-success' : 'text-danger'}">${isWin ? 'ACCESO CONCEDIDO' : 'CONEXIÓN PERDIDA'}</h1>
        <p id="end-message" class="end-message">${isWin ? 'Has hackeado el Mainframe con éxito.' : 'Tus datos han sido corrompidos por el Firewall.'}</p>
        <button id="btn-restart" class="btn primary glow-effect mt-4">REINTENTAR CONEXIÓN</button>
    `
};
