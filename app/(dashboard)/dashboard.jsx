import { StyleSheet, Text, View } from 'react-native'
import Spacer from "../../components/Spacer"
import ThemedView from '../../components/ThemedView'

const Dashboard = () => {
  return (
    <ThemedView style={styles.container} safe={true}>
      <Text style={styles.heading}>
        Dashboard
      </Text>
      <Spacer/>
    </ThemedView>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "stretch"
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center"
  }
})