import { StyleSheet, Text} from 'react-native'
import Spacer from "@components/Spacer"
import ThemedView from '@components/ThemedView'

const Comunity = () => {
  return (
    <ThemedView style={styles.container} safe={true}>
      <Text style={styles.heading}>
        Comunidade
      </Text>
      <Spacer/>
    </ThemedView>
  )
}

export default Comunity

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center"
  }
})