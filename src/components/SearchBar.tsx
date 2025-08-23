import { icons } from "@/constants/icons";
import { useNavigation } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Image, TextInput, View } from "react-native";

interface Props {
  placeHolder: string;
  onPress?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
  editable: boolean;
}
const SearchBar = ({
  placeHolder,
  onPress,
  value,
  onChangeText,
  editable,
}: Props) => {
  const inputRef = useRef<TextInput>(null);
  const navigation = useNavigation();

  // auto pop out the keyboard
  useEffect(() => {
    const unsub = navigation.addListener("focus", () => {
      setTimeout(() => inputRef.current?.focus(), 300);
    });
    return unsub;
  }, [navigation]);

  return (
    <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
      <Image
        source={icons.search}
        className="w-5 h-5"
        resizeMode="contain"
        tintColor="#AB8BFF"
      />
      <TextInput
        onPress={onPress}
        placeholder={placeHolder}
        value={value}
        onChangeText={onChangeText}
        className="flex-1 ml-2 text-white"
        placeholderTextColor="#A8B5DB"
        autoFocus={false}
        editable={editable}
        ref={inputRef}
      />
    </View>
  );
};

export default SearchBar;
