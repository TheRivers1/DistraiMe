import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import ThemedView from "../../../components/ThemedView";
import ThemedButton from "../../../components/ThemedButton";
import { Colors } from "../../../constants/Colors";

interface BreathingExercise {
  id: number;
  nome: string;
  descricao: string;
  tempo_inspiracao: number;
  tempo_expiracao: number;
  duracao: number;
}

type BreathingPhase = "inspiracao" | "pausa" | "expiracao" | "pausa_final";

export default function Breathing() {
  const [exercise, setExercise] = useState<BreathingExercise | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] =
    useState<BreathingPhase>("inspiracao");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const totalIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentPhaseRef = useRef<BreathingPhase>("inspiracao");

  const screenWidth = Dimensions.get("window").width;
  const circleSize = screenWidth * 0.6;

  const fetchRandomExercise = async () => {
    try {
      setIsLoading(true);

      const { data: allExercises, error: fetchError } = await supabase
        .from("respiracao")
        .select("*");

      if (fetchError) {
        console.error("Erro ao buscar exercícios:", fetchError);
        Alert.alert(
          "Erro",
          "Não foi possível carregar os exercícios de respiração"
        );
        return;
      }

      if (allExercises && allExercises.length > 0) {
        const randomIndex = Math.floor(Math.random() * allExercises.length);
        const randomExercise = allExercises[randomIndex];

        setExercise(randomExercise);
        setTotalTimeRemaining(randomExercise.duracao);
      } else {
        Alert.alert(
          "Aviso",
          "Nenhum exercício de respiração encontrado na base de dados"
        );
      }
    } catch (error) {
      console.error("Erro:", error);
      Alert.alert("Erro", "Erro inesperado ao carregar exercício");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomExercise();
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (totalIntervalRef.current) clearInterval(totalIntervalRef.current);
    };
  }, []);

  const animateCircle = (phase: BreathingPhase) => {
    let targetScale: number;
    let duration: number;

    switch (phase) {
      case "inspiracao":
        targetScale = 1.3;
        duration = (exercise?.tempo_inspiracao || 4) * 1000;
        break;
      case "expiracao":
        targetScale = 1;
        duration = (exercise?.tempo_expiracao || 6) * 1000;
        break;
      default:
        targetScale = 1;
        duration = 1000;
    }

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: targetScale,
        duration: duration,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.7,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  // Controlar o exercício
  const startExercise = () => {
    if (!exercise) return;

    setIsPlaying(true);
    setCurrentPhase("inspiracao");
    currentPhaseRef.current = "inspiracao";
    setTimeRemaining(exercise.tempo_inspiracao);
    animateCircle("inspiracao");

    // Timer para duração total
    totalIntervalRef.current = setInterval(() => {
      setTotalTimeRemaining((prev) => {
        if (prev <= 1) {
          stopExercise();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Alternar fase usando o ref para ter acesso ao valor atual
          if (currentPhaseRef.current === "inspiracao") {
            currentPhaseRef.current = "expiracao";
            setCurrentPhase("expiracao");
            animateCircle("expiracao");
            return exercise.tempo_expiracao;
          } else {
            currentPhaseRef.current = "inspiracao";
            setCurrentPhase("inspiracao");
            animateCircle("inspiracao");
            return exercise.tempo_inspiracao;
          }
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopExercise = () => {
    setIsPlaying(false);
    setCurrentPhase("inspiracao");
    currentPhaseRef.current = "inspiracao";
    setTimeRemaining(0);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (totalIntervalRef.current) {
      clearInterval(totalIntervalRef.current);
      totalIntervalRef.current = null;
    }

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const resetExercise = () => {
    stopExercise();
    if (exercise) {
      setTotalTimeRemaining(exercise.duracao);
    }
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case "inspiracao":
        return "Inspire";
      case "expiracao":
        return "Expire";
      default:
        return "Pause";
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case "inspiracao":
        return Colors.primary;
      case "expiracao":
        return Colors.secondary;
      default:
        return Colors.tabColor;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container} safe>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando exercício...</Text>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container} safe>
      <View style={styles.header}>
        <Text style={styles.title}>{exercise.nome}</Text>
        <Text style={styles.description}>{exercise.descricao}</Text>
      </View>

      <View style={styles.circleContainer}>
        <Animated.View
          style={[
            styles.breathingCircle,
            {
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
              backgroundColor: getPhaseColor(),
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <Text style={styles.phaseText}>{getPhaseText()}</Text>
        </Animated.View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tempo total </Text>
          <Text style={styles.infoValue}>{formatTime(totalTimeRemaining)}</Text>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        {!isPlaying ? (
          <ThemedButton style={{}} onPress={startExercise}>
            <Text style={styles.buttonText}>Iniciar Exercício</Text>
          </ThemedButton>
        ) : (
          <View style={styles.playingControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={stopExercise}
            >
              <Text style={styles.controlButtonText}>Pausar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={resetExercise}
            >
              <Text style={styles.controlButtonText}>Reiniciar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: "10%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textColor,
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: Colors.textColor,
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 22,
  },
  circleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  breathingCircle: {
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  phaseText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  infoContainer: {
    backgroundColor: "white",
    borderRadius: 50,
    padding: 20,
    marginLeft: 80,
    marginRight: 80,
    marginBottom: 20,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 16,
    color: Colors.textColor,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "bold",
  },
  controlsContainer: {
    marginBottom: 20,
  },
  playingControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  controlButton: {
    flex: 1,
    backgroundColor: Colors.tabColor,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  controlButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: Colors.textColor,
  },
});
