import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { DatePicker } from '../date-picker'

describe("DatePicker", () => {
    
    it(`Should render the text "Today" if the date passed as props is today`, () => {
        // ARRANGE
        render(<DatePicker date={new Date()}/>)

        // ACT
        const datePickerElement = screen.getByText("Today")

        // ASSERT
        expect(datePickerElement).toBeInTheDocument()
    })
})
