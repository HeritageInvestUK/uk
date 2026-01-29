// ===== TIME & DATE MANAGEMENT =====
class TimeManager {
    constructor() {
        this.lastLoginTime = null;
        this.loginTime = null;
        this.timeInterval = null;
        this.dateInterval = null;
        
        this.initializeTime();
    }
    
    initializeTime() {
        // Load last login time from localStorage
        const savedLogin = localStorage.getItem('heritageinvest_last_login');
        if (savedLogin) {
            this.lastLoginTime = new Date(savedLogin);
        }
        
        // Set current login time
        this.loginTime = new Date();
        localStorage.setItem('heritageinvest_last_login', this.loginTime.toISOString());
        
        // Start updating time displays
        this.updateTimeDisplays();
        this.startTimeUpdates();
        
        // Set greeting based on time of day
        this.setGreeting();
    }
    
    updateTimeDisplays() {
        const now = new Date();
        
        // Update current time display
        const timeDisplay = document.getElementById('currentTimeDisplay');
        const dateDisplay = document.getElementById('currentDate');
        const currentDateTime = document.getElementById('currentDateTime');
        
        if (timeDisplay) {
            timeDisplay.textContent = this.formatTime(now);
        }
        
        if (dateDisplay) {
            dateDisplay.textContent = this.formatDate(now);
        }
        
        if (currentDateTime) {
            currentDateTime.textContent = this.formatDateTime(now);
        }
        
        // Update last login info
        this.updateLastLoginDisplay();
    }
    
    startTimeUpdates() {
        // Update time every second
        this.timeInterval = setInterval(() => {
            this.updateTimeDisplays();
        }, 1000);
        
        // Update date every minute (in case of midnight)
        this.dateInterval = setInterval(() => {
            this.updateTimeDisplays();
        }, 60000);
    }
    
    stopTimeUpdates() {
        if (this.timeInterval) clearInterval(this.timeInterval);
        if (this.dateInterval) clearInterval(this.dateInterval);
    }
    
    formatTime(date) {
        return date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    }
    
    formatDate(date) {
        return date.toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }
    
    formatDateTime(date) {
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }) + ', ' + this.formatTime(date) + ' GMT';
    }
    
    formatLastLogin(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) {
            return 'Just now';
        } else if (diffMins < 60) {
            return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
        } else if (diffDays === 1) {
            return 'Yesterday at ' + this.formatTime(date);
        } else if (diffDays < 7) {
            return `${diffDays} days ago at ${this.formatTime(date)}`;
        } else {
            return this.formatDateTime(date);
        }
    }
    
    updateLastLoginDisplay() {
        const lastLoginInfo = document.getElementById('lastLoginInfo');
        const profileLastLogin = document.getElementById('profileLastLogin');
        
        if (lastLoginInfo) {
            if (this.lastLoginTime) {
                lastLoginInfo.textContent = `Last login: ${this.formatLastLogin(this.lastLoginTime)} `;
            } else {
                lastLoginInfo.textContent = '';
            }
        }
        
        if (profileLastLogin) {
            if (this.lastLoginTime) {
                profileLastLogin.textContent = this.formatDateTime(this.lastLoginTime);
            } else {
                profileLastLogin.textContent = 'First login';
            }
        }
    }
    
    setGreeting() {
        const greetingTime = document.getElementById('greetingTime');
        if (!greetingTime) return;
        
        const hour = new Date().getHours();
        let greeting;
        
        if (hour < 12) {
            greeting = 'morning';
        } else if (hour < 18) {
            greeting = 'afternoon';
        } else {
            greeting = 'evening';
        }
        
        greetingTime.textContent = greeting;
    }
    
    getCurrentTimestamp() {
        return new Date().toISOString();
    }
}

// ===== TRANSACTIONS DATA =====
const transactionsData = [
    {
        id: 'TRX-7284-001',
        date: '2023-04-15T14:30:00',
        description: 'FTSE 100 Index Fund Purchase',
        type: 'investment',
        amount: 25000.00,
        status: 'completed',
        reference: 'INV-7284-001'
    },
    {
        id: 'TRX-7284-002',
        date: '2023-04-14T09:15:00',
        description: 'Monthly Deposit - Bank Transfer',
        type: 'deposit',
        amount: 10000.00,
        status: 'completed',
        reference: 'DEP-7284-045'
    },
    {
        id: 'TRX-7284-003',
        date: '2023-04-10T16:45:00',
        description: 'Withdrawal Request - Current Account',
        type: 'withdrawal',
        amount: -5000.00,
        status: 'processing',
        reference: 'WDL-7284-023'
    },
    {
        id: 'TRX-7284-004',
        date: '2023-04-05T11:20:00',
        description: 'Quarterly Dividend Distribution',
        type: 'dividend',
        amount: 2450.00,
        status: 'completed',
        reference: 'DIV-7284-012'
    },
    {
        id: 'TRX-7284-005',
        date: '2023-03-28T10:00:00',
        description: 'Management Fee - Q1 2023',
        type: 'fee',
        amount: -1250.00,
        status: 'completed',
        reference: 'FEE-7284-003'
    },
    {
        id: 'TRX-7284-006',
        date: '2023-03-15T14:30:00',
        description: 'Global Equity Fund Purchase',
        type: 'investment',
        amount: 15000.00,
        status: 'completed',
        reference: 'INV-7284-002'
    },
    {
        id: 'TRX-7284-007',
        date: '2023-03-14T09:15:00',
        description: 'Monthly Deposit - Bank Transfer',
        type: 'deposit',
        amount: 10000.00,
        status: 'completed',
        reference: 'DEP-7284-044'
    },
    {
        id: 'TRX-7284-008',
        date: '2023-03-10T16:45:00',
        description: 'Withdrawal Request - Savings Account',
        type: 'withdrawal',
        amount: -3000.00,
        status: 'completed',
        reference: 'WDL-7284-022'
    },
    {
        id: 'TRX-7284-009',
        date: '2023-02-28T10:00:00',
        description: 'Management Fee - February 2023',
        type: 'fee',
        amount: -1250.00,
        status: 'completed',
        reference: 'FEE-7284-002'
    },
    {
        id: 'TRX-7284-010',
        date: '2023-02-15T14:30:00',
        description: 'UK Corporate Bond Fund Purchase',
        type: 'investment',
        amount: 10000.00,
        status: 'completed',
        reference: 'INV-7284-003'
    }
];

