import { TouchableOpacity, Text, StyleSheet } from "react-native";
import colors from "../constants/colors";

export default function OptionButton({ text, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
