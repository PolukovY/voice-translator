import React, { useState } from "react";
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const languages = ["Spanish", "Ukrainian"];
const inputMethods = ["Speak", "Type"];

const Settings = ({ settings, saveSettings }) => {
    const [apiKey, setApiKey] = useState(settings?.apiKey || "");
    const [speaker1, setSpeaker1] = useState(settings?.speaker1 || {});
    const [speaker2, setSpeaker2] = useState(settings?.speaker2 || {});

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Settings</Typography>
            <TextField
                label="API Key"
                fullWidth
                margin="normal"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
            />
            {[speaker1, speaker2].map((speaker, index) => (
                <Box key={index}>
                    <Typography variant="h6">Speaker {index + 1}</Typography>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Language</InputLabel>
                        <Select
                            value={speaker.language || ""}
                            onChange={(e) => (index === 0 ? setSpeaker1 : setSpeaker2)({ ...speaker, language: e.target.value })}
                        >
                            {languages.map((lang) => (
                                <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Translate To</InputLabel>
                        <Select
                            value={speaker.translateTo || ""}
                            onChange={(e) => (index === 0 ? setSpeaker1 : setSpeaker2)({ ...speaker, translateTo: e.target.value })}
                        >
                            {languages.map((lang) => (
                                <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Input Method</InputLabel>
                        <Select
                            value={speaker.inputMethod || ""}
                            onChange={(e) => (index === 0 ? setSpeaker1 : setSpeaker2)({ ...speaker, inputMethod: e.target.value })}
                        >
                            {inputMethods.map((method) => (
                                <MenuItem key={method} value={method}>{method}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            ))}
            <Button variant="contained" color="primary" fullWidth onClick={() => saveSettings({ apiKey, speaker1, speaker2 })}>
                Save Settings
            </Button>
        </Box>
    );
};

export default Settings;