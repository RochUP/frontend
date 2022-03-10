import { Card, Col, message } from 'antd';
import { Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { setInterval } from 'timers/promises';

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
    const meetingStartTime = useSelector((state: any) => state.meetingReducer.meetingStartTime);

    //司会メッセージ
    const [message, setModeratorMessage] = useState('');

    //「開始までお待ちください」を会議開始まで表示
    let flag: boolean = false;

    //表示時間と司会メッセージの兼ね合いで(次々司会メッセージがくる)setTimeoutを止める
    var timer;

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

            flag = true;
        }

        //表示を〇〇秒後に消す(今は10秒),　連続で押された場合の挙動は不明
        timer = setTimeout(resetMessage, 5000);

        timer = setTimeout(resetMessage, 10000);

        // clearTimeout(timer0);

        // if (counter != 0) {
        //     clearTimeout(timer);
        //     changeCounter((pre_counter) => pre_counter - 1);
        // }
        // // else if (counter === 0) {
        // //     clearTimeout(timer1);
        // //     changeCounter((pre_counter) => pre_counter + 1);
        // // }
    }, [props.data]);

    useEffect(() => {
        //現在の時間との比較を行い，結果に合わせてメッセージを表示(内容は検討が必要)
        let date = new Date();

        const qyear = String(date.getFullYear());
        let qmonth = String(date.getMonth() + 1);
        let qday = String(date.getDate());
        let qhours = String(date.getHours());
        let qminutes = String(date.getMinutes());
        let qseconds = String(date.getSeconds());

        qmonth = setTime(qmonth);
        qday = setTime(qday);
        qhours = setTime(qhours);
        qminutes = setTime(qminutes);
        qseconds = setTime(qseconds);

        const nowtime =
            qyear + '/' + qmonth + '/' + qday + ' ' + qhours + ':' + qminutes + ':' + qseconds;

        if (meetingStartTime > nowtime) {
            setModeratorMessage('開始までお待ちください');
            hostSpeech('開始までお待ちください');
        } else {
            setModeratorMessage('');
        }
    }, []);

    //時間の調整
    const setTime = (date: string) => {
        if (Number(date) < 10) {
            date = '0' + date;
        }
        return date;
    };

    //司会メッセージのリセット
    function resetMessage() {
        //開始前の時だけずっと表示
        if (message !== '開始までお待ちください' && flag) {
            setModeratorMessage('');
            console.log('reset');
        }

        // changeCounter((pre_counter) => pre_counter - 1);
    }

    return (
        <Col span={24}>
            <audio id="audio" controls={false}></audio>
            <Title level={4} style={{ width: '100%', textAlign: 'center', minHeight: 30 }}>
                {message}
            </Title>
        </Col>
    );
}
