document.addEventListener('DOMContentLoaded', function () {
    if (!window._adminStats || typeof Chart === 'undefined') return;

    var data = window._adminStats;
    var palette = ['#42a5f5', '#66bb6a', '#ffa726', '#ef5350', '#ab47bc', '#26c6da', '#d4e157'];

    var byDay = data.bookingsByDay;
    if (byDay && Object.keys(byDay).length > 0) {
        new Chart(document.getElementById('adminDayChart'), {
            type: 'bar',
            data: {
                labels: Object.keys(byDay),
                datasets: [{
                    label: 'Bokningar per dag',
                    data: Object.values(byDay),
                    backgroundColor: Object.keys(byDay).map(function (_, i) { return palette[i % palette.length]; }),
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false }, title: { display: true, text: 'Bokningar per veckodag', color: '#e0e0e0' } },
                scales: {
                    y: { beginAtZero: true, ticks: { color: '#aaa', stepSize: 1 }, grid: { color: '#333' } },
                    x: { ticks: { color: '#aaa' }, grid: { display: false } }
                }
            }
        });
    }

    var byCat = data.bookingsByCategory;
    if (byCat && Object.keys(byCat).length > 0) {
        new Chart(document.getElementById('adminCatChart'), {
            type: 'doughnut',
            data: {
                labels: Object.keys(byCat),
                datasets: [{
                    data: Object.values(byCat),
                    backgroundColor: palette.slice(0, Object.keys(byCat).length)
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#ccc' } },
                    title: { display: true, text: 'Bokningar per kategori', color: '#e0e0e0' }
                }
            }
        });
    }

    var overTime = data.bookingsOverTime;
    if (overTime && Object.keys(overTime).length > 0) {
        new Chart(document.getElementById('adminTimeChart'), {
            type: 'line',
            data: {
                labels: Object.keys(overTime),
                datasets: [{
                    label: 'Bokningar',
                    data: Object.values(overTime),
                    borderColor: '#42a5f5',
                    backgroundColor: 'rgba(66,165,245,0.15)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false }, title: { display: true, text: 'Bokningar över tid', color: '#e0e0e0' } },
                scales: {
                    y: { beginAtZero: true, ticks: { color: '#aaa', stepSize: 1 }, grid: { color: '#333' } },
                    x: { ticks: { color: '#aaa' }, grid: { display: false } }
                }
            }
        });
    }
});
