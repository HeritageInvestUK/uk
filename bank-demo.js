// bank-demo.js — shared demo state for ALL pages
const BankDemo = (() => {
    const KEY = 'heritage_demo_state_v1';

    const defaultState = () => ({
        accounts: {
            checking: { label: 'Checking', balance: 645432.10 },
            savings: { label: 'Savings', balance: 215678.90 },
            credit: { label: 'Premium Credit', balance: 28234.56 },
            investments: { label: 'Investments', balance: 3456789.00 },
            stocks: { label: 'Stocks', balance: 2700000.50 },
            etf: { label: 'ETF', balance: 759058.87 }
        },
        transactions: [],
        dailyUsed: 250,
        dailyLimit: 25000,
        perTxnLimit: 10000
    });

    function load() {
        try {
            const raw = localStorage.getItem(KEY);
            return raw ? JSON.parse(raw) : defaultState();
        } catch { return defaultState(); }
    }
    function save(s) { localStorage.setItem(KEY, JSON.stringify(s)); }

    let state = load();

    const getState = () => structuredClone(state);

    const fmt = n => '$' + Number(n).toLocaleString('en-US', {
        minimumFractionDigits: 2, maximumFractionDigits: 2
    });
    const fmtShort = n => '$' + Math.round(n).toLocaleString('en-US');

    // Total = sum of all non-credit accounts (or however you want to define it)
    const totalBalance = () =>
        state.accounts.checking.balance +
        state.accounts.savings.balance +
        state.accounts.investments.balance;

    function refreshUI() {
        // ---- 1. Sidebar nav amounts ----
        const navMap = {
            'checking.html': state.accounts.checking.balance,
            'savings.html': state.accounts.savings.balance,
            'investments.html': state.accounts.investments.balance
        };
        Object.entries(navMap).forEach(([href, bal]) => {
            document.querySelectorAll(`a[href$="${href}"] .nav-amount`)
                .forEach(el => el.textContent = fmtShort(bal));
        });

        // ---- 2. Account pills (transfer.html) ----
        document.querySelectorAll('.account-pill').forEach(pill => {
            const label = pill.querySelector('.pill-label')?.textContent?.trim().toLowerCase();
            const key = label === 'checking' ? 'checking'
                : label === 'savings' ? 'savings'
                    : label === 'premium credit' ? 'credit'
                        : label === 'investments' ? 'investments' : null;
            const amtEl = pill.querySelector('.pill-amount');
            if (key && amtEl) amtEl.textContent = fmt(state.accounts[key].balance);
        });

        // ---- 3. Generic [data-balance="checking"] anywhere ----
        document.querySelectorAll('[data-balance]').forEach(el => {
            const key = el.getAttribute('data-balance');
            if (state.accounts[key]) el.textContent = fmt(state.accounts[key].balance);
        });

        // ---- 4. Generic [data-balance-total] for "Total Balance" widgets ----
        document.querySelectorAll('[data-balance-total]').forEach(el => {
            el.textContent = fmt(totalBalance());
        });

        // ---- 5. "Used today" progress bar (transfer.html) ----
        const usedLabel = document.querySelector('.progress-label span:last-child');
        if (usedLabel) {
            usedLabel.textContent =
                `${fmtShort(state.dailyUsed)} of ${fmtShort(state.dailyLimit)}`;
        }
        const fill = document.querySelector('.progress-fill');
        if (fill && fill.closest('.limit-progress')) {
            fill.style.width = Math.max(1, (state.dailyUsed / state.dailyLimit) * 100) + '%';
        }

        // ---- 6. Transaction lists ----
        document.querySelectorAll('[data-transactions]').forEach(el => {
            el.innerHTML = renderTransactions(el.getAttribute('data-transactions'));
        });
    }

    function renderTransactions(limit) {
        const n = (!limit || limit === 'all') ? state.transactions.length : parseInt(limit, 10);
        if (!state.transactions.length) {
            return `<div style="color:var(--stone); font-size:0.9rem; padding:1rem 0;">No transactions yet.</div>`;
        }
        return state.transactions.slice(0, n).map(tx => `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:0.75rem 0; border-bottom:1px solid var(--hair);">
        <div>
          <div style="font-weight:600;">${tx.to}</div>
          <div style="font-size:0.8rem; color:var(--stone);">
            ${tx.bank} · ${tx.account} · ${new Date(tx.ts).toLocaleDateString('en-GB')}
          </div>
        </div>
        <div style="font-family:'IBM Plex Mono',monospace; font-weight:600; color:var(--ledger-red);">
          −${fmt(tx.amount)}
        </div>
      </div>`).join('');
    }

    function transfer(payload) {
        const { fromAccount, recipient, bankName, accountNumber, routing, amount, description } = payload;
        if (!recipient) throw new Error('Missing recipient.');
        if (!Number.isFinite(amount) || amount <= 0) throw new Error('Invalid amount.');
        if (amount > state.perTxnLimit) throw new Error(`Exceeds per-transaction limit (${fmt(state.perTxnLimit)}).`);
        if (state.dailyUsed + amount > state.dailyLimit) throw new Error('Exceeds daily limit.');
        const acc = state.accounts[fromAccount];
        if (!acc) throw new Error('Unknown source account.');
        if (acc.balance < amount) throw new Error('Insufficient funds.');

        acc.balance -= amount;
        state.dailyUsed += amount;
        state.transactions.unshift({
            id: 'TX' + Date.now(),
            ts: new Date().toISOString(),
            from: fromAccount,
            to: recipient,
            bank: bankName,
            account: '****' + String(accountNumber).slice(-4),
            routing,
            amount,
            description: description || '—',
            status: 'completed'
        });
        save(state);
        return state.transactions[0];
    }

    function reset() {
        state = defaultState();
        save(state);
        refreshUI();
    }

    // Cross-tab live sync
    window.addEventListener('storage', e => {
        if (e.key === KEY && e.newValue) {
            state = JSON.parse(e.newValue);
            refreshUI();
        }
    });

    return { getState, refreshUI, transfer, reset, totalBalance };
})();