// ===== DOCUMENTS DATA =====
const documentsData = [
    {
        id: 'DOC-7284-001',
        title: 'Q1 2023 Investment Statement',
        type: 'statement',
        date: '2023-04-05',
        size: '2.4 MB',
        description: 'Quarterly investment performance and holdings statement',
        icon: 'fas fa-file-invoice-dollar'
    },
    {
        id: 'DOC-7284-002',
        title: '2022/23 Tax Certificate',
        type: 'tax',
        date: '2023-03-31',
        size: '1.8 MB',
        description: 'Annual tax certificate for submission to HMRC',
        icon: 'fas fa-receipt'
    },
    {
        id: 'DOC-7284-003',
        title: 'Client Investment Agreement',
        type: 'contract',
        date: '2023-03-15',
        size: '3.2 MB',
        description: 'Signed investment management agreement',
        icon: 'fas fa-file-contract'
    },
    {
        id: 'DOC-7284-004',
        title: 'Portfolio Performance Report',
        type: 'report',
        date: '2023-04-10',
        size: '1.5 MB',
        description: 'Detailed portfolio performance analysis',
        icon: 'fas fa-chart-line'
    },
    {
        id: 'DOC-7284-005',
        title: 'FCA Risk Disclosure',
        type: 'compliance',
        date: '2023-03-01',
        size: '0.8 MB',
        description: 'Financial Conduct Authority risk disclosures',
        icon: 'fas fa-shield-alt'
    },
    {
        id: 'DOC-7284-006',
        title: 'March 2023 Transaction Summary',
        type: 'statement',
        date: '2023-04-01',
        size: '1.2 MB',
        description: 'Monthly transaction summary and activity report',
        icon: 'fas fa-file-alt'
    }
];

// ===== SECURITY & INACTIVITY MANAGEMENT =====
class SecuritySession {
    constructor() {
        this.sessionTimeout = 30; // 30 seconds for demo (normally 15-30 minutes)
        this.warningTimeout = 10; // Show warning 10 seconds before logout
        this.logoutTimer = null;
        this.warningTimer = null;
        this.lastActivity = Date.now();
        
        this.setupActivityListeners();
        this.resetTimer();
    }
    
