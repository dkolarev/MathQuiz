//userDataRepository.js

var usersCollection = db.collection('users');

module.exports = {
	/**
	*	Funkcija koja vraca korisnike iz baze na osnovu email
	*	adrese.
	*/
	getUserByEmail: function(email) {
		return usersCollection.find({"email": email});
	},

	/**
	*	Funkcija vraca korisnika iz baze na osnovni korisnickog
	*	imena. Napomena: korisnicko ime je jedinstveno za svakog
	*	korisnika u bazi.
	*/
	getUserByUsername: function(username) {
		return usersCollection.findOne({"username": username});
	},

	/**
	*	Funkcija ubacuje novog korisnika u
	*	bazu u kolekciji 'users' nakon sto
	*	je korisnik uspjesno ispunio 'signIn'
	*	formu.
	*/
	insertUser: function(user, cryptedPassword) {
		usersCollection.insert({
			"username": user.username,
			"password": cryptedPassword,
			"email": user.email,
			"joined": new Date().toISOString(),
			"quizList": []
		});	
	}
};