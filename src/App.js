import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import Settings from "./components/Settings";
import Conversation from "./components/Conversation";

const App = () => {
    const [settings, setSettings] = useState(null);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        const storedSettings = localStorage.getItem("translationAppSettings");
        if (storedSettings) {
            setSettings(JSON.parse(storedSettings));
        } else {
            setShowSettings(true);
        }
    }, []);

    const saveSettings = (newSettings) => {
        localStorage.setItem("translationAppSettings", JSON.stringify(newSettings));
        setSettings(newSettings);
        setShowSettings(false);
    };

    return (
        <Container maxWidth="sm">
            {showSettings || !settings ? (
                <Settings settings={settings} saveSettings={saveSettings} />
            ) : (
                <Box>
                    <Typography variant="h4" gutterBottom>Conversation</Typography>
                    <Button variant="contained" color="secondary" onClick={() => setShowSettings(true)}>
                        Open Settings
                    </Button>
                    <Conversation settings={settings} />
                </Box>
            )}
        </Container>
    );
};

export default App;