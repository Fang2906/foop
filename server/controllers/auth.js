import bcrypt from "bcrypt"; // Importation de bcrypt pour le hachage des mots de passe
import jwt from "jsonwebtoken"; // Importation de jsonwebtoken pour la génération de jetons JWT
import User from "../models/User.js"; // Importation du modèle User

/* ENREGISTRER UN UTILISATEUR */
export const register = async (req, res) => {
  try {
    // Extraction des données du corps de la requête
    const {
      firstName, // Prénom
      lastName,  // Nom de famille
      email,     // Adresse e-mail
      password,  // Mot de passe
      picturePath, // Chemin vers la photo de profil
      friends,    // Liste des amis
      location,   // Localisation
      occupation, // Occupation
    } = req.body;

    // Génération d'un sel pour le hachage du mot de passe
    const salt = await bcrypt.genSalt();
    // Hachage du mot de passe avec le sel généré
    const passwordHash = await bcrypt.hash(password, salt);

    // Création d'un nouvel utilisateur avec les données fournies
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash, // Mot de passe haché
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000), // Nombre de profils vus, valeur aléatoire
      impressions: Math.floor(Math.random() * 10000), // Nombre d'impressions, valeur aléatoire
    });
    // Sauvegarde de l'utilisateur dans la base de données
    const savedUser = await newUser.save();
    // Réponse avec le statut 201 (créé) et l'utilisateur sauvegardé
    res.status(201).json(savedUser);
  } catch (err) {
    // Gestion des erreurs avec le statut 500 (erreur interne du serveur) et le message d'erreur
    res.status(500).json({ error: err.message });
  }
};

/* CONNEXION */
export const login = async (req, res) => {
  try {
    // Extraction des données du corps de la requête
    const { email, password } = req.body;
    // Recherche de l'utilisateur dans la base de données par e-mail
    const user = await User.findOne({ email: email });
    // Si l'utilisateur n'existe pas, renvoi d'une erreur avec statut 400 (mauvaise requête)
    if (!user) return res.status(400).json({ msg: "L'utilisateur n'existe pas. " });

    // Vérification de la correspondance du mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    // Si les mots de passe ne correspondent pas, renvoi d'une erreur avec statut 400 (mauvaise requête)
    if (!isMatch) return res.status(400).json({ msg: "Identifiants invalides. " });

    // Création d'un jeton JWT avec l'ID de l'utilisateur
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    // Suppression du mot de passe avant d'envoyer l'utilisateur en réponse
    delete user.password;
    // Réponse avec le statut 200 (ok), le jeton et les données de l'utilisateur
    res.status(200).json({ token, user });
  } catch (err) {
    // Gestion des erreurs avec le statut 500 (erreur interne du serveur) et le message d'erreur
    res.status(500).json({ error: err.message });
  }
};
