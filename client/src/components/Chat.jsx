import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";

// Connexion au serveur Socket.io
const socket = io("http://localhost:5000");

const Chat = () => {
  // États pour stocker les messages et le nouveau message à envoyer
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Écoute des nouveaux messages reçus
    socket.on("getMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Nettoyage de la connexion socket lorsque le composant est démonté
    return () => {
      socket.off("getMessage");
    };
  }, []);

  // Fonction pour envoyer un nouveau message
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Vérifie que le message n'est pas vide
      const message = {
        senderId: "123", // Remplacer par l'ID de l'utilisateur connecté
        receiverId: "456", // Remplacer par l'ID du destinataire
        text: newMessage,
      };
      socket.emit("sendMessage", message);
      setNewMessage(""); // Réinitialise le champ de texte après l'envoi
    }
  };

  return (
    <Box
      sx={{
        width: "100%", // Largeur de 100%
        maxWidth: 600, // Largeur maximale de 600px
        bgcolor: "background.paper", // Couleur de fond du thème
        borderRadius: "8px", // Bord arrondi
        boxShadow: 3, // Ombre portée
        p: 2, // Espacement intérieur
        display: "flex", // Utilise flexbox
        flexDirection: "column", // Colonne pour aligner les éléments verticalement
        height: "80vh", // Hauteur de 80% de la hauteur de la fenêtre
        position: "relative", // Position relative pour le placement des éléments
      }}
    >
      <Typography variant="h6" color="textPrimary" mb={2}>
        Chat
      </Typography>
      <Paper
        sx={{
          flex: 1, // Occupe l'espace restant
          overflowY: "auto", // Ajoute un défilement vertical si nécessaire
          mb: 2, // Marge en bas
          borderRadius: "8px", // Bord arrondi
          p: 2, // Espacement intérieur
        }}
      >
        <List>
          {messages.map((msg, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={msg.text} // Texte du message
                  secondary={`Sender: ${msg.senderId}`} // Optionnel: Affiche l'ID de l'expéditeur
                />
              </ListItem>
              {index < messages.length - 1 && <Divider />}{" "}
              {/* Diviseur entre les messages */}
            </React.Fragment>
          ))}
        </List>
      </Paper>
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault(); // Empêche le comportement par défaut du formulaire
          handleSendMessage(); // Envoie le message
        }}
        sx={{
          display: "flex", // Utilise flexbox pour l'alignement horizontal
          alignItems: "center", // Aligne les éléments au centre
          gap: 1, // Espacement entre les éléments
        }}
      >
        <TextField
          fullWidth // Largeur totale
          variant="outlined" // Variante du champ de texte
          placeholder="Type a message" // Texte d'espace réservé
          value={newMessage} // Valeur du champ de texte
          onChange={(e) => setNewMessage(e.target.value)} // Mise à jour de l'état du message
          sx={{ flex: 1 }} // Occupe l'espace restant dans le conteneur
        />
        <Button
          variant="contained" // Variante du bouton
          color="primary" // Couleur primaire
          onClick={handleSendMessage} // Envoie le message lorsque le bouton est cliqué
          endIcon={<SendIcon />} // Icône de fin du bouton
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Chat;
