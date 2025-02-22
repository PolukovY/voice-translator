import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";

const Conversation = ({ settings }) => {
    const [listening, setListening] = useState(false);
    const [message, setMessage] = useState("");
    const [translatedMessage, setTranslatedMessage] = useState("");

    const handleStartListening = () => {
        setListening(true);
        setTimeout(() => {
            setMessage("Hola, ¿cómo estás?");
            setTranslatedMessage("Привіт, як справи?");
            setListening(false);
        }, 2000);
    };

    return (
        <Box>
            <Button variant="contained" color="primary" onClick={handleStartListening} disabled={listening}>
                {listening ? "Listening..." : "Start Conversation"}
            </Button>
            <Typography variant="h6" mt={2}>Message: {message}</Typography>
            <Typography variant="h6">Translated: {translatedMessage}</Typography>
        </Box>
    );
};

export default Conversation;