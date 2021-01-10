import Authpage from './componenets/auth/Authpage'
import { BrowserRouter, Route } from 'react-router-dom'
import Forgot from './componenets/auth/Forgot'
import SetMasterPass from './componenets/MasterPass/SetMasterPass'
import EnterPass from './componenets/MasterPass/EnterPass'
import Home from './componenets/Home/Home'
import Pass from './componenets/Passwords/Pass'
import Password from './componenets/Passwords/Password'
import Chatroom from './componenets/Chat/Chatroom'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Route path="/" exact component={Authpage}/>
        <Route path="/forgot" exact component={Forgot}/>
        <Route path="/setmasterpass" exact component={SetMasterPass}/>
        <Route path="/enterpass" exact component={EnterPass}/>
        <Route path="/home" exact component={Home}/>
        <Route path="/addpass" exact component={Pass}/>
        <Route path="/passwords" exact component={Password}/>
        <Route path="/chatroom" exact component={Chatroom}/>
      </div>
    </BrowserRouter>
  );
}

export default App;
