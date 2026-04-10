document.addEventListener('DOMContentLoaded', function () {

    let activeCategory = 'all';

    function showDay(dayId) {
        document.querySelectorAll('.day-schedule').forEach(function (s) {
            s.style.display = 'none';
        });
        var target = document.getElementById(dayId);
        if (target) target.style.display = 'block';
        applyCategoryFilter();
    }

    function setActiveButton(dayId) {
        document.querySelectorAll('.day-buttons button').forEach(function (b) {
            b.classList.remove('active');
            if (b.getAttribute('data-day') === dayId) {
                b.classList.add('active');
            }
        });
    }

    function applyCategoryFilter() {
        document.querySelectorAll('.class-entry').forEach(function (entry) {
            var cat = entry.getAttribute('data-category');
            if (activeCategory === 'all' || cat === activeCategory) {
                entry.style.display = '';
            } else {
                entry.style.display = 'none';
            }
        });
    }

    document.querySelectorAll('.day-buttons button').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var dayId = btn.getAttribute('data-day');
            if (dayId) {
                setActiveButton(dayId);
                showDay(dayId);
            }
        });
    });

    document.querySelectorAll('.category-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.category-btn').forEach(function (b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            activeCategory = btn.getAttribute('data-category');
            applyCategoryFilter();
        });
    });

    // Booking tabs
    document.querySelectorAll('.booking-tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
            document.querySelectorAll('.booking-tab').forEach(function (t) { t.classList.remove('active'); });
            tab.classList.add('active');
            var target = tab.getAttribute('data-tab');
            document.querySelectorAll('.booking-panel').forEach(function (p) {
                p.style.display = p.id === target ? 'block' : 'none';
            });
        });
    });

    var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    var today = days[new Date().getDay()];
    var todayEl = document.getElementById(today);
    if (todayEl) {
        showDay(today);
        setActiveButton(today);
    }

});
