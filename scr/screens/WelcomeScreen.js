import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function WelcomeScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login"); // redirigir a login
    }, 2500); // 2.5 segundos

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-white justify-center items-center">
      {/* Silueta hamburguesa */}
      <MaterialCommunityIcons
        name="hamburger"
        size={150}
        color="#FF7A00"
      />
      {/* Texto Bienvenido */}
      <Text className="mt-6 text-3xl font-bold text-[#FF7A00]">
        Bienvenido
      </Text>
    </View>
  );
}
