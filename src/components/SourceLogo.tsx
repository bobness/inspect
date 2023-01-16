import React from "react";
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

import { Source } from "../types";

interface Props {
  data: Source;
  style?: StyleProp<any>;
  onPress?: (source: Source) => void;
}

const SHARED_STYLE = StyleSheet.create({
  shared: {
    padding: 10,
    textAlign: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: "solid",
    maxWidth: 100,
  },
});

const SourceLogo = ({ data, style, onPress }: Props) => {
  const content = data.logo_uri ? (
    <Image
      // title={item.title[0]}
      // titleStyle={{ color: "black" }}
      source={(data.logo_uri as any) && { uri: data.logo_uri }}
      style={{
        ...SHARED_STYLE.shared,
        ...style,
        // borderColor: "green",
        // borderWidth: 1,
        resizeMode: "contain",
      }}
      key={`trusted source #${data.id}`}
    />
  ) : (
    <Text
      style={{
        ...SHARED_STYLE.shared,
        ...style,
      }}
      adjustsFontSizeToFit={true}
      numberOfLines={1}
      key={`trusted source #${data.id}`}
    >
      {data.baseurl}
    </Text>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={() => {
          if (onPress) {
            onPress(data);
          }
        }}
      >
        {content}
      </TouchableOpacity>
    );
  } else {
    return content;
  }
};

export default SourceLogo;
