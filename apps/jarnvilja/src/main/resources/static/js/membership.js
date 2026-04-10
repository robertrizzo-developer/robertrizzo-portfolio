document.addEventListener('DOMContentLoaded', function () {

    const membershipInfo = {
        'manadsmedlemskap': '<h2>Månadsmedlemskap</h2><p>Träna fritt på alla pass under vald period.</p><table><tr><th>Period</th><th>Ordinarie</th><th>Student/Arbetslös</th><th>Ungdom</th></tr><tr><td>12 mån</td><td>6000 kr</td><td>4800 kr</td><td>4000 kr</td></tr><tr><td>6 mån</td><td>3600 kr</td><td>3000 kr</td><td>2500 kr</td></tr><tr><td>3 mån</td><td>2000 kr</td><td>1600 kr</td><td>1300 kr</td></tr></table>',
        'autogiro-bundet': '<h2>Autogiro Bundet</h2><table><tr><th>Typ</th><th>Ordinarie</th><th>Student</th><th>Ungdom</th></tr><tr><td>12 mån</td><td>500 kr/mån</td><td>400 kr/mån</td><td>350 kr/mån</td></tr></table>',
        'autogiro-obundet': '<h2>Autogiro Obundet</h2><table><tr><th>Typ</th><th>Ordinarie</th><th>Student</th><th>Ungdom</th></tr><tr><td>Obundet</td><td>600 kr/mån</td><td>500 kr/mån</td><td>400 kr/mån</td></tr></table>',
        '10-klippkort': '<h2>10-klippkort</h2><table><tr><th>Typ</th><th>Ordinarie</th><th>Student</th><th>Ungdom</th></tr><tr><td>10 gånger</td><td>1200 kr</td><td>1000 kr</td><td>900 kr</td></tr></table>',
        'engangspass': '<h2>Engångspass</h2><table><tr><th>Typ</th><th>Ordinarie</th><th>Student</th><th>Ungdom</th></tr><tr><td>1 gång</td><td>150 kr</td><td>120 kr</td><td>100 kr</td></tr></table>'
    };

    const modal = document.getElementById('modal');
    if (!modal) return;

    const modalBody = document.getElementById('modal-body');
    const closeBtn = modal.querySelector('.close');

    document.querySelectorAll('[data-membership]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const type = link.getAttribute('data-membership');
            modalBody.innerHTML = membershipInfo[type] || '<p>Ingen information tillgänglig.</p>';
            modal.style.display = 'block';
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', function (e) {
        if (e.target === modal) modal.style.display = 'none';
    });

    const demoForm = document.getElementById('demoRegistrationForm');
    if (demoForm) {
        demoForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Detta är en demo – använd registreringssidan för att skapa ett konto.');
        });
    }

});
