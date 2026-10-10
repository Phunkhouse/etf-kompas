import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Slider } from './Slider'

function setup(value = 3000, onChange = vi.fn()) {
  render(
    <Slider
      label="Kolik měsíčně uložíte"
      value={value}
      min={500}
      max={20000}
      step={500}
      onChange={onChange}
      formatValue={(v) => `${v} Kč`}
    />,
  )
  return {
    onChange,
    slider: screen.getByRole('slider', { name: 'Kolik měsíčně uložíte' }),
  }
}

describe('Slider', () => {
  it('is a slider named by its label, with range and value', () => {
    const { slider } = setup()
    expect(slider.getAttribute('min')).toBe('500')
    expect(slider.getAttribute('max')).toBe('20000')
    expect(slider.getAttribute('step')).toBe('500')
    expect((slider as HTMLInputElement).value).toBe('3000')
  })

  it('reads the formatted value to screen readers', () => {
    const { slider } = setup()
    expect(slider.getAttribute('aria-valuetext')).toBe('3000 Kč')
  })

  it('shows the formatted value visually without announcing it twice', () => {
    setup()
    const visible = screen.getByText('3000 Kč')
    expect(visible.getAttribute('aria-hidden')).toBe('true')
  })

  it('reports the new value as a number', () => {
    const { slider, onChange } = setup()
    fireEvent.change(slider, { target: { value: '4500' } })
    expect(onChange).toHaveBeenCalledWith(4500)
  })

  it('sets the filled part of the track from the value', () => {
    const { slider } = setup(10250) // halfway between 500 and 20000
    expect(slider.style.getPropertyValue('--fill')).toBe('50%')
  })
})
