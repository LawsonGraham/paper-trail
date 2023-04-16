import { useNativeBalance } from "react-moralis";

function NativeBalance(props) {
  const { data: balance } = useNativeBalance(props);

  return <div style={{ textAlign: "center", whiteSpace: "nowrap" }}>{balance.formatted == null? "":"Bal: " + balance.formatted}</div>;
}

export default NativeBalance;
