import React, { useState } from "react";
import { Box, Typography, Button, TextField, List, ListItem, ListItemText, CircularProgress } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";

const Conversation = ({ settings }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [listening, setListening] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleStartListening = async () => {
        setListening(true);
        setLoading(true);
        try {
            setTimeout(() => {
                const receivedMessage = "Hola, ¿cómo estás?";
                const translatedMessage = "Привіт, як справи?";
                setMessages([...messages, { text: receivedMessage, translated: translatedMessage, sender: "Speaker 1", timestamp: new Date() }]);
                setLoading(false);
                setListening(false);
            }, 2000);
        } catch (error) {
            console.error("Error processing speech:", error);
            setLoading(false);
            setListening(false);
        }
    };

    const handleSendMessage = async () => {
        if (input.trim()) {
            setLoading(true);
            try {
                setMessages([...messages, { text: input, sender: "Speaker 2", timestamp: new Date() }]);
                setInput("");
            } catch (error) {
                console.error("Error sending message:", error);
            }
            setLoading(false);
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
            {loading && <CircularProgress sx={{ display: "block", margin: "auto" }} />}
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