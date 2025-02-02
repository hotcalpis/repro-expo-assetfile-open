import { Text, View } from "react-native";
import { Asset } from 'expo-asset';
import { File } from 'expo-file-system/next';
import { readAsStringAsync, EncodingType } from'expo-file-system';
import { useEffect, useState } from "react";

export default function Index() {
  const [result, setResult] = useState('');
  const [oldApiResult, setOldApiResult] = useState('');

  const reproduce = async () => {
    const [{ localUri }] = await Asset.loadAsync(require('../assets/sample.dat'));

    if (localUri) {
      try {
        const file = new File(localUri).open(); // UnexpectedException: You don’t have permission to save the file “sample.dat” in the folder “assets”. (at ExpoModulesCore/SyncFunctionDefinition.swift:139)
        file.offset = 1;

        const uInt8Array = file.readBytes(1);
        const string = new TextDecoder().decode(uInt8Array);
        setResult(string);
      } catch (e) {
        setResult((e as Error).message);
      }
    }
  }

  const executeOldApi = async () => {
    const [{ localUri }] = await Asset.loadAsync(require('../assets/sample.dat'));

    if (localUri) {
      const base64String = await readAsStringAsync(localUri, {
        encoding: EncodingType.Base64,
        position: 1,
        length: 1
      });

      setOldApiResult(atob(base64String));
    }
  }

  useEffect(() => {
    reproduce();
    executeOldApi();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>result: {result}</Text>
      <Text>oldApiResult: {oldApiResult}</Text>
    </View>
  );
}
