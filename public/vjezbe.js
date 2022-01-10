window.onload = () => {
    const fja = (err, data) => {
        if(!err) VjezbeAjax.iscrtajVjezbe(document.getElementById("vjezbe-lista"), data);
    };
    VjezbeAjax.dohvatiPodatke(fja);
}