import { Routes, Route, Link } from "react-router-dom"
import Floorplan from "../assets/exactum-3.svg?react"
import BulletinBoard from "./BulletinBoard"
import File from "./File"

const Menu = () => {
  const padding = {
    paddingRight: 5
  }

  return (
    <div>
      <div>
        <Link style={padding} to="/">floorplan</Link>
        <Link style={padding} to="/files">bulletin board</Link>
      </div>

      <Routes>
        <Route path="/" element={<Floorplan/> } />
        <Route path="/files" element={<BulletinBoard />} />
        <Route path="/files/:id" element={<File />} />
      </Routes>
    </div>
  )
}

export default Menu