    setupActivityListeners() {
        // Track user activity
        ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, () => {
                this.resetTimer();
                this.hideWarning();
            });
        });
        
        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.resetTimer();
            }
        });
    }
    
    resetTimer() {
        this.lastActivity = Date.now();
        
        // Clear existing timers
        if (this.logoutTimer) clearTimeout(this.logoutTimer);
        if (this.warningTimer) clearTimeout(this.warningTimer);
        
        // Set new timers
        this.warningTimer = setTimeout(() => this.showWarning(), (this.sessionTimeout - this.warningTimeout) * 1000);
        this.logoutTimer = setTimeout(() => this.forceLogout(), this.sessionTimeout * 1000);
    }
    
    showWarning() {
        const currentPage = window.location.pathname;
        if (currentPage.includes('dashboard.html') === false) return;
        
        const warningModal = document.getElementById('inactivityWarning');
        const countdownEl = document.getElementById('countdown');
        
        if (warningModal && countdownEl) {
            warningModal.classList.remove('hidden');
            
            // Start countdown
            let seconds = this.warningTimeout;
            const countdownInterval = setInterval(() => {
                seconds--;
                countdownEl.textContent = seconds;
                
                if (seconds <= 0) {
                    clearInterval(countdownInterval);
                }
            }, 1000);
            
            // Store interval reference
            this.countdownInterval = countdownInterval;
        }
    }
    
    hideWarning() {
        const warningModal = document.getElementById('inactivityWarning');
        if (warningModal) {
            warningModal.classList.add('hidden');
            
            if (this.countdownInterval) {
                clearInterval(this.countdownInterval);
            }
        }
    }
    
    extendSession() {
        this.resetTimer();
        this.hideWarning();
        
        // Show confirmation
        this.showToast('Session extended by 30 minutes', 'success');
    }
    
    forceLogout() {
        const currentPage = window.location.pathname;
        if (currentPage.includes('dashboard.html')) {
            this.showToast('Session expired due to inactivity', 'warning');
            this.logout();
        }
    }
    
    logout() {
        // Redirect to login page
        window.location.href = 'login.html';
        
        // Clear all timers
        if (this.logoutTimer) clearTimeout(this.logoutTimer);
        if (this.warningTimer) clearTimeout(this.warningTimer);
        if (this.countdownInterval) clearInterval(this.countdownInterval);
        
        // Clear session storage
        sessionStorage.removeItem('heritageinvest_premium_session');
        sessionStorage.removeItem('heritageinvest_client');
        
        // Stop time updates
        if (timeManager) {
            timeManager.stopTimeUpdates();
        }
    }
    
    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close">&times;</button>
        `;
        
        // Add styles if not already added
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .toast {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: white;
                    border-radius: var(--radius-md);
                    padding: var(--space-sm) var(--space-md);
                    box-shadow: var(--shadow-xl);
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                    z-index: 9999;
                    animation: slideInRight 0.3s ease;
                    border-left: 4px solid var(--navy-primary);
                    max-width: 350px;
                }
                .toast-success { border-left-color: var(--success); }
                .toast-warning { border-left-color: var(--warning); }
                .toast-error { border-left-color: var(--error); }
                .toast-content {
                    display: flex;
                    align-items: center;
                    gap: var(--space-xs);
                    flex: 1;
                }
                .toast-close {
                    background: none;
                    border: none;
                    font-size: 1.25rem;
                    cursor: pointer;
                    color: var(--grey-400);
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add to DOM
        document.body.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
        
        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
    }
}

// ===== TRANSACTIONS MANAGEMENT =====
class TransactionsManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 5;
        this.filteredTransactions = [...transactionsData];
        this.currentFilters = {
            period: '30',
            type: 'all',
            status: 'all'
        };
        
        this.initializeTransactions();
    }
    
    initializeTransactions() {
        this.renderTransactions();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.getElementById('periodFilter')?.addEventListener('change', (e) => {
            this.currentFilters.period = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('typeFilter')?.addEventListener('change', (e) => {
            this.currentFilters.type = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('statusFilter')?.addEventListener('change', (e) => {
            this.currentFilters.status = e.target.value;
            this.applyFilters();
        });
        
        document.getElementById('applyFilters')?.addEventListener('click', () => {
            this.applyFilters();
        });
        
        document.getElementById('exportTransactions')?.addEventListener('click', () => {
            this.exportToCSV();
        });
        
        document.getElementById('prevPage')?.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderTransactions();
            }
        });
        
        document.getElementById('nextPage')?.addEventListener('click', () => {
            const totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderTransactions();
            }
        });
    }
    
    applyFilters() {
        this.currentPage = 1;
        this.filteredTransactions = this.filterTransactions();
        this.renderTransactions();
    }
    
    filterTransactions() {
        const now = new Date();
        const periodDays = parseInt(this.currentFilters.period);
        
        return transactionsData.filter(transaction => {
            // Period filter
            if (this.currentFilters.period !== 'all') {
                const transactionDate = new Date(transaction.date);
                const diffTime = now - transactionDate;
                const diffDays = diffTime / (1000 * 60 * 60 * 24);
                
                if (diffDays > periodDays) {
                    return false;
                }
            }
            
            // Type filter
            if (this.currentFilters.type !== 'all' && transaction.type !== this.currentFilters.type) {
                return false;
            }
            
            // Status filter
            if (this.currentFilters.status !== 'all' && transaction.status !== this.currentFilters.status) {
                return false;
            }
            
            return true;
        });
    }
    
    renderTransactions() {
        const tbody = document.getElementById('transactionsBody');
        if (!tbody) return;
        
        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageTransactions = this.filteredTransactions.slice(startIndex, endIndex);
        const totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
        
        // Clear existing rows
        tbody.innerHTML = '';
        
        // Add new rows
        pageTransactions.forEach(transaction => {
            const row = this.createTransactionRow(transaction);
            tbody.appendChild(row);
        });
        
        // Update pagination controls
        this.updatePaginationControls(totalPages);
    }
    
    createTransactionRow(transaction) {
    const tr = document.createElement('tr');
    
    const date = new Date(transaction.date);
    const formattedDate = date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    
    const formattedTime = date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    
    const isPositive = transaction.amount > 0;
    const amountClass = isPositive ? 'text-success' : 'text-error';
    const amountPrefix = isPositive ? '+' : '';
    const formattedAmount = `£${amountPrefix}${Math.abs(transaction.amount).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;
    
    const statusBadgeClass = {
        'completed': 'badge-success',
        'processing': 'badge-info',
        'pending': 'badge-warning',
        'failed': 'badge-error'
    }[transaction.status] || 'badge-info';
    
    const typeLabel = {
        'investment': 'Investment',
        'deposit': 'Deposit',
        'withdrawal': 'Withdrawal',
        'dividend': 'Dividend',
        'fee': 'Fee'
    }[transaction.type] || transaction.type;
    
    // MOBILE-FRIENDLY VERSION
    if (window.innerWidth <= 768) {
        tr.innerHTML = `
            <td>
                <div class="flex flex-col" style="gap: 4px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <div style="font-weight: 700; font-size: 14px; color: var(--navy-primary);">${formattedDate}</div>
                            <div style="font-size: 12px; color: var(--grey-500);">${formattedTime}</div>
                        </div>
                        <div style="text-align: right;">
                            <div class="${amountClass}" style="font-weight: 800; font-size: 16px; margin-bottom: 4px;">
                                ${formattedAmount}
                            </div>
                            <span class="badge ${statusBadgeClass}" style="font-size: 10px; padding: 2px 6px;">${transaction.status}</span>
                        </div>
                    </div>
                    <div style="margin-top: 8px;">
                        <div style="font-weight: 600; font-size: 13px; color: var(--grey-700); margin-bottom: 2px;">${transaction.description}</div>
                        <div style="font-size: 11px; color: var(--grey-500); display: flex; align-items: center; gap: 4px;">
                            <span style="background: var(--grey-100); padding: 1px 6px; border-radius: 10px; font-size: 10px;">${typeLabel}</span>
                            <span style="font-family: monospace;">${transaction.reference}</span>
                        </div>
                    </div>
                </div>
            </td>
        `;
        // Make the row single column for mobile
        tr.children[0].colSpan = 7;
    } else {
        // DESKTOP VERSION (original)
        tr.innerHTML = `
            <td>
                <div class="flex flex-col">
                    <span style="font-weight: 700; font-size: 14px;">${formattedDate}</span>
                    <span style="font-size: 12px; color: var(--grey-500);">${formattedTime}</span>
                </div>
            </td>
            <td class="desktop-only">
                <span style="font-family: monospace; font-size: 12px; color: var(--grey-500);">${transaction.reference}</span>
            </td>
            <td>
                <div>
                    <div style="font-weight: 700; font-size: 14px;">${transaction.description}</div>
                    <div style="font-size: 12px; color: var(--grey-500);" class="desktop-only">${typeLabel}</div>
                </div>
            </td>
            <td class="desktop-only">
                <span style="font-size: 12px; color: var(--grey-600);">${typeLabel}</span>
            </td>
            <td class="${amountClass}" style="font-weight: 800; font-size: 16px;">
                ${formattedAmount}
            </td>
            <td>
                <span class="badge ${statusBadgeClass}">${transaction.status}</span>
            </td>
            <td class="desktop-only">
                <button class="btn btn-outline btn-small" onclick="transactionsManager.viewTransaction('${transaction.id}')">
                    <i class="fas fa-receipt"></i>
                </button>
            </td>
        `;
    }
    
    return tr;
}
    
    updatePaginationControls(totalPages) {
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        const pageInfo = document.getElementById('pageInfo');
        
        if (prevBtn) prevBtn.disabled = this.currentPage === 1;
        if (nextBtn) nextBtn.disabled = this.currentPage === totalPages || totalPages === 0;
        if (pageInfo) pageInfo.textContent = `Page ${this.currentPage} of ${totalPages}`;
    }
    
    viewTransaction(id) {
        const transaction = transactionsData.find(t => t.id === id);
        if (transaction) {
            securitySession.showToast(`Viewing transaction ${transaction.reference}`, 'info');
        }
    }
    
    exportToCSV() {
        const headers = ['Date', 'Reference', 'Description', 'Type', 'Amount', 'Status'];
        const csvData = this.filteredTransactions.map(transaction => {
            const date = new Date(transaction.date).toLocaleDateString('en-GB');
            return [
                date,
                transaction.reference,
                transaction.description,
                transaction.type,
                transaction.amount.toFixed(2),
                transaction.status
            ];
        });
        
        const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        securitySession.showToast('Transactions exported successfully', 'success');
    }
}

// ===== DOCUMENTS MANAGEMENT =====
class DocumentsManager {
    constructor() {
        this.filteredDocuments = [...documentsData];
        this.initializeDocuments();
    }
    
    initializeDocuments() {
        this.renderDocuments();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.getElementById('documentFilter')?.addEventListener('change', (e) => {
            this.filterDocuments(e.target.value);
        });
    }
    
    filterDocuments(type) {
        if (type === 'all') {
            this.filteredDocuments = [...documentsData];
        } else {
            this.filteredDocuments = documentsData.filter(doc => doc.type === type);
        }
        this.renderDocuments();
    }
    
