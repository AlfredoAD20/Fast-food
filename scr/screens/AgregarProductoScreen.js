import React, { useState, useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { API_URL } from '@env';
import { AuthContext } from '../auth/AuthContext';

export default function AgregarProductoScreen({ navigation }) {
  const { token } = useContext(AuthContext);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('burger'); // burger | hotdog
  const [imagenUri, setImagenUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const isBurger = categoria === 'burger';

  const solicitarPermisosYElegirImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permiso requerido',
        'Necesitas permitir acceso a tus fotos para subir una imagen.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setImagenUri(asset.uri);
    }
  };

  const handleGuardar = async () => {
    if (!nombre || !precio || !categoria) {
      Alert.alert('Campos incompletos', 'Nombre, precio y categoría son obligatorios');
      return;
    }

    if (!token) {
      Alert.alert('Sesión requerida', 'Inicia sesión como administrador.');
      return;
    }

    const precioNum = Number(precio);
    if (isNaN(precioNum) || precioNum <= 0) {
      Alert.alert('Precio inválido', 'Ingresa un precio numérico mayor a 0.');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('descripcion', descripcion);
      formData.append('precio', precioNum.toString());
      formData.append('categoria', categoria);

      if (imagenUri) {
        // Intentar deducir tipo mime simple
        const extension = imagenUri.split('.').pop()?.toLowerCase();
        let mimeType = 'image/jpeg';
        if (extension === 'png') mimeType = 'image/png';
        if (extension === 'jpg' || extension === 'jpeg') mimeType = 'image/jpeg';

        formData.append('imagen', {
          uri: imagenUri,
          name: `producto-${Date.now()}.${extension || 'jpg'}`,
          type: mimeType,
        });
      }

      const res = await fetch(`${API_URL}/admin/products`, {
        method: 'POST',
        headers: {
          // IMPORTANTE: NO poner 'Content-Type' aquí,
          // React Native lo arma solo con el boundary correcto.
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.log('Error crear producto admin:', data);
        Alert.alert('Error', data.message || 'No se pudo crear el producto');
        return;
      }

      Alert.alert('Éxito', 'Producto creado correctamente');

      // Limpiar
      setNombre('');
      setDescripcion('');
      setPrecio('');
      setCategoria('burger');
      setImagenUri(null);

      navigation.goBack();
    } catch (error) {
      console.error('Error al crear producto:', error);
      Alert.alert('Error de conexión', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Agregar producto</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Ej. Big Burger"
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, { height: 70 }]}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Describe el platillo..."
          multiline
        />

        <Text style={styles.label}>Precio</Text>
        <TextInput
          style={styles.input}
          value={precio}
          onChangeText={setPrecio}
          placeholder="Ej. 80"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Categoría</Text>
        <View style={styles.categoriaRow}>
          <TouchableOpacity
            style={[
              styles.categoriaChip,
              isBurger && styles.categoriaChipActiva,
            ]}
            onPress={() => setCategoria('burger')}
          >
            <Text
              style={[
                styles.categoriaTexto,
                isBurger && styles.categoriaTextoActivo,
              ]}
            >
              Burger
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.categoriaChip,
              !isBurger && styles.categoriaChipActiva,
            ]}
            onPress={() => setCategoria('hotdog')}
          >
            <Text
              style={[
                styles.categoriaTexto,
                !isBurger && styles.categoriaTextoActivo,
              ]}
            >
              Hot Dog
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Imagen del producto</Text>
        <View style={styles.imagenSection}>
          {imagenUri ? (
            <Image source={{ uri: imagenUri }} style={styles.preview} />
          ) : (
            <View style={styles.previewPlaceholder}>
              <Text style={styles.previewPlaceholderText}>Sin imagen seleccionada</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.botonImagen}
            onPress={solicitarPermisosYElegirImagen}
          >
            <Text style={styles.botonImagenTexto}>Elegir desde galería</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.botonGuardar}
        onPress={handleGuardar}
        disabled={loading}
      >
        <Text style={styles.botonGuardarTexto}>
          {loading ? 'Guardando...' : 'Guardar producto'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf2',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '900',
    color: '#e85c1e',
    marginBottom: 20,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoriaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  categoriaChip: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F97316',
    backgroundColor: '#fff',
  },
  categoriaChipActiva: {
    backgroundColor: '#F97316',
  },
  categoriaTexto: {
    fontWeight: '600',
    color: '#F97316',
  },
  categoriaTextoActivo: {
    color: '#fff',
  },
  imagenSection: {
    marginTop: 6,
    alignItems: 'center',
  },
  preview: {
    width: 160,
    height: 160,
    borderRadius: 16,
    marginBottom: 8,
  },
  previewPlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#FEF3C7',
  },
  previewPlaceholderText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  botonImagen: {
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#e5e7eb',
  },
  botonImagenTexto: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 13,
  },
  botonGuardar: {
    backgroundColor: '#e85c1e',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  botonGuardarTexto: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
