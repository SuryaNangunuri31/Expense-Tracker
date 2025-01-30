import { useState } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import SignIn from './pages/auth/sign-in.jsx';
import SignUp from './pages/auth/sign-up.jsx';
import Dashboard from './pages/dashboard.jsx';
import Settings from './pages/settings.jsx';
import AccountPage from './pages/account-page.jsx';
import Transactions from './pages/transactions.jsx';

const RootLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <main>
      <div>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Navigate to ="/overview"/>}/>
            <Route path="/overview" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/account" element={<AccountPage />} />
          </Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </div>
    </main>
  );
}

export default App;
