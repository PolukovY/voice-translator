import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, Settings, Save } from 'lucide-react';

const TranslatorApp = () => {
    const [settings, setSettings] = useState({
        apiKey: '',
        myLanguage: 'uk',
        otherLanguage: 'es',
        responseLanguage: 'uk',
        translateResponseTo: 'es',
        inputMethod: 'voice'
    });

    const [isFirstTime, setIsFirstTime] = useState(true);
    const [messages, setMessages] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [currentMessage, setCurrentMessage] = useState('');
    const [hasPermission, setHasPermission] = useState(false);
    const [error, setError] = useState(null);

    const recognition = useRef(null);

    const languages = [
        { value: 'uk', label: 'Українська' },
        { value: 'es', label: 'Іспанська' }
    ];

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setError('Ваш браузер не підтримує розпізнавання мови');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition.current = new SpeechRecognition();
        recognition.current.continuous = true;
        recognition.current.interimResults = true;

        recognition.current.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            setCurrentMessage(transcript);
        };

        recognition.current.onerror = (event) => {
            setError(`Помилка розпізнавання: ${event.error}`);
            setIsRecording(false);
        };

        recognition.current.onend = () => {
            setIsRecording(false);
        };

        const savedSettings = localStorage.getItem('translatorSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
            setIsFirstTime(false);
        }

        checkMicrophonePermission();

        return () => {
            if (recognition.current) {
                recognition.current.stop();
            }
        };
    }, []);

    const checkMicrophonePermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setHasPermission(true);
            stream.getTracks().forEach(track => track.stop());
        } catch (err) {
            setHasPermission(false);
            setError('Немає доступу до мікрофону');
        }
    };

    const startRecording = async () => {
        if (!hasPermission) {
            try {
                await checkMicrophonePermission();
            } catch (err) {
                return;
            }
        }

        try {
            recognition.current.lang = settings.myLanguage === 'uk' ? 'uk-UA' : 'es-ES';
            recognition.current.start();
            setIsRecording(true);
            setError(null);
        } catch (err) {
            setError('Помилка при запуску запису');
            setIsRecording(false);
        }
    };

    const stopRecording = () => {
        if (recognition.current) {
            recognition.current.stop();
        }
        setIsRecording(false);
    };

    const handleInputMethodChange = (method) => {
        setSettings(prev => ({...prev, inputMethod: method}));
    };

    const saveSettings = () => {
        localStorage.setItem('translatorSettings', JSON.stringify(settings));
        setIsFirstTime(false);
    };

    const sendMessage = async () => {
        if (!currentMessage.trim()) return;

        try {
            // Тут буде реальний переклад через API
            const translation = `Переклад: ${currentMessage}`;

            const newMessage = {
                id: Date.now(),
                text: currentMessage,
                translation: translation,
                fromMe: true,
                time: new Date().toLocaleTimeString(),
                language: settings.myLanguage
            };

            setMessages(prev => [...prev, newMessage]);
            setCurrentMessage('');

            // Симуляція відповіді від співрозмовника
            setTimeout(() => {
                const response = {
                    id: Date.now(),
                    text: "Ejemplo de respuesta",
                    translation: "Приклад відповіді",
                    fromMe: false,
                    time: new Date().toLocaleTimeString(),
                    language: settings.otherLanguage
                };
                setMessages(prev => [...prev, response]);
            }, 1000);

        } catch (err) {
            setError('Помилка при відправці повідомлення');
        }
    };

    const LanguageSelect = ({ label, value, onChange }) => (
        <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">{label}</label>
            <select
                className="w-full p-2 border rounded bg-white"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {languages.map(lang => (
                    <option key={lang.value} value={lang.value}>
                        {lang.label}
                    </option>
                ))}
            </select>
        </div>
    );

    if (isFirstTime) {
        return (
            <div className="w-full max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold">Налаштування перекладача</h2>
                </div>
                <div className="space-y-4">
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium">API Key</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={settings.apiKey}
                            onChange={(e) => setSettings(prev => ({...prev, apiKey: e.target.value}))}
                            placeholder="Введіть ваш API ключ"
                        />
                    </div>

                    <LanguageSelect
                        label="Ваша мова"
                        value={settings.myLanguage}
                        onChange={(value) => setSettings(prev => ({...prev, myLanguage: value}))}
                    />

                    <LanguageSelect
                        label="Мова співрозмовника"
                        value={settings.otherLanguage}
                        onChange={(value) => setSettings(prev => ({...prev, otherLanguage: value}))}
                    />

                    <LanguageSelect
                        label="Мова для відповідей"
                        value={settings.responseLanguage}
                        onChange={(value) => setSettings(prev => ({...prev, responseLanguage: value}))}
                    />

                    <LanguageSelect
                        label="Переклад відповідей на"
                        value={settings.translateResponseTo}
                        onChange={(value) => setSettings(prev => ({...prev, translateResponseTo: value}))}
                    />

                    <div>
                        <label className="block mb-2 text-sm font-medium">Метод введення</label>
                        <div className="flex space-x-4">
                            <button
                                className={`px-4 py-2 rounded ${
                                    settings.inputMethod === 'voice'
                                        ? 'bg-blue-500 text-white'
                                        : 'border border-gray-300'
                                }`}
                                onClick={() => handleInputMethodChange('voice')}
                            >
                                Голос
                            </button>
                            <button
                                className={`px-4 py-2 rounded ${
                                    settings.inputMethod === 'text'
                                        ? 'bg-blue-500 text-white'
                                        : 'border border-gray-300'
                                }`}
                                onClick={() => handleInputMethodChange('text')}
                            >
                                Текст
                            </button>
                        </div>
                    </div>

                    <button
                        className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
                        onClick={saveSettings}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Зберегти налаштування
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Перекладач</h1>
                <button
                    className="px-4 py-2 border rounded flex items-center"
                    onClick={() => setIsFirstTime(true)}
                >
                    <Settings className="w-4 h-4 mr-2" />
                    Налаштування
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-lg h-[600px] flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map(message => (
                        <div
                            key={message.id}
                            className={`flex ${message.fromMe ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] rounded-lg p-3 ${
                                    message.fromMe ? 'bg-blue-500 text-white' : 'bg-gray-100'
                                }`}
                            >
                                <p>{message.text}</p>
                                <p className="text-sm mt-1 opacity-75">{message.translation}</p>
                                <div className="flex justify-between items-center mt-2 text-xs opacity-75">
                                    <span>{message.language === 'uk' ? 'Українська' : 'Іспанська'}</span>
                                    <span>{message.time}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t p-4">
                    <div className="flex space-x-2">
                        {settings.inputMethod === 'text' ? (
                            <input
                                type="text"
                                className="flex-1 p-2 border rounded"
                                value={currentMessage}
                                onChange={(e) => setCurrentMessage(e.target.value)}
                                placeholder="Введіть повідомлення..."
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            />
                        ) : (
                            <button
                                className={`flex-1 p-2 rounded flex items-center justify-center ${
                                    isRecording
                                        ? 'bg-red-500 text-white'
                                        : 'bg-blue-500 text-white'
                                }`}
                                onClick={isRecording ? stopRecording : startRecording}
                                disabled={!hasPermission && !isRecording}
                            >
                                <Mic className="w-4 h-4 mr-2" />
                                {isRecording ? 'Зупинити запис' : 'Почати запис'}
                            </button>
                        )}
                        <button
                            className={`p-2 rounded ${
                                currentMessage.trim()
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-300 text-gray-500'
                            }`}
                            onClick={sendMessage}
                            disabled={!currentMessage.trim()}
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TranslatorApp;