document.addEventListener('DOMContentLoaded', function () {

    // === Hamburger Menu Toggle ===
    const hamburger = document.getElementById('hamburgerToggle');
    if (hamburger) {
        hamburger.addEventListener('click', function () {
            const nav = document.querySelector('header nav');
            if (nav) nav.classList.toggle('active');
        });
    }

    // === Onboarding Banner Close ===
    const closeBanner = document.getElementById('closeBannerBtn');
    if (closeBanner) {
        closeBanner.addEventListener('click', function () {
            const banner = document.getElementById('onboardingBanner');
            if (banner) banner.style.display = 'none';
        });
    }

    // === Confirmation Modal ===
    const overlay = document.getElementById('confirmModalOverlay');
    if (overlay) {
        const modalTitle = overlay.querySelector('.confirm-modal h3');
        const modalText = overlay.querySelector('.confirm-modal p');
        const btnConfirm = overlay.querySelector('.btn-confirm');
        const btnCancel = overlay.querySelector('.btn-cancel-modal');
        let pendingForm = null;

        function showConfirmModal(title, text, form) {
            modalTitle.textContent = title;
            modalText.textContent = text;
            pendingForm = form;
            overlay.classList.add('visible');
        }

        function hideConfirmModal() {
            overlay.classList.remove('visible');
            pendingForm = null;
        }

        btnConfirm.addEventListener('click', function () {
            if (pendingForm) {
                pendingForm.removeAttribute('data-confirm');
                pendingForm.submit();
            }
            hideConfirmModal();
        });

        btnCancel.addEventListener('click', hideConfirmModal);
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) hideConfirmModal();
        });

        document.querySelectorAll('form[data-confirm]').forEach(function (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                const message = form.getAttribute('data-confirm');
                showConfirmModal('Bekräfta', message, form);
            });
        });
    }

    // === Toast Notifications ===
    const container = document.querySelector('.toast-container');
    if (container) {
        container.querySelectorAll('.toast').forEach(function (toast) {
            setTimeout(function () {
                toast.classList.add('toast-dismiss');
                setTimeout(function () { toast.remove(); }, 300);
            }, 5000);
        });
    }

    // === Loading State on Form Submit ===
    document.querySelectorAll('form').forEach(function (form) {
        form.addEventListener('submit', function () {
            const btn = form.querySelector('button[type="submit"]');
            if (btn && !btn.classList.contains('btn-loading')) {
                btn.classList.add('btn-loading');
                btn.disabled = true;
            }
        });
    });

});
