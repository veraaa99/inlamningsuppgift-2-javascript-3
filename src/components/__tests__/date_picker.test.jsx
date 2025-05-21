import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { DatePicker } from '../date-picker'

describe("DatePicker", () => {
    
    it('Should render the same date passed as props (or Idag and Igår if date is today or yesterday)', () => {
        // ARRANGE
        render(<DatePicker date={new Date()}/>)

        // ACT
        const datePickerElement = screen.getByText("Idag")
        // const datePickerElement = screen.getByText(/Idag/i) // i = case Insensitive

        // ASSERT
        expect(datePickerElement).toBeInTheDocument()
    })
})