    renderDocuments() {
        const grid = document.getElementById('documentsGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        this.filteredDocuments.forEach(document => {
            const card = this.createDocumentCard(document);
            grid.appendChild(card);
        });
    }
    
    createDocumentCard(document) {
        const card = document.createElement('div');
        card.className = 'document-card';
        
        const date = new Date(document.date);
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        const typeColor = {
            'statement': 'var(--navy-primary)',
            'tax': 'var(--accent-teal)',
            'contract': 'var(--accent-gold)',
            'report': 'var(--success)',
            'compliance': 'var(--info)'
        }[document.type] || 'var(--navy-primary)';
        
        card.innerHTML = `
            <div class="document-icon" style="background: linear-gradient(135deg, ${typeColor}, ${this.lightenColor(typeColor, 20)});">
                <i class="${document.icon}"></i>
            </div>
            <h4 class="mb-2">${document.title}</h4>
            <p class="text-small mb-3">${document.description}</p>
            <div class="document-meta">
                <div>
                    <div class="text-micro">Date</div>
                    <div class="text-sm">${formattedDate}</div>
                </div>
                <div>
                    <div class="text-micro">Size</div>
                    <div class="text-sm">${document.size}</div>
                </div>
            </div>
            <div class="flex gap-2 mt-4">
                <button class="btn btn-outline btn-small flex-1" onclick="documentsManager.viewDocument('${document.id}')">
                    <i class="fas fa-eye"></i>
                    View
                </button>
                <button class="btn btn-primary btn-small flex-1" onclick="documentsManager.downloadDocument('${document.id}')">
                    <i class="fas fa-download"></i>
                    Download
                </button>
            </div>
        `;
        
        return card;
    }
    
    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (
            0x1000000 +
            (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)
        ).toString(16).slice(1);
    }
    
    viewDocument(id) {
        const doc = documentsData.find(d => d.id === id);
        if (doc) {
            securitySession.showToast(`Opening ${doc.title}`, 'info');
            // In a real app, this would open a PDF viewer or similar
        }
    }
    
    downloadDocument(id) {
        const doc = documentsData.find(d => d.id === id);
        if (doc) {
            securitySession.showToast(`Downloading ${doc.title}`, 'success');
            // In a real app, this would trigger a file download
        }
    }
}

// ===== APPLICATION STATE =====
const appState = {
    currentPage: 'homepage',
    currentSection: 'overview',
    isAuthenticated: false,
    clientData: {
        name: 'Jonathan Sterling',
        clientId: 'HS-7284-PRE',
        portfolioValue: 9847320.85,
        availableCash: 884732.08,
        advisor: 'Sarah Chen'
    }
};

// Initialize managers
let timeManager;
let securitySession;
let transactionsManager;
let documentsManager;

// ===== DOM ELEMENTS =====
const navLinks = document.getElementById('navLinks');
const mobileToggle = document.getElementById('mobileToggle');
const dashboardNavLinks = document.querySelectorAll('.dashboard-nav-link');
const mobileNavLinks = document.querySelectorAll('.mobile-nav');
const transferSteps = document.querySelectorAll('.transfer-step');

// ===== PAGE MANAGEMENT =====
function showPage(pageName) {
    // Not needed in multi-page setup - handled by separate HTML files
}

function showSection(sectionName) {
    // Hide all sections
    const sections = {
        overview: document.getElementById('overview-section'),
        portfolio: document.getElementById('portfolio-section'),
        transactions: document.getElementById('transactions-section'),
        transfers: document.getElementById('transfers-section'),
        documents: document.getElementById('documents-section'),
        profile: document.getElementById('profile-section')
    };
    
    Object.values(sections).forEach(section => {
        if (section) section.classList.add('hidden');
    });
    
    // Show requested section
    if (sections[sectionName]) {
        sections[sectionName].classList.remove('hidden');
        appState.currentSection = sectionName;
        
        // Initialize transfer manager when entering transfers section
        if (sectionName === 'transfers' && window.innerWidth > 768) {
            initializeTransferManager();
        }
    }
    
    // Toggle dashboard header visibility (MOBILE ONLY)
    toggleDashboardHeader(sectionName);
    
    // Update desktop navigation
    dashboardNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionName) {
            link.classList.add('active');
        }
    });
    
    // Update mobile navigation
    mobileNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionName) {
            link.classList.add('active');
        }
    });
    
    // Scroll to top on mobile
    if (window.innerWidth <= 768) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ===== TRANSFER FLOW =====
// Initialize transfer manager when needed
function initializeTransferManager() {
    if (!transferManager) {
        transferManager = new TransferManager();
    }
}

// Show transfer step
function showTransferStep(stepNumber) {
    // Initialize transfer manager if not already done
    initializeTransferManager();
    
    transferSteps.forEach((step, index) => {
        step.classList.remove('active');
        if (index === stepNumber - 1) {
            step.classList.add('active');
        }
    });
    
    // Update progress steps
    const stepNumbers = document.querySelectorAll('.step-number');
    const stepLabels = document.querySelectorAll('.step-label');
    const stepConnectors = document.querySelectorAll('.step-connector');
    
    stepNumbers.forEach((num, index) => {
        num.classList.remove('active', 'completed');
        if (index < stepNumber - 1) {
            num.classList.add('completed');
        } else if (index === stepNumber - 1) {
            num.classList.add('active');
        }
    });
    
    stepLabels.forEach((label, index) => {
        label.classList.remove('active');
        if (index === stepNumber - 1) {
            label.classList.add('active');
        }
    });
    
    stepConnectors.forEach((connector, index) => {
        connector.classList.remove('active');
        if (index < stepNumber - 1) {
            connector.classList.add('active');
        }
    });
    
    // Focus on amount input when showing step 1
    if (stepNumber === 1) {
        setTimeout(() => {
            const amountInput = document.getElementById('transferAmount');
            if (amountInput) {
                amountInput.focus();
            }
        }, 100);
    }
}

