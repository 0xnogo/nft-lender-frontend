import { configureChains, createClient, WagmiConfig, chain } from 'wagmi';

import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import './App.css';
import { Header } from './components/Header/Header';
import { Manage } from './pages/Manage/Manage';
import { Route, Routes } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Admin } from './pages/Admin/Admin';
import { Footer } from './components/UI/Footer/Footer';

// To hide before commit and push
const mainnetAnkrRPC: string = 'https://rpc.ankr.com/eth/TO_DEFINE'
const goerliAnkrRPC: string = 'https://rpc.ankr.com/eth_goerli/TO_DEFINE'

const { chains, provider, webSocketProvider } = configureChains(
  [chain.localhost], [
  jsonRpcProvider({
    rpc: (_chain) => {
      if (_chain.id === chain.mainnet.id) return { http: mainnetAnkrRPC }
      if (_chain.id === chain.goerli.id) return { http: goerliAnkrRPC }
      return { http: "http://localhost:8545" }
    },
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
    </WagmiConfig>
  );
}

export default App;
