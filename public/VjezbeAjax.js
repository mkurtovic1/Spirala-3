const VjezbeAjax = (() => {

    const ocisti_trenutnu_formu = (element) => {
        [...element.children].forEach((el, index) => {
            if(index !== 0 && index !== 1) element.removeChild(el);
        });
    }

    const kreiraj_element = (ime) => {
        return document.createElement(ime);
    }

    const dodaj_input_polja = (element, broj_vjezbi) => {
        ocisti_trenutnu_formu(element);
        if(!Number.isInteger(broj_vjezbi) || broj_vjezbi < 1) return;
        const placeholders = new Array(broj_vjezbi).fill(0);
        placeholders.forEach((el,index) => {
            const label = kreiraj_element("label");
            label.innerHTML = "zadatak " + (index+1);
            const input = kreiraj_element("input");
            input.type = "number";
            element.appendChild(label);
            element.appendChild(input);
        });
    }

    const posalji_podatke = (objekat, callback_fja) => {
        const call = new XMLHttpRequest();
        call.onreadystatechange = () => {
            if( call.readyState !== 4) return;
            if( call.status !== 200 ) return;
            const res = call.response;
            const json = JSON.parse(res);
            if(json.status === 'error')
                return callback_fja(json.status, json.data);
            callback_fja(null, json);
        }
        call.open('POST', 'vjezbe', true);
        call.setRequestHeader('Content-Type', 'application/json');
        call.send(JSON.stringify(objekat));
    };

    const dohvati_podatke = (callback_fja) => {
        const call = new XMLHttpRequest();
        call.onreadystatechange = () => {
            if( call.readyState !== 4) return;
            if( call.status !== 200 ) return;
            const res = call.response;
            const json = JSON.parse(res);
            if(json.status === 'error')
                return callback_fja(json.status, json.data);
            callback_fja(null, json);
        }
        call.open('GET', 'vjezbe', true);
        call.send();
    }

    const iscrtaj_vjezbe = (element, objekat) => {
        const placeholders = new Array(objekat.brojVjezbi).fill(0);
        placeholders.forEach((el, index) => {
            const div = kreiraj_element('div');
            div.style.margin = '10px';
            const vjezbe_stavka = kreiraj_element('div');
            vjezbe_stavka.className = 'vjezbe-stavka';
            vjezbe_stavka.innerHTML = 'VJEŽBA ' + (index+1);
            const zadaci_lista = kreiraj_element('div');
            zadaci_lista.className = 'zadaci-lista';
            VjezbeAjax.iscrtajZadatke(zadaci_lista, objekat.brojZadataka[index]);
            div.appendChild(vjezbe_stavka);
            div.onclick = () => div.appendChild(zadaci_lista);
            element.appendChild(div);
        });
    };

    const iscrtaj_zadatke = (element, broj_zadataka) => {
        const placeholders = new Array(broj_zadataka).fill(0);
        placeholders.forEach((el, index) => {
            const zadaci_stavka = kreiraj_element('div');
            zadaci_stavka.className = 'zadaci-stavka';
            zadaci_stavka.innerHTML = 'ZADATAK ' + (index+1);
            element.appendChild(zadaci_stavka);
        });
    }

    return {
        dodajInputPolja: dodaj_input_polja,
        posaljiPodatke: posalji_podatke,
        dohvatiPodatke: dohvati_podatke,
        iscrtajVjezbe: iscrtaj_vjezbe,
        iscrtajZadatke: iscrtaj_zadatke
    };

})();