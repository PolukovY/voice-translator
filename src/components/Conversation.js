import React, { useState } from "react";
import { Box, Typography, Button, TextField, List, ListItem, ListItemText, CircularProgress } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";

const Conversation = ({ settings }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [listening, setListening] = useState(false);
    const [loading, setLoading] = useState(false);
    let recognition;

    const translateText = async (text, fromLang, toLang) => {
        try {
            const response = await fetch("https://api.mymemory.translated.net/get?q=" + encodeURIComponent(text) + "&langpair=" + fromLang + "|" + toLang);
            const data = await response.json();
            return data.responseData.translatedText;
        } catch (error) {
            console.error("Error translating text:", error);
            return text;
        }
    };

    const handleStartListening = async () => {
        setListening(true);
        setLoading(true);
        try {
            recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = settings.speaker1.language === "Spanish" ? "es-ES" : "uk-UA";
            recognition.interimResults = false;
            recognition.continuous = false;
            recognition.maxAlternatives = 1;

            recognition.start();

            recognition.onresult = async (event) => {
                const speechText = event.results[0][0].transcript;
                const translatedMessage = await translateText(speechText, settings.speaker1.language, settings.speaker2.language);
                setMessages([...messages, { text: speechText, translated: translatedMessage, sender: "Speaker 1", timestamp: new Date() }]);
                setListening(false);
                setLoading(false);
            };

            recognition.onspeechend = () => {
                recognition.stop();
            };

            recognition.onerror = (event) => {
                if (event.error === "no-speech") {
                    console.warn("No speech detected, please try again.");
                } else {
                    console.error("Speech recognition error:", event.error);
                }
                setListening(false);
                setLoading(false);
            };

            recognition.onend = () => {
                if (listening) {
                    console.log("Restarting speech recognition due to no speech.");
                    recognition.start();
                }
            };
        } catch (error) {
            console.error("Error initializing speech recognition:", error);
            setListening(false);
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (input.trim()) {
            setLoading(true);
            try {
                const translatedMessage = await translateText(input, settings.speaker2.language, settings.speaker1.language);
                setMessages([...messages, { text: input, translated: translatedMessage, sender: "Speaker 2", timestamp: new Date() }]);
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