document.addEventListener('DOMContentLoaded', function () {
    if (typeof Chart === 'undefined' || !window._statsData) return;

    const catData = window._statsData.categoryBreakdown;
    const monthData = window._statsData.monthlyTrend;

    const catCanvas = document.getElementById('categoryChart');
    if (catCanvas && Object.keys(catData).length > 0) {
        const labels = Object.keys(catData);
        const values = Object.values(catData);
        const colors = labels.map(function (l) {
            switch (l) {
                case 'BJJ': return '#42a5f5';
                case 'THAIBOXNING': return '#ef5350';
                case 'BOXNING': return '#ffa726';
                case 'FYS': return '#66bb6a';
                case 'SPARRING': return '#ab47bc';
                default: return '#90caf9';
            }
        });

        new Chart(catCanvas, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: colors,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#ccc' } }
                }
            }
        });
    }

    const monthCanvas = document.getElementById('monthlyChart');
    if (monthCanvas && Object.keys(monthData).length > 0) {
        new Chart(monthCanvas, {
            type: 'bar',
            data: {
                labels: Object.keys(monthData),
                datasets: [{
                    label: 'Pass per månad',
                    data: Object.values(monthData),
                    backgroundColor: '#1565c0',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, ticks: { color: '#999' }, grid: { color: '#333' } },
                    x: { ticks: { color: '#999' }, grid: { display: false } }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
});
