import { Card, Col, message } from 'antd';
import { Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

const { Title } = Typography;

type Props = {
    data: any;
};

export default function ModeratorMsgComponent(props: Props) {
    var subscriptionKey = process.env.REACT_APP_AZURE_SPEECH_SUBSCRIPTION_KEY + '';
    var serviceRegion = process.env.REACT_APP_AZURE_SPEECH_SERVICE_REGION + ''; // e.g., "westus"

    var audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput(); //.fromAudioFileOutput(filename);
    var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
    speechConfig.speechSynthesisLanguage = 'ja-JP';
    speechConfig.speechSynthesisOutputFormat =
        sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

    // create the speech synthesizer.
    var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    const presenterIdNow = useSelector((state: any) => state.meetingReducer.presenterIdNow);

    const [message, setModeratorMessage] = useState('開始までお待ちください');

    const hostSpeech = async (message: string) => {
        await synthesizer.speakTextAsync(
            message,
            function (result) {
                if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                    console.log('synthesis finished.');

                    console.log(result.audioData);
                    const view = new DataView(result.audioData);
                    const audioBlob = new Blob([view], { type: 'audio/wav' });
                    const myURL = window.URL || window.webkitURL;
                    const audioElement = document.getElementById('audio') as HTMLAudioElement;
                    audioElement.src = myURL.createObjectURL(audioBlob);
                    // audioElement.play();
                } else {
                    console.error(
                        'Speech synthesis canceled, ' +
                            result.errorDetails +
                            '\nDid you update the subscription info?'
                    );
                }
                // synthesizer.close();
            },
            function (err) {
                console.trace('err - ' + err);
                // synthesizer.close();
            }
        );
    };

    useEffect(() => {
        if (props.data) {
            setModeratorMessage(props.data.moderatorMsgBody);
            hostSpeech(props.data.moderatorMsgBody);
        }
    }, [props.data]);

    useEffect(() => {
        hostSpeech(message);
    }, []);

    return (
        <Col span={24} style={{ marginTop: '5px' }}>
            <audio id="audio" controls={false}></audio>
            <Title level={4} style={{ width: '100%', textAlign: 'center' }}>
                {message}
            </Title>
        </Col>
    );
}
