import { Outlet } from "react-router-dom"
import { useDispatch } from "react-redux";
import { doGetAccountAction } from "./redux/account/accountSlice";
import { callFetchAccount } from "./services/apiUser/apiAuth";
import { useEffect, FC } from "react";
import { Box } from "@mui/material";
import EcommerceHeader from "./components/header/EcommerceHeader";
import EcommerceFooter from "./components/footer/EcommerceFooter";

import { useClientSideEffects } from "./hooks/useClientSideEffects"
import { useServerKeepAlive } from "./hooks/useServerKeepAlive";

const Layout = () => {
  return (
    <div className="layout-app">
      <Box display={"flex"} flexDirection={"column"} overflow={"hidden"}>
        <EcommerceHeader />
        <Outlet />
        <EcommerceFooter />
      </Box>
    </div>
  )
}

const App: FC = () => {
  const dispatch = useDispatch();

  // Keep-alive server chỉ chạy ở client-side
    useServerKeepAlive({
      onSuccess: () => console.log('[App] Server ping thành công'),
      onError: (error) => console.warn('[App] Server ping thất bại:', error.message)
    });

  const getAccount = async () => {
    if (typeof window !== 'undefined') {
      const res = await callFetchAccount();
      if (res && res.data) {
        dispatch(doGetAccountAction(res.data))
      }
    }
  }

  useEffect(() => {
    getAccount()
  }, [])

  useClientSideEffects();

  return null;
}

export { Layout };
export default App;
