import React, { useState } from "react";
import { Box, Typography, Button, TextField, List, ListItem, ListItemText } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";

const Conversation = ({ settings }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [listening, setListening] = useState(false);

    const handleStartListening = () => {
        setListening(true);
        setTimeout(() => {
            const receivedMessage = "Hola, ¿cómo estás?";
            const translatedMessage = "Привіт, як справи?";
            setMessages([...messages, { text: receivedMessage, translated: translatedMessage, sender: "Speaker 1", timestamp: new Date() }]);
            setListening(false);
        }, 2000);
    };

    const handleSendMessage = () => {
        if (input.trim()) {
            setMessages([...messages, { text: input, sender: "Speaker 2", timestamp: new Date() }]);
            setInput("");
        }
    };

    return (
        <Box>
            <List>
                {messages.map((msg, index) => (
                    <ListItem key={index} alignItems="flex-start">
                        <ListItemText
                            primary={`${msg.sender} (${msg.timestamp.toLocaleTimeString()})`}
                            secondary={`${msg.text}${msg.translated ? ` → ${msg.translated}` : ""}`}
                        />
                    </ListItem>
                ))}
            </List>
            <Box display="flex" mt={2}>
                <Button variant="contained" color="primary" startIcon={<MicIcon />} onClick={handleStartListening} disabled={listening}>
                    {listening ? "Listening..." : "Speak"}
                </Button>
                <TextField
                    fullWidth
                    variant="outlined"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message"
                    sx={{ ml: 2 }}
                />
                <Button variant="contained" color="secondary" startIcon={<SendIcon />} onClick={handleSendMessage}>
                    Send
                </Button>
            </Box>
        </Box>
    );
};

export default Conversation;