// Simulate transfer processing with dynamic data
// Simulate transfer processing with 100% rejection rate
function simulateTransferProcessing() {
    if (!transferManager) return;
    
    const transferData = transferManager.getTransferData();
    const processingModal = document.getElementById('transferProcessingModal');
    const progressBar = document.getElementById('transferProgress');
    const processingStep = document.getElementById('processingStep');
    
    if (!processingModal || !progressBar || !processingStep) return;
    
    // Show processing modal
    processingModal.classList.remove('hidden');
    
    // Simulate processing steps
    const steps = [
        "Initiating transfer...",
        `Verifying amount: £${transferManager.formatCurrency(transferData.amount)}`,
        "Checking account details...",
        "Validating security protocols...",
        "Processing through banking network...",
        "Encountering system restriction..."
    ];
    
    let currentStep = 0;
    const stepInterval = setInterval(() => {
        if (currentStep < steps.length) {
            const progress = ((currentStep + 1) / steps.length) * 100;
            progressBar.style.width = `${progress}%`;
            processingStep.textContent = steps[currentStep];
            currentStep++;
        } else {
            clearInterval(stepInterval);
            
            // Hide processing modal
            setTimeout(() => {
                processingModal.classList.add('hidden');
                
                // ALWAYS REJECT - 100% rejection rate
                const rejectionReasons = [
                    {
                        title: "Transfer Not Processed",
                        message: `Your transfer request for £${transferManager.formatCurrency(transferData.amount)} could not be completed at this time.`,
                        reason: "Daily limit exceeded",
                        detail: "Amount exceeds daily withdrawal limit of £25,000"
                    },
                    {
                        title: "Transfer Declined",
                        message: "The transfer request has been declined by our security systems.",
                        reason: "Suspected unusual activity",
                        detail: "Our security systems detected patterns requiring manual review."
                    },
                    {
                        title: "Processing Failed",
                        message: "Unable to process transfer due to system restrictions.",
                        reason: "Account verification pending",
                        detail: "Please complete account verification steps"
                    },
                    {
                        title: "Insufficient Funds",
                        message: "Transfer could not be processed due to insufficient funds.",
                        reason: "Balance verification failed",
                        detail: "Available balance is lower than requested amount"
                    },
                    {
                        title: "Bank Account Restricted",
                        message: "Destination account has restrictions.",
                        reason: "Account verification required",
                        detail: "Destination account needs additional verification"
                    },
                    {
                        title: "System Maintenance",
                        message: "Transfer services temporarily unavailable.",
                        reason: "Scheduled maintenance",
                        detail: "Please try again in 30 minutes"
                    },
                    {
                        title: "Manual Approval Required",
                        message: "This transfer requires manual approval.",
                        reason: "Large amount withdrawal",
                        detail: "Transfers over £10,000 require advisor approval"
                    }
                ];
                
                // Select a random rejection reason
                const randomRejection = rejectionReasons[Math.floor(Math.random() * rejectionReasons.length)];
                
                // Customize message based on amount
                if (transferData.amount > 50000) {
                    randomRejection.title = "Large Transfer Requires Approval";
                    randomRejection.reason = "Amount exceeds automatic processing limit";
                    randomRejection.detail = "Transfers over £50,000 require relationship manager approval";
                } else if (transferData.amount > 25000) {
                    randomRejection.title = "Enhanced Verification Required";
                    randomRejection.reason = "Security protocol triggered";
                    randomRejection.detail = "Large withdrawals require additional identity verification";
                }
                
                showTransferRejected(randomRejection);
                
                // Reset transfer form
                setTimeout(() => {
                    transferManager.resetTransfer();
                    showSection('transfers');
                }, 3000);
            }, 500);
        }
    }, 800);
}

function showTransferRejected(rejection) {
    const modal = document.getElementById('transferRejectedModal');
    const title = document.getElementById('rejectionTitle');
    const message = document.getElementById('rejectionMessage');
    const reason = document.getElementById('rejectionReason');
    const detail = document.getElementById('rejectionDetail');
    
    if (modal && title && message && reason && detail) {
        title.textContent = rejection.title;
        message.textContent = rejection.message;
        reason.textContent = rejection.reason;
        detail.textContent = rejection.detail;
        modal.classList.remove('hidden');
        
        // Update reference number to show it's declined
        const referenceElement = modal.querySelector('.font-mono');
        if (referenceElement) {
            const transferRef = 'TRF-DECLINED-' + Math.random().toString(36).substr(2, 6).toUpperCase();
            referenceElement.textContent = transferRef;
        }
    }
}

// Initialize transfer when entering transfers section
// Quick actions - initialize transfer
document.getElementById('quickDeposit')?.addEventListener('click', () => {
    showSection('transfers');
    showTransferStep(1);
    initializeTransferManager();
    
    // Set to deposit type
    setTimeout(() => {
        const transferType = document.getElementById('transferType');
        if (transferType) {
            transferType.value = 'deposit';
            if (transferManager) {
                transferManager.transferData.type = 'deposit';
                transferManager.updateAccountOptions();
            }
        }
    }, 100);
});

document.getElementById('quickWithdraw')?.addEventListener('click', () => {
    showSection('transfers');
    showTransferStep(1);
    initializeTransferManager();
    
    // Set to withdrawal type
    setTimeout(() => {
        const transferType = document.getElementById('transferType');
        if (transferType) {
            transferType.value = 'withdrawal';
            if (transferManager) {
                transferManager.transferData.type = 'withdrawal';
            }
        }
    }, 100);
});

// Update the confirm transfer button
document.getElementById('confirmTransfer')?.addEventListener('click', () => {
    if (transferManager) {
        simulateTransferProcessing();
    }
});

// Update cancel transfer button
document.getElementById('cancelTransfer')?.addEventListener('click', () => {
    if (transferManager) {
        transferManager.resetTransfer();
    }
    showSection('overview');
});

// ===== EVENT LISTENERS =====
// Mobile menu toggle
if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    });
}

// Navigation links
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href').substring(1);
        
        if (sections[target]) {
            showSection(target);
        }
        
        // Close mobile menu
        if (navLinks) {
            navLinks.classList.remove('active');
            mobileToggle?.classList.remove('active');
        }
    });
});

// Dashboard navigation
dashboardNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.getAttribute('data-section');
        showSection(section);
    });
});

// Mobile navigation
mobileNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.getAttribute('data-section');
        showSection(section);
    });
});

// Transfer flow
document.getElementById('nextStep1')?.addEventListener('click', () => {
    showTransferStep(2);
});

document.getElementById('backStep2')?.addEventListener('click', () => {
    showTransferStep(1);
});

document.getElementById('nextStep2')?.addEventListener('click', () => {
    showTransferStep(3);
});

document.getElementById('backStep3')?.addEventListener('click', () => {
    showTransferStep(2);
});

document.getElementById('confirmTransfer')?.addEventListener('click', () => {
    simulateTransferProcessing();
});

document.getElementById('cancelTransfer')?.addEventListener('click', () => {
    showSection('overview');
});

// Modal controls
document.getElementById('closeRejectedModal')?.addEventListener('click', () => {
    document.getElementById('transferRejectedModal').classList.add('hidden');
});

document.getElementById('closeRejectedBtn')?.addEventListener('click', () => {
    document.getElementById('transferRejectedModal').classList.add('hidden');
});

document.getElementById('closeSuccessModal')?.addEventListener('click', () => {
    document.getElementById('transferSuccessModal').classList.add('hidden');
});

