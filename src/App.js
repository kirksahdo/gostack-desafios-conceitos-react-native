import React, {useState, useEffect, useRef} from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from "./services/api";

export default function App() {

  const [repositories, setRepositories] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  async function handleLikeRepository(id) {
    const response = await api.post(`repositories/${id}/like`);
    const repository = response.data;
    const reps = repositories.map(rep => {
      if(rep.id === id) {
        return {...repository}
      }else{
        return rep;
      }
    });
    setRepositories([...reps]);
  }

  async function onRefresh(){
    setRefreshing(true);
    const response = await api.get('repositories');
    setRepositories(response.data);
    setRefreshing(false);
  }

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    })
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList data={repositories}
          keyExtractor={(item) => item.id}
          onRefresh={onRefresh}
          refreshing = {refreshing}
          renderItem={({item: repository}) => (<View style={styles.repositoryContainer}>
            <Text style={styles.repository}>{repository.title}</Text>
  
            <View style={styles.techsContainer}>
              {repository.techs && repository.techs.map(rep => (
              <Text key={rep} style={styles.tech}>
                {rep}
              </Text>))}
            </View>
  
            <View style={styles.likesContainer}>
              <Text
                style={styles.likeText}
                testID={`repository-likes-${repository.id}`}
              >
                {repository.likes} curtidas
              </Text>
            </View>
  
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleLikeRepository(repository.id)}
              testID={`like-button-${repository.id}`}
            >
              <Text style={styles.buttonText}>Curtir</Text>
            </TouchableOpacity>
          </View>)}/>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
