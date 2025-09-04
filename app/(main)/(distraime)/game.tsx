import { Colors } from "constants/Colors";
import React, { useState, useEffect } from "react";
import Separator from "@components/Separator";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
const randomArrFunction = (arr: any[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
const gameCardsFunction = () => {
  const icons = [
    "tag",
    "tag",
    "wallet",
    "wallet",
    "coins",
    "coins",
    "clock",
    "clock",
    "brain",
    "brain",
    "money-bill",
    "money-bill",
    "dollar-sign",
    "dollar-sign",
    "piggy-bank",
    "piggy-bank",
    "font-awesome",
    "font-awesome",
    "trophy",
    "trophy",
  ];
  const randomIcons = randomArrFunction(icons);
  return randomIcons.map((icon, index) => ({
    id: index,
    symbol: icon,
    isFlipped: false,
  }));
};
const App = () => {
  const [cards, setCards] = useState(gameCardsFunction());
  const [selectedCards, setSelectedCards] = useState<
    { id: number; symbol: string; isFlipped: boolean }[]
  >([]);
  const [matches, setMatches] = useState(0);
  const [winMessage, setWinMessage] = useState(new Animated.Value(0));
  const [gameWon, setGameWon] = useState(false);
  const cardClickFunction = (card: {
    id: number;
    symbol: string;
    isFlipped: boolean;
  }) => {
    if (!gameWon && selectedCards.length < 2 && !card.isFlipped) {
      const updatedSelectedCards = [...selectedCards, card];
      const updatedCards = cards.map((c) =>
        c.id === card.id ? { ...c, isFlipped: true } : c
      );
      setSelectedCards(updatedSelectedCards);
      setCards(updatedCards);
      if (updatedSelectedCards.length === 2) {
        if (updatedSelectedCards[0].symbol === updatedSelectedCards[1].symbol) {
          setMatches(matches + 1);
          setSelectedCards([]);
          if (matches + 1 === cards.length / 2) {
            geekWinGameFunction();
            setGameWon(true);
          }
        } else {
          setTimeout(() => {
            const flippedCards = updatedCards.map((c) =>
              updatedSelectedCards.some((s) => s.id === c.id)
                ? { ...c, isFlipped: false }
                : c
            );
            setSelectedCards([]);
            setCards(flippedCards);
          }, 1000);
        }
      }
    }
  };
  const geekWinGameFunction = () => {
    Animated.timing(winMessage, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };
  useEffect(() => {
    if (matches === cards.length / 2) {
      geekWinGameFunction();
      setGameWon(true);
    }
  }, [matches]);
  const msg = `Combinações: ${matches} | ${cards.length / 2}`;
  return (
    <View style={styles.container}>
      {gameWon ? (
        <View style={styles.winMessage}>
          <View style={styles.winMessageContent}>
            <Text style={styles.winText}>Parabéns!</Text>
            <Text style={styles.winText}>Acabou de Ganhar!</Text>
            <Button
              title="Jogar Outra Vez"
              onPress={() => {
                setCards(gameCardsFunction());
                setSelectedCards([]);
                setMatches(0);
                setWinMessage(new Animated.Value(0));
                setGameWon(false);
              }}
            />
          </View>
        </View>
      ) : (
        <>
          <Text style={styles.matchText}>{msg}</Text>
          <Separator width={"90%"} />
          <View style={[styles.grid, { marginTop: "5%" }]}>
            {cards.map((card) => (
              <TouchableOpacity
                key={card.id}
                style={[styles.card, card.isFlipped && styles.cardFlipped]}
                onPress={() => cardClickFunction(card)}
              >
                {card.isFlipped ? (
                  <Icon name={card.symbol} size={40} style={styles.cardIcon} />
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  matchText: {
    fontSize: 24,
    color: "black",
    marginBottom: "5%",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    width: 80,
    height: 80,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "black",
  },
  cardFlipped: {
    backgroundColor: "white",
  },
  cardIcon: {
    color: Colors.tabColor,
  },
  winMessage: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0)",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  winMessageContent: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  winText: {
    fontSize: 36,
    color: "#000000",
  },
});
export default App;
