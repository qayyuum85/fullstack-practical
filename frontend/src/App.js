import React from 'react';
import Order from './components/order/Order';
import Header from './components/Header';

function App() {
  return (
    <div style={appStyle}>
      <Header></Header>
      <Order></Order>
    </div>
  );
}

const appStyle = {
  display:"grid",
  gridTemplateRows: "10vh 90vh"
}

export default App;
