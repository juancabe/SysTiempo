import React from "react";
import { StyleSheet, Text, View, Button, Pressable } from "react-native";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

const BACKGROUND_FETCH_TASK = "getEspData";

// 2. Register the task at some point in your app by providing the same name,
// and some configuration options for how the background fetch should behave
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 15, // 15 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

// 3. (Optional) Unregister tasks by specifying the task name
// This will cancel any future background fetch calls that match the given name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

export function BackgroundFetchScreen() {
  const [isRegistered, setIsRegistered] = React.useState(false);
  const [status, setStatus] = React.useState(null);
  const [allLoaded, setAllLoaded] = React.useState(0);

  React.useEffect(() => {
    checkStatusAsync();
  }, []);

  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_FETCH_TASK,
    );
    setStatus(status);
    setIsRegistered(isRegistered);
    setAllLoaded(allLoaded + 1);
  };

  const toggleFetchTask = async () => {
    if (isRegistered) {
      await unregisterBackgroundFetchAsync();
    } else {
      await registerBackgroundFetchAsync();
    }

    checkStatusAsync();
  };

  if (allLoaded === 0) return null;

  return (
    <View className="flex-1 p-10 justify-center">
      <View className="pb-14">
        <Text className="text-white pb-3">
          Status:{" "}
          <Text className="text-lime-500">
            {status && BackgroundFetch.BackgroundFetchStatus[status]}
          </Text>
        </Text>
        <Text className="text-white">
          Nombre de tarea:{" "}
          <Text
            className={`${isRegistered ? "text-lime-500" : "text-red-600"}`}
          >
            {isRegistered ? BACKGROUND_FETCH_TASK : "Not registered yet!"}
          </Text>
        </Text>
      </View>
      <View>
        <Pressable
          className={
            isRegistered
              ? "bg-slate-500 py-4 rounded"
              : "bg-lime-400 py-4 rounded"
          }
          onPress={toggleFetchTask}
        >
          <Text className="text-black text-center text-lg text-opacity-90 font-semibold">
            {isRegistered
              ? "Desactivar carga en segundo plano"
              : "Activar carga en segundo plano"}
          </Text>
        </Pressable>
      </View>
      <View className="py-8" />
    </View>
  );
}
