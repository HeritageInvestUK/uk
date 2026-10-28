/* ============================================================
   bank-idle.js — Idle auto-logout for HeritageInvest demo
   Include AFTER bank-demo.js on every authenticated page.
   ============================================================ */

(function () {
    'use strict';

    // ---------- Config ----------
    const IDLE_TIMEOUT_MS = 5 * 60 * 1000;   // 5 minutes of total inactivity → logout
    const WARNING_BEFORE_MS = 30 * 1000;       // Show warning 30s before logout
    const LOGIN_PAGE = 'login.html';
    const DEADLINE_KEY = 'nexusbank_idle_deadline';
    const AUTH_KEY = 'nexusbank_auth';

    // ---------- Skip on pages that don't need auth ----------
    // (Add more filenames here if you have other public pages.)
    const PUBLIC_PAGES = ['login.html', 'index.html', 'register.html'];
    const currentPage = (window.location.pathname.split('/').pop() || '').toLowerCase();
    if (PUBLIC_PAGES.includes(currentPage)) return;

    // If not authenticated at all, bail (the page's own auth check will redirect)
    if (sessionStorage.getItem(AUTH_KEY) !== 'authenticated') return;

    // ---------- State ----------
    let warningTimer = null;
    let logoutTimer = null;
    let countdownInterval = null;
    let warningShown = false;
    let warningEl = null;

    // ---------- Helpers ----------
    function now() { return Date.now(); }

    function getDeadline() {
        const raw = sessionStorage.getItem(DEADLINE_KEY);
        const parsed = raw ? parseInt(raw, 10) : NaN;
        return Number.isFinite(parsed) ? parsed : null;
    }

    function setDeadline(ts) {
        sessionStorage.setItem(DEADLINE_KEY, String(ts));
    }

    function clearDeadline() {
        sessionStorage.removeItem(DEADLINE_KEY);
    }

    function logoutNow() {
        // Close any open modal first so we don't leave UI behind
        closeWarning();
        try {
            sessionStorage.removeItem(AUTH_KEY);
            sessionStorage.removeItem('nexusbank_expiry');
        } catch (_) { }
        clearDeadline();
        // Use replace so the user can't "back" into the page
        window.location.replace(LOGIN_PAGE);
    }

    function refreshDeadline() {
        setDeadline(now() + IDLE_TIMEOUT_MS);
        scheduleTimers();
        if (warningShown) closeWarning();
    }

    // ---------- Warning modal ----------
    function buildWarningModal() {
        if (warningEl) return warningEl;

        const el = document.createElement('div');
        el.id = 'idleWarningModal';
        el.setAttribute('role', 'dialog');
        el.setAttribute('aria-modal', 'true');
        el.setAttribute('aria-labelledby', 'idleWarningTitle');
        el.style.cssText = [
            'position:fixed', 'inset:0', 'z-index:99999',
            'display:none', 'align-items:center', 'justify-content:center',
            'background:rgba(16,32,27,0.55)', 'padding:1rem',
            'font-family:Inter, sans-serif'
        ].join(';');

        el.innerHTML = `
            <div style="
                background:#FBF9F3;
                border-top:3px solid #B98A2E;
                box-shadow:0 20px 45px rgba(16,32,27,0.16);
                border-radius:4px;
                max-width:420px;
                width:100%;
                padding:2rem;
                color:#23302B;
            ">
                <div style="text-align:center; margin-bottom:1rem;">
                    <i class="fas fa-hourglass-half" style="font-size:2.5rem; color:#B98A2E;"></i>
                </div>
                <h2 id="idleWarningTitle" style="
                    font-family:'Source Serif 4', serif;
                    font-size:1.4rem;
                    font-weight:600;
                    text-align:center;
                    margin-bottom:0.5rem;
                    color:#10201B;
                ">Still there?</h2>
                <p style="
                    color:#6B7A72;
                    font-size:0.9rem;
                    text-align:center;
                    margin-bottom:1.25rem;
                ">You've been inactive for a while. You'll be signed out in
                   <strong id="idleCountdown" style="color:#A24632; font-family:'IBM Plex Mono', monospace;">30</strong>
                   seconds to keep your account secure.
                </p>
                <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
                    <button id="idleStayBtn" type="button" style="
                        flex:1;
                        padding:0.7rem 1.5rem;
                        background:#10201B;
                        color:#FBF9F3;
                        border:1px solid #10201B;
                        border-radius:4px;
                        font-weight:600;
                        font-size:0.9rem;
                        cursor:pointer;
                    ">Stay signed in</button>
                    <button id="idleLogoutBtn" type="button" style="
                        flex:1;
                        padding:0.7rem 1.5rem;
                        background:transparent;
                        color:#23302B;
                        border:1px solid rgba(35,48,43,0.14);
                        border-radius:4px;
                        font-weight:600;
                        font-size:0.9rem;
                        cursor:pointer;
                    ">Sign out now</button>
                </div>
            </div>
        `;

        document.body.appendChild(el);

        el.querySelector('#idleStayBtn').addEventListener('click', function () {
            refreshDeadline();
        });
        el.querySelector('#idleLogoutBtn').addEventListener('click', function () {
            logoutNow();
        });

        return el;
    }

    function openWarning() {
        if (!warningEl) buildWarningModal();
        warningEl.style.display = 'flex';
        warningShown = true;

        // Start countdown text
        const countEl = warningEl.querySelector('#idleCountdown');
        const deadline = getDeadline();
        if (deadline && countEl) {
            const update = () => {
                const remaining = Math.max(0, Math.ceil((deadline - now()) / 1000));
                countEl.textContent = String(remaining);
                if (remaining <= 0) {
                    clearInterval(countdownInterval);
                }
            };
            update();
            clearInterval(countdownInterval);
            countdownInterval = setInterval(update, 500);
        }
    }

    function closeWarning() {
        if (warningEl) warningEl.style.display = 'none';
        warningShown = false;
        if (countdownInterval) { clearInterval(countdownInterval); countdownInterval = null; }
    }

    // ---------- Timer scheduling ----------
    function scheduleTimers() {
        clearTimeout(warningTimer);
        clearTimeout(logoutTimer);

        const deadline = getDeadline();
        if (!deadline) return;

        const msUntilWarning = (deadline - WARNING_BEFORE_MS) - now();
        const msUntilLogout = deadline - now();

        if (msUntilLogout <= 0) {
            logoutNow();
            return;
        }

        if (msUntilWarning <= 0) {
            // Already in warning window
            openWarning();
            logoutTimer = setTimeout(logoutNow, msUntilLogout);
            return;
        }

        warningTimer = setTimeout(function () {
            openWarning();
            const remaining = Math.max(0, getDeadline() - now());
            logoutTimer = setTimeout(logoutNow, remaining);
        }, msUntilWarning);
    }

    // ---------- Activity listeners ----------
    // Throttle so we don't reset the deadline 60×/second on mousemove
    let lastActivityReset = 0;
    const ACTIVITY_RESET_THROTTLE_MS = 1000;

    function noteActivity() {
        const t = now();
        if (t - lastActivityReset < ACTIVITY_RESET_THROTTLE_MS) return;
        lastActivityReset = t;

        // If user interacts while the warning is open, treat it as "I'm here"
        if (warningShown) {
            refreshDeadline();
            return;
        }
        refreshDeadline();
    }

    const EVENTS = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'pointerdown', 'wheel'];
    EVENTS.forEach(evt => document.addEventListener(evt, noteActivity, { passive: true }));

    // Don't count activity while the browser tab is hidden — that's a real
    // "away" signal. But when the user comes back, restart the clock.
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') {
            // Coming back to the tab — give a full window and refresh deadline
            refreshDeadline();
        } else {
            // Leaving the tab — stop the warning popup so it doesn't sit stale
            if (warningShown) closeWarning();
        }
    });

    // Also reset on focus (coming back from another tab/window)
    window.addEventListener('focus', function () {
        const deadline = getDeadline();
        // If we've already passed the deadline while away, log out immediately
        if (!deadline || now() >= deadline) {
            if (deadline && now() >= deadline) logoutNow();
            return;
        }
        refreshDeadline();
    });

    // ---------- Cross-tab sync ----------
    // If one tab refreshes the deadline, all tabs should agree.
    window.addEventListener('storage', function (e) {
        if (e.key === DEADLINE_KEY) {
            scheduleTimers();
        }
        if (e.key === AUTH_KEY && e.newValue !== 'authenticated') {
            logoutNow();
        }
    });

    // ---------- Boot ----------
    // If there is already a deadline (from a previous page in this session),
    // respect it. Otherwise start a fresh one.
    if (!getDeadline()) {
        setDeadline(now() + IDLE_TIMEOUT_MS);
    }
    scheduleTimers();
})();