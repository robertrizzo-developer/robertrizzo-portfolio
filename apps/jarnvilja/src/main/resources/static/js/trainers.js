document.addEventListener('DOMContentLoaded', function () {

    const trainers = {
        leif: '<h2>Leif "Benlåset" - BJJ-tränare</h2><h3>Kort presentation:</h3><p>Leif har över 10 års erfarenhet inom Brazilian Jiu-Jitsu (BJJ). Han började sin karriär i början av 2000-talet och har tävlat på högsta nivå både nationellt och internationellt.</p><h3>Meriter:</h3><ul><li>Svart bälte i BJJ</li><li>2:a plats på SM 2020</li><li>1:a plats på European Open 2019</li></ul><h3>Träningsfilosofi:</h3><p>Leif fokuserar på teknik och positionering snarare än styrka.</p><h3>Kontakt:</h3><p><strong>E-post:</strong> leif@jarnviljakampsport.com</p>',
        tony: '<h2>Tony McClinch - Thaiboxningstränare</h2><h3>Kort presentation:</h3><p>Tony har över 15 års erfarenhet inom thaiboxning och har tränat både nybörjare och professionella fighters.</p><h3>Meriter:</h3><ul><li>1:a plats på SM i thaiboxning 2018</li><li>3:a plats på European Muay Thai Championship 2020</li></ul><h3>Träningsfilosofi:</h3><p>Tony betonar vikten av att bygga styrka och uthållighet samtidigt som man arbetar med tekniska detaljer.</p><h3>Kontakt:</h3><p><strong>E-post:</strong> tony@jarnviljakampsport.com</p>',
        hanna: '<h2>Hanna "Kroknäsa" Karlsson - Boxningstränare</h2><h3>Kort presentation:</h3><p>Hanna är en tidigare landslagsboxare som har en lång erfarenhet av att träna både amatörer och professionella boxare.</p><h3>Meriter:</h3><ul><li>Flerfaldig svensk mästare i boxning</li><li>2:a plats på European Boxing Championships 2017</li></ul><h3>Träningsfilosofi:</h3><p>Hanna fokuserar på fotarbete och precision i slagen.</p><h3>Kontakt:</h3><p><strong>E-post:</strong> hanna@jarnviljakampsport.com</p>',
        kajsa: '<h2>Kettlebell-Kajsa - Fystränare</h2><h3>Kort presentation:</h3><p>Kajsa har över 10 års erfarenhet av funktionell träning och kettlebellträning.</p><h3>Meriter:</h3><ul><li>Certifierad personlig tränare</li><li>Kettlebellinstruktör med flera certifikat</li></ul><h3>Träningsfilosofi:</h3><p>Kajsa tror på att stärka hela kroppen genom funktionella rörelser.</p><h3>Kontakt:</h3><p><strong>E-post:</strong> kajsa@jarnviljakampsport.com</p>',
        fanny: '<h2>Fanny "Stenpanna" Berg - Thaiboxningstränare</h2><h3>Kort presentation:</h3><p>Fanny är känd för sin oförstörbara mentalitet och sina tuffa, hårda slag.</p><h3>Meriter:</h3><ul><li>3:e plats på SM i thaiboxning 2019</li><li>Tränat flera fighters till framgång på klubbnivå</li></ul><h3>Träningsfilosofi:</h3><p>Fanny fokuserar på att bygga både styrka och mental uthållighet.</p><h3>Kontakt:</h3><p><strong>E-post:</strong> fanny@jarnviljakampsport.com</p>',
        bella: '<h2>Bella "Strypnacke" Johansson - BJJ-tränare</h2><h3>Kort presentation:</h3><p>Bella är en mästare på BJJ och har en förkärlek för strypningar.</p><h3>Meriter:</h3><ul><li>Svart bälte i BJJ</li><li>1:a plats på SM i BJJ 2021</li></ul><h3>Träningsfilosofi:</h3><p>Bella fokuserar på teknik och positionering snarare än styrka.</p><h3>Kontakt:</h3><p><strong>E-post:</strong> bella@jarnviljakampsport.com</p>',
        micke: '<h2>Micke "Huvudskada" Andersson - Boxningstränare</h2><h3>Kort presentation:</h3><p>Micke har ett rykte om sig att vara en av de hårdaste boxningstränarna i klubben, men han är också otroligt pedagogisk.</p><h3>Meriter:</h3><ul><li>Tidigare landslagsboxare</li><li>2:a plats på SM i boxning 2018</li></ul><h3>Träningsfilosofi:</h3><p>Micke tror på snabbhet och precision framför råstyrka.</p><h3>Kontakt:</h3><p><strong>E-post:</strong> micke@jarnviljakampsport.com</p>'
    };

    const modal = document.getElementById('trainerModal');
    if (!modal) return;

    const modalBody = document.getElementById('modalBody');
    const closeBtn = modal.querySelector('.close');

    document.querySelectorAll('.read-more').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const trainer = btn.getAttribute('data-trainer');
            if (trainers[trainer]) {
                modalBody.innerHTML = trainers[trainer];
                modal.style.display = 'block';
            }
        });
    });

    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

});
