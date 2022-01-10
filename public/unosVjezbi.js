document.getElementById("broj-vjezbi").addEventListener('input', (event) =>  {
    VjezbeAjax.dodajInputPolja(
        document.getElementById("unos-vjezbi-form"),
        Number.parseInt(event.target.value)
    );
});

document.getElementById("posalji-zadatke").addEventListener('click', (event) => {
    const forma = document.getElementById("unos-vjezbi-form");
    const callbackFja = (err, data) => {
        document.getElementById("posalji-zadatke").style.backgroundColor = err ? 'red' : 'green';
    }
    VjezbeAjax.posaljiPodatke({
        brojVjezbi: Number.parseInt(forma.children[1].value),
        brojZadataka: [...forma.children]
            .filter((el, index) => el.nodeName === 'INPUT' && index !== 0 && index !== 1)
            .map(el => Number.parseInt(el.value))
    }, callbackFja);
});