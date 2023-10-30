import { useCallback, useEffect } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { FlatList, StyleSheet, Text, View } from "react-native";
import {
  HeaderButton,
  HeaderButtons,
  Item,
} from "react-navigation-header-buttons";
import colors from "../utils/colors";
import supportedLanguages from "../utils/supportedLanguages";
import LanguageItem from "../components/LanguageItem";

const CustomHeaderButton = (props) => {
  return (
    <HeaderButton
      {...props}
      IconComponent={FontAwesome5}
      iconSize={23}
      color={props.color || colors.primary}
    />
  );
};

export default function LanguageSelectScreen({ navigation, route }) {
  const params = route.params || {};
  const { title, selected } = params;
  const languages = Object.keys(supportedLanguages);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: title,
      headerRight: () => {
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            iconName="close"
            color={colors.textColor}
            onPress={() => navigation.goBack()}
          />
        </HeaderButtons>;
      },
    });
  }, [navigation]);

  const onLanguageSelect = useCallback(
    (itemKey) => {
      const dataKey = params.mode === "to" ? "languageTo" : "languageFrom";
      navigation.navigate("Home", { [dataKey]: itemKey });
    },
    [params, navigation]
  );

  const renderItem = ({ item }) => {
    const languageName = supportedLanguages[item];

    return (
      <LanguageItem
        text={languageName}
        selected={item === selected}
        onPress={() => onLanguageSelect(item)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={languages}
        keyExtractor={(item) => item}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
