import React, { useState, useRef } from "react";
import { Box, Typography, Button, TextField, List, ListItem, ListItemText, CircularProgress } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";

const Conversation = ({ settings }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [listening, setListening] = useState(false);
    const [loading, setLoading] = useState(false);
    const [recordedAudio, setRecordedAudio] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                audioChunksRef.current = [];

                mediaRecorder.ondataavailable = (event) => {
                    audioChunksRef.current.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    setRecordedAudio(audioUrl);
                    setMessages([...messages, { audio: audioUrl, sender: "Speaker 1", timestamp: new Date() }]);
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

    const downloadRecording = () => {
        if (!recordedAudio) return;
        const link = document.createElement("a");
        link.href = recordedAudio;
        link.download = "recording.wav";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSendMessage = async () => {
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
            {recordedAudio && (
                <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={downloadRecording}>
                    Download Recording
                </Button>
            )}
        </Box>
    );
};

export default Conversation;
