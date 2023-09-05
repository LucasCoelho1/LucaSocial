import { View, Image } from "react-native";
import { Button, Text } from "react-native-paper";
import styles from "../utils/styles";
import { auth, db, storage } from "../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useState } from "react";
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker"; // Importando o módulo para selecionar imagens

export default function HomeScreen({ navigation }) {




  const [getImage, setImage] = useState(null);

  const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
      });

      console.log(result);

      if (!result.canceled) {
          setImage(result.assets[0].uri);
      }
  };

  const uploadImageToFirebase = async () => {
      try {
          const response = await fetch(getImage);
          const blob = await response.blob();

          const storageRef = ref(storage, 'images/' + Date.now());
          const uploadTask = uploadBytes(storageRef, blob);

          await uploadTask;

          const imageURL = await getDownloadURL(storageRef);
          setImageToFirebase(imageURL);
      } catch (error) {
          console.error('Error uploading image: ', error);
      }
  };

  const setImageToFirebase = async (imageURL) => {
      try {
          const ref = collection(db, 'images');
          await addDoc(ref, { imageURL });

          console.log('Image URL added to Firestore');
          setImage(null);
      } catch (error) {
          console.error('Error adding image URL to Firestore: ', error);
          setImage(null);
      }
  };







//   const storage = getStorage();
//   const [image, setImage] = useState(null);

//   const uploadImage = async () => {
//     if (!image) {
//       alert("Selecione uma imagem!");
//       return;
//     }
//     try {
//       const response = await fetch(image);
//       const blob = await response.blob();

//       const storageRef = ref(storage, 'images/' + Date.now());
//       const uploadTask = uploadBytes(storageRef, blob);

//       await uploadTask;

//       const imageURL = await getDownloadURL(storageRef);
//       setImageToFirebase(imageURL);
//     } catch (error) {
//       console.error('Error uploading image: ', error);
//     }
//   };

//   const setImageToFirebase = async (imageURL) => {
//     try {
//         const ref = collection(db, 'images');
//         await addDoc(ref, { imageURL });

//         console.log('Image URL added to Firestore');
//         setImage(null);
//     } catch (error) {
//         console.error('Error adding image URL to Firestore: ', error);
//         setImage(null);
//     }
// };

  const [logado, setLogado] = useState("Deslogado");
  const user = auth.currentUser;
  function logout() {
    signOut(auth)
      .then(() => {
        alert("Usuário deslogado com sucesso.");
      })
      .catch((error) => {
        alert("Erro ao deslogar usuário.");
      });
  }
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setLogado("Logado");
    } else {
      setLogado("Deslogado");
      navigation.navigate("login");
    }
  });
  
  if (!user)
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <View style={styles.Home}>
            <Text
              style={{
                color: "black",
                textAlign: "center",
                fontSize: 30,
                marginBottom: "10px",
              }}
            >
              Seja bem vindo a LucasSocial!
            </Text>
            <Button
              mode="contained"
              onPress={() => {
                navigation.navigate("LoginScreen");
              }}
            >
              Faça o login
            </Button>
            <View style={styles.distBottom}></View>
            <Button
              mode="contained"
              onPress={() => {
                navigation.navigate("RegisterScreen");
              }}
            >
              Faça o registro
            </Button>
          </View>
        </View>
      </View>
    );
  else
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 20, marginBottom: 15 }}>LucaSocial!</Text>
        <View
          style={{
            width: "25%",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              marginBottom: 15,
              marginTop: 15,
              textAlign: "center",
            }}
          >
            Publique sua imagem!
          </Text>
          <View style={{ marginTop: 5, width: "100%", alignSelf: "center"}}>
            <Button
              style={{
                marginTop: 5,
                borderColor: "black",
                borderWidth: 2,
              }}
              mode="contained"
              onPress={pickImage}
            >
              Selecione uma imagem!
            </Button>
            {getImage && (
              <Image
                source={{ uri: getImage }}
                style={{
                  width: 200,
                  height: 200,
                  alignSelf: "center",
                  marginTop: 15,
                }}
              />
            )}
          </View>
          <Button
            style={{
              marginTop: 12,
              borderColor: "black",
              borderWidth: 2,
            }}
            mode="contained"
            onPress={() => navigation.navigate("Feed")}
          >
            Feed
          </Button>
          <Button
            mode="contained"
            style={{
              marginTop: 12,
              borderColor: "black",
              borderWidth: 2,
            }}
            onPress={uploadImageToFirebase}
          >
            Publicar
          </Button>
          <Button
            mode="contained"
            style={{
              marginTop: 450,
              position: "fixed",
              alignSelf: "center",
            }}
            onPress={logout}
          >
            Deslogar
          </Button>
        </View>
      </View>
    );
}