document.getElementById('closeSuccessBtn')?.addEventListener('click', () => {
    document.getElementById('transferSuccessModal').classList.add('hidden');
});

// Contact advisor button
document.getElementById('contactAdvisorBtn')?.addEventListener('click', () => {
    document.getElementById('transferRejectedModal').classList.add('hidden');
    securitySession.showToast('Your advisor will contact you shortly', 'info');
});

// Download confirmation
document.getElementById('downloadConfirmation')?.addEventListener('click', () => {
    securitySession.showToast('Confirmation downloaded successfully', 'success');
});

// Inactivity warning
document.getElementById('extendSession')?.addEventListener('click', () => {
    securitySession.extendSession();
});

// Login form
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    // In real app, this would authenticate with backend
    window.location.href = 'dashboard.html';
    securitySession.showToast('Successfully logged in', 'success');
});

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    securitySession.logout();
});

// Quick actions
document.getElementById('quickDeposit')?.addEventListener('click', () => {
    showSection('transfers');
    showTransferStep(1);
});

document.getElementById('quickWithdraw')?.addEventListener('click', () => {
    showSection('transfers');
    showTransferStep(1);
});

// Edit profile
document.getElementById('editProfileBtn')?.addEventListener('click', () => {
    securitySession.showToast('Edit profile functionality coming soon', 'info');
});

// Amount presets
document.querySelectorAll('.amount-preset').forEach(preset => {
    preset.addEventListener('click', () => {
        document.querySelectorAll('.amount-preset').forEach(p => {
            p.classList.remove('active');
        });
        preset.classList.add('active');
        
        const amount = preset.textContent.replace('£', '').replace(',', '');
        document.querySelector('.amount-input').value = amount;
    });
});

// Close modals on outside click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.add('hidden');
        }
    });
});

// ===== TRANSFER MANAGER =====
class TransferManager {
    constructor() {
        this.transferData = {
            amount: 0,
            type: 'withdrawal',
            fromAccount: 'HeritageInvest Premium',
            fromAccountId: 'premium',
            toAccount: '•••• 1234 - Lloyds Bank',
            toAccountId: 'lloyds',
            reference: '',
            status: 'pending',
            date: new Date(),
            referenceId: ''
        };
        
        this.availableBalance = 284732.08;
        this.bankAccounts = [
            { id: 'lloyds', name: '•••• 1234 - Lloyds Bank (Current)', type: 'current' },
            { id: 'hsbc', name: '•••• 5678 - HSBC (Savings)', type: 'savings' },
            { id: 'barclays', name: '•••• 9012 - Barclays (Business)', type: 'business' },
            { id: 'santander', name: '•••• 3456 - Santander (Joint)', type: 'joint' }
        ];
        
        this.portfolioAccounts = [
            { id: 'premium', name: 'HeritageInvest Premium (•••• 7284)', balance: 9847320.85 },
            { id: 'growth', name: 'Growth Portfolio (•••• 7285)', balance: 2500000.00 },
            { id: 'income', name: 'Income Portfolio (•••• 7286)', balance: 1500000.00 }
        ];
        
        this.initializeTransfer();
    }
    
    initializeTransfer() {
        this.setupEventListeners();
        this.updateAvailableBalance();
    }
    
    setupEventListeners() {
        // Amount presets
        document.querySelectorAll('.amount-preset').forEach(button => {
            button.addEventListener('click', (e) => {
                const amount = parseFloat(e.target.dataset.amount);
                this.setAmount(amount);
                this.clearAmountError();
                
                // Update active state
                document.querySelectorAll('.amount-preset').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
            });
        });
        
        // Amount input
        const amountInput = document.getElementById('transferAmount');
        if (amountInput) {
            amountInput.addEventListener('input', (e) => {
                this.handleAmountInput(e.target.value);
                this.clearAmountError();
                
                // Clear preset active state when typing
                document.querySelectorAll('.amount-preset').forEach(btn => {
                    btn.classList.remove('active');
                });
            });
            
            amountInput.addEventListener('blur', (e) => {
                this.formatAmountInput(e.target);
            });
        }
        
        // Transfer type
        const transferType = document.getElementById('transferType');
        if (transferType) {
            transferType.addEventListener('change', (e) => {
                this.transferData.type = e.target.value;
                this.updateAccountOptions();
            });
        }
        
        // From account
        const fromAccount = document.getElementById('fromAccount');
        if (fromAccount) {
            fromAccount.addEventListener('change', (e) => {
                const accountId = e.target.value;
                const account = this.portfolioAccounts.find(acc => acc.id === accountId);
                if (account) {
                    this.transferData.fromAccount = account.name;
                    this.transferData.fromAccountId = account.id;
                    this.availableBalance = account.balance;
                    this.updateAvailableBalance();
                }
            });
        }
        
        // To account
        const toAccount = document.getElementById('toAccount');
        if (toAccount) {
            toAccount.addEventListener('change', (e) => {
                if (e.target.value === 'add') {
                    this.showAddBankModal();
                } else {
                    const account = this.bankAccounts.find(acc => acc.id === e.target.value);
                    if (account) {
                        this.transferData.toAccount = account.name;
                        this.transferData.toAccountId = account.id;
                    }
                }
            });
        }
        
        // Transfer reference
        const referenceInput = document.getElementById('transferReference');
        if (referenceInput) {
            referenceInput.addEventListener('input', (e) => {
                this.transferData.reference = e.target.value;
            });
        }
        
        // Step navigation
        document.getElementById('nextStep1')?.addEventListener('click', () => {
            if (this.validateAmount()) {
                showTransferStep(2);
            }
        });
        
        document.getElementById('nextStep2')?.addEventListener('click', () => {
            if (this.validateDetails()) {
                this.updateReviewDetails();
                showTransferStep(3);
            }
        });
    }
    
    setAmount(amount) {
        this.transferData.amount = amount;
        const amountInput = document.getElementById('transferAmount');
        if (amountInput) {
            amountInput.value = this.formatCurrency(amount);
        }
    }
    
    handleAmountInput(value) {
        // Remove non-numeric characters except decimal point
        let cleanValue = value.replace(/[^\d.]/g, '');
        
        // Ensure only one decimal point
        const parts = cleanValue.split('.');
        if (parts.length > 2) {
            cleanValue = parts[0] + '.' + parts.slice(1).join('');
        }
        
        // Limit to 2 decimal places
        if (parts.length === 2 && parts[1].length > 2) {
            cleanValue = parts[0] + '.' + parts[1].substring(0, 2);
        }
        
        // Update input
        const amountInput = document.getElementById('transferAmount');
        if (amountInput) {
            amountInput.value = cleanValue;
        }
        
        // Store numeric value
        this.transferData.amount = parseFloat(cleanValue) || 0;
    }
    
