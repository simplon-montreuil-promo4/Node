### MONGOOSE
[mongoose](http://mongoosejs.com) est une librairie de **Node.js** pour faire l'interface avec la base de donnée [Mongo.DB](http://mongodb.org) 

---
#### Connexion à MongoDB
La connexion est très simple : 

```
var mongoose = require('mongoose');

mongoose.connect('localhost');
```
**NOTE**: Par défaut Mongoose va se connecter à la base de donnée local **test** sur le port **27017**. Vous pouvez spécifiez le chemin complet `mongodb://localhost:27017/test` ou juste mettre `localhost`

---
#### Définr un Schéma

Avant de faire quoique se soit. Vous devez d'abord definir le schema Mongoose. Si vous êtes familier avec le SQL, c'est le même concept ici. Le Schema represente la structure de la database MongoDB. Par exemple, avec  `Comment` le schema devrait ressembler à ça:

```
var CommentSchema = new Schema({
  name: { type: String, default: 'Guest' }
  age: { type: Number, min: 18, index: true }
  bio: { type: String, match: /[a-z]/ }
  date: { type: Date, default: Date.now }
});
```
un autre exemple avec un `Blog`:

```
var BlogSchema = new Schema({
  title:  String,
  author: String,
  body:   String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs:  Number
  }
});
```
Et voici un autre exemple avec un autre schema `User`. Dans cette exemple, on spécifie `required` et `unique` qui sont des contraintes, si ces contraintes sont violés, alors l'opération rate et une erreur survient.

```
var UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
```
Chaque schema dans une collection MongoDB. et chanque clés - username, email, password, definissent les propriétés du document MongoDB. Par exemple, voilà comment un `user` devrait être dans la database:

```
> db.users.findOne()
{
    "__v" : 0,
    "_id" : ObjectId("530c17c1fb8c96752498e120"),
    "email" : "sahat@me.com",
    "password" : "$2a$05$ANZrgWJqVo9j1tqgCMwe2.LCFnU43bUAYW9rA3Nsx4WchPM.cELEi",
    "username" : "sahat"
}
```
Ici la liste des types dans un Schema, avec leurs propriétes:

* String
	* lowerscase = ajouter en minuscule.
		* Si c'est `true` , alors sa sauvegarde **MyEmail@gmail.COM** en **myemail@gmail.com**
	* *match* = mettre en place des 'regex' pour validation
		*  *exemple*, `match: /^a/`, en gros on valide une chaine de charactère qui commence par la lettre 'a'.
	* *trim* = `regarde la documentation` #love.
		*  ou je sais je suis méchant.
	* *uppercase* = ajoute en Majuscule.
		*  Si c'est `true` alors on enregistre **un exemple** comme **UN EXEMPLE**
 * Number
	* *max* = definir le maximum de nombres à valider
	* *min* = definir le minimum de nombres à valider
* Date
* Buffer
* Booleen
* Mixed
* Objectid
* Array

---

#### Definir un model
Le model dans Mongoose eset la chose qu'il faut **absolument** avoir pour interagir avec MongoDB. Pour creer un model `User` qui utilise le schema defini avant. On doit lui donner le nom de la collection comme premier argument et lui passer le schema de mongoose en second.

```
var User = mongoose.model('User', UserSchema);
```
		