import { Routes, Route, Link } from "react-router-dom"
import Floorplan from "../assets/exactum-3.svg?react"
import BulletinBoard from "./BulletinBoard"

const Menu = () => {
  const padding = {
    paddingRight: 5
  }

  return (
    <div>
      <div>
        <Link style={padding} to="/">floorplan</Link>
        <Link style={padding} to="/files">bulletin Board</Link>
      </div>

      <Routes>
        <Route path="/" element={<Floorplan/> } />
        <Route path="/files" element={<BulletinBoard />} />
      </Routes>
    </div>
  )
}

export default Menu