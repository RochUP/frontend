import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Dictaphone = () => {
    const [message, setMessage] = React.useState('');

    const commands = [
        {
            command: '*発表を終わ*',
            callback: () => {
                setMessage('発表終了');
            },
        },
        {
            command: '*質問を終わ*',
            callback: () => {
                setMessage('質問終了');
            },
        },
    ];

    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
        useSpeechRecognition({ commands });

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    return (
        <div>
            <p>Microphone: {listening ? 'on' : 'off'}</p>
            <button
                onClick={() =>
                    SpeechRecognition.startListening({ language: 'ja', continuous: true })
                }
            >
                Start
            </button>
            <button onClick={SpeechRecognition.stopListening}>Stop</button>
            <button onClick={resetTranscript}>Reset</button>
            <p>{transcript}</p>
            <p>{message}</p>
        </div>
    );
};
export default Dictaphone;
