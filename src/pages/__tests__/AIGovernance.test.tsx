import test from 'node:test'
import assert from 'node:assert/strict'
import { render, screen } from '@testing-library/react'
import AIGovernance from '../AIGovernance.jsx'

const renderPage = () => render(<AIGovernance />)

test('renders AI governance headline', () => {
  renderPage()
  assert.ok(screen.getByRole('heading', { level: 1, name: /ai governance/i }))
})

test('highlights human oversight metrics', () => {
  renderPage()
  assert.ok(screen.getByText(/human oversight/i))
})
