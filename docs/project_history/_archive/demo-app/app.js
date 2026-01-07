// First Contact E.I.S. - Interactive Demo Application

// Demo Data
const demoData = {
    organizations: [
        {
            id: 1,
            name: "Long Beach Homeless Services",
            city: "Long Beach",
            state: "CA"
        }
    ],

    vendors: [
        {
            id: 1,
            name: "PATH (People Assisting The Homeless)",
            slug: "path",
            rank: 1,
            color: "green",
            housing_rate: 0.73,
            cost_per_outcome: 21000,
            avg_days_to_housing: 32,
            retention_6mo: 0.85,
            total_clients: 20,
            housed_count: 15,
            annual_contract: 420000,
            ai_insight: "PATH delivers excellent cost efficiency at $21K per outcome. Consider expanding their contract to maximize ROI."
        },
        {
            id: 2,
            name: "Long Beach Rescue Mission",
            slug: "lbrm",
            rank: 2,
            color: "yellow",
            housing_rate: 0.68,
            cost_per_outcome: 29000,
            avg_days_to_housing: 45,
            retention_6mo: 0.79,
            total_clients: 20,
            housed_count: 14,
            annual_contract: 394600,
            ai_insight: "Solid performance with good retention rates. Faith-based approach resonates with specific client populations."
        },
        {
            id: 3,
            name: "CityNet",
            slug: "citynet",
            rank: 3,
            color: "yellow",
            housing_rate: 0.61,
            cost_per_outcome: 33000,
            avg_days_to_housing: 58,
            retention_6mo: 0.72,
            total_clients: 20,
            housed_count: 12,
            annual_contract: 402600,
            ai_insight: "Average performance. Consider targeted training on rapid benefit enrollment to reduce time to housing."
        },
        {
            id: 4,
            name: "Mental Health America of LA (MHALA)",
            slug: "mhala",
            rank: 4,
            color: "red",
            housing_rate: 0.42,
            cost_per_outcome: 78000,
            avg_days_to_housing: 89,
            retention_6mo: 0.61,
            total_clients: 20,
            housed_count: 8,
            annual_contract: 653400,
            ai_insight: "At $78K per outcome, MHALA is 3.7x more expensive than PATH. Reallocating 30% of MHALA's contract to PATH could fund 47 additional placements annually at the same total cost.",
            is_warning: true
        }
    ],

    clientJourney: {
        name: "Maria Garcia",
        steps: [
            {
                date: "Nov 3, 2024",
                title: "🔍 QR Scan at MLK Park",
                description: "Client scanned QR code, auto-assigned to PATH"
            },
            {
                date: "Nov 3, 2024",
                title: "🤖 AI Case Plan Generated",
                description: "Pathway: Rapid Rehousing | VI-SPDAT: 7 | Benefit Stack: $2,100/month"
            },
            {
                date: "Nov 4, 2024",
                title: "✅ Plan Approved by Caseworker",
                description: "Client received SMS with DPSS appointment details"
            },
            {
                date: "Nov 7, 2024",
                title: "📋 DPSS Assessment Completed",
                description: "Approved for CalFresh ($234/mo), GR Housing Subsidy ($575/mo)"
            },
            {
                date: "Nov 28, 2024",
                title: "🏠 HOUSED!",
                description: "Studio apartment in North Long Beach | $850/mo with Section 8<br>Total time: <span class=\"highlight-good\">25 days from scan to housed</span>"
            }
        ]
    }
};

// Calculate totals
function calculateTotals() {
    const totals = {
        total_vendors: demoData.vendors.length,
        total_clients: demoData.vendors.reduce((sum, v) => sum + v.total_clients, 0),
        total_housed: demoData.vendors.reduce((sum, v) => sum + v.housed_count, 0),
        total_spent: demoData.vendors.reduce((sum, v) => sum + v.annual_contract, 0)
    };
    totals.housing_rate = totals.total_housed / totals.total_clients;
    return totals;
}

// Format currency
function formatCurrency(amount) {
    if (amount >= 1000000) {
        return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
        return `$${(amount / 1000).toFixed(0)}K`;
    } else {
        return `$${amount}`;
    }
}

// Format percentage
function formatPercent(decimal) {
    return `${Math.round(decimal * 100)}%`;
}

