import './App.css';

import { ConnectKitProvider } from 'connectkit';
import { Route, Routes } from 'react-router-dom';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';

import { Header } from './components/Header/Header';
import { Footer } from './components/UI/Footer/Footer';
import { Admin } from './pages/Admin/Admin';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Manage } from './pages/Manage/Manage';
import { chainConfig } from './assets/constants';

let allowedChains = [];
if (process.env.NODE_ENV === 'development') {
  allowedChains.push(chain.localhost);
} else if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'production') {
  allowedChains.push(chain.goerli);
}

const { chains, provider, webSocketProvider } = configureChains(
  allowedChains, [
  jsonRpcProvider({
    rpc: (_chain) => ({ http: chainConfig[_chain.id].rpcUrl }),
  }),
  publicProvider(),
])
// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'nftlender',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
})

const App: React.FC<{}> = (props) => {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        <div className="dark flex flex-col justify-between bg-black text-white min-h-screen gap-y-12">
          <Header />
          <div className='container mx-auto w-3/4 justify-self-start'>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="/manage" element={<Manage />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default App;
