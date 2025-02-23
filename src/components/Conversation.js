import React, { useState, useRef } from "react";
import { Box, Button, TextField, List, ListItem, ListItemText, CircularProgress } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";

const Conversation = ({ settings }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [listening, setListening] = useState(false);
    const [loading, setLoading] = useState(false);
    const [recordedAudio, setRecordedAudio] = useState(null);
    const [recordedBase64, setRecordedBase64] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const apiUrl = "https://ujmstq8xb9.execute-api.us-east-2.amazonaws.com/default/voiceTranslatorFunction";

    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                audioChunksRef.current = [];

                mediaRecorder.ondataavailable = (event) => {
                    audioChunksRef.current.push(event.data);
                };

                mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    setRecordedAudio(audioUrl);
                    await convertToBase64(audioBlob);
                    await translateAudio();
                };

                mediaRecorder.start();
                setListening(true);
            })
            .catch((error) => console.error("Error accessing microphone:", error));
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setListening(false);
        }
    };

    const convertToBase64 = async (audioBlob) => {
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
            setRecordedBase64(reader.result.split(",")[1]);
        };
    };

    const translateText = async (text) => {
        setLoading(true);
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "x-api-key": settings.apiKey,
                    "Content-Type": "application/json",
                    "type": "message",
                    "from-language": settings?.speaker2?.language,
                    "to-language": settings?.speaker2?.translateTo,
                },
                body: JSON.stringify({ messageToTranslate: text })
            });
            const data = await response.json();
            if (data.translated_text) {
                setMessages([...messages, { text: data.translated_text, sender: "Translator", timestamp: new Date() }]);
            }
        } catch (error) {
            console.error("Error translating text:", error);
        }
        setLoading(false);
    };

    const translateAudio = async () => {
        if (!recordedBase64) return;
        setLoading(true);
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "x-api-key": settings.apiKey,
                    "Content-Type": "application/json",
                    "type": "audio",
                    "from-language": settings?.speaker1?.language,
                    "to-language": settings?.speaker1?.translateTo,
                },
                body: JSON.stringify({ file_base64: recordedBase64 })
            });
            const data = await response.json();
            if (data.translated_text) {
                setMessages([...messages, { text: data.translated_text, sender: "Translator", timestamp: new Date() }]);
            }
        } catch (error) {
            console.error("Error translating audio:", error);
        }
        setLoading(false);
    };

    const handleSendMessage = async () => {
        if (input.trim()) {
            setMessages([...messages, { text: input, sender: "Speaker 2", timestamp: new Date() }]);
            await translateText(input);
            setInput("");
        }
    };

    return (
        <Box>
            <List>
                {messages.map((msg, index) => (
                    <ListItem key={index} alignItems="flex-start">
                        {msg.audio ? (
                            <audio controls src={msg.audio} />
                        ) : (
                            <ListItemText
                                primary={`${msg.sender} (${msg.timestamp.toLocaleTimeString()})`}
                                secondary={msg.text}
                            />
                        )}
                    </ListItem>
                ))}
            </List>
            {loading && <CircularProgress sx={{ display: "block", margin: "auto" }} />}
            <Box display="flex" mt={2}>
                <Button variant="contained" color="primary" startIcon={<MicIcon />} onClick={listening ? stopRecording : startRecording}>
                    {listening ? "Stop Recording" : "Start Recording"}
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
