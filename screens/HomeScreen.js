import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import colors from "../utils/colors";
import { useCallback, useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import supportedLanguages from "../utils/supportedLanguages";
import { translate } from "../utils/translate";
import * as Clipboard from "expo-clipboard";
import { useDispatch, useSelector } from "react-redux";
import { addHistoryItem, setHistoryItems } from "../store/historySlice";
import TranslationResult from "../components/TranslationResult";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setSavedItems } from "../store/savedItemsSlice";

const loadData = () => {
  return async (dispatch) => {
    try {
      const historyString = await AsyncStorage.getItem("history");
      if (historyString !== null) {
        const history = JSON.parse(historyString);
        dispatch(setHistoryItems({ items: history }));
      }

      const savedItemsString = await AsyncStorage.getItem("savedItems");
      if (savedItemsString !== null) {
        const savedItems = JSON.parse(savedItemsString);
        dispatch(setSavedItems({ items: savedItems }));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export default function HomeScreen(props) {
  const params = props.route.params || {};

  const dispatch = useDispatch();
  const history = useSelector((state) => state.history.items);

  const [enteredText, setEnteredText] = useState("");
  const [resultText, setResultText] = useState("");
  const [languageFrom, setLanguageFrom] = useState("en");
  const [languageTo, setLanguageTo] = useState("es");
  const [loadingInternal, setLoadingInternal] = useState(false);

  useEffect(() => {
    if (params.languageTo) {
      setLanguageTo(params.languageTo);
    }
    if (params.languageFrom) {
      setLanguageFrom(params.languageFrom);
    }
  }, [params.languageTo, params.languageFrom]);

  useEffect(() => {
    dispatch(loadData());
  }, [dispatch]);

  useEffect(() => {
    const savedHistory = async () => {
      try {
        await AsyncStorage.setItem("history", JSON.stringify(history));
      } catch (error) {
        console.log(error);
      }
    };

    savedHistory();
  }, [history]);

  const onSubmit = useCallback(async () => {
    try {
      setLoadingInternal(true);
      const result = await translate(enteredText, languageFrom, languageTo);
      if (!result) {
        setResultText("");
        return;
      }

      const { translated_text, to } = result;
      const resText = translated_text[to];
      setResultText(resText);

      const id = uuid.v4();
      result.id = id;
      result.dateTime = new Date().toUTCString();

      dispatch(addHistoryItem({ item: result }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingInternal(false);
    }
  }, [enteredText, languageFrom, languageTo, dispatch]);

  const copyToClipboard = useCallback(async () => {
    await Clipboard.setStringAsync(resultText);
  }, [resultText]);

  return (
    <View style={styles.container}>
      <View style={styles.languageContainer}>
        <TouchableOpacity
          style={styles.languageOption}
          onPress={() =>
            props.navigation.navigate("languageSelect", {
              title: "Traducir de",
              mode: "from",
              selected: languageFrom,
            })
          }
        >
          <Text style={styles.languageOptionText}>
            {supportedLanguages[languageFrom]}
          </Text>
        </TouchableOpacity>

        <View style={styles.arrowContainer}>
          <FontAwesome5 name="arrow-right" size={24} color={colors.lightGrey} />
        </View>

        <TouchableOpacity
          style={styles.languageOption}
          onPress={() =>
            props.navigation.navigate("languageSelect", {
              title: "Traducir a",
              mode: "to",
              selected: languageTo,
            })
          }
        >
          <Text style={styles.languageOptionText}>
            {supportedLanguages[languageTo]}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Ingrese el texto a traducir"
          multiline
          style={styles.textInput}
          onChangeText={(text) => setEnteredText(text)}
        />

        <TouchableOpacity
          style={styles.iconContainer}
          disabled={enteredText === ""}
          onPress={loadingInternal ? undefined : onSubmit}
        >
          {loadingInternal ? (
            <ActivityIndicator size={"small"} color={colors.primary} />
          ) : (
            <FontAwesome5
              name="arrow-circle-right"
              size={24}
              color={
                enteredText !== "" ? colors.primary : colors.primaryDisabled
              }
            />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>{resultText}</Text>

        <TouchableOpacity
          style={styles.iconContainer}
          disabled={resultText === ""}
          onPress={copyToClipboard}
        >
          <MaterialIcons
            name="content-copy"
            size={24}
            color={
              resultText !== "" ? colors.textColor : colors.textColorDisabled
            }
          />
        </TouchableOpacity>
      </View>

      <View style={styles.historyContainer}>
        <FlatList
          data={history.slice().reverse()}
          renderItem={(itemData) => {
            return <TranslationResult itemId={itemData.item.id} />;
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  languageContainer: {
    flexDirection: "row",
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,
  },
  languageOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  arrowContainer: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  languageOptionText: {
    color: colors.primary,
    fontFamily: "regular",
    letterSpacing: 0.3,
  },
  inputContainer: {
    flexDirection: "row",
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,
  },
  textInput: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontFamily: "regular",
    letterSpacing: 0.3,
    height: 90,
    color: colors.textColor,
  },
  iconContainer: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  resultContainer: {
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,
    flexDirection: "row",
    height: 90,
    paddingVertical: 15,
  },
  resultText: {
    fontFamily: "regular",
    letterSpacing: 0.3,
    color: colors.primary,
    flex: 1,
    marginHorizontal: 20,
  },
  historyContainer: {
    backgroundColor: colors.grayBackground,
    flex: 1,
    padding: 10,
  },
});
