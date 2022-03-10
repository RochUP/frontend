import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

export default function Text2SpeechComponent() {
    var subscriptionKey = process.env.REACT_APP_AZURE_SPEECH_SUBSCRIPTION_KEY + '';
    var serviceRegion = process.env.REACT_APP_AZURE_SPEECH_SERVICE_REGION + ''; // e.g., "westus"

    // let audio = new Audio();
    let player: sdk.SpeakerAudioDestination;

    const onClickSpeech = () => {
        // now create the audio-config pointing to our stream and
        // the speech config specifying the language.
        player = new sdk.SpeakerAudioDestination();
        var audioConfig = sdk.AudioConfig.fromSpeakerOutput(player); //.fromAudioFileOutput(filename);
        var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
        speechConfig.speechSynthesisLanguage = 'ja-JP';
        speechConfig.speechSynthesisOutputFormat =
            sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

        // create the speech synthesizer.
        var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
        const input_form = document.getElementById('text') as HTMLInputElement;
        const message = input_form.value;

        synthesizer.speakTextAsync(
            message,
            function (result) {
                if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                    console.log('synthesis finished.');

                    // console.log(result.audioData);
                    // const view = new DataView(result.audioData);
                    // const audioBlob = new Blob([view], { type: 'audio/wav' });
                    // const myURL = window.URL || window.webkitURL;
                    // const audioElement = document.getElementById('audio') as HTMLAudioElement;
                    // audioElement.src = myURL.createObjectURL(audioBlob);
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

    return (
        <div>
            {/* <p>{message}</p> */}
            <input type="text" id="text" />
            <button onClick={onClickSpeech}>Speech</button>
            {/* <audio id="audio" controls={true}></audio> */}
            <button onClick={() => player.pause()}>Pause</button>
            <button onClick={() => player.resume()}>Resume</button>
        </div>
    );
}