    formatAmountInput(input) {
        if (!input.value) return;
        
        const numericValue = parseFloat(input.value.replace(/[^\d.]/g, ''));
        if (!isNaN(numericValue)) {
            input.value = this.formatCurrency(numericValue);
            this.transferData.amount = numericValue;
        }
    }
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-GB', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }
    
    validateAmount() {
        const amount = this.transferData.amount;
        const amountError = document.getElementById('amountError');
        
        if (!amount || amount <= 0) {
            this.showAmountError('Please enter a valid amount');
            return false;
        }
        
        if (amount > this.availableBalance) {
            this.showAmountError(`Amount exceeds available balance of £${this.formatCurrency(this.availableBalance)}`);
            return false;
        }
        
        if (amount < 100) {
            this.showAmountError('Minimum transfer amount is £100');
            return false;
        }
        
        if (amount > 50000 && this.transferData.type === 'withdrawal') {
            // Large withdrawal warning
            if (!confirm(`You are requesting a withdrawal of £${this.formatCurrency(amount)}. Large withdrawals may require additional verification. Continue?`)) {
                return false;
            }
        }
        
        return true;
    }
    
    validateDetails() {
        if (!this.transferData.toAccountId || this.transferData.toAccountId === 'add') {
            alert('Please select a destination account');
            return false;
        }
        
        return true;
    }
    
    showAmountError(message) {
        const amountError = document.getElementById('amountError');
        if (amountError) {
            amountError.textContent = message;
            amountError.classList.remove('hidden');
            
            // Scroll to error
            amountError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    clearAmountError() {
        const amountError = document.getElementById('amountError');
        if (amountError) {
            amountError.classList.add('hidden');
        }
    }
    
    updateAvailableBalance() {
        const balanceElement = document.getElementById('availableBalance');
        if (balanceElement) {
            balanceElement.textContent = `£${this.formatCurrency(this.availableBalance)}`;
        }
    }
    
    updateAccountOptions() {
        // Update "from account" options based on transfer type
        const fromAccountSelect = document.getElementById('fromAccount');
        if (fromAccountSelect && this.transferData.type === 'deposit') {
            // For deposits, show bank accounts as "from"
            fromAccountSelect.innerHTML = this.bankAccounts.map(account => 
                `<option value="${account.id}">${account.name}</option>`
            ).join('');
            
            // Update transfer data
            const firstAccount = this.bankAccounts[0];
            this.transferData.fromAccount = firstAccount.name;
            this.transferData.fromAccountId = firstAccount.id;
        }
    }
    
    updateReviewDetails() {
        const reviewContainer = document.getElementById('reviewDetails');
        if (!reviewContainer) return;
        
        const transferTypeLabels = {
            'withdrawal': 'Withdrawal',
            'deposit': 'Deposit',
            'internal': 'Internal Transfer'
        };
        
        const date = new Date();
        const estimatedDate = new Date(date);
        estimatedDate.setDate(estimatedDate.getDate() + 2); // 2 business days
        
        // Generate reference ID
        const refId = 'TRF-' + Math.random().toString(36).substr(2, 8).toUpperCase();
        this.transferData.referenceId = refId;
        
        reviewContainer.innerHTML = `
            <div>
                <div class="text-micro">Amount</div>
                <div class="text-xl font-semibold">£${this.formatCurrency(this.transferData.amount)}</div>
            </div>
            <div>
                <div class="text-micro">Type</div>
                <div>${transferTypeLabels[this.transferData.type] || this.transferData.type}</div>
            </div>
            <div>
                <div class="text-micro">From Account</div>
                <div>${this.transferData.fromAccount}</div>
            </div>
            <div>
                <div class="text-micro">To Account</div>
                <div>${this.transferData.toAccount}</div>
            </div>
            <div>
                <div class="text-micro">Reference</div>
                <div>${this.transferData.reference || 'No reference provided'}</div>
            </div>
            <div>
                <div class="text-micro">Est. Completion</div>
                <div>${estimatedDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</div>
            </div>
            <div>
                <div class="text-micro">Transfer ID</div>
                <div class="font-mono text-sm">${refId}</div>
            </div>
            <div>
                <div class="text-micro">Status</div>
                <div><span class="badge badge-info">Pending Confirmation</span></div>
            </div>
        `;
    }
    
    showAddBankModal() {
        // In a real app, this would open a modal to add a new bank account
        alert('Add Bank Account functionality would open here. For demo purposes, please select an existing account.');
        
        // Reset to first option
        const toAccountSelect = document.getElementById('toAccount');
        if (toAccountSelect) {
            toAccountSelect.value = this.bankAccounts[0].id;
            this.transferData.toAccount = this.bankAccounts[0].name;
            this.transferData.toAccountId = this.bankAccounts[0].id;
        }
    }
    
    getTransferData() {
        return {
            ...this.transferData,
            date: new Date().toISOString(),
            timestamp: Date.now(),
            clientId: appState.clientData.clientId,
            clientName: appState.clientData.name
        };
    }
    
    resetTransfer() {
        this.transferData = {
            amount: 0,
            type: 'withdrawal',
            fromAccount: 'HeritageInvest Premium',
            fromAccountId: 'premium',
            toAccount: '•••• 1234 - Lloyds Bank',
            toAccountId: 'lloyds',
            reference: '',
            status: 'pending',
            date: new Date(),
            referenceId: ''
        };
        
        // Reset form elements
        const amountInput = document.getElementById('transferAmount');
        if (amountInput) amountInput.value = '';
        
        const referenceInput = document.getElementById('transferReference');
        if (referenceInput) referenceInput.value = '';
        
        const transferType = document.getElementById('transferType');
        if (transferType) transferType.value = 'withdrawal';
        
        const fromAccount = document.getElementById('fromAccount');
        if (fromAccount) fromAccount.value = 'premium';
        
        const toAccount = document.getElementById('toAccount');
        if (toAccount) toAccount.value = 'lloyds';
        
        // Clear preset active states
        document.querySelectorAll('.amount-preset').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Clear errors
        this.clearAmountError();
        
        // Reset to step 1
        showTransferStep(1);
    }
}

// Initialize transfer manager
let transferManager;

// Make managers globally available for button onclick handlers
window.transactionsManager = transactionsManager;
window.documentsManager = documentsManager;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize security session
    securitySession = new SecuritySession();
    
    // Check if we're on dashboard page
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('dashboard.html')) {
        // Initialize dashboard-specific managers
        timeManager = new TimeManager();
        transactionsManager = new TransactionsManager();
        documentsManager = new DocumentsManager();
        
        // Set current year in footer
        const yearElements = document.querySelectorAll('.current-year');
        yearElements.forEach(el => {
            el.textContent = new Date().getFullYear();
        });
        
        // Force initial header state based on device and section
        setTimeout(() => {
            if (window.innerWidth <= 768) {
                // Mobile - apply header toggle based on current section
                toggleDashboardHeader(appState.currentSection);
            } else {
                // Desktop - ensure header is always visible
                const dashboardHeader = document.querySelector('.dashboard-header');
                if (dashboardHeader) {
                    dashboardHeader.style.display = 'block';
                    dashboardHeader.style.removeProperty('display');
                }
            }
        }, 100);
    }
    
