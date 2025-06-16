import { StyleSheet, Text } from 'react-native'
import Spacer from "@components/Spacer"
import ThemedView from '@components/ThemedView'

const Create = () => {
  return (
    <ThemedView style={styles.container} safe={true}>
      <Text style={styles.heading}>
        Distrai-me
      </Text>
      <Spacer/>
    </ThemedView>
  )
}

export default Create

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "center"
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center"
  }
})