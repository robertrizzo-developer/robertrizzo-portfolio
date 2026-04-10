document.addEventListener('DOMContentLoaded', function () {
    if (!window._trainerStats || typeof Chart === 'undefined') return;

    var data = window._trainerStats;
    var palette = ['#42a5f5', '#66bb6a', '#ffa726', '#ef5350', '#ab47bc', '#26c6da', '#d4e157'];

    var bpc = data.bookingsPerClass;
    if (bpc && Object.keys(bpc).length > 0) {
        var labels = Object.keys(bpc);
        var values = Object.values(bpc);
        new Chart(document.getElementById('trainerBookingsChart'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Bokningar',
                    data: values,
                    backgroundColor: labels.map(function (_, i) { return palette[i % palette.length]; }),
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false }, title: { display: true, text: 'Bokningar per pass', color: '#e0e0e0' } },
                scales: {
                    y: { beginAtZero: true, ticks: { color: '#aaa', stepSize: 1 }, grid: { color: '#333' } },
                    x: { ticks: { color: '#aaa', maxRotation: 45 }, grid: { display: false } }
                }
            }
        });
    }

    var wa = data.weeklyAttendance;
    if (wa && Object.keys(wa).length > 0) {
        var wLabels = Object.keys(wa);
        var wValues = Object.values(wa);
        new Chart(document.getElementById('trainerWeeklyChart'), {
            type: 'line',
            data: {
                labels: wLabels,
                datasets: [{
                    label: 'Bokningar per vecka',
                    data: wValues,
                    borderColor: '#42a5f5',
                    backgroundColor: 'rgba(66,165,245,0.15)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false }, title: { display: true, text: 'Veckovis trend', color: '#e0e0e0' } },
                scales: {
                    y: { beginAtZero: true, ticks: { color: '#aaa', stepSize: 1 }, grid: { color: '#333' } },
                    x: { ticks: { color: '#aaa' }, grid: { display: false } }
                }
            }
        });
    }
});
