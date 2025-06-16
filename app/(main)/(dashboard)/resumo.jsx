import { StyleSheet, Text} from 'react-native'
import Spacer from "@components/Spacer"
import ThemedView from '@components/ThemedView'

const Resumo = () => {
  return (
    <ThemedView style={styles.container}>
      <Text style={styles.heading}>
        RESUMO
      </Text>
      <Spacer/>
    </ThemedView>
  )
}

export default Resumo

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