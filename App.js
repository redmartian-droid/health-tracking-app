import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import AppRN from './App-RN';

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AppRN />
    </>
  );
}

registerRootComponent(App);
