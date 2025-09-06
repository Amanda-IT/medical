import { AudioPlayer } from './play/AudioPlayer.js';

import { io } from "socket.io-client";


let socket;

// Audio processing variables
let audioContext;
let audioStream;
let isStreaming = false;
let processor;
let sourceNode;
let transcriptionReceived = false;
let displayAssistantText = false;
let role;
const audioPlayer = new AudioPlayer();
let sessionInitialized = false;

let samplingRatio = 1;
const TARGET_SAMPLE_RATE = 16000;
const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

// Custom system prompt - you can modify this
let SYSTEM_PROMPT = "You act as an Automatic Speech Recognition like transcript api. you don't response anything.";

// Initialize WebSocket audio
async function initAudio() {
    try {

        // Request microphone access
        audioStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        });

        if (isFirefox) {
            //firefox doesn't allow audio context have differnt sample rate than what the user media device offers
            audioContext = new AudioContext();
        } else {
            audioContext = new AudioContext({
                sampleRate: TARGET_SAMPLE_RATE
            });
        }

        //samplingRatio - is only relevant for firefox, for Chromium based browsers, it's always 1
        samplingRatio = audioContext.sampleRate / TARGET_SAMPLE_RATE;
        console.log(`Debug AudioContext- sampleRate: ${audioContext.sampleRate} samplingRatio: ${samplingRatio}`)


        await audioPlayer.start();

    } catch (error) {
        console.error("Error accessing microphone:", error);
    }
}

function     // Convert ArrayBuffer to base64 string
    arrayBufferToBase64(buffer) {
    const binary = [];
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary.push(String.fromCharCode(bytes[i]));
    }
    return btoa(binary.join(''));
}

// Base64 to Float32Array conversion
function base64ToFloat32Array(base64String) {
    try {
        const binaryString = window.atob(base64String);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const int16Array = new Int16Array(bytes.buffer);
        const float32Array = new Float32Array(int16Array.length);
        for (let i = 0; i < int16Array.length; i++) {
            float32Array[i] = int16Array[i] / 32768.0;
        }

        return float32Array;
    } catch (error) {
        console.error('Error in base64ToFloat32Array:', error);
        throw error;
    }
}

export class SpeechToSpeech {
    constructor(onTextOutput, onError) {
        this.onTextOutput = onTextOutput;
        this.onError = onError;
    }

    init() {
        let self = this;


        console.log("ws init");
        // Connect to the server
        // socket = io("http://localhost:3000", {
        //     //   path: "/socket.io",
        // });
        socket = io();
        // EVENT HANDLERS
        // --------------

        // Handle content start from the server
        socket.on('contentStart', (data) => {
            console.log('Content start received:', data);
        });

        // Handle text output from the server
        socket.on('textOutput', (data) => {
            console.log('Received text output:', data);

            if (data.role === 'USER') {
                // When user text is received, show thinking indicator for assistant response
                transcriptionReceived = true;

                // Add user message to chat
                self.handleTextOutput({
                    role: data.role,
                    content: data.content
                });

            }
            else if (data.role === 'ASSISTANT') {
                //hideAssistantThinkingIndicator();
                if (displayAssistantText) {
                    self.handleTextOutput({
                        role: data.role,
                        content: data.content
                    });
                }
            }
        });

        // Handle audio output
        socket.on('audioOutput', (data) => {
            if (data.content) {
                try {
                    const audioData = base64ToFloat32Array(data.content);
                    audioPlayer.playAudio(audioData);
                } catch (error) {
                    console.error('Error processing audio data:', error);
                }
            }
        });

        // Handle content end events
        socket.on('contentEnd', (data) => {
            console.log('Content end received:', data);
        });

        // Stream completion event
        socket.on('streamComplete', () => {
            self.stopStreaming();
        });

        // Handle connection status updates
        socket.on('connect', () => {
            sessionInitialized = false;
        });

        socket.on('disconnect', () => {
        });

        // Handle errors
        socket.on('error', (error) => {
            console.error("Server error:", error);
            self.onError?.();
        });
    }

    // Initialize the session with Bedrock
    async initializeSession() {
        if (sessionInitialized) return;


        try {
            // Send events in sequence
            socket.emit('promptStart');
            socket.emit('systemPrompt', SYSTEM_PROMPT);
            socket.emit('audioStart');

            // Mark session as initialized
            sessionInitialized = true;
        } catch (error) {
            console.error("Failed to initialize session:", error);
        }
    }



    async startStreaming() {
        this.init();
        await initAudio();


        // if (isStreaming) return;

        try {
            // First, make sure the session is initialized
            if (!sessionInitialized) {
                await this.initializeSession();
            }

            // Create audio processor
            sourceNode = audioContext.createMediaStreamSource(audioStream);

            // Use ScriptProcessorNode for audio processing
            if (audioContext.createScriptProcessor) {
                processor = audioContext.createScriptProcessor(512, 1, 1);

                processor.onaudioprocess = (e) => {
                    // if (!isStreaming) return;
                    const inputData = e.inputBuffer.getChannelData(0);
                    const numSamples = Math.round(inputData.length / samplingRatio)
                    const pcmData = isFirefox ? (new Int16Array(numSamples)) : (new Int16Array(inputData.length));

                    // Convert to 16-bit PCM
                    if (isFirefox) {
                        for (let i = 0; i < inputData.length; i++) {
                            //NOTE: for firefox the samplingRatio is not 1, 
                            // so it will downsample by skipping some input samples
                            // A better approach is to compute the mean of the samplingRatio samples.
                            // or pass through a low-pass filter first 
                            // But skipping is a preferable low-latency operation
                            pcmData[i] = Math.max(-1, Math.min(1, inputData[i * samplingRatio])) * 0x7FFF;
                        }
                    } else {
                        for (let i = 0; i < inputData.length; i++) {
                            pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
                        }
                    }


                    // Convert to base64 (browser-safe way)
                    const base64Data = arrayBufferToBase64(pcmData.buffer);

                    // Send to server
                    socket.emit('audioInput', base64Data);
                };

                sourceNode.connect(processor);
                processor.connect(audioContext.destination);
            }

            isStreaming = true;

            // Show user thinking indicator when starting to record
            transcriptionReceived = false;

        } catch (error) {
            console.error("Error starting recording:", error);
        }
    }



    stopStreaming() {
        // if (!isStreaming) return;

        isStreaming = false;

        // Clean up audio processing
        if (processor) {
            processor.disconnect();
            sourceNode.disconnect();
        }

        audioPlayer.stop();
        // Tell server to finalize processing
        socket.emit('stopAudio');
    }



    // Process message data and add to chat history
    handleTextOutput(data) {
        console.log("Processing text output:", data);
        this.onTextOutput?.(data.content)
    }

}