// Render Vendor View
function renderVendorView() {
    return `
        <div class="dashboard-title">Vendor Dashboard - PATH</div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">18</div>
                <div class="stat-label">Active Clients</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">13</div>
                <div class="stat-label">Housed This Month</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">32</div>
                <div class="stat-label">Avg Days to Housing</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">4.2</div>
                <div class="stat-label">AI Case Plans Today</div>
            </div>
        </div>

        <h3 style="margin: 30px 0 15px 0; font-size: 1.5em;">Recent QR Intake - ${demoData.clientJourney.name}</h3>

        <div class="client-journey">
            ${demoData.clientJourney.steps.map(step => `
                <div class="journey-step">
                    <div class="journey-date">${step.date}</div>
                    <div class="journey-content">
                        <strong>${step.title}</strong>
                        <div>${step.description}</div>
                    </div>
                </div>
            `).join('')}
        </div>

        <div style="text-align: center; margin-top: 50px; padding: 40px; background: #f3f4f6; border-radius: 15px;">
            <h3 style="margin-bottom: 20px; font-size: 1.8em;">This is what vendors see.</h3>
            <p style="font-size: 1.2em; color: #666; margin-bottom: 35px;">
                They love it because it saves 3+ hours per day.<br>
                AI case plans, benefit calculators, automated compliance reporting.
            </p>
            <button class="reveal-button" onclick="showLayer8()">
                🎯 REVEAL LAYER 8
            </button>
            <p style="font-size: 1em; color: #999; margin-top: 20px; font-style: italic;">
                This is what vendors DON'T see...
            </p>
        </div>
    `;
}

