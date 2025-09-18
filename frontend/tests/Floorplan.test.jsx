import { render, screen, fireEvent } from "@testing-library/react"
import Floorplan from "../src/Floorplan"
import "../src/css/Floorplan.css"
import { beforeEach, describe, expect, test, vi } from "vitest"
import userEvent from "@testing-library/user-event"

describe("Floorplan", () => {
    let container

    beforeEach(() => {
        container = render(<Floorplan />).container
    })

    test("floorplan is rendered correctly", () => {
        const room = container.querySelector("[data-room-id='A346']")
        expect(room).toBeInTheDocument()
    })
})
