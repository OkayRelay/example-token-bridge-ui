import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import {createRoot} from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { AlgorandContextProvider } from "./contexts/AlgorandWalletContext";
import AptosWalletProvider from "./contexts/AptosWalletContext";
import { EthereumProviderProvider } from "./contexts/EthereumProviderContext";
import InjectiveWalletProvider from "./contexts/InjectiveWalletContext";
import { NearContextProvider } from "./contexts/NearWalletContext";
import { SolanaWalletProvider } from "./contexts/SolanaWalletContext";
import { TerraWalletProvider } from "./contexts/TerraWalletContext";
import XplaWalletProvider from "./contexts/XplaWalletContext";
import ErrorBoundary from "./ErrorBoundary";
import { theme } from "./muiTheme";
import { store } from "./store";


const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <ErrorBoundary>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <SnackbarProvider maxSnack={3}>
            <SolanaWalletProvider>
              <EthereumProviderProvider>
                <TerraWalletProvider>
                  <AlgorandContextProvider>
                    <XplaWalletProvider>
                        <InjectiveWalletProvider>
                            <HashRouter>
                              <App />
                            </HashRouter>
                        </InjectiveWalletProvider>
                    </XplaWalletProvider>
                  </AlgorandContextProvider>
                </TerraWalletProvider>
              </EthereumProviderProvider>
            </SolanaWalletProvider>
          </SnackbarProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  </ErrorBoundary>
);