    // Professional console message
    console.log('%c⚡ HeritageInvest UK - Institutional Platform', 'color: #007A7C; font-size: 16px; font-weight: bold;');
    console.log('%c🔒 FCA Compliant Wealth Management System', 'color: #0A2342;');
    console.log('%c💰 Professional Client Interface Active', 'color: #B8860B;');
    console.log('%c📱 Mobile-Optimized Interface Enabled', 'color: #006B54;');
    console.log('%c⏰ 30-Second Inactivity Logout Active', 'color: #DC2626;');
    console.log('%c📊 Transactions & Documents Management Loaded', 'color: #1D4ED8;');
});

// Handle back button on mobile
window.addEventListener('popstate', function() {
    const currentPage = window.location.pathname;
    if (currentPage.includes('dashboard.html') && window.innerWidth <= 768) {
        if (appState.currentSection !== 'overview') {
            showSection('overview');
            history.pushState(null, null, '#overview');
        }
    }
});

// Add history state for mobile navigation
dashboardNavLinks.forEach(link => {
    link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
            const section = this.getAttribute('data-section');
            history.pushState(null, null, `#${section}`);
        }
    });
});

// STRICT LOGIN FUNCTION - Blocks ALL unauthorized access
function strictLoginCheck(email, password) {
    // Normalize inputs
    email = String(email).trim().toLowerCase();
    password = String(password).trim();
    
    console.log('🔐 Login attempt:', email.substring(0, 3) + '***'); // Hide full email in logs
    
    // ONLY these exact credentials will work
    const authorizedCredentials = {
        'jonathan.sterling@email.com': 'SterlingInvest2023!',
        'premium@heritageinvest.co.uk': 'PremiumAccess2023!',
        'demo': 'demo'
    };
    
    // Check if email exists
    if (!authorizedCredentials.hasOwnProperty(email)) {
        console.log('❌ ACCESS DENIED: Unauthorized email address');
        return false;
    }
    
    // Check if password matches EXACTLY
    if (authorizedCredentials[email] !== password) {
        console.log('❌ ACCESS DENIED: Incorrect password for', email);
        return false;
    }
    
    console.log('✅ ACCESS GRANTED: Valid credentials for', email);
    return true;
}

// UPDATED LOGIN HANDLER WITH 5-SECOND DELAY (NO CONSOLE LOGS)
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    // Get values
    const email = document.getElementById('clientId').value;
    const password = document.getElementById('password').value;
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');
    
    // Disable button and show loading
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';
    }
    
    // Wait 5 seconds WITHOUT console logs
    setTimeout(function() {
        // Validate credentials
        const isValid = strictLoginCheck(email, password);
        
        // Reset button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-lock mr-2"></i> Secure Login';
        }
        
        if (isValid) {
            // SUCCESS - Set authentication state
            appState.isAuthenticated = true;
            appState.currentUser = {
                ...appState.clientData,
                email: email,
                name: email === 'demo' ? 'Demo User' : 'Jonathan Sterling'
            };
            
            // Store session
            sessionStorage.setItem('heritageinvest_premium_session', 'active');
            sessionStorage.setItem('heritageinvest_client', JSON.stringify(appState.currentUser));
            
            // Clear form
            document.getElementById('loginForm').reset();
            
            // Show success (without console log)
            if (securitySession && securitySession.showToast) {
                securitySession.showToast('Login successful', 'success');
            }
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
            
        } else {
            // FAILURE - Show access denied
            alert('ACCESS DENIED\n\n' +
                'The credentials you entered are not authorized.\n\n' +
                'Authorized credentials:\n' +
                '• jonathan.sterling@email.com / SterlingInvest2023!\n' +
                '• premium@heritageinvest.co.uk / PremiumAccess2023!\n' +
                '• demo / demo');
            
            // Clear password only
            document.getElementById('password').value = '';
            
            // Focus back to email field
            document.getElementById('clientId').focus();
        }
    }, 5000); // 5-second delay
});

// Add this function to show/hide dashboard header based on section
// ===== DASHBOARD HEADER MANAGEMENT =====
function toggleDashboardHeader(sectionName) {
    const dashboardHeader = document.querySelector('.dashboard-header');
    
    if (!dashboardHeader) return;
    
    // ONLY apply on mobile devices
    if (window.innerWidth <= 768) {
        // Sections where header should be HIDDEN on mobile
        const hideHeaderSections = ['transactions', 'transfers', 'documents'];
        
        // Sections where header should be SHOWN on mobile
        const showHeaderSections = ['overview', 'portfolio', 'profile'];
        
        if (hideHeaderSections.includes(sectionName)) {
            // Hide header on mobile for these sections
            dashboardHeader.style.display = 'none';
            
            // Adjust content position
            const mainContainer = document.querySelector('main .container');
            if (mainContainer) {
                mainContainer.style.paddingTop = '1rem';
                mainContainer.style.marginTop = '-80px';
            }
        } 
        else if (showHeaderSections.includes(sectionName)) {
            // Show header on mobile for these sections
            dashboardHeader.style.display = 'block';
            
            // Reset adjustments
            const mainContainer = document.querySelector('main .container');
            if (mainContainer) {
                mainContainer.style.paddingTop = '';
                mainContainer.style.marginTop = '';
            }
        }
    }
    // Desktop stays completely unchanged
}

// Update mobile navigation event listeners
document.querySelectorAll('.mobile-nav').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.getAttribute('data-section');
        showSection(section);
        
        // Smooth scroll to top on mobile
        if (window.innerWidth <= 768) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});

// Safety check on window resize - keep desktop unchanged
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        // Desktop - force show header
        const dashboardHeader = document.querySelector('.dashboard-header');
        if (dashboardHeader) {
            dashboardHeader.style.display = 'block';
        }
        
        // Reset any mobile adjustments
        const mainContainer = document.querySelector('main .container');
        if (mainContainer) {
            mainContainer.style.paddingTop = '';
            mainContainer.style.marginTop = '';
        }
    }
});