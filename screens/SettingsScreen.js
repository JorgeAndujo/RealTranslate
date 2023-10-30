import { Alert, StyleSheet, View } from "react-native";
import colors from "../utils/colors";
import SettingsItems from "../components/SettingsItems";
import { AntDesign } from "@expo/vector-icons";
import { useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { clearHistory } from "../store/historySlice";
import { clearSavedItems } from "../store/savedItemsSlice";

export default function SettingsScreen() {
  const dispatch = useDispatch();

  const deleteHistory = useCallback(async () => {
    try {
      await AsyncStorage.setItem("history", JSON.stringify([]));

      dispatch(clearHistory());
      Alert.alert("Exito", "Historial eliminado");
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  const deleteSavedItems = useCallback(async () => {
    try {
      await AsyncStorage.setItem("savedItems", JSON.stringify([]));

      dispatch(clearSavedItems());
      Alert.alert("Exito", "Favoritos eliminados");
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <SettingsItems
        title={"Limpiar historial"}
        subTitle={"Borra todas las traducciones de tu historial"}
        iconFamily={AntDesign}
        icon={"delete"}
        onPress={deleteHistory}
      />
      <SettingsItems
        title={"Limpiar favoritos"}
        subTitle={"Borra todos tus favoritos"}
        iconFamily={AntDesign}
        icon={"delete"}
        onPress={deleteSavedItems}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayBackground,
    padding: 10,
  },
});