// Render Layer 8 View
function renderLayer8View() {
    const totals = calculateTotals();

    return `
        <div class="layer8-banner">
            <h2>🎯 LAYER 8: City Intelligence Dashboard</h2>
            <p>This is the hidden accountability layer. Vendors cannot access this.</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${totals.total_vendors}</div>
                <div class="stat-label">Active Vendors</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${totals.total_clients}</div>
                <div class="stat-label">Total Clients</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${totals.total_housed}</div>
                <div class="stat-label">Housed (${formatPercent(totals.housing_rate)})</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${formatCurrency(totals.total_spent)}</div>
                <div class="stat-label">Total Spent YTD</div>
            </div>
        </div>

        <h3 style="margin: 40px 0 25px 0; font-size: 1.8em;">🏆 Vendor Performance Comparison</h3>

        <div class="vendor-list">
            ${demoData.vendors.map(vendor => `
                <div class="vendor-card ${vendor.color}">
                    <div class="vendor-header">
                        <div class="vendor-name">${vendor.name}</div>
                        <div class="vendor-badge ${vendor.color}">RANK #${vendor.rank}</div>
                    </div>
                    <div class="vendor-metrics">
                        <div class="metric">
                            <div class="metric-value ${vendor.housing_rate >= 0.70 ? 'good' : vendor.housing_rate <= 0.50 ? 'bad' : ''}">
                                ${formatPercent(vendor.housing_rate)}
                            </div>
                            <div class="metric-label">Housing Rate</div>
                        </div>
                        <div class="metric">
                            <div class="metric-value ${vendor.cost_per_outcome <= 25000 ? 'good' : vendor.cost_per_outcome >= 60000 ? 'bad' : ''}">
                                ${formatCurrency(vendor.cost_per_outcome)}
                            </div>
                            <div class="metric-label">Cost/Outcome</div>
                        </div>
                        <div class="metric">
                            <div class="metric-value">${vendor.avg_days_to_housing}d</div>
                            <div class="metric-label">Avg Days</div>
                        </div>
                        <div class="metric">
                            <div class="metric-value ${vendor.retention_6mo >= 0.80 ? 'good' : vendor.retention_6mo <= 0.65 ? 'bad' : ''}">
                                ${formatPercent(vendor.retention_6mo)}
                            </div>
                            <div class="metric-label">6-mo Retention</div>
                        </div>
                    </div>
                    <div class="ai-insight ${vendor.is_warning ? 'warning' : ''}">
                        💡 <strong>AI Insight:</strong> ${vendor.ai_insight}
                    </div>
                </div>
            `).join('')}
        </div>

        <h3 style="margin: 50px 0 25px 0; font-size: 1.8em;">📊 The Numbers Don't Lie</h3>

        <table class="comparison-table">
            <thead>
                <tr>
                    <th>Vendor</th>
                    <th>Annual Contract</th>
                    <th>Clients Served</th>
                    <th>Housed</th>
                    <th>Cost per Outcome</th>
                    <th>Potential Savings</th>
                </tr>
            </thead>
            <tbody>
                ${demoData.vendors.map((vendor, index) => {
                    const baseline = demoData.vendors[0].cost_per_outcome;
                    const savings = (vendor.cost_per_outcome - baseline) * vendor.housed_count;

                    return `
                        <tr ${vendor.color === 'red' ? 'style="background: #fef2f2;"' : ''}>
                            <td><strong>${vendor.name.split('(')[0].trim()}</strong></td>
                            <td>${formatCurrency(vendor.annual_contract)}</td>
                            <td>${vendor.total_clients}</td>
                            <td class="${vendor.housing_rate >= 0.70 ? 'highlight-good' : vendor.housing_rate <= 0.50 ? 'highlight-bad' : ''}">
                                ${vendor.housed_count} (${formatPercent(vendor.housing_rate)})
                            </td>
                            <td class="${vendor.cost_per_outcome <= 25000 ? 'highlight-good' : vendor.cost_per_outcome >= 60000 ? 'highlight-bad' : ''}">
                                ${formatCurrency(vendor.cost_per_outcome)}
                            </td>
                            <td class="${savings > 0 ? 'highlight-bad' : 'highlight-good'}">
                                ${savings > 0 ? '+' : ''}${formatCurrency(savings)}
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
            <tfoot>
                <tr>
                    <td>TOTAL</td>
                    <td>${formatCurrency(totals.total_spent)}</td>
                    <td>${totals.total_clients}</td>
                    <td>${totals.total_housed}</td>
                    <td>${formatCurrency(totals.total_spent / totals.total_housed)} avg</td>
                    <td class="highlight-bad">+${formatCurrency(712000)} wasted</td>
                </tr>
            </tfoot>
        </table>

        <div class="info-box danger">
            <h2>💰 THE BOTTOM LINE</h2>
            <p style="font-size: 1.4em; margin-bottom: 20px;">
                If all vendors performed like PATH (73% housing rate at $21K cost):
            </p>
            <div class="big-number">
                You'd house <span class="highlight-good">58 people</span> instead of ${totals.total_housed}
            </div>
            <p style="font-size: 1.4em; margin-bottom: 20px;">
                With <span class="highlight-good">the same ${formatCurrency(totals.total_spent)} budget</span>
            </p>
            <p style="font-size: 1.2em; color: #666; margin-top: 35px;">
                That's <strong>${58 - totals.total_housed} additional people with stable housing</strong> per year.<br>
                Times 10 years = <strong>${(58 - totals.total_housed) * 10} lives changed</strong>.<br>
                <strong>By simply funding the right vendors.</strong>
            </p>
        </div>

        <div style="text-align: center; margin-top: 60px; padding: 50px; background: #f9fafb; border-radius: 15px;">
            <h2 style="margin-bottom: 25px; font-size: 2.2em;">This is Layer 8.</h2>
            <p style="font-size: 1.3em; color: #666; margin-bottom: 25px;">
                The hidden accountability layer that vendors don't know exists.
            </p>
            <p style="font-size: 1.5em; color: #667eea; font-weight: 700;">
                This is why they mandate it.
            </p>
        </div>
    `;
}

// Show vendor view
function showVendorView() {
    document.querySelector('.dashboard').innerHTML = renderVendorView();
    updateActiveButton('vendor');
}

// Show Layer 8 view
function showLayer8() {
    document.querySelector('.dashboard').innerHTML = renderLayer8View();
    updateActiveButton('layer8');
}

// Update active button state
function updateActiveButton(view) {
    const buttons = document.querySelectorAll('.view-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === view) {
            btn.classList.add('active');
        }
    });
}

// Initialize app
function initApp() {
    const appContainer = document.getElementById('app');

    appContainer.innerHTML = `
        <div class="app-header">
            <h1>🎯 First Contact E.I.S.</h1>
            <p>Interactive Live Demo - The Trojan Horse Strategy</p>
        </div>

        <div class="view-selector">
            <button class="view-btn active" data-view="vendor" onclick="showVendorView()">
                🏢 Vendor View (Layers 1-7)
            </button>
            <button class="view-btn" data-view="layer8" onclick="showLayer8()">
                🎯 City View (Layer 8) - THE REVEAL
            </button>
        </div>

        <div class="dashboard">
            ${renderVendorView()}
        </div>
    `;
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
