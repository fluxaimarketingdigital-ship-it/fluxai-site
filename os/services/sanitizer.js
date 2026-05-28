/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  FLUXAI OS™ — SANITIZER                                              ║
 * ║  Arquivo: os/services/sanitizer.js                                   ║
 * ║                                                                      ║
 * ║  Utilitário centralizado de sanitização de dados de entrada.         ║
 * ║  Toda leitura de URL params, localStorage ou inputs externos         ║
 * ║  deve passar por este módulo antes de ser renderizada no DOM.        ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

'use strict';

/**
 * Escapa caracteres especiais HTML para prevenir XSS.
 * Use para qualquer string que vá para textContent ou atributos seguros.
 * @param {any} value
 * @returns {string}
 */
export function sanitizeText(value) {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

/**
 * Lê um parâmetro da URL de forma segura (sanitizado).
 * @param {string} key - Nome do parâmetro
 * @param {string} [fallback=''] - Valor padrão se ausente
 * @param {Object} [options]
 * @param {number} [options.maxLength=200] - Tamanho máximo permitido
 * @param {RegExp} [options.allowPattern] - Se definido, o valor deve casar com o padrão
 * @returns {string} Valor sanitizado ou fallback
 */
export function getUrlParam(key, fallback = '', options = {}) {
    const { maxLength = 200, allowPattern = null } = options;

    const raw = new URLSearchParams(window.location.search).get(key);
    if (raw === null || raw === undefined) return fallback;

    // Limitar tamanho para evitar ataques de overflow
    const truncated = String(raw).slice(0, maxLength);

    // Validar contra padrão permitido se fornecido
    if (allowPattern && !allowPattern.test(truncated)) {
        console.warn(`[SANITIZER] Parâmetro "${key}" rejeitado por padrão inválido.`);
        return fallback;
    }

    // Rejeitar protocolos perigosos (javascript:, data:, vbscript:)
    const dangerousPattern = /^(javascript|data|vbscript):/i;
    if (dangerousPattern.test(truncated.trim())) {
        console.warn(`[SANITIZER] Parâmetro "${key}" rejeitado — protocolo perigoso detectado.`);
        return fallback;
    }

    return sanitizeText(truncated);
}

/**
 * Lê múltiplos parâmetros da URL de uma vez.
 * @param {string[]} keys
 * @param {Object} [options]
 * @returns {Object} Objeto com os valores sanitizados
 */
export function getUrlParams(keys, options = {}) {
    return keys.reduce((acc, key) => {
        acc[key] = getUrlParam(key, '', options);
        return acc;
    }, {});
}

/**
 * Valida se uma string é um UTM value seguro (alfanumérico + hífen/underscore).
 * @param {string} value
 * @returns {boolean}
 */
export function isValidUtmValue(value) {
    return /^[a-zA-Z0-9_\-\s]{0,100}$/.test(value);
}

export default { sanitizeText, getUrlParam, getUrlParams, isValidUtmValue };
