import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";

const socket = io("http://localhost:5000");

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("getNotification", (notification) => {
      setNotifications((prev) => [...prev, notification]);
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.off("getNotification");
    };
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
        borderRadius: "8px",
        boxShadow: 3,
        p: 2,
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 1200,
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <NotificationsIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" color="textPrimary">
          Notifications
        </Typography>
      </Box>
      <Paper sx={{ maxHeight: 300, overflow: "auto" }}>
        <List>
          {notifications.map((notification, index) => (
            <ListItem
              key={index}
              sx={{ borderBottom: "1px solid", borderColor: "divider" }}
            >
              <ListItemText primary={notification.content} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Notifications;
