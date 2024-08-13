import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "./components/ui/sonner.jsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import store from "./redux/store.js";
import { persistStore } from "redux-persist";

let persistor = persistStore(store);
 
createRoot(document.getElementById("root")).render(
  <div>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />

        <Toaster />
      </PersistGate>
    </Provider>
  </div>
);
