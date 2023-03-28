import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToolsProvider } from './hooks/useTools/useTools';
import App from './App';
import './index.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <ToolsProvider>
      <App />
    </ToolsProvider>
  </BrowserRouter>
);
