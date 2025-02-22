import React, { useState, useEffect } from "react";
import { Container, Typography, Button, TextField, MenuItem, Select, FormControl, InputLabel, Box } from "@mui/material";

const languages = ["Spanish", "Ukrainian"];
const inputMethods = ["Speak", "Type"];

const App = () => {
    const [settings, setSettings] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [speaker1, setSpeaker1] = useState({});
    const [speaker2, setSpeaker2] = useState({});
    const [apiKey, setApiKey] = useState("");

    useEffect(() => {
        const storedSettings = localStorage.getItem("translationAppSettings");
        if (storedSettings) {
            const parsedSettings = JSON.parse(storedSettings);
            setSettings(parsedSettings);
            setSpeaker1(parsedSettings.speaker1);
            setSpeaker2(parsedSettings.speaker2);
            setApiKey(parsedSettings.apiKey);
        } else {
            setShowSettings(true);
        }
    }, []);

    const saveSettings = () => {
        const newSettings = { speaker1, speaker2, apiKey };
        localStorage.setItem("translationAppSettings", JSON.stringify(newSettings));
        setSettings(newSettings);
        setShowSettings(false);
    };

    return (
        <Container maxWidth="sm">
            {showSettings || !settings ? (
                <Box>
                    <Typography variant="h4" gutterBottom>Settings</Typography>
                    <TextField
                        label="API Key"
                        fullWidth
                        margin="normal"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                    />
                    <Typography variant="h6">Speaker 1</Typography>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Language</InputLabel>
                        <Select
                            value={speaker1.language || ""}
                            onChange={(e) => setSpeaker1({ ...speaker1, language: e.target.value })}
                        >
                            {languages.map((lang) => (
                                <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Translate To</InputLabel>
                        <Select
                            value={speaker1.translateTo || ""}
                            onChange={(e) => setSpeaker1({ ...speaker1, translateTo: e.target.value })}
                        >
                            {languages.map((lang) => (
                                <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Input Method</InputLabel>
                        <Select
                            value={speaker1.inputMethod || ""}
                            onChange={(e) => setSpeaker1({ ...speaker1, inputMethod: e.target.value })}
                        >
                            {inputMethods.map((method) => (
                                <MenuItem key={method} value={method}>{method}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Typography variant="h6">Speaker 2</Typography>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Language</InputLabel>
                        <Select
                            value={speaker2.language || ""}
                            onChange={(e) => setSpeaker2({ ...speaker2, language: e.target.value })}
                        >
                            {languages.map((lang) => (
                                <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Translate To</InputLabel>
                        <Select
                            value={speaker2.translateTo || ""}
                            onChange={(e) => setSpeaker2({ ...speaker2, translateTo: e.target.value })}
                        >
                            {languages.map((lang) => (
                                <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Input Method</InputLabel>
                        <Select
                            value={speaker2.inputMethod || ""}
                            onChange={(e) => setSpeaker2({ ...speaker2, inputMethod: e.target.value })}
                        >
                            {inputMethods.map((method) => (
                                <MenuItem key={method} value={method}>{method}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button variant="contained" color="primary" fullWidth onClick={saveSettings}>
                        Save Settings
                    </Button>
                </Box>
            ) : (
                <Box>
                    <Typography variant="h4" gutterBottom>Conversation</Typography>
                    <Button variant="contained" color="secondary" onClick={() => setShowSettings(true)}>
                        Open Settings
                    </Button>
                </Box>
            )}
        </Container>
    );
};

export default App;
