import { StyleSheet, Text} from 'react-native'
import Spacer from "@components/Spacer"
import ThemedView from '@components/ThemedView'

const Gastos = () => {
  return (
    <ThemedView style={styles.container} safe={false}>
      <Text style={styles.heading}>
        GASTOS
      </Text>
      <Spacer/>
    </ThemedView>
  )
}

export default Gastos

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center"
  }
})