const should = chai.should();

describe('VjezbeAjax modul', function() {
    beforeEach(function() {
        this.xhr = sinon.useFakeXMLHttpRequest();

        this.requests = [];
        this.xhr.onCreate = function(xhr) {
            this.requests.push(xhr);
        }.bind(this);
    });

    afterEach(function() {
        this.xhr.restore();
    });

    //Tests etc. go here
    it("Kada je status 'error', postoji greska", function(done) {
        var data = { status: 'error', data: 'Desila se greska' }
        var dataJson = JSON.stringify(data);

        VjezbeAjax.dohvatiPodatke(function(err, result) {
            result.should.deep.equal(data.data);
            done();
        });

        this.requests[0].respond(200, { 'Content-Type': 'application/json' }, dataJson);
    });
    it("Kada zahtjev ne valja, status je 'error'", function(done) {
        var data = { status: 'error', data: 'Desila se greska' }
        var dataJson = JSON.stringify(data);

        VjezbeAjax.dohvatiPodatke(function(err) {
            should.equal(err, 'error');
            done();
        });

        this.requests[0].respond(200, { 'Content-Type': 'application/json' }, dataJson);
    });
    it("Kada je zahtjev dobar, prvi parametar je 'null'", function(done) {
        var data = { brojVjezbi: 3, brojZadataka: [1,2,3] }
        var dataJson = JSON.stringify(data);

        VjezbeAjax.dohvatiPodatke(function(err) {
            should.equal(err, null);
            done();
        });
        this.requests[0].respond(200, { 'Content-Type': 'application/json' }, dataJson);
    });
    it("Kada je zahtjev dobar, drugi parametar je JSON data'", function(done) {
        var data = { brojVjezbi: 3, brojZadataka: [1,2,3] }
        var dataJson = JSON.stringify(data);

        VjezbeAjax.dohvatiPodatke(function(err, result) {
            result.should.deep.equal(data);
            done();
        });
        this.requests[0].respond(200, { 'Content-Type': 'application/json' }, dataJson);
    });
    it('Tijelo zahtjeva dobro uspostavljeno', function() {
        var data = { brojVjezbi: 3, brojZadataka: [1,2,3] }
        var dataJson = JSON.stringify(data);

        VjezbeAjax.posaljiPodatke(data, function() { });

        this.requests[0].requestBody.should.equal(dataJson);
    });
    it("Kada je zahtjev dobar, callback ce vratiti poslanu datu", function(done) {
        var data = { brojVjezbi: 3, brojZadataka: [1,2,3] }
        var dataJson = JSON.stringify(data);

        VjezbeAjax.posaljiPodatke(data, function(err, result) {
            result.should.deep.equal(data);
            done();
        });
        this.requests[0].respond(200, { 'Content-Type': 'application/json' }, dataJson);
    });
    it("Kada je zahtjev los, callback ce vratiti status 'error'", function(done) {
        var data = { brojVjezbi: '3', brojZadataka: [1,2,3] }
        var response = { status: 'error', data: 'Desila se greksa' };
        var responseJson = JSON.stringify(response);

        VjezbeAjax.posaljiPodatke(data, function(err, result) {
            should.equal(err, 'error');
            done();
        });
        this.requests[0].respond(200, { 'Content-Type': 'application/json' }, responseJson);
    });
    it("Kada je zahtjev los, drugi parametar callback-a je poruka greske", function(done) {
        var data = { brojVjezbi: '3', brojZadataka: [1,2,3] }
        var response = { status: 'error', data: 'Desila se greksa' };
        var responseJson = JSON.stringify(response);

        VjezbeAjax.posaljiPodatke(data, function(err, result) {
            result.should.deep.equal(response.data);
            done();
        });
        this.requests[0].respond(200, { 'Content-Type': 'application/json' }, responseJson);
    });
    it("Kada je zahtjev dobar, callback ce vratiti poslanu datu (testiranje brojVjezbi)", function(done) {
        var data = { brojVjezbi: 3, brojZadataka: [1,2,3] }
        var dataJson = JSON.stringify(data);

        VjezbeAjax.posaljiPodatke(data, function(err, result) {
            should.equal(result.brojVjezbi, data.brojVjezbi);
            done();
        });
        this.requests[0].respond(200, { 'Content-Type': 'application/json' }, dataJson);
    });
    it("Kada je zahtjev dobar, callback ce vratiti poslanu datu (testiranje brojZadataka)", function(done) {
        var data = { brojVjezbi: 3, brojZadataka: [1,2,3] }
        var dataJson = JSON.stringify(data);

        VjezbeAjax.posaljiPodatke(data, function(err, result) {
            should.equal(result.brojZadataka.length, data.brojZadataka.length);
            done();
        });
        this.requests[0].respond(200, { 'Content-Type': 'application/json' }, dataJson);
    });
});