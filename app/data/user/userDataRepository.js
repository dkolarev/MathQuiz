//userDataRepository.js

var userCollection;

module.exports.init = function(db) {
	userCollection = db.collection('users');
};


module.exports.dataRepository = {
	/**
	*	Funkcija koja vraca korisnike iz baze na osnovu email
	*	adrese.
	*/
	getUserByEmail: function(email) {
		return userCollection.findOne({"email": email});
	},

	/**
	*	Funkcija vraca korisnika iz baze na osnovni korisnickog
	*	imena. Napomena: korisnicko ime je jedinstveno za svakog
	*	korisnika u bazi.
	*/
	getUserByUsername: function(username) {
		return userCollection.findOne({"username": username});
	},

	/**
	*	Funkcija ubacuje novog korisnika u
	*	bazu u kolekciji 'users' nakon sto
	*	je korisnik uspjesno ispunio 'signIn'
	*	formu.
	*/
	insertUser: function(user) {
		userCollection.insert(user);	
	}
};