import React, { useCallback, useEffect, useState } from "react";
import { Button, Icon } from "react-native-elements";
import Voice, { SpeechResultsEvent } from "@react-native-voice/voice";

interface Props {
  resultCallback: (text: string) => void;
}

const VoiceInput = ({ resultCallback }: Props) => {
  const [voiceIsAvailable, setVoiceIsAvailable] = useState(false);
  const [voiceIsOn, setVoiceIsOn] = useState(false);
  const [voiceInputData, setVoiceInputData] = useState<string | undefined>();

  useEffect(() => {
    Voice.isAvailable().then((isaAvailable) => {
      setVoiceIsAvailable(Boolean(isaAvailable));
    });
  }, [Voice]);

  const toggleRecordVoice = useCallback(() => {
    if (voiceIsOn) {
      Voice.stop();
      setVoiceIsOn(false);
    } else {
      Voice.onSpeechResults = (e: SpeechResultsEvent) => {
        if (e.value) {
          setVoiceInputData(e.value.pop());
        }
      };
      setVoiceIsOn(true);
      Voice.start("en-US");
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
