import { StyleSheet, Text, View } from 'react-native'
import Spacer from "@components/Spacer"
import ThemedView from '@components/ThemedView'

const Help = () => {
  return (
    <ThemedView style={styles.container} safe={true}>
      <Text style={styles.heading}>
        Dicas & Ajudas
      </Text>
      <Spacer/>
    </ThemedView>
  )
}

export default Help

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "stretch"
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center"
  }
})