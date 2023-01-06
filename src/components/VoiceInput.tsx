import React, { Ref, useCallback, useEffect, useState } from "react";
import { Button, Icon } from "react-native-elements";
import Voice, {
  SpeechResultsEvent,
  SpeechStartEvent,
  SpeechEndEvent,
} from "@react-native-voice/voice";

interface Props {
  resultCallback: (text: string) => void;
}

const VoiceInput = ({ resultCallback }: Props) => {
  const [voiceIsAvailable, setVoiceIsAvailable] = useState(false);
  const [voiceIsOn, setVoiceIsOn] = useState(false);
  const [voiceInputData, setVoiceInputData] = useState<string | undefined>();

  useEffect(() => {
    return () => {
      Voice.removeAllListeners();
      Voice.destroy();
    };
  }, []);

  useEffect(() => {
    Voice.isAvailable().then((isAvailable) => {
      setVoiceIsAvailable(Boolean(isAvailable));
      if (isAvailable) {
        Voice.onSpeechResults = (e: SpeechResultsEvent) => {
          if (e.value) {
            setVoiceInputData(e.value.pop());
          }
        };
        // Voice.onSpeechStart = (e: SpeechStartEvent) => {
        //   console.log("*** onSpeechStart");
        // };
        // Voice.onSpeechEnd = (e: SpeechEndEvent) => {
        //   console.log("*** onSpeechEnd");
        //   setVoiceIsOn(false);
        // };
      }
    });
  }, [Voice]);

  const toggleRecordVoice = useCallback(() => {
    if (voiceIsOn) {
      Voice.stop().then(() => {
        setVoiceIsOn(false);
      });
    } else {
      Voice.start("en-US").then(() => {
        setVoiceIsOn(true);
      });
    }
  }, [voiceIsOn]);

  useEffect(() => {
    if (voiceInputData) {
      resultCallback(voiceInputData);
    }
  }, [voiceInputData]);

  if (voiceIsAvailable) {
    return (
      <Button
        title={
          <Icon
            type="font-awesome-5"
            name={voiceIsOn ? "microphone" : "microphone-slash"}
            color={"black"}
            size={24}
            tvParallaxProperties={undefined}
          />
        }
        onPress={toggleRecordVoice}
      />
    );
  }
  return <></>;
};
export default VoiceInput;
