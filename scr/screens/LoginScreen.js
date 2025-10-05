// src/screens/LoginScreen.js
import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export default function LoginScreen() {
  return (
    <View className="flex-1 bg-white justify-center px-8">
      <Text className="text-3xl font-bold text-center mb-8 text-[#FF7A00]">
        Iniciar Sesión
      </Text>

      {/* Campo Usuario */}
      <TextInput
        placeholder="Correo o usuario"
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
      />

      {/* Campo Contraseña */}
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        className="border border-gray-300 rounded-lg px-4 py-3 mb-6"
      />

      {/* Botón */}
      <TouchableOpacity className="bg-[#FF7A00] py-3 rounded-lg">
        <Text className="text-white text-lg font-semibold text-center">
          Entrar
        </Text>
      </TouchableOpacity>

      {/* Link de registro */}
      <TouchableOpacity className="mt-4">
        <Text className="text-center text-gray-600">
          ¿No tienes cuenta? Regístrate
        </Text>
      </TouchableOpacity>
    </View>
  